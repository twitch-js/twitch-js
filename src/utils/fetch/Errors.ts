import BaseError from '../BaseError'

class FetchError extends BaseError {
  ok: Response['ok']
  status: Response['status']
  statusText: Response['statusText']
  url: Response['url']
  body: any

  constructor(response: Response, body: any) {
    super(`${response.url} ${response.statusText}`)

    Object.setPrototypeOf(this, FetchError.prototype)

    this.ok = false
    this.status = response.status
    this.statusText = response.statusText
    this.url = response.url
    this.body = body
  }
}

class AuthenticationError extends FetchError {
  constructor(response: Response, body: any) {
    super(response, body)
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}

export { BaseError, FetchError, AuthenticationError }
