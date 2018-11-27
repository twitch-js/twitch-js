import { EventEmitter } from 'eventemitter3'
import { stringify } from 'qs'
import WebSocket from '../../shims/uws'

import createLogger from '../utils/logger/create'

import * as constants from './constants'
import baseParser from './utils/parsers'
import * as validators from './utils/validators'
import * as utils from './utils'

import * as Errors from './Errors'
import Queue from './Queue'

import { ChatOptions } from './index'

const priority = constants.CLIENT_PRIORITY

/**
 * @class
 * @private
 * @extends EventEmitter
 */
class Client extends EventEmitter {
  /** @property {any} pingTimer @private */
  pingTimer = null
  /** @property {any} reconnectTimer @private */
  reconnectTimer = null

  /** @param {ChatOptions} [maybeOptions={}] */
  constructor(maybeOptions = {}) {
    super()

    // Validate options.
    const options = validators.clientOptions(maybeOptions)

    const log = createLogger({ scope: 'Chat/Client', ...options.log })

    // Instantiate WebSocket.
    const protocol = options.ssl ? 'wss' : 'ws'
    const ws = new WebSocket(`${protocol}://${options.server}:${options.port}`)

    this.isReady = () => ws.readyState === 1

    ws.onopen = handleOpen.bind(this, options)
    ws.onmessage = handleMessage.bind(this, log, options)
    ws.onerror = handleError.bind(this)
    ws.onclose = handleClose.bind(this)

    // Instantiate Queue.
    const queue = new Queue()

    const elevatedContext = { self: this, log, ws, queue }

    this.send = this.send.bind(elevatedContext)
    this.disconnect = this.disconnect.bind(elevatedContext)
  }

  /**
   * Send message to Twitch
   * @function Client#send
   * @private
   * @param {string} message
   * @param {Object} options
   * @param {number} options.priority
   * @param {MessageWeightProps} ...options.weighProps
   * @return {Promise}
   */
  send(message, { priority, ...weighProps } = {}) {
    const fn = this.ws.send.bind(this.ws, message)

    this.log.debug('<', message)

    const task = this.queue.push({
      fn,
      priority,
      weight: utils.getMessageQueueWeight(weighProps),
    })

    return new Promise((resolve, reject) => {
      task.on('accepted', resolve).on('failed', reject)
    })
  }

  /**
   * @function Client#disconnect
   * @private
   */
  disconnect() {
    handleKeepAliveReset.call(this.self)
    this.ws.close()
  }
}

/**
 * @function handleOpen
 * @private
 * @param {object} options
 */
function handleOpen(options) {
  // Register for Twitch-specific capabilities.
  this.send(`CAP REQ :${constants.CAPABILITIES.join(' ')}`, { priority })

  // Authenticate.
  this.send(`PASS ${options.oauth}`, { priority })
  this.send(`NICK ${options.username}`, { priority })
}

/**
 * @function handleMessage
 * @private
 * @param {any} log
 * @param {ChatOptions} options
 * @param {object} messageEvent
 */
function handleMessage(log, options, messageEvent) {
  const rawMessage = messageEvent.data

  try {
    handleKeepAlive.call(this)

    const messages = baseParser(rawMessage)

    messages.forEach(message => {
      const event = message.command || ''

      log.debug(
        '> %s %s',
        event,
        JSON.stringify({ ...message, _raw: undefined }),
      )

      // Handle authentication failure.
      if (utils.isAuthenticationFailedMessage(message)) {
        this.emit(constants.EVENTS.AUTHENTICATION_FAILED, {
          ...message,
          event: constants.EVENTS.AUTHENTICATION_FAILED,
        })

        this.disconnect()
      } else {
        // Handle PING/PONG.
        if (message.command === constants.COMMANDS.PING) {
          this.send('PONG :tmi.twitch.tv', { priority })
        }

        // Handle successful connections.
        if (utils.isUserAnonymous(options.username)) {
          if (message.command === constants.COMMANDS.WELCOME) {
            this.emit(constants.EVENTS.CONNECTED, {
              command: constants.EVENTS.CONNECTED,
            })
          }
        } else {
          if (message.command === constants.COMMANDS.GLOBAL_USER_STATE) {
            this.emit(constants.EVENTS.CONNECTED, {
              ...message,
              command: constants.EVENTS.CONNECTED,
            })
          }
        }

        // Handle RECONNECT.
        if (message.command === constants.COMMANDS.RECONNECT) {
          this.emit(constants.EVENTS.RECONNECT, {
            ...message,
            command: constants.EVENTS.RECONNECT,
          })
        }
      }

      // Emit all messages.
      this.emit(constants.EVENTS.ALL, message)
    })
  } catch (error) {
    const title = 'Parsing error encountered'
    const query = stringify({ title, body: rawMessage })
    log.error(
      'Parsing error encountered. Please create an issue: %s',
      `https://github.com/twitch-devs/twitch-js/issues/new?${query}`,
      error,
    )

    const message = new Errors.ParseError(error, rawMessage)

    this.emit(message.command, message)
    this.emit(constants.EVENTS.ALL, message)
    throw message
  } finally {
    const message = {
      _raw: rawMessage,
      timestamp: new Date(),
    }

    this.emit(constants.EVENTS.RAW, message)
  }
}

/**
 * @function handleError
 * @private
 * @param {object} messageEvent
 */
function handleError(messageEvent) {
  const message = {
    timestamp: new Date(),
    event: constants.EVENTS.ERROR_ENCOUNTERED,
    messageEvent,
  }

  this.emit(constants.EVENTS.ERROR_ENCOUNTERED, message)
  this.emit(constants.EVENTS.ALL, message)
}

/**
 * @function handleClose
 * @private
 * @param {object} messageEvent
 */
function handleClose(messageEvent) {
  const message = {
    timestamp: new Date(),
    event: constants.EVENTS.DISCONNECTED,
    messageEvent,
  }

  this.emit(constants.EVENTS.DISCONNECTED, message)
  this.emit(constants.EVENTS.ALL, message)
}

/**
 * @function handleKeepAlive
 * @private
 */
function handleKeepAlive() {
  handleKeepAliveReset.call(this)

  if (this.isReady()) {
    this.pingTimer = setTimeout(
      () => this.send(constants.COMMANDS.PING, { priority }),
      constants.KEEP_ALIVE_PING_TIMEOUT,
    )
  }

  this.reconnectTimer = setTimeout(
    () => this.emit(constants.EVENTS.RECONNECT, {}),
    constants.KEEP_ALIVE_RECONNECT_TIMEOUT,
  )
}

/**
 * @function handleKeepAliveReset
 * @private
 */
function handleKeepAliveReset() {
  clearTimeout(this.pingTimer)
  clearTimeout(this.reconnectTimer)
  this.pingTimer = null
  this.reconnectTimer = null
}

export default Client
