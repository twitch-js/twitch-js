import BaseError from '../utils/BaseError'
import * as constants from './constants'

class ChatError extends BaseError {
  constructor(message, ...other) {
    super(`${message} [Chat]`, ...other)
  }
}

class AuthenticationError extends ChatError {
  constructor(message, ...other) {
    super('Authentication error encountered', ...other)

    this._raw = message._raw
    this.command = constants.EVENTS.AUTHENTICATION_FAILED
  }
}

class ParseError extends ChatError {
  constructor(error, rawMessage, ...other) {
    super('Parse error encountered', ...other)

    this._raw = rawMessage
    this.command = constants.EVENTS.PARSE_ERROR_ENCOUNTERED
    this.message = error
  }
}

class JoinError extends ChatError {
  constructor(message, ...other) {
    super('Join error encountered', ...other)
  }
}

class TimeoutError extends ChatError {
  constructor(message, ...other) {
    super('Timeout error encountered', ...other)
  }
}

export { AuthenticationError, ParseError, JoinError, TimeoutError }
