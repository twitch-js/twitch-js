import { BaseMessage, Commands } from '../twitch'
import { LoggerOptions } from '../utils/logger'

export type ClientOptions = {
  username?: string
  token?: string
  isKnown: boolean
  isVerified: boolean
  server: string
  port: number
  ssl: boolean
  log?: LoggerOptions
}

export enum Events {
  RAW = 'RAW',

  ALL = '*',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RECONNECT = 'RECONNECT',
  AUTHENTICATED = 'AUTHENTICATED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',

  ERROR_ENCOUNTERED = 'ERROR_ENCOUNTERED',
}

export const ClientEvents = { ...Commands, ...Events }
export type ClientEvents = Commands | Events

export type ClientEventTypes = {
  [Events.RAW]: [string]
  [Events.ALL]: [BaseMessage]
  [Events.CONNECTED]: [BaseMessage]
  [Events.DISCONNECTED]: []
  [Events.RECONNECT]: []
  [Events.AUTHENTICATED]: [BaseMessage]
  [Events.AUTHENTICATION_FAILED]: [BaseMessage]
  [Events.ERROR_ENCOUNTERED]: [Error]
} & {
  [eventName: string]: [BaseMessage]
}
