import { FetchOptions } from '../utils/fetch'
import { LoggerOptions } from '../utils/logger'

export type ApiOptions = {
  token: string
  clientId: string
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

export type ApiHeaders = Record<string, string> & {
  'Client-ID'?: string
  Accept?: string
  Authorization?: string
}

export type ApiFetchOptions = FetchOptions
