import createLogger from '../create'

describe('logger', () => {
  test('should create logger', () => {
    const level = 'info'
    const logger = createLogger({ level })

    const actual = logger.level

    expect(actual).toEqual(level)
  })

  test('should create logger without any arguments', () => {
    const level = process.env.CONSOLA_LEVEL
    const logger = createLogger()

    const actual = String(logger.level)

    expect(actual).toEqual(level)
  })

  test('should create logger with scope', () => {
    const scope = 'SCOPE'
    const logger = createLogger({ scope })

    const actual = logger._defaults.tag
    const expected = `twitch-js/${scope}`

    expect(actual).toEqual(expected)
  })
})
