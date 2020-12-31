import { server } from 'ws'

import membership from '../../../__mocks__/ws/__fixtures__/membership.json'

import Client from '../'
import { ClientEvents } from '../types'
import * as constants from '../constants'

jest.mock('ws')

describe('Chat/Client', () => {
  const options = {
    server: 'localhost',
    port: 6668,
    token: 'TOKEN',
    username: 'USERNAME',
    ssl: false,
    log: { enabled: false },
  }

  test('should receive CONNECTED event', (done) => {
    const client = new Client(options)

    client.once(ClientEvents.CONNECTED, () => done())
  })

  test('should send CAP, PASS and NICK', (done) => {
    const listener = jest.fn()
    server.on('message', listener)

    const client = new Client(options)

    client.once(ClientEvents.CONNECTED, () => {
      expect(listener.mock.calls).toContainEqual([membership.CAP])
      expect(listener.mock.calls).toContainEqual([
        `PASS oauth:${options.token}`,
      ])
      expect(listener.mock.calls).toContainEqual([`NICK ${options.username}`])
      server.removeListener('message')
      done()
    })
  })

  test('should handle PING/PONG', (done) => {
    new Client(options)

    server.once('message', (message) => {
      expect(message).toEqual(membership.PONG)
      done()
    })

    server.sendMessageToClient(membership.PING)
  })

  describe('keep alive', () => {
    afterAll(() => {
      jest.useRealTimers()
    })

    test('should send PING after keep alive delay', (done) => {
      jest.useFakeTimers()

      server.on('message', (message) => {
        if (message === ClientEvents.PING) {
          done()
          server.off('message')
        }
      })

      const client = new Client(options)

      client.on(ClientEvents.CONNECTED, () => {
        jest.advanceTimersByTime(constants.KEEP_ALIVE_PING_TIMEOUT)
      })

      jest.advanceTimersByTime(1000)
    })

    test('should emit RECONNECT after keep alive expires', (done) => {
      jest.useFakeTimers()

      const client = new Client(options)

      client.on(ClientEvents.RECONNECT, () => done())

      client.on(ClientEvents.CONNECTED, () => {
        jest.advanceTimersByTime(constants.KEEP_ALIVE_RECONNECT_TIMEOUT)
      })

      jest.advanceTimersByTime(1000)
    })
  })
})
