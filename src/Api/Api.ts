import ky from 'ky-universal'

import camelCaseKeys from 'camelcase-keys'

import createLogger, { Logger } from '../utils/logger'
import * as validators from './utils/validators'

import { ApiOptions } from './types'
import { Settings } from './constants'

type Ky = typeof ky

/**
 * Make requests to Twitch API.
 *
 * ## Initializing
 *
 * ```js
 * // With a token ...
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const { api } = new TwitchJs({ token })
 *
 * // ... or with a client ID ...
 * const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2'
 * const { api } = new TwitchJs({ clientId })
 * ```
 *
 * **Note:** The recommended way to initialize the API client is with a token.
 *
 * ## Making requests
 *
 * By default, the API client makes requests to the
 * [Helix API](https://dev.twitch.tv/docs/api), and exposes [[Api.get]],
 * [[Api.post]] and [[Api.put]] methods. Query string parameters and body
 * parameters are provided via `options.search` and `options.body` properties,
 * respectively.
 *
 * To make requests to the [Kraken/v5 API](https://dev.twitch.tv/docs/v5), use
 * `options.version = 'kraken'`
 *
 * ### Examples
 *
 * #### Get bits leaderboard
 * ```js
 * api
 *   .get('bits/leaderboard', { search: { user_id: '44322889' } })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 *
 * #### Get the latest Overwatch live streams
 * ```
 * api
 *   .get('streams', { version: 'kraken', search: { game: 'Overwatch' } })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 *
 * #### Start a channel commercial
 * ```
 * const channelId = '44322889'
 * api
 *   .post(`channels/${channelId}/commercial`, {
 *     version: 'kraken',
 *     body: { length: 30 },
 *   })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 */
class Api {
  private options: ApiOptions
  private log: Logger
  private api: Ky
  public kraken: Ky

  constructor(options: Partial<ApiOptions>) {
    this.options = validators.apiOptions(options)

    this.log = createLogger({ name: 'Api', ...this.options.log })

    this.api = ky.create({
      prefixUrl: Settings.Helix.BaseUrl,
      hooks: {
        beforeRequest: [
          (request) => {
            this.log.debug(request, `Requesting ${request.url} ...`)
          },
          (request) => {
            const isKrakenRequest = request.url.startsWith(
              Settings.Kraken.BaseUrl,
            )

            if (isKrakenRequest) {
              request.headers.set('Accept', 'application/vnd.twitchtv.v5+json')
            }

            if (this.options.clientId) {
              request.headers.set('Client-ID', this.options.clientId)
            }

            if (this.options.token) {
              const authorizationHeader = isKrakenRequest
                ? Settings.Kraken.AuthorizationHeader
                : Settings.Helix.AuthorizationHeader

              request.headers.set(
                'Authorization',
                `${authorizationHeader} ${this.options.token}`,
              )
            }
          },
        ],
        beforeRetry: [
          ({ request, error, retryCount }) => {
            this.log.debug(error, `Retrying ${request.url} (${retryCount})`)
          },
        ],
        afterResponse: [
          (request, _options, response) => {
            if (!response.ok) {
              this.log.error(response, `Request ${request.url} failed`)
            } else {
              this.log.debug(response, `Request ${request.url} completed`)
            }
          },
          async (request, _options, response) => {
            if (
              this.options.onAuthenticationFailure &&
              response.status === 403
            ) {
              const authorizationHeader = request.url.startsWith(
                Settings.Kraken.BaseUrl,
              )
                ? Settings.Kraken.AuthorizationHeader
                : Settings.Helix.AuthorizationHeader

              // Get a fresh token
              const token = await this.options.onAuthenticationFailure()
              this.log.debug(`Token refreshed, retrying ${request.url} ...`)

              // Retry with the token
              request.headers.set(
                'Authorization',
                `${authorizationHeader} ${token}`,
              )

              return ky(request)
            }
          },
        ],
      },
      parseJson: (text) => camelCaseKeys(JSON.parse(text), { deep: true }),
    })

    this.kraken = ky.extend({ prefixUrl: Settings.Kraken.BaseUrl })

    return Object.assign(this.api, this)
  }

  /**
   * New client options.
   */
  updateOptions(options: Partial<ApiOptions>) {
    this.options = validators.apiOptions(options)
  }
}
interface Api extends Ky {}

export default Api
