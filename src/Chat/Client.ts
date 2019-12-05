import EventEmitter from 'eventemitter3'
import get from 'lodash/get'
import { stringify } from 'qs'
import WebSocket from 'ws'

import { ChatEvents, Commands, Capabilities } from '../twitch'

import Queue from '../Queue'

import createLogger, { Logger } from '../utils/logger'

import * as constants from './constants'
import baseParser from './utils/parsers'
import * as validators from './utils/validators'
import * as utils from './utils'

import * as Errors from './Errors'

import { ClientOptions } from './types'

type SendOptions = { priority?: number; isModerator?: boolean }

const priority = constants.CLIENT_PRIORITY

class Client extends EventEmitter {
  private _options: ClientOptions
  private _log: Logger

  private _ws: WebSocket

  private _queue: Queue
  private _moderatorQueue: Queue

  private _pingTimeoutId: NodeJS.Timeout
  private _reconnectTimeoutId: NodeJS.Timeout

  constructor(maybeOptions: ClientOptions) {
    super()

    // Validate options.
    this._options = validators.clientOptions(maybeOptions)
    const { ssl, server, port, log } = this._options

    this._log = createLogger({ name: 'Chat/Client', ...log })

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
   */
  send = async (
    message: string,
    { priority = 1, isModerator = false }: SendOptions = {},
  ) => {
    try {
      const fn = this._ws.send.bind(this._ws, message)

      const queue = isModerator ? this._moderatorQueue : this._queue

      await queue.push({ fn, priority })
      this._log.debug('<', message)
    } catch (error) {
      this._log.error('<', message)
    }
  }

  disconnect = () => {
    this._handleKeepAliveReset()
    this._ws.close()
  }

  private _createQueue({
    isModerator = false,
    isVerified = false,
    isKnown = false,
  }: {
    isModerator?: boolean
    isVerified?: boolean
    isKnown?: boolean
  }) {
    if (isModerator) {
      return new Queue({ intervalCap: constants.RATE_LIMIT_MODERATOR })
    } else if (isVerified) {
      return new Queue({ intervalCap: constants.RATE_LIMIT_VERIFIED_BOT })
    } else if (isKnown) {
      return new Queue({ intervalCap: constants.RATE_LIMIT_KNOWN_BOT })
    }
    return new Queue()
  }

  private _isUserAnonymous() {
    return utils.isUserAnonymous(get(this, '_options.username'))
  }

  private _handleOpen() {
    // Register for Twitch-specific capabilities.
    this.send(`CAP REQ :${Object.values(Capabilities).join(' ')}`, { priority })

    // Authenticate.
    const { token, username } = this._options
    this.send(`PASS ${token}`, { priority })
    this.send(`NICK ${username}`, { priority })
  }

  private _handleMessage(messageEvent: WebSocket.MessageEvent) {
    const rawMessage = messageEvent.data.toString()

    try {
      this._handleKeepAlive()

      const messages = baseParser(rawMessage, this._options.username)

      messages.forEach(message => {
        const event = message.command || ''

        this._log.debug(
          '> %s %s',
          event,
          JSON.stringify({ ...message, _raw: undefined }),
        )

        // Handle authentication failure.
        if (utils.isAuthenticationFailedMessage(message)) {
          this.emit(ChatEvents.AUTHENTICATION_FAILED, {
            ...message,
            event: ChatEvents.AUTHENTICATION_FAILED,
          })

          this.disconnect()
        } else {
          // Handle PING/PONG.
          if (message.command === Commands.PING) {
            this.send('PONG :tmi.twitch.tv', { priority })
          }

          // Handle successful connections.
          if (this._isUserAnonymous()) {
            if (message.command === Commands.WELCOME) {
              this.emit(ChatEvents.CONNECTED, {
                ...message,
                event: ChatEvents.CONNECTED,
              })
            }
          } else {
            if (message.command === Commands.GLOBAL_USER_STATE) {
              this.emit(ChatEvents.CONNECTED, {
                ...message,
                event: ChatEvents.CONNECTED,
              })
            }
          }

          // Handle RECONNECT.
          if (message.command === Commands.RECONNECT) {
            this.emit(ChatEvents.RECONNECT, {
              ...message,
              event: ChatEvents.RECONNECT,
            })
          }
        }

        // Emit all messages.
        this.emit(ChatEvents.ALL, message)
      })
    } catch (error) {
      const title = 'Parsing error encountered'
      const query = stringify({ title, body: rawMessage })
      this._log.error(
        'Parsing error encountered. Please create an issue: %s',
        `https://github.com/twitch-js/twitch-js/issues/new?${query}`,
        error,
      )

      const errorMessage = new Errors.ParseError(error, rawMessage)

      this.emit(errorMessage.command, errorMessage)
      this.emit(ChatEvents.ALL, errorMessage)
      throw errorMessage
    } finally {
      const message = {
        _raw: rawMessage,
        timestamp: new Date(),
      }

      this.emit(ChatEvents.RAW, message)
    }
  }

  private _handleError(messageEvent: WebSocket.ErrorEvent) {
    const message = {
      timestamp: new Date(),
      event: ChatEvents.ERROR_ENCOUNTERED,
      messageEvent,
    }

    this.emit(ChatEvents.ERROR_ENCOUNTERED, message)
    this.emit(ChatEvents.ALL, message)
  }

  private _handleClose(messageEvent: WebSocket.CloseEvent) {
    const message = {
      timestamp: new Date(),
      event: ChatEvents.DISCONNECTED,
      messageEvent,
    }

    this.emit(ChatEvents.DISCONNECTED, message)
    this.emit(ChatEvents.ALL, message)
  }

  private _handleKeepAlive() {
    this._handleKeepAliveReset()

    if (this.isReady()) {
      this._pingTimeoutId = setTimeout(
        () => this.send(Commands.PING, { priority }),
        constants.KEEP_ALIVE_PING_TIMEOUT,
      )
    }

    this._reconnectTimeoutId = setTimeout(
      () => this.emit(ChatEvents.RECONNECT, {}),
      constants.KEEP_ALIVE_RECONNECT_TIMEOUT,
    )
  }

  private _handleKeepAliveReset() {
    clearTimeout(this._pingTimeoutId)
    clearTimeout(this._reconnectTimeoutId)
    this._pingTimeoutId = undefined
    this._reconnectTimeoutId = undefined
  }
}

export default Client
