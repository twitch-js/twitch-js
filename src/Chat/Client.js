import { EventEmitter } from 'eventemitter3'
import WebSocket from '../../shims/uws'

import * as constants from './constants'
import baseParser from './utils/parsers'
import * as validators from './utils/validators'
import * as utils from './utils'

import * as errors from './Errors'
import Queue from './Queue'

const priority = constants.CLIENT_PRIORITY

class Client extends EventEmitter {
  readyState

  pingTimer = null
  reconnectTimer = null

  constructor(maybeOptions = {}) {
    super()

    // Validate options.
    const options = validators.clientOptions(maybeOptions)

    // Instantiate WebSocket.
    const protocol = options.ssl ? 'wss' : 'ws'
    const ws = new WebSocket(`${protocol}://${options.server}:${options.port}`)

    ws.onopen = handleOpen.bind(this, options)
    ws.onmessage = handleMessage.bind(this)
    ws.onerror = handleError.bind(this)
    ws.onclose = handleClose.bind(this)

    // Instantiate Queue.
    const queue = new Queue()

    this.readyState = ws.readyState
    this.send = this.send.bind({ ws, queue })
    this.disconnect = this.disconnect.bind({ ws })
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

    this.queue.push({
      fn,
      priority,
      weight: utils.getMessageQueueWeight(weighProps),
    })
  }

  disconnect() {
    handleKeepAliveReset.call(this)
    this.ws.close()
  }
}

function handleOpen(options) {
  // Register for Twitch-specific capabilities.
  this.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership', {
    priority,
  })

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

      // Handle RECONNECT.
      if (message.command === constants.COMMANDS.RECONNECT) {
        this.emit(constants.EVENTS.RECONNECT, {
          ...message,
          command: constants.EVENTS.RECONNECT,
        })
      }

      // Handle authentication failure
      if (utils.isAuthenticationFailedMessage(message)) {
        throw new errors.AuthenticationError(message)
      }

      // Emit all messages.
      this.emit(constants.EVENTS.ALL, message)
    })
  } catch (error) {
    const message = parseMessageError(error, rawMessage)

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

function parseMessageError(error, raw) {
  if (error instanceof errors.AuthenticationError) {
    return error
  }

  return new errors.ParseError(error, raw)
}

function handleError(error) {
  const message = {
    timestamp: new Date(),
    event: constants.EVENTS.ERROR_ENCOUNTERED,
    message: error,
  }

  this.emit(constants.EVENTS.ALL, message)
  this.emit(constants.EVENTS.ERROR_ENCOUNTERED, message)
}

function handleClose() {
  const message = {
    timestamp: new Date(),
    event: constants.EVENTS.DISCONNECTED,
  }

  this.emit(constants.EVENTS.DISCONNECTED, message)
}

function handleKeepAlive() {
  handleKeepAliveReset.call(this)

  if (this.readyState === 2) {
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
