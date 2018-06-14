import fetch from 'node-fetch'
import FormData from 'form-data'
import { stringify } from 'qs'

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

export { parseResponse }
export default fetchUtil
