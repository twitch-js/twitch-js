import * as validators from '../validators'

describe('Api/utils/validators', () => {
  const username = 'USERNAME'
  const token = 'TOKEN'

  describe('apiOptions', () => {
    test('should return default chat options', () => {
      const actual = validators.apiOptions({ username, token })

      expect(actual).toMatchSnapshot()
    })

    test('default onAuthenticationFailure should reject', done => {
      const { onAuthenticationFailure } = validators.apiOptions({
        username,
        token,
      })

      onAuthenticationFailure().catch(() => done())
    })
  })
})
