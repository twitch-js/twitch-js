import WebSocket from 'ws'

import membership from '../../../__mocks__/ws/__fixtures__/membership'

import Client from '../Client'
import * as constants from '../constants'

describe('Chat/Client', () => {
  let realDate

  let wss
  let server
  let client

  const options = {
    server: 'localhost',
    port: 6668,
    token: 'TOKEN',
    username: 'USERNAME',
    connectionTimeout: 1000,
    ssl: false,
  }

  beforeAll(() => {
    realDate = Date
    const DATE_TO_USE = new Date('2018')
    global.Date = jest.fn(() => DATE_TO_USE)

    // Create WebSocket Server.
    wss = new WebSocket.Server({ port: options.port })
    wss.on('connection', ws => {
      server = ws
    })
  })

  afterEach(() => {
    client.disconnect()
  })

  afterAll(() => {
    wss.close()
    Date = realDate
  })

  test('should connect', done => {
    client = new Client(options)
    client.once(constants.EVENTS.CONNECTED, () => done())
  })

  describe('when connected', () => {
    beforeAll(done => {
      client = new Client(options)
      client.once(constants.EVENTS.CONNECTED, () => done())
    })

    test('should handle PING/PONG', done => {
      server.on('message', message => {
        expect(message).toEqual(membership.PONG)
        done()
      })

      server.send(membership.PING)
    })
  })
})
