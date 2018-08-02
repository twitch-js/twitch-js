import BaseError from '../utils/BaseError'
import * as constants from './constants'

class ChatError extends BaseError {
  constructor(message, ...other) {
    super(`${message} [Chat]`, ...other)
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

export { ParseError, JoinError, TimeoutError }
