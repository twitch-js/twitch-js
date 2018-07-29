import { EventEmitter } from 'eventemitter3'

import { commandCreator } from '../commands'
import * as constants from '../../constants'

jest.useFakeTimers()

describe('commands', () => {
  const eventEmitter = new EventEmitter()

  const say = jest.fn()
  const once = eventEmitter.once.bind(eventEmitter)
  const context = { say, once }
  const timeout = 1000

  afterEach(() => {
    say.mockClear()
    eventEmitter.removeAllListeners()
  })

  describe('commandCreator', () => {
    const channel = '#dallas'
    const command = 'MY_COMMAND'
    const args = ['arg_1', 'arg_2']

    test('should call say and resolve', () => {
      const callCommand = commandCreator.call(context, { command })

      return callCommand(channel, ...args).then(() => {
        const actual = say.mock.calls[0]
        const expected = [channel, `/${command} ${args.join(' ')}`]

        expect(actual).toEqual(expected)
      })
    })

    test('should reject after timeout', () => {
      const callCommand = commandCreator.call(context, { command, timeout })

      const actual = callCommand(channel, ...args)
      const expected = constants.ERROR_COMMAND_TIMED_OUT

      jest.runOnlyPendingTimers()

      expect(actual).rejects.toBe(expected)
    })

    test('should reject if UNRECOGNIZED_COMMAND is emitted', () => {
      const callCommand = commandCreator.call(context, { command, timeout })

      const actual = callCommand(channel, ...args)
      const expected = constants.ERROR_COMMAND_UNRECOGNIZED

      eventEmitter.emit(constants.NOTICE_MESSAGE_IDS.UNRECOGNIZED_COMMAND)

      expect(actual).rejects.toBe(expected)
    })

    describe('with confirmation', () => {
      const confirmationEvent = 'CONFIRMATION_EVENT'
      const confirmationMessage = 'CONFIRMATION_MESSAGE'

      test('should resolve on confirmation event', () => {
        const confirmations = [{ event: confirmationEvent }]

        const callCommand = commandCreator.call(context, {
          command,
          confirmations,
        })

        const actual = callCommand(channel, ...args)
        const expected = confirmationMessage

        eventEmitter.emit(confirmationEvent, confirmationMessage)

        expect(actual).resolves.toEqual(expected)
      })

      test('should resolve on cb => true', () => {
        const cb = message => message === confirmationMessage
        const confirmations = [{ event: confirmationEvent, cb }]

        const callCommand = commandCreator.call(context, {
          command,
          confirmations,
        })

        const actual = callCommand(channel, ...args)
        const expected = confirmationMessage

        eventEmitter.emit(confirmationEvent, confirmationMessage)

        expect(actual).resolves.toEqual(expected)
      })

      test('should reject on cb => false', () => {
        const cb = message => message !== confirmationMessage
        const confirmations = [{ event: confirmationEvent, cb }]

        const callCommand = commandCreator.call(context, {
          command,
          confirmations,
        })

        const actual = callCommand(channel, ...args)
        const expected = false

        eventEmitter.emit(confirmationEvent, confirmationMessage)

        expect(actual).rejects.toEqual(expected)
      })
    })
  })

  describe('commandFactor', () => {
    // TODO
  })
})
