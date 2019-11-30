import camelCase from 'lodash-es/camelCase'
import gt from 'lodash-es/gt'
import toLower from 'lodash-es/toLower'
import toUpper from 'lodash-es/toUpper'

import * as constants from '../../constants'
import * as helpers from './helpers'

export const clearChat = (tags: BaseTags): ClearChatTags => ({
  ...tags,
  banReason: helpers.generalString(tags.banReason),
  banDuration: helpers.generalNumber(tags.banDuration),
})

export const globalUserState = (tags: BaseTags): GlobalUserStateTags => ({
  ...tags,
  emoteSets: helpers.emoteSets(tags.emoteSets),
  userType: helpers.userType(tags.userType),
  username: toLower(tags.displayName),
})

export const privateMessageCheerEvent = (tags: BaseTags) => {
  return gt(tags.bits, 0)
    ? { event: ChatEvents.CHEER, bits: parseInt(tags.bits, 10) }
    : { event: Commands.PRIVATE_MESSAGE }
}

export const roomState = (roomStateTags: BaseTags): RoomStateTags =>
  Object.entries(roomStateTags).reduce((tags, [tag, value]) => {
    switch (tag) {
      case 'followersOnly':
        return { ...tags, [tag]: helpers.followersOnly(value) }
      // Strings
      case 'broadcasterLang':
        return { ...tags, [tag]: helpers.generalString(value) }
      // Numbers
      case 'slow':
        return { ...tags, [tag]: helpers.generalNumber(value) }
      // Booleans
      case 'emoteOnly':
      case 'r9k':
      case 'subsOnly':
        return { ...tags, [tag]: helpers.generalBoolean(value) }
      default:
        return { ...tags, [tag]: value }
    }
  }, {})

export const userNoticeMessageParameters = (tags: BaseTags) =>
  Object.entries(tags).reduce((parameters, [tag, value]) => {
    const [, param] = constants.MESSAGE_PARAMETER_PREFIX_RE.exec(tag) || []

    switch (param) {
      // Numbers.
      case 'Months':
      case 'MassGiftCount':
      case 'PromoGiftTotal':
      case 'SenderCount':
      case 'ViewerCount':
        return {
          ...parameters,
          [camelCase(param)]: helpers.generalNumber(value),
        }
      // Not a msgParam.
      case undefined:
        return parameters
      // Strings
      default:
        return {
          ...parameters,
          [camelCase(param)]: helpers.generalString(value),
        }
    }
  }, {} as UserNoticeMessageParameterTags)

export const userNoticeEvent = (tags: BaseTags) => {
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

export const userState = (tags: BaseTags): UserStateTags => ({
  ...tags,
  badges: helpers.badges(tags.badges),
  bits: helpers.generalNumber(tags.bits),
  color: tags.color,
  displayName: tags.displayName,
  emotes: helpers.emotes(tags.emotes),
  emoteSets: helpers.emoteSets(tags.emoteSets),
  userType: helpers.userType(tags.userType),
})

export const privateMessage = userState

export const userNotice = userState
