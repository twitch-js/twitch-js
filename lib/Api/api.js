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
var toUpper_1 = __importDefault(require("lodash/toUpper"));
var logger_1 = __importDefault(require("../utils/logger"));
var fetch_1 = __importStar(require("../utils/fetch"));
var error_1 = require("../utils/error");
var validators = __importStar(require("./utils/api-validators"));
var api_types_1 = require("./api-types");
/**
 * Make requests to Twitch API.
 *
 * ## Initializing
 *
 * ```js
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2'
 * const { api } = new TwitchJs({ token, clientId })
 * ```
 *
 * ## Making requests
 *
 * By default, the API client makes requests to the
 * [Helix API](https://dev.twitch.tv/docs/api), and exposes [[Api.get]],
 * [[Api.post]] and [[Api.put]] methods. Query and body parameters are provided
 * via `options.search` and `options.body` properties, respectively.
 *
 * ### Examples
 *
 * #### Get bits leaderboard
 * ```js
 * api
 *   .get('bits/leaderboard', { search: { user_id: '44322889' } })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 *
 * #### Get the latest Overwatch live streams
 * ```
 * api
 *   .get('streams', { search: { game_id: '1234' } })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 *
 * #### Start a channel commercial
 * ```
 * api
 *   .post('/channels/commercial', {
 *     body: { broadcaster_id: '44322889', length: 30 },
 *   })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 */
var Api = /** @class */ (function () {
    function Api(options) {
        this._readyState = api_types_1.ApiReadyStates.READY;
        this._options = validators.apiOptions(options);
        this._log = logger_1.default(__assign({ name: 'Api' }, this._options.log));
    }
    Object.defineProperty(Api.prototype, "readyState", {
        get: function () {
            return this._readyState;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Api.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Update client options.
     */
    Api.prototype.updateOptions = function (options) {
        this._options = validators.apiOptions(__assign(__assign({}, this._options), options));
    };
    /**
     * Initialize API client and retrieve status.
     * @see https://dev.twitch.tv/docs/v5/#root-url
     */
    Api.prototype.initialize = function (newOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (newOptions) {
                            this._options = validators.apiOptions(__assign(__assign({}, this._options), newOptions));
                        }
                        if (!newOptions && this.readyState === 2) {
                            return [2 /*return*/, Promise.resolve()];
                        }
                        return [4 /*yield*/, fetch_1.default('https://id.twitch.tv/oauth2/validate', { headers: { Authorization: "Bearer " + this._options.token } })];
                    case 1:
                        response = _a.sent();
                        this._readyState = api_types_1.ApiReadyStates.INITIALIZED;
                        this._status = response;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check if current credentials include `scope`.
     * @see https://dev.twitch.tv/docs/authentication/#twitch-api-v5
     */
    Api.prototype.hasScope = function (
    /** Scope to check */
    scope) {
        var _this = this;
        return new Promise(function (resolve, reject) { var _a, _b; return ((_b = (_a = _this.status) === null || _a === void 0 ? void 0 : _a.scopes) === null || _b === void 0 ? void 0 : _b.includes(scope)) ? resolve(true) : reject(false); });
    };
    /**
     * GET endpoint.
     *
     * @example <caption>Get user follows (Helix)</caption>
     * ```
     * api.get('users/follows', { search: { to_id: '23161357' } })
     *   .then(response => {
     *     // Do stuff with response ...
     *   })
     * ```
     */
    Api.prototype.get = function (endpoint, options) {
        if (endpoint === void 0) { endpoint = ''; }
        return this._handleFetch(endpoint, options);
    };
    /**
     * POST endpoint.
     */
    Api.prototype.post = function (endpoint, options) {
        return this._handleFetch(endpoint, __assign(__assign({}, options), { method: 'post' }));
    };
    /**
     * PUT endpoint.
     */
    Api.prototype.put = function (endpoint, options) {
        return this._handleFetch(endpoint, __assign(__assign({}, options), { method: 'put' }));
    };
    Api.prototype._getAuthenticationHeaders = function () {
        var _a = this._options, clientId = _a.clientId, token = _a.token;
        return {
            Authorization: "Bearer " + token,
            'Client-Id': clientId,
        };
    };
    Api.prototype._handleFetch = function (maybeUrl, options) {
        if (maybeUrl === void 0) { maybeUrl = ''; }
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var baseUrl, url, message, fetchProfiler, performRequest, caughtError, error_2, token;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        baseUrl = 'https://api.twitch.tv/helix';
                        url = baseUrl + "/" + maybeUrl;
                        message = (toUpper_1.default(options.method) || 'GET') + " " + url;
                        fetchProfiler = this._log.profile();
                        performRequest = function () { return __awaiter(_this, void 0, void 0, function () {
                            var authenticationHeaders, fetchOptions, error_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        authenticationHeaders = this._getAuthenticationHeaders();
                                        fetchOptions = __assign(__assign({}, options), { headers: __assign(__assign({}, options.headers), authenticationHeaders) });
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, fetch_1.default(url, fetchOptions)];
                                    case 2: return [2 /*return*/, _a.sent()];
                                    case 3:
                                        error_3 = _a.sent();
                                        if (error_3 instanceof fetch_1.FetchError && error_3.body.status === 401) {
                                            throw new error_1.AuthenticationError(error_3.message, error_3.body);
                                        }
                                        throw error_3;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 7, 8]);
                        return [4 /*yield*/, performRequest()];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_2 = _a.sent();
                        if (!(typeof this._options.onAuthenticationFailure === 'function' &&
                            error_2 instanceof error_1.AuthenticationError)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._handleAuthenticationFailure(error_2)];
                    case 4:
                        token = _a.sent();
                        if (!token) return [3 /*break*/, 6];
                        this._log.info(message + " ... retrying with new token");
                        this.updateOptions({ token: token });
                        return [4 /*yield*/, performRequest()];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6:
                        caughtError = error_2;
                        throw caughtError;
                    case 7:
                        fetchProfiler.done(message, caughtError);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Api.prototype._handleAuthenticationFailure = function (originError) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ((_b = (_a = this._options).onAuthenticationFailure) === null || _b === void 0 ? void 0 : _b.call(_a))];
                    case 1: return [2 /*return*/, _c.sent()];
                    case 2:
                        error_4 = _c.sent();
                        this._log.error(error_4, 'onAuthenticationFailure error occurred');
                        throw originError;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return Api;
}());
exports.default = Api;
//# sourceMappingURL=api.js.map