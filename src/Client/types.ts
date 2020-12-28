import { Commands } from '../twitch'
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
  PARSE_ERROR_ENCOUNTERED = 'PARSE_ERROR_ENCOUNTERED',
}

export const ClientEvents = { ...Commands, ...Events }
export type ClientEvents = Commands | Events
