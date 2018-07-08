import camelcaseKeys from 'camelcase-keys'
import { get, includes, replace } from 'lodash'

import fetchUtil from '../utils/fetch'
import * as validators from './utils/validators'

class Api {
  readyState = 1

  status = {}

  constructor(maybeOptions = {}) {
    const options = validators.apiOptions(maybeOptions)

    this.options = options

    this.headers = {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': options.clientId ? options.clientId : undefined,
      Authorization: options.token ? `OAuth ${options.token}` : undefined,
    }
  }

  initialize() {
    if (this.readyState === 2) {
      return Promise.resolve()
    }

    return this.get().then(statusResponse => {
      this.readyState = 2
      this.status = statusResponse

      return true
    })
  }

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

  get(url, options = {}) {
    return fetch.call(this, url, options)
  }

  post(url, options = {}) {
    return fetch.call(this, url, { ...options, method: 'post' })
  }

  put(url, options = {}) {
    return fetch.call(this, url, { ...options, method: 'put' })
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
