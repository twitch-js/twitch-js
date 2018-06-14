import Chat, { constants as ChatConstants } from './Chat'

class TwitchJs {
  constructor(options) {
    this.chat = new Chat(options)
    this.chatConstants = ChatConstants
  }
}

export { Chat, ChatConstants }
export default TwitchJs
