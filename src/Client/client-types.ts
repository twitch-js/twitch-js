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

export enum BaseClientEvents {
  RAW = 'RAW',

  ALL = '*',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RECONNECT = 'RECONNECT',
  AUTHENTICATED = 'AUTHENTICATED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',

  ERROR_ENCOUNTERED = 'ERROR_ENCOUNTERED',
}

export const ClientEvents = { ...Commands, ...BaseClientEvents }
export type ClientEvents = Commands | BaseClientEvents

export type ClientEventTypes = {
  [ClientEvents.RAW]: [string]
  [ClientEvents.ALL]: [BaseMessage]
  [ClientEvents.CONNECTED]: [BaseMessage]
  [ClientEvents.DISCONNECTED]: []
  [ClientEvents.RECONNECT]: []
  [ClientEvents.AUTHENTICATED]: [BaseMessage]
  [ClientEvents.AUTHENTICATION_FAILED]: [BaseMessage]
  [ClientEvents.ERROR_ENCOUNTERED]: [Error]
}
