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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserAnonymous = exports.getEventNameFromMessage = exports.isAuthenticationFailedMessage = void 0;
var twitch_1 = require("../../twitch");
var constants = __importStar(require("../chat-constants"));
exports.isAuthenticationFailedMessage = function (message) {
    return typeof message !== 'undefined' &&
        message.command === twitch_1.Commands.NOTICE &&
        message.channel === '' &&
        message.message === 'Login authentication failed';
};
exports.getEventNameFromMessage = function (message) {
    return typeof message !== 'undefined' ? message.command || message.event : twitch_1.Events.ALL;
};
exports.isUserAnonymous = function (value) {
    return constants.ANONYMOUS_USERNAME_RE.test(value);
};
//# sourceMappingURL=chat-utils.js.map