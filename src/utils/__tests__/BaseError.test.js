import BaseError from '../BaseError'

describe('BaseError', () => {
  const spy = jest.spyOn(Error, 'captureStackTrace')

  afterEach(() => spy.mockClear())

  test('should call Error.captureStackTrace', () => {
    const spy = jest.spyOn(Error, 'captureStackTrace')

    new BaseError('ERROR_MESSAGE')

    expect(spy).toHaveBeenCalled()
  })

  test('should not call Error.captureStackTrace', () => {
    const realErrorCaptureStackTrace = Error.captureStackTrace

    const spy = jest.spyOn(Error, 'captureStackTrace')
    Error.captureStackTrace = false

    new BaseError('ERROR_MESSAGE')

    expect(spy).not.toHaveBeenCalled()
    Error.captureStackTrace = realErrorCaptureStackTrace
  })
})
