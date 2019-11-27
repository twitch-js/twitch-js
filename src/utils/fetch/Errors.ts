import { Response } from 'node-fetch'

import BaseError from '../BaseError'

class FetchError extends BaseError {
  ok: Response['ok']
  status: Response['status']
  statusText: Response['statusText']
  url: Response['url']
  body: any

  constructor(response: Response, body: any) {
    super(`${response.url} ${response.statusText}`)

    this.ok = false
    this.status = response.status
    this.statusText = response.statusText
    this.url = response.url
    this.body = body
  }
}

class AuthenticationError extends FetchError { }

function ErrorFactory(response: Response, body: any) {
  if (response.status === 401) {
    return new AuthenticationError(response, body)
  }

  return new FetchError(response, body)
}

export { FetchError, AuthenticationError }
export default ErrorFactory
