import Chat, { constants as ChatConstants } from './Chat'
import Api from './Api'

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
  /**
   * TwitchJs constructor
   * @param {Object} options
   * @param {string} options.token
   * @param {string} options.username
   * @param {function} [options.onAuthenticationFailure]
   * @param {ChatOptions} [options.chat]
   * @param {ApiOptions} [options.api]
   */
  constructor({ token, username, onAuthenticationFailure, chat, api }) {
    /** @type {Chat} */
    this.chat = new Chat({ ...chat, token, username, onAuthenticationFailure })
    /** @type {Object} */
    this.chatConstants = ChatConstants

    /** @type {Api} */
    this.api = new Api({ ...api, token, username, onAuthenticationFailure })
  }
}

export { Chat, ChatConstants }
export default TwitchJs
