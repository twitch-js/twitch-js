import { CustomError } from 'ts-custom-error'

class TwitchJSError extends CustomError {
  timestamp: Date = new Date()

  constructor(message: string) {
    super(message)
    Object.defineProperty(this, 'name', { value: 'TwitchJSError' })
  }
}

export default TwitchJSError
