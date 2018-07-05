import WebSocket from 'ws'

import tags from './__fixtures__/tags'
import membership from './__fixtures__/membership'

class Server extends WebSocket.Server {
  constructor(options) {
    super(options)

    this.on('connection', ws => {
      ws.on('message', message => {
        const [
          ,
          command,
          // argv = '',
        ] = /^(\w+) (.+)/.exec(message)
        // const args = argv.split(' ')

        switch (command) {
          case 'NICK':
            ws.send(tags.GLOBALUSERSTATE)
            break
          case 'JOIN':
            ws.send(membership.JOIN)
            ws.send(tags.ROOMSTATE.JOIN)
            ws.send(tags.USERSTATE.JOIN)
            break
          default:
          // No default.
        }
      })
    })
  }
}

WebSocket.Server = Server

export default WebSocket
