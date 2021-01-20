import Api from './Api'
import { ApiOptions } from './Api/types'
import Chat from './Chat'
import { ChatOptions } from './Chat/types'

import BaseError from './utils/BaseError'
import createLogger, { Logger, LoggerOptions } from './utils/logger'

export { Api }
export { Chat }
export * from './twitch'

type BaseTwitchJsOptions = {
  clientId?: string
  token?: string
  username?: string
  log?: LoggerOptions
  onAuthenticationFailure?: () => Promise<string>
}

type IndividualClientOptions = {
  api?: Omit<ApiOptions, 'clientId' | 'token' | 'onAuthenticationFailure'>
  chat?: Omit<ChatOptions, 'token' | 'onAuthenticationFailure'>
}

export type TwitchJsOptions = BaseTwitchJsOptions & IndividualClientOptions

/**
 * Interact with chat and make requests to Twitch API.
 *
 * ## Initializing
 * ```
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const username = 'ronni'
 * const twitchJs = new TwitchJs({ token, username })
 *
 * twitchJs.chat.connect().then(globalUserState => {
 *   // Do stuff ...
 * })
 *
 * twitchJs.api.get('channel').then(response => {
 *   // Do stuff ...
 * })
 * ```
 */

class TwitchJs {
  private options: TwitchJsOptions
  private log: Logger

  api: Api
  chat: Chat

  static Api = Api
  static Chat = Chat

  constructor(options: TwitchJsOptions) {
    this.options = options
    const { token, username, clientId, log, chat, api } = this.options

    this.log = createLogger({ name: 'TwitchJs', ...log })

    const handleApiAuthenticationFailure =
      typeof this.options.onAuthenticationFailure === 'function'
        ? this.handleApiAuthenticatedFailure
        : undefined

    const handleChatAuthenticationFailure =
      typeof this.options.onAuthenticationFailure === 'function'
        ? this.handleChatAuthenticatedFailure
        : undefined

    this.api = new Api({
      log,
      ...api,
      token,
      clientId,
      onAuthenticationFailure: handleApiAuthenticationFailure,
    })

    this.chat = new Chat({
      log,
      ...chat,
      token,
      username,
      onAuthenticationFailure: handleChatAuthenticationFailure,
    })
  }

  /**
   * Update client options.
   */
  updateOptions(options: IndividualClientOptions) {
    const { chat, api } = options

    if (chat) {
      this.chat.updateOptions(chat)
    }

    if (api) {
      this.api.updateOptions(api)
    }
  }

  private async handleApiAuthenticatedFailure() {
    try {
      const token = await this.options.onAuthenticationFailure?.()
      if (!token) {
        throw new BaseError('Token did not refresh')
      }

      this.chat.reconnect({ token })
      return token
    } catch (error) {
      this.log.error(error, 'Re-authentication failed')
      throw error
    }
  }

  private async handleChatAuthenticatedFailure() {
    try {
      const token = await this.options.onAuthenticationFailure?.()
      if (!token) {
        throw new BaseError('Token did not refresh')
      }

      this.api.updateOptions({ token })
      return token
    } catch (error) {
      this.log.error(error, 'Re-authentication failed')
      throw error
    }
  }
}

export default TwitchJs
