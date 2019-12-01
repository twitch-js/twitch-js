import * as validators from '../validators'

describe('Api/utils/validators', () => {
  const options = { clientId: 'CLIENT_ID' }

  describe('apiOptions', () => {
    test('should return default chat options', () => {
      const actual = validators.apiOptions(options)

      expect(actual).toMatchSnapshot()
    })

    test('default onAuthenticationFailure should reject', () => {
      const { onAuthenticationFailure } = validators.apiOptions(options)

      expect(() => onAuthenticationFailure()).toThrow()
    })
  })
})
