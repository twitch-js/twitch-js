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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchError = void 0;
var cross_fetch_1 = __importDefault(require("cross-fetch"));
var qs_1 = require("qs");
var camelcase_keys_1 = __importDefault(require("camelcase-keys"));
var error_1 = require("../error");
var FetchError = /** @class */ (function (_super) {
    __extends(FetchError, _super);
    function FetchError(message, body) {
        var _this = _super.call(this, message) || this;
        _this.body = body;
        Object.defineProperty(_this, 'name', { value: 'TwitchJSFetchError' });
        return _this;
    }
    return FetchError;
}(error_1.TwitchJSError));
exports.FetchError = FetchError;
/**
 * Fetches URL
 */
var fetchUtil = function (url, options, qsOptions) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, bodyParams, rest, queryParams, jsonInit, init, response, json, body;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = options || {}, search = _a.search, bodyParams = _a.body, rest = __rest(_a, ["search", "body"]);
                queryParams = search
                    ? qs_1.stringify(search, __assign(__assign({}, qsOptions), { addQueryPrefix: true, arrayFormat: 'repeat' }))
                    : '';
                jsonInit = getJsonInit(bodyParams);
                init = __assign(__assign(__assign({}, rest), jsonInit), { headers: __assign(__assign({}, options === null || options === void 0 ? void 0 : options.headers), jsonInit.headers) });
                return [4 /*yield*/, cross_fetch_1.default("" + url + queryParams, init)];
            case 1:
                response = _b.sent();
                return [4 /*yield*/, response.json().catch(function () { return ({}); })];
            case 2:
                json = _b.sent();
                body = camelcase_keys_1.default(json, { deep: true });
                if ('error' in body) {
                    throw new FetchError(body.message, body);
                }
                if (!response.ok) {
                    throw new FetchError(response.statusText, {
                        error: true,
                        status: response.status,
                        message: response.statusText,
                    });
                }
                return [2 /*return*/, body];
        }
    });
}); };
var getJsonInit = function (input) {
    try {
        if (!input) {
            return {};
        }
        if (toString.call(input) === '[object FormData]') {
            return { body: input };
        }
        var body = JSON.stringify(input);
        return { body: body, headers: { 'Content-Type': 'application/json' } };
    }
    catch (err) {
        return { body: input };
    }
};
exports.default = fetchUtil;
//# sourceMappingURL=fetch.js.map