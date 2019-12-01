import createLogger from '../'

describe('logger', () => {
  test('should create logger', () => {
    const level = 'info'
    const logger = createLogger({ level })

    const actual = logger.level

    expect(actual).toEqual(level)
  })

  test('should create logger without any arguments', () => {
    const level = 'info'
    const logger = createLogger()

    const actual = logger.level

    expect(actual).toEqual(level)
  })
})
