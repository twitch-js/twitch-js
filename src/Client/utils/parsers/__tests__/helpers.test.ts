import * as helpers from '../helpers'

describe('Chat/utils/parsers/helpers', () => {
  describe('usernameFromPrefix', () => {
    test('should return undefined by default', () => {
      const actual = helpers.username(true, 1)

      expect(actual).toBeUndefined()
    })
  })
})
