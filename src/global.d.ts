declare module 'better-queue-memory'
declare module 'core-js-pure/stable/set-immediate'

declare module 'irc-message' {
  export interface Message {
    raw: string
    tags: { [key: string]: string }
    command: Commands
    prefix: string
    params: string[]
  }

  export function parse(message: string): Message
}
