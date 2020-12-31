import pino, {
  Logger as PinoLogger,
  LoggerOptions as PinoLoggerOptions,
} from 'pino'

/**
 * @see https://github.com/pinojs/pino/blob/v6.3.1/docs/api.md#options
 */
export type LoggerOptions = PinoLoggerOptions

const createLogger = (options: LoggerOptions = {}) => {
  const { name, ...other } = options

  const scope = ['TwitchJS'].concat(name || []).join('/')

  const logger = pino({
    name: scope,
    prettyPrint: true,
    level: 'info',
    ...other,
  })

  const profile = (startMessage?: string) => {
    const now = Date.now()

    if (startMessage) {
      logger.info(startMessage)
    }

    return {
      done: (endMessage: string, error?: any) => {
        const elapsed = Date.now() - now
        const message = `${endMessage} (${elapsed}ms)`

        if (error) {
          logger.error(message, error)
        } else {
          logger.info(message)
        }
      },
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  logger.profile = profile

  return logger as PinoLogger & { profile: typeof profile }
}

export type Logger = ReturnType<typeof createLogger>

export default createLogger
