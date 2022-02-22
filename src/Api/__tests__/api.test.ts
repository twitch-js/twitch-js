import { mocked } from 'ts-jest/utils'
import nodeFetch from 'cross-fetch'
import omit from 'lodash/omit'

import { FetchError } from '../../utils/fetch'

import Api from '../api'
import { AuthenticationError } from '../../utils/error'

jest.mock('cross-fetch')

const fetchUtil = mocked(nodeFetch, true)

describe('Api', () => {
  jest.setTimeout(500)

  const options = {
    token: 'TOKEN',
    clientId: 'CLIENT_ID',
    log: { enabled: false },
  }

  const fetchOptions = { search: { a: 'b' } }

  afterEach(() => {
    fetchUtil.mockClear()
  })

  test('should allow options to be updated', () => {
    const api = new Api(options)

    const log = { level: 'info' }

    const nextOptions = {
      clientId: 'NEXT_CLIENT_ID',
      token: 'NEXT_TOKEN',
      log,
    }

    api.updateOptions(nextOptions)

    expect(
      // @ts-expect-error private property
      api._options,
    ).toMatchObject({ ...nextOptions, log })
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

    test('should update client options', async () => {
      const api = new Api(options)
      expect(
        // @ts-expect-error private property
        api._options.token,
      ).toBe(options.token)

      const newToken = 'NEW_TOKEN'
      await api.initialize({ token: newToken })

      expect(
        // @ts-expect-error private property
        api._options.token,
      ).toBe(newToken)
    })
  })

  test('should create headers', async () => {
    const api = new Api(options)
    await api.get('')

    expect(fetchUtil.mock.calls).toMatchSnapshot()
  })

  describe('hasScope', () => {
    test('should reject if instance is uninitialized', async () => {
      const api = new Api(options)
      await expect(api.hasScope('user_read')).rejects.toBe(false)
    })

    test('should reject if scope is absent', async () => {
      const api = new Api(options)
      await api.initialize()
      await expect(api.hasScope('channel_read')).rejects.toBe(false)
    })

    test('should resolve if scope is present', async () => {
      const api = new Api(options)
      await api.initialize()
      await expect(api.hasScope('user_read')).resolves.toBe(true)
    })
  })

  describe('methods', () => {
    test('get should call fetch', async () => {
      const api = new Api(options)

      const endpoint = 'ENDPOINT'
      await api.get(endpoint, fetchOptions)

      const [actualEndpoint, actualOpts] = fetchUtil.mock.calls[0]

      expect(actualEndpoint).toEqual(expect.stringContaining(endpoint))
      expect(actualOpts).toMatchObject(omit(fetchOptions, 'search'))
    })

    test('post should call fetch with method=post', async () => {
      const api = new Api(options)

      const endpoint = 'ENDPOINT'
      const body = { broadcaster_id: 'BROADCASTER_ID' }
      await api.post(endpoint, { ...fetchOptions, body })

      const [, actualOpts] = fetchUtil.mock.calls[0]

      expect(actualOpts).toMatchSnapshot()
    })

    test('put should call fetch with method=put', async () => {
      const api = new Api(options)

      const endpoint = 'ENDPOINT'
      await api.put(endpoint, fetchOptions)

      const [, actualOpts] = fetchUtil.mock.calls[0]

      expect(actualOpts).toMatchObject({ method: 'put' })
    })

    test('should throw on failure', async () => {
      expect.assertions(2)

      const api = new Api(options)

      try {
        await api.get('404')
      } catch (error) {
        if (error instanceof FetchError) {
          expect(error).toBeInstanceOf(FetchError)
          expect(error.body).toMatchSnapshot()
        }
      }
    })
  })

  describe('onAuthenticationFailure', () => {
    test('should throw AuthenticationError', async () => {
      const api = new Api({
        ...options,
        token: 'INVALID_TOKEN',
      })

      try {
        await api.get('401')
      } catch (error) {
        expect(error).toBeInstanceOf(AuthenticationError)
      }
    })

    test('should call onAuthenticationFailure', async () => {
      const onAuthenticationFailure = jest.fn(() => Promise.reject())
      const api = new Api({
        ...options,
        token: 'INVALID_TOKEN',
        onAuthenticationFailure,
      })

      try {
        await api.get('401')
      } catch (error) {
        expect(onAuthenticationFailure).toHaveBeenCalled()
        expect(error).toBeInstanceOf(AuthenticationError)
      }
    })

    test('should refresh token and try again', async () => {
      const onAuthenticationFailure = jest.fn(() => Promise.resolve('TOKEN'))
      const api = new Api({
        ...options,
        token: 'INVALID_TOKEN',
        onAuthenticationFailure,
      })

      try {
        await api.get('401')
      } catch (error) {
        expect(onAuthenticationFailure).toHaveBeenCalled()
        expect(fetchUtil).toHaveBeenCalledTimes(2)
        expect(
          // @ts-expect-error private property
          api._options.token,
        ).toEqual('TOKEN')
      }
    })
  })
})
