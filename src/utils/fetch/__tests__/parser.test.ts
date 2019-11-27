import parser from '../parser'

describe('parser', () => {
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

  test('should return response on successful response', () => {
    const actual = parser(mockResponse)
    const expected = mockJsonResponse

    expect(actual).resolves.toEqual(expected)
  })

  test('should throw on unsuccessful response', () => {
    const actual = parser(mockResponseError)

    expect(actual).rejects.toBeInstanceOf(Error)
    expect(actual).rejects.toMatchObject({ body: mockJsonResponseError })
  })
})
