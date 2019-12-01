import TwitchJs from '../index'
import Chat, { constants as chatConstants } from '../Chat'
import Api from '../Api'

describe('TwitchJs', () => {
  const options = {
    token: 'TOKEN',
    username: 'USERNAME',
    clientId: 'CLIENT_ID',
    log: { enabled: false },
  }

  test('should instantiate Chat', () => {
    const twitchJs = new TwitchJs(options)

    expect(twitchJs.chat).toBeInstanceOf(Chat)
    expect(twitchJs.chatConstants).toEqual(chatConstants)
  })

  test('should instantiate Api', () => {
    const twitchJs = new TwitchJs(options)

    expect(twitchJs.api).toBeInstanceOf(Api)
  })

  test('should allow client options to be updated', () => {
    const twitchJs = new TwitchJs(options)
    const chatSpy = jest.spyOn(twitchJs.chat, 'updateOptions')
    const apiSpy = jest.spyOn(twitchJs.api, 'updateOptions')

    twitchJs.updateOptions({ chat: {}, api: {} })

    expect(chatSpy).toHaveBeenCalled()
    expect(apiSpy).toHaveBeenCalled()
  })
})
