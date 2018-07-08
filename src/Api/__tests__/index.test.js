import Api from '../index'

describe('Api', () => {
  const options = {
    token: 'TOKEN',
    clientId: 'CLIENT_ID',
  }

  describe('constructor', async () => {
    test('should instantiate with token', () => {
      expect(() => new Api({ ...options, clientId: undefined })).not.toThrow()
    })

    test('should instantiate with clientId', () => {
      expect(() => new Api({ ...options, token: undefined })).not.toThrow()
    })

    test('should throw if token AND clientId are absent', () => {
      expect(() => new Api({})).toThrow()
    })
  })
})
