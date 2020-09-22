import { EventEmitter } from 'eventemitter3'

import commands from './__fixtures__/commands'
import membership from './__fixtures__/membership'
import tags from './__fixtures__/tags'

const server = new EventEmitter()
server.sendMessageToClient = (data) => server.emit('emit', { data })

class WebSocket extends EventEmitter {
  readyState = 0
  isTokenValid = true

  constructor() {
    super()

    // Emit `open` event on next event loop.
    setTimeout(() => {
      server.emit('open')
      this.emit('open')
    })

    this.readyState = 1
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

    const [, command, argv = ''] = /^(\w+) (.+)/.exec(message)

    const args = argv.split(' ')
    // In the future, `args` can be used to mock more complex client-server
    // interaction.

    // Mock client-server interactions.
    switch (command) {
      case 'PASS': {
        this.isTokenValid = args[0] !== 'oauth:INVALID_TOKEN'
        if (!this.isTokenValid) {
          this.emit('message', commands.NOTICE.AUTHENTICATION_FAILED)
        }
        break
      }
      case 'NICK': {
        // Mock successful connections.
        if (this.isTokenValid) {
          this.emit('message', commands.WELCOME.replace(/<user>/g, args[0]))

          if (!args[0].startsWith('justinfan')) {
            this.emit('message', tags.GLOBALUSERSTATE)
          }
        }
        break
      }
      case 'JOIN':
        // Mock channel JOINs.
        this.emit('message', membership.JOIN)
        this.emit('message', tags.ROOMSTATE.JOIN)
        this.emit('message', tags.USERSTATE.JOIN)
        break
      case 'PRIVMSG':
        this.emit('message', tags.USERSTATE.JOIN)
        break
      default:
      // No default.
    }
  }

  close() {
    this.readyState = 4

    server.emit('close')
    this.emit('close')
  }
}

export { server }
export default WebSocket
