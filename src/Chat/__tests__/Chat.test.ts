import { server } from 'ws'
import pEvent from 'p-event'
import camelCase from 'lodash/camelCase'

import rawCommands from '../../../__mocks__/ws/__fixtures__/commands.json'
import membership from '../../../__mocks__/ws/__fixtures__/membership.json'
import tags from '../../../__mocks__/ws/__fixtures__/tags.json'
import issues from '../../../__mocks__/ws/__fixtures__/issues.json'

import {
  ChatCommands,
  Commands,
  Events,
  KnownNoticeMessageIds,
  KnownUserNoticeMessageIds,
  PrivateMessageEvents,
} from '../../twitch'

import Chat from '../'
import {
  NoticeCompounds,
  PrivateMessageCompounds,
  UserNoticeCompounds,
} from '../types'
import parser from '../utils/parsers'

jest.mock('ws')
jest.mock('lodash/random', () => ({
  __esModule: true,
  default: jest.fn(() => '12345'),
}))

const emitHelper = (emitter, rawMessages) =>
  parser(rawMessages).forEach((message) => emitter.emit(Events.ALL, message))

describe('Chat', () => {
  const options = {
    server: 'localhost',
    port: 6667,
    token: 'TOKEN',
    username: 'USERNAME',
    ssl: false,
    isVerified: true,
    log: { level: 'silent' },
  }

  const anonymousOptions = {
    ...options,
    token: undefined,
    username: undefined,
  }

  describe('event compounds', () => {
    test('should include all NOTICE messages', () => {
      Object.keys(KnownNoticeMessageIds).forEach((notice) => {
        expect(NoticeCompounds[notice]).toBe(`NOTICE/${notice}`)
      })
    })

    test('should include all PRIVMSG messages', () => {
      Object.keys(PrivateMessageEvents).forEach((notice) => {
        expect(PrivateMessageCompounds[notice]).toBe(`PRIVMSG/${notice}`)
      })
    })

    test('should include all USERNOTICE messages', () => {
      Object.keys(KnownUserNoticeMessageIds).forEach((notice) => {
        expect(UserNoticeCompounds[notice]).toBe(`USERNOTICE/${notice}`)
      })
    })
  })

  describe('connect', () => {
    test('should connect as anonymous', async () => {
      const chat = new Chat(anonymousOptions)

      const [message] = await Promise.all([
        pEvent(chat, Events.CONNECTED),
        chat.connect(),
      ])
      expect(message).toMatchSnapshot({
        timestamp: expect.any(Date),
      })
    })

    test('should connect as authenticated', async () => {
      const chat = new Chat(options)

      const [message] = await Promise.all([
        pEvent(chat, Events.CONNECTED),
        chat.connect(),
      ])
      expect(message).toMatchSnapshot({
        timestamp: expect.any(Date),
      })
    })

    test('should call onAuthenticationFailure', async () => {
      const onAuthenticationFailure = jest.fn(() =>
        Promise.reject('token fail'),
      )

      try {
        const chat = new Chat({
          ...options,
          token: 'INVALID_TOKEN',
          connectionTimeout: 100,
          onAuthenticationFailure,
        })

        await chat.connect()
      } catch (err) {
        expect(onAuthenticationFailure).toHaveBeenCalled()
      }
    })

    test('should update token and successfully connect', async () => {
      const onAuthenticationFailure = jest.fn(() => Promise.resolve('TOKEN'))

      const chat = new Chat({
        ...options,
        token: 'INVALID_TOKEN',
        connectionTimeout: 100,
        onAuthenticationFailure,
      })

      await chat.connect()

      expect(onAuthenticationFailure).toHaveBeenCalled()
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

    const newJoinTimeout = 9876
    chat.updateOptions({ joinTimeout: newJoinTimeout })

    expect(chat._options.joinTimeout).toBe(newJoinTimeout)
  })

  test('should join channel', async () => {
    const chat = new Chat(options)

    await chat.connect()

    const actual = await chat.join('#dallas')
    expect(actual).toMatchSnapshot()
  })

  test('should send message to channel', async (done) => {
    const chat = new Chat(options)
    await chat.connect()

    server.on('message', (message) => {
      if (message === 'PRIVMSG #dallas :Kappa Keepo Kappa') {
        done()
      }
    })

    chat.say('#dallas', 'Kappa Keepo Kappa')
  })

  test('say should resolve with event', async () => {
    const chat = new Chat(options)
    await chat.connect()

    await chat.say('#dallas', 'Kappa Keepo Kappa')
  })

  test('should throw when sending a message as anonymous', async () => {
    const chat = new Chat(anonymousOptions)
    await chat.connect()

    await chat
      .say('#dallas', 'Kappa Keepo Kappa')
      .catch((err) => expect(err).toMatchSnapshot())
  })

  test.each(Object.keys(ChatCommands).map(camelCase))(
    'command %s should call say with args',
    async (command) => {
      const chat = new Chat(options)
      await chat.connect()

      const channel = '#channel'
      const args = ['arg1', 'arg2', 'arg3']

      const spy = jest.spyOn(chat, 'say')

      const numberOfArguments = chat[command].length

      chat[command](channel, ...args.slice(0, numberOfArguments))

      expect(spy.mock.calls).toMatchSnapshot()
    },
  )

  test('should part a channel', async (done) => {
    const chat = new Chat(options)
    await chat.connect()
    await chat.join('#dallas')

    expect.assertions(3)

    expect(chat._channelState['#dallas']).toBeDefined()

    server.once('message', (message) => {
      expect(message).toEqual('PART #dallas')
      expect(chat._channelState['#dallas']).not.toBeDefined()
      done()
    })

    chat.part('#dallas')
  })

  test('should disconnect', async () => {
    const chat = new Chat(options)
    await chat.connect()

    chat.disconnect()
    expect(chat._readyState).toBe(5)
    expect(chat._connectionInProgress).toBe(undefined)
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
      chatListener.mock.calls.forEach((call) => {
        const actual = call[0]
        expect(actual).toMatchSnapshot({
          timestamp: expect.any(Date),
        })
      })

      server.removeListener('close')
      server.removeListener('open')
      server.removeListener('message')
    })

    test('should reconnect on RECONNECT event', async (done) => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once('GLOBALUSERSTATE', () => done())

      chat._client.emit('RECONNECT')
    })

    test('should update client options', async () => {
      const chat = new Chat(options)
      await chat.connect()

      await chat.reconnect({ token: 'NEW_TOKEN' })

      expect(chat._options.token).toBe('oauth:NEW_TOKEN')
    })
  })

  describe('should handle messages', () => {
    test('JOIN', async (done) => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once(Events.JOIN, (message) => {
        expect(message).toMatchSnapshot({
          timestamp: expect.any(Date),
        })
        done()
      })

      emitHelper(chat._client, membership.JOIN)
    })

    test('PART', async (done) => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once(Events.PART, (message) => {
        expect(message).toMatchSnapshot({
          timestamp: expect.any(Date),
        })
        done()
      })

      emitHelper(chat._client, membership.PART)
    })

    test('NAMES', async () => {
      const chat = new Chat(options)
      await chat.connect()

      const emissions = Promise.all([
        pEvent(chat, Commands.NAMES),
        pEvent(chat, Commands.NAMES),
        pEvent(chat, Commands.NAMES_END),
      ])

      emitHelper(chat._client, membership.NAMES)

      return emissions.then((emission) => {
        emission.forEach((actual) =>
          expect(actual).toMatchSnapshot({
            timestamp: expect.any(Date),
          }),
        )
      })
    })

    describe('MODE', () => {
      describe('current user', () => {
        test('+o', async (done) => {
          const chat = new Chat({ ...options, username: 'dallas' })
          await chat.connect()
          await chat.join('#dallas')

          chat._channelState['#dallas'].userState.isModerator = false

          chat.once(Events.MODE, (message) => {
            expect(message).toMatchSnapshot({
              timestamp: expect.any(Date),
            })

            const actual = chat._channelState['#dallas'].userState.isModerator
            const expected = true
            expect(actual).toEqual(expected)
            done()
          })

          emitHelper(chat._client, membership.MODE.OPERATOR_PLUS_DALLAS)
        })

        test('-o', async (done) => {
          const chat = new Chat({ ...options, username: 'dallas' })
          await chat.connect()
          await chat.join('#dallas')

          chat._channelState['#dallas'].userState.isModerator = true

          chat.once(Events.MODE, (message) => {
            expect(message).toMatchSnapshot({
              timestamp: expect.any(Date),
            })

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
        test('+o', async (done) => {
          const chat = new Chat(options)
          await chat.connect()
          await chat.join('#dallas')

          const before = chat._channelState['#dallas'].userState.isModerator

          chat.once(Events.MODE, (message) => {
            expect(message).toMatchSnapshot({
              timestamp: expect.any(Date),
            })

            const after = chat._channelState['#dallas'].userState.isModerator
            expect(before).toEqual(after)
            done()
          })

          emitHelper(chat._client, membership.MODE.OPERATOR_PLUS_RONNI)
        })

        test('-o', async (done) => {
          const chat = new Chat(options)
          await chat.connect()
          await chat.join('#dallas')

          const before = chat._channelState['#dallas'].userState.isModerator

          chat.once(Events.MODE, (message) => {
            expect(message).toMatchSnapshot({
              timestamp: expect.any(Date),
            })

            const after = chat._channelState['#dallas'].userState.isModerator
            expect(before).toEqual(after)
            done()
          })

          emitHelper(chat._client, membership.MODE.OPERATOR_MINUS_RONNI)
        })
      })
    })

    test('CLEARCHAT', async (done) => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once(Events.CLEAR_CHAT, (message) => {
        expect(message).toMatchSnapshot({
          timestamp: expect.any(Date),
        })
        done()
      })

      emitHelper(chat._client, rawCommands.CLEARCHAT.CHANNEL)
    })

    test('CLEARCHAT user with reason', async (done) => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once(Events.CLEAR_CHAT, (message) => {
        expect(message).toMatchSnapshot({
          timestamp: expect.any(Date),
        })
        done()
      })

      emitHelper(chat._client, rawCommands.CLEARCHAT.USER_WITH_REASON)
    })

    test('CLEARMSG', async (done) => {
      const chat = new Chat(options)
      await chat.connect()

      chat.once(Events.CLEAR_MESSAGE, (message) => {
        expect(message).toMatchSnapshot({
          timestamp: expect.any(Date),
        })
        done()
      })

      emitHelper(chat._client, rawCommands.CLEARMSG)
    })

    describe('HOSTTARGET', () => {
      const table = Object.entries(rawCommands.HOSTTARGET)

      test.each(table)('%s', async (name, raw, done) => {
        const chat = new Chat(options)
        await chat.connect()

        chat.once(Events.HOST_TARGET, (message) => {
          expect(message).toMatchSnapshot({
            timestamp: expect.any(Date),
          })
          done()
        })

        emitHelper(chat._client, raw)
      })
    })

    describe('NOTICE', () => {
      test.each(Object.entries(rawCommands.NOTICE))(
        '%s',
        async (name, raw, done) => {
          const chat = new Chat(options)
          await chat.connect()

          const eventName = `${Events.NOTICE}/${name}`

          chat.once(eventName, (message) => {
            expect(message).toMatchSnapshot({
              timestamp: expect.any(Date),
            })
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

          chat.once(Commands.USER_NOTICE, (message) => {
            expect(message).toMatchSnapshot({
              timestamp: expect.any(Date),
            })
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

        chat.once('PRIVMSG', (message) => {
          expect(message).toMatchSnapshot({
            timestamp: expect.any(Date),
          })
          done()
        })

        emitHelper(chat._client, raw)
      })

      test('whisper', async (done) => {
        const chat = new Chat(options)
        await chat.connect()

        server.once('message', (message) => {
          expect(message).toEqual('/w dallas Kappa Keepo Kappa')
          done()
        })

        await chat.whisper('dallas', 'Kappa Keepo Kappa')
      })

      test('whisper when anonymous', async () => {
        const chat = new Chat(anonymousOptions)
        await chat.connect()

        await expect(
          chat.whisper('dallas', 'Kappa Keepo Kappa'),
        ).rejects.toMatchSnapshot()
      })

      test('should receive whisper', async (done) => {
        const raw = tags.WHISPER

        const chat = new Chat(options)
        await chat.connect()

        chat.once('WHISPER', (message) => {
          expect(message).toMatchSnapshot({
            timestamp: expect.any(Date),
          })
          done()
        })

        emitHelper(chat._client, raw)
      })
    })

    test('should emit multiple events for compound events', async (done) => {
      const chat = new Chat({ log: { enabled: false } })
      await chat.connect()

      const events = [
        Commands.USER_NOTICE,
        Events.SUBSCRIPTION,
        '#dallas',
        UserNoticeCompounds.SUBSCRIPTION,
        `${UserNoticeCompounds.SUBSCRIPTION}/#dallas`,
      ]

      Promise.all(events.map((event) => pEvent(chat, event))).then(
        (messages) => {
          expect(messages[0]).toMatchSnapshot({
            timestamp: expect.any(Date),
          })

          messages.forEach((message) => expect(message).toEqual(messages[0]))
          done()
        },
      )
      chat.once(Commands.USER_NOTICE, (message) => {
        expect(message).toMatchSnapshot({
          timestamp: expect.any(Date),
        })
        done()
      })

      emitHelper(chat._client, tags.USERNOTICE.SUBSCRIPTION)
    })

    describe('deviations', () => {
      test('CLEARCHAT deviation 1', async (done) => {
        const chat = new Chat(options)
        await chat.connect()

        expect.assertions(1)

        chat.on('CLEARCHAT', (actual) => {
          expect(actual).toMatchSnapshot({
            timestamp: expect.any(Date),
          })
          done()
        })

        emitHelper(chat._client, rawCommands.CLEARCHAT.DEVIATION_1)
      })

      test.each(Object.entries(issues))('%s', async (_issue, message) => {
        const chat = new Chat(options)
        await chat.connect()

        expect.assertions(message.split('\n').length)

        chat.on('*', (actual) => {
          expect(actual).toMatchSnapshot({
            timestamp: expect.any(Date),
          })
        })

        server.sendMessageToClient(message)
      })
    })
  })

  describe('should handle multiple channels', () => {
    test.todo('should join multiple channels')
    test.todo('should broadcast message to all channels')

    test('should deny message broadcasting when anonymous', async () => {
      const chat = new Chat(anonymousOptions)
      await chat.connect()

      await expect(
        chat.broadcast('Kappa Keepo Kappa'),
      ).rejects.toMatchSnapshot()
    })
  })
})
