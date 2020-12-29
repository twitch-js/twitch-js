import fetch from 'cross-fetch'
import FormData from 'form-data'
import { stringify, IStringifyOptions } from 'qs'
import camelCaseKeys from 'camelcase-keys'

import FetchError from './Error'

type SearchOption = {
  /** Any query parameters you want to add to your request. */
  search?: { [key: string]: any }
}

type HeaderOption = { headers?: Record<string, string> }

export type FetchOptions = Omit<RequestInit, 'headers'> &
  SearchOption &
  HeaderOption

/**
 * Fetches URL
 */
const fetchUtil = async <T = Response>(
  url: RequestInfo,
  options: FetchOptions = {},
  qsOptions?: IStringifyOptions,
) => {
  const isBodyJson =
    options.body &&
    !(options.body instanceof FormData) &&
    typeof options.body === 'object'

  const body = isBodyJson ? JSON.stringify(options.body) : options.body

  const headers = isBodyJson
    ? { ...options.headers, 'Content-Type': 'application/json' }
    : options.headers

  const search =
    typeof options.search === 'object'
      ? `?${stringify(options.search, qsOptions)}`
      : ''

  const fetchOptions = body
    ? {
        ...options,
        method: options.method || 'get',
        headers,
        body,
      }
    : {
        ...options,
        method: options.method || 'get',
        headers,
      }

  const response = await fetch(`${url}${search}`, fetchOptions)

  const responseJson = await response.json().catch(() => undefined)
  const json = responseJson
    ? camelCaseKeys(responseJson, { deep: true })
    : undefined

  if (!response.ok) {
    throw new FetchError(response, json)
  }

  if (json) {
    return json as T
  }

  return response
}

export default fetchUtil
