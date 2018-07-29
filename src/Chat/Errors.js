import BaseError from '../utils/BaseError'
import * as constants from './constants'

class AuthenticationError extends BaseError {
  constructor(message, ...other) {
    super('Authentication error encountered', ...other)

    this._raw = message._raw
    this.command = constants.EVENTS.AUTHENTICATION_FAILED
  }
}

class ParseError extends BaseError {
  constructor(error, rawMessage, ...other) {
    super('Parse error encountered', ...other)

    this._raw = rawMessage
    this.command = constants.EVENTS.PARSE_ERROR_ENCOUNTERED
    this.message = error
  }
}

export { AuthenticationError, ParseError }
