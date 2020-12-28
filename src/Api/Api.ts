import invariant from 'invariant'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import toLower from 'lodash/toLower'
import toUpper from 'lodash/toUpper'

import { ApiRootResponse, ApiVersions } from '../twitch'

import createLogger, { Logger } from '../utils/logger'

import fetchUtil from '../utils/fetch'
import * as Errors from '../utils/fetch/Errors'
import * as validators from './utils/validators'

import {
  ApiOptions,
  ApiReadyStates,
  ApiFetchOptions,
  Settings,
  ApiHeaders,
} from './types'

/**
 * Make requests to Twitch API.
 *
 * ## Initializing
 *
 * ```js
 * // With a token ...
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const { api } = new TwitchJs({ token })
 *
 * // ... or with a client ID ...
 * const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2'
 * const { api } = new TwitchJs({ clientId })
 * ```
 *
 * **Note:** The recommended way to initialize the API client is with a token.
 *
 * ## Making requests
 *
 * By default, the API client makes requests to the
 * [Helix API](https://dev.twitch.tv/docs/api), and exposes [[Api.get]],
 * [[Api.post]] and [[Api.put]] methods. Query string parameters and body
 * parameters are provided via `options.search` and `options.body` properties,
 * respectively.
 *
 * To make requests to the [Kraken/v5 API](https://dev.twitch.tv/docs/v5), use
 * `options.version = 'kraken'`
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
 *   .get('streams', { version: 'kraken', search: { game: 'Overwatch' } })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 *
 * #### Start a channel commercial
 * ```
 * const channelId = '44322889'
 * api
 *   .post(`channels/${channelId}/commercial`, {
 *     version: 'kraken',
 *     body: { length: 30 },
 *   })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 */

class Api {
  private _options!: ApiOptions
  private _log: Logger

  private _readyState: ApiReadyStates = ApiReadyStates.READY

  private _status!: ApiRootResponse

  constructor(maybeOptions: ApiOptions = {}) {
    this.options = maybeOptions

    this._log = createLogger({ name: 'Api', ...this.options.log })
  }

  set options(maybeOptions) {
    this._options = validators.apiOptions(maybeOptions)
  }

  get options() {
    return this._options
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
    const { clientId, token } = this.options
    this.options = { ...options, clientId, token }
  }

  /**
   * Initialize API client and retrieve status.
   * @see https://dev.twitch.tv/docs/v5/#root-url
   */
  async initialize(newOptions?: Partial<ApiOptions>) {
    if (newOptions) {
      this.options = { ...this.options, ...newOptions }
    }

    if (!newOptions && this.readyState === 2) {
      return Promise.resolve()
    }

    const statusResponse = await this.get<ApiRootResponse>('', {
      version: ApiVersions.Kraken,
    })

    this._readyState = ApiReadyStates.INITIALIZED
    this._status = statusResponse

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
   * @example <caption>Get Live Overwatch Streams (Kraken)</caption>
   * ```
   * api.get('streams', { version: 'kraken', search: { game: 'Overwatch' } })
   *   .then(response => {
   *     // Do stuff with response ...
   *   })
   * ```
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

  private _isVersionHelix(version: ApiVersions) {
    return toLower(version) === ApiVersions.Helix
  }

  private _getBaseUrl(version: ApiVersions) {
    return Settings[version].baseUrl
  }

  private _getHeaders(version: ApiVersions): ApiHeaders {
    const { clientId, token } = this.options

    const isHelix = this._isVersionHelix(version)

    invariant(
      isHelix ? !(isEmpty(clientId) && isEmpty(token)) : true,
      '[twitch-js/Api] To call a Helix endpoint, a `clientId` or `token` must be provided',
    )

    const headers: ApiHeaders = {}

    if (!isHelix) {
      headers['Accept'] = 'application/vnd.twitchtv.v5+json'
    }

    if (clientId) {
      headers['Client-ID'] = clientId
    }

    if (token) {
      headers[
        'Authorization'
      ] = `${Settings[version].authorizationHeader} ${token}`
    }

    return headers
  }

  private async _handleFetch<T = any>(
    maybeUrl = '',
    options: ApiFetchOptions = {},
  ) {
    const { version = ApiVersions.Helix, ...fetchOptions } = options

    const baseUrl = this._getBaseUrl(version)

    const url = `${baseUrl}/${maybeUrl}`

    const message = `${toUpper(fetchOptions.method) || 'GET'} ${url}`

    const fetchProfiler = this._log.profile()

    const headers = this._getHeaders(version)

    const optionHeaders = Object.entries(fetchOptions.headers || {})

    for (const [name, value] of optionHeaders) {
      headers[String(name)] = value
    }

    const performRequest = () =>
      fetchUtil<T>(url, {
        ...fetchOptions,
        headers,
      })

    try {
      return await performRequest()
    } catch (error) {
      if (
        error instanceof Errors.AuthenticationError &&
        typeof this.options.onAuthenticationFailure === 'function'
      ) {
        const token = await this.options.onAuthenticationFailure()

        if (token) {
          await this.initialize({ token })
          this._log.info(`${message} ... re-initializing with new token`)
        }

        this._log.info(`${message} ... retrying`)

        return await performRequest()
      }
      throw new Errors.FetchError(error, message)
    } finally {
      fetchProfiler.done(message)
    }
  }
}

export default Api
