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

  describe('ROOMSTATE tags', () => {
    test('should parse ROOMSTATE tags', () => {
      const roomStateTags = {
        followersOnly: '30',
        broadcasterLang: 'en',
        slow: '5',
        emoteOnly: '1',
        r9k: '1',
        subsOnly: '1',
        unknownTag: 'unknownTagValue',
      }

      const actual = tags.roomState(roomStateTags)

      expect(actual).toMatchSnapshot()
    })
  })
})
