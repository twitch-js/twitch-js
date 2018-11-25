import { get, includes, pickBy, toUpper } from 'lodash'

import createLogger from '../utils/logger/create'

import fetchUtil from '../utils/fetch'
import * as Errors from '../utils/fetch/Errors'
import * as validators from './utils/validators'

import * as constants from './constants'

/**
 * API client
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
  /**
   * API constructor.
   * @param {ApiOptions} options
   */
  constructor(maybeOptions = {}) {
    this.options = maybeOptions

    this.log = createLogger({ scope: 'Api', ...this.options.log })

    /**
     * API ready state
     * @private
     * @type {ApiReadyState}
     */
    this._readyState = 1

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
    this._status = {}
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
   * Update client options.
   * @param {ApiOptions} options New client options. To update `token` or `clientId`, use [**api.initialize()**]{@link Api#initialize}.
   */
  updateOptions(options) {
    const { clientId, token } = this.options
    this.options = { ...options, clientId, token }
  }

  getAuthorizationType(version) {
    if (toUpper(version) === 'HELIX') {
      return 'Bearer'
    }

    return 'OAuth'
  }

  getBaseUrl(version) {
    if (toUpper(version) === 'HELIX') {
      return constants.HELIX_URL_ROOT
    }

    return constants.KRAKEN_URL_ROOT
  }

  getHeaders(version) {
    const { clientId, token } = this.options
    const authType = this.getAuthorizationType(version)

    return pickBy({
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': clientId ? clientId : undefined,
      Authorization: token ? `${authType} ${token}` : undefined,
    })
  }

  /**
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
   * GET endpoint.
   * @param {string} endpoint
   * @param {FetchOptions} [options]
   *
   * @example <caption>Get Live Overwatch Streams</caption>
   * api.get('streams', { search: { game: 'Overwatch' } })
   *   .then(response => {
   *     // Do stuff with response ...
   *   })
   */
  get(endpoint, options = {}) {
    return handleFetch.call(this, endpoint, options)
  }

  /**
   * POST endpoint.
   * @param {string} endpoint
   * @param {FetchOptions} [options={method:'post'}]
   */
  post(endpoint, options = {}) {
    return handleFetch.call(this, endpoint, { ...options, method: 'post' })
  }

  /**
   * PUT endpoint.
   * @param {string} endpoint
   * @param {FetchOptions} [options={method:'put'}]
   */
  put(endpoint, options = {}) {
    return handleFetch.call(this, endpoint, { ...options, method: 'put' })
  }
}

function handleFetch(maybeUrl = '', options = {}) {
  const fetchProfiler = this.log.startTimer()

  const [, version, url] = /^(?:([a-z]+):)?\/?(.*)$/i.exec(maybeUrl)
  const baseUrl = `${this.getBaseUrl(version)}/${url}`

  const message = `${options.method || 'GET'} ${baseUrl}`

  const request = () =>
    fetchUtil(baseUrl, {
      ...options,
      headers: {
        ...options.headers,
        ...this.getHeaders(version),
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
        .then(() => this.log.info('Retrying (with new credentials)'))
        .then(() => request())
    }

    throw error
  })
}

export default Api
