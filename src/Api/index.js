import { get, includes, toLower } from 'lodash'

import createLogger from '../utils/logger/create'

import fetchUtil from '../utils/fetch'
import * as Errors from '../utils/fetch/Errors'
import * as validators from './utils/validators'

import * as constants from './constants'

/**
 * Twitch API client.
 * @class
 *
 * @example <caption>Get Featured Streams</caption>
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const username = 'ronni'
 * const { api } = new TwitchJs({ token, username })
 *
 * api.get('streams/featured').then(response => {
 *   // Do stuff ...
 * })
 */
class Api {
  _options
  _log

  _readyState = 1

  _status

  /**
   * API constructor.
   * @param {ApiOptions} options
   */
  constructor(maybeOptions = {}) {
    /**
     * @type {ApiOptions}
     */
    this.options = maybeOptions

    this._log = createLogger({ scope: 'Api', ...this.options.log })
  }

  set options(maybeOptions) {
    this._options = validators.apiOptions(maybeOptions)
  }

  get options() {
    return this._options
  }

  /**
   * @type {enum}
   */
  get readyState() {
    return this._readyState
  }

  /**
   * @type {ApiStatusState}
   */
  get status() {
    /**
     * API status state.
     * @typedef {Object} ApiStatusState
     * @property {Object} token
     * @property {Object} token.authorization
     * @property {Array<string>} token.authorization.scopes
     * @property {string} token.authorization.createdAt
     * @property {string} token.authorization.updatedAt
     * @property {string} token.clientId
     * @property {string} token.userId
     * @property {string} token.userName
     * @property {boolean} token.valid
     */

    return this._status
  }

  /**
   * Update client options.
   * @param {ApiOptions} options - New client options. To update `token` or `clientId`, use [**api.initialize()**]{@link Api#initialize}.
   */
  updateOptions(options) {
    const { clientId, token } = this.options
    this.options = { ...options, clientId, token }
  }

  /**
   * Initialize API client and retrieve status.
   * @param {ApiOptions} [options] - Provide new options to client.
   * @returns {Promise<ApiStatusState, Object>}
   * @see https://dev.twitch.tv/docs/v5/#root-url
   */
  initialize(newOptions) {
    if (newOptions) {
      this.options = { ...this.options, ...newOptions }
    }

    if (!newOptions && this.readyState === 2) {
      return Promise.resolve()
    }

    return this.get().then(statusResponse => {
      this._readyState = 2
      this._status = statusResponse

      return statusResponse
    })
  }

  /**
   * Check if current credentials include `scope`.
   * @param {string} scope - Scope to check.
   * @returns {Promise<boolean, boolean>}
   * @see https://dev.twitch.tv/docs/authentication/#twitch-api-v5
   */
  hasScope(scope) {
    return new Promise((resolve, reject) => {
      if (this.readyState !== 2) {
        return reject(false)
      }

      return includes(get(this.status, 'token.authorization.scopes', []), scope)
        ? resolve(true)
        : reject(false)
    })
  }

  /**
   * GET endpoint.
   * @param {string} endpoint
   * @param {MethodOptions} [options]
   * @returns {Promise<Object>}
   *
   * @example <caption>Get Live Overwatch Streams</caption>
   * api.get('streams', { search: { game: 'Overwatch' } })
   *   .then(response => {
   *     // Do stuff with response ...
   *   })
   *
   * @example <caption>Get user follows (Helix)</caption>
   * api.get('users/follows', { version: 'helix', search: { to_id: '23161357' } })
   *   .then(response => {
   *     // Do stuff with response ...
   *   })
   */
  get(endpoint, options = {}) {
    return this._handleFetch(endpoint, options)
  }

  /**
   * POST endpoint.
   * @param {string} endpoint
   * @param {MethodOptions} [options={method:'post'}]
   * @returns {Promise<Object>}
   */
  post(endpoint, options = {}) {
    return this._handleFetch(endpoint, { ...options, method: 'post' })
  }

  /**
   * PUT endpoint.
   * @param {string} endpoint
   * @param {MethodOptions} [options={method:'put'}]
   * @returns {Promise<Object>}
   */
  put(endpoint, options = {}) {
    return this._handleFetch(endpoint, { ...options, method: 'put' })
  }

  _isVersionHelix(version) {
    return toLower(version) === constants.HELIX_VERSION
  }

  _getBaseUrl({ version } = {}) {
    return this._isVersionHelix(version)
      ? constants.HELIX_URL_ROOT
      : constants.KRAKEN_URL_ROOT
  }

  _getHeaders({ version } = {}) {
    const { clientId, token } = this.options

    const isHelix = this._isVersionHelix(version)

    const authorizationHeader = isHelix
      ? constants.HELIX_AUTHORIZATION_HEADER
      : constants.KRAKEN_AUTHORIZATION_HEADER
    const authorization = `${authorizationHeader} ${token}`

    const headers = isHelix
      ? {}
      : { Accept: 'application/vnd.twitchtv.v5+json' }

    if (!clientId) {
      return { ...headers, Authorization: authorization }
    } else if (!token) {
      return { ...headers, 'Client-ID': clientId }
    }

    return {
      ...headers,
      'Client-ID': clientId,
      Authorization: authorization,
    }
  }

  _handleFetch(maybeUrl = '', options = {}) {
    const fetchProfiler = this._log.startTimer()

    /**
     * Method options
     * @typedef {Object} MethodOptions
     * @property {string|'helix'} [version] - API version
     * @property {string} [method=get]
     * @property {Object} [headers]
     * @property {Object} [search]
     * @property {Object|FormData} [body]
     */
    const { version, ...fetchOptions } = options

    const baseUrl = this._getBaseUrl({ version })
    const headers = this._getHeaders({ version })

    const url = `${baseUrl}/${maybeUrl}`

    const message = `${fetchOptions.method || 'GET'} ${baseUrl}`

    const request = () =>
      fetchUtil(url, {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          ...headers,
        },
      }).then(res => {
        fetchProfiler.done({ message })
        return res
      })

    return request().catch(error => {
      fetchProfiler.done({ level: 'error', message: error.body })

      if (error instanceof Errors.AuthenticationError) {
        return this.options
          .onAuthenticationFailure()
          .then(token => (this.options = { ...this.options, token }))
          .then(() => this._log.info('Retrying (with new credentials)'))
          .then(() => request())
      }

      throw error
    })
  }
}

export default Api
