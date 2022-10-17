"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiOptions = void 0;
var invariant_1 = __importDefault(require("invariant"));
var conformsTo_1 = __importDefault(require("lodash/conformsTo"));
var defaults_1 = __importDefault(require("lodash/defaults"));
var isFunction_1 = __importDefault(require("lodash/isFunction"));
var isString_1 = __importDefault(require("lodash/isString"));
var isUndefined_1 = __importDefault(require("lodash/isUndefined"));
exports.apiOptions = function (options) {
    var shape = {
        token: isString_1.default,
        clientId: isString_1.default,
        onAuthenticationFailure: function (cb) { return isFunction_1.default(cb) || isUndefined_1.default(cb); },
    };
    options = defaults_1.default(options, {
        clientId: undefined,
        onAuthenticationFailure: undefined,
    });
    invariant_1.default(conformsTo_1.default(options, shape), 'Expected valid options');
    return options;
};
//# sourceMappingURL=api-validators.js.map