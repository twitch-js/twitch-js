import BaseError from '../BaseError'

class FetchError extends BaseError {
  constructor(response, body, ...params) {
    super(`${response.url} ${response.statusText}`, ...params)

    this.ok = false
    this.status = response.status
    this.statusText = response.statusText
    this.url = response.url
    this.body = body
  }
}

class AuthenticationError extends FetchError {}

function ErrorFactory(response, body) {
  if (response.status === 401) {
    return new AuthenticationError(response, body)
  }

  return new FetchError(response, body)
}

export { FetchError, AuthenticationError }
export default ErrorFactory
