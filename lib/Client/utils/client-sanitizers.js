"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.username = exports.token = void 0;
var isEmpty_1 = __importDefault(require("lodash/isEmpty"));
var random_1 = __importDefault(require("lodash/random"));
var client_constants_1 = require("../client-constants");
exports.token = function (value) {
    if (value == null) {
        return 'TWITCHJS';
    }
    if (value.startsWith('oauth:')) {
        return value;
    }
    return "oauth:" + value;
};
exports.username = function (value) {
    if (isEmpty_1.default(value) || value === 'justinfan') {
        return "" + client_constants_1.ANONYMOUS_USERNAME + random_1.default(80000, 81000);
    }
    return value;
};
//# sourceMappingURL=client-sanitizers.js.map