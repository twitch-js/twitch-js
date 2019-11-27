import { ConsolaOptions } from 'consola'

import { Options as BaseFetchOptions } from '../utils/fetch'

export type Options = {
  clientId: string
  token?: string
  log?: ConsolaOptions
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

export const Settings: Record<ApiVersions, ApiSettings> = {
  [ApiVersions.Helix]: {
    baseUrl: 'https://api.twitch.tv/helix',
    authorizationHeader: 'Bearer',
  },
  [ApiVersions.Kraken]: {
    baseUrl: 'https://api.twitch.tv/kraken',
    authorizationHeader: 'OAuth',
  },
}

export type Headers = {
  'Client-ID': string
  Accept?: string
  Authorization?: string
}

export type FetchOptions = BaseFetchOptions & { version?: ApiVersions }
