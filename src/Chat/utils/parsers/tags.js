import { camelCase, replace, startsWith, toLower, toUpper } from 'lodash'

import * as constants from '../../constants'
import * as types from './types'

/**
 * CLEARCHAT tags
 * @typedef {Object} ClearChatTags
 * @property {string} [banReason]
 * @property {number} [banDuration]
 * @see https://dev.twitch.tv/docs/irc/tags#clearchat-twitch-tags
 */
const clearChat = tags => ({
  ...tags,
  banReason: types.generalString(tags.banReason),
  banDuration: types.generalNumber(tags.banDuration),
})

/**
 * GLOBALUSERSTATE tags
 * @typedef {Object} GlobalUserStateTags
 * @property {Array<string>} emoteSets
 * @property {string} userType
 * @property {string} username
 * @property {boolean} isTurboSubscriber
 * @see https://dev.twitch.tv/docs/irc/tags#globaluserstate-twitch-tags
 */
const globalUserState = tags => ({
  ...tags,
  emoteSets: types.emoteSets(tags.emoteSets),
  userType: types.userType(tags.userType),
  username: toLower(tags.displayName),
  isTurboSubscriber: types.generalBoolean(tags.turbo),
})

/** PRIVMSG tags
 * @typedef {UserStateTags} PrivateMessageTags
 * @see https://dev.twitch.tv/docs/irc/tags#privmsg-twitch-tags
 */
const privateMessage = (...args) => userState(...args)

/**
 * ROOMSTATE Tag
 * @typedef {Object} RoomStateTags
 * @property {string} broadcasterLanguage
 * @property {number} slowDelay
 * @property {boolean} isFollowersOnly
 * @property {boolean} isSubscribersOnly
 * @property {boolean} isEmoteOnly
 * @property {boolean} isR9kEnabled
 * @see https://dev.twitch.tv/docs/irc/tags#roomstate-twitch-tags
 */
const roomState = tags => ({
  ...tags,
  broadcasterLanguage: types.broadcasterLanguage(tags.broadcasterLang),
  slowDelay: parseInt(tags.slow, 10),
  isEmoteOnly: types.generalBoolean(tags.emoteOnly),
  isFollowersOnly: types.generalBoolean(tags.followersOnly),
  isR9kEnabled: types.generalBoolean(tags.r9k),
  isSubscribersOnly: types.generalBoolean(tags.subsOnly),
})

/** USERNOTICE tags
 * @typedef {UserStateTags} UserNoticeTags
 * @see https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags
 */
const userNotice = (...args) => userState(...args)

const userNoticeMessageParameters = tags =>
  Object.entries(tags).reduce((parameters, [key, value]) => {
    if (startsWith(key, 'msgParam')) {
      const parsedKey = camelCase(replace(key, /^msgParam/, ''))

      switch (key) {
        case 'msgParamMonths':
        case 'msgParamMassGiftCount':
        case 'msgParamSenderCount':
        case 'msgParamViewerCount':
          return {
            ...parameters,
            [parsedKey]: types.generalNumber(value),
          }
        default:
          return {
            ...parameters,
            [parsedKey]: types.generalString(value),
          }
      }
    }
    return parameters
  }, {})

const userNoticeEvent = tags => {
  switch (tags.msgId) {
    case constants.USER_NOTICE_MESSAGE_IDS.RESUBSCRIPTION:
      return constants.EVENTS.RESUBSCRIPTION

    case constants.USER_NOTICE_MESSAGE_IDS.RAID:
      return constants.EVENTS.RAID
    case constants.USER_NOTICE_MESSAGE_IDS.RITUAL:
      return constants.EVENTS.RITUAL
    case constants.USER_NOTICE_MESSAGE_IDS.SUBSCRIPTION:
      return constants.EVENTS.SUBSCRIPTION
    case constants.USER_NOTICE_MESSAGE_IDS.SUBSCRIPTION_GIFT:
      return constants.EVENTS.SUBSCRIPTION_GIFT
    case constants.USER_NOTICE_MESSAGE_IDS.SUBSCRIPTION_GIFT_COMMUNITY:
      return constants.EVENTS.SUBSCRIPTION_GIFT_COMMUNITY
    default:
      return toUpper(tags.msgId)
  }
}

/**
 * USERSTATE tags
 * @typedef {Object} UserStateTags
 * @property {BadgesTag} badges
 * @property {number} [bits]
 * @property {Object<number, EmoteTag>} emotes
 * @property {Array<string>} emoteSets
 * @property {boolean} isModerator
 * @property {boolean} isSubscriber
 * @property {boolean} isTurboSubscriber
 * @see https://dev.twitch.tv/docs/irc/tags#userstate-twitch-tags
 */
const userState = tags => ({
  ...tags,
  badges: types.badges(tags.badges),
  bits: types.generalNumber(tags.bits),
  emotes: types.emotes(tags.emotes),
  emoteSets: types.emoteSets(tags.emoteSets),
  userType: types.userType(tags.userType),
  isModerator: types.generalBoolean(tags.mod),
  isSubscriber: types.generalBoolean(tags.subscriber),
  isSubGifter: /sub-gifter\/\d/.test(tags.badges),
  isTurboSubscriber: types.generalBoolean(tags.turbo),
})

export {
  clearChat,
  globalUserState,
  privateMessage,
  roomState,
  userNotice,
  userNoticeMessageParameters,
  userNoticeEvent,
  userState,
}
