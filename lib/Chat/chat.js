"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var eventemitter3_1 = __importDefault(require("eventemitter3"));
var p_event_1 = __importDefault(require("p-event"));
var uniq_1 = __importDefault(require("lodash/uniq"));
var twitch_1 = require("../twitch");
var logger_1 = __importDefault(require("../utils/logger"));
var Client_1 = __importDefault(require("../Client"));
var client_types_1 = require("../Client/client-types");
var parsers = __importStar(require("./utils/parsers"));
var sanitizers = __importStar(require("./utils/chat-sanitizers"));
var validators = __importStar(require("./utils/chat-validators"));
var constants = __importStar(require("./chat-constants"));
var Errors = __importStar(require("./chat-errors"));
var chat_types_1 = require("./chat-types");
/**
 * Interact with Twitch chat.
 *
 * ## Connecting
 *
 * ```js
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const username = 'ronni'
 * const { chat } = new TwitchJs({ token, username })
 *
 * chat.connect().then(globalUserState => {
 *   // Do stuff ...
 * })
 * ```
 *
 * **Note:** Connecting with a `token` and a `username` is optional.
 *
 * Once connected, `chat.userState` will contain
 * [[GlobalUserStateTags|global user state information]].
 *
 * ## Joining a channel
 *
 * ```js
 * const channel = '#dallas'
 *
 * chat.join(channel).then(channelState => {
 *   // Do stuff with channelState...
 * })
 * ```
 *
 * After joining a channel, `chat.channels[channel]` will contain
 * [[ChannelState|channel state information]].
 *
 * ## Listening for events
 *
 * ```js
 * // Listen to all events
 * chat.on('*', message => {
 *   // Do stuff with message ...
 * })
 *
 * // Listen to private messages
 * chat.on('PRIVMSG', privateMessage => {
 *   // Do stuff with privateMessage ...
 * })
 * ```
 *
 * Events are nested; for example:
 *
 * ```js
 * // Listen to subscriptions only
 * chat.on('USERNOTICE/SUBSCRIPTION', userStateMessage => {
 *   // Do stuff with userStateMessage ...
 * })
 *
 * // Listen to all user notices
 * chat.on('USERNOTICE', userStateMessage => {
 *   // Do stuff with userStateMessage ...
 * })
 * ```
 *
 * For added convenience, TwitchJS also exposes event constants.
 *
 * ```js
 * const { chat } = new TwitchJs({ token, username })
 *
 * // Listen to all user notices
 * chat.on(chat.events.USER_NOTICE, userStateMessage => {
 *   // Do stuff with userStateMessage ...
 * })
 * ```
 *
 * ## Sending messages
 *
 * To send messages, [Chat] must be initialized with a `username` and a
 * [`token`](../#authentication) with `chat_login` scope.
 *
 * All messages sent to Twitch are automatically rate-limited according to
 * [Twitch Developer documentation](https://dev.twitch.tv/docs/irc/guide/#command--message-limits).
 *
 * ### Speak in channel
 *
 * ```js
 * const channel = '#dallas'
 *
 * chat
 *   .say(channel, 'Kappa Keepo Kappa')
 *   // Optionally ...
 *   .then(() => {
 *     // ... do stuff on success ...
 *   })
 * ```
 *
 * ### Send command to channel
 *
 * All chat commands are currently supported and exposed as camel-case methods. For
 * example:
 *
 * ```js
 * const channel = '#dallas'
 *
 * // Enable followers-only for 1 week
 * chat.followersOnly(channel, '1w')
 *
 * // Ban ronni
 * chat.ban(channel, 'ronni')
 * ```
 *
 * **Note:** `Promise`-resolves for each commands are
 * [planned](https://github.com/twitch-devs/twitch-js/issues/87).
 *
 * ## Joining multiple channels
 *
 * ```js
 * const channels = ['#dallas', '#ronni']
 *
 * Promise.all(channels.map(channel => chat.join(channel))).then(channelStates => {
 *   // Listen to all messages from #dallas only
 *   chat.on('#dallas', message => {
 *     // Do stuff with message ...
 *   })
 *
 *   // Listen to private messages from #dallas and #ronni
 *   chat.on('PRIVMSG', privateMessage => {
 *     // Do stuff with privateMessage ...
 *   })
 *
 *   // Listen to private messages from #dallas only
 *   chat.on('PRIVMSG/#dallas', privateMessage => {
 *     // Do stuff with privateMessage ...
 *   })
 *
 *   // Listen to all private messages from #ronni only
 *   chat.on('PRIVMSG/#ronni', privateMessage => {
 *     // Do stuff with privateMessage ...
 *   })
 * })
 * ```
 *
 * ### Broadcasting to all channels
 *
 * ```js
 * chat
 *   .broadcast('Kappa Keepo Kappa')
 *   // Optionally ...
 *   .then(userStateMessages => {
 *     // ... do stuff with userStateMessages on success ...
 *   })
 * ```
 */
var Chat = /** @class */ (function (_super) {
    __extends(Chat, _super);
    /**
     * Chat constructor.
     */
    function Chat(options) {
        var _this = _super.call(this) || this;
        _this._internalEmitter = new eventemitter3_1.default();
        _this._readyState = chat_types_1.ChatReadyStates.WAITING;
        _this._connectionAttempts = 0;
        _this._channelState = {};
        _this._isAuthenticated = false;
        _this._handleConnect = function () {
            var connectProfiler = _this._log.profile('connecting ...');
            // Connect ...
            _this._readyState = chat_types_1.ChatReadyStates.CONNECTING;
            // Increment connection attempts.
            _this._connectionAttempts += 1;
            if (_this._client) {
                // Remove all listeners, just in case.
                _this._client.removeAllListeners();
            }
            // Create client and connect.
            _this._client = new Client_1.default(_this._options);
            // Handle disconnects.
            _this._client.once(client_types_1.ClientEvents.DISCONNECTED, function () {
                return _this._internalEmitter.emit(constants.DISCONNECT);
            });
            // Listen for reconnects.
            _this._client.once(client_types_1.ClientEvents.RECONNECT, function () {
                return _this._internalEmitter.emit(constants.RECONNECT);
            });
            // Listen for authentication failure.
            _this._client.once(client_types_1.ClientEvents.AUTHENTICATION_FAILED, _this._handleClientAuthenticationFailure);
            // Once the client is connected, resolve ...
            _this._client.once(client_types_1.ClientEvents.CONNECTED, function (message) {
                _this._readyState = chat_types_1.ChatReadyStates.CONNECTED;
                if (_this._options.token && _this._options.username) {
                    var globalUserStateMessage = parsers.globalUserStateMessage(message);
                    _this._globalUserState = globalUserStateMessage.tags;
                    _this._isAuthenticated = true;
                }
                _this._handleJoinsAfterConnect();
                _this._internalEmitter.emit(constants.CONNECTED);
                connectProfiler.done('connected');
            });
            // Handle messages.
            _this._client.on(client_types_1.ClientEvents.ALL, _this._handleClientMessage, _this);
        };
        _this._handleDisconnect = function () {
            var _a, _b;
            _this._log.info('disconnecting ...');
            _this._readyState = chat_types_1.ChatReadyStates.DISCONNECTING;
            _this._isAuthenticated = false;
            _this._clearChannelState();
            (_a = _this._client) === null || _a === void 0 ? void 0 : _a.once(client_types_1.ClientEvents.DISCONNECTED, function () {
                _this._internalEmitter.emit(constants.DISCONNECTED);
                _this._readyState = chat_types_1.ChatReadyStates.DISCONNECTED;
                _this._log.info('disconnected');
            });
            (_b = _this._client) === null || _b === void 0 ? void 0 : _b.disconnect();
        };
        _this._handleReconnect = function () {
            var _a, _b, _c;
            _this._log.info('reconnecting ...');
            _this._readyState = chat_types_1.ChatReadyStates.RECONNECTING;
            (_a = _this._client) === null || _a === void 0 ? void 0 : _a.removeAllListeners();
            (_b = _this._client) === null || _b === void 0 ? void 0 : _b.once(client_types_1.ClientEvents.DISCONNECTED, function () {
                _this._internalEmitter.emit(constants.CONNECT);
            });
            (_c = _this._client) === null || _c === void 0 ? void 0 : _c.disconnect();
        };
        _this._handleClientAuthenticationFailure = function (originError) { return __awaiter(_this, void 0, void 0, function () {
            var token, reAuthenticationError_1, error, authenticationError;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        this._log.info('retrying ...');
                        return [4 /*yield*/, ((_b = (_a = this._options).onAuthenticationFailure) === null || _b === void 0 ? void 0 : _b.call(_a))];
                    case 1:
                        token = _c.sent();
                        if (token) {
                            this._log.info('re-authenticating ...');
                            this._options = __assign(__assign({}, this._options), { token: token });
                        }
                        this._internalEmitter.emit(constants.CONNECT);
                        return [3 /*break*/, 3];
                    case 2:
                        reAuthenticationError_1 = _c.sent();
                        error = reAuthenticationError_1 || originError;
                        authenticationError = new Errors.AuthenticationError((originError === null || originError === void 0 ? void 0 : originError.message) || 'Login authentication failed', originError);
                        this._internalEmitter.emit(twitch_1.Events.ERROR_ENCOUNTERED, authenticationError);
                        this._log.error(error, 'authentication failed');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        _this._options = validators.chatOptions(options);
        // Create logger.
        _this._log = logger_1.default(__assign({ name: 'Chat' }, _this._options.log));
        _this._internalEmitter.on(constants.CONNECT, _this._handleConnect);
        _this._internalEmitter.on(constants.DISCONNECT, _this._handleDisconnect);
        _this._internalEmitter.on(constants.RECONNECT, _this._handleReconnect);
        return _this;
    }
    /**
     * Connect to Twitch.
     */
    Chat.prototype.connect = function () {
        if (this._connectionInProgress) {
            return this._connectionInProgress;
        }
        this._connectionInProgress = p_event_1.default(this._internalEmitter, constants.CONNECTED, {
            rejectionEvents: [twitch_1.Events.ERROR_ENCOUNTERED],
            timeout: this._options.connectionTimeout,
        });
        this._internalEmitter.emit(constants.CONNECT);
        return this._connectionInProgress;
    };
    /**
     * Updates the client options after instantiation.
     * To update `token` or `username`, use `reconnect()`.
     */
    Chat.prototype.updateOptions = function (options) {
        var _a = this._options, token = _a.token, username = _a.username;
        this._options = validators.chatOptions(__assign(__assign({}, options), { token: token, username: username }));
    };
    /**
     * Send a raw message to Twitch.
     */
    Chat.prototype.send = function (message, options) {
        if (!this._client) {
            throw new Errors.ChatError('Not connected');
        }
        return this._client.send(message, options);
    };
    /**
     * Disconnected from Twitch.
     */
    Chat.prototype.disconnect = function () {
        if (this._connectionInProgress) {
            this._connectionInProgress.cancel();
            this._connectionInProgress = undefined;
        }
        this._disconnectionInProgress = p_event_1.default(this._internalEmitter, constants.DISCONNECTED, { timeout: this._options.connectionTimeout }).catch();
        this._internalEmitter.emit(constants.DISCONNECT);
        return this._disconnectionInProgress;
    };
    /**
     * Reconnect to Twitch, providing new options to the client.
     */
    Chat.prototype.reconnect = function (options) {
        if (this._reconnectionInProgress) {
            return this._reconnectionInProgress;
        }
        if (options) {
            this._options = validators.chatOptions(__assign(__assign({}, this._options), options));
        }
        this._reconnectionInProgress = p_event_1.default(this._internalEmitter, constants.CONNECTED, {
            timeout: this._options.connectionTimeout,
        });
        this._internalEmitter.emit(constants.RECONNECT);
        return this._reconnectionInProgress;
    };
    /**
     * Join a channel.
     *
     * @example <caption>Joining #dallas</caption>
     * const channel = '#dallas'
     *
     * chat.join(channel).then(channelState => {
     *   // Do stuff with channelState...
     * })
     *
     * @example <caption>Joining multiple channels</caption>
     * const channels = ['#dallas', '#ronni']
     *
     * Promise.all(channels.map(channel => chat.join(channel)))
     *   .then(channelStates => {
     *     // Listen to all PRIVMSG
     *     chat.on('PRIVMSG', privateMessage => {
     *       // Do stuff with privateMessage ...
     *     })
     *
     *     // Listen to PRIVMSG from #dallas ONLY
     *     chat.on('PRIVMSG/#dallas', privateMessage => {
     *       // Do stuff with privateMessage ...
     *     })
     *     // Listen to all PRIVMSG from #ronni ONLY
     *     chat.on('PRIVMSG/#ronni', privateMessage => {
     *       // Do stuff with privateMessage ...
     *     })
     *   })
     */
    Chat.prototype.join = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var joinProfiler, _a, roomState, userState, channelState;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        joinProfiler = this._log.profile("joining " + channel);
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, twitch_1.Commands.ROOM_STATE + "/" + channel),
                                this._isAuthenticated
                                    ? p_event_1.default(
                                    // @ts-expect-error EventTypes breaks this
                                    this, twitch_1.Commands.USER_STATE + "/" + channel)
                                    : undefined,
                                this.send(twitch_1.Commands.JOIN + " " + channel),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), roomState = _a[0], userState = _a[1];
                        channelState = {
                            roomState: roomState.tags,
                            userState: userState ? userState.tags : undefined,
                        };
                        this._setChannelState(roomState.channel, channelState);
                        joinProfiler.done("Joined " + channel);
                        return [2 /*return*/, channelState];
                }
            });
        });
    };
    /**
     * Depart from a channel.
     */
    Chat.prototype.part = function (channel) {
        channel = validators.channel(channel);
        this._log.info("parting " + channel);
        this._removeChannelState(channel);
        return this.send(twitch_1.Commands.PART + " " + channel);
    };
    /**
     * Send a message to a channel.
     */
    Chat.prototype.say = function (channel, message, options) {
        var _a, _b;
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var isCommand, isModerator, resolver;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this._isAuthenticated) {
                            throw new Errors.ChatError('To send messages, please connect with a token and username');
                        }
                        channel = validators.channel(channel);
                        isCommand = message.startsWith('/');
                        isModerator = ((_b = (_a = this._channelState[channel]) === null || _a === void 0 ? void 0 : _a.userState) === null || _b === void 0 ? void 0 : _b.mod) === '1';
                        if (isCommand) {
                            this._log.info("CMD/" + channel + " :" + message);
                        }
                        else {
                            this._log.info("PRIVMSG/" + channel + " :" + message);
                        }
                        resolver = isCommand
                            ? // Commands do not result in USERSTATE messages
                                Promise.resolve()
                            : p_event_1.default(
                            // @ts-expect-error EventTypes breaks this
                            this, twitch_1.Commands.USER_STATE + "/" + channel);
                        return [4 /*yield*/, Promise.all([
                                resolver,
                                this.send(twitch_1.Commands.PRIVATE_MESSAGE + " " + channel + " :" + message, __assign({ isModerator: isModerator }, options)),
                            ])];
                    case 1:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Broadcast message to all connected channels.
     */
    Chat.prototype.broadcast = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this._isAuthenticated) {
                    throw new Errors.ChatError('To broadcast, please connect with a token and username');
                }
                return [2 /*return*/, this._getChannels().map(function (channel) { return _this.say(channel, message); })];
            });
        });
    };
    /**
     * This command will allow you to permanently ban a user from the chat room.
     */
    Chat.prototype.ban = function (channel, username) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.BAN + " " + username;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [
                                    chat_types_1.NoticeCompounds.BAN_SUCCESS + "/" + channel,
                                    chat_types_1.NoticeCompounds.ALREADY_BANNED + "/" + channel,
                                ]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command will allow you to block all messages from a specific user in
     * chat and whispers if you do not wish to see their comments.
     */
    Chat.prototype.block = function (channel, username) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                channel = validators.channel(channel);
                message = "/" + twitch_1.ChatCommands.BLOCK + " " + username;
                return [2 /*return*/, this.say(channel, message)];
            });
        });
    };
    /**
     * Single message removal on a channel.
     */
    Chat.prototype.delete = function (channel, targetMessageId) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                channel = validators.channel(channel);
                message = "/" + twitch_1.ChatCommands.DELETE + " " + targetMessageId;
                return [2 /*return*/, this.say(channel, message)];
            });
        });
    };
    /**
     * This command will allow the Broadcaster and chat moderators to completely
     * wipe the previous chat history.
     */
    Chat.prototype.clear = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.CLEAR;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [twitch_1.Commands.CLEAR_CHAT + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * Allows you to change the color of your username.
     */
    Chat.prototype.color = function (channel, color) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.COLOR + " " + color;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.COLOR_CHANGED + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * An Affiliate and Partner command that runs a commercial for all of your
     * viewers.
     */
    Chat.prototype.commercial = function (channel, length) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.COMMERCIAL + " " + length;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.COMMERCIAL_SUCCESS + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command allows you to set your room so only messages that are 100%
     * emotes are allowed.
     */
    Chat.prototype.emoteOnly = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.EMOTE_ONLY;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [
                                    chat_types_1.NoticeCompounds.EMOTE_ONLY_ON + "/" + channel,
                                    chat_types_1.NoticeCompounds.ALREADY_EMOTE_ONLY_ON + "/" + channel,
                                ]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command allows you to disable emote only mode if you previously
     * enabled it.
     */
    Chat.prototype.emoteOnlyOff = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.EMOTE_ONLY_OFF;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [
                                    chat_types_1.NoticeCompounds.EMOTE_ONLY_OFF + "/" + channel,
                                    chat_types_1.NoticeCompounds.ALREADY_EMOTE_ONLY_OFF + "/" + channel,
                                ]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command allows you or your mods to restrict chat to all or some of
     * your followers, based on how long they’ve followed.
     * @param period - Follow time from 0 minutes (all followers) to 3 months.
     */
    Chat.prototype.followersOnly = function (channel, period) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.FOLLOWERS_ONLY + " " + period;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [
                                    chat_types_1.NoticeCompounds.FOLLOWERS_ONZERO + "/" + channel,
                                    chat_types_1.NoticeCompounds.FOLLOWERS_ON + "/" + channel,
                                ]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command will disable followers only mode if it was previously enabled
     * on the channel.
     */
    Chat.prototype.followersOnlyOff = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.FOLLOWERS_ONLY_OFF;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.FOLLOWERS_OFF + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    Chat.prototype.help = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.HELP;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.CMDS_AVAILABLE + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command will allow you to host another channel on yours.
     */
    Chat.prototype.host = function (channel, hostChannel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.HOST + " " + hostChannel;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.HOST_ON + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * Adds a stream marker (with an optional description, max 140 characters) at
     * the current timestamp. You can use markers in the Highlighter for easier
     * editing.
     */
    Chat.prototype.marker = function (channel, description) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                channel = validators.channel(channel);
                message = "/" + twitch_1.ChatCommands.MARKER + " " + description.slice(0, 140);
                return [2 /*return*/, this.say(channel, message)];
            });
        });
    };
    /**
     * This command will color your text based on your chat name color.
     */
    Chat.prototype.me = function (channel, text) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                channel = validators.channel(channel);
                message = "/" + twitch_1.ChatCommands.ME + " " + text;
                return [2 /*return*/, this.say(channel, message)];
            });
        });
    };
    /**
     * This command will allow you to promote a user to a channel moderator.
     */
    Chat.prototype.mod = function (channel, username) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.MOD + " " + username;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.MOD_SUCCESS + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command will display a list of all chat moderators for that specific
     * channel.
     */
    Chat.prototype.mods = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.MODS;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.ROOM_MODS + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * @deprecated
     */
    Chat.prototype.r9K = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.R9K;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [
                                    chat_types_1.NoticeCompounds.R9K_ON + "/" + channel,
                                    chat_types_1.NoticeCompounds.ALREADY_R9K_ON + "/" + channel,
                                ]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * @deprecated
     */
    Chat.prototype.r9KOff = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.R9K_OFF;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [
                                    chat_types_1.NoticeCompounds.R9K_OFF + "/" + channel,
                                    chat_types_1.NoticeCompounds.ALREADY_R9K_OFF + "/" + channel,
                                ]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command will send the viewer to another live channel.
     */
    Chat.prototype.raid = function (channel, raidChannel) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                channel = validators.channel(channel);
                message = "/" + twitch_1.ChatCommands.RAID + " " + raidChannel;
                return [2 /*return*/, this.say(channel, message)];
            });
        });
    };
    /**
     * This command allows you to set a limit on how often users in the chat room
     * are allowed to send messages (rate limiting).
     */
    Chat.prototype.slow = function (channel, seconds) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.SLOW + " " + seconds;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.SLOW_ON + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command allows you to disable slow mode if you had previously set it.
     */
    Chat.prototype.slowOff = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.SLOW_OFF;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.SLOW_OFF + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command allows you to set your room so only users subscribed to you
     * can talk in the chat room. If you don't have the subscription feature it
     * will only allow the Broadcaster and the channel moderators to talk in the
     * chat room.
     */
    Chat.prototype.subscribers = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.SUBSCRIBERS;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [
                                    chat_types_1.NoticeCompounds.SUBS_ON + "/" + channel,
                                    chat_types_1.NoticeCompounds.ALREADY_SUBS_ON + "/" + channel,
                                ]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command allows you to disable subscribers only chat room if you
     * previously enabled it.
     */
    Chat.prototype.subscribersOff = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.SUBSCRIBERS_OFF;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [
                                    chat_types_1.NoticeCompounds.SUBS_OFF + "/" + channel,
                                    chat_types_1.NoticeCompounds.ALREADY_SUBS_OFF + "/" + channel,
                                ]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command allows you to temporarily ban someone from the chat room for
     * 10 minutes by default. This will be indicated to yourself and the
     * temporarily banned subject in chat on a successful temporary ban. A new
     * timeout command will overwrite an old one.
     */
    Chat.prototype.timeout = function (channel, username, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var timeoutArg, message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        timeoutArg = timeout ? " " + timeout : '';
                        message = "/" + twitch_1.ChatCommands.TIMEOUT + " " + username + timeoutArg;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.TIMEOUT_SUCCESS + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command will allow you to lift a permanent ban on a user from the
     * chat room. You can also use this command to end a ban early; this also
     * applies to timeouts.
     */
    Chat.prototype.unban = function (channel, username) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.UNBAN + " " + username;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.UNBAN_SUCCESS + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command will allow you to remove users from your block list that you
     * previously added.
     */
    Chat.prototype.unblock = function (channel, username) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                channel = validators.channel(channel);
                message = "/" + twitch_1.ChatCommands.UNBLOCK + " " + username;
                return [2 /*return*/, this.say(channel, message)];
            });
        });
    };
    /**
     * Using this command will revert the embedding from hosting a channel and
     * return it to its normal state.
     */
    Chat.prototype.unhost = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.UNHOST;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.HOST_OFF + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command will allow you to demote an existing moderator back to viewer
     * status (removing their moderator abilities).
     */
    Chat.prototype.unmod = function (channel, username) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.UNMOD + " " + username;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.UNMOD_SUCCESS + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command will cancel the raid.
     */
    Chat.prototype.unraid = function (channel) {
        return __awaiter(this, void 0, void 0, function () {
            var message, _a, notice;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        channel = validators.channel(channel);
                        message = "/" + twitch_1.ChatCommands.UNRAID;
                        return [4 /*yield*/, Promise.all([
                                p_event_1.default(
                                // @ts-expect-error EventTypes breaks this
                                this, [chat_types_1.NoticeCompounds.UNRAID_SUCCESS + "/" + channel]),
                                this.say(channel, message),
                            ])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), notice = _a[0];
                        return [2 /*return*/, notice];
                }
            });
        });
    };
    /**
     * This command will grant VIP status to a user.
     */
    Chat.prototype.unvip = function (channel, username) {
        channel = validators.channel(channel);
        var message = "/" + twitch_1.ChatCommands.UNVIP + " " + username;
        return this.say(channel, message);
    };
    /**
     * This command will grant VIP status to a user.
     */
    Chat.prototype.vip = function (channel, username) {
        channel = validators.channel(channel);
        var message = "/" + twitch_1.ChatCommands.VIP + " " + username;
        return this.say(channel, message);
    };
    /**
     * This command will display a list of VIPs for that specific channel.
     */
    Chat.prototype.vips = function (channel) {
        channel = validators.channel(channel);
        var message = "/" + twitch_1.ChatCommands.VIPS;
        return this.say(channel, message);
    };
    /**
     * This command sends a private message to another user on Twitch.
     */
    Chat.prototype.whisper = function (username, message) {
        return __awaiter(this, void 0, void 0, function () {
            var command;
            return __generator(this, function (_a) {
                if (!this._isAuthenticated) {
                    throw new Errors.ChatError('To whisper, please connect with a token and username');
                }
                command = "/" + twitch_1.ChatCommands.WHISPER + " " + username + " " + message;
                return [2 /*return*/, this.send(command)];
            });
        });
    };
    Chat.prototype._handleClientMessage = function (baseMessage) {
        try {
            var _a = __read(this._parseMessageForEmitter(baseMessage), 2), eventName = _a[0], message = _a[1];
            this._emit(eventName, message);
        }
        catch (clientMessageError) {
            /**
             * Catch errors while parsing base messages into events.
             */
            this._log.error('\n' +
                'An error occurred while attempting to parse a message into a ' +
                'event. Please use the following stack trace and raw message to ' +
                'resolve the bug in the TwitchJS source code, and then issue a ' +
                'pull request at https://github.com/twitch-js/twitch-js/compare\n' +
                '\n' +
                'Stack trace:\n' +
                (clientMessageError + "\n") +
                '\n' +
                'Base message:\n' +
                JSON.stringify(baseMessage));
            this._internalEmitter.emit(client_types_1.ClientEvents.ERROR_ENCOUNTERED, clientMessageError);
        }
    };
    Chat.prototype._handleJoinsAfterConnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var channels, joinsError_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        channels = this._getChannels();
                        return [4 /*yield*/, Promise.all(channels.map(function (channel) { return _this.join(channel); }))];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        joinsError_1 = _a.sent();
                        this._log.error(joinsError_1, 'unable to rejoin channels');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Chat.prototype._getChannels = function () {
        return Object.keys(this._channelState);
    };
    Chat.prototype._getChannelState = function (channel) {
        return this._channelState[channel];
    };
    Chat.prototype._setChannelState = function (channel, state) {
        this._channelState[channel] = state;
    };
    Chat.prototype._removeChannelState = function (channel) {
        this._channelState = Object.entries(this._channelState).reduce(function (channelStates, _a) {
            var _b;
            var _c = __read(_a, 2), name = _c[0], state = _c[1];
            return name === channel
                ? channelStates
                : __assign(__assign({}, channelStates), (_b = {}, _b[name] = state, _b));
        }, {});
    };
    Chat.prototype._clearChannelState = function () {
        this._channelState = {};
    };
    Chat.prototype._parseMessageForEmitter = function (baseMessage) {
        var channel = sanitizers.channel(baseMessage.channel);
        var baseEventName = baseMessage.event || baseMessage.command;
        switch (baseMessage.command) {
            case twitch_1.Events.JOIN: {
                var message = parsers.joinMessage(baseMessage);
                var eventName = baseEventName + "/" + channel;
                return [eventName, message];
            }
            case twitch_1.Events.PART: {
                var message = parsers.partMessage(baseMessage);
                var eventName = baseEventName + "/" + channel;
                return [eventName, message];
            }
            case twitch_1.Events.NAMES: {
                var message = parsers.namesMessage(baseMessage);
                var eventName = baseEventName + "/" + channel;
                return [eventName, message];
            }
            case twitch_1.Events.NAMES_END: {
                var message = parsers.namesEndMessage(baseMessage);
                var eventName = baseEventName + "/" + channel;
                return [eventName, message];
            }
            case twitch_1.Events.CLEAR_CHAT: {
                var message = parsers.clearChatMessage(baseMessage);
                var eventName = baseEventName + "/" + message.event + "/" + channel;
                return [eventName, message];
            }
            case twitch_1.Events.CLEAR_MESSAGE: {
                var message = parsers.clearMessageMessage(baseMessage);
                var eventName = baseEventName + "/" + channel;
                return [eventName, message];
            }
            case twitch_1.Events.HOST_TARGET: {
                var message = parsers.hostTargetMessage(baseMessage);
                var eventName = baseEventName + "/" + channel;
                return [eventName, message];
            }
            case twitch_1.Events.MODE: {
                var message = parsers.modeMessage(baseMessage);
                var eventName = baseEventName + "/" + channel;
                var channelState = this._getChannelState(channel);
                if (this._isAuthenticated &&
                    typeof (channelState === null || channelState === void 0 ? void 0 : channelState.userState) !== 'undefined' &&
                    message.username === this._options.username) {
                    this._setChannelState(channel, __assign(__assign({}, channelState), { userState: __assign(__assign({}, channelState.userState), { mod: message.isModerator ? '1' : '0', isModerator: message.isModerator }) }));
                }
                return [eventName, message];
            }
            case twitch_1.Events.USER_STATE: {
                var message = parsers.userStateMessage(baseMessage);
                var eventName = baseEventName + "/" + channel;
                var channelState = this._getChannelState(channel);
                if (channelState) {
                    this._setChannelState(channel, __assign(__assign({}, channelState), { userState: message.tags }));
                }
                return [eventName, message];
            }
            case twitch_1.Events.ROOM_STATE: {
                var message = parsers.roomStateMessage(baseMessage);
                var eventName = baseEventName + "/" + channel;
                this._setChannelState(channel, __assign(__assign({}, this._getChannelState(channel)), { roomState: message }));
                return [eventName, message];
            }
            case twitch_1.Events.NOTICE: {
                var message = parsers.noticeMessage(baseMessage);
                var eventName = baseEventName + "/" + message.event + "/" + channel;
                return [eventName, message];
            }
            case twitch_1.Events.USER_NOTICE: {
                var message = parsers.userNoticeMessage(baseMessage);
                var eventName = baseEventName + "/" + message.event + "/" + channel;
                return [eventName, message];
            }
            case twitch_1.Events.PRIVATE_MESSAGE: {
                var message = parsers.privateMessage(baseMessage);
                var eventName = baseEventName + "/" + message.event + "/" + channel;
                return [eventName, message];
            }
            default: {
                var eventName = channel
                    ? baseEventName + "/" + channel
                    : baseEventName;
                return [eventName, baseMessage];
            }
        }
    };
    Chat.prototype._emit = function (eventName, message) {
        var _this = this;
        try {
            if (eventName) {
                this._log.info(message, eventName);
                var events = uniq_1.default(eventName.split('/'));
                events
                    .filter(function (part) { return part !== '#'; })
                    .reduce(function (parents, part) {
                    var eventParts = __spread(parents, [part]);
                    var eventCompound = eventParts.join('/');
                    if (eventParts.length > 1) {
                        _super.prototype.emit.call(_this, part, message);
                    }
                    _super.prototype.emit.call(_this, eventCompound, message);
                    return eventParts;
                }, []);
            }
            // Emit message under the ALL `*` event.
            _super.prototype.emit.call(this, twitch_1.Events.ALL, message);
        }
        catch (emitError) {
            /**
             * Catch external implementation errors.
             */
            this._log.error('\n' +
                ("While attempting to handle the " + message.command + " event, an ") +
                'error occurred in your implementation. To avoid seeing this ' +
                'message, please resolve the error:\n' +
                '\n' +
                (emitError.stack + "\n") +
                '\n' +
                'Parsed messages:\n' +
                JSON.stringify(message));
            this._internalEmitter.emit(client_types_1.ClientEvents.ERROR_ENCOUNTERED, emitError);
        }
    };
    Chat.Commands = twitch_1.Commands;
    Chat.Events = twitch_1.Events;
    Chat.CompoundEvents = (_a = {},
        _a[twitch_1.Events.NOTICE] = chat_types_1.NoticeCompounds,
        _a[twitch_1.Events.PRIVATE_MESSAGE] = chat_types_1.PrivateMessageCompounds,
        _a[twitch_1.Events.USER_NOTICE] = chat_types_1.UserNoticeCompounds,
        _a);
    return Chat;
}(eventemitter3_1.default));
exports.default = Chat;
//# sourceMappingURL=chat.js.map