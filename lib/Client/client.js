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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventemitter3_1 = __importDefault(require("eventemitter3"));
var ws_1 = __importDefault(require("ws"));
var p_queue_1 = __importDefault(require("p-queue"));
var twitch_1 = require("../twitch");
var logger_1 = __importDefault(require("../utils/logger"));
var constants = __importStar(require("./client-constants"));
var parsers_1 = require("./utils/parsers");
var validators = __importStar(require("./utils/client-validators"));
var utils = __importStar(require("./utils"));
var client_types_1 = require("./client-types");
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client(options) {
        var _this = _super.call(this) || this;
        _this._clientPriority = 100;
        // Validate options.
        _this._options = validators.clientOptions(options);
        var _a = _this._options, ssl = _a.ssl, server = _a.server, port = _a.port, log = _a.log;
        _this._log = logger_1.default(__assign({ name: 'Chat/Client' }, log));
        // Instantiate WebSocket.
        var protocol = ssl ? 'wss' : 'ws';
        _this._ws = new ws_1.default(protocol + "://" + server + ":" + port);
        _this._ws.onopen = _this._handleOpen.bind(_this);
        _this._ws.onmessage = _this._handleMessage.bind(_this);
        _this._ws.onerror = _this._handleError.bind(_this);
        _this._ws.onclose = _this._handleClose.bind(_this);
        // Instantiate Queues.
        // See https://dev.twitch.tv/docs/irc/guide#command--message-limits
        _this._queueAuthenticate = _this._options.isVerified
            ? new p_queue_1.default({ intervalCap: 200, interval: 10000 })
            : new p_queue_1.default({ intervalCap: 20, interval: 10000 });
        _this._queueJoin = _this._options.isVerified
            ? new p_queue_1.default({ intervalCap: 2000, interval: 10000 })
            : new p_queue_1.default({ intervalCap: 20, interval: 10000 });
        _this._queue = new p_queue_1.default({ intervalCap: 20, interval: 30000 });
        _this._moderatorQueue = new p_queue_1.default({ intervalCap: 100, interval: 30000 });
        return _this;
    }
    Client.prototype.isReady = function () {
        return this._ws.readyState === 1;
    };
    /**
     * Send message to Twitch
     */
    Client.prototype.send = function (message, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, priority, isModerator, queue, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = __assign({ priority: 0, isModerator: false }, options), priority = _a.priority, isModerator = _a.isModerator;
                        queue = message.startsWith('JOIN')
                            ? this._queueJoin
                            : message.startsWith('PASS')
                                ? this._queueAuthenticate
                                : isModerator && this._moderatorQueue
                                    ? this._moderatorQueue
                                    : this._queue;
                        return [4 /*yield*/, queue.add(function () { return _this._ws.send(message); }, { priority: priority })];
                    case 1:
                        _b.sent();
                        this._log.trace("< " + message);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        this._log.error("< " + message);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.disconnect = function () {
        var _a, _b;
        this._queueAuthenticate.pause();
        this._queueJoin.pause();
        this._queue.pause();
        (_a = this._moderatorQueue) === null || _a === void 0 ? void 0 : _a.pause();
        // @ts-expect-error clean up p-queue
        clearTimeout(this._queueAuthenticate._timeoutId);
        // @ts-expect-error clean up p-queue
        clearTimeout(this._queueJoin._timeoutId);
        // @ts-expect-error clean up p-queue
        clearTimeout(this._queue._timeoutId);
        // @ts-expect-error clean up p-queue
        clearTimeout((_b = this._moderatorQueue) === null || _b === void 0 ? void 0 : _b._timeoutId);
        this._handleHeartbeatReset();
        this._ws.close();
    };
    Client.prototype._handleOpen = function () {
        var priority = this._clientPriority;
        // Register for Twitch-specific capabilities.
        this.send("CAP REQ :" + Object.values(twitch_1.Capabilities).join(' '), { priority: priority });
        // Authenticate.
        var _a = this._options, token = _a.token, username = _a.username;
        if (token && username) {
            this.send("PASS " + token, { priority: priority });
        }
        this.send("NICK " + username, { priority: priority });
        this._handleHeartbeat();
    };
    Client.prototype._handleMessage = function (messageEvent) {
        var _this = this;
        var rawMessage = messageEvent.data.toString();
        this._log.trace("> " + rawMessage.trim());
        var _a = this._options, token = _a.token, username = _a.username;
        var priority = this._clientPriority;
        this._handleHeartbeat();
        var messages = [];
        try {
            messages = parsers_1.baseParser(rawMessage, this._options.username);
        }
        catch (error) {
            /**
             * Catch errors while parsing raw messages into base messages.
             */
            this._log.error('\n' +
                'An error occurred while attempting to parse a message from ' +
                'Twitch. Please use the following stack trace and raw message to ' +
                'resolve the bug in the TwitchJS source code, and then issue a ' +
                'pull request at https://github.com/twitch-js/twitch-js/compare\n' +
                '\n' +
                'Stack trace:\n' +
                (error + "\n") +
                '\n' +
                'Raw message:\n' +
                rawMessage);
            this.emit(client_types_1.ClientEvents.ERROR_ENCOUNTERED, error);
        }
        messages.forEach(function (message) {
            var event = message.command || '';
            _this._log.debug(__assign(__assign({}, message), { _raw: undefined }), '> %s', event);
            // Handle authentication failure.
            if (utils.isAuthenticationFailedMessage(message)) {
                _this._multiEmit([client_types_1.ClientEvents.ALL, client_types_1.ClientEvents.AUTHENTICATION_FAILED], __assign(__assign({}, message), { event: client_types_1.ClientEvents.AUTHENTICATION_FAILED }));
                _this.disconnect();
            }
            else {
                if (message.command === twitch_1.Commands.PING) {
                    // Handle PING/PONG.
                    _this.send('PONG :tmi.twitch.tv', { priority: priority });
                }
                else if (!token && message.command === twitch_1.Commands.WELCOME) {
                    // Handle successful connections without authentications.
                    _this._multiEmit([client_types_1.ClientEvents.ALL, client_types_1.ClientEvents.CONNECTED], __assign(__assign({}, message), { event: client_types_1.ClientEvents.CONNECTED }));
                }
                else if (message.command === twitch_1.Commands.GLOBALUSERSTATE) {
                    // Handle successful authentications.
                    _this._multiEmit([client_types_1.ClientEvents.ALL, client_types_1.ClientEvents.GLOBALUSERSTATE], __assign(__assign({}, message), { event: client_types_1.ClientEvents.GLOBALUSERSTATE }));
                    if (token && username) {
                        _this._multiEmit([client_types_1.ClientEvents.ALL, client_types_1.ClientEvents.CONNECTED], __assign(__assign({}, message), { event: client_types_1.ClientEvents.CONNECTED }));
                    }
                }
                else if (message.command === twitch_1.Commands.RECONNECT) {
                    // Handle RECONNECT.
                    _this._multiEmit([client_types_1.ClientEvents.ALL, client_types_1.ClientEvents.RECONNECT], __assign(__assign({}, message), { event: client_types_1.ClientEvents.RECONNECT }));
                }
                else {
                    _this.emit(client_types_1.ClientEvents.ALL, message);
                }
            }
        });
        this.emit(client_types_1.ClientEvents.RAW, rawMessage);
    };
    Client.prototype._handleError = function (errorEvent) {
        this._log.error(errorEvent);
    };
    Client.prototype._handleClose = function (_closeEvent) {
        this.emit(client_types_1.ClientEvents.DISCONNECTED);
    };
    Client.prototype._handleHeartbeat = function () {
        var _this = this;
        this._handleHeartbeatReset();
        var priority = this._clientPriority;
        // Send PING ...
        this._heartbeatTimeoutId = setTimeout(function () {
            _this.send(twitch_1.Commands.PING, { priority: priority });
        }, constants.KEEP_ALIVE_PING_TIMEOUT);
        // ... and if the heart beat fails, emit RECONNECT event.
        this._reconnectTimeoutId = setTimeout(function () {
            _this.emit(client_types_1.ClientEvents.RECONNECT);
        }, constants.KEEP_ALIVE_PING_TIMEOUT + 1000);
    };
    Client.prototype._handleHeartbeatReset = function () {
        if (this._heartbeatTimeoutId) {
            clearTimeout(this._heartbeatTimeoutId);
        }
        if (this._reconnectTimeoutId) {
            clearTimeout(this._reconnectTimeoutId);
        }
    };
    Client.prototype._multiEmit = function (event, message) {
        var _this = this;
        if (Array.isArray(event)) {
            event.forEach(function (eventName) { return _this.emit(eventName, message); });
        }
        else {
            this.emit(event, message);
        }
    };
    return Client;
}(eventemitter3_1.default));
exports.default = Client;
//# sourceMappingURL=client.js.map