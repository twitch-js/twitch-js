import fetch from 'node-fetch'
import FormData from 'form-data'
import { stringify } from 'qs'

/**
 * Fetches URL
 * @param {string} url
 * @param {Object} [options]
 * @param {string} [options.method]
 * @param {Header} [options.headers]
 * @param {Object} [options.search]
 * @param {Object|FormData} [options.body]
 * @param {Object} [qsOptions]
 */
const fetchUtil = (url, options = {}, qsOptions = {}) => {
  const isBodyJson =
    !(options.body instanceof FormData) && typeof options.body === 'object'

  const body = isBodyJson ? JSON.stringify(options.body) : options.body

  const headers = isBodyJson
    ? { ...options.headers, 'Content-Type': 'application/json' }
    : options.headers

  const search =
    typeof options.search === 'object'
      ? `?${stringify(options.search, qsOptions)}`
      : ''

  return fetch(`${url}${search}`, {
    ...options,
    method: options.method || 'get',
    search: undefined,
    headers,
    body,
  }).then(parseResponse)
}

/** @ignore */
const parseResponse = response =>
  response
    .json()
    .then(json => {
      if (!response.ok) {
        const error = new Error(`${response.url} ${response.statusText}`)
        error.response = json
        throw error
      }
      return json
    })
    .catch(error => {
      error.ok = false
      error.status = response.status
      error.statusText = response.statusText
      error.url = response.url
      throw error
    })

export { parseResponse }
export default fetchUtil
