import Chat, {
  constants as ChatConstants,
  Options as ChatOptions,
} from './Chat'
import Api, { Options as ApiOptions } from './Api'

import { Options as LoggerOptions } from './utils/logger'

type Options = {
  clientId?: string
  token?: string
  username?: string
  log?: LoggerOptions
  onAuthenticationFailure?: () => Promise<string>
  chat?: ChatOptions
  api?: ApiOptions
}

/**
 * TwitchJs client
 * @example <caption>Instantiating TwitchJS</caption>
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
 */

class TwitchJs {
  chat: Chat
  api: Api

  chatConstants: typeof ChatConstants

  constructor({
    token,
    username,
    clientId,
    log,
    onAuthenticationFailure,
    chat,
    api,
  }: Options) {
    this.chat = new Chat({
      log,
      ...chat,
      token,
      username,
      onAuthenticationFailure,
    })

    this.chatConstants = ChatConstants

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
  updateOptions({
    chat,
    api,
  }: {
    chat: Options['chat']
    api: Partial<Options['api']>
  }) {
    if (chat) {
      this.chat.updateOptions(chat)
    }

    if (api) {
      this.api.updateOptions(api)
    }
  }
}

export default TwitchJs
