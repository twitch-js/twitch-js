import * as twitchTypes from '../twitch'

import { FetchOptions } from '../utils/fetch'
import { Options as LoggerOptions } from '../utils/logger'

export type ApiOptions = {
  clientId?: string
  token?: string
  log?: LoggerOptions
  onAuthenticationFailure?: () => Promise<string>
}

export enum ApiReadyStates {
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

export type ApiHeaders = {
  'Client-ID': string
  Accept?: string
  Authorization?: string
}

type ApiVersionOptions = {
  version?: twitchTypes.ApiVersions
}

export type ApiFetchOptions = FetchOptions & ApiVersionOptions
