import { EventEmitter } from 'eventemitter3'
import WebSocket from '../../shims/uws'

import * as constants from './constants'
import baseParser from './utils/parsers'
import * as validators from './utils/validators'
import * as utils from './utils'

import * as Errors from './Errors'
import Queue from './Queue'

const priority = constants.CLIENT_PRIORITY

class Client extends EventEmitter {
  pingTimer = null
  reconnectTimer = null

  constructor(maybeOptions = {}) {
    super()

    // Validate options.
    const options = validators.clientOptions(maybeOptions)

    // Instantiate WebSocket.
    const protocol = options.ssl ? 'wss' : 'ws'
    const ws = new WebSocket(`${protocol}://${options.server}:${options.port}`)

    this.isReady = () => ws.readyState === 1

    ws.onopen = handleOpen.bind(this, options)
    ws.onmessage = handleMessage.bind(this)
    ws.onerror = handleError.bind(this)
    ws.onclose = handleClose.bind(this)

    // Instantiate Queue.
    const queue = new Queue()

    const elevatedContext = { self: this, ws, queue }

    this.send = this.send.bind(elevatedContext)
    this.disconnect = this.disconnect.bind(elevatedContext)
  }

  /**
   * Send message to Twitch
   * @param {string} message
   * @param {Object} options
   * @param {number} options.priority
   * @param {MessageWeightProps} ...options.weighProps
   */
  send(message, { priority, ...weighProps } = {}) {
    const fn = this.ws.send.bind(this.ws, message)

    const task = this.queue.push({
      fn,
      priority,
      weight: utils.getMessageQueueWeight(weighProps),
    })

    return new Promise((resolve, reject) => {
      task.on('accepted', resolve).on('failed', reject)
    })
  }

  disconnect() {
    handleKeepAliveReset.call(this.self)
    this.ws.close()
  }
}

function handleOpen(options) {
  // Register for Twitch-specific capabilities.
  this.send(`CAP REQ :${constants.CAPABILITIES.join(' ')}`, { priority })

  // Authenticate.
  this.send(`PASS ${options.oauth}`, { priority })
  this.send(`NICK ${options.username}`, { priority })
}

function handleMessage(messageEvent) {
  const rawMessage = messageEvent.data

  try {
    handleKeepAlive.call(this)

    const messages = baseParser(rawMessage)

    messages.forEach(message => {
      // Handle PING/PONG.
      if (message.command === constants.COMMANDS.PING) {
        this.send('PONG :tmi.twitch.tv', { priority })
      }

      // Handle successful connections.
      if (message.command === constants.COMMANDS.GLOBAL_USER_STATE) {
        this.emit(constants.EVENTS.CONNECTED, {
          ...message,
          command: constants.EVENTS.CONNECTED,
        })
      }

      // Handle authentication failure.
      if (utils.isAuthenticationFailedMessage(message)) {
        this.emit(constants.EVENTS.AUTHENTICATION_FAILED, {
          ...message,
          event: constants.EVENTS.AUTHENTICATION_FAILED,
        })
        this.disconnect()
      }

      // Handle RECONNECT.
      if (message.command === constants.COMMANDS.RECONNECT) {
        this.emit(constants.EVENTS.RECONNECT, {
          ...message,
          command: constants.EVENTS.RECONNECT,
        })
      }

      // Emit all messages.
      this.emit(constants.EVENTS.ALL, message)
    })
  } catch (error) {
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

function handleError(messageEvent) {
  const message = {
    timestamp: new Date(),
    event: constants.EVENTS.ERROR_ENCOUNTERED,
    messageEvent,
  }

  this.emit(constants.EVENTS.ALL, message)
}

function handleClose(messageEvent) {
  const message = {
    timestamp: new Date(),
    event: constants.EVENTS.DISCONNECTED,
    messageEvent,
  }

  this.emit(constants.EVENTS.ALL, message)
}

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

function handleKeepAliveReset() {
  clearTimeout(this.pingTimer)
  clearTimeout(this.reconnectTimer)
  this.pingTimer = null
  this.reconnectTimer = null
}

export default Client
