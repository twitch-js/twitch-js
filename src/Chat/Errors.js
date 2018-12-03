import BaseError from '../utils/BaseError'
import * as constants from './constants'

/**
 * @class
 * @extends BaseError
 * @classdesc Base error for the chat module
 * @inheritdoc
 */
class ChatError extends BaseError {
  /**
   * @arg {string} message
   * @arg {...any} other
   */
  constructor(message, ...other) {
    super(`[Chat] > ${message}`, ...other)
  }
}

/**
 * @class
 * @extends ChatError
 * @inheritdoc
 */
class AuthenticationError extends ChatError {
  /**
   * @arg {string} error
   * @arg {...any} other
   */
  constructor(error, ...other) {
    super('Authentication error encountered', ...other)

    Object.assign(this, error)
  }
}

/**
 * @class
 * @extends ChatError
 * @inheritdoc
 */
class ParseError extends ChatError {
  /**
   * @arg {string} error
   * @arg {string} rawMessage
   * @arg {...any} other
   */
  constructor(error, rawMessage, ...other) {
    super('Parse error encountered', ...other)

    /** @prop {string} _raw */
    this._raw = rawMessage

    /** @prop {string} command */
    this.command = constants.EVENTS.PARSE_ERROR_ENCOUNTERED

    /** @prop {string} message */
    this.message = error

    /** @prop {string} stack */
    this.stack = error.stack
  }
}

/**
 * @class
 * @extends ChatError
 * @inheritdoc
 */
class JoinError extends ChatError {
  /**
   * @arg {string} message
   * @arg  {...any} other
   */
  constructor(message, ...other) {
    super('Join error encountered', ...other)
  }
}

/**
 * @class
 * @extends ChatError
 * @inheritdoc
 */
class TimeoutError extends ChatError {
  /**
   * @arg {string} message
   * @arg {...any} other
   */
  constructor(message, ...other) {
    super('Timeout error encountered', ...other)
  }
}

export { AuthenticationError, ParseError, JoinError, TimeoutError }
export default ChatError
