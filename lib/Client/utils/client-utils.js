"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticationFailedMessage = void 0;
var twitch_1 = require("../../twitch");
exports.isAuthenticationFailedMessage = function (message) {
    return typeof message !== 'undefined' &&
        message.command === twitch_1.Commands.NOTICE &&
        message.channel === '' &&
        message.message === 'Login authentication failed';
};
//# sourceMappingURL=client-utils.js.map