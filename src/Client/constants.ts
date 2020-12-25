export const CHAT_SERVER = 'irc-ws.chat.twitch.tv'
export const CHAT_SERVER_PORT = 6667
export const CHAT_SERVER_SSL_PORT = 443

export const CONNECTION_TIMEOUT = 5000
export const KEEP_ALIVE_PING_TIMEOUT = 150000
export const KEEP_ALIVE_RECONNECT_TIMEOUT = 200000

export const JOIN_TIMEOUT = 1000 // milliseconds.
export const COMMAND_TIMEOUT = 1000 // milliseconds.

export const CLIENT_PRIORITY = 100

// See https://dev.twitch.tv/docs/irc/guide/#command--message-limits.
export const RATE_LIMIT_USER = 20 // per period.
export const RATE_LIMIT_MODERATOR = 100 // per period.
export const RATE_LIMIT_KNOWN_BOT = 50 // per period.
export const RATE_LIMIT_VERIFIED_BOT = 7500 // per period.

export const ERROR_CONNECT_TIMED_OUT = 'ERROR: connect timed out'
export const ERROR_CONNECTION_IN_PROGRESS = 'ERROR: connection in progress'
export const ERROR_JOIN_TIMED_OUT = 'ERROR: join timed out'
export const ERROR_SAY_TIMED_OUT = 'ERROR: say timed out'
export const ERROR_COMMAND_TIMED_OUT = 'ERROR: command timed out'
export const ERROR_COMMAND_UNRECOGNIZED = 'ERROR: command unrecognized'
export const ERROR_PART_TIMED_OUT = 'ERROR: part timed out'

export const MESSAGE_PARAMETER_PREFIX = 'msgParam'
export const MESSAGE_PARAMETER_PREFIX_RE = new RegExp(
  `^${MESSAGE_PARAMETER_PREFIX}(\\w+)`,
)
export const PRIVATE_MESSAGE_HOSTED_RE = /:.+@jtv\.tmi\.twitch\.tv PRIVMSG #?(\w+) :(\w+) is now (?:(auto) )?hosting[A-z ]+(\d+)?/

export const ANONYMOUS_USERNAME = 'justinfan'
export const ANONYMOUS_USERNAME_RE = new RegExp(`^${ANONYMOUS_USERNAME}(\\d+)$`)
