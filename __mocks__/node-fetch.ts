const mockJson = jest.fn(() => Promise.resolve({}))

const mockFetch = jest.fn(url => {
  return Promise.resolve({
    status: 200,
    ok: true,
    url,
    statusText: 'OK',
    json: mockJson,
  })
})

export { mockJson }
export default mockFetch
