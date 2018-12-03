import * as validators from '../validators'

describe('Chat/utils/validators', () => {
  const username = 'USERNAME'
  const token = 'TOKEN'

  describe('chatOptions', () => {
    test('should return default chat options', () => {
      const actual = validators.chatOptions({ username, token })

      expect(actual).toMatchSnapshot()
    })

    test('default onAuthenticationFailure should reject', done => {
      const { onAuthenticationFailure } = validators.chatOptions({
        username,
        token,
      })

      onAuthenticationFailure().catch(() => done())
    })
  })
})
