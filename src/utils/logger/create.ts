/**
 * Elegant Console Logger for Node.js and Browser
 * @external consola
 * @see {@link https://github.com/nuxt/consola#readme consola}
 */
import consola from 'consola'

const createLogger = ({ scope, ...options } = {}) => {
  const label = ['twitch-js'].concat(scope || []).join('/')

  const logger = consola.create(options).withScope(label)

  logger.startTimer = startProps => {
    const now = new Date()

    if (startProps && startProps.message) {
      logger.info(startProps)
    }

    return {
      done: doneProps => {
        const elapsed = new Date() - now
        logger.success({ message: `${doneProps.message} (${elapsed}ms)` })
      },
    }
  }

  return logger
}

export default createLogger
