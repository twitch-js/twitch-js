import { server } from 'ws'

import commands from '../../../__mocks__/ws/__fixtures__/commands'
import membership from '../../../__mocks__/ws/__fixtures__/membership'
import tags from '../../../__mocks__/ws/__fixtures__/tags'

import { onceResolve } from '../../utils'

import Chat, { constants } from '../index'

jest.mock('uws', () => require('ws'))

describe('Chat', () => {
  let realDate

  let chat

  const options = {
    server: 'localhost',
    port: 6667,
    token: 'TOKEN',
    username: 'USERNAME',
    ssl: false,
  }

  beforeAll(() => {
    realDate = global.Date
    const DATE_TO_USE = new Date('2018')
    global.Date = jest.fn(() => DATE_TO_USE)
  })

  beforeEach(() => {
    chat = new Chat(options)
    return chat.connect()
  })

  afterEach(() => {
    chat.removeAllListeners()
  })

  afterAll(() => {
    global.Date = realDate
  })

  test('should join channel', async () => {
    const actual = await chat.join('#dallas')
    expect(actual).toMatchSnapshot()
    expect(chat.channels).toEqual({ '#dallas': actual })
  })

  test('should send message to channel', done => {
    expect.assertions(1)

    server.once('message', message => {
      expect(message).toEqual('PRIVMSG #dallas :Kappa Keepo Kappa')
      done()
    })

    chat.say('#dallas', 'Kappa Keepo Kappa')
  })

  test('should part a channel', done => {
    expect.assertions(1)

    server.once('message', message => {
      expect(message).toEqual('PART #dallas')
      done()
    })

    chat.part('#dallas')
  })

  test('should disconnect', done => {
    server.once('close', () => done())

    chat.disconnect()
  })

  test('should reconnect and rejoin channels', async () => {
    await chat.join('#dallas')

    const listener = jest.fn()
    server.on('close', () => listener('close'))
    server.on('open', () => listener('open'))
    server.on('message', listener)
    chat.on('*', listener)

    await chat.reconnect()

    expect(listener.mock.calls).toMatchSnapshot()

    server.removeListener('close')
    server.removeListener('open')
    server.removeListener('message')
  })

  test('should reconnect on RECONNECT event', done => {
    chat.once('CONNECTED', () => done())

    server.sendMessageToClient('RECONNECT')
  })

  describe('should handle messages', () => {
    test('JOIN', done => {
      chat.once(constants.EVENTS.JOIN, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      server.sendMessageToClient(membership.JOIN)
    })

    test('PART', done => {
      chat.once(constants.EVENTS.PART, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      server.sendMessageToClient(membership.PART)
    })

    test('NAMES', async () => {
      const emissions = Promise.all([
        onceResolve(chat, constants.COMMANDS.NAMES),
        onceResolve(chat, constants.COMMANDS.NAMES),
        onceResolve(chat, constants.COMMANDS.NAMES_END),
      ])

      server.sendMessageToClient(membership.NAMES)

      return emissions.then(actual => expect(actual).toMatchSnapshot())
    })

    test('MODE +o', done => {
      chat.once(constants.EVENTS.MODE, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      server.sendMessageToClient(membership.MODE.OPERATOR_PLUS)
    })

    test('MODE -o', done => {
      chat.once(constants.EVENTS.MODE, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      server.sendMessageToClient(membership.MODE.OPERATOR_MINUS)
    })

    test('CLEARCHAT', done => {
      chat.once(constants.EVENTS.CLEAR_CHAT, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      server.sendMessageToClient(commands.CLEARCHAT.CHANNEL)
    })

    test('CLEARCHAT user with reason', done => {
      chat.once(constants.EVENTS.CLEAR_CHAT, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      server.sendMessageToClient(commands.CLEARCHAT.USER_WITH_REASON)
    })

    test('HOSTTARGET start', done => {
      chat.once(constants.EVENTS.HOST_TARGET, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      server.sendMessageToClient(commands.HOSTTARGET.START)
    })

    test('HOSTTARGET stop', done => {
      chat.once(constants.EVENTS.HOST_TARGET, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      server.sendMessageToClient(commands.HOSTTARGET.STOP)
    })

    describe('NOTICE', () => {
      test.each(Object.entries(commands.NOTICE))(
        '%s',
        (name, raw, done) => {
          chat.once(constants.EVENTS.NOTICE, message => {
            expect(message).toMatchSnapshot()
            done()
          })

          server.sendMessageToClient(raw)
        },
        5000,
      )
    })

    describe('USERNOTICE', () => {
      test.each(Object.entries(tags.USERNOTICE))('%s', (name, raw, done) => {
        chat.once(constants.COMMANDS.USER_NOTICE, message => {
          expect(message).toMatchSnapshot()
          done()
        })

        server.sendMessageToClient(raw)
      })
    })

    describe('PRIVMSG', () => {
      test('PRIVMSG', done => {
        expect.assertions(1)

        chat.on('PRIVMSG', actual => {
          expect(actual).toMatchSnapshot()
          done()
        })

        server.sendMessageToClient(tags.PRIVMSG.NON_BITS)
      })

      test('CHEER', done => {
        expect.assertions(1)

        chat.on('PRIVMSG', actual => {
          expect(actual).toMatchSnapshot()
          done()
        })

        server.sendMessageToClient(tags.PRIVMSG.BITS)
      })
    })

    describe('deviations', () => {
      test('CLEARCHAT deviation 1', done => {
        expect.assertions(1)

        chat.on('CLEARCHAT', actual => {
          expect(actual).toMatchSnapshot()
          done()
        })

        server.sendMessageToClient(commands.CLEARCHAT.DEVIATION_1)
      })
    })
  })

  describe('should handle multiple channels', () => {
    // test('should join multiple channels', () => {})
    // test('should broadcast message to all channels', () => {})
  })
})
