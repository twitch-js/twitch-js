import BaseError from '../utils/BaseError'
import * as constants from './constants'

class ChatError extends BaseError {
  command: Commands | Events

  constructor(error: Error | string, message?: BaseMessage | string) {
    const errorMessage = error instanceof Error ? error.message : error
    super(`${errorMessage} [Chat]`)

    if (typeof message !== 'string') {
      this.command = message.command
    }
  }
}

export class AuthenticationError extends ChatError {
  constructor(error: Error, message?: BaseMessage) {
    super('Authentication error encountered', message)

    Object.assign(this, error)
  }
}

export class ParseError extends ChatError {
  _raw: string

  constructor(error: Error, rawMessage: string) {
    super('Parse error encountered')

    Object.assign(this, error)

    this._raw = rawMessage
    this.command = ChatEvents.PARSE_ERROR_ENCOUNTERED
  }
}

export class JoinError extends ChatError {
  constructor(message = 'Error: join') {
    super(message)
  }
}

export class TimeoutError extends ChatError {
  constructor(message = 'Error: timeout') {
    super(message)
  }
}

export default ChatError
