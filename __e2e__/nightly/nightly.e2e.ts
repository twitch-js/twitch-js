import pino from 'pino'
import delay from 'delay'
import TwitchJs, { BooleanBadges, NumberBadges, ChatEvents } from '../../src'

import { preflight } from '../utils'

const Badges = { ...BooleanBadges, ...NumberBadges }

const newBadges = []
const newEvents = []
const newParams = []

const run = async () => {
  preflight()

  const username = process.env.TWITCH_USERNAME
  const token = process.env.TWITCH_ACCESS_TOKEN
  const clientId = process.env.TWITCH_CLIENT_ID

  const logger = pino(pino.destination({ dest: './nightly.log', sync: false }))

  const { chat, api } = new TwitchJs({
    username,
    token,
    clientId,
    log: { level: 'warn' },
  })

  // Get channel.
  const streams = await api.get('streams')
  const channel: string = streams.data[0].userName

  // Listen to chat.
  chat.on(ChatEvents.ALL, (message) => {
    try {
      // Check badges.
      const badges = message.tags?.badges || {}
      for (const badge in badges) {
        if (!(badge in Badges)) {
          newBadges.push(badge)
        }
      }

      // Check events
      if (!(message?.event && message.event in ChatEvents)) {
        newEvents.push(message.event)
      }

      // Check message parameters.
      const params = message.parameters || {}
      for (const param in params) {
        // Collect all parameters for now.
        newParams.push(param)
      }

      logger.info(message)
    } catch (err) {
      console.log(err)
    }
  })

  await chat.connect()
  await chat.join(channel)

  await delay(600000) // 600000 ms = 10 minutes
  chat.disconnect()

  logger.info({ newBadges, newEvents, newParams })

  process.exit()
}

run()
