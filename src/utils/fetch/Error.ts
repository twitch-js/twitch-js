import BaseError from '../BaseError'

class FetchError extends BaseError {
  ok: Response['ok']
  status: Response['status']
  statusText: Response['statusText']
  url: Response['url']
  body: any

  constructor(response: Response, json: any) {
    const message = json?.message || `${response.url} ${response.statusText}`
    super(message)

    Object.setPrototypeOf(this, FetchError.prototype)

    this.ok = false
    this.status = response.status
    this.statusText = response.statusText
    this.url = response.url
    this.body = json
  }
}

export default FetchError
