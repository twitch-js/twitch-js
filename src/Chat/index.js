import { EventEmitter } from 'eventemitter3'

import { get, split } from 'lodash'

import * as utils from '../utils'

import Client from './Client'

import * as constants from './constants'
import { commandsFactory } from './utils/commands'
import * as parsers from './utils/parsers'
import * as sanitizers from './utils/sanitizers'
import * as validators from './utils/validators'

class Chat extends EventEmitter {
  readyState = 0
  userState = {}
  channels = {}

  constructor(maybeOptions) {
    super()

    // Validate options.
    this.options = validators.chatOptions(maybeOptions)
  }

  connect() {
    const connect = new Promise((resolve, reject) => {
      if (this.readyState === 1) {
        // Already trying to connect, so resolve when connected.
        client.once(constants.EVENTS.CONNECTED, globalUserStateMessage => {
          resolve(globalUserStateMessage)
        })
      } else if (this.readyState === 2) {
        // Already connected.
        resolve(this.userState)
      } else {
        // Connect ...
        this.readyState = 1

        // Create client and connect.
        const client = new Client(this.options)

        // Once the client is connected ...
        client.once(constants.EVENTS.CONNECTED, globalUserStateMessage => {
          // Create commands.
          Object.assign(this, commandsFactory.call(this))

          // Bind events.
          client.on(constants.EVENTS.ALL, handleMessage, this)

          // Listen for disconnect.
          client.once(
            constants.EVENTS.DISCONNECTED,
            handleDisconnect.bind(this, client),
          )

          this.readyState = 2
          this.send = handleSend.bind(this, client)
          this.disconnect = client.disconnect

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

  join = maybeChannel => {
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
      ([, { roomState }, { userState }]) => {
        const response = { roomState, userState }
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

  part = maybeChannel => {
    const channel = sanitizers.channel(maybeChannel)

    this.channels[channel] = undefined
    this.send(`${constants.COMMANDS.PART} ${channel}`)
  }

  say = (maybeChannel, message) => {
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

  broadcast = message =>
    Promise.all(
      Object.keys(this.channels).map(channel => this.say(channel, message)),
    )

  emit = (eventName, message) => {
    const events = eventName.split('/').reduce((parents, current) => {
      const eventPartial = [...parents, current]
      super.emit(eventPartial.join('/'), message)
      return eventPartial
    }, [])

    // Emit all events.
    super.emit(constants.EVENTS.ALL, message)
  }
}

function handleSend(client, message) {
  client.send(message)
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
    case constants.EVENTS.JOIN:
      const message = parsers.joinOrPartMessage(preMessage)
      this.emit(`${message.command}/${channel}`, message)
      break
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
      this.userState = message.userState
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
      this.emit(`${message.command}/${channel}`, message)
      break
    }

    default:
      const eventName =
        channel === '#'
          ? preMessage.command
          : `${preMessage.command}/${channel}`
      this.emit(eventName, preMessage)
  }
}

function handleDisconnect(client) {
  this.readyState = 3

  client.removeAllListeners()

  this.userState = {}
  this.channels = {}

  this.readyState = 4
}

export { constants }
export default Chat
