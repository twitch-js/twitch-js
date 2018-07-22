import { EventEmitter } from 'eventemitter3'

import tags from './__fixtures__/tags'
import membership from './__fixtures__/membership'

const server = new EventEmitter()
server.emitHelper = data => server.emit('emit', { data })

class WebSocket extends EventEmitter {
  constructor() {
    super()

    setTimeout(() => {
      this.emit('open')
    })

    this.readyState = 2
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

    switch (command) {
      case 'NICK':
        this.emit('message', tags.GLOBALUSERSTATE)
        break
      case 'JOIN':
        this.emit('message', membership.JOIN)
        this.emit('message', tags.ROOMSTATE.JOIN)
        this.emit('message', tags.USERSTATE.JOIN)
        break
      default:
      // No default.
    }
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

  close() {
    server.emit('close')
  }
}

export { server }
export default WebSocket
