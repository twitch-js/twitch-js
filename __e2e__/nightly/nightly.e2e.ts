import pino from 'pino'
import delay from 'delay'
import TwitchJs, {
  BooleanBadges,
  ChatEvents,
  Events,
  NumberBadges,
} from '../../src'

import { preflight } from '../utils'

const KnownBadges = Object.keys({ ...BooleanBadges, ...NumberBadges })

const KnownEvents = Object.values(Events)

const newBadges = []
const newEvents = []
const newParams = []

const run = async () => {
  preflight()

  const username = process.env.TWITCH_USERNAME
  const token = process.env.TWITCH_ACCESS_TOKEN
  const clientId = process.env.TWITCH_CLIENT_ID

  const runtime = Number(process.env.RUNTIME_MILLISECONDS) || 60000

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
      let isNew = false

      // Check badges.
      const badges = message.tags?.badges || {}
      for (const badge in badges) {
        if (!KnownBadges.includes(badge) && !newBadges.includes(badge)) {
          newBadges.push(badge)
          isNew = true
        }
      }

      // Check events
      if (
        message?.event &&
        !KnownEvents.includes(message.event) &&
        !newEvents.includes(message.event)
      ) {
        newEvents.push(message.event)
        isNew = true
      }

      // Check message parameters.
      const params = message.parameters || {}
      for (const param in params) {
        // Collect all parameters for now.
        newParams.push(param)
        isNew = true
      }

      if (isNew) {
        logger.info(message)
      }
    } catch (err) {
      logger.error(err)
    }
  })

  await chat.connect()
  await chat.join(channel)

  await delay(runtime)
  chat.disconnect()

  logger.info({ newBadges, newEvents, newParams })

  process.exit()
}

run()
