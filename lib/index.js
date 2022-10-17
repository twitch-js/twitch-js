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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = exports.Chat = void 0;
var Chat_1 = __importDefault(require("./Chat"));
exports.Chat = Chat_1.default;
var Api_1 = __importDefault(require("./Api"));
exports.Api = Api_1.default;
__exportStar(require("./twitch"), exports);
/**
 * Interact with chat and make requests to Twitch API.
 *
 * ## Initializing
 * ```
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2'
 * const username = 'ronni'
 * const twitchJs = new TwitchJs({ token, clientId, username })
 *
 * twitchJs.chat.connect().then(globalUserState => {
 *   // Do stuff ...
 * })
 *
 * twitchJs.api.get('channel').then(response => {
 *   // Do stuff ...
 * })
 * ```
 */
var TwitchJs = /** @class */ (function () {
    function TwitchJs(options) {
        var token = options.token, username = options.username, clientId = options.clientId, log = options.log, onAuthenticationFailure = options.onAuthenticationFailure, chat = options.chat, api = options.api;
        this.chat = new Chat_1.default(__assign(__assign({ log: log }, chat), { token: token,
            username: username,
            onAuthenticationFailure: onAuthenticationFailure }));
        this.api = new Api_1.default(__assign(__assign({ log: log }, api), { token: token,
            clientId: clientId,
            onAuthenticationFailure: onAuthenticationFailure }));
    }
    /**
     * Update client options.
     */
    TwitchJs.prototype.updateOptions = function (options) {
        var chat = options.chat, api = options.api;
        if (chat) {
            this.chat.updateOptions(chat);
        }
        if (api) {
            this.api.updateOptions(api);
        }
    };
    TwitchJs.Chat = Chat_1.default;
    TwitchJs.Api = Api_1.default;
    return TwitchJs;
}());
exports.default = TwitchJs;
//# sourceMappingURL=index.js.map