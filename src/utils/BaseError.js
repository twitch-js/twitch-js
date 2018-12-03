/**
 * @class
 * @extends Error
 */
class BaseError extends Error {
  /**
   * @arg {string} message
   * @arg {...any} params
   */
  constructor(message, ...params) {
    super(message, ...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError)
    }

    /** @prop {string} message */
    this.message = `[TwitchJS] > ${message}`

    /** @prop {Date} timestamp */
    this.timestamp = new Date()
  }
}

export default BaseError
