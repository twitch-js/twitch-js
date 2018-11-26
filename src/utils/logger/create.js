/**
 * winston, a logger for just about everything
 * @external winston
 * @see {@link https://github.com/winstonjs/winston/tree/3.1.0 winston}
 */
import winston, { format } from 'winston'

const silent =
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'test' ||
  process.env.CI

const defaultFormatter = format.printf(info => {
  return [info.timestamp, info.level, `[${info.label}]`, info.message]
    .concat(info.durationMs ? `(${info.durationMs}ms)` : [])
    .join(' ')
})

const defaultFormat = [
  format.splat(),
  format.colorize(),
  format.simple(),
  format.timestamp(),
  format.prettyPrint(),
  defaultFormatter,
]

const defaultLogSettings = () => ({
  level: 'info',
  format: format.combine(...defaultFormat, defaultFormatter),
  transports: [new winston.transports.Console()],
  silent,
})

const createLogger = ({ scope, ...options } = {}) => {
  const label = ['twitch-js'].concat(scope || []).join('/')

  return winston.loggers.add(scope, {
    ...defaultLogSettings(),
    format: format.combine(format.label({ label }), ...defaultFormat),
    transports: [new winston.transports.Console()],
    ...options,
  })
}

export { defaultLogSettings, defaultFormatter, defaultFormat }
export default createLogger
