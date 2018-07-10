import camelcaseKeys from 'camelcase-keys'
import { get, includes, replace } from 'lodash'

import fetchUtil from '../utils/fetch'
import * as validators from './utils/validators'

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
   * API client ready state : **1** ready; **2** initialized.
   * @type {number}
   */
  readyState = 1

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
   * @type {ApiStatusState}
   */
  status = {}

  /**
   * API constructor.
   * @param {ApiOptions} options
   */
  constructor(maybeOptions = {}) {
    const options = validators.apiOptions(maybeOptions)

    this.options = options

    this.headers = {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': options.clientId ? options.clientId : undefined,
      Authorization: options.token ? `OAuth ${options.token}` : undefined,
    }
  }

  /**
   * Initialize API client and retrieve status.
   * @returns {Promise<ApiStatusState, Object>}
   * @see https://dev.twitch.tv/docs/v5/#root-url
   */
  initialize() {
    if (this.readyState === 2) {
      return Promise.resolve()
    }

    return this.get().then(statusResponse => {
      this.readyState = 2
      this.status = statusResponse

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
   * @example <caption>Get Live Streams</caption>
   * api.get('streams', { search: { game: 'Overwatch' } })
   *   .then(response => {
   *     // Do stuff with response ...
   *   })
   */
  get(endpoint, options = {}) {
    return fetch.call(this, endpoint, options)
  }

  /**
   * POST endpoint.
   * @param {string} endpoint
   * @param {FetchOptions} [options={method:'post'}]
   */
  post(endpoint, options = {}) {
    return fetch.call(this, endpoint, { ...options, method: 'post' })
  }

  /**
   * PUT endpoint.
   * @param {string} endpoint
   * @param {FetchOptions} [options={method:'put'}]
   */
  put(endpoint, options = {}) {
    return fetch.call(this, endpoint, { ...options, method: 'put' })
  }
}

function fetch(maybeUrl = '', options = {}) {
  const url = replace(maybeUrl, /^\//g, '')

  return fetchUtil(`${this.options.urlRoot}/${url}`, {
    ...options,
    headers: {
      ...options.headers,
      ...this.headers,
    },
  }).then(res => camelcaseKeys(res, { deep: true }))
}

export default Api
