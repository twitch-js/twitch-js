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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientOptions = void 0;
var invariant_1 = __importDefault(require("invariant"));
var conformsTo_1 = __importDefault(require("lodash/conformsTo"));
var defaults_1 = __importDefault(require("lodash/defaults"));
var isString_1 = __importDefault(require("lodash/isString"));
var isFinite_1 = __importDefault(require("lodash/isFinite"));
var isBoolean_1 = __importDefault(require("lodash/isBoolean"));
var isNil_1 = __importDefault(require("lodash/isNil"));
var constants = __importStar(require("../client-constants"));
var sanitizers = __importStar(require("./client-sanitizers"));
exports.clientOptions = function (options) {
    var shape = {
        username: function (value) { return isNil_1.default(value) || isString_1.default(value); },
        token: function (value) { return isNil_1.default(value) || isString_1.default(value); },
        server: isString_1.default,
        port: isFinite_1.default,
        ssl: isBoolean_1.default,
        isKnown: isBoolean_1.default,
        isVerified: isBoolean_1.default,
    };
    var optionsWithDefaults = defaults_1.default(__assign(__assign({}, options), { username: sanitizers.username(options.username), token: options.token ? sanitizers.token(options.token) : undefined }), {
        server: constants.CHAT_SERVER,
        port: constants.CHAT_SERVER_SSL_PORT,
        ssl: true,
        isKnown: false,
        isVerified: false,
    });
    invariant_1.default(conformsTo_1.default(optionsWithDefaults, shape), '[twitch-js/Chat/Client] options: Expected valid options');
    return optionsWithDefaults;
};
//# sourceMappingURL=client-validators.js.map