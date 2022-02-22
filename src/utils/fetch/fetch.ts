import fetch from 'cross-fetch'
import { stringify, IStringifyOptions } from 'qs'
import camelCaseKeys from 'camelcase-keys'

import TwitchJSError from '../error'

type QueryParams = {
  /** Any query parameters you want to add to your request. */
  [key: string]: string | number | boolean
}

interface BodyParams {
  [key: string]: any
}

export type FetchOptions<Query = QueryParams, Body = BodyParams> = Omit<
  RequestInit,
  'body'
> & { search?: Query } & { body?: Body }

export class FetchError extends TwitchJSError {
  public constructor(message: string, public body?: any) {
    super(message)
    Object.defineProperty(this, 'name', { value: 'TwitchJSFetchError' })
  }
}

/**
 * Fetches URL
 */
const fetchUtil = async <
  Response = any,
  Query = QueryParams,
  Body = BodyParams
>(
  url: RequestInfo,
  options?: FetchOptions<Query, Body>,
  qsOptions?: IStringifyOptions,
) => {
  const { search, body: bodyParams, ...rest } = options || {}

  const queryParams = search
    ? stringify(search, {
        ...qsOptions,
        addQueryPrefix: true,
        arrayFormat: 'repeat',
      })
    : ''

  const jsonInit = getJsonInit(bodyParams)

  const init = {
    ...rest,
    ...jsonInit,
    headers: {
      ...options?.headers,
      ...jsonInit.headers,
    },
  }

  const response = await fetch(`${url}${queryParams}`, init)

  const json = await response.json().catch(() => ({}))

  const body = camelCaseKeys(json, { deep: true }) as
    | Response
    | { error: string; status: number; message: string }

  if ('error' in body) {
    throw new FetchError(body.message, body)
  }

  if (!response.ok) {
    throw new FetchError(response.statusText, {
      error: true,
      status: response.status,
      message: response.statusText,
    })
  }

  return body
}

const getJsonInit = (
  input?: any,
): { body?: string | FormData; headers?: HeadersInit } => {
  try {
    if (!input) {
      return {}
    }

    if (input instanceof FormData) {
      return { body: input }
    }

    const body = JSON.stringify(input)
    return { body, headers: { 'Content-Type': 'application/json' } }
  } catch (err) {
    return { body: input }
  }
}

export default fetchUtil
