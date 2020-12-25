import EventEmitter from 'eventemitter3'
import WebSocket from 'ws'
import Queue from 'p-queue'

import { stringify } from 'qs'

import { Commands, Capabilities, BaseMessage } from '../twitch'

import createLogger, { Logger } from '../utils/logger'

import * as constants from './constants'
import baseParser from './utils/parsers'
import * as validators from './utils/validators'
import * as utils from './utils'

import * as Errors from './Errors'

import { ClientOptions, ClientEvents } from './types'

class Client extends EventEmitter<Record<ClientEvents, BaseMessage>> {
  private _options: ClientOptions
  private _log: Logger

  private _ws: WebSocket

  private _queueJoin: Queue
  private _queueAuthenticate: Queue
  private _queue: Queue
  private _moderatorQueue?: Queue

  private _heartbeatTimeoutId?: NodeJS.Timeout

  private _clientPriority = 100

  constructor(options: Partial<ClientOptions>) {
    super()

    // Validate options.
    this._options = validators.clientOptions(options)
    const { ssl, server, port, log } = this._options

    this._log = createLogger({ name: 'Chat/Client', ...log })

    // Instantiate WebSocket.
    const protocol = ssl ? 'wss' : 'ws'
    this._ws = new WebSocket(`${protocol}://${server}:${port}`)

    this._ws.onopen = this._handleOpen.bind(this)
    this._ws.onmessage = this._handleMessage.bind(this)
    this._ws.onerror = this._handleError.bind(this)
    this._ws.onclose = this._handleClose.bind(this)

    // Instantiate Queues.
    // See https://dev.twitch.tv/docs/irc/guide#command--message-limits
    this._queueAuthenticate = this._options.isVerified
      ? new Queue({ intervalCap: 200, interval: 10000 })
      : new Queue({ intervalCap: 20, interval: 10000 })
    this._queueJoin = this._options.isVerified
      ? new Queue({ intervalCap: 2000, interval: 10000 })
      : new Queue({ intervalCap: 20, interval: 10000 })
    this._queue = new Queue({ intervalCap: 20, interval: 30000 })
    this._moderatorQueue = new Queue({ intervalCap: 100, interval: 30000 })
  }

  isReady = () => this._ws.readyState === 1

  /**
   * Send message to Twitch
   */
  send = async (
    message: string,
    options?: Partial<{
      priority: number
      isModerator: boolean
    }>,
  ) => {
    try {
      const { priority, isModerator } = {
        priority: 0,
        isModerator: false,
        ...options,
      }

      const queue = message.startsWith('JOIN')
        ? this._queueJoin
        : message.startsWith('PASS')
        ? this._queueAuthenticate
        : isModerator && this._moderatorQueue
        ? this._moderatorQueue
        : this._queue

      await queue.add(() => this._ws.send(message), { priority })
      this._log.debug('<', message)
    } catch (error) {
      this._log.error('<', message)
    }
  }

  disconnect = () => {
    this._handleHeartbeatReset()
    this._ws.close()
  }

  private _handleOpen() {
    const priority = this._clientPriority

    // Register for Twitch-specific capabilities.
    this.send(`CAP REQ :${Object.values(Capabilities).join(' ')}`, { priority })

    // Authenticate.
    const { token, username } = this._options
    if (token && username) {
      this.send(`PASS ${token}`, { priority })
      this.send(`NICK ${username}`, { priority })
    }

    this._handleHeartbeat()
  }

  private _handleMessage(messageEvent: WebSocket.MessageEvent) {
    const rawMessage = messageEvent.data.toString()
    const priority = this._clientPriority

    this._handleHeartbeat()

    try {
      const messages = baseParser(rawMessage, this._options.username)

      messages.forEach((message) => {
        const event = message.command || ''

        this._log.debug(
          '> %s %s',
          event,
          JSON.stringify({ ...message, _raw: undefined }),
        )

        // Handle authentication failure.
        if (utils.isAuthenticationFailedMessage(message)) {
          this.emit(ClientEvents.AUTHENTICATION_FAILED, {
            ...message,
            event: ClientEvents.AUTHENTICATION_FAILED,
          })

          this.disconnect()
        } else {
          // Handle PING/PONG.
          if (message.command === Commands.PING) {
            this.send('PONG :tmi.twitch.tv', { priority })
          }

          // Handle successful connections.
          if (message.command === Commands.WELCOME) {
            this.emit(ClientEvents.CONNECTED, {
              ...message,
              event: ClientEvents.CONNECTED,
            })
          }

          // Handle successful authentications.
          if (message.command === Commands.GLOBALUSERSTATE) {
            this.emit(ClientEvents.AUTHENTICATED, {
              ...message,
              event: ClientEvents.AUTHENTICATED,
            })
            this.emit(ClientEvents.GLOBALUSERSTATE, {
              ...message,
              event: ClientEvents.GLOBALUSERSTATE,
            })
          }

          // Handle RECONNECT.
          if (message.command === Commands.RECONNECT) {
            this.emit(ClientEvents.RECONNECT, {
              ...message,
              event: ClientEvents.RECONNECT,
            })
          }
        }

        // Emit all messages.
        this.emit(ClientEvents.ALL, message)
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

      this.emit(ClientEvents.PARSE_ERROR_ENCOUNTERED, errorMessage)
      this.emit(ClientEvents.ALL, errorMessage)
      throw errorMessage
    } finally {
      this.emit(ClientEvents.RAW, rawMessage)
    }
  }

  private _handleError(errorEvent: WebSocket.ErrorEvent) {
    this.emit(ClientEvents.ERROR_ENCOUNTERED, errorEvent)
  }

  private _handleClose(closeEvent: WebSocket.CloseEvent) {
    this.emit(ClientEvents.DISCONNECTED, closeEvent)
  }

  private _handleHeartbeat = () => {
    this._handleHeartbeatReset()

    const priority = this._clientPriority

    this._heartbeatTimeoutId = setTimeout(() => {
      this.send(Commands.PING, { priority })
    }, constants.KEEP_ALIVE_PING_TIMEOUT)
  }

  private _handleHeartbeatReset = () => {
    if (this._heartbeatTimeoutId) {
      clearTimeout(this._heartbeatTimeoutId)
    }
  }
}

export default Client
