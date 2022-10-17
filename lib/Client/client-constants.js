"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANONYMOUS_USERNAME_RE = exports.ANONYMOUS_USERNAME = exports.PRIVATE_MESSAGE_HOSTED_RE = exports.MESSAGE_PARAMETER_PREFIX_RE = exports.MESSAGE_PARAMETER_PREFIX = exports.ERROR_PART_TIMED_OUT = exports.ERROR_COMMAND_UNRECOGNIZED = exports.ERROR_COMMAND_TIMED_OUT = exports.ERROR_SAY_TIMED_OUT = exports.ERROR_JOIN_TIMED_OUT = exports.ERROR_CONNECTION_IN_PROGRESS = exports.ERROR_CONNECT_TIMED_OUT = exports.RATE_LIMIT_VERIFIED_BOT = exports.RATE_LIMIT_KNOWN_BOT = exports.RATE_LIMIT_MODERATOR = exports.RATE_LIMIT_USER = exports.CLIENT_PRIORITY = exports.COMMAND_TIMEOUT = exports.JOIN_TIMEOUT = exports.KEEP_ALIVE_RECONNECT_TIMEOUT = exports.KEEP_ALIVE_PING_TIMEOUT = exports.CONNECTION_TIMEOUT = exports.CHAT_SERVER_SSL_PORT = exports.CHAT_SERVER_PORT = exports.CHAT_SERVER = void 0;
exports.CHAT_SERVER = 'irc-ws.chat.twitch.tv';
exports.CHAT_SERVER_PORT = 6667;
exports.CHAT_SERVER_SSL_PORT = 443;
exports.CONNECTION_TIMEOUT = 5000;
exports.KEEP_ALIVE_PING_TIMEOUT = 150000;
exports.KEEP_ALIVE_RECONNECT_TIMEOUT = 200000;
exports.JOIN_TIMEOUT = 1000; // milliseconds.
exports.COMMAND_TIMEOUT = 1000; // milliseconds.
exports.CLIENT_PRIORITY = 100;
// See https://dev.twitch.tv/docs/irc/guide/#command--message-limits.
exports.RATE_LIMIT_USER = 20; // per period.
exports.RATE_LIMIT_MODERATOR = 100; // per period.
exports.RATE_LIMIT_KNOWN_BOT = 50; // per period.
exports.RATE_LIMIT_VERIFIED_BOT = 7500; // per period.
exports.ERROR_CONNECT_TIMED_OUT = 'ERROR: connect timed out';
exports.ERROR_CONNECTION_IN_PROGRESS = 'ERROR: connection in progress';
exports.ERROR_JOIN_TIMED_OUT = 'ERROR: join timed out';
exports.ERROR_SAY_TIMED_OUT = 'ERROR: say timed out';
exports.ERROR_COMMAND_TIMED_OUT = 'ERROR: command timed out';
exports.ERROR_COMMAND_UNRECOGNIZED = 'ERROR: command unrecognized';
exports.ERROR_PART_TIMED_OUT = 'ERROR: part timed out';
exports.MESSAGE_PARAMETER_PREFIX = 'msgParam';
exports.MESSAGE_PARAMETER_PREFIX_RE = new RegExp("^" + exports.MESSAGE_PARAMETER_PREFIX + "(\\w+)");
exports.PRIVATE_MESSAGE_HOSTED_RE = /:.+@jtv\.tmi\.twitch\.tv PRIVMSG #?(\w+) :(\w+) is now (?:(auto) )?hosting[A-z ]+(\d+)?/;
exports.ANONYMOUS_USERNAME = 'justinfan';
exports.ANONYMOUS_USERNAME_RE = new RegExp("^" + exports.ANONYMOUS_USERNAME + "(\\d+)$");
//# sourceMappingURL=client-constants.js.map