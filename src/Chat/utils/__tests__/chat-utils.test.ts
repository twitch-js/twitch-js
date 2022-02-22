import { Commands, Events } from '../../../twitch'

import * as utils from '../chat-utils'

describe('Chat/utils', () => {
  describe('isAuthenticationFailedMessage', () => {
    test('should return true for authentication failed messages', () => {
      const message = {
        command: Commands.NOTICE,
        channel: '',
        message: 'Login authentication failed',
      }

      const actual = utils.isAuthenticationFailedMessage(message)
      const expected = true
      expect(actual).toEqual(expected)
    })

    test('should return false by default', () => {
      const actual = utils.isAuthenticationFailedMessage()
      const expected = false
      expect(actual).toEqual(expected)
    })
  })

  describe('getEventNameFromMessage', () => {
    test('should return command', () => {
      const command = 'COMMAND'
      const actual = utils.getEventNameFromMessage({ command })
      const expected = command
      expect(actual).toEqual(expected)
    })

    test('should return event', () => {
      const event = 'EVENT'
      const actual = utils.getEventNameFromMessage({ event })
      const expected = event
      expect(actual).toEqual(expected)
    })

    test('should return `*` by default', () => {
      const actual = utils.getEventNameFromMessage()
      const expected = Events.ALL
      expect(actual).toEqual(expected)
    })
  })

  describe('isUserAnonymous', () => {
    test('should return true if anonymous', () => {
      const actual = utils.isUserAnonymous('justinfan12345')
      const expected = true
      expect(actual).toEqual(expected)
    })

    test('should return false otherwise', () => {
      const actual = utils.isUserAnonymous('lorem_ipsum')
      const expected = false
      expect(actual).toEqual(expected)
    })
  })
})
