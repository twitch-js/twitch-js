import * as validators from '../api-validators'

describe('Api/utils/validators', () => {
  const options = { token: 'TOKEN', clientId: 'CLIENT_ID' }

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

    test('should throw if clientId is missing', async () => {
      expect(() =>
        validators.apiOptions({ ...options, clientId: undefined }),
      ).toThrow()
    })
  })
})
