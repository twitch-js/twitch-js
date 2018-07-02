import TwitchJs from '../index'
import Chat, { constants as chatConstants } from '../Chat'

describe('TwitchJs', () => {
  const token = 'TOKEN'
  const username = 'USERNAME'

  test('should instantiate Chat', () => {
    const twitchJs = new TwitchJs({ token, username })

    expect(twitchJs.chat).toBeInstanceOf(Chat)
    expect(twitchJs.chatConstants).toEqual(chatConstants)
  })
})
