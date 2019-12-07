import pino, { LoggerOptions } from 'pino'

export type Options = LoggerOptions

const createLogger = ({ name, ...options }: LoggerOptions = {}) => {
  const scope = ['TwitchJS'].concat(name || []).join('/')

  const logger = pino({
    name: scope,
    prettyPrint: true,
    level: 'info',
    ...options,
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  logger.profile = profile

  return logger as pino.Logger & { profile: typeof profile }
}

export type Logger = ReturnType<typeof createLogger>

export default createLogger
