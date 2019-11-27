class BaseError extends Error {
  timestamp: Date = new Date()

  constructor(message: string) {
    super(message)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError)
    }

    this.message = `${message} [TwitchJS]`
    this.timestamp
  }
}

export default BaseError
