import includes from 'lodash/includes'
import toUpper from 'lodash/toUpper'

import { ApiRootResponse } from '../twitch'

import createLogger, { Logger } from '../utils/logger'
import fetchUtil, { FetchError } from '../utils/fetch'

import * as validators from './utils/api-validators'

import { ApiOptions, ApiReadyStates, ApiFetchOptions } from './api-types'

/**
 * Make requests to Twitch API.
 *
 * ## Initializing
 *
 * ```js
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2'
 * const { api } = new TwitchJs({ token, clientId })
 * ```
 *
 * ## Making requests
 *
 * By default, the API client makes requests to the
 * [Helix API](https://dev.twitch.tv/docs/api), and exposes [[Api.get]],
 * [[Api.post]] and [[Api.put]] methods. Query and body parameters are provided
 * via `options.search` and `options.body` properties, respectively.
 *
 * ### Examples
 *
 * #### Get bits leaderboard
 * ```js
 * api
 *   .get('bits/leaderboard', { search: { user_id: '44322889' } })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 *
 * #### Get the latest Overwatch live streams
 * ```
 * api
 *   .get('streams', { search: { game_id: '1234' } })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 *
 * #### Start a channel commercial
 * ```
 * api
 *   .post('/channels/commercial', {
 *     body: { broadcaster_id: '44322889', length: 30 },
 *   })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 */

class Api {
  private _options: ApiOptions
  private _log: Logger

  private _readyState: ApiReadyStates = ApiReadyStates.READY

  private _status!: ApiRootResponse

  constructor(options: Partial<ApiOptions>) {
    this._options = validators.apiOptions(options)

    this._log = createLogger({ name: 'Api', ...this._options.log })
  }

  get readyState() {
    return this._readyState
  }

  get status() {
    return this._status
  }

  /**
   * New client options. To update `token` or `clientId`, use [**api.initialize()**]{@link Api#initialize}.
   */
  updateOptions(options: Partial<ApiOptions>) {
    const { clientId, token } = this._options
    this._options = validators.apiOptions({ ...options, clientId, token })
  }

  /**
   * Initialize API client and retrieve status.
   * @see https://dev.twitch.tv/docs/v5/#root-url
   */
  async initialize(newOptions?: Partial<ApiOptions>) {
    if (newOptions) {
      this._options = validators.apiOptions({ ...this._options, ...newOptions })
    }

    if (!newOptions && this.readyState === 2) {
      return Promise.resolve()
    }

    const statusResponse = await this.get<ApiRootResponse>('')

    if ('token' in statusResponse) {
      this._readyState = ApiReadyStates.INITIALIZED
      this._status = statusResponse
    }

    return statusResponse
  }

  /**
   * Check if current credentials include `scope`.
   * @see https://dev.twitch.tv/docs/authentication/#twitch-api-v5
   */
  hasScope(
    /** Scope to check */
    scope: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.readyState !== 2 || !this.status) {
        return reject(false)
      }

      return includes(this.status.token.authorization.scopes, scope)
        ? resolve(true)
        : reject(false)
    })
  }

  /**
   * GET endpoint.
   *
   * @example <caption>Get user follows (Helix)</caption>
   * ```
   * api.get('users/follows', { search: { to_id: '23161357' } })
   *   .then(response => {
   *     // Do stuff with response ...
   *   })
   * ```
   */
  get<T = any>(endpoint = '', options?: ApiFetchOptions) {
    return this._handleFetch<T>(endpoint, options)
  }

  /**
   * POST endpoint.
   */
  post<T = any>(endpoint: string, options?: ApiFetchOptions) {
    return this._handleFetch<T>(endpoint, { ...options, method: 'post' })
  }

  /**
   * PUT endpoint.
   */
  put<T = any>(endpoint: string, options?: ApiFetchOptions) {
    return this._handleFetch<T>(endpoint, { ...options, method: 'put' })
  }

  private _getAuthenticationHeaders(): RequestInit['headers'] {
    const { clientId, token } = this._options

    if (clientId && token) {
      return {
        Authorization: `Bearer ${token}`,
        'Client-Id': clientId,
      }
    }

    return undefined
  }

  private async _handleFetch<T = any>(
    maybeUrl = '',
    options: ApiFetchOptions = {},
  ) {
    const baseUrl = 'https://api.twitch.tv/helix'

    const url = `${baseUrl}/${maybeUrl}`

    const message = `${toUpper(options.method) || 'GET'} ${url}`

    const fetchProfiler = this._log.profile()

    const authenticationHeaders = this._getAuthenticationHeaders()

    const fetchOptions = {
      ...options,
      headers: {
        ...options.headers,
        ...authenticationHeaders,
      },
    }

    const performRequest = () => fetchUtil<T>(url, fetchOptions)

    let caughtError
    try {
      return await performRequest()
    } catch (error) {
      if (
        typeof this._options.onAuthenticationFailure === 'function' &&
        error instanceof FetchError &&
        error.body.status === 401
      ) {
        const token = await this._options.onAuthenticationFailure()

        if (token) {
          await this.initialize({ token })
          this._log.info(`${message} ... re-initializing with new token`)
        }

        this._log.info(`${message} ... retrying`)

        return await performRequest()
      }

      caughtError = error
      throw caughtError
    } finally {
      fetchProfiler.done(message, caughtError)
    }
  }
}

export default Api
