import { parse } from 'irc-message'
import camelcaseKeys from 'camelcase-keys'

import { gt, isEmpty, isFinite, replace, toLower, toUpper } from 'lodash'

import * as constants from '../constants'

const base = rawMessages => {
  const rawMessagesV = rawMessages.replace(/\r\n$/, '').split(/\n/g)

  return rawMessagesV.map(rawMessage => {
    const { raw, tags, command, params: [channel, message] } = parse(rawMessage)

    /**
     * Parsed base message
     * @typedef {Object} BaseMessage
     * @property {string} _raw Un-parsed message
     * @property {Date} timestamp Timestamp
     * @property {string} command Command
     * @property {Object} state Message state
     * @property {string} [channel] Channel
     * @property {string} [message] Message
     * @property {string} [event] Associated event
     */
    return {
      _raw: raw,
      timestamp: generalTimestamp(parseInt(tags['tmi-sent-ts'], 10)),
      command,
      channel,
      state: isEmpty(tags) ? undefined : camelcaseKeys(tags),
      message,
    }
  })
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
   * JOIN/PART message
   * @typedef {BaseMessage} JoinOrPartMessage
   * @property {string} username Username (lower-case)
   */
  return {
    ...baseMessage,
    channel,
    command,
    username,
    message: undefined,
  }
}

const globalUserStateMessage = baseMessage => {
  const { state: userState, ...other } = baseMessage

  /**
   * GLOBALUSERSTATE message
   * @typedef {BaseMessage} GlobalUserStateMessage
   * @property {Object} userState
   * @property {string} userState.username
   */
  return {
    userState: {
      ...userState,
      badges: badges(userState.badges),
      emotes: emotes(userState.emotes),
      emoteSets: emoteSets(userState.emoteSets),
      userType: userType(userState.userType),
      isTurboSubscriber: generalBoolean(userState.turbo),
      username: toLower(userState.displayName),
    },
    ...other,
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
   * NAMES message
   * @typedef {BaseMessage} NamesMessage
   * @property {Array<string>} usernames Array of usernames present in channel
   * @property {('mods'|'chatters')} listType
   */
  return {
    ...baseMessage,
    channel,
    event: constants.EVENTS.NAMES,
    usernames: namesV,
    listType: names.length > 1000 ? 'mods' : 'chatters',
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
   * End of NAMES message
   * @typedef {NamesMessage} NamesEndMessage
   */
  return {
    ...baseMessage,
    channel,
    event: constants.EVENTS.NAMES_END,
    username,
    message,
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
   * MODE message
   * @typedef {BaseMessage} ModeMessage
   * @property {string} event
   * @property {boolean} isModerator
   * @property {string} username
   */
  return {
    ...baseMessage,
    event: isModerator
      ? constants.EVENTS.MOD_GAINED
      : constants.EVENTS.MOD_LOST,
    isModerator,
    channel,
    username,
    message: undefined,
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

  const { state, message, ...other } = baseMessage

  /**
   * HOSTTARGET message
   * @typedef {BaseMessage} HostTargetMessage
   * @property {number} [numberOfViewers] Number of viewers
   */
  return {
    ...other,
    channel,
    username,
    event: toUpper(
      isStopped
        ? constants.NOTICE_MESSAGE_IDS.HOST_OFF
        : constants.NOTICE_MESSAGE_IDS.HOST_ON,
    ),
    numberOfViewers: isFinite(numberOfViewers)
      ? parseInt(numberOfViewers, 10)
      : undefined,
  }
}

const clearChatMessage = baseMessage => {
  const { state, message: username, ...other } = baseMessage

  if (typeof username !== 'undefined') {
    /**
     * CLEARCHAT (user banned) message
     * @typedef {BaseMessage} ClearChatUserBannedMessage
     * @property {Object} state
     * @property {string} state.banReason
     * @property {string} state.banDuration
     * @property {string} username
     */
    return {
      ...other,
      state: {
        ...state,
        banReason: generalString(state.banReason),
        banDuration: generalNumber(state.banDuration),
      },
      event: constants.EVENTS.USER_BANNED,
      username,
    }
  }

  /**
   * CLEARCHAT message
   * @typedef {BaseMessage} ClearChatMessage
   */
  return {
    ...other,
  }
}

const userStateMessage = baseMessage => {
  const { state: userState, ...other } = baseMessage

  return {
    userState: {
      ...userState,
      badges: badges(userState.badges),
      emotes: emotes(userState.emotes),
      emoteSets: emoteSets(userState.emoteSets),
      isModerator: generalBoolean(userState.mod),
      isSubscriber: generalBoolean(userState.subscriber),
      userType: userType(userState.userType),
      bits: undefined,
    },
    ...other,
    ...bits(userState.bits),
  }
}

const roomStateMessage = baseMessage => {
  const { state: roomState, ...other } = baseMessage

  return {
    /**
     * ROOMSTATE Tag
     * @typedef {Object} RoomState
     * @property {string} broadcasterLanguage
     * @property {boolean} isFollowersOnly
     * @property {boolean} isSubscribersOnly
     * @property {boolean} isEmoteOnly
     * @property {boolean} isR9kEnabled
     * @property {number} slowDelay
     */
    roomState: {
      broadcasterLanguage: broadcasterLanguage(roomState.broadcasterLang),
      isFollowersOnly: generalBoolean(roomState.followersOnly),
      isSubscribersOnly: generalBoolean(roomState.subsOny),
      isEmoteOnly: generalBoolean(roomState.emoteOnly),
      isR9kEnabled: generalBoolean(roomState.r9k),
      slowDelay: parseInt(roomState.slow, 10),
    },
    ...other,
  }
}

const privateMessage = baseMessage => {
  const { userState, ...other } = userStateMessage(baseMessage)

  return {
    userState: {
      ...userState,
      emoteSets: undefined,
    },
    ...other,
  }
}

const noticeMessage = baseMessage => {
  const { state, ...other } = baseMessage

  const event = toUpper(state.msgId)

  switch (state.msgId) {
    case constants.NOTICE_MESSAGE_IDS.ROOM_MODS:
      return { event, state, mods: mods(other.message), ...other }
    default:
      return { event, state, ...other }
  }
}

const userNoticeMessage = baseMessage => {
  const { userState, ...other } = privateMessage(baseMessage)

  switch (userState.msgId) {
    case constants.USER_NOTICE_MESSAGE_IDS.SUBSCRIPTION:
      return {
        userState,
        ...other,
        event: constants.EVENTS.SUBSCRIPTION,
        systemMessage: generalString(userState.systemMsg),
        months: userState.msgParamMonths,
        subPlan: userState.msgParamSubPlan,
        subPlanName: generalString(userState.msgParamSubPlanName),
      }
    case constants.USER_NOTICE_MESSAGE_IDS.RESUBSCRIPTION:
      return {
        userState,
        ...other,
        event: constants.EVENTS.RESUBSCRIPTION,
        systemMessage: generalString(userState.systemMsg),
        months: userState.msgParamMonths,
        subPlan: userState.msgParamSubPlan,
        subPlanName: generalString(userState.msgParamSubPlanName),
      }
    case constants.USER_NOTICE_MESSAGE_IDS.SUBSCRIPTION_GIFT:
      return {
        userState,
        ...other,
        event: constants.EVENTS.SUBSCRIPTION_GIFT,
        systemMessage: generalString(userState.systemMsg),
        recipientDisplayName: userState.msgParamRecipientDisplayName,
        recipientId: userState.msgParamRecipientId,
        recipientUserName: userState.msgParamRecipientName,
      }
    case constants.USER_NOTICE_MESSAGE_IDS.RAID:
      return {
        userState,
        ...other,
        event: constants.EVENTS.RAID,
        systemMessage: generalString(userState.systemMsg),
        raiderDisplayName: userState.msgParamDisplayName,
        raiderUserName: userState.msgParamLogin,
        raiderViewerCount: userState.msgParamViewerCount,
      }
    case constants.USER_NOTICE_MESSAGE_IDS.RITUAL:
      return {
        userState,
        ...other,
        event: constants.EVENTS.RITUAL,
        systemMessage: generalString(userState.systemMsg),
        ritualName: userState.msgParamRitualName,
      }
    default:
      return { userState, ...other }
  }
}

const generalString = maybeMessage => replace(maybeMessage, /\\s/g, ' ')

const generalNumber = maybeNumber => {
  const number = parseInt(maybeNumber, 10)
  return isFinite(number) ? number : undefined
}

const generalBoolean = maybeBoolean => maybeBoolean === '1'

const generalTimestamp = maybeTimestamp => {
  const timestamp = new Date(parseInt(maybeTimestamp, 10))
  return timestamp.toString() !== 'Invalid Date' ? timestamp : new Date()
}

const userType = maybeUserType => {
  return typeof maybeUserType === 'string' ? maybeUserType : undefined
}

const broadcasterLanguage = maybeLanguage => {
  return typeof maybeLanguage === 'string' ? maybeLanguage : undefined
}

const badges = maybeBadges => {
  return typeof maybeBadges === 'string'
    ? maybeBadges.split(',').reduce((parsed, badge) => {
        const [key, value] = badge.split('/')
        return { ...parsed, [key]: parseInt(value, 10) }
      }, {})
    : {}
}

const emotes = maybeEmotes => {
  return typeof maybeEmotes === 'string'
    ? maybeEmotes.split('/').reduce((parsed, emote) => {
        const [key, value] = emote.split(':')
        const [start, end] = value.split('-')
        return {
          ...parsed,
          [key]: { start: parseInt(start, 10), end: parseInt(end, 10) },
        }
      }, {})
    : {}
}

const emoteSets = maybeEmoteSets => {
  return typeof maybeEmoteSets === 'string'
    ? maybeEmoteSets.split(',')
    : undefined
}

const bits = maybeBits => {
  return gt(maybeBits, 0)
    ? { event: 'CHEER', bits: parseInt(maybeBits, 10) }
    : {}
}

const mods = message => {
  const [, modList] = message.split(': ')

  return modList.split(', ')
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
