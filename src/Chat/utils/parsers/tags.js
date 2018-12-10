import { camelCase, gt, toLower, toUpper } from 'lodash'

import * as constants from '../../constants'
import * as types from './types'

const clearChat = tags => ({
  /**
   * CLEARCHAT tags
   * @typedef {Object} ClearChatTags
   * @property {string} [banReason]
   * @property {number} [banDuration]
   * @see https://dev.twitch.tv/docs/irc/tags#clearchat-twitch-tags
   */
  ...tags,
  banReason: types.generalString(tags.banReason),
  banDuration: types.generalNumber(tags.banDuration),
})

const globalUserState = tags => ({
  /**
   * GLOBALUSERSTATE tags
   * @typedef {Object} GlobalUserStateTags
   * @property {Array<string>} emoteSets
   * @property {string} userType
   * @property {string} username
   * @see https://dev.twitch.tv/docs/irc/tags#globaluserstate-twitch-tags
   */
  ...tags,
  emoteSets: types.emoteSets(tags.emoteSets),
  userType: types.userType(tags.userType),
  username: toLower(tags.displayName),
})

const privateMessage = (...args) =>
  userState(
    /** PRIVMSG tags
     * @typedef {UserStateTags} PrivateMessageTags
     * @see https://dev.twitch.tv/docs/irc/tags#privmsg-twitch-tags
     */
    ...args,
  )

const privateMessageCheerEvent = tags => {
  return gt(tags.bits, 0)
    ? { event: constants.EVENTS.CHEER, bits: parseInt(tags.bits, 10) }
    : {}
}

const roomState = roomStateTags =>
  /**
   * ROOMSTATE Tag
   * @typedef {Object} RoomStateTags
   * @property {string} [broadcasterLang]
   * @property {boolean} emoteOnly
   * @property {boolean|number} followersOnly
   * @property {boolean} r9k
   * @property {number} slow
   * @property {boolean} subsOnly
   * @see https://dev.twitch.tv/docs/irc/tags#roomstate-twitch-tags
   */
  Object.entries(roomStateTags).reduce((tags, [tag, value]) => {
    switch (tag) {
      case 'followersOnly':
        return { ...tags, [tag]: types.followersOnly(value) }
      // Strings
      case 'broadcasterLang':
        return { ...tags, [tag]: types.generalString(value) }
      // Numbers
      case 'slow':
        return { ...tags, [tag]: types.generalNumber(value) }
      // Booleans
      case 'emoteOnly':
      case 'r9k':
      case 'subsOnly':
        return { ...tags, [tag]: types.generalBoolean(value) }
      default:
        return { ...tags, [tag]: value }
    }
  }, {})

const userNotice = (...args) =>
  userState(
    /** USERNOTICE tags
     * @typedef {UserStateTags} UserNoticeTags
     * @see https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags
     */
    ...args,
  )

const userNoticeMessageParameters = tags =>
  Object.entries(tags).reduce((parameters, [tag, value]) => {
    const [, param] = constants.MESSAGE_PARAMETER_PREFIX_RE.exec(tag) || []

    switch (param) {
      // Numbers.
      case 'Months':
      case 'MassGiftCount':
      case 'PromoGiftTotal':
      case 'SenderCount':
      case 'ViewerCount':
        return { ...parameters, [camelCase(param)]: types.generalNumber(value) }
      // Not a msgParam.
      case undefined:
        return parameters
      // Strings
      default:
        return { ...parameters, [camelCase(param)]: types.generalString(value) }
    }
  }, {})

const userNoticeEvent = tags => {
  switch (tags.msgId) {
    case constants.USER_NOTICE_MESSAGE_IDS.ANON_GIFT_PAID_UPGRADE:
      return constants.EVENTS.ANON_GIFT_PAID_UPGRADE
    case constants.USER_NOTICE_MESSAGE_IDS.GIFT_PAID_UPGRADE:
      return constants.EVENTS.GIFT_PAID_UPGRADE
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

const userState = tags => ({
  /**
   * USERSTATE tags
   * @typedef {Object} UserStateTags
   * @property {BadgesTag} badges
   * @property {Array<EmoteTag>} emotes
   * @property {Array<string>} emoteSets
   * @property {number} [bits]
   * @see https://dev.twitch.tv/docs/irc/tags#userstate-twitch-tags
   */
  ...tags,
  badges: types.badges(tags.badges),
  bits: types.generalNumber(tags.bits),
  emotes: types.emotes(tags.emotes),
  emoteSets: types.emoteSets(tags.emoteSets),
  userType: types.userType(tags.userType),
})

export {
  clearChat,
  globalUserState,
  privateMessage,
  privateMessageCheerEvent,
  roomState,
  userNotice,
  userNoticeMessageParameters,
  userNoticeEvent,
  userState,
}
