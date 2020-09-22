import * as validators from '../validators'

describe('Api/utils/validators', () => {
  const options = { clientId: 'CLIENT_ID' }

  describe('apiOptions', () => {
    test('should return default chat options', () => {
      const actual = validators.apiOptions(options)

      expect(actual).toMatchSnapshot()
    })

    test('default onAuthenticationFailure should reject', async () => {
      const { onAuthenticationFailure } = validators.apiOptions(options)

      // @ts-expect-error onAuthenticationFailure is optional
      await expect(onAuthenticationFailure()).rejects.toBeUndefined()
    })
  })
})
