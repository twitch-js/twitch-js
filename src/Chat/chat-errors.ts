import { TwitchJSError } from '../utils/error'

export * from '../utils/error'

export class ChatError extends TwitchJSError {
  public constructor(message: string, public body?: any) {
    super(message)
    Object.defineProperty(this, 'name', {
      value: 'TwitchJSChatError',
    })
  }
}

export class ParseError extends TwitchJSError {
  public constructor(message: string, public body?: any) {
    super(message)
    Object.defineProperty(this, 'name', {
      value: 'TwitchJSChatParseError',
    })
  }
}

export class JoinError extends TwitchJSError {
  public constructor(message: string, public body?: any) {
    super(message)
    Object.defineProperty(this, 'name', {
      value: 'TwitchJSChatJoinError',
    })
  }
}

export class TimeoutError extends TwitchJSError {
  public constructor(message: string, public body?: any) {
    super(message)
    Object.defineProperty(this, 'name', {
      value: 'TwitchJSChatTimeoutError',
    })
  }
}
