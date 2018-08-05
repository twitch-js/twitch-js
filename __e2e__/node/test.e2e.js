import TwitchJs from '../../lib'

describe('Node E2E', () => {
  const token = process.env.TWITCH_TOKEN
  const username = process.env.TWITCH_USERNAME
  const channel = process.env.TWITCH_USERNAME
  const message = process.env.TRAVIS_BUILD_NUMBER
    ? `Travis CI E2E Build #${process.env.TRAVIS_BUILD_NUMBER}`
    : `Local E2E ${new Date()}`

  afterAll(() => setTimeout(() => process.exit(), 1000))

  describe('Chat', () => {
    test('should connect and send message', async () => {
      const { chat } = new TwitchJs({ token, username })

      await chat.connect()
      await chat.join(channel)
      await chat.say(channel, message)

      chat.disconnect()
    })
  })

  describe('Api', () => {
    test('should get endpoint', async () => {
      const { api } = new TwitchJs({ token, username })

      await api.get('streams/featured')
    })
  })
})
