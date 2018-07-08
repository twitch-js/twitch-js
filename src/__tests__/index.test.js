import TwitchJs from '../index'
import Chat, { constants as chatConstants } from '../Chat'
import Api from '../Api'

describe('TwitchJs', () => {
  const token = 'TOKEN'
  const username = 'USERNAME'

  test('should instantiate Chat', () => {
    const twitchJs = new TwitchJs({ token, username })

    expect(twitchJs.chat).toBeInstanceOf(Chat)
    expect(twitchJs.chatConstants).toEqual(chatConstants)
  })

  test('should instantiate Api', () => {
    const twitchJs = new TwitchJs({ token, username })

    expect(twitchJs.api).toBeInstanceOf(Api)
  })
})
