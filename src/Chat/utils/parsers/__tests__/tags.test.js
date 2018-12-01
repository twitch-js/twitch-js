import * as tags from '../tags'

describe('Chat/utils/parsers/tags', () => {
  describe('privateMessageCheerEvent', () => {
    test('should return empty object for non-bits message', () => {
      const actual = tags.privateMessageCheerEvent({ bits: 0 })
      const expected = {}

      expect(actual).toEqual(expected)
    })
    test('should return cheer event object', () => {
      const actual = tags.privateMessageCheerEvent({ bits: 100 })

      expect(actual).toMatchSnapshot()
    })
  })
})
