import * as constants from '../constants'

/**
 * Message weight properties
 * @typedef {Object} MessageWeightProps
 * @property {boolean} isModerator=false
 * @property {boolean} isKnownBot=false
 * @property {boolean} isVerifiedBot=false
 */

/**
 * Returns message weight
 * @param {MessageWeightProps} options={}
 * @return {number} Message weight
 */
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

export { getMessageQueueWeight }
