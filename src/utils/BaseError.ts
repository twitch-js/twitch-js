class BaseError extends Error {
  timestamp: Date = new Date()

  constructor(message: string) {
    super(message)

    /**
     * Set the prototype explicitly.
     * @see https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
     */
    Object.setPrototypeOf(this, BaseError.prototype)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseError)
    }

    this.message = `[TwitchJS] ${message}`
  }
}

export default BaseError
