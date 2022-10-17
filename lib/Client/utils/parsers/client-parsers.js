"use strict";
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
exports.baseParser = void 0;
var parse_1 = require("tekko/dist/parse");
var camelcase_keys_1 = __importDefault(require("camelcase-keys"));
var isEmpty_1 = __importDefault(require("lodash/isEmpty"));
var toLower_1 = __importDefault(require("lodash/toLower"));
var helpers = __importStar(require("./client-parser-helpers"));
exports.baseParser = function (rawMessages, username) {
    if (username === void 0) { username = ''; }
    var rawMessagesArray = rawMessages.split(/\r?\n/g);
    return rawMessagesArray.reduce(function (messages, rawMessage) {
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
        var nextMessage = {
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
        return __spread(messages, [nextMessage]);
    }, []);
};
exports.default = exports.baseParser;
//# sourceMappingURL=client-parsers.js.map