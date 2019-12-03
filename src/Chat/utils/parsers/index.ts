import { parse } from 'tekko/dist/parse'
import camelcaseKeys from 'camelcase-keys'

import gt from 'lodash/gt'
import isEmpty from 'lodash/isEmpty'
import isFinite from 'lodash/isFinite'
import toNumber from 'lodash/toNumber'
import toUpper from 'lodash/toUpper'

import {
  BaseMessage,
  Commands,
  JoinMessage,
  PartMessage,
  ModeMessage,
  ChatEvents,
  Events,
  NamesMessage,
  NamesEndMessage,
  GlobalUserStateMessage,
  HostTargetMessage,
  RoomStateMessage,
  NoticeMessage,
  UserNoticeTags,
  KnownNoticeMessageIds,
  UserStateMessage,
  KnownUserNoticeMessageIds,
  ClearChatMessages,
  NoticeMessages,
  NoticeEvents,
  PrivateMessages,
  NoticeTags,
  UserNoticeMessages,
  GiftPaidUpgradeParameters,
  RaidParameters,
  ResubscriptionParameters,
  RitualParameters,
  SubscriptionGiftCommunityParameters,
  SubscriptionGiftParameters,
  SubscriptionParameters,
} from '../../../twitch'

import * as constants from '../../constants'
import * as utils from '../'
import * as helpers from './helpers'
import * as tagParsers from './tags'
import toLower from 'lodash/toLower'

export const base = (rawMessages: string): BaseMessage[] => {
  const rawMessagesV = rawMessages.split(/\r?\n/g)

  return rawMessagesV.reduce((messages, rawMessage) => {
    if (!rawMessage.length) {
      return messages
    }

    const {
      command,
      tags = {},
      prefix: { user } = { user: 'tmi.twitch.tv' },
      params: [channel, message],
    } = parse(rawMessage)

    const timestamp = String(tags['tmi-sent-ts']) || Date.now().toString()

    const baseMessage = {
      _raw: rawMessage,
      timestamp: helpers.generalTimestamp(timestamp),
      command: command as Commands,
      event: command as Events,
      channel: channel !== '*' ? channel : '',
      username: user,
      tags: isEmpty(tags)
        ? {}
        : (camelcaseKeys(tags) as { [key: string]: string }),
      message,
    }

    return [...messages, baseMessage]
  }, [] as BaseMessage[])
}

/**
 * Join a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#join-twitch-membership
 */
export const joinMessage = (baseMessage: BaseMessage): JoinMessage => {
  const [
    ,
    username,
    ,
    ,
    channel,
  ] = /:(.+)!(.+)@(.+).tmi.twitch.tv JOIN (#.+)/g.exec(baseMessage._raw)

  return {
    ...baseMessage,
    channel,
    command: Commands.JOIN,
    event: Commands.JOIN,
    username,
  }
}

/**
 * Join or depart from a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#join-twitch-membership
 * @see https://dev.twitch.tv/docs/irc/membership/#part-twitch-membership
 */
export const partMessage = (baseMessage: BaseMessage): PartMessage => {
  const [
    ,
    username,
    ,
    ,
    channel,
  ] = /:(.+)!(.+)@(.+).tmi.twitch.tv PART (#.+)/g.exec(baseMessage._raw)

  return {
    ...baseMessage,
    channel,
    command: Commands.PART,
    event: Commands.PART,
    username,
  }
}

/**
 * Gain/lose moderator (operator) status in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#mode-twitch-membership
 */
export const modeMessage = (baseMessage: BaseMessage): ModeMessage => {
  const [
    ,
    channel,
    mode,
    username,
  ] = /:[^\s]+ MODE (#[^\s]+) (-|\+)o ([^\s]+)/g.exec(baseMessage._raw)

  const isModerator = mode === '+'

  return {
    ...baseMessage,
    command: Commands.MODE,
    event: isModerator ? ChatEvents.MOD_GAINED : ChatEvents.MOD_LOST,
    channel,
    username,
    message: isModerator ? `+o` : '-o',
    isModerator,
  }
}

/**
 * List current chatters in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
 */
export const namesMessage = (baseMessage: BaseMessage): NamesMessage => {
  const [
    ,
    ,
    ,
    channel,
    names,
  ] = /:(.+).tmi.twitch.tv 353 (.+) = (#.+) :(.+)/g.exec(baseMessage._raw)

  const namesV = names.split(' ')

  return {
    ...baseMessage,
    channel,
    command: Commands.NAMES,
    event: Commands.NAMES,
    usernames: namesV,
  }
}

/**
 * End of list current chatters in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
 */
export const namesEndMessage = (baseMessage: BaseMessage): NamesEndMessage => {
  const [
    ,
    username,
    ,
    channel,
    // message,
  ] = /:(.+).tmi.twitch.tv 366 (.+) (#.+) :(.+)/g.exec(baseMessage._raw)

  return {
    ...baseMessage,
    channel,
    command: Commands.NAMES_END,
    event: Commands.NAMES_END,
    username,
  }
}

/**
 * GLOBALUSERSTATE message
 */
export const globalUserStateMessage = (
  baseMessage: BaseMessage,
): GlobalUserStateMessage => {
  const { tags, ...other } = baseMessage

  return {
    ...other,
    command: Commands.GLOBAL_USER_STATE,
    event: Commands.GLOBAL_USER_STATE,
    tags: tagParsers.globalUserState(tags),
  }
}

/**
 * Temporary or permanent ban on a channel.
 * @see https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
 *
 * All chat is cleared (deleted).
 * @see https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags
 */
export const clearChatMessage = (
  baseMessage: BaseMessage,
): ClearChatMessages => {
  const { tags, message: username, ...other } = baseMessage

  if (typeof username !== 'undefined') {
    return {
      ...other,
      tags: {
        ...tags,
        banReason: helpers.generalString(tags.banReason),
        banDuration: helpers.generalNumber(tags.banDuration),
      },
      command: Commands.CLEAR_CHAT,
      event: ChatEvents.USER_BANNED,
      username,
    }
  }

  return {
    ...other,
    command: Commands.CLEAR_CHAT,
    event: Commands.CLEAR_CHAT,
  }
}

/**
 * Host starts or stops a message.
 * @see https://dev.twitch.tv/docs/irc/commands/#hosttarget-twitch-commands
 */
export const hostTargetMessage = (
  baseMessage: BaseMessage,
): HostTargetMessage => {
  const [
    ,
    channel,
    username,
    numberOfViewers,
  ] = /:tmi.twitch.tv HOSTTARGET (#[^\s]+) :([^\s]+)?\s?(\d+)?/g.exec(
    baseMessage._raw,
  )
  const isStopped = username === '-'

  return {
    ...baseMessage,
    channel,
    username,
    command: Commands.HOST_TARGET,
    event: isStopped ? ChatEvents.HOST_OFF : ChatEvents.HOST_ON,
    numberOfViewers: isFinite(toNumber(numberOfViewers))
      ? parseInt(numberOfViewers, 10)
      : undefined,
    message: undefined,
  }
}

/**
 * When a user joins a channel or a room setting is changed.
 */
export const roomStateMessage = (
  baseMessage: BaseMessage,
): RoomStateMessage => {
  const { tags, ...other } = baseMessage

  return {
    ...other,
    command: Commands.ROOM_STATE,
    event: Commands.ROOM_STATE,
    tags: tagParsers.roomState(tags),
  }
}

/**
 * NOTICE/ROOM_MODS message
 * @see https://dev.twitch.tv/docs/irc/commands/#msg-id-tags-for-the-notice-commands-capability
 */
export const noticeMessage = (baseMessage: BaseMessage): NoticeMessages => {
  const { tags: baseTags, ...other } = baseMessage

  const tags = (utils.isAuthenticationFailedMessage(baseMessage)
    ? { ...baseTags, msgId: toLower(Events.AUTHENTICATION_FAILED) }
    : baseTags) as NoticeTags

  const event = toUpper(tags.msgId) as NoticeEvents

  switch (tags.msgId) {
    case KnownNoticeMessageIds.ROOM_MODS:
      return {
        ...other,
        command: Commands.NOTICE,
        event: NoticeEvents.ROOM_MODS,
        tags,
        mods: helpers.mods(other.message),
      }
    default:
      return {
        ...other,
        command: Commands.NOTICE,
        event,
        tags,
      } as NoticeMessage
  }
}

/**
 * USERSTATE message
 * When a user joins a channel or sends a PRIVMSG to a channel.
 */
export const userStateMessage = (
  baseMessage: BaseMessage,
): UserStateMessage => {
  const { tags, ...other } = baseMessage

  return {
    ...other,
    command: Commands.USER_STATE,
    event: Commands.USER_STATE,
    tags: tagParsers.userState(tags),
  }
}

/**
 * PRIVMSG message
 * When a user joins a channel or sends a PRIVMSG to a channel.
 * When a user cheers a channel.
 * When a user hosts your channel while connected as broadcaster.
 */
export const privateMessage = (baseMessage: BaseMessage): PrivateMessages => {
  const { _raw, tags } = baseMessage

  if (gt(tags.bits, 0)) {
    return {
      ...userStateMessage(baseMessage),
      command: Commands.PRIVATE_MESSAGE,
      event: ChatEvents.CHEER,
      bits: helpers.generalNumber(tags.bits),
    }
  }

  const [
    isHostingPrivateMessage,
    channel,
    displayName,
    isAuto,
    numberOfViewers,
  ] = constants.PRIVATE_MESSAGE_HOSTED_RE.exec(_raw) || []

  if (isHostingPrivateMessage) {
    if (isAuto) {
      return {
        ...baseMessage,
        command: Commands.PRIVATE_MESSAGE,
        event: ChatEvents.HOSTED_AUTO,
        channel: `#${channel}`,
        tags: { displayName },
        numberOfViewers: helpers.generalNumber(numberOfViewers),
      }
    }

    if (numberOfViewers) {
      return {
        ...baseMessage,
        command: Commands.PRIVATE_MESSAGE,
        event: ChatEvents.HOSTED_WITH_VIEWERS,
        channel: `#${channel}`,
        tags: { displayName },
        numberOfViewers: helpers.generalNumber(numberOfViewers),
      }
    }

    return {
      ...baseMessage,
      command: Commands.PRIVATE_MESSAGE,
      event: ChatEvents.HOSTED_WITHOUT_VIEWERS,
      channel: `#${channel}`,
      tags: { displayName },
    }
  }

  return {
    ...userStateMessage(baseMessage),
    command: Commands.PRIVATE_MESSAGE,
    event: Commands.PRIVATE_MESSAGE,
  }
}

/**
 * USERNOTICE message
 */
export const userNoticeMessage = (
  baseMessage: BaseMessage,
): UserNoticeMessages => {
  const command = Commands.USER_NOTICE
  const tags = {
    ...tagParsers.userNotice(baseMessage.tags),
    systemMsg: helpers.generalString(baseMessage.tags.systemMsg),
  } as UserNoticeTags
  const systemMessage = helpers.generalString(baseMessage.tags.systemMsg)
  const parameters = tagParsers.userNoticeMessageParameters(tags)

  switch (tags.msgId) {
    /**
     * On anonymous gifted subscription paid upgrade to a channel.
     */
    case KnownUserNoticeMessageIds.ANON_GIFT_PAID_UPGRADE:
      return {
        ...baseMessage,
        command,
        event: ChatEvents.ANON_GIFT_PAID_UPGRADE,
        parameters,
        tags,
        systemMessage,
      }

    /**
     * On gifted subscription paid upgrade to a channel.
     */
    case KnownUserNoticeMessageIds.GIFT_PAID_UPGRADE:
      return {
        ...baseMessage,
        command,
        event: ChatEvents.GIFT_PAID_UPGRADE,
        parameters: parameters as GiftPaidUpgradeParameters,
        tags,
        systemMessage,
      }

    /**
     * On channel raid.
     */
    case KnownUserNoticeMessageIds.RAID:
      return {
        ...baseMessage,
        command,
        event: ChatEvents.RAID,
        parameters: parameters as RaidParameters,
        tags,
        systemMessage,
      }

    /**
     * On resubscription (subsequent months) to a channel.
     */
    case KnownUserNoticeMessageIds.RESUBSCRIPTION:
      return {
        ...baseMessage,
        command,
        event: ChatEvents.RESUBSCRIPTION,
        parameters: parameters as ResubscriptionParameters,
        tags,
        systemMessage,
      }

    /**
     * On channel ritual.
     */
    case KnownUserNoticeMessageIds.RITUAL:
      return {
        ...baseMessage,
        command,
        event: ChatEvents.RITUAL,
        parameters: parameters as RitualParameters,
        tags,
        systemMessage,
      }

    /**
     * On subscription gift to a channel community.
     */
    case KnownUserNoticeMessageIds.SUBSCRIPTION_GIFT_COMMUNITY:
      return {
        ...baseMessage,
        command,
        event: ChatEvents.SUBSCRIPTION_GIFT_COMMUNITY,
        parameters: parameters as SubscriptionGiftCommunityParameters,
        tags,
        systemMessage,
      }

    /**
     * On subscription gift to a channel.
     */
    case KnownUserNoticeMessageIds.SUBSCRIPTION_GIFT:
      return {
        ...baseMessage,
        command,
        event: ChatEvents.SUBSCRIPTION_GIFT,
        parameters: parameters as SubscriptionGiftParameters,
        tags,
        systemMessage,
      }

    /**
     * On subscription (first month) to a channel.
     */
    case KnownUserNoticeMessageIds.SUBSCRIPTION:
      return {
        ...baseMessage,
        command,
        event: ChatEvents.SUBSCRIPTION,
        parameters: parameters as SubscriptionParameters,
        tags,
        systemMessage,
      }

    /**
     * Unknown USERNOTICE event.
     */
    default:
      return {
        ...baseMessage,
        command,
        event: toUpper(tags.msgId),
        tags,
        parameters,
        systemMessage,
      } as UserNoticeMessages
  }
}

export default base
