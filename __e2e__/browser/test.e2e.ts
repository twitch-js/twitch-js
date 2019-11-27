const path = require('path')

const BUILD_PATH = path.join(__dirname, '../../dist/twitch-js.js')

describe('Browser E2E', () => {
  if (!process.env.CI) {
    require('dotenv').config()
  }

  const token = process.env.TWITCH_TOKEN
  const username = process.env.TWITCH_USERNAME
  const channel = process.env.TWITCH_USERNAME
  const message = process.env.TRAVIS_BUILD_NUMBER
    ? `Travis CI E2E Build #${process.env.TRAVIS_BUILD_NUMBER}`
    : `Local E2E ${new Date()}`

  beforeEach(async () => {
    await page.addScriptTag({ path: BUILD_PATH })
  })

  describe('Chat', () => {
    test('should connect', async () => {
      await page.evaluate(
        (token, username) => {
          const { chat } = new window.TwitchJs({ token, username })

          return chat.connect()
        },
        token,
        username,
      )
    })

    test('should join channel', async () => {
      await page.evaluate(
        (token, username, channel) => {
          const { chat } = new window.TwitchJs({ token, username })

          return chat.connect().then(() => chat.join(channel))
        },
        token,
        username,
        channel,
      )
    })

    test('should send message to channel', async () => {
      await page.evaluate(
        (token, username, channel, message) => {
          const { chat } = new window.TwitchJs({ token, username })

          return chat
            .connect()
            .then(() => chat.join(channel))
            .then(() => chat.say(channel, message))
        },
        token,
        username,
        channel,
        message,
      )
    })
  })

  describe('Api', () => {
    test('should get endpoint', async () => {
      await page.evaluate(
        (token, username) => {
          const { api } = new window.TwitchJs({ token, username })

          return api.get('streams/featured')
        },
        token,
        username,
      )
    })
  })
})
