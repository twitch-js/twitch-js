import includes from 'lodash/includes'
import toUpper from 'lodash/toUpper'

import { ApiValidateResponse } from '../twitch'

import createLogger, { Logger } from '../utils/logger'
import fetchUtil, { FetchError } from '../utils/fetch'
import { AuthenticationError } from '../utils/error'

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
 * [[Api.post]], [[Api.put]] and [[Api.delete]] methods. Query and body parameters are provided
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

  private _status!: ApiValidateResponse

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
   * Update client options.
   */
  updateOptions(options: Partial<ApiOptions>) {
    this._options = validators.apiOptions({ ...this._options, ...options })
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

    const response = await fetchUtil<ApiValidateResponse>(
      'https://id.twitch.tv/oauth2/validate',
      { headers: { Authorization: `Bearer ${this._options.token}` } },
    )

    this._readyState = ApiReadyStates.INITIALIZED
    this._status = response
  }

  /**
   * Check if current credentials include `scope`.
   * @see https://dev.twitch.tv/docs/authentication/#twitch-api-v5
   */
  hasScope(
    /** Scope to check */
    scope: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) =>
      this.status?.scopes?.includes(scope) ? resolve(true) : reject(false),
    )
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

  /**
   * DELETE endpoint.
   */
  delete<T = any>(endpoint: string, options?: ApiFetchOptions) {
    return this._handleFetch<T>(endpoint, { ...options, method: 'delete' })
  }

  private _getAuthenticationHeaders(): RequestInit['headers'] {
    const { clientId, token } = this._options

    return {
      Authorization: `Bearer ${token}`,
      'Client-Id': clientId,
    }
  }

  private async _handleFetch<T = any>(
    maybeUrl = '',
    options: ApiFetchOptions = {},
  ) {
    const baseUrl = 'https://api.twitch.tv/helix'

    const url = `${baseUrl}/${maybeUrl}`

    const message = `${toUpper(options.method) || 'GET'} ${url}`

    const fetchProfiler = this._log.profile()

    const performRequest = async () => {
      const authenticationHeaders = this._getAuthenticationHeaders()

      const fetchOptions = {
        ...options,
        headers: {
          ...options.headers,
          ...authenticationHeaders,
        },
      }

      try {
        return await fetchUtil<T>(url, fetchOptions)
      } catch (error) {
        if (error instanceof FetchError && error.body.status === 401) {
          throw new AuthenticationError(error.message, error.body)
        }
        throw error
      }
    }

    let caughtError
    try {
      return await performRequest()
    } catch (error) {
      if (
        typeof this._options.onAuthenticationFailure === 'function' &&
        error instanceof AuthenticationError
      ) {
        const token = await this._handleAuthenticationFailure(error)

        if (token) {
          this._log.info(`${message} ... retrying with new token`)
          this.updateOptions({ token })
          return await performRequest()
        }
      }

      caughtError = error
      throw caughtError
    } finally {
      fetchProfiler.done(message, caughtError)
    }
  }

  private async _handleAuthenticationFailure(originError: Error) {
    try {
      return await this._options.onAuthenticationFailure?.()
    } catch (error) {
      this._log.error(error as Error, 'onAuthenticationFailure error occurred')
      throw originError
    }
  }
}

export default Api
