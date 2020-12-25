import * as utils from '../index'
import * as sanitizers from '../sanitizers'

describe('Chat/utils/sanitizers', () => {
  describe('channel', () => {
    test('should return "#" when null or empty', () => {
      const actual = sanitizers.channel(null)
      const expected = '#'
      expect(actual).toEqual(expected)
    })

    test('should return the sanitized channel', () => {
      const actual = sanitizers.channel('lorem')
      const expected = '#lorem'
      expect(actual).toEqual(expected)
    })

    test('should return the input channel', () => {
      const actual = sanitizers.channel('#lorem')
      const expected = '#lorem'
      expect(actual).toEqual(expected)
    })
  })

  describe('password', () => {
    test('should return "TWITCHJS"', () => {
      const actual = sanitizers.token(null)
      const expected = 'TWITCHJS'
      expect(actual).toEqual(expected)
    })

    test('should return the input password', () => {
      const actual = sanitizers.token('oauth:lorem')
      const expected = 'oauth:lorem'
      expect(actual).toEqual(expected)
    })

    test('should return the password prepended by "oauth:"', () => {
      const actual = sanitizers.token('lorem')
      const expected = 'oauth:lorem'
      expect(actual).toEqual(expected)
    })
  })

  describe('username', () => {
    test('should return the anonymous username', () => {
      const actual = sanitizers.username(null)
      const expected = true
      expect(utils.isUserAnonymous(actual)).toBe(expected)
    })

    test('should return the anonymous username appended with random numbers', () => {
      const actual = sanitizers.username('justinfan')
      const expected = true
      expect(utils.isUserAnonymous(actual)).toBe(expected)
    })

    test('should return the input username', () => {
      const actual = sanitizers.username('lorem')
      const expected = false
      expect(utils.isUserAnonymous(actual)).toBe(expected)
    })
  })
})
