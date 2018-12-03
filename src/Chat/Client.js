import { EventEmitter } from 'eventemitter3'
import { get } from 'lodash'
import { stringify } from 'qs'
import WebSocket from '../../shims/uws'

import Queue from '../Queue'

import createLogger from '../utils/logger/create'

import * as constants from './constants'
import baseParser from './utils/parsers'
import * as validators from './utils/validators'
import * as utils from './utils'

import * as Errors from './Errors'

const priority = constants.CLIENT_PRIORITY

class Client extends EventEmitter {
  _options
  _log

  _ws
  _queue

  _pingTimeoutId = -1
  _reconnectTimeoutId = -1

  constructor(maybeOptions = {}) {
    super()

    // Validate options.
    this._options = validators.clientOptions(maybeOptions)
    const { ssl, server, port, log } = this._options

    this._log = createLogger({ scope: 'Chat/Client', ...log })

    // Instantiate WebSocket.
    const protocol = ssl ? 'wss' : 'ws'
    this._ws = new WebSocket(`${protocol}://${server}:${port}`)

    this._ws.onopen = this._handleOpen.bind(this)
    this._ws.onmessage = this._handleMessage.bind(this)
    this._ws.onerror = this._handleError.bind(this)
    this._ws.onclose = this._handleClose.bind(this)

    // Instantiate Queue.
    this._queue = this._createQueue(this._options)
    this._moderatorQueue = this._options.isVerified
      ? this._queue
      : this._createQueue({ isModerator: true })
  }

  isReady = () => get(this, '_ws.readyState') === 1

  /**
   * Send message to Twitch
   * @param {string} message
   * @param {Object} options
   * @param {number} options.priority
   * @param {boolean} options.isModerator
   */
  send = (message, { priority = 1, isModerator } = {}) => {
    const fn = this._ws.send.bind(this._ws, message)

    const queue = isModerator ? this._moderatorQueue : this._queue

    const task = queue.push({ fn, priority })

    return new Promise((resolve, reject) =>
      task
        .on('accepted', () => {
          resolve()
          this._log.debug('<', message)
        })
        .on('failed', () => {
          reject()
          this._log.error('<', message)
        }),
    )
  }

  disconnect = () => {
    this._handleKeepAliveReset()
    this._ws.close()
  }

  _createQueue({ isModerator, isVerified, isKnown }) {
    if (isModerator) {
      return new Queue({ maxLength: constants.RATE_LIMIT_MODERATOR })
    } else if (isVerified) {
      return new Queue({ maxLength: constants.RATE_LIMIT_VERIFIED_BOT })
    } else if (isKnown) {
      return new Queue({ maxLength: constants.RATE_LIMIT_KNOWN_BOT })
    }
    return new Queue()
  }

  _isUserAnonymous() {
    return utils.isUserAnonymous(get(this, '_options.username'))
  }

  _handleOpen() {
    // Register for Twitch-specific capabilities.
    this.send(`CAP REQ :${constants.CAPABILITIES.join(' ')}`, { priority })

    // Authenticate.
    const { token, username } = this._options
    this.send(`PASS ${token}`, { priority })
    this.send(`NICK ${username}`, { priority })
  }

  _handleMessage(messageEvent) {
    const rawMessage = messageEvent.data

    try {
      this._handleKeepAlive()

      const messages = baseParser(rawMessage)

      messages.forEach(message => {
        const event = message.command || ''

        this._log.debug(
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
          if (this._isUserAnonymous()) {
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
      this._log.error(
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

  _handleError(messageEvent) {
    const message = {
      timestamp: new Date(),
      event: constants.EVENTS.ERROR_ENCOUNTERED,
      messageEvent,
    }

    this.emit(constants.EVENTS.ERROR_ENCOUNTERED, message)
    this.emit(constants.EVENTS.ALL, message)
  }

  _handleClose(messageEvent) {
    const message = {
      timestamp: new Date(),
      event: constants.EVENTS.DISCONNECTED,
      messageEvent,
    }

    this.emit(constants.EVENTS.DISCONNECTED, message)
    this.emit(constants.EVENTS.ALL, message)
  }

  _handleKeepAlive() {
    this._handleKeepAliveReset()

    if (this.isReady()) {
      this._pingTimeoutId = setTimeout(
        () => this.send(constants.COMMANDS.PING, { priority }),
        constants.KEEP_ALIVE_PING_TIMEOUT,
      )
    }

    this._reconnectTimeoutId = setTimeout(
      () => this.emit(constants.EVENTS.RECONNECT, {}),
      constants.KEEP_ALIVE_RECONNECT_TIMEOUT,
    )
  }

  _handleKeepAliveReset() {
    clearTimeout(this._pingTimeoutId)
    clearTimeout(this._reconnectTimeoutId)
    this._pingTimeoutId = -1
    this._reconnectTimeoutId = -1
  }
}

export default Client
