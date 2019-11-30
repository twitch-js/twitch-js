/**
 * Elegant Console Logger for Node.js and Browser
 * @external consola
 * @see {@link https://github.com/nuxt/consola#readme consola}
 */
import { ConsolaOptions } from 'consola'

type Options = ConsolaOptions & { scope?: string }

const createLogger = ({ scope, ...options }: Options = {}) => {
  const label = ['twitch-js'].concat(scope || []).join('/')

  const startTimer = (startMessage: string) => {
    const now = Date.now()

    console.log(label, startMessage)

    return {
      done: (endMessage: string, error?: any) => {
        const elapsed = Date.now() - now

        if (error) {
          console.error(error, `${endMessage} (${elapsed}ms)`)
        } else {
          console.log({ message: `${endMessage} (${elapsed}ms)` })
        }
      },
    }
  }

  return {
    debug: console.debug.bind(console),
    info: console.info.bind(console),
    log: console.log.bind(console),
    error: console.error.bind(console),
    startTimer,
  }
}

export type Logger = ReturnType<typeof createLogger>

export default createLogger
