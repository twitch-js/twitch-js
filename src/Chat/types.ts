import {
  UserStateTags,
  RoomStateTags,
  PrivateMessage,
  Messages,
  Events,
} from '../twitch'
import { Options as LoggerOptions } from '../utils/logger'

export type Options = {
  username?: string
  /**
   * OAuth token
   * @see https://twitchtokengenerator.com/ to generate a token
   */
  token?: string
  /**
   * Bot is known
   * @see https://dev.twitch.tv/docs/irc/guide/#known-and-verified-bots
   */
  isKnown?: boolean
  /**
   * Bot is verified
   * @see https://dev.twitch.tv/docs/irc/guide/#known-and-verified-bots
   */
  isVerified?: boolean
  connectionTimeout?: number
  joinTimeout?: number
  log?: LoggerOptions
  onAuthenticationFailure?: () => Promise<string>
} & ClientOptions

export type ClientOptions = {
  username?: string
  token?: string
  isKnown?: boolean
  isVerified?: boolean
  server?: string
  port?: number
  ssl?: boolean
  log?: LoggerOptions
}

export type ChannelStates = Record<
  string,
  { userState: UserStateTags; roomState: RoomStateTags }
>

export type EventTypes = {
  [Events.RAW]: [string]
  [Events.ALL]: [Messages]
  [Events.PRIVATE_MESSAGE]: [PrivateMessage]
}
