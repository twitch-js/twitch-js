import { CustomError } from 'ts-custom-error'

export class TwitchJSError extends CustomError {
  timestamp: Date = new Date()

  constructor(message: string) {
    super(message)
    Object.defineProperty(this, 'name', { value: 'TwitchJSError' })
  }
}

export class AuthenticationError extends TwitchJSError {
  public constructor(message: string, public body?: any) {
    super(message)
    Object.defineProperty(this, 'name', {
      value: 'TwitchJSAuthenticationError',
    })
  }
}
