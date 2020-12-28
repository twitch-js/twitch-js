import * as validators from '../validators'

describe('Chat/utils/validators', () => {
  const username = 'USERNAME'
  const token = 'TOKEN'

  describe('clientOptions', () => {
    test('should return default client options', () => {
      const actual = validators.clientOptions({ username, token })

      expect(actual).toMatchSnapshot()
    })
  })
})
