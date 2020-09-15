import * as utils from '../'
import EventEmitter from 'eventemitter3'
import { GlobalFunction } from 'lodash/common/lang'

describe('utils', () => {
  describe('resolveAfter', () => {
    test('should resolve after specified time', done => {
      jest.useFakeTimers()
      utils.resolveAfter(100).then(() => done())
      jest.runOnlyPendingTimers()
    })
  })

  describe('resolveOnEvent', () => {
    const emitter = new EventEmitter()

    beforeEach(jest.useFakeTimers)
    afterEach(jest.restoreAllMocks)
    afterEach(() => emitter.removeAllListeners())

    it('should resolve promise on event', done => {
      utils
        .resolveOnEvent(emitter, 'event')
        .then(result => expect(result).toEqual('value'))
        .then(done)

      emitter.emit('event', 'value')
    })

    it('should never reject if no timeout is passed', () => {
      const resolveSpy = jest.fn()
      const rejectSpy = jest.fn()

      jest
        .spyOn(global, 'Promise')
        .mockImplementation(callback => callback(resolveSpy, rejectSpy))

      utils.resolveOnEvent(emitter, 'event')
      jest.runOnlyPendingTimers()

      expect(resolveSpy).toBeCalledTimes(0)
      expect(rejectSpy).toBeCalledTimes(0)
    })

    it('should reject with timemout', done => {
      utils.resolveOnEvent(emitter, 'event', 10000).catch(error => {
        expect(error).toEqual(new Error('no event emitted, timed out'))
        done()
      })

      jest.runOnlyPendingTimers()
    })

    it('should only expire instance of timed out listener', async () => {
      expect.assertions(2)

      const firstPromise = utils.resolveOnEvent(emitter, 'event')
      const secondPromise = utils.resolveOnEvent(emitter, 'event', 10000)

      jest.advanceTimersByTime(10000)

      emitter.emit('event', 'value')

      await secondPromise.catch(error => expect(error).toBeTruthy())

      const result = await firstPromise
      expect(result).toEqual('value')
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
