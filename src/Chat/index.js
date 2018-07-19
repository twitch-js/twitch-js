/**
 * EventEmitter3 is a high performance EventEmitter
 * @external EventEmitter3
 * @see {@link https://github.com/primus/eventemitter3 EventEmitter3}
 */
import { EventEmitter } from 'eventemitter3'

import { get } from 'lodash'

import * as utils from '../utils'

import Client from './Client'

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
   * Chat client ready state.
   * @enum {number}
   * @property {number} 0 not ready
   * @property {number} 1 connecting
   * @property {number} 2 connected
   * @property {number} 3 disconnecting
   * @property {number} 4 disconnected
   */
  readyState = 0

  /** @type {GlobalUserStateTags} */
  userState = {}

  /** @type {Object.<string, ChannelState>} */
  channels = {}

  /**
   * Chat constructor.
   * @param {ChatOptions} options
   */
  constructor(maybeOptions) {
    super()

    /**
     * Validated options.
     * @type {ChatOptions}
     */
    this.options = validators.chatOptions(maybeOptions)
  }

  /**
   * Connect to Twitch.
   * @return {Promise<GlobalUserStateMessage, string>} Global user state message
   */
  connect() {
    const connect = new Promise(resolve => {
      if (this.readyState === 1) {
        // Already trying to connect, so resolve when connected.
        this.once(
          constants.EVENTS.GLOBAL_USER_STATE,
          globalUserStateMessage => {
            resolve(globalUserStateMessage)
          },
        )
      } else if (this.readyState === 2) {
        // Already connected.
        resolve(this.userState)
      } else {
        // Connect ...
        this.readyState = 1

        // Create client and connect.
        const client = new Client(this.options)

        client.removeAllListeners()

        // Once the client is connected ...
        client.once(constants.EVENTS.CONNECTED, globalUserStateMessage => {
          this.readyState = 2

          // Create commands.
          Object.assign(this, commandsFactory.call(this))

          /**
           * Sends a raw message to Twitch.
           * @param {string} message - Message to send.
           */
          this.send = message => client.send(message)

          /**
           * Disconnected from Twitch.
           */
          this.disconnect = () => {
            this.readyState = 4
            this.userState = {}
            this.channels = {}
          }

          /**
           * Reconnect to Twitch.
           */
          this.reconnect = () => {
            const channels = Object.keys(this.channels)
            client.disconnect()

            return this.connect().then(() =>
              Promise.all(channels.map(channel => this.join(channel))),
            )
          }

          // Bind events.
          client.on(constants.EVENTS.ALL, handleMessage, this)

          // Listen for disconnect.
          client.once(constants.EVENTS.DISCONNECTED, this.disconnect)

          handleMessage.call(this, globalUserStateMessage)

          // ... resolve.
          resolve(globalUserStateMessage)
        })
      }
    })

    return Promise.race([
      utils.delayReject(
        this.options.connectionTimeout,
        constants.ERROR_CONNECT_TIMED_OUT,
      ),
      connect,
    ])
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

    const roomState = utils.onceResolve(
      this,
      `${constants.COMMANDS.ROOM_STATE}/${channel}`,
    )

    const userState = utils.onceResolve(
      this,
      `${constants.COMMANDS.USER_STATE}/${channel}`,
    )

    const join = Promise.all([this.connect, roomState, userState]).then(
      ([, { channel, tags: roomState }, { tags: userState }]) => {
        /**
         * @typedef {Object} ChannelState
         * Channel state information
         * @property {RoomStateTags} roomState
         * @property {UserStateTags} userState
         */
        const response = { roomState, userState }
        this.channels[channel] = response
        return response
      },
    )

    this.send(`${constants.COMMANDS.JOIN} ${channel}`)

    return Promise.race([
      utils.delayReject(
        this.options.joinTimeout,
        constants.ERROR_JOIN_TIMED_OUT,
      ),
      join,
    ])
  }

  /**
   * Depart from a channel.
   * @param {string} channel
   */
  part(maybeChannel) {
    const channel = sanitizers.channel(maybeChannel)

    this.channels[channel] = undefined
    this.send(`${constants.COMMANDS.PART} ${channel}`)
  }

  /**
   * Send a message to a channel.
   * @param {string} channel
   * @param {string} message
   * @return {Promise<UserStateMessage, string>}
   */
  say(maybeChannel, message) {
    const channel = sanitizers.channel(maybeChannel)

    const userState = utils.onceResolve(
      this,
      `${constants.COMMANDS.USER_STATE}/${channel}`,
    )

    const say = Promise.all([this.connect, userState])

    this.send(`${constants.COMMANDS.PRIVATE_MESSAGE} ${channel} :${message}`)

    return Promise.race([
      utils.delayReject(
        this.options.joinTimeout,
        constants.ERROR_SAY_TIMED_OUT,
      ),
      say,
    ])
  }

  /**
   * Broadcast message to all connected channels.
   * @param {string} message
   * @return {Promise<Array<UserStateMessage>>}
   */
  broadcast(message) {
    return Promise.all(
      Object.keys(this.channels).map(channel => this.say(channel, message)),
    )
  }

  /** @private */
  emit(eventName, message) {
    eventName.split('/').reduce((parents, current) => {
      const eventPartial = [...parents, current]
      super.emit(eventPartial.join('/'), message)
      return eventPartial
    }, [])

    /**
     * All events are also emitted with this event name.
     * @event Chat#*
     */
    super.emit(constants.EVENTS.ALL, message)
  }
}

function handleMessage(baseMessage) {
  const channel = sanitizers.channel(baseMessage.channel)

  const displayName = get(
    this.channels,
    [channel, 'userState', 'displayName'],
    '',
  )
  const messageDisplayName = get(baseMessage, 'state.displayName')
  const isSelf = displayName === messageDisplayName

  const preMessage = { ...baseMessage, isSelf }

  switch (preMessage.command) {
    case constants.EVENTS.JOIN: {
      const message = parsers.joinOrPartMessage(preMessage)
      this.emit(`${message.command}/${channel}`, message)
      break
    }
    case constants.EVENTS.PART: {
      const message = parsers.joinOrPartMessage(preMessage)
      this.channels[message.channel] = undefined
      this.emit(`${message.command}/${channel}`, message)
      break
    }
    case constants.EVENTS.NAMES: {
      const message = parsers.namesMessage(preMessage)
      this.emit(`${message.command}/${channel}`, message)
      break
    }
    case constants.EVENTS.NAMES_END: {
      const message = parsers.namesEndMessage(preMessage)
      this.emit(`${message.command}/${channel}`, message)
      break
    }
    case constants.EVENTS.CLEAR_CHAT: {
      const message = parsers.clearChatMessage(preMessage)
      const eventName = message.event
        ? `${message.command}/${message.event}/${channel}`
        : `${message.command}/${channel}`

      this.emit(eventName, message)
      break
    }
    case constants.EVENTS.HOST_TARGET: {
      const message = parsers.hostTargetMessage(preMessage)
      this.emit(`${message.command}/${channel}`, message)
      break
    }
    case constants.EVENTS.MODE: {
      const message = parsers.modeMessage(preMessage)
      if (message.username === this.userState.username) {
        this.channels[message.channel].userState.isModerator =
          message.isModerator
      }
      this.emit(`${message.command}/${channel}`, message)
      break
    }

    case constants.EVENTS.GLOBAL_USER_STATE: {
      const message = parsers.globalUserStateMessage(preMessage)
      this.userState = message.tags
      this.emit(message.command, message)
      break
    }
    case constants.EVENTS.USER_STATE: {
      const message = parsers.userStateMessage(preMessage)
      this.channels = {
        ...this.channels,
        [channel]: {
          ...this.channels[channel],
          userState: message.userState,
        },
      }
      this.emit(`${message.command}/${channel}`, message)
      break
    }
    case constants.EVENTS.ROOM_STATE: {
      const message = parsers.roomStateMessage(preMessage)
      this.channels = {
        ...this.channels,
        [channel]: {
          ...this.channels[channel],
          roomState: message.roomState,
        },
      }
      this.emit(`${message.command}/${channel}`, message)
      break
    }
    case constants.EVENTS.NOTICE: {
      const message = parsers.noticeMessage(preMessage)
      this.emit(`${message.command}/${message.event}/${channel}`, message)
      break
    }
    case constants.EVENTS.USER_NOTICE: {
      const message = parsers.userNoticeMessage(preMessage)
      this.emit(`${message.command}/${message.event}/${channel}`, message)
      break
    }
    case constants.EVENTS.PRIVATE_MESSAGE: {
      const message = parsers.privateMessage(preMessage)
      const eventName = message.event
        ? `${message.command}/${message.event}/${channel}`
        : `${message.command}/${channel}`
      this.emit(eventName, message)
      break
    }

    default: {
      const eventName =
        channel === '#'
          ? preMessage.command
          : `${preMessage.command}/${channel}`
      this.emit(eventName, preMessage)
    }
  }
}

export { constants }
export default Chat
