import Chat from './Chat'
import { ChatOptions } from './Chat/types'
import Api from './Api'
import { ApiOptions } from './Api/types'

import { LoggerOptions } from './utils/logger'

export { Chat }
export { Api }
export * from './twitch'

type BaseTwitchJsOptions = {
  clientId?: string
  token?: string
  username?: string
  log?: LoggerOptions
  onAuthenticationFailure?: () => Promise<string>
}

type IndividualClassOptions = {
  chat?: ChatOptions
  api?: ApiOptions
}

export type TwitchJsOptions = BaseTwitchJsOptions & IndividualClassOptions

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
  chat: Chat
  api: Api

  static Chat = Chat
  static Api = Api

  constructor(options: TwitchJsOptions) {
    const {
      token,
      username,
      clientId,
      log,
      onAuthenticationFailure,
      chat,
      api,
    } = options

    this.chat = new Chat({
      log,
      ...chat,
      token,
      username,
      onAuthenticationFailure,
    })

    this.api = new Api({
      log,
      ...api,
      token,
      clientId,
      onAuthenticationFailure,
    })
  }

  /**
   * Update client options.
   */
  updateOptions(options: IndividualClassOptions) {
    const { chat, api } = options

    if (chat) {
      this.chat.updateOptions(chat)
    }

    if (api) {
      this.api.updateOptions(api)
    }
  }
}

export default TwitchJs
