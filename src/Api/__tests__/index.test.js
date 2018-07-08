import Api from '../index'
import fetchUtil from '../../utils/fetch'

jest.mock('../../utils/fetch')

describe('Api', () => {
  const options = {
    token: 'TOKEN',
    clientId: 'CLIENT_ID',
  }

  afterEach(() => {
    fetchUtil.mockClear()
  })

  describe('constructor', () => {
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

  describe('initialize', () => {
    test('should set readyState and status', async () => {
      const api = new Api(options)
      await api.initialize()

      expect(api.readyState).toBe(2)
      expect(api.status).toMatchSnapshot()
    })

    test('should resolve if already initialized', async () => {
      const api = new Api(options)
      await api.initialize()
      const actual = await api.initialize()

      expect(actual).toMatchSnapshot()
    })
  })

  describe('hasScope', () => {
    test('should reject if instance is uninitialized', () => {
      const api = new Api(options)
      const actual = api.hasScope('user_read')
      expect(actual).rejects.toBe(false)
    })

    test('should reject if scope is absent', () => {
      const api = new Api(options)
      const actual = api.hasScope('channel_read')
      expect(actual).rejects.toBe(false)
    })

    test('should resolve if scope is present', async () => {
      const api = new Api(options)
      await api.initialize()

      const actual = api.hasScope('user_read')

      expect(actual).resolves.toBe(true)
    })
  })

  describe('methods', () => {
    test('get should call fetch', async () => {
      const api = new Api(options)

      const endpoint = 'ENDPOINT'
      const opts = { a: { b: 'c ' } }
      await api.get(endpoint, opts)

      const [actualEndpoint, actualOpts] = fetchUtil.mock.calls[0]

      expect(actualEndpoint).toEqual(expect.stringContaining(endpoint))
      expect(actualOpts).toMatchObject(opts)
    })

    test('post should call fetch with method=post', async () => {
      const api = new Api(options)

      const endpoint = 'ENDPOINT'
      const opts = { a: { b: 'c ' } }
      await api.post(endpoint, opts)

      const [, actualOpts] = fetchUtil.mock.calls[0]

      expect(actualOpts).toMatchObject({ method: 'post' })
    })

    test('put should call fetch with method=put', async () => {
      const api = new Api(options)

      const endpoint = 'ENDPOINT'
      const opts = { a: { b: 'c ' } }
      await api.put(endpoint, opts)

      const [, actualOpts] = fetchUtil.mock.calls[0]

      expect(actualOpts).toMatchObject({ method: 'put' })
    })
  })
})
