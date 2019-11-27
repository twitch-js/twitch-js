/**
 * Elegant Console Logger for Node.js and Browser
 * @external consola
 * @see {@link https://github.com/nuxt/consola#readme consola}
 */
import consola, { ConsolaOptions, Consola } from 'consola'

type Options = ConsolaOptions & { scope?: string }

const createLogger = ({ scope, ...options }: Options = {}) => {
  const label = ['twitch-js'].concat(scope || []).join('/')

  const logger = consola.create(options).withScope(label)

  const startTimer = (startMessage: string) => {
    const now = Date.now()

    logger.info(startMessage)

    return {
      done: (endMessage: string, error?: any) => {
        const elapsed = Date.now() - now

        if (error) {
          logger.error(error, `${endMessage} (${elapsed}ms)`)
        } else {
          logger.success({ message: `${endMessage} (${elapsed}ms)` })
        }
      },
    }
  }

  return { ...logger, startTimer } as Consola & {
    startTimer: typeof startTimer
  }
}

export type Logger = ReturnType<typeof createLogger>

export default createLogger
