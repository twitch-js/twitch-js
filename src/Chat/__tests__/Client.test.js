import { server } from 'ws'

import membership from '../../../__mocks__/ws/__fixtures__/membership'

import Client from '../Client'
import * as constants from '../constants'

jest.mock('uws', () => require('ws'))

describe('Chat/Client', () => {
  const options = {
    server: 'localhost',
    port: 6668,
    token: 'TOKEN',
    username: 'USERNAME',
    ssl: false,
  }

  test('should receive CONNECTED event', done => {
    const client = new Client(options)

    client.once(constants.EVENTS.CONNECTED, () => done())
  })

  test('should send CAP, PASS and NICK', done => {
    const listener = jest.fn()
    server.on('message', listener)

    const client = new Client(options)

    client.once(constants.EVENTS.CONNECTED, () => {
      expect(listener.mock.calls).toContainEqual([membership.CAP])
      expect(listener.mock.calls).toContainEqual([
        `PASS oauth:${options.token}`,
      ])
      expect(listener.mock.calls).toContainEqual([`NICK ${options.username}`])
      server.removeListener('message')
      done()
    })
  })

  test('should handle PING/PONG', done => {
    new Client(options)

    server.once('message', message => {
      expect(message).toEqual(membership.PONG)
      done()
    })

    server.sendMessageToClient(membership.PING)
  })

  describe('queue', () => {
    test('should create a queue', () => {
      const client = new Client(options)

      const actual = client._queue._maxLength
      const expected = constants.RATE_LIMIT_USER

      expect(actual).toEqual(expected)
    })

    test('should create a moderator queue', () => {
      const client = new Client(options)

      const actual = client._moderatorQueue._maxLength
      const expected = constants.RATE_LIMIT_MODERATOR

      expect(actual).toEqual(expected)
    })

    test('should create a queue for known bots', () => {
      const client = new Client({ ...options, isKnown: true })

      const actual = client._queue._maxLength
      const expected = constants.RATE_LIMIT_KNOWN_BOT

      expect(actual).toEqual(expected)
    })

    test('shoud create a queue for verified bots', () => {
      const client = new Client({ ...options, isVerified: true })

      const actual = client._queue._maxLength
      const expected = constants.RATE_LIMIT_VERIFIED_BOT

      expect(actual).toEqual(expected)
      expect(client._queue).toEqual(client._moderatorQueue)
    })

    test('should use moderator queue', async () => {
      const client = new Client({ ...options })

      const queueSpy = jest.spyOn(client._queue, 'push')
      const moderatorQueueSpy = jest.spyOn(client._moderatorQueue, 'push')

      await client.send('MESSAGE', { isModerator: true })

      expect(queueSpy).toHaveBeenCalledTimes(3)
      expect(moderatorQueueSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('keep alive', () => {
    afterAll(() => {
      jest.useRealTimers()
    })

    test('should send PING after keep alive delay', done => {
      jest.useFakeTimers()

      server.on('message', message => {
        if (message === constants.COMMANDS.PING) {
          done()
          server.off('message')
        }
      })

      const client = new Client(options)
      jest.advanceTimersByTime(1000)

      client.on(constants.EVENTS.CONNECTED, () =>
        jest.advanceTimersByTime(constants.KEEP_ALIVE_PING_TIMEOUT),
      )
    })

    test('should emit RECONNECT after keep alive expires', done => {
      jest.useFakeTimers()

      const client = new Client(options)
      jest.advanceTimersByTime(1000)

      client.on(constants.EVENTS.RECONNECT, () => done())

      client.on(constants.EVENTS.CONNECTED, () =>
        jest.advanceTimersByTime(constants.KEEP_ALIVE_RECONNECT_TIMEOUT),
      )
    })
  })
})
