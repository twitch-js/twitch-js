import * as utils from '../'

describe('utils', () => {
  describe('delay', () => {
    test('should resolve after specified time', done => {
      jest.useFakeTimers()
      utils.delay(100).then(() => done())
      jest.runOnlyPendingTimers()
    })
  })
  describe('delayReject', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    test('should call setTimeout', () => {
      const ms = 123
      const reason = 'MESSAGE'

      const actual = utils.delayReject(ms, reason).catch(() => {
        expect(setTimeout).toHaveBeenLastCalledWith(
          expect.any(Function),
          ms,
          reason,
        )
      })

      jest.runOnlyPendingTimers()

      return actual
    })

    test('should reject after specified time with reason', done => {
      const ms = 456
      const reason = 'timeout'

      const actual = utils.delayReject(ms, reason).catch(rejectedReason => {
        expect(rejectedReason).toEqual(reason)
        done()
      })

      jest.runOnlyPendingTimers()

      return actual
    })
  })
})
