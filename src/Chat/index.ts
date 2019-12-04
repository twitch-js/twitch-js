/**
 * EventEmitter3 is a high performance EventEmitter
 * @external EventEmitter3
 * @see {@link https://github.com/primus/eventemitter3 EventEmitter3}
 */

import EventEmitter from 'eventemitter3'

import get from 'lodash/get'

import {
  GlobalUserStateMessage,
  UserStateMessage,
  RoomStateMessage,
  Events,
  Commands,
  Messages,
  BaseMessage,
} from '../twitch'

import createLogger, { Logger } from '../utils/logger'

import * as utils from '../utils'
import * as chatUtils from './utils'

import Client from './Client'
import ChatError, * as Errors from './Errors'

import * as constants from './constants'
import * as commands from './utils/commands'
import * as parsers from './utils/parsers'
import * as sanitizers from './utils/sanitizers'
import * as validators from './utils/validators'

import * as types from './types'

export * from './types'

/**
 * Twitch Chat Client
 *
 * @example <caption>Connecting to Twitch and joining #dallas</caption>
 *
 * ```
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const username = 'ronni'
 * const channel = '#dallas'
 * const { chat } = new TwitchJs({ token, username })
 *
 * chat.connect().then(globalUserState => {
 *   // Listen to all messages
 *   chat.on('*', message => {
 *     // Do stuff with message ...
 *   })
 *
 *   // Listen to PRIVMSG
 *   chat.on('PRIVMSG', privateMessage => {
 *     // Do stuff with privateMessage ...
 *   })
 *
 *   // Do other stuff ...
 *
 *   chat.join(channel).then(channelState => {
 *     // Do stuff with channelState...
 *   })
 * })
 * ```
 */
class Chat extends EventEmitter<types.EventTypes> {
  private _options: types.Options

  private _log: Logger

  private _client: Client

  private _readyState = 0

  private _connectionAttempts = 0
  private _connectionInProgress: Promise<GlobalUserStateMessage>

  private _userState: UserStateMessage
  private _channelState: types.ChannelStates = {}

  private _isDisconnecting = false

  /**
   * Chat constructor.
   */
  constructor(maybeOptions: types.Options) {
    super()

    this.options = maybeOptions

    // Create logger.
    this._log = createLogger({ name: 'Chat', ...this.options.log })

    // Create commands.
    Object.assign(this, commands.factory(this))
  }

  /**
   * Retrieves the current options
   */
  get options() {
    return this._options
  }

  /**
   * Validates the passed options before changing `_options`
   */
  set options(maybeOptions) {
    this._options = validators.chatOptions(maybeOptions)
  }

  /**
   * Connect to Twitch.
   */
  connect = () => {
    this._isDisconnecting = false

    if (this._connectionInProgress) {
      return this._connectionInProgress
    }

    this._connectionInProgress = Promise.race([
      utils.rejectAfter(
        this.options.connectionTimeout,
        new Errors.TimeoutError(constants.ERROR_CONNECT_TIMED_OUT),
      ),
      this._handleConnectionAttempt(),
    ])
      .then(this._handleConnectSuccess.bind(this))
      .catch(this._handleConnectRetry.bind(this))

    return this._connectionInProgress
  }

  /**
   * Updates the client options after instantiation.
   * To update `token` or `username`, use `reconnect()`.
   */
  updateOptions(options: Partial<types.Options>) {
    const { token, username } = this.options
    this.options = { ...options, token, username }
  }

  /**
   * Send a raw message to Twitch.
   */
  send: Client['send'] = (message, options) =>
    this._client.send(message, options)

  /**
   * Disconnected from Twitch.
   */
  disconnect = () => {
    this._isDisconnecting = true
    this._client.disconnect()
  }

  /**
   * Reconnect to Twitch, providing new options to the client.
   */
  reconnect = (newOptions?: types.Options) => {
    if (newOptions) {
      this.options = { ...this.options, ...newOptions }
    }

    this._connectionInProgress = null
    this._readyState = 2

    const channels = this._getChannels()
    this.disconnect()

    return this.connect().then(() =>
      Promise.all(channels.map(channel => this.join(channel))),
    )
  }

  /**
   * Join a channel.
   *
   * @example <caption>Joining #dallas</caption>
   * const channel = '#dallas'
   *
   * chat.join(channel).then(channelState => {
   *   // Do stuff with channelState...
   * })
   *
   * @example <caption>Joining multiple channels</caption>
   * const channels = ['#dallas', '#ronni']
   *
   * Promise.all(channels.map(channel => chat.join(channel)))
   *   .then(channelStates => {
   *     // Listen to all PRIVMSG
   *     chat.on('PRIVMSG', privateMessage => {
   *       // Do stuff with privateMessage ...
   *     })
   *
   *     // Listen to PRIVMSG from #dallas ONLY
   *     chat.on('PRIVMSG/#dallas', privateMessage => {
   *       // Do stuff with privateMessage ...
   *     })
   *     // Listen to all PRIVMSG from #ronni ONLY
   *     chat.on('PRIVMSG/#ronni', privateMessage => {
   *       // Do stuff with privateMessage ...
   *     })
   *   })
   */
  join = (maybeChannel: string) => {
    const channel = sanitizers.channel(maybeChannel)

    const joinProfiler = this._log.startTimer(`Joining ${channel}`)

    const connect = this.connect()
    const roomStateEvent = utils.resolveOnEvent<RoomStateMessage>(
      this,
      `${Commands.ROOM_STATE}/${channel}`,
    )
    const userStateEvent = !chatUtils.isUserAnonymous(this.options.username)
      ? utils.resolveOnEvent<UserStateMessage>(
          this,
          `${Commands.USER_STATE}/${channel}`,
        )
      : (Promise.resolve() as Promise<UserStateMessage | void>)

    const join = Promise.all([connect, roomStateEvent, userStateEvent]).then(
      ([, roomState, userState]) => {
        const channelState = {
          roomState: roomState.tags,
          userState: userState ? userState.tags : null,
        }

        this._setChannelState(roomState.channel, channelState)

        joinProfiler.done(`Joined ${channel}`)
        return channelState
      },
    )

    const send = this.send(`${Commands.JOIN} ${channel}`)

    return send.then(() =>
      Promise.race([
        utils.rejectAfter(
          this.options.joinTimeout,
          new Errors.TimeoutError(constants.ERROR_JOIN_TIMED_OUT),
        ),
        join,
      ]),
    )
  }

  /**
   * Depart from a channel.
   */
  part = (maybeChannel: string) => {
    const channel = sanitizers.channel(maybeChannel)
    this._log.info(`Parting ${channel}`)

    this._removeChannelState(channel)
    this.send(`${Commands.PART} ${channel}`)
  }

  /**
   * Send a message to a channel.
   */
  say = (maybeChannel: string, message: string, ...messageArgs: string[]) => {
    const channel = sanitizers.channel(maybeChannel)
    const args = messageArgs.length ? ['', ...messageArgs].join(' ') : ''

    const info = `PRIVMSG/${channel} :${message}${args}`

    const isModerator = get(this, ['_channelState', channel, 'isModerator'])

    // const timeout = utils.rejectAfter(
    //   this.options.joinTimeout,
    //   new Errors.TimeoutError(constants.ERROR_SAY_TIMED_OUT),
    // )

    const commandResolvers = commands.resolvers(this)(channel, message)

    const resolvers = () => Promise.race([...commandResolvers])

    return utils
      .resolveInSequence([
        this._isUserAuthenticated.bind(this),
        this.send.bind(
          this,
          `${Commands.PRIVATE_MESSAGE} ${channel} :${message}${args}`,
          { isModerator },
        ),
        resolvers,
      ])
      .then(resolvedEvent => {
        this._log.info(info)
        return resolvedEvent
      })
      .catch(err => {
        this._log.error(info, err)
        throw err
      })
  }

  /**
   * Whisper to another user.
   */
  whisper = (user: string, message: string) =>
    utils.resolveInSequence([
      this._isUserAuthenticated.bind(this),
      this.send.bind(this, `${Commands.WHISPER} :/w ${user} ${message}`),
    ])

  /**
   * Broadcast message to all connected channels.
   */
  broadcast = (message: string) =>
    utils.resolveInSequence([
      this._isUserAuthenticated.bind(this),
      () =>
        Promise.all(
          this._getChannels().map(channel => this.say(channel, message)),
        ),
    ])

  private _handleConnectionAttempt(): Promise<GlobalUserStateMessage> {
    return new Promise((resolve, reject) => {
      const connectProfiler = this._log.startTimer('Connecting ...')

      // Connect ...
      this._readyState = 1

      // Increment connection attempts.
      this._connectionAttempts += 1

      if (this._client) {
        // Remove all listeners, just in case.
        this._client.removeAllListeners()
      }

      // Create client and connect.
      this._client = new Client(this.options)

      // Handle messages.
      this._client.on(Events.ALL, this._handleMessage, this)

      // Handle disconnects.
      this._client.on(Events.DISCONNECTED, this._handleDisconnect, this)

      // Listen for reconnects.
      this._client.once(Events.RECONNECT, () => this.reconnect())

      // Listen for authentication failures.
      this._client.once(Events.AUTHENTICATION_FAILED, reject)

      // Once the client is connected, resolve ...
      this._client.once(Events.CONNECTED, e => {
        connectProfiler.done('Connected')
        resolve(e)
      })
    })
  }

  private _handleConnectSuccess(globalUserState: GlobalUserStateMessage) {
    this._readyState = 3
    this._connectionAttempts = 0

    // Process GLOBALUSERSTATE message.
    this._handleMessage(globalUserState)

    return parsers.globalUserStateMessage(globalUserState)
  }

  private async _handleConnectRetry(errorMessage: BaseMessage) {
    this._connectionInProgress = null

    if (this._isDisconnecting) {
      // .disconnect() was called; do not retry to connect.
      return Promise.resolve()
    }

    this._readyState = 2

    this._log.info('Retrying ...')

    if (errorMessage.event === Events.AUTHENTICATION_FAILED) {
      try {
        const token = await this.options.onAuthenticationFailure()

        if (token) {
          this.options = { ...this.options, token }

          await utils.resolveAfter(this.options.connectionTimeout)

          return this.connect()
        }
      } catch (error) {
        this._log.error('Connection failed')
        throw new Errors.AuthenticationError(error, errorMessage)
      }
    }

    return this.connect()
  }

  private _isUserAuthenticated() {
    return new Promise((resolve, reject) => {
      if (chatUtils.isUserAnonymous(this.options.username)) {
        reject(new Error('Not authenticated'))
      } else {
        resolve()
      }
    })
  }

  private _emit(eventName: string, message: Messages) {
    if (eventName) {
      const displayName =
        get(message, 'tags.displayName') || get(message, 'username') || ''
      const info = get(message, 'message') || ''
      this._log.info(`${eventName}`, `${displayName}${info ? ':' : ''}`, info)

      eventName
        .split('/')
        .filter(part => part !== '#')
        .reduce((parents, part) => {
          const eventParts = [...parents, part]
          if (eventParts.length > 1) {
            super.emit(part as keyof types.EventTypes, message)
          }
          super.emit(eventParts.join('/') as keyof types.EventTypes, message)
          return eventParts
        }, [])
    }

    /**
     * All events are also emitted with this event name.
     * @event Chat#*
     */
    super.emit(Events.ALL, message)
  }

  private _getChannels() {
    return Object.keys(this._channelState)
  }

  private _getChannelState(channel) {
    return this._channelState[channel]
  }

  private _setChannelState(channel, state) {
    this._channelState[channel] = state
  }

  private _removeChannelState(channel) {
    this._channelState = Object.entries(this._channelState).reduce(
      (channelStates, [name, state]) => {
        return name === channel
          ? channelStates
          : { ...channelStates, [name]: state }
      },
      {},
    )
  }

  private _clearChannelState() {
    this._channelState = {}
  }

  private _handleMessage(baseMessage) {
    const channel = sanitizers.channel(baseMessage.channel)

    const selfUsername = get(this, '_userState.username', '')
    const messageUsername = get(baseMessage, 'username')
    const isSelf = selfUsername === messageUsername

    const preMessage = { ...baseMessage, isSelf }

    let eventName = preMessage.command
    let message = preMessage

    switch (preMessage.command) {
      case Events.JOIN: {
        message = parsers.joinMessage(preMessage)
        message.isSelf = true
        eventName = `${message.command}/${channel}`
        break
      }

      case Events.PART: {
        message = parsers.partMessage(preMessage)
        message.isSelf = true
        eventName = `${message.command}/${channel}`
        break
      }

      case Events.NAMES: {
        message = parsers.namesMessage(preMessage)
        message.isSelf = true
        eventName = `${message.command}/${channel}`
        break
      }

      case Events.NAMES_END: {
        message = parsers.namesEndMessage(preMessage)
        message.isSelf = true
        eventName = `${message.command}/${channel}`
        break
      }

      case Events.CLEAR_CHAT: {
        message = parsers.clearChatMessage(preMessage)
        eventName = message.event
          ? `${message.command}/${message.event}/${channel}`
          : `${message.command}/${channel}`
        break
      }

      case Events.HOST_TARGET: {
        message = parsers.hostTargetMessage(preMessage)
        eventName = `${message.command}/${channel}`
        break
      }

      case Events.MODE: {
        message = parsers.modeMessage(preMessage)
        eventName = `${message.command}/${channel}`

        if (selfUsername === message.username) {
          const channelState = this._getChannelState(channel)

          this._setChannelState(channel, {
            ...channelState,
            userState: {
              ...channelState.userState,
              isModerator: message.isModerator,
            },
          })
        }
        break
      }

      case Events.GLOBAL_USER_STATE: {
        message = parsers.globalUserStateMessage(preMessage)
        this._userState = message.tags
        break
      }

      case Events.USER_STATE: {
        message = parsers.userStateMessage(preMessage)
        eventName = `${message.command}/${channel}`

        this._setChannelState(channel, {
          ...this._getChannelState(channel),
          userState: message.tags,
        })
        break
      }

      case Events.ROOM_STATE: {
        message = parsers.roomStateMessage(preMessage)
        eventName = `${message.command}/${channel}`

        this._setChannelState(channel, {
          ...this._getChannelState(channel),
          roomState: message.roomState,
        })
        break
      }

      case Events.NOTICE: {
        message = parsers.noticeMessage(preMessage)
        eventName = `${message.command}/${message.event}/${channel}`
        break
      }

      case Events.USER_NOTICE: {
        message = parsers.userNoticeMessage(preMessage)
        eventName = `${message.command}/${message.event}/${channel}`
        break
      }

      case Events.PRIVATE_MESSAGE: {
        message = parsers.privateMessage(preMessage)
        eventName = message.event
          ? `${message.command}/${message.event}/${channel}`
          : `${message.command}/${channel}`
        break
      }

      default: {
        const command = chatUtils.getEventNameFromMessage(preMessage)
        eventName = channel === '#' ? command : `${command}/${channel}`
      }
    }

    this._emit(eventName, message)
  }

  private _handleDisconnect() {
    this._connectionInProgress = null
    this._readyState = 5
    this._clearChannelState()
  }
}

export default Chat
