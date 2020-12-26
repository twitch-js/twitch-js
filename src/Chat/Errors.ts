import { BaseMessage, ChatEvents } from '../twitch'

import BaseError from '../utils/BaseError'

export class ChatError extends BaseError {
  command?: string

  constructor(error: Error | string, message?: BaseMessage | string) {
    super(`${error instanceof Error ? error.message : error} [Chat]`)
    Object.setPrototypeOf(this, ChatError.prototype)

    if (typeof message !== 'undefined' && typeof message !== 'string') {
      this.command = message.command
    }
  }
}

export class AuthenticationError extends ChatError {
  constructor(error: Error, message?: BaseMessage) {
    super('Authentication error encountered', message)
    Object.setPrototypeOf(this, AuthenticationError.prototype)

    Object.assign(this, error)
    Object.assign(this, message)
  }
}

export class ParseError extends ChatError {
  _raw: string

  constructor(error: Error, rawMessage: string) {
    super('Parse error encountered')
    Object.setPrototypeOf(this, ParseError.prototype)

    Object.assign(this, error)

    this._raw = rawMessage
    this.command = ChatEvents.PARSE_ERROR_ENCOUNTERED
  }
}

export class JoinError extends ChatError {
  constructor(message = 'Error: join') {
    super(message)
    Object.setPrototypeOf(this, JoinError.prototype)
  }
}

export class TimeoutError extends ChatError {
  constructor(message = 'Error: timeout') {
    super(message)
    Object.setPrototypeOf(this, TimeoutError.prototype)
  }
}
