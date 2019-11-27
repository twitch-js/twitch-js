import { camelCase } from 'lodash'

import * as utils from '../../utils'
import * as constants from '../constants'

const factory = chatInstance => {
  Object.entries(constants.CHAT_COMMANDS).forEach(([key, command]) => {
    chatInstance[camelCase(key)] = (channel, ...args) =>
      chatInstance.say(channel, `/${command}`, ...args)
  })
}

const resolvers = chatInstance => (channel, commandOrMessage) => {
  const [, command] = /^\/(.+)/.exec(commandOrMessage) || []

  switch (command) {
    case constants.CHAT_COMMANDS.BAN:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.BAN_SUCCESS}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.ALREADY_BANNED}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.CLEAR:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.CLEAR_CHAT}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.COLOR:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.COLOR_CHANGED}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.COMMERCIAL:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.COMMERCIAL_SUCCESS}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.EMOTE_ONLY:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.EMOTE_ONLY_ON}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.ALREADY_EMOTE_ONLY_ON}/${channel}`,
        ),
      ]
    case constants.CHAT_COMMANDS.EMOTE_ONLY_OFF:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.EMOTE_ONLY_OFF}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.ALREADY_EMOTE_ONLY_OFF}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.FOLLOWERS_ONLY:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.FOLLOWERS_ON_ZERO}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.FOLLOWERS_ON}/${channel}`,
        ),
      ]
    case constants.CHAT_COMMANDS.FOLLOWERS_ONLY_OFF:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.FOLLOWERS_OFF}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.HELP:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.COMMANDS_AVAILABLE}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.HOST:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.HOST_ON}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.MARKER:
      return [Promise.resolve()]

    // case constants.CHAT_COMMANDS.ME:
    // Use resolver for private messages.

    case constants.CHAT_COMMANDS.MOD:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.MOD_SUCCESS}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.BAD_MOD_MOD}/${channel}`,
        ),
      ]
    case constants.CHAT_COMMANDS.MODS:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.ROOM_MODS}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.R9K:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.R9K_ON}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.ALREADY_R9K_ON}/${channel}`,
        ),
      ]
    case constants.CHAT_COMMANDS.R9K_OFF:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.R9K_OFF}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.ALREADY_R9K_OFF}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.RAID:
      return [Promise.resolve()]

    case constants.CHAT_COMMANDS.SLOW:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.SLOW_ON}/${channel}`,
        ),
      ]
    case constants.CHAT_COMMANDS.SLOW_OFF:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.SLOW_OFF}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.SUBSCRIBERS:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.SUBS_ON}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.ALREADY_SUBS_ON}/${channel}`,
        ),
      ]
    case constants.CHAT_COMMANDS.SUBSCRIBERS_OFF:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.SUBS_OFF}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.ALREADY_SUBS_OFF}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.TIMEOUT:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.TIMEOUT_SUCCESS}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.UNBAN:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.UNBAN_SUCCESS}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.BAD_UNBAN_NO_BAN}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.UNHOST:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.HOST_OFF}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.UNMOD:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.HOST_OFF}/${channel}`,
        ),
      ]

    case constants.CHAT_COMMANDS.UNRAID:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.EVENTS.UNRAID_SUCCESS}/${channel}`,
        ),
      ]

    // Resolver for private messages.
    default:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${constants.COMMANDS.USER_STATE}/${channel}`,
        ),
      ]
  }
}

export { factory, resolvers }
