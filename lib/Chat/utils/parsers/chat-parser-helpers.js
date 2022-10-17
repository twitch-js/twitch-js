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
exports.username = exports.mods = exports.emoteSets = exports.emotes = exports.badges = exports.followersOnly = exports.broadcasterLanguage = exports.userType = exports.generalTimestamp = exports.generalBoolean = exports.generalNumber = exports.generalString = void 0;
var camelCase_1 = __importDefault(require("lodash/camelCase"));
var isFinite_1 = __importDefault(require("lodash/isFinite"));
var replace_1 = __importDefault(require("lodash/replace"));
var toLower_1 = __importDefault(require("lodash/toLower"));
var twitch_1 = require("../../../twitch");
exports.generalString = function (maybeMessage) {
    return typeof maybeMessage === 'string'
        ? replace_1.default(maybeMessage, /\\[sn]/g, ' ')
        : undefined;
};
exports.generalNumber = function (maybeNumber) {
    var number = parseInt(maybeNumber, 10);
    return isFinite_1.default(number) ? number : undefined;
};
exports.generalBoolean = function (maybeBoolean) { return maybeBoolean === '1'; };
exports.generalTimestamp = function (maybeTimestamp) {
    var timestamp = new Date(parseInt(maybeTimestamp, 10));
    return timestamp.toString() !== 'Invalid Date' ? timestamp : new Date();
};
exports.userType = function (maybeUserType) {
    return typeof maybeUserType === 'string' ? maybeUserType : undefined;
};
exports.broadcasterLanguage = function (maybeLanguage) {
    return typeof maybeLanguage === 'string' ? maybeLanguage : undefined;
};
exports.followersOnly = function (maybeFollowersOnly) {
    var followersOnlyAsNumber = parseInt(maybeFollowersOnly, 10);
    if (followersOnlyAsNumber === 0) {
        return true;
    }
    else if (followersOnlyAsNumber > 0) {
        return followersOnlyAsNumber;
    }
    return false;
};
/**
 * Badges tag
 * @see https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags
 */
exports.badges = function (maybeBadges) {
    return typeof maybeBadges === 'string'
        ? maybeBadges.split(',').reduce(function (parsed, badge) {
            var _a, _b, _c;
            var _d = __read(badge.split('/'), 2), rawKey = _d[0], value = _d[1];
            if (typeof value === 'undefined') {
                return parsed;
            }
            var key = camelCase_1.default(rawKey);
            if (key in twitch_1.BooleanBadges) {
                return __assign(__assign({}, parsed), (_a = {}, _a[key] = exports.generalBoolean(value), _a));
            }
            if (key in twitch_1.NumberBadges) {
                return __assign(__assign({}, parsed), (_b = {}, _b[key] = parseInt(value, 10), _b));
            }
            return __assign(__assign({}, parsed), (_c = {}, _c[key] = value, _c));
        }, {})
        : {};
};
/**
 * Emote tag
 * @see https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags
 */
exports.emotes = function (maybeEmotes) {
    if (typeof maybeEmotes !== 'string') {
        return [];
    }
    return maybeEmotes.split('/').reduce(function (emoteTag, emoteIndices) {
        var _a = __read(emoteIndices.split(':'), 2), id = _a[0], indices = _a[1];
        if (!id) {
            return emoteTag;
        }
        return __spread(emoteTag, indices.split(',').map(function (index) {
            var _a = __read(index.split('-'), 2), start = _a[0], end = _a[1];
            return { id: id, start: parseInt(start, 10), end: parseInt(end, 10) };
        }));
    }, []);
};
exports.emoteSets = function (maybeEmoteSets) {
    return typeof maybeEmoteSets === 'string' ? maybeEmoteSets.split(',') : [];
};
exports.mods = function (message) {
    var _a = __read(message.split(': '), 2), modList = _a[1];
    return modList.split(', ');
};
exports.username = function () {
    var maybeUsernames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        maybeUsernames[_i] = arguments[_i];
    }
    return maybeUsernames.reduce(function (maybeUsername, name) {
        if (typeof name !== 'string') {
            return maybeUsername;
        }
        if (name === 'tmi.twitch.tv') {
            return 'tmi.twitch.tv';
        }
        return toLower_1.default(name).split('.')[0];
    }, undefined);
};
//# sourceMappingURL=chat-parser-helpers.js.map