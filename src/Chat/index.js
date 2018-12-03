/**
 * EventEmitter3 is a high performance EventEmitter
 * @external EventEmitter3
 * @see {@link https://github.com/primus/eventemitter3 EventEmitter3}
 */
import { EventEmitter } from 'eventemitter3'

import { get } from 'lodash'

import createLogger from '../utils/logger/create'

import * as utils from '../utils'
import * as chatUtils from './utils'

import Client from './Client'
import * as Errors from './Errors'

import * as constants from './constants'
import * as commands from './utils/commands'
import * as parsers from './utils/parsers'
import * as sanitizers from './utils/sanitizers'
import * as validators from './utils/validators'

/**
 * Chat client
 * @extends external:EventEmitter3
 *
 * @emits Chat#*
 * @emits Chat#CLEARCHAT
 * @emits Chat#CLEARCHAT/USER_BANNED
 * @emits Chat#GLOBALUSERSTATE
 * @emits Chat#HOSTTARGET
 * @emits Chat#JOIN
 * @emits Chat#MODE
 * @emits Chat#NAMES
 * @emits Chat#NAMES_END
 * @emits Chat#NOTICE
 * @emits Chat#NOTICE/ROOM_MODS
 * @emits Chat#PART
 * @emits Chat#PRIVMSG
 * @emits Chat#PRIVMSG/CHEER
 * @emits Chat#ROOMSTATE
 * @emits Chat#USERNOTICE
 * @emits Chat#USERNOTICE/ANON_GIFT_PAID_UPGRADE
 * @emits Chat#USERNOTICE/GIFT_PAID_UPGRADE
 * @emits Chat#USERNOTICE/RAID
 * @emits Chat#USERNOTICE/RESUBSCRIPTION
 * @emits Chat#USERNOTICE/RITUAL
 * @emits Chat#USERNOTICE/SUBSCRIPTION
 * @emits Chat#USERNOTICE/SUBSCRIPTION_GIFT
 * @emits Chat#USERSTATE
 *
 * @example <caption>Connecting to Twitch and joining #dallas</caption>
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
 */
class Chat extends EventEmitter {
  /**
   * Chat constructor.
   * @param {ChatOptions} options
   */
  constructor(maybeOptions) {
    super()

    /**
     * Validated options.
     * @private
     * @type {ChatOptions}
     */
    this.options = maybeOptions

    this._log = createLogger({ scope: 'Chat', ...this.options.log })

    /**
     * @private
     * @type {number}
     */
    this._readyState = 0

    /**
     * @private
     * @type {number}
     */
    this._connectionAttempts = 0

    /**
     * @private
     * @type {?GlobalUserStateTags}
     */
    this._userState = null

    /**
     * @private
     * @type {Object.<string, ChannelState>}
     */
    this._channelState = {}

    /**
     * @private
     * @type {?Promise}
     */
    this._connectPromise = null

    // Create commands.
    Object.assign(this, commands.factory(this))
  }

  get options() {
    return this._options
  }

  set options(maybeOptions) {
    this._options = validators.chatOptions(maybeOptions)
  }

  get readyState() {
    return this._readyState
  }

  get userState() {
    return this._userState
  }

  /**
   * Update client options.
   * @param {ApiOptions} options New client options. To update `token` or `username`, use [**api.reconnect()**]{@link Chat#reconnect}.
   */
  updateOptions(options) {
    const { token, username } = this.options
    this.options = { ...options, token, username }
  }

  getChannels() {
    return Object.keys(this._channelState)
  }

  getChannelState(channel) {
    return this._channelState[channel]
  }

  setChannelState(channel, state) {
    this._channelState[channel] = state
  }

  removeChannelState(channel) {
    this._channelState = Object.entries(this._channelState).reduce(
      (channelStates, [name, state]) => {
        return name === channel
          ? channelStates
          : { ...channelStates, [name]: state }
      },
      {},
    )
  }

  clearChannelState() {
    this._channelState = {}
  }

  /**
   * Connect to Twitch.
   * @return {Promise<?GlobalUserStateMessage, string>} Global user state message
   */
  connect = () => {
    if (!this._connectPromise) {
      const connectProfiler = this._log.startTimer({
        message: 'Connecting ...',
      })

      this._connectPromise = Promise.race([
        utils.delayReject(
          this.options.connectionTimeout,
          new Errors.TimeoutError(constants.ERROR_CONNECT_TIMED_OUT),
        ),
        new Promise((resolve, reject) => {
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
          this._client.on(constants.EVENTS.ALL, this._handleMessage, this)

          // Handle disconnects.
          this._client.on(
            constants.EVENTS.DISCONNECTED,
            this._handleDisconnect,
            this,
          )

          // Listen for reconnects.
          this._client.once(constants.EVENTS.RECONNECT, () => this.reconnect())

          // Listen for authentication failures.
          this._client.once(constants.EVENTS.AUTHENTICATION_FAILED, reject)

          // Once the client is connected, resolve ...
          this._client.once(constants.EVENTS.CONNECTED, e => {
            connectProfiler.done({ message: 'Connected' })
            resolve(e)
          })
        }),
      ])
        .then(this._handleConnectSuccess.bind(this))
        .catch(this._handleConnectRetry.bind(this))
    }

    return this._connectPromise
  }

  /**
   * Sends a raw message to Twitch.
   * @param {string} message - Message to send.
   */
  send = (message, options) => {
    return this._client.send(message, options)
  }

  /**
   * Disconnected from Twitch.
   */
  disconnect = () => {
    this._client.disconnect()
  }

  /**
   * Reconnect to Twitch.
   * @param {ChatOptions} [options] Provide new options to client.
   * @return {Promise<ChannelState[], string>} Channel states
   */
  reconnect = newOptions => {
    if (newOptions) {
      this.options = { ...this.options, ...newOptions }
    }

    this._connectPromise = null
    this._readyState = 2

    const channels = this.getChannels()
    this.disconnect()

    return this.connect().then(() =>
      Promise.all(channels.map(channel => this.join(channel))),
    )
  }

  /**
   * Join a channel.
   * @param {string} channel
   * @return {Promise<ChannelState, string>}
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
  join = maybeChannel => {
    const channel = sanitizers.channel(maybeChannel)

    this._log.info(`Joining ${channel}`)
    const joinProfiler = this._log.startTimer()

    const promises = [
      this.connect,
      utils.onceResolve(this, `${constants.COMMANDS.ROOM_STATE}/${channel}`),
    ]

    if (!chatUtils.isUserAnonymous(this.options.username)) {
      promises.push(
        utils.onceResolve(this, `${constants.COMMANDS.USER_STATE}/${channel}`),
      )
    }

    const join = Promise.all(promises).then(([, roomState, userState]) => {
      /**
       * @typedef {Object} ChannelState
       * Channel state information
       * @property {RoomStateTags} roomState
       * @property {?UserStateTags} userState
       */

      const channelState = {
        roomState: roomState.tags,
        userState: get(userState, 'tags', null),
      }

      this.setChannelState(roomState.channel, channelState)

      joinProfiler.done({ message: `Joined ${channel}` })
      return channelState
    })

    const send = this.send(`${constants.COMMANDS.JOIN} ${channel}`)

    return send.then(() =>
      Promise.race([
        utils.delayReject(
          this.options.joinTimeout,
          new Errors.TimeoutError(constants.ERROR_JOIN_TIMED_OUT),
        ),
        join,
      ]),
    )
  }

  /**
   * Depart from a channel.
   * @param {string} channel
   */
  part = maybeChannel => {
    const channel = sanitizers.channel(maybeChannel)
    this._log.info(`Parting ${channel}`)

    this.removeChannelState(channel)
    this.send(`${constants.COMMANDS.PART} ${channel}`)
  }

  /**
   * Send a message to a channel.
   * @param {string} channel
   * @param {string} message
   * @return {Promise<?UserStateMessage, string>}
   */
  say = (maybeChannel, message, ...messageArgs) => {
    return this._isUserAuthenticated().then(() => {
      const channel = sanitizers.channel(maybeChannel)
      const args = messageArgs.length ? ['', ...messageArgs].join(' ') : ''

      const info = `PRIVMSG/${channel} :${message}${args}`

      const isModerator = get(this, ['_channelState', channel, 'isModerator'])
      const send = this.send(
        `${constants.COMMANDS.PRIVATE_MESSAGE} ${channel} :${message}${args}`,
        { isModerator },
      )

      const say = Promise.all([this.connect, send])

      const timeout = utils.delayReject(
        this.options.joinTimeout,
        constants.ERROR_SAY_TIMED_OUT,
      )

      const commandResolvers = commands.resolvers(this)(
        channel,
        message,
        ...messageArgs,
      )

      const resolvers = [timeout, ...commandResolvers]

      return say
        .then(() => Promise.race(resolvers))
        .then(res => {
          this._log.info(info)
          return res
        })
        .catch(() => this._log.error(info))
    })
  }

  /**
   * Whisper to another user.
   * @param {string} user
   * @param {string} message
   * @return {Promise<undefined>}
   */
  whisper = (user, message) => {
    return this._isUserAuthenticated().then(() => {
      return this.send(`${constants.COMMANDS.WHISPER} :/w ${user} ${message}`)
    })
  }

  /**
   * Broadcast message to all connected channels.
   * @param {string} message
   * @return {Promise<Array<UserStateMessage>>}
   */
  broadcast = message => {
    return this._isUserAuthenticated().then(() => {
      return Promise.all(
        this.getChannels().map(channel => this.say(channel, message)),
      )
    })
  }

  _emit(eventName, message) {
    if (eventName) {
      const displayName =
        get(message, 'tags.displayName') || message.username || ''
      const info = get(message, 'message') || ''
      this._log.info(`${eventName}`, `${displayName}${info ? ':' : ''}`, info)

      eventName
        .split('/')
        .filter(part => part !== '#')
        .reduce((parents, part) => {
          const eventParts = [...parents, part]
          super.emit(eventParts.join('/'), message)
          return eventParts
        }, [])
    }

    /**
     * All events are also emitted with this event name.
     * @event Chat#*
     */
    super.emit(constants.EVENTS.ALL, message)
  }

  /**
   * Ensure the user is authenticated.
   * @return {Promise}
   */
  _isUserAuthenticated() {
    return new Promise((resolve, reject) => {
      if (chatUtils.isUserAnonymous(this.options.username)) {
        reject(new Error('Not authenticated'))
      } else {
        resolve()
      }
    })
  }

  _handleConnectSuccess(globalUserState) {
    this._readyState = 3
    this._connectionAttempts = 0

    // Process GLOBALUSERSTATE message.
    this._handleMessage(globalUserState)

    return globalUserState
  }

  _handleConnectRetry(error) {
    this._connectPromise = null
    this._readyState = 2

    this._log.info('Retrying ...')

    if (error.event === constants.EVENTS.AUTHENTICATION_FAILED) {
      return this.options
        .onAuthenticationFailure()
        .then(token => (this.options = { ...this.options, token }))
        .then(() => utils.delay(this.options.connectionTimeout))
        .then(() => this.connect())
        .catch(() => {
          this._log.error('Connection failed')
          throw new Errors.AuthenticationError(error)
        })
    }

    return this.connect()
  }

  _handleMessage(baseMessage) {
    const channel = sanitizers.channel(baseMessage.channel)

    const selfUsername = get(this, '_userState.username', '')
    const messageUsername = get(baseMessage, 'username')
    const isSelf = selfUsername === messageUsername

    const preMessage = { ...baseMessage, isSelf }

    let eventName = preMessage.command
    let message = preMessage

    switch (preMessage.command) {
      case constants.EVENTS.JOIN: {
        message = parsers.joinOrPartMessage(preMessage)
        message.isSelf = true
        eventName = `${message.command}/${channel}`
        break
      }

      case constants.EVENTS.PART: {
        message = parsers.joinOrPartMessage(preMessage)
        message.isSelf = true
        eventName = `${message.command}/${channel}`
        break
      }

      case constants.EVENTS.NAMES: {
        message = parsers.namesMessage(preMessage)
        message.isSelf = true
        eventName = `${message.command}/${channel}`
        break
      }

      case constants.EVENTS.NAMES_END: {
        message = parsers.namesEndMessage(preMessage)
        message.isSelf = true
        eventName = `${message.command}/${channel}`
        break
      }

      case constants.EVENTS.CLEAR_CHAT: {
        message = parsers.clearChatMessage(preMessage)
        eventName = message.event
          ? `${message.command}/${message.event}/${channel}`
          : `${message.command}/${channel}`
        break
      }

      case constants.EVENTS.HOST_TARGET: {
        message = parsers.hostTargetMessage(preMessage)
        eventName = `${message.command}/${channel}`
        break
      }

      case constants.EVENTS.MODE: {
        message = parsers.modeMessage(preMessage)
        eventName = `${message.command}/${channel}`

        if (selfUsername === message.username) {
          const channelState = this.getChannelState(channel)

          this.setChannelState(channel, {
            ...channelState,
            userState: {
              ...channelState.userState,
              isModerator: message.isModerator,
            },
          })
        }
        break
      }

      case constants.EVENTS.GLOBAL_USER_STATE: {
        message = parsers.globalUserStateMessage(preMessage)
        this._userState = message.tags
        break
      }

      case constants.EVENTS.USER_STATE: {
        message = parsers.userStateMessage(preMessage)
        eventName = `${message.command}/${channel}`

        this.setChannelState(channel, {
          ...this.getChannelState(channel),
          userState: message.tags,
        })
        break
      }

      case constants.EVENTS.ROOM_STATE: {
        message = parsers.roomStateMessage(preMessage)
        eventName = `${message.command}/${channel}`

        this.setChannelState(channel, {
          ...this.getChannelState(channel),
          roomState: message.roomState,
        })
        break
      }

      case constants.EVENTS.NOTICE: {
        message = parsers.noticeMessage(preMessage)
        eventName = `${message.command}/${message.event}/${channel}`
        break
      }

      case constants.EVENTS.USER_NOTICE: {
        message = parsers.userNoticeMessage(preMessage)
        eventName = `${message.command}/${message.event}/${channel}`
        break
      }

      case constants.EVENTS.PRIVATE_MESSAGE: {
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

  _handleDisconnect() {
    this._connectPromise = null
    this._readyState = 5
  }
}

export { constants }
export default Chat
