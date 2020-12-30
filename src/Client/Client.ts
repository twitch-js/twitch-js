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

import { ClientOptions, ClientEvents, ClientEventTypes } from './types'

class Client extends EventEmitter<
  ClientEventTypes & {
    [eventName: string]: [BaseMessage]
  }
> {
  private _options: ClientOptions
  private _log: Logger

  private _ws: WebSocket

  private _queueJoin: Queue
  private _queueAuthenticate: Queue
  private _queue: Queue
  private _moderatorQueue?: Queue

  private _heartbeatTimeoutId?: NodeJS.Timeout
  private _reconnectTimeoutId?: NodeJS.Timeout

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

  isReady() {
    return this._ws.readyState === 1
  }

  /**
   * Send message to Twitch
   */
  async send(
    message: string,
    options?: Partial<{
      priority: number
      isModerator: boolean
    }>,
  ) {
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
      this._log.trace(`< ${message}`)
    } catch (error) {
      this._log.error(`< ${message}`)
    }
  }

  disconnect() {
    this._queueAuthenticate.pause()
    this._queueJoin.pause()
    this._queue.pause()
    this._moderatorQueue?.pause()
    // @ts-expect-error clean up p-queue
    clearTimeout(this._queueAuthenticate._timeoutId)
    // @ts-expect-error clean up p-queue
    clearTimeout(this._queueJoin._timeoutId)
    // @ts-expect-error clean up p-queue
    clearTimeout(this._queue._timeoutId)
    // @ts-expect-error clean up p-queue
    clearTimeout(this._moderatorQueue?._timeoutId)

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
    }
    this.send(`NICK ${username}`, { priority })

    this._handleHeartbeat()
  }

  private _handleMessage(messageEvent: WebSocket.MessageEvent) {
    const rawMessage = messageEvent.data.toString()
    this._log.trace(`> ${rawMessage.trim()}`)

    const { token, username } = this._options
    const priority = this._clientPriority

    this._handleHeartbeat()

    let messages: BaseMessage[] = []

    try {
      messages = baseParser(rawMessage, this._options.username)
    } catch (error) {
      /**
       * Catch errors while parsing raw messages into base messages.
       */
      this._log.error(
        '\n' +
          'An error occurred while attempting to parse a message from ' +
          'Twitch. Please use the following stack trace and raw message to ' +
          'resolve the bug in the TwitchJS source code, and then issue a ' +
          'pull request at https://github.com/twitch-js/twitch-js/compare\n' +
          '\n' +
          'Stack trace:\n' +
          `${error}\n` +
          '\n' +
          'Raw message:\n' +
          rawMessage,
      )
      this.emit(ClientEvents.ERROR_ENCOUNTERED, error)
    }

    messages.forEach((message) => {
      const event = message.command || ''

      this._log.debug({ ...message, _raw: undefined }, '> %s', event)

      // Handle authentication failure.
      if (utils.isAuthenticationFailedMessage(message)) {
        this._multiEmit(
          [ClientEvents.ALL, ClientEvents.AUTHENTICATION_FAILED],
          {
            ...message,
            event: ClientEvents.AUTHENTICATION_FAILED,
          },
        )

        this.disconnect()
      } else {
        if (message.command === Commands.PING) {
          // Handle PING/PONG.
          this.send('PONG :tmi.twitch.tv', { priority })
        } else if (!token && message.command === Commands.WELCOME) {
          // Handle successful connections without authentications.
          this._multiEmit([ClientEvents.ALL, ClientEvents.CONNECTED], {
            ...message,
            event: ClientEvents.CONNECTED,
          })
        } else if (message.command === Commands.GLOBALUSERSTATE) {
          // Handle successful authentications.
          this._multiEmit([ClientEvents.ALL, ClientEvents.GLOBALUSERSTATE], {
            ...message,
            event: ClientEvents.GLOBALUSERSTATE,
          })
          if (token && username) {
            this._multiEmit([ClientEvents.ALL, ClientEvents.CONNECTED], {
              ...message,
              event: ClientEvents.CONNECTED,
            })
          }
        } else if (message.command === Commands.RECONNECT) {
          // Handle RECONNECT.
          this._multiEmit([ClientEvents.ALL, ClientEvents.RECONNECT], {
            ...message,
            event: ClientEvents.RECONNECT,
          })
        } else {
          this.emit(ClientEvents.ALL, message)
        }
      }
    })

    this.emit(ClientEvents.RAW, rawMessage)
  }

  private _handleError(errorEvent: WebSocket.ErrorEvent) {
    this._log.error(errorEvent)
  }

  private _handleClose(_closeEvent: WebSocket.CloseEvent) {
    this.emit(ClientEvents.DISCONNECTED)
  }

  private _handleHeartbeat() {
    this._handleHeartbeatReset()

    const priority = this._clientPriority

    // Send PING ...
    this._heartbeatTimeoutId = setTimeout(() => {
      this.send(Commands.PING, { priority })
    }, constants.KEEP_ALIVE_PING_TIMEOUT)

    // ... and if the heart beat fails, emit RECONNECT event.
    this._reconnectTimeoutId = setTimeout(() => {
      this.emit(ClientEvents.RECONNECT)
    }, constants.KEEP_ALIVE_PING_TIMEOUT + 1000)
  }

  private _handleHeartbeatReset() {
    if (this._heartbeatTimeoutId) {
      clearTimeout(this._heartbeatTimeoutId)
    }
    if (this._reconnectTimeoutId) {
      clearTimeout(this._reconnectTimeoutId)
    }
  }

  private _multiEmit(
    event: ClientEvents | ClientEvents[],
    message: BaseMessage,
  ) {
    if (Array.isArray(event)) {
      event.forEach((eventName) => this.emit(eventName, message))
    } else {
      this.emit(event, message)
    }
  }
}

export default Client
