import camelcaseKeys from 'camelcase-keys'
import { replace } from 'lodash'

import fetchUtil from '../utils/fetch'
import * as validators from './utils/validators'

class Api {
  constructor(maybeOptions = {}) {
    const options = validators.apiOptions(maybeOptions)

    this.options = options

    this.headers = {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': options.clientId ? options.clientId : undefined,
      Authorization: options.token ? `OAuth ${options.token}` : undefined,
    }

    const instance = this.get.bind(this)
    instance.get = this.get.bind(this)
    instance.post = this.post.bind(this)

    return instance
  }

  get(url, options = {}) {
    return fetch.call(this, url, options)
  }

  post(url, options = {}) {
    return fetch.call(this, url, { ...options, method: 'post' })
  }
}

function fetch(maybeUrl, options = {}) {
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
