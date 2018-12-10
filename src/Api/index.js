import { get, includes, toLower } from 'lodash'

import createLogger from '../utils/logger/create'

import fetchUtil from '../utils/fetch'
import * as Errors from '../utils/fetch/Errors'
import * as validators from './utils/validators'

import * as constants from './constants'

/**
 * @class
 * @public
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

  /**
   * API ready state
   * @private
   * @type {ApiReadyState}
   */
  _readyState = 1

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
  /**
   * API status.
   * @private
   * @type {ApiStatusState}
   */
  _status

  /**
   * API constructor.
   * @param {ApiOptions} options
   */
  constructor(maybeOptions = {}) {
    /**
     * @type {ApiOptions}
     * @private
     */
    this.options = maybeOptions

    this._log = createLogger({ scope: 'Api', ...this.options.log })
  }

  /**
   * @function Api#setOptions
   * @public
   * @param {ApiOptions} options
   */
  set options(maybeOptions) {
    this._options = validators.apiOptions(maybeOptions)
  }

  /**
   * @function Api#getOptions
   * @public
   * @return {ApiOptions}
   */
  get options() {
    return this._options
  }

  /**
   * @function Api#getReadyState
   * @public
   * @return {number}
   *
   */
  get readyState() {
    return this._readyState
  }

  /**
   * @function Api#getStatus
   * @public
   * @return {ApiStatusState}
   */
  get status() {
    return this._status
  }

  /**
   * Update client options.
   * @function Api#updateOptions
   * @public
   * @param {ApiOptions} options New client options. To update `token` or `clientId`, use [**api.initialize()**]{@link Api#initialize}.
   */
  updateOptions(options) {
    const { clientId, token } = this.options
    this.options = { ...options, clientId, token }
  }

  /**
   * @function Api#initialize
   * @private
   * Initialize API client and retrieve status.
   * @param {ApiOptions} [options] Provide new options to client.
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
   * @function Api#hasScope
   * @private
   * Check if current credentials include `scope`.
   * @param {string} scope Scope to check.
   * @return {Promise<boolean, boolean>}
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
   * @function Api#get
   * @public
   * GET endpoint.
   * @param {string} endpoint
   * @param {FetchOptions} [options]
   * @param {string} [options.version]
   *
   * @example <caption>Get Live Overwatch Streams</caption>
   * api.get('streams', { search: { game: 'Overwatch' } })
   *   .then(response => {
   *     // Do stuff with response ...
   *   })
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
   * @function Api#post
   * @public
   * POST endpoint.
   * @param {string} endpoint
   * @param {FetchOptions} [options={method:'post'}]
   * @param {string} [options.version]
   */
  post(endpoint, options = {}) {
    return this._handleFetch(endpoint, { ...options, method: 'post' })
  }

  /**
   * @function Api#put
   * @public
   * PUT endpoint.
   * @param {string} endpoint
   * @param {FetchOptions} [options={method:'put'}]
   * @param {string} [options.version]
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
