import * as validators from '../validators'

describe('Api/utils/validators', () => {
  const options = { token: 'TOKEN' }

  describe('apiOptions', () => {
    test('should return default chat options', () => {
      const actual = validators.apiOptions(options)

      expect(actual).toMatchSnapshot()
    })

    test('should throw if token is missing', async () => {
      expect(() =>
        validators.apiOptions({ ...options, token: undefined }),
      ).toThrow()
    })
  })
})
