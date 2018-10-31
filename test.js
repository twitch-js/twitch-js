require('./lib/Chat/utils/formatting')
require('dotenv').config({ path: 'dev.env' })
const Twitch = require('./lib/index')
const { Signale } = require('signale')
const signale = new Signale()
const constants = require('./lib/Chat/constants')

const tjs = new Twitch.default({
  token: process.env.TOKEN,
  username: process.env.USERNAME,
  clientId: process.env.CLIENT_ID,
})
tjs.chat
  .connect()
  .then(globalstate => {
    /*signale.debug('%o', globalstate)*/
  })
  .catch(error => {
    signale.error('%o', error)
  })

const initLog = new Signale({ interactive: true })

initLog.await('[%d/2] - Connecting', 1)
tjs.chat._connectPromise
  .then(globalstate => {
    initLog.success('[%d/2] - %s', 2, globalstate.command.capitalize())
  })
  .catch(error => {
    initLog.error('[%d/2] - %s', 2, error.event.capitalize())
  })
tjs.chat._client.on(constants.EVENTS.DISCONNECTED, () => {
  initLog.error('[%d/2] - Disconnected', 1)
})

setTimeout(() => {
  tjs.chat._client.ws.close()
}, 3000)
