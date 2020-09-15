import camelCase from 'lodash/camelCase'
import toUpper from 'lodash/toUpper'

import { ChatCommands, KnownNoticeMessageIds, Commands } from '../../twitch'

import * as utils from '../../utils'

const EVENT_TIMEOUT_LIMIT = 10000

export const factory = (chatInstance: any) => {
  Object.entries(ChatCommands).forEach(([key, command]) => {
    chatInstance[camelCase(key)] = (channel: string, ...args: string[]) =>
      chatInstance.say(channel, `/${command}`, ...args)
  })
}

export const resolvers = (chatInstance: any) => (
  channel: string,
  commandOrMessage: string,
) => {
  const [, command] = /^\/(.+)/.exec(commandOrMessage) || []

  const notices = Object.entries(KnownNoticeMessageIds).reduce(
    (uppercase, [key, value]) => ({ ...uppercase, [key]: toUpper(value) }),
    {} as Record<keyof typeof KnownNoticeMessageIds, string>,
  )

  switch (command) {
    case ChatCommands.BAN:
      return [
        utils.resolveOnEvent(chatInstance, `${notices.BAN_SUCCESS}/${channel}`),
        utils.resolveOnEvent(
          chatInstance,
          `${notices.ALREADY_BANNED}/${channel}`,
        ),
      ]

    case ChatCommands.CLEAR:
      return [
        utils.resolveOnEvent(chatInstance, `${Commands.CLEAR_CHAT}/${channel}`),
      ]

    case ChatCommands.COLOR:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${notices.COLOR_CHANGED}/${channel}`,
        ),
      ]

    case ChatCommands.COMMERCIAL:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${notices.COMMERCIAL_SUCCESS}/${channel}`,
        ),
      ]

    case ChatCommands.EMOTE_ONLY:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${notices.EMOTE_ONLY_ON}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${notices.ALREADY_EMOTE_ONLY_ON}/${channel}`,
        ),
      ]
    case ChatCommands.EMOTE_ONLY_OFF:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${notices.EMOTE_ONLY_OFF}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${notices.ALREADY_EMOTE_ONLY_OFF}/${channel}`,
        ),
      ]

    case ChatCommands.FOLLOWERS_ONLY:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${notices.FOLLOWERS_ON_ZERO}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${notices.FOLLOWERS_ON}/${channel}`,
        ),
      ]
    case ChatCommands.FOLLOWERS_ONLY_OFF:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${notices.FOLLOWERS_OFF}/${channel}`,
        ),
      ]

    case ChatCommands.HELP:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${notices.CMDS_AVAILABLE}/${channel}`,
        ),
      ]

    case ChatCommands.HOST:
      return [
        utils.resolveOnEvent(chatInstance, `${notices.HOST_ON}/${channel}`),
      ]

    case ChatCommands.MARKER:
      return [Promise.resolve()]

    // case ChatCommands.ME:
    // Use resolver for private messages.

    case ChatCommands.MOD:
      return [
        utils.resolveOnEvent(chatInstance, `${notices.MOD_SUCCESS}/${channel}`),
        utils.resolveOnEvent(chatInstance, `${notices.BAD_MOD_MOD}/${channel}`),
      ]
    case ChatCommands.MODS:
      return [
        utils.resolveOnEvent(chatInstance, `${notices.ROOM_MODS}/${channel}`),
      ]

    case ChatCommands.R9K:
      return [
        utils.resolveOnEvent(chatInstance, `${notices.R9K_ON}/${channel}`),
        utils.resolveOnEvent(
          chatInstance,
          `${notices.ALREADY_R9K_ON}/${channel}`,
        ),
      ]
    case ChatCommands.R9K_OFF:
      return [
        utils.resolveOnEvent(chatInstance, `${notices.R9K_OFF}/${channel}`),
        utils.resolveOnEvent(
          chatInstance,
          `${notices.ALREADY_R9K_OFF}/${channel}`,
        ),
      ]

    case ChatCommands.RAID:
      return [Promise.resolve()]

    case ChatCommands.SLOW:
      return [
        utils.resolveOnEvent(chatInstance, `${notices.SLOW_ON}/${channel}`),
      ]
    case ChatCommands.SLOW_OFF:
      return [
        utils.resolveOnEvent(chatInstance, `${notices.SLOW_OFF}/${channel}`),
      ]

    case ChatCommands.SUBSCRIBERS:
      return [
        utils.resolveOnEvent(chatInstance, `${notices.SUBS_ON}/${channel}`),
        utils.resolveOnEvent(
          chatInstance,
          `${notices.ALREADY_SUBS_ON}/${channel}`,
        ),
      ]
    case ChatCommands.SUBSCRIBERS_OFF:
      return [
        utils.resolveOnEvent(chatInstance, `${notices.SUBS_OFF}/${channel}`),
        utils.resolveOnEvent(
          chatInstance,
          `${notices.ALREADY_SUBS_OFF}/${channel}`,
        ),
      ]

    case ChatCommands.TIMEOUT:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${notices.TIMEOUT_SUCCESS}/${channel}`,
          EVENT_TIMEOUT_LIMIT,
        ),
      ]

    case ChatCommands.UNBAN:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${notices.UNBAN_SUCCESS}/${channel}`,
        ),
        utils.resolveOnEvent(
          chatInstance,
          `${notices.BAD_UNBAN_NO_BAN}/${channel}`,
        ),
      ]

    case ChatCommands.UNHOST:
      return [
        utils.resolveOnEvent(chatInstance, `${notices.HOST_OFF}/${channel}`),
      ]

    case ChatCommands.UNMOD:
      return [
        utils.resolveOnEvent(chatInstance, `${notices.HOST_OFF}/${channel}`),
      ]

    case ChatCommands.UNRAID:
      return [
        utils.resolveOnEvent(
          chatInstance,
          `${notices.UNRAID_SUCCESS}/${channel}`,
        ),
      ]

    // Resolver for private messages.
    default:
      return [
        utils.resolveOnEvent(chatInstance, `${Commands.USER_STATE}/${channel}`),
      ]
  }
}
