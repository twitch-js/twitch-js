import { EventEmitter } from 'eventemitter3'

import commands from './__fixtures__/commands.json'
import membership from './__fixtures__/membership.json'
import tags from './__fixtures__/tags.json'

type Listener = (...args: any[]) => void

class Server extends EventEmitter {
  sendMessageToClient(data: any) {
    super.emit('emit', { data })
  }
}
const server = new Server()

class WebSocket extends EventEmitter {
  readyState = 0
  isTokenValid = true

  constructor() {
    super()

    // Emit `open` event on next event loop.
    setTimeout(() => {
      server.emit('open')
      this.emit('open')

      // Emit welcome message
      this.emit('message', commands.WELCOME)
    })

    this.readyState = 1
  }

  set onopen(listener: Listener) {
    this.addListener('open', listener)
  }

  set onmessage(listener: Listener) {
    this.addListener('message', listener)
    server.on('emit', listener)
  }

  set onerror(listener: Listener) {
    this.addListener('error', listener)
  }

  set onclose(listener: Listener) {
    this.addListener('close', listener)
  }

  emit<T extends string | symbol>(eventName: T, data?: any) {
    return super.emit(eventName, { data })
  }

  send(message: string) {
    server.emit('message', message)

    const [, command, argv = ''] = /^(\w+) (.+)/.exec(message) as string[]

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
