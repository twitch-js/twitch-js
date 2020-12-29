import pino from 'pino'
import delay from 'delay'
import TwitchJs, { ChatEvents } from 'twitch-js'

import { preflight } from '../utils'

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
  chat.on(ChatEvents.ALL, (message) => logger.info(message))

  await chat.connect()
  await chat.join(channel)

  await delay(600000) // 10 minutes
  chat.disconnect()

  process.exit()
}

run()
