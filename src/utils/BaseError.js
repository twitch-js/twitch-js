class BaseError extends Error {
  constructor(message, ...params) {
    super(message, ...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError)
    }

    this.message = `${message} [TwitchJS]`
    this.timestamp = new Date()
  }
}

export default BaseError
