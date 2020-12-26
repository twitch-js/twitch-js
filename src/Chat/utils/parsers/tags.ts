import camelCase from 'lodash/camelCase'
import gt from 'lodash/gt'
import toLower from 'lodash/toLower'

import {
  BaseTags,
  ClearChatTags,
  GlobalUserStateTags,
  ChatEvents,
  Commands,
  RoomStateTags,
  UserStateTags,
  MessageParameters,
} from '../../../twitch'

import * as constants from '../../constants'
import * as helpers from './helpers'

export const clearChat = (tags: BaseTags): ClearChatTags => ({
  ...tags,
  banReason: helpers.generalString(tags.banReason),
  banDuration: helpers.generalNumber(tags.banDuration),
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
  }, {} as MessageParameters)

export const userState = (tags: BaseTags): UserStateTags => ({
  ...tags,
  badges: helpers.badges(tags.badges),
  bits: helpers.generalNumber(tags.bits),
  color: tags.color,
  displayName: tags.displayName,
  emotes: helpers.emotes(tags.emotes),
  emoteSets: helpers.emoteSets(tags.emoteSets),
  userType: helpers.userType(tags.userType),
  username: tags.displayName ? toLower(tags.displayName) : tags.username,
  isModerator: tags.mod === '1',
})

export const globalUserState = (tags: BaseTags): GlobalUserStateTags => ({
  ...tags,
  ...userState(tags),
})

export const privateMessage = userState

export const userNotice = userState
