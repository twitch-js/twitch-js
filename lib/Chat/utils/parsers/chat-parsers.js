"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userNoticeMessage = exports.privateMessage = exports.userStateMessage = exports.noticeMessage = exports.roomStateMessage = exports.hostTargetMessage = exports.clearMessageMessage = exports.clearChatMessage = exports.globalUserStateMessage = exports.namesEndMessage = exports.namesMessage = exports.modeMessage = exports.partMessage = exports.joinMessage = exports.base = void 0;
var parse_1 = require("tekko/dist/parse");
var camelcase_keys_1 = __importDefault(require("camelcase-keys"));
var gt_1 = __importDefault(require("lodash/gt"));
var isEmpty_1 = __importDefault(require("lodash/isEmpty"));
var isFinite_1 = __importDefault(require("lodash/isFinite"));
var toLower_1 = __importDefault(require("lodash/toLower"));
var toNumber_1 = __importDefault(require("lodash/toNumber"));
var toUpper_1 = __importDefault(require("lodash/toUpper"));
var twitch_1 = require("../../../twitch");
var constants = __importStar(require("../../chat-constants"));
var utils = __importStar(require("../"));
var helpers = __importStar(require("./chat-parser-helpers"));
var tagParsers = __importStar(require("./chat-parser-tags"));
exports.base = function (rawMessages, username) {
    if (username === void 0) { username = ''; }
    var rawMessagesV = rawMessages.split(/\r?\n/g);
    return rawMessagesV.reduce(function (messages, rawMessage) {
        if (!rawMessage.length) {
            return messages;
        }
        var _a = parse_1.parse(rawMessage), command = _a.command, _b = _a.tags, tags = _b === void 0 ? {} : _b, _c = _a.prefix, _d = _c === void 0 ? {
            name: undefined,
            user: undefined,
            host: undefined,
        } : _c, name = _d.name, user = _d.user, host = _d.host, _e = __read(_a.params, 2), channel = _e[0], message = _e[1];
        var timestamp = String(tags['tmi-sent-ts']) || Date.now().toString();
        var messageTags = isEmpty_1.default(tags)
            ? {}
            : camelcase_keys_1.default(tags);
        var messageUsername = helpers.username(host, name, user, messageTags.login, messageTags.username, messageTags.displayName);
        var baseMessage = {
            _raw: rawMessage,
            timestamp: helpers.generalTimestamp(timestamp),
            command: command,
            event: command,
            channel: channel !== '*' ? channel : '',
            username: messageUsername,
            isSelf: typeof messageUsername === 'string' &&
                toLower_1.default(username) === messageUsername,
            tags: messageTags,
            message: message,
        };
        return __spread(messages, [baseMessage]);
    }, []);
};
/**
 * Join a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#join-twitch-membership
 */
exports.joinMessage = function (baseMessage) {
    var _a = __read(/:(.+)!(.+)@(.+).tmi.twitch.tv JOIN (#.+)/g.exec(baseMessage._raw) || [], 5), username = _a[1], channel = _a[4];
    return __assign(__assign({}, baseMessage), { channel: channel, command: twitch_1.Commands.JOIN, event: twitch_1.Commands.JOIN, username: username });
};
/**
 * Join or depart from a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#join-twitch-membership
 * @see https://dev.twitch.tv/docs/irc/membership/#part-twitch-membership
 */
exports.partMessage = function (baseMessage) {
    var _a = __read(/:(.+)!(.+)@(.+).tmi.twitch.tv PART (#.+)/g.exec(baseMessage._raw) || [], 5), username = _a[1], channel = _a[4];
    return __assign(__assign({}, baseMessage), { channel: channel, command: twitch_1.Commands.PART, event: twitch_1.Commands.PART, username: username });
};
/**
 * Gain/lose moderator (operator) status in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#mode-twitch-membership
 */
exports.modeMessage = function (baseMessage) {
    var _a = __read(/:[^\s]+ MODE (#[^\s]+) (-|\+)o ([^\s]+)/g.exec(baseMessage._raw) || [], 4), channel = _a[1], mode = _a[2], username = _a[3];
    var isModerator = mode === '+';
    var baseModeMessage = __assign(__assign({}, baseMessage), { command: twitch_1.Commands.MODE, channel: channel,
        username: username });
    return isModerator
        ? __assign(__assign({}, baseModeMessage), { event: twitch_1.ChatEvents.MOD_GAINED, message: "+o", isModerator: true }) : __assign(__assign({}, baseModeMessage), { event: twitch_1.ChatEvents.MOD_LOST, message: '-o', isModerator: false });
};
/**
 * List current chatters in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
 */
exports.namesMessage = function (baseMessage) {
    var _a = __read(/:(.+).tmi.twitch.tv 353 (.+) = (#.+) :(.+)/g.exec(baseMessage._raw) || [], 5), channel = _a[3], names = _a[4];
    var namesV = names.split(' ');
    return __assign(__assign({}, baseMessage), { channel: channel, command: twitch_1.Commands.NAMES, event: twitch_1.Commands.NAMES, usernames: namesV });
};
/**
 * End of list current chatters in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
 */
exports.namesEndMessage = function (baseMessage) {
    var _a = __read(/:(.+).tmi.twitch.tv 366 (.+) (#.+) :(.+)/g.exec(baseMessage._raw) || [], 4), username = _a[1], channel = _a[3];
    return __assign(__assign({}, baseMessage), { channel: channel, command: twitch_1.Commands.NAMES_END, event: twitch_1.Commands.NAMES_END, username: username });
};
/**
 * GLOBALUSERSTATE message
 */
exports.globalUserStateMessage = function (baseMessage) {
    var tags = baseMessage.tags, other = __rest(baseMessage, ["tags"]);
    return __assign(__assign({}, other), { command: twitch_1.Commands.GLOBALUSERSTATE, event: twitch_1.Commands.GLOBALUSERSTATE, tags: tagParsers.globalUserState(tags) });
};
/**
 * Temporary or permanent ban on a channel.
 * @see https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
 *
 * All chat is cleared (deleted).
 * @see https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags
 */
exports.clearChatMessage = function (baseMessage) {
    var tags = baseMessage.tags, username = baseMessage.message, other = __rest(baseMessage, ["tags", "message"]);
    if (typeof username !== 'undefined') {
        return __assign(__assign({}, other), { tags: __assign(__assign({}, tags), { banReason: helpers.generalString(tags.banReason), banDuration: helpers.generalNumber(tags.banDuration) }), command: twitch_1.Commands.CLEAR_CHAT, event: twitch_1.ChatEvents.USER_BANNED, username: username });
    }
    return __assign(__assign({}, other), { command: twitch_1.Commands.CLEAR_CHAT, event: twitch_1.Commands.CLEAR_CHAT });
};
/**
 * Single message removal on a channel.
 * @see https://dev.twitch.tv/docs/irc/commands#clearmsg-twitch-commands
 */
exports.clearMessageMessage = function (baseMessage) {
    var tags = baseMessage.tags;
    return __assign(__assign({}, baseMessage), { tags: {
            login: tags.login,
            targetMsgId: tags.targetMsgId,
        }, command: twitch_1.Commands.CLEAR_MESSAGE, event: twitch_1.Commands.CLEAR_MESSAGE, targetMessageId: tags.targetMsgId });
};
/**
 * Host starts or stops a message.
 * @see https://dev.twitch.tv/docs/irc/commands/#hosttarget-twitch-commands
 */
exports.hostTargetMessage = function (baseMessage) {
    var _a = __read(/:tmi.twitch.tv HOSTTARGET (#[^\s]+) :([^\s]+)?\s?(\d+)?/g.exec(baseMessage._raw) || [], 4), channel = _a[1], username = _a[2], numberOfViewers = _a[3];
    var isStopped = username === '-';
    return __assign(__assign({}, baseMessage), { channel: channel,
        username: username, command: twitch_1.Commands.HOST_TARGET, event: isStopped ? twitch_1.ChatEvents.HOST_OFF : twitch_1.ChatEvents.HOST_ON, numberOfViewers: isFinite_1.default(toNumber_1.default(numberOfViewers))
            ? parseInt(numberOfViewers, 10)
            : undefined });
};
/**
 * When a user joins a channel or a room setting is changed.
 */
exports.roomStateMessage = function (baseMessage) {
    var tags = baseMessage.tags, other = __rest(baseMessage, ["tags"]);
    return __assign(__assign({}, other), { command: twitch_1.Commands.ROOM_STATE, event: twitch_1.Commands.ROOM_STATE, tags: tagParsers.roomState(tags) });
};
/**
 * NOTICE/ROOM_MODS message
 * @see https://dev.twitch.tv/docs/irc/commands/#msg-id-tags-for-the-notice-commands-capability
 */
exports.noticeMessage = function (baseMessage) {
    var baseTags = baseMessage.tags, other = __rest(baseMessage, ["tags"]);
    var tags = (utils.isAuthenticationFailedMessage(baseMessage)
        ? __assign(__assign({}, baseTags), { msgId: toLower_1.default(twitch_1.Events.AUTHENTICATION_FAILED) }) : baseTags);
    var event = toUpper_1.default(tags.msgId);
    switch (tags.msgId) {
        case twitch_1.KnownNoticeMessageIds.ROOM_MODS:
            return __assign(__assign({}, other), { command: twitch_1.Commands.NOTICE, event: twitch_1.NoticeEvents.ROOM_MODS, tags: tags, mods: helpers.mods(other.message) });
        default:
            return __assign(__assign({}, other), { command: twitch_1.Commands.NOTICE, event: event,
                tags: tags });
    }
};
/**
 * USERSTATE message
 * When a user joins a channel or sends a PRIVMSG to a channel.
 */
exports.userStateMessage = function (baseMessage) {
    var tags = baseMessage.tags, other = __rest(baseMessage, ["tags"]);
    return __assign(__assign({}, other), { command: twitch_1.Commands.USER_STATE, event: twitch_1.Commands.USER_STATE, tags: tagParsers.userState(tags) });
};
/**
 * PRIVMSG message
 * When a user joins a channel or sends a PRIVMSG to a channel.
 * When a user cheers a channel.
 * When a user hosts your channel while connected as broadcaster.
 */
exports.privateMessage = function (baseMessage) {
    var _raw = baseMessage._raw, tags = baseMessage.tags;
    if (gt_1.default(tags.bits, 0)) {
        return __assign(__assign({}, exports.userStateMessage(baseMessage)), { command: twitch_1.Commands.PRIVATE_MESSAGE, event: twitch_1.ChatEvents.CHEER, bits: parseInt(tags.bits, 10) });
    }
    var _a = __read(constants.PRIVATE_MESSAGE_HOSTED_RE.exec(_raw) || [], 5), isHostingPrivateMessage = _a[0], channel = _a[1], displayName = _a[2], isAuto = _a[3], numberOfViewers = _a[4];
    if (isHostingPrivateMessage) {
        if (isAuto) {
            return __assign(__assign({}, baseMessage), { command: twitch_1.Commands.PRIVATE_MESSAGE, event: twitch_1.ChatEvents.HOSTED_AUTO, channel: "#" + channel, tags: { displayName: displayName }, numberOfViewers: helpers.generalNumber(numberOfViewers) });
        }
        if (numberOfViewers) {
            return __assign(__assign({}, baseMessage), { command: twitch_1.Commands.PRIVATE_MESSAGE, event: twitch_1.ChatEvents.HOSTED_WITH_VIEWERS, channel: "#" + channel, tags: { displayName: displayName }, numberOfViewers: helpers.generalNumber(numberOfViewers) });
        }
        return __assign(__assign({}, baseMessage), { command: twitch_1.Commands.PRIVATE_MESSAGE, event: twitch_1.ChatEvents.HOSTED_WITHOUT_VIEWERS, channel: "#" + channel, tags: { displayName: displayName } });
    }
    return __assign(__assign({}, exports.userStateMessage(baseMessage)), { command: twitch_1.Commands.PRIVATE_MESSAGE, event: twitch_1.Commands.PRIVATE_MESSAGE });
};
/**
 * USERNOTICE message
 */
exports.userNoticeMessage = function (baseMessage) {
    var command = twitch_1.Commands.USER_NOTICE;
    var tags = __assign(__assign({}, tagParsers.userNotice(baseMessage.tags)), { systemMsg: helpers.generalString(baseMessage.tags.systemMsg) });
    var systemMessage = helpers.generalString(baseMessage.tags.systemMsg) || '';
    var parameters = tagParsers.userNoticeMessageParameters(tags);
    switch (tags.msgId) {
        /**
         * On anonymous gifted subscription paid upgrade to a channel.
         */
        case twitch_1.KnownUserNoticeMessageIds.ANON_GIFT_PAID_UPGRADE:
            return __assign(__assign({}, baseMessage), { command: command, event: twitch_1.ChatEvents.ANON_GIFT_PAID_UPGRADE, parameters: parameters,
                tags: tags,
                systemMessage: systemMessage });
        /**
         * On gifted subscription paid upgrade to a channel.
         */
        case twitch_1.KnownUserNoticeMessageIds.GIFT_PAID_UPGRADE:
            return __assign(__assign({}, baseMessage), { command: command, event: twitch_1.ChatEvents.GIFT_PAID_UPGRADE, parameters: parameters, tags: tags,
                systemMessage: systemMessage });
        /**
         * On channel raid.
         */
        case twitch_1.KnownUserNoticeMessageIds.RAID:
            return __assign(__assign({}, baseMessage), { command: command, event: twitch_1.ChatEvents.RAID, parameters: parameters, tags: tags,
                systemMessage: systemMessage });
        /**
         * On resubscription (subsequent months) to a channel.
         */
        case twitch_1.KnownUserNoticeMessageIds.RESUBSCRIPTION:
            return __assign(__assign({}, baseMessage), { command: command, event: twitch_1.ChatEvents.RESUBSCRIPTION, parameters: parameters, tags: tags,
                systemMessage: systemMessage });
        /**
         * On channel ritual.
         */
        case twitch_1.KnownUserNoticeMessageIds.RITUAL:
            return __assign(__assign({}, baseMessage), { command: command, event: twitch_1.ChatEvents.RITUAL, parameters: parameters, tags: tags,
                systemMessage: systemMessage });
        /**
         * On subscription gift to a channel community.
         */
        case twitch_1.KnownUserNoticeMessageIds.SUBSCRIPTION_GIFT_COMMUNITY:
            return __assign(__assign({}, baseMessage), { command: command, event: twitch_1.ChatEvents.SUBSCRIPTION_GIFT_COMMUNITY, parameters: parameters, tags: tags,
                systemMessage: systemMessage });
        /**
         * On subscription gift to a channel.
         */
        case twitch_1.KnownUserNoticeMessageIds.SUBSCRIPTION_GIFT:
            return __assign(__assign({}, baseMessage), { command: command, event: twitch_1.ChatEvents.SUBSCRIPTION_GIFT, parameters: parameters, tags: tags,
                systemMessage: systemMessage });
        /**
         * On subscription (first month) to a channel.
         */
        case twitch_1.KnownUserNoticeMessageIds.SUBSCRIPTION:
            return __assign(__assign({}, baseMessage), { command: command, event: twitch_1.ChatEvents.SUBSCRIPTION, parameters: parameters, tags: tags,
                systemMessage: systemMessage });
        /**
         * Unknown USERNOTICE event.
         */
        default:
            return __assign(__assign({}, baseMessage), { command: command, event: toUpper_1.default(tags.msgId), tags: tags,
                parameters: parameters,
                systemMessage: systemMessage });
    }
};
exports.default = exports.base;
//# sourceMappingURL=chat-parsers.js.map