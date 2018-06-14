import { parse } from 'irc-message'
import camelcaseKeys from 'camelcase-keys'

import { gt, isEmpty, isFinite, replace, toLower, toUpper } from 'lodash'

import * as constants from '../constants'

const base = rawMessages => {
  const rawMessagesV = rawMessages.replace(/\r\n$/, '').split(/\n/g)

  return rawMessagesV.map(rawMessage => {
    const { raw, tags, command, params: [channel, message] } = parse(rawMessage)

    return {
      _raw: raw,
      timestamp: timestamp(parseInt(tags['tmi-sent-ts'], 10)),
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

  return {
    ...baseMessage,
    channel,
    command,
    username,
    message: undefined,
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
    // User banned.
    return {
      ...other,
      state: {
        ...state,
        banReason: generalMessage(state.banReason),
      },
      event: constants.EVENTS.USER_BANNED,
      username,
    }
  }

  // Chat cleared.
  return {
    ...other,
  }
}

const globalUserStateMessage = baseMessage => {
  const { state: userState, ...other } = baseMessage

  return {
    userState: {
      ...userState,
      badges: badges(userState.badges),
      emotes: emotes(userState.emotes),
      emoteSets: emoteSets(userState.emoteSets),
      userType: userType(userState.userType),
      isTurboSubscriber: boolean(userState.turbo),
      username: toLower(userState.displayName),
    },
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
      isModerator: boolean(userState.mod),
      isSubscriber: boolean(userState.subscriber),
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
    roomState: {
      roomId: roomState.roomId,
      broadcasterLanguage: broadcasterLanguage(roomState.broadcasterLang),
      isFollowersOnly: boolean(roomState.followersOnly),
      isSubscribersOnly: boolean(roomState.subsOny),
      isEmoteOnly: boolean(roomState.emoteOnly),
      isR9kEnabled: boolean(roomState.r9k),
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
        systemMessage: generalMessage(userState.systemMsg),
        months: userState.msgParamMonths,
        subPlan: userState.msgParamSubPlan,
        subPlanName: generalMessage(userState.msgParamSubPlanName),
      }
    case constants.USER_NOTICE_MESSAGE_IDS.RESUBSCRIPTION:
      return {
        userState,
        ...other,
        event: constants.EVENTS.RESUBSCRIPTION,
        systemMessage: generalMessage(userState.systemMsg),
        months: userState.msgParamMonths,
        subPlan: userState.msgParamSubPlan,
        subPlanName: generalMessage(userState.msgParamSubPlanName),
      }
    case constants.USER_NOTICE_MESSAGE_IDS.SUBSCRIPTION_GIFT:
      return {
        userState,
        ...other,
        event: constants.EVENTS.SUBSCRIPTION_GIFT,
        systemMessage: generalMessage(userState.systemMsg),
        recipientDisplayName: userState.msgParamRecipientDisplayName,
        recipientId: userState.msgParamRecipientId,
        recipientUserName: userState.msgParamRecipientName,
      }
    case constants.USER_NOTICE_MESSAGE_IDS.RAID:
      return {
        userState,
        ...other,
        event: constants.EVENTS.RAID,
        systemMessage: generalMessage(userState.systemMsg),
        raiderDisplayName: userState.msgParamDisplayName,
        raiderUserName: userState.msgParamLogin,
        raiderViewerCount: userState.msgParamViewerCount,
      }
    case constants.USER_NOTICE_MESSAGE_IDS.RITUAL:
      return {
        userState,
        ...other,
        event: constants.EVENTS.RITUAL,
        systemMessage: generalMessage(userState.systemMsg),
        ritualName: userState.msgParamRitualName,
      }
    default:
      return { userState, ...other }
  }
}

const timestamp = maybeTimestamp => {
  const timestamp = new Date(parseInt(maybeTimestamp, 10))
  return timestamp.toString() !== 'Invalid Date' ? timestamp : new Date()
}

const boolean = maybeBoolean => maybeBoolean === '1'

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

const generalMessage = maybeMessage => replace(maybeMessage, /\\s/g, ' ')

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
