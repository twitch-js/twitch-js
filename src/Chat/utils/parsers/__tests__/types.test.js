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

  describe('followersOnly', () => {
    test('should return false by default', () => {
      const actual = types.followersOnly()
      const expected = false

      expect(actual).toBe(expected)
    })

    test('should return true if followers only is active', () => {
      const actual = types.followersOnly('0')
      const expected = true

      expect(actual).toBe(expected)
    })

    test('should return minimum followers time', () => {
      const actual = types.followersOnly('7')
      const expected = 7

      expect(actual).toBe(expected)
    })
  })

  describe('badges', () => {
    test('should not parse unknown badges', () => {
      const badge = 'unknownBadge'
      const version = 'unknownBadgeVersion'

      const actual = types.badges(`${badge}/${version}`)
      const expected = { [badge]: version }

      expect(actual).toEqual(expected)
    })

    test('should parse known badges', () => {
      const badges =
        'admin/1,broadcaster/1,globalMod/1,moderator/1,partner/1,premium/1,staff/1,subGifter/1,turbo/1,vip/1,bits/100,bitsLeader/3,subscriber/9'

      const actual = types.badges(badges)

      expect(actual).toMatchSnapshot()
    })
  })
})
