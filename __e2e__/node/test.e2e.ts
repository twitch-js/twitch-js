import TwitchJs from '../../lib'
import { ApiVersions } from '../../lib/twitch'

describe('Node E2E', () => {
  if (!process.env.CI) {
    require('dotenv').config()
  }

  const token = process.env.TWITCH_TOKEN
  const username = process.env.TWITCH_USERNAME
  const channel = process.env.TWITCH_USERNAME
  const message = process.env.TRAVIS_BUILD_NUMBER
    ? `Travis CI E2E Build #${process.env.TRAVIS_BUILD_NUMBER}`
    : `Local E2E ${new Date()}`

  const options = {
    token,
    username,
    log: { enabled: false },
  }

  afterAll(() => setTimeout(process.exit.bind(process, 'Ran tests'), 1000))

  describe('Chat', () => {
    test('should connect and send message', async () => {
      const { chat } = new TwitchJs(options)

      await chat.connect()
      await chat.join(channel)
      await chat.say(channel, message)

      chat.disconnect()
    })
  })

  describe('Api', () => {
    test('should get endpoint', async () => {
      const { api } = new TwitchJs(options)

      await api.get('streams/featured', { version: ApiVersions.Kraken })
    })
  })
})
