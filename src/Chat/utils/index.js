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

const defer = cb => {
  if (typeof self.setImmediate !== 'undefined') {
    return self.setImmediate(cb)
  }

  return self.setTimeout(cb, 0)
}

export { getMessageQueueWeight, defer }
