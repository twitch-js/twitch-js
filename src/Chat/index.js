/**
 * EventEmitter3 is a high performance EventEmitter
 * @external EventEmitter3
 * @see {@link https://github.com/primus/eventemitter3 EventEmitter3}
 */
import { EventEmitter } from 'eventemitter3'

import { get } from 'lodash'

import * as utils from '../utils'
import * as chatUtils from './utils'

import Client from './Client'
import * as Errors from './Errors'

import * as constants from './constants'
import { commandsFactory } from './utils/commands'
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

    /**
     * @private
     * @type {number}
     */
    this._connectionAttempts = 0

    /**
     * @private
     * @type {GlobalUserStateTags}
     */
    this._userState = {}

    /**
     * @private
     * @type {Object.<string, ChannelState>}
     */
    this._channelState = {}

    // Create commands.
    Object.assign(this, commandsFactory.call(this))
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

  set readyState(readyState) {
    this._readyState = constants.READY_STATES[readyState] ? readyState : 0
  }

  get userState() {
    return this._userState
  }

  set userState(userState) {
    this._userState = userState
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
  connect() {
    const connect = new Promise((resolve, reject) => {
      if (this.readyState === 1) {
        // Already trying to connect, so resolve when connected.
        this.once(
          chatUtils.isAnonymousUsername(this.options.username)
            ? constants.EVENTS.CONNECTED
            : constants.EVENTS.GLOBAL_USER_STATE,
          resolve,
        )
      } else if (this.readyState === 3) {
        // Already connected.
        resolve(this.userState)
      } else {
        // Connect ...
        this.readyState = 1

        // Increment connection attempts.
        this._connectionAttempts++

        if (this._client) {
          // Remove all listeners, just in case.
          this._client.removeAllListeners()
        }

        // Create client and connect.
        this._client = new Client(this.options)

        // Handle messages.
        this._client.on(constants.EVENTS.ALL, handleMessage, this)

        // Handle disconnects.
        this._client.on(constants.EVENTS.DISCONNECTED, handleDisconnect, this)

        // Listen for reconnects.
        this._client.once(constants.EVENTS.RECONNECT, () => this.reconnect())

        // Listen for authentication failures.
        this._client.once(constants.EVENTS.AUTHENTICATION_FAILED, reject)

        // Once the client is connected, resolve ...
        this._client.once(constants.EVENTS.CONNECTED, resolve)
      }
    })

    return Promise.race([
      utils.delayReject(
        this.options.connectionTimeout,
        new Errors.TimeoutError(constants.ERROR_CONNECT_TIMED_OUT),
      ),
      connect,
    ])
      .then(handleConnectSuccess.bind(this))
      .catch(handleConnectRetry.bind(this))
  }

  /**
   * Sends a raw message to Twitch.
   * @param {string} message - Message to send.
   */
  send(message) {
    return this._client.send(message)
  }

  /**
   * Disconnected from Twitch.
   */
  disconnect() {
    this._client.disconnect()
  }

  /**
   * Reconnect to Twitch.
   * @param {ChatOptions} [options] Provide new options to client.
   * @return {Promise<ChannelState[], string>} Channel states
   */
  reconnect(newOptions) {
    if (newOptions) {
      this.options = { ...this.options, ...newOptions }
    }

    this.readyState = 2

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
  join(maybeChannel) {
    const channel = sanitizers.channel(maybeChannel)
    const promises = [
      this.connect,
      utils.onceResolve(this, `${constants.COMMANDS.ROOM_STATE}/${channel}`),
    ]

    if (!chatUtils.isAnonymousUsername(this.options.username)) {
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
  part(maybeChannel) {
    const channel = sanitizers.channel(maybeChannel)

    this.removeChannelState(channel)
    this.send(`${constants.COMMANDS.PART} ${channel}`)
  }

  /**
   * Send a message to a channel.
   * @param {string} channel
   * @param {string} message
   * @return {Promise<?UserStateMessage, string>}
   */
  say(maybeChannel, message) {
    if (chatUtils.isAnonymousUsername(this.options.username)) {
      throw new Error('Not authenticated')
    }

    const channel = sanitizers.channel(maybeChannel)
    const promises = [this.connect]

    if (chatUtils.isAnonymousUsername(this.options.username)) {
      promises.push(
        utils.onceResolve(this, `${constants.COMMANDS.USER_STATE}/${channel}`),
      )
    }

    const say = Promise.all(promises)

    const send = this.send(
      `${constants.COMMANDS.PRIVATE_MESSAGE} ${channel} :${message}`,
    )

    return send.then(() =>
      Promise.race([
        utils.delayReject(
          this.options.joinTimeout,
          constants.ERROR_SAY_TIMED_OUT,
        ),
        say,
      ]),
    )
  }

  /**
   * Whisper to another user.
   * @param {string} user
   * @param {string} message
   * @return {Promise<undefined>}
   */
  whisper(user, message) {
    if (chatUtils.isAnonymousUsername(this.options.username)) {
      throw new Error('Not authenticated')
    }

    return this.send(`${constants.COMMANDS.WHISPER} :/w ${user} ${message}`)
  }

  /**
   * Broadcast message to all connected channels.
   * @param {string} message
   * @return {Promise<Array<UserStateMessage>>}
   */
  broadcast(message) {
    if (chatUtils.isAnonymousUsername(this.options.username)) {
      throw new Error('Not authenticated')
    }

    return Promise.all(
      this.getChannels().map(channel => this.say(channel, message)),
    )
  }

  emit(eventName, message) {
    if (eventName) {
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
}

function handleConnectSuccess(globalUserState) {
  this.readyState = 3
  this._connectionAttempts = 0

  // Process GLOBALUSERSTATE message.
  handleMessage.call(this, globalUserState)

  return globalUserState
}

function handleConnectRetry(error) {
  this.readyState = 2

  if (error.event === constants.EVENTS.AUTHENTICATION_FAILED) {
    return this.options
      .onAuthenticationFailure()
      .then(token => (this.options = { ...this.options, token }))
      .then(() => utils.delay(this.options.connectionTimeout))
      .then(() => this.connect())
      .catch(() => {
        throw new Errors.AuthenticationError(error)
      })
  }

  return this.connect()
}

function handleMessage(baseMessage) {
  const channel = sanitizers.channel(baseMessage.channel)

  const displayName = get(
    this.getChannelState(channel),
    'userState.displayName',
    '',
  )
  const messageDisplayName = get(baseMessage, 'tags.displayName')
  const isSelf = displayName === messageDisplayName

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

      if (message.username === this.userState.username) {
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
      this.userState = message.tags
      break
    }

    case constants.EVENTS.USER_STATE: {
      message = parsers.userStateMessage(preMessage)
      eventName = `${message.command}/${channel}`

      this.setChannelState(channel, {
        ...this.getChannelState(channel),
        userState: message.userState,
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

  this.emit(eventName, message)
}

function handleDisconnect() {
  this.readyState = 4
}

export { constants }
export default Chat
