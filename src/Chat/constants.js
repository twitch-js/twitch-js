/** @const {string} */
export const CHAT_SERVER = 'irc-ws.chat.twitch.tv'
/** @const {number} */
export const CHAT_SERVER_PORT = 6667
/** @const {number} */
export const CHAT_SERVER_SSL_PORT = 443

/** @const {number} @desc In milliseconds */
export const CONNECTION_TIMEOUT = 5000
/** @const {number} @desc In milliseconds */
export const KEEP_ALIVE_PING_TIMEOUT = 55000
/** @const {number} @desc In milliseconds */
export const KEEP_ALIVE_RECONNECT_TIMEOUT = 60000
/** @const {number} @desc In milliseconds */
export const JOIN_TIMEOUT = 1000
/** @const {number} @desc In milliseconds  */
export const COMMAND_TIMEOUT = 1000

/** @const {number} */
export const CLIENT_PRIORITY = 100

/**
 * @see {@link https://dev.twitch.tv/docs/irc/guide/#command--message-limits}
 * @const {number} @desc Messages per period.
 */
export const RATE_LIMIT_USER = 20
/**
 * @see {@link https://dev.twitch.tv/docs/irc/guide/#command--message-limits}
 * @const {number} @desc Messages per period.
 */
export const RATE_LIMIT_MODERATOR = 100
/**
 * @see {@link https://dev.twitch.tv/docs/irc/guide/#command--message-limits}
 * @const {number} @desc Messages per period.
 */
export const RATE_LIMIT_KNOWN_BOT = 50
/**
 * @see {@link https://dev.twitch.tv/docs/irc/guide/#command--message-limits}
 * @const {number} @desc Messages per period.
 */
export const RATE_LIMIT_VERIFIED_BOT = 7500

/** @const {number} */
export const QUEUE_BURNDOWN_RATE = 1 / RATE_LIMIT_USER
/** @const {number} @desc In milliseconds  */
export const QUEUE_TICK_RATE = 1000

/** @const {string} */
export const ERROR_CONNECT_TIMED_OUT = 'ERROR: connect timed out'
/** @const {string} */
export const ERROR_CONNECTION_IN_PROGRESS = 'ERROR: connection in progress'
/** @const {string} */
export const ERROR_JOIN_TIMED_OUT = 'ERROR: join timed out'
/** @const {string} */
export const ERROR_SAY_TIMED_OUT = 'ERROR: say timed out'
/** @const {string} */
export const ERROR_COMMAND_TIMED_OUT = 'ERROR: command timed out'
/** @const {string} */
export const ERROR_COMMAND_UNRECOGNIZED = 'ERROR: command unrecognized'
/** @const {string} */
export const ERROR_PART_TIMED_OUT = 'ERROR: part timed out'

/** @const {string} */
export const MESSAGE_PARAMETER_PREFIX = 'msgParam'
/** @const {RegExp} */
export const MESSAGE_PARAMETER_PREFIX_RE = new RegExp(
  `^${MESSAGE_PARAMETER_PREFIX}(\\w+)`,
)
/** @const {RegExp} */
export const PRIVATE_MESSAGE_HOSTED_RE = /:.+@jtv\.tmi\.twitch\.tv PRIVMSG #?(\w+) :(\w+) is now (?:(auto) )?hosting[A-z ]+(\d+)?/

/** @const {string} */
export const ANONYMOUS_USERNAME = 'justinfan'
/** @const {RegExp} */
export const ANONYMOUS_USERNAME_RE = new RegExp(`^${ANONYMOUS_USERNAME}(\\d+)$`)

/** @typedef {string} ClientReadyState */

/**
 * Chat client ready state
 * @const
 * @readonly
 * @enum {ClientReadyState}
 * @property {string} 0 Not Ready
 * @property {string} 1 Connecting
 * @property {string} 2 Reconnecting
 * @property {string} 3 Connecting
 * @property {string} 4 Disconnecting
 * @property {string} 5 Disconnected
 */
export const READY_STATES = {
  0: 'NOT_READY',
  1: 'CONNECTING',
  2: 'RECONNECTING',
  3: 'CONNECTED',
  4: 'DISCONNECTING',
  5: 'DISCONNECTED',
}

/** @const {object} */
export const CAPABILITIES = [
  'twitch.tv/tags',
  'twitch.tv/commands',
  'twitch.tv/membership',
]

/**
 * @see {@link https://dev.twitch.tv/docs/irc/membership/}
 * @const
 * @readonly
 * @enum {string}
 * @property {string} JOIN
 * @property {string} MODE
 * @property {string} PART
 * @property {string} NAMES
 * @property {string} NAMES_END
 */
export const MEMBERSHIP_COMMANDS = {
  JOIN: 'JOIN',
  MODE: 'MODE',
  PART: 'PART',
  NAMES: '353',
  NAMES_END: '366',
}

/**
 * @see {@link https://dev.twitch.tv/docs/irc/tags/}
 * @const
 * @readonly
 * @enum {string}
 * @property {string} CLEAR_CHAT
 * @property {string} GLOBAL_USER_STATE
 * @property {string} PRIVATE_MESSAGE
 * @property {string} ROOM_STATE
 * @property {string} USER_NOTICE
 * @property {string} USER_STATE
 */
export const TAG_COMMANDS = {
  CLEAR_CHAT: 'CLEARCHAT',
  GLOBAL_USER_STATE: 'GLOBALUSERSTATE',
  PRIVATE_MESSAGE: 'PRIVMSG',
  ROOM_STATE: 'ROOMSTATE',
  USER_NOTICE: 'USERNOTICE',
  USER_STATE: 'USERSTATE',
}

/**
 * @const
 * @readonly
 * @enum {string}
 * @property {string} WELCOME
 * @property {string} PING
 * @property {string} PONG
 * @property {string} WHISPER
 */
export const OTHER_COMMANDS = {
  WELCOME: '001',
  PING: 'PING',
  PONG: 'PONG',
  WHISPER: 'PRIVMSG #jtv',
}

/**
 * @see {@link https://dev.twitch.tv/docs/irc/commands/}
 * @const
 * @readonly
 * @enum {string}
 * @property {string} OTHER_COMMANDS
 * @property {string} MEMBERSHIP_COMMANDS
 * @property {string} TAG_COMMANDS
 * @property {string} CLEAR_CHAT
 * @property {string} HOST_TARGET
 * @property {string} NOTICE
 * @property {string} RECONNECT
 * @property {string} ROOM_STATE
 * @property {string} USER_NOTICE
 * @property {string} USER_STATE
 */
export const COMMANDS = {
  ...OTHER_COMMANDS,
  ...MEMBERSHIP_COMMANDS,
  ...TAG_COMMANDS,

  CLEAR_CHAT: 'CLEARCHAT',
  HOST_TARGET: 'HOSTTARGET',
  NOTICE: 'NOTICE',
  RECONNECT: 'RECONNECT',
  ROOM_STATE: 'ROOMSTATE',
  USER_NOTICE: 'USERNOTICE',
  USER_STATE: 'USERSTATE',
}

/**
 * @see {@link https://dev.twitch.tv/docs/irc/commands/#msg-id-tags-for-the-notice-commands-capability}
 * @const
 * @readonly
 * @enum {string}
 * @property {string} ALREADY_BANNED
 * @property {string} ALREADY_EMOTE_ONLY_OFF
 * @property {string} ALREADY_EMOTES_ONLY_ON
 * @property {string} ALREADY_R9K_OFF
 * @property {string} ALREADY_R9K_ON
 * @property {string} ALREADY_SUBS_OFF
 * @property {string} ALREADY_SUBS_ON
 * @property {string} BAD_HOST_HOSTING
 * @property {string} BAN_SUCCESS
 * @property {string} BAD_UNBAN_NO_BAN
 * @property {string} EMOTE_ONLY_OFF
 * @property {string} EMOTE_ONLY_ON
 * @property {string} HOST_OFF
 * @property {string} HOST_ON
 * @property {string} HOSTS_REMAINING
 * @property {string} MSG_CHANNEL_SUSPENDED
 * @property {string} R9K_OFF
 * @property {string} R9K_ON
 * @property {string} ROOM_MODS
 * @property {string} SLOW_OFF
 * @property {string} SLOW_ON
 * @property {string} SUBS_OFF
 * @property {string} SUBS_ON
 * @property {string} TIMEOUT_SUCCESS
 * @property {string} UNBAN_SUCCESS
 * @property {string} UNRECOGNIZED_COMMAND
 */
export const NOTICE_MESSAGE_IDS = {
  ALREADY_BANNED: 'already_banned',
  ALREADY_EMOTE_ONLY_OFF: 'already_emote_only_off',
  ALREADY_EMOTE_ONLY_ON: 'already_emote_only_on',
  ALREADY_R9K_OFF: 'already_r9k_off',
  ALREADY_R9K_ON: 'already_r9k_on',
  ALREADY_SUBS_OFF: 'already_subs_off',
  ALREADY_SUBS_ON: 'already_subs_on',
  BAD_HOST_HOSTING: 'bad_host_hosting',
  BAN_SUCCESS: 'ban_success',
  BAD_UNBAN_NO_BAN: 'bad_unban_no_ban',
  EMOTE_ONLY_OFF: 'emote_only_off',
  EMOTE_ONLY_ON: 'emote_only_on',
  HOST_OFF: 'host_off',
  HOST_ON: 'host_on',
  HOSTS_REMAINING: 'hosts_remaining',
  MSG_CHANNEL_SUSPENDED: 'msg_channel_suspended',
  R9K_OFF: 'r9k_off',
  R9K_ON: 'r9k_on',
  ROOM_MODS: 'room_mods',
  SLOW_OFF: 'slow_off',
  SLOW_ON: 'slow_on',
  SUBS_OFF: 'subs_off',
  SUBS_ON: 'subs_on',
  TIMEOUT_SUCCESS: 'timeout_success',
  UNBAN_SUCCESS: 'unban_success',
  UNRECOGNIZED_COMMAND: 'unrecognized_cmd',
}

/**
 * @see {@link https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags}
 * @const
 * @readonly
 * @enum {string}
 * @property {string} ANON_GIFT_PAID_UPGRADE
 * @property {string} GIFT_PAID_UPGRADE
 * @property {string} RAID
 * @property {string} RESUBSCRIPTION
 * @property {string} RITUAL
 * @property {string} SUBSCRIPTION
 * @property {string} SUBSCRIPTION_GIFT
 * @property {string} SUBSCRIPTION_GIFT_COMMUNITY
 */
export const USER_NOTICE_MESSAGE_IDS = {
  ANON_GIFT_PAID_UPGRADE: 'anongiftpaidupgrade',
  GIFT_PAID_UPGRADE: 'giftpaidupgrade',
  RAID: 'raid',
  RESUBSCRIPTION: 'resub',
  RITUAL: 'ritual',
  SUBSCRIPTION: 'sub',
  SUBSCRIPTION_GIFT: 'subgift',
  SUBSCRIPTION_GIFT_COMMUNITY: 'submysterygift',
}

/**
 * @const
 * @readonly
 * @enum {string}
 * @property {string} NOTICE_MESSAGE_IDS
 * @property {string} USER_NOTICE_MESSAGE_IDS
 */
export const MESSAGE_IDS = {
  ...NOTICE_MESSAGE_IDS,
  ...USER_NOTICE_MESSAGE_IDS,
}

/**
 * @const
 * @readonly
 * @enum {string}
 * @property {string} RAW
 * @property {string} ALL
 * @property {string} CONNECTED
 * @property {string} DISCONNECTED
 * @property {string} AUTHENTICATION_FAILED
 * @property {string} ERROR_ENCOUNTERED
 * @property {string} PARSE_ERROR_ENCOUNTERED
 * @property {string} ANON_GIFT_PAID_UPGRADE
 * @property {string} GIFT_PAID_UPGRADE
 * @property {string} RAID
 * @property {string} RESUBSCRIPTION
 * @property {string} RITUAL
 * @property {string} SUBSCRIPTION
 * @property {string} SUBSCRIPTION_GIFT
 * @property {string} SUBSCRIPTION_GIFT_COMMUNITY
 * @property {string} ROOM_MODS
 * @property {string} MOD_GAINED
 * @property {string} MOD_LOST
 * @property {string} USER_BANNED
 * @property {string} CHEER
 * @property {string} HOSTED
 * @property {string} HOSTED_WITHOUT_VIEWERS
 * @property {string} HOSTED_WITH_VIEWERS
 * @property {string} HOSTED_AUTO
 */
export const EVENTS = {
  ...COMMANDS,

  RAW: 'RAW',

  ALL: '*',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  ERROR_ENCOUNTERED: 'ERROR_ENCOUNTERED',
  PARSE_ERROR_ENCOUNTERED: 'PARSE_ERROR_ENCOUNTERED',

  ANON_GIFT_PAID_UPGRADE: 'ANON_GIFT_PAID_UPGRADE',
  GIFT_PAID_UPGRADE: 'GIFT_PAID_UPGRADE',
  RAID: 'RAID',
  RESUBSCRIPTION: 'RESUBSCRIPTION',
  RITUAL: 'RITUAL',
  SUBSCRIPTION: 'SUBSCRIPTION',
  SUBSCRIPTION_GIFT: 'SUBSCRIPTION_GIFT',
  SUBSCRIPTION_GIFT_COMMUNITY: 'SUBSCRIPTION_GIFT_COMMUNITY',

  ROOM_MODS: 'ROOM_MODS',
  MOD_GAINED: 'MOD_GAINED',
  MOD_LOST: 'MOD_LOST',

  USER_BANNED: 'USER_BANNED',

  CHEER: 'CHEER',
  HOSTED: 'HOSTED',
  HOSTED_WITHOUT_VIEWERS: 'HOSTED/WITHOUT_VIEWERS',
  HOSTED_WITH_VIEWERS: 'HOSTED/WITH_VIEWERS',
  HOSTED_AUTO: 'HOSTED/AUTO',
}

/**
 * @see {@link https://help.twitch.tv/customer/en/portal/articles/659095-chat-moderation-commands}
 * @const
 * @readonly
 * @enum {string}
 * @property {string} ME
 * @property {string} BAN
 * @property {string} CLEAR
 * @property {string} COLOR
 * @property {string} COMMERCIAL
 * @property {string} EMOTE_ONLY
 * @property {string} EMOTE_ONLY_OFF
 * @property {string} FOLLOWERS_ONLY
 * @property {string} FOLLOWERS_ONLY_OFF
 * @property {string} HOST
 * @property {string} MOD
 * @property {string} MODS
 * //@property {string} PART
 * @property {string} R9K
 * @property {string} R9K_OFF
 * @property {string} SLOW
 * @property {string} SLOW_OFF
 * @property {string} SUBSCRIBERS
 * @property {string} SUBSCRIBERS_OFF
 * @property {string} TIMEOUT
 * @property {string} UNBAN
 * @property {string} UNHOST
 * @property {string} UNMOD
 * //@property {string} WHISPER
 */
export const CHAT_COMMANDS = {
  ME: 'me',
  BAN: 'ban',
  CLEAR: 'clear',
  COLOR: 'color',
  COMMERCIAL: 'commercial',
  EMOTE_ONLY: 'emoteonly',
  EMOTE_ONLY_OFF: 'emoteonlyoff',
  FOLLOWERS_ONLY: 'followers',
  FOLLOWERS_ONLY_OFF: 'followersonlyoff',
  HOST: 'host',
  MOD: 'mod',
  MODS: 'mods',
  // PART: 'part',
  R9K: 'r9k',
  R9K_OFF: 'r9koff',
  SLOW: 'slow',
  SLOW_OFF: 'slowoff',
  SUBSCRIBERS: 'subscribers',
  SUBSCRIBERS_OFF: 'subscribersoff',
  TIMEOUT: 'timeout',
  UNBAN: 'unban',
  UNHOST: 'unhost',
  UNMOD: 'unmod',
  // WHISPER: 'w',
}
