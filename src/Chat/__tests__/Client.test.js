import { server } from 'ws'

import membership from '../../../__mocks__/ws/__fixtures__/membership'

import Client from '../Client'
import * as constants from '../constants'

jest.mock('uws', () => require('ws'))

describe('Chat/Client', () => {
  let realDate

  const options = {
    server: 'localhost',
    port: 6668,
    token: 'TOKEN',
    username: 'USERNAME',
    ssl: false,
  }

  beforeAll(() => {
    realDate = Date
    const DATE_TO_USE = new Date('2018')
    global.Date = jest.fn(() => DATE_TO_USE)
  })

  afterAll(() => {
    // eslint-disable-next-line no-global-assign
    Date = realDate
  })

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
      // console.log(message)
      expect(message).toEqual(membership.PONG)
      done()
    })

    server.emitHelper(membership.PING)
  })
})
