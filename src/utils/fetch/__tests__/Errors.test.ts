import ErrorFactory, * as Errors from '../Errors'

describe('ErrorFactory', () => {
  test('should instantiate AuthenticationError on 401', () => {
    const actual = ErrorFactory({ status: 401 }, {})
    expect(actual).toBeInstanceOf(Errors.AuthenticationError)
  })
})
