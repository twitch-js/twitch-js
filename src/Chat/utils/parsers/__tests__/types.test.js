import * as types from '../types'

describe('Chat/utils/parsers/types', () => {
  describe('usernameFromPrefix', () => {
    test('should return undefined by default', () => {
      const actual = types.usernameFromPrefix({})

      expect(actual).toBeUndefined()
    })
  })

  describe('broadcasterLanguage', () => {
    test('should return string', () => {
      const language = 'en'

      const actual = types.broadcasterLanguage(language)
      const expected = language

      expect(actual).toEqual(expected)
    })

    test('should return undefined when given non-strings', () => {
      const language = {}

      const actual = types.broadcasterLanguage(language)

      expect(actual).toBeUndefined()
    })
  })
})
