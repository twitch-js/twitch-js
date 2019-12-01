import pino, { LoggerOptions } from 'pino'

export type Options = LoggerOptions

type Timer = (message: string) => { done: (message: string) => void }

const createLogger = ({
  name,
  prettyPrint = true,
  level = 'error',
  ...options
}: LoggerOptions = {}) => {
  const scope = ['TwitchJS'].concat(name || []).join('/')

  const logger = pino({ name: scope, ...options })

  const startTimer = (startMessage: string) => {
    const now = Date.now()

    logger.info(startMessage)

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

  // @ts-ignore
  logger.startTimer = startTimer

  return logger as pino.Logger & { startTimer: typeof startTimer }
}

export type Logger = ReturnType<typeof createLogger>

export default createLogger
