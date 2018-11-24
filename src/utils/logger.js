import winston, { format } from 'winston'

const myFormat = format.printf(info => {
  return [info.timestamp, info.level, `[${info.label}]`, info.message]
    .concat(info.durationMs ? `(${info.durationMs}ms)` : [])
    .join(' ')
})

const createLogger = ({ scope, ...options } = {}) => {
  const label = ['twitch-js'].concat(scope || [])

  return winston.createLogger({
    level: 'info',
    format: format.combine(
      format.label({ label: label.join('/') }),
      format.splat(),
      format.colorize(),
      format.simple(),
      format.timestamp(),
      format.prettyPrint(),
      myFormat,
    ),
    transports: [new winston.transports.Console()],
    ...options,
  })
}

const logger = createLogger()

export { createLogger }
export default logger
