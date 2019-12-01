import * as utils from '../'

describe('utils', () => {
  describe('resolveAfter', () => {
    test('should resolve after specified time', done => {
      jest.useFakeTimers()
      utils.resolveAfter(100).then(() => done())
      jest.runOnlyPendingTimers()
    })
  })

  describe('rejectAfter', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    test('should call setTimeout', done => {
      const ms = 123
      const error = new Error('REJECT_MESSAGE')

      utils.rejectAfter(ms, error).catch(() => {
        expect(setTimeout).toHaveBeenLastCalledWith(
          expect.any(Function),
          ms,
          error,
        )
        done()
      })

      jest.runOnlyPendingTimers()
    })

    test('should reject after specified time with reason', done => {
      const ms = 456
      const error = new Error('REJECT_MESSAGE')

      utils.rejectAfter(ms, error).catch(rejectedReason => {
        expect(rejectedReason).toEqual(error)
        done()
      })

      jest.runOnlyPendingTimers()
    })
  })

  test('resolveInSequence', async () => {
    const cb = jest.fn()
    const p = n => new Promise(resolve => resolve(cb(n)))

    await utils.resolveInSequence([
      p.bind(null, 1),
      p.bind(null, 2),
      p.bind(null, 3),
    ])

    expect(cb).toHaveBeenNthCalledWith(1, 1)
    expect(cb).toHaveBeenNthCalledWith(2, 2)
    expect(cb).toHaveBeenNthCalledWith(3, 3)
  })
})
