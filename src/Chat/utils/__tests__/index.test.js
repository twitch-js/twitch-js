import * as utils from '../index'

describe('defer', () => {
  const realSetImmediate = self.setImmediate

  beforeEach(() => {
    self.setImmediate = realSetImmediate
  })

  afterAll(() => {
    self.setImmediate = realSetImmediate
  })

  test('should execute when setImmediate is defined', async () => {
    const promise = new Promise(resolve => {
      utils.defer(resolve)
    })

    await expect(promise).resolves.toBeUndefined()
  })

  test('should execute when setImmediate is undefined', async () => {
    self.setImmediate = undefined

    const promise = new Promise(resolve => {
      utils.defer(resolve)
    })

    await expect(promise).resolves.toBeUndefined()
  })
})
