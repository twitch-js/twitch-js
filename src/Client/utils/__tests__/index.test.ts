import { BaseMessage, Commands } from '../../../twitch'

import * as utils from '../index'

describe('Chat/utils', () => {
  describe('isAuthenticationFailedMessage', () => {
    test('should return true for authentication failed messages', () => {
      const message = {
        command: Commands.NOTICE,
        channel: '',
        message: 'Login authentication failed',
      } as BaseMessage

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
})
