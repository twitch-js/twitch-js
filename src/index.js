import Chat, { constants as ChatConstants } from './Chat'

/**
 * TwitchJs client
 * @example <caption>Connecting to Twitch</caption>
 * const token = OAUTH_TOKEN
 * const username = USERNAME
 * const twitchJs = new TwitchJs({ token, username })
 *
 * twitchJs.chat.connect().then(globalUserState => {
 *   // Do stuff ...
 * })
 */
class TwitchJs {
  /**
   * TwitchJs constructor
   * @param {Object} options
   * @param {string} options.token
   * @param {string} options.username
   * @param {ChatOptions} [options.chat]
   */
  constructor({ token, username, chat }) {
    /** @type {Chat} */
    this.chat = new Chat({ ...chat, token, username })
    /** @type {Object} */
    this.chatConstants = ChatConstants
  }
}

export { Chat, ChatConstants }
export default TwitchJs
