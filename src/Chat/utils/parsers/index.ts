import { parse } from 'irc-message'
import camelcaseKeys from 'camelcase-keys'

import { has, isEmpty, isFinite, toNumber, toUpper } from 'lodash'

import * as constants from '../../constants'
import * as utils from '../'
import * as typeParsers from './types'
import * as tagParsers from './tags'

const base = rawMessages => {
  const rawMessagesV = rawMessages.split(/\r?\n/g)
  const messages = []

  rawMessagesV.forEach(rawMessage => {
    if (!rawMessage.length) {
      return
    }

    const { raw, tags, command, prefix, params: [channel, message] } = parse(
      rawMessage,
    )

    /**
     * Base message parsed from Twitch
     * @mixin BaseMessage
     * @property {string} _raw Un-parsed message
     * @property {Date} timestamp Timestamp
     * @property {string} username Username
     * @property {string} command Command
     * @property {string} [channel] Channel
     * @property {(ClearChatTags|GlobalUserStateTags|PrivateMessageTags|RoomStateTags|UserNoticeTags|UserStateTags)} tags Twitch tags
     * @property {string} [message] Message
     */
    messages.push({
      _raw: raw,
      timestamp: typeParsers.generalTimestamp(
        parseInt(tags['tmi-sent-ts'], 10),
      ),
      username: typeParsers.usernameFromPrefix(prefix),
      command,
      channel: channel !== '*' ? channel : '',
      tags: isEmpty(tags) ? {} : camelcaseKeys(tags),
      message,
    })
  })

  return messages
}

const joinOrPartMessage = baseMessage => {
  const [
    ,
    username,
    ,
    ,
    command,
    channel,
  ] = /:(.+)!(.+)@(.+).tmi.twitch.tv (JOIN|PART) (#.+)/g.exec(baseMessage._raw)

  /**
   * Join a channel.
   * @event Chat#JOIN
   * @mixes BaseMessage JoinOrPartMessage
   * @property {string} username Username (lower-case)
   * @see https://dev.twitch.tv/docs/irc/membership/#join-twitch-membership
   */
  /**
   * Depart from a channel.
   * @event Chat#PART
   * @mixes BaseMessage JoinOrPartMessage
   * @property {string} username Username (lower-case)
   * @see https://dev.twitch.tv/docs/irc/membership/#part-twitch-membership
   */
  return {
    ...baseMessage,
    channel,
    command,
    username,
    message: undefined,
  }
}

const modeMessage = baseMessage => {
  const [
    ,
    channel,
    mode,
    username,
  ] = /:[^\s]+ MODE (#[^\s]+) (-|\+)o ([^\s]+)/g.exec(baseMessage._raw)

  const isModerator = mode === '+'

  /**
   * Gain/lose moderator (operator) status in a channel.
   * @event Chat#MODE
   * @mixes BaseMessage ModeMessage
   * @property {string} event
   * @property {string} username
   * @property {boolean} isModerator
   * @see https://dev.twitch.tv/docs/irc/membership/#mode-twitch-membership
   */
  return {
    ...baseMessage,
    event: isModerator
      ? constants.EVENTS.MOD_GAINED
      : constants.EVENTS.MOD_LOST,
    channel,
    username,
    message: `${mode}o`,
    isModerator,
  }
}

const namesMessage = baseMessage => {
  const [
    ,
    ,
    ,
    channel,
    names,
  ] = /:(.+).tmi.twitch.tv 353 (.+) = (#.+) :(.+)/g.exec(baseMessage._raw)

  const namesV = names.split(' ')

  /**
   * List current chatters in a channel.
   * @event Chat#NAMES
   * @mixes BaseMessage NamesMessage
   * @property {Array<string>} usernames Array of usernames present in channel
   * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
   */
  return {
    ...baseMessage,
    channel,
    event: constants.EVENTS.NAMES,
    usernames: namesV,
    message: undefined,
  }
}

const namesEndMessage = baseMessage => {
  const [
    ,
    username,
    ,
    channel,
    message,
  ] = /:(.+).tmi.twitch.tv 366 (.+) (#.+) :(.+)/g.exec(baseMessage._raw)

  /**
   * End of list current chatters in a channel.
   * @event Chat#NAMES_END
   * @mixes BaseMessage NamesEndMessage
   * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
   */
  return {
    ...baseMessage,
    channel,
    event: constants.EVENTS.NAMES_END,
    username,
    message,
  }
}

const globalUserStateMessage = baseMessage => {
  const { tags, ...other } = baseMessage

  /**
   * GLOBALUSERSTATE message
   * @mixin GlobalUserStateMessage
   * @mixes BaseMessage
   * @property {GlobalUserStateTags} tags
   */
  /**
   * On successful login.
   * @event Chat#GLOBALUSERSTATE
   * @mixes GlobalUserStateMessage
   */
  return {
    tags: tagParsers.globalUserState(tags),
    ...other,
  }
}

const clearChatMessage = baseMessage => {
  const { tags, message: username, ...other } = baseMessage

  if (typeof username !== 'undefined') {
    /**
     * Temporary or permanent ban on a channel.
     * @event Chat#CLEARCHAT/USER_BANNED
     * @mixes BaseMessage ClearChatUserBannedMessage
     * @property {ClearChatTags} tags
     * @property {string} username
     * @see https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
     * @see https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags
     */
    return {
      ...other,
      tags: {
        ...tags,
        banReason: typeParsers.generalString(tags.banReason),
        banDuration: typeParsers.generalNumber(tags.banDuration),
      },
      event: constants.EVENTS.USER_BANNED,
      username,
    }
  }

  /**
   * All chat is cleared (deleted).
   * @event Chat#CLEARCHAT
   * @mixes BaseMessage ClearChatMessage
   * @see https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
   * @see https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags
   */
  return {
    ...other,
  }
}

const hostTargetMessage = baseMessage => {
  const [
    ,
    channel,
    username,
    numberOfViewers,
  ] = /:tmi.twitch.tv HOSTTARGET (#[^\s]+) :([^\s]+)?\s?(\d+)?/g.exec(
    baseMessage._raw,
  )
  const isStopped = username === '-'

  /**
   * Host starts or stops a message.
   * @event Chat#HOSTTARGET
   * @mixes BaseMessage HostTargetMessage
   * @property {number} [numberOfViewers] Number of viewers
   * @see https://dev.twitch.tv/docs/irc/commands/#hosttarget-twitch-commands
   */
  return {
    ...baseMessage,
    channel,
    username,
    event: toUpper(
      isStopped
        ? constants.NOTICE_MESSAGE_IDS.HOST_OFF
        : constants.NOTICE_MESSAGE_IDS.HOST_ON,
    ),
    numberOfViewers: isFinite(toNumber(numberOfViewers))
      ? parseInt(numberOfViewers, 10)
      : undefined,
    message: undefined,
  }
}

const roomStateMessage = baseMessage => {
  const { tags, ...other } = baseMessage

  /**
   * When a user joins a channel or a room setting is changed.
   * @event Chat#ROOMSTATE
   * @mixes BaseMessage RoomStateMessage
   * @property {RoomStateTags} tags
   */
  return {
    tags: tagParsers.roomState(tags),
    ...other,
  }
}

const noticeMessage = baseMessage => {
  const { tags: baseTags, ...other } = baseMessage

  const tags = utils.isAuthenticationFailedMessage(baseMessage)
    ? { ...baseTags, msgId: constants.EVENTS.AUTHENTICATION_FAILED }
    : baseTags

  const event = toUpper(tags.msgId)

  switch (tags.msgId) {
    case constants.NOTICE_MESSAGE_IDS.ROOM_MODS:
      /**
       * NOTICE/ROOM_MODS message
       * @event Chat#NOTICE/ROOM_MODS
       * @mixes NoticeMessage NoticeMessage
       * @property {'ROOM_MODS'} event
       * @property {Array<string>} mods
       */
      return { event, tags, mods: typeParsers.mods(other.message), ...other }
    default:
      /**
       * @event Chat#NOTICE
       * @mixes NoticeMessage
       * @property {string} event `msg-id` tag (snake uppercase)
       * @property {Object} tags
       * @see https://dev.twitch.tv/docs/irc/commands/#msg-id-tags-for-the-notice-commands-capability
       */

      /**
       * NOTICE message
       * @mixin NoticeMessage
       * @property {string} event `msg-id` tag (snake uppercase)
       * @property {Object} tags
       */
      return { event, tags, ...other }
  }
}

const userStateMessage = baseMessage => {
  const { tags, ...other } = baseMessage

  /**
   * USERSTATE message
   * @mixin UserStateMessage
   * @mixes BaseMessage
   * @property {UserStateTags} tags
   */
  /**
   * When a user joins a channel or sends a PRIVMSG to a channel.
   * @event Chat#USERSTATE
   * @mixes UserStateMessage UserStateMessage
   */
  return {
    tags: tagParsers.userState(tags),
    ...other,
  }
}

/**
 * When a user joins a channel or sends a PRIVMSG to a channel.
 * @event Chat#PRIVMSG
 * @mixes UserStateMessage PrivateMessage
 */
const privateMessage = baseMessage => {
  const { _raw, tags } = baseMessage

  if (has(baseMessage, 'tags.bits')) {
    /**
     * When a user cheers a channel.
     * @event Chat#PRIVMSG/CHEER
     * @mixes UserStateMessage PrivateMessage
     * @property {'CHEER'} event
     * @property {number} bits
     */
    return {
      ...userStateMessage(baseMessage),
      ...tagParsers.privateMessageCheerEvent(tags),
    }
  }

  const [
    isHostingPrivateMessage,
    channel,
    displayName,
    isAuto,
    numberOfViewers,
  ] =
    constants.PRIVATE_MESSAGE_HOSTED_RE.exec(_raw) || []

  if (isHostingPrivateMessage) {
    /**
     * When a user hosts your channel while connected as broadcaster.
     * @event Chat#PRIVMSG/HOSTED
     * @mixes UserStateMessage PrivateMessage
     * @property {'HOSTED/WITH_VIEWERS'|'HOSTED/WITHOUT_VIEWERS'|'HOSTED/AUTO'} event
     * @property {Object} tags
     * @property {string} tags.displayName
     * @property {number} [numberOfViewers]
     */

    return {
      ...baseMessage,
      tags: { displayName },
      channel: `#${channel}`,
      event: isAuto
        ? constants.EVENTS.HOSTED_AUTO
        : numberOfViewers
          ? constants.EVENTS.HOSTED_WITH_VIEWERS
          : constants.EVENTS.HOSTED_WITHOUT_VIEWERS,
      numberOfViewers: typeParsers.generalNumber(numberOfViewers),
    }
  }

  return userStateMessage(baseMessage)
}

/**
 * USERNOTICE message
 * @mixin UserNoticeMessage
 * @mixes BaseMessage
 * @property {string} event
 * @property {Object} parameters
 * @property {string} systemMessage
 */
const userNoticeMessage = baseMessage => {
  const tags = tagParsers.userNotice(baseMessage.tags)

  /* eslint-disable no-fallthrough */
  switch (tags.msgId) {
    /**
     * On anonymous gifted subscription paid upgrade to a channel.
     * @event Chat#USERNOTICE/ANON_GIFT_PAID_UPGRADE
     * @mixes UserStateMessage AnonGiftPaidUpgradeMessage
     * @property {'ANON_GIFT_PAID_UPGRADE'} event
     */
    case constants.USER_NOTICE_MESSAGE_IDS.ANON_GIFT_PAID_UPGRADE:

    /**
     * On gifted subscription paid upgrade to a channel.
     * @event Chat#USERNOTICE/GIFT_PAID_UPGRADE
     * @mixes UserStateMessage GiftPaidUpgradeMessage
     * @property {'GIFT_PAID_UPGRADE'} event
     * @property {Object} parameters
     * @property {number} parameters.promoGiftTotal
     * @property {string} parameters.promoName
     * @property {string} parameters.senderLogin
     * @property {string} parameters.senderName
     */
    case constants.USER_NOTICE_MESSAGE_IDS.GIFT_PAID_UPGRADE:

    /**
     * On channel raid.
     * @event Chat#USERNOTICE/RAID
     * @mixes UserStateMessage
     * @property {'RAID'} event
     * @property {Object} parameters
     * @property {string} parameters.displayName
     * @property {string} parameters.login
     * @property {number} parameters.viewerCount
     */
    case constants.USER_NOTICE_MESSAGE_IDS.RAID:

    /**
     * On resubscription (subsequent months) to a channel.
     * @event Chat#USERNOTICE/RESUBSCRIPTION
     * @mixes UserStateMessage
     * @property {'RESUBSCRIPTION'} event
     * @property {Object} parameters
     * @property {number} parameters.months
     * @property {string} parameters.subPlan
     * @property {string} parameters.subPlanName
     */
    case constants.USER_NOTICE_MESSAGE_IDS.RESUBSCRIPTION:

    /**
     * On channel ritual.
     * @event Chat#USERNOTICE/RITUAL
     * @mixes UserStateMessage
     * @property {'RITUAL'} event
     * @property {Object} parameters
     * @property {string} parameters.ritualName
     */
    case constants.USER_NOTICE_MESSAGE_IDS.RITUAL:

    /**
     * On subscription gift to a channel community.
     * @event Chat#USERNOTICE/SUBSCRIPTION_GIFT_COMMUNITY
     * @mixes UserStateMessage
     * @property {'SUBSCRIPTION_GIFT_COMMUNITY'} event
     * @property {Object} parameters
     * @property {number} parameters.massGiftCount
     * @property {number} parameters.senderCount
     * @property {string} parameters.subPlan
     */
    case constants.USER_NOTICE_MESSAGE_IDS.SUBSCRIPTION_GIFT_COMMUNITY:

    /**
     * On subscription gift to a channel.
     * @event Chat#USERNOTICE/SUBSCRIPTION_GIFT
     * @mixes UserStateMessage
     * @property {'SUBSCRIPTION_GIFT'} event
     * @property {Object} parameters
     * @property {number} parameters.months
     * @property {string} parameters.subPlan
     * @property {string} parameters.subPlanName
     * @property {string} parameters.recipientDisplayName
     * @property {string} parameters.recipientId
     * @property {string} parameters.recipientName
     */
    case constants.USER_NOTICE_MESSAGE_IDS.SUBSCRIPTION_GIFT:

    /**
     * On subscription (first month) to a channel.
     * @event Chat#USERNOTICE/SUBSCRIPTION
     * @mixes UserStateMessage
     * @property {'SUBSCRIPTION'} event
     * @property {Object} parameters
     * @property {1} parameters.months
     * @property {string} parameters.subPlan
     * @property {string} parameters.subPlanName
     */
    case constants.USER_NOTICE_MESSAGE_IDS.SUBSCRIPTION:

    default:
      return {
        ...baseMessage,
        tags: { ...tags, systemMsg: typeParsers.generalString(tags.systemMsg) },
        parameters: tagParsers.userNoticeMessageParameters(tags),
        event: tagParsers.userNoticeEvent(tags),
        systemMessage: typeParsers.generalString(tags.systemMsg),
      }
  }
  /* eslint-enable no-fallthrough */
}

export {
  modeMessage,
  hostTargetMessage,
  joinOrPartMessage,
  namesMessage,
  namesEndMessage,
  clearChatMessage,
  globalUserStateMessage,
  userStateMessage,
  roomStateMessage,
  noticeMessage,
  userNoticeMessage,
  privateMessage,
}
export default base
