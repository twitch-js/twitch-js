import * as twitchTypes from '../twitch'

import { Options as BaseFetchOptions } from '../utils/fetch'
import { Options as LoggerOptions } from '../utils/logger'

export type Options = {
  clientId: string
  token?: string
  log?: LoggerOptions
  onAuthenticationFailure?: () => Promise<string>
}

export enum ReadyStates {
  'NOT_READY',
  'READY',
  'INITIALIZED',
}

export type ApiSettings = {
  baseUrl: string
  authorizationHeader: string
}

export const Settings: Record<twitchTypes.ApiVersions, ApiSettings> = {
  [twitchTypes.ApiVersions.Helix]: {
    baseUrl: 'https://api.twitch.tv/helix',
    authorizationHeader: 'Bearer',
  },
  [twitchTypes.ApiVersions.Kraken]: {
    baseUrl: 'https://api.twitch.tv/kraken',
    authorizationHeader: 'OAuth',
  },
}

export type Headers = {
  'Client-ID': string
  Accept?: string
  Authorization?: string
}

export type FetchOptions = BaseFetchOptions & {
  version?: twitchTypes.ApiVersions
}
