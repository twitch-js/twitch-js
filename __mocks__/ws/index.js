import { EventEmitter } from 'eventemitter3'

import tags from './__fixtures__/tags'
import membership from './__fixtures__/membership'

const server = new EventEmitter()
server.sendMessageToClient = data => server.emit('emit', { data })

class WebSocket extends EventEmitter {
  readyState = 0

  constructor() {
    super()

    // Emit `open` event on next event loop.
    setTimeout(() => this.emit('open'))

    this.readyState = 2
  }

  set onopen(listener) {
    this.addListener('open', listener)
  }

  set onmessage(listener) {
    this.addListener('message', listener)
    server.on('emit', listener)
  }

  set onerror(listener) {
    this.addListener('error', listener)
  }

  set onclose(listener) {
    this.addListener('close', listener)
  }

  emit(eventName, data) {
    super.emit(eventName, { data })
  }

  send(message) {
    server.emit('message', message)

    const [
      ,
      command,
      // argv = '',
    ] = /^(\w+) (.+)/.exec(message)

    // const args = argv.split(' ')
    // In the future, `args` can be used to mock more complex client-server
    // interaction.

    // Mock client-server interactions.
    switch (command) {
      case 'NICK':
        // Mock successful connections.
        this.emit('message', tags.GLOBALUSERSTATE)
        break
      case 'JOIN':
        // Mock channel JOINs.
        this.emit('message', membership.JOIN)
        this.emit('message', tags.ROOMSTATE.JOIN)
        this.emit('message', tags.USERSTATE.JOIN)
        break
      default:
      // No default.
    }
  }

  close() {
    server.emit('close')
    this.readyState = 4
  }
}

export { server }
export default WebSocket
