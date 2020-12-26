import TwitchJs from '../../lib'
import { ApiVersions } from '../../lib/twitch'

import { preflight } from '../utils'

describe('Node E2E', () => {
  if (!process.env.CI) {
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    require('dotenv').config()
  }

  beforeAll(() => {
    preflight()
  })

  const token = process.env.ACCESS_TOKEN
  const username = process.env.USERNAME
  const channel = process.env.USERNAME
  const message = process.env.GITHUB_RUN_ID
    ? `CI E2E Build #${process.env.GITHUB_RUN_ID}`
    : `Local E2E ${new Date()}`

  const options = {
    token,
    username,
    log: { enabled: false },
  }

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
