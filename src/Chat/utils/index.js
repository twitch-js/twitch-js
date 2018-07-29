import * as constants from '../constants'

const getMessageQueueWeight = ({
  isModerator = false,
  isKnownBot = false,
  isVerifiedBot = false,
} = {}) => {
  if (isVerifiedBot) {
    return constants.RATE_LIMIT_VERIFIED_BOT
  } else if (isKnownBot) {
    return constants.RATE_LIMIT_KNOWN_BOT
  } else if (isModerator) {
    return constants.RATE_LIMIT_MODERATOR
  }
  return constants.RATE_LIMIT_USER
}

const isAuthenticationFailedMessage = (message = {}) =>
  message.command === constants.EVENTS.NOTICE &&
  message.channel === '*' &&
  message.message === 'Login authentication failed'

export { getMessageQueueWeight, isAuthenticationFailedMessage }
