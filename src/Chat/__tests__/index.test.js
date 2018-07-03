import WebSocket from 'ws'

import commands from '../../../__mocks__/ws/__fixtures__/commands'
import membership from '../../../__mocks__/ws/__fixtures__/membership'
import tags from '../../../__mocks__/ws/__fixtures__/tags'

import { onceResolve } from '../../utils'

import Chat, { constants } from '../index'

describe('Chat', () => {
  let realDate

  let wss
  let server
  let chat

  const options = {
    server: 'localhost',
    port: 6667,
    token: 'TOKEN',
    username: 'USERNAME',
    ssl: false,
  }

  beforeAll(async () => {
    realDate = Date
    const DATE_TO_USE = new Date('2018')
    global.Date = jest.fn(() => DATE_TO_USE)

    // Create WebSocket Server.
    wss = new WebSocket.Server({ port: options.port })
    wss.on('connection', ws => {
      server = ws
    })

    chat = new Chat(options)
    await chat.connect()
  })

  afterEach(() => {
    chat.removeAllListeners()
  })

  afterAll(done => {
    // eslint-disable-next-line no-global-assign
    Date = realDate
    wss.close(done)
  })

  test('should join channel', async () => {
    const actual = await chat.join('#dallas')
    expect(actual).toMatchSnapshot()
    expect(chat.channels).toEqual({ '#dallas': actual })
  })

  test('should handle JOIN', done => {
    chat.on(constants.EVENTS.JOIN, message => {
      expect(message).toMatchSnapshot()
      done()
    })

    server.send(membership.JOIN)
  })

  test('should handle PART', done => {
    chat.on(constants.EVENTS.PART, message => {
      expect(message).toMatchSnapshot()
      done()
    })

    server.send(membership.PART)
  })

  test('should handle NAMES', async () => {
    const emissions = Promise.all([
      onceResolve(chat, constants.COMMANDS.NAMES),
      onceResolve(chat, constants.COMMANDS.NAMES),
      onceResolve(chat, constants.COMMANDS.NAMES_END),
    ])

    server.send(membership.NAMES)

    return emissions.then(actual => expect(actual).toMatchSnapshot())
  })

  test('should handle MODE +o', done => {
    chat.on(constants.EVENTS.MODE, message => {
      expect(message).toMatchSnapshot()
      done()
    })

    server.send(membership.MODE.OPERATOR_PLUS)
  })

  test('should handle MODE -o', done => {
    chat.on(constants.EVENTS.MODE, message => {
      expect(message).toMatchSnapshot()
      done()
    })

    server.send(membership.MODE.OPERATOR_MINUS)
  })

  test('should handle CLEARCHAT', done => {
    chat.on(constants.EVENTS.CLEAR_CHAT, message => {
      expect(message).toMatchSnapshot()
      done()
    })

    server.send(commands.CLEARCHAT.CHANNEL)
  })

  test('should handle CLEARCHAT user with reason', done => {
    chat.on(constants.EVENTS.CLEAR_CHAT, message => {
      expect(message).toMatchSnapshot()
      done()
    })

    server.send(commands.CLEARCHAT.USER_WITH_REASON)
  })

  test('should handle HOSTTARGET start', done => {
    chat.on(constants.EVENTS.HOST_TARGET, message => {
      expect(message).toMatchSnapshot()
      done()
    })

    server.send(commands.HOSTTARGET.START)
  })

  test('should handle HOSTTARGET stop', done => {
    chat.on(constants.EVENTS.HOST_TARGET, message => {
      expect(message).toMatchSnapshot()
      done()
    })

    server.send(commands.HOSTTARGET.STOP)
  })

  describe('should handle NOTICE', () => {
    test.each(Object.entries(commands.NOTICE))(
      '%s',
      (name, raw, done) => {
        chat.on(constants.EVENTS.NOTICE, message => {
          expect(message).toMatchSnapshot()
          done()
        })

        server.send(raw)
      },
      5000,
    )
  })

  describe('should handle USERNOTICE', () => {
    test.each(Object.entries(tags.USERNOTICE))('%s', (name, raw, done) => {
      chat.on(constants.COMMANDS.USER_NOTICE, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      server.send(raw)
    })
  })

  describe('should handle PRIVMSG', () => {
    test('should emit PRIVMSG', done => {
      expect.assertions(1)

      chat.on('PRIVMSG', actual => {
        expect(actual).toMatchSnapshot()
        done()
      })

      server.send(tags.PRIVMSG.NON_BITS)
    })

    test('should emit PRIVMSG with bits', done => {
      expect.assertions(1)

      chat.on('PRIVMSG', actual => {
        expect(actual).toMatchSnapshot()
        done()
      })

      server.send(tags.PRIVMSG.BITS)
    })
  })

  test('should send message to channel', done => {
    expect.assertions(1)

    server.on('message', message => {
      expect(message).toEqual('PRIVMSG #dallas :Kappa Keepo Kappa')
      done()
    })

    chat.say('#dallas', 'Kappa Keepo Kappa')
  })

  describe('should handle multiple channels', () => {
    // test('should join multiple channels', () => {})
    // test('should broadcast message to all channels', () => {})
  })
})
