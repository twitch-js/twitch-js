import * as sanitizers from '../sanitizers'

describe('Chat/utils/sanitizers', () => {
  describe('token', () => {
    test('should return "TWITCHJS"', () => {
      const actual = sanitizers.token(null)
      const expected = 'TWITCHJS'
      expect(actual).toEqual(expected)
    })

    test('should return the input token', () => {
      const actual = sanitizers.token('oauth:lorem')
      const expected = 'oauth:lorem'
      expect(actual).toEqual(expected)
    })

    test('should return the token prepended by "oauth:"', () => {
      const actual = sanitizers.token('lorem')
      const expected = 'oauth:lorem'
      expect(actual).toEqual(expected)
    })
  })

  describe('username', () => {
    test('should return the anonymous username appended with random numbers', () => {
      const actual = sanitizers.username('justinfan')
      const expected = expect.stringMatching(/^justinfan\d+/)
      expect(actual).toEqual(expected)
    })

    test('should return the input username', () => {
      const username = 'lorem'
      const actual = sanitizers.username(username)
      const expected = username
      expect(actual).toEqual(expected)
    })
  })
})
