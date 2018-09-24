import { server } from 'ws'

import commands from '../../../__mocks__/ws/__fixtures__/commands'
import membership from '../../../__mocks__/ws/__fixtures__/membership'
import tags from '../../../__mocks__/ws/__fixtures__/tags'

import { onceResolve } from '../../utils'

import Chat, { constants } from '../index'
import parser from '../utils/parsers'

jest.mock('uws', () => require('ws'))

const emitHelper = (emitter, rawMessages) =>
  parser(rawMessages).forEach(message =>
    emitter.emit(constants.EVENTS.ALL, message),
  )

describe('Chat', () => {
  let realDate

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

  afterAll(() => {
    global.Date = realDate
  })

  describe('connect', () => {
    test('should connect as anonymous', async () => {
      const chat = new Chat({})
      const actual = await chat.connect()

      expect(actual).toMatchSnapshot()
      expect(chat.readyState).toBe('CONNECTED')
    })

    test('should connect as authenticated', async () => {
      const chat = new Chat(options)
      const actual = await chat.connect()

      expect(actual).toMatchSnapshot()
      expect(chat.readyState).toBe('CONNECTED')
    })

    test('should call onAuthenticationFailure', done => {
      const onAuthenticationFailure = jest.fn(() => Promise.reject())

      const chat = new Chat({
        ...options,
        token: 'INVALID_TOKEN',
        onAuthenticationFailure,
      })

      chat.connect().catch(() => {
        expect(onAuthenticationFailure).toHaveBeenCalled()
        done()
      })
    })

    test('should update token and successfully connect', done => {
      const onAuthenticationFailure = jest.fn(() => Promise.resolve('TOKEN'))

      const chat = new Chat({
        ...options,
        token: 'INVALID_TOKEN',
        connectionTimeout: 100,
        onAuthenticationFailure,
      })

      chat.connect().then(() => {
        expect(onAuthenticationFailure).toHaveBeenCalled()
        expect(chat.options.token).toEqual('TOKEN')
        done()
      })
    })

    test('should return the same promise', async () => {
      const chat = new Chat(options)
      const actual = chat.connect()
      const expected = chat.connect()

      expect(actual).toEqual(expected)
    })
  })

  test('should allow options to be updated', () => {
    const chat = new Chat(options)
    expect(chat._options.debug).toBe(false)
    chat.updateOptions({ token: 'NEW_TOKEN', debug: true })

    expect(chat._options.token).toBe(options.token)
    expect(chat._options.debug).toBe(true)
  })

  test('should join channel', async () => {
    const chat = new Chat(options)
    await chat.connect()

    const actual = await chat.join('#dallas')
    expect(actual).toMatchSnapshot()
    expect(chat.getChannelState('#dallas')).toEqual(actual)
  })

  test('should send message to channel', async done => {
    const chat = new Chat(options)
    await chat.connect()

    expect.assertions(1)

    server.once('message', message => {
      expect(message).toEqual('PRIVMSG #dallas :Kappa Keepo Kappa')
      done()
    })

    chat.say('#dallas', 'Kappa Keepo Kappa')
  })

  test('should throw when sending a message as anonymous', async () => {
    const chat = new Chat({})
    await chat.connect()

    expect(() =>
      chat.say('#dallas', 'Kappa Keepo Kappa'),
    ).toThrowErrorMatchingSnapshot()
  })

  test('should part a channel', async done => {
    const chat = new Chat(options)
    await chat.connect()
    await chat.join('#dallas')

    expect.assertions(3)

    expect(chat._channelState['#dallas']).toBeDefined()

    server.once('message', message => {
      expect(message).toEqual('PART #dallas')
      expect(chat._channelState['#dallas']).not.toBeDefined()
      done()
    })

    chat.part('#dallas')
  })

  test('should disconnect', async done => {
    const chat = new Chat(options)
    await chat.connect()

    expect.assertions(2)

    chat.once(constants.EVENTS.DISCONNECTED, () => {
      expect(chat.readyState).toBe('DISCONNECTED')
      expect(chat._connectPromise).toBe(null)
      done()
    })

    chat.disconnect()
  })

  describe('reconnect', () => {
    test('should reconnect and rejoin channels', async () => {
      const chat = new Chat(options)
      await chat.connect()
      await chat.join('#dallas')

      const serverListener = jest.fn()
      const chatListener = jest.fn()
      server.on('close', () => serverListener('close'))
      server.on('open', () => serverListener('open'))
      server.on('message', serverListener)
      chat.on('*', chatListener)

      await chat.reconnect()

      expect(serverListener.mock.calls).toMatchSnapshot()
      expect(chatListener.mock.calls).toMatchSnapshot()

      server.removeListener('close')
      server.removeListener('open')
      server.removeListener('message')
    })

    test('should reconnect on RECONNECT event', async done => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once('CONNECTED', () => done())

      chat._client.emit('RECONNECT')
    })

    test('should update client options', async () => {
      const chat = new Chat(options)
      await chat.connect()

      await chat.reconnect({ token: 'NEW_TOKEN', debug: true })

      expect(chat._options.token).toBe('NEW_TOKEN')
      expect(chat._options.debug).toBe(true)
    })
  })

  describe('should handle messages', () => {
    test('JOIN', async done => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once(constants.EVENTS.JOIN, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      emitHelper(chat._client, membership.JOIN)
    })

    test('PART', async done => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once(constants.EVENTS.PART, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      emitHelper(chat._client, membership.PART)
    })

    test('NAMES', async () => {
      const chat = new Chat(options)
      await chat.connect()

      const emissions = Promise.all([
        onceResolve(chat, constants.COMMANDS.NAMES),
        onceResolve(chat, constants.COMMANDS.NAMES),
        onceResolve(chat, constants.COMMANDS.NAMES_END),
      ])

      emitHelper(chat._client, membership.NAMES)

      return emissions.then(actual => expect(actual).toMatchSnapshot())
    })

    describe('MODE', () => {
      describe('current user', () => {
        test('+o', async done => {
          const chat = new Chat(options)
          await chat.connect()
          await chat.join('#dallas')

          chat._channelState['#dallas'].userState.isModerator = false

          chat.once(constants.EVENTS.MODE, message => {
            expect(message).toMatchSnapshot()

            const actual = chat._channelState['#dallas'].userState.isModerator
            const expected = true
            expect(actual).toEqual(expected)
            done()
          })

          emitHelper(chat._client, membership.MODE.OPERATOR_PLUS_DALLAS)
        })

        test('-o', async done => {
          const chat = new Chat(options)
          await chat.connect()
          await chat.join('#dallas')

          chat._channelState['#dallas'].userState.isModerator = true

          chat.once(constants.EVENTS.MODE, message => {
            expect(message).toMatchSnapshot()

            const actual = chat._channelState['#dallas'].userState.isModerator
            const expected = false
            expect(actual).toEqual(expected)
            done()
          })

          await chat.join('#dallas')

          emitHelper(chat._client, membership.MODE.OPERATOR_MINUS_DALLAS)
        })
      })

      describe('another user', () => {
        test('+o', async done => {
          const chat = new Chat(options)
          await chat.connect()
          await chat.join('#dallas')

          const before = chat._channelState['#dallas'].userState.isModerator

          chat.once(constants.EVENTS.MODE, message => {
            expect(message).toMatchSnapshot()

            const after = chat._channelState['#dallas'].userState.isModerator
            expect(before).toEqual(after)
            done()
          })

          emitHelper(chat._client, membership.MODE.OPERATOR_PLUS_RONNI)
        })

        test('-o', async done => {
          const chat = new Chat(options)
          await chat.connect()
          await chat.join('#dallas')

          const before = chat._channelState['#dallas'].userState.isModerator

          chat.once(constants.EVENTS.MODE, message => {
            expect(message).toMatchSnapshot()

            const after = chat._channelState['#dallas'].userState.isModerator
            expect(before).toEqual(after)
            done()
          })

          emitHelper(chat._client, membership.MODE.OPERATOR_MINUS_RONNI)
        })
      })
    })

    test('CLEARCHAT', async done => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once(constants.EVENTS.CLEAR_CHAT, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      emitHelper(chat._client, commands.CLEARCHAT.CHANNEL)
    })

    test('CLEARCHAT user with reason', async done => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once(constants.EVENTS.CLEAR_CHAT, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      emitHelper(chat._client, commands.CLEARCHAT.USER_WITH_REASON)
    })

    test('HOSTTARGET start', async done => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once(constants.EVENTS.HOST_TARGET, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      emitHelper(chat._client, commands.HOSTTARGET.START)
    })

    test('HOSTTARGET stop', async done => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once(constants.EVENTS.HOST_TARGET, message => {
        expect(message).toMatchSnapshot()
        done()
      })

      emitHelper(chat._client, commands.HOSTTARGET.STOP)
    })

    describe('NOTICE', () => {
      test.each(Object.entries(commands.NOTICE))(
        '%s',
        async (name, raw, done) => {
          const chat = new Chat(options)
          await chat.connect()

          chat.once(constants.EVENTS.NOTICE, message => {
            expect(message).toMatchSnapshot()
            done()
          })

          emitHelper(chat._client, raw)
        },
        5000,
      )
    })

    describe('USERNOTICE', () => {
      test.each(Object.entries(tags.USERNOTICE))(
        '%s',
        async (name, raw, done) => {
          const chat = new Chat(options)
          await chat.connect()

          chat.once(constants.COMMANDS.USER_NOTICE, message => {
            expect(message).toMatchSnapshot()
            done()
          })

          emitHelper(chat._client, raw)
        },
      )
    })

    describe('PRIVMSG', () => {
      test.each(Object.entries(tags.PRIVMSG))('%s', async (name, raw, done) => {
        const chat = new Chat(options)
        await chat.connect()

        chat.once('PRIVMSG', message => {
          expect(message).toMatchSnapshot()
          done()
        })

        emitHelper(chat._client, raw)
      })

      test('whisper', async done => {
        const chat = new Chat(options)
        await chat.connect()

        server.once('message', message => {
          expect(message).toEqual('PRIVMSG #jtv :/w dallas Kappa Keepo Kappa')
          done()
        })

        chat.whisper('dallas', 'Kappa Keepo Kappa')
      })

      test('whisper when anonymous', async () => {
        const chat = new Chat({})
        await chat.connect()

        expect(() =>
          chat.whisper('dallas', 'Kappa Keepo Kappa'),
        ).toThrowErrorMatchingSnapshot()
      })
    })

    describe('deviations', () => {
      test('CLEARCHAT deviation 1', async done => {
        const chat = new Chat(options)
        await chat.connect()

        expect.assertions(1)

        chat.on('CLEARCHAT', actual => {
          expect(actual).toMatchSnapshot()
          done()
        })

        emitHelper(chat._client, commands.CLEARCHAT.DEVIATION_1)
      })
    })
  })

  describe('should handle multiple channels', () => {
    // test('should join multiple channels', () => {})
    // test('should broadcast message to all channels', () => {})

    test('should deny message broadcasting when anonymous', async () => {
      const chat = new Chat({})
      await chat.connect()

      expect(() =>
        chat.broadcast('Kappa Keepo Kappa'),
      ).toThrowErrorMatchingSnapshot()
    })
  })
})
