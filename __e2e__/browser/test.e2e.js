const path = require('path')
const pkg = require('../../package.json')

const { ApiVersions } = require('../../lib')

const { preflight } = require('../utils')

const BUILD_PATH = path.join(__dirname, `../../${pkg.unpkg}`)

describe('Browser E2E', () => {
  beforeAll(() => {
    preflight()
  })

  const token = process.env.TWITCH_ACCESS_TOKEN
  const username = process.env.TWITCH_USERNAME
  const channel = process.env.TWITCH_USERNAME
  const message = process.env.GITHUB_RUN_ID
    ? `CI E2E Build #${process.env.GITHUB_RUN_ID}`
    : `Local E2E ${new Date()}`

  beforeEach(async () => {
    await page.addScriptTag({ path: BUILD_PATH })
  })

  describe('Chat', () => {
    test('should connect, join channel, send message to channel', async () => {
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
        (token, username, ApiVersions) => {
          const { api } = new window.TwitchJs({ token, username })

          return api.get('streams/featured', { version: ApiVersions.Kraken })
        },
        token,
        username,
        ApiVersions,
      )
    })
  })
})
