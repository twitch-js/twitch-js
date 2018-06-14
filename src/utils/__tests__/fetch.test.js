import fetch from 'node-fetch'
import FormData from 'form-data'

import fetchUtil, { parseResponse } from '../fetch'

jest.mock('node-fetch')

const mockUrl = 'http://example.com'

const mockJsonResponse = { data1: 'DATA_1' }
const mockResponse = {
  status: 200,
  ok: true,
  url: 'URL',
  statusText: 'OK',
  json: () => Promise.resolve(mockJsonResponse),
}

const mockJsonResponseError = { error: true }
const mockResponseError = {
  status: 404,
  ok: false,
  url: 'URL',
  statusText: 'NOT OK',
  json: () => Promise.resolve(mockJsonResponseError),
}

describe('utils/fetch', () => {
  afterEach(() => {
    fetch.mockClear()
  })

  describe('fetchUtil', () => {
    test('should call fetch with URL', async () => {
      await fetchUtil(mockUrl)

      const actual = fetch.mock.calls[0]
      expect(actual[0]).toEqual(mockUrl)
    })

    test('should call fetch with URL and search parameters', async () => {
      const options = { search: { a: { b: 'c' } } }
      await fetchUtil(mockUrl, options)

      const actual = fetch.mock.calls[0]
      expect(actual[0]).toEqual(`${mockUrl}?a%5Bb%5D=c`)
    })

    test('should handle headers', async () => {
      const options = {
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      }
      await fetchUtil(mockUrl, options)

      const actual = fetch.mock.calls[0]
      expect(actual[1].headers).toEqual(options.headers)
    })

    test('should handle instanceof body === FormData', async () => {
      const body = new FormData()
      body.append('a', 'b')

      const options = { body }
      await fetchUtil(mockUrl, options)

      const actual = fetch.mock.calls[0]
      expect(actual[1].body).toBeInstanceOf(FormData)
    })

    test('should handle typeof body === object', async () => {
      const options = { body: { a: { b: 'c' } } }
      await fetchUtil(mockUrl, options)

      const actual = fetch.mock.calls[0]
      expect(actual[1].body).toEqual(JSON.stringify(options.body))
      expect(actual[1].headers['Content-Type']).toEqual('application/json')
    })
  })

  describe('parseResponse', () => {
    test('should return response on successful response', () => {
      const actual = parseResponse(mockResponse)
      const expected = mockJsonResponse

      expect(actual).resolves.toEqual(expected)
    })

    test('should throw on unsuccessful response', () => {
      const actual = parseResponse(mockResponseError)

      expect(actual).rejects.toBeInstanceOf(Error)
      expect(actual).rejects.toMatchObject({ response: mockJsonResponseError })
    })
  })
})
