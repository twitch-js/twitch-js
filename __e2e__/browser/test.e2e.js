const path = require('path')
const pkg = require('../../package.json')

const { preflight } = require('../utils')

const BUILD_PATH = path.join(__dirname, `../../${pkg.unpkg}`)

describe('Browser E2E', () => {
  beforeAll(() => {
    preflight()
  })

  const clientId = process.env.TWITCH_CLIENT_ID
  const token = process.env.TWITCH_ACCESS_TOKEN
  const username = process.env.TWITCH_USERNAME

  const options = {
    clientId,
    token,
    username,
    log: { enabled: false },
  }

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
        (options, channel, message) => {
          const { chat } = new window.TwitchJs(options)

          return chat
            .connect()
            .then(() => chat.join(channel))
            .then(() => chat.say(channel, message))
            .then(() => chat.disconnect())
        },
        options,
        channel,
        message,
      )
    }, 30000)
  })

  describe('Api', () => {
    test('should get endpoint', async () => {
      await page.evaluate((options) => {
        const { api } = new window.TwitchJs(options)

        return api.get('streams')
      }, options)
    })
  })
})
