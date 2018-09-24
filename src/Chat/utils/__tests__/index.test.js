import * as constants from '../../constants'
import * as utils from '../index'

describe('Chat/utils', () => {
  describe('getMessageQueueWeight', () => {
    test('should return verified bot rate', () => {
      const actual = utils.getMessageQueueWeight({ isVerifiedBot: true })
      const expected = constants.RATE_LIMIT_VERIFIED_BOT
      expect(actual).toEqual(expected)
    })

    test('should return known bot rate', () => {
      const actual = utils.getMessageQueueWeight({ isKnownBot: true })
      const expected = constants.RATE_LIMIT_KNOWN_BOT
      expect(actual).toEqual(expected)
    })

    test('should return moderator rate', () => {
      const actual = utils.getMessageQueueWeight({ isModerator: true })
      const expected = constants.RATE_LIMIT_MODERATOR
      expect(actual).toEqual(expected)
    })

    test('should return default rate', () => {
      const actual = utils.getMessageQueueWeight()
      const expected = constants.RATE_LIMIT_USER
      expect(actual).toEqual(expected)
    })
  })

  describe('isAuthenticationFailedMessage', () => {
    test('should return true for authentication failed messages', () => {
      const message = {
        command: constants.EVENTS.NOTICE,
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

    test('should return EVENTS.ALL by default', () => {
      const actual = utils.getEventNameFromMessage()
      const expected = constants.EVENTS.ALL
      expect(actual).toEqual(expected)
    })
  })

  describe('isAnonymousUsername', () => {
    test('should return true if anonymous', () => {
      const actual = utils.isAnonymousUsername('justinfan12345')
      const expected = true
      expect(actual).toEqual(expected)
    })

    test('should return false otherwise', () => {
      const actual = utils.isAnonymousUsername('lorem_ipsum')
      const expected = false
      expect(actual).toEqual(expected)
    })
  })
})
