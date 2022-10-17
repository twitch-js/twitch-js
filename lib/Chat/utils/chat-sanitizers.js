"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.username = exports.token = exports.channel = void 0;
var isEmpty_1 = __importDefault(require("lodash/isEmpty"));
var random_1 = __importDefault(require("lodash/random"));
var chat_constants_1 = require("../chat-constants");
exports.channel = function (value) {
    if (typeof value !== 'string' || value.length === 0) {
        return '';
    }
    value = value.toLowerCase();
    if (!value.startsWith('#')) {
        return "#" + value;
    }
    return value;
};
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
        return "" + chat_constants_1.ANONYMOUS_USERNAME + random_1.default(80000, 81000);
    }
    return value;
};
//# sourceMappingURL=chat-sanitizers.js.map