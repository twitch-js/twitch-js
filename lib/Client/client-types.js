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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientEvents = exports.BaseClientEvents = void 0;
var twitch_1 = require("../twitch");
var BaseClientEvents;
(function (BaseClientEvents) {
    BaseClientEvents["RAW"] = "RAW";
    BaseClientEvents["ALL"] = "*";
    BaseClientEvents["CONNECTED"] = "CONNECTED";
    BaseClientEvents["DISCONNECTED"] = "DISCONNECTED";
    BaseClientEvents["RECONNECT"] = "RECONNECT";
    BaseClientEvents["AUTHENTICATED"] = "AUTHENTICATED";
    BaseClientEvents["AUTHENTICATION_FAILED"] = "AUTHENTICATION_FAILED";
    BaseClientEvents["ERROR_ENCOUNTERED"] = "ERROR_ENCOUNTERED";
})(BaseClientEvents = exports.BaseClientEvents || (exports.BaseClientEvents = {}));
exports.ClientEvents = __assign(__assign({}, twitch_1.Commands), BaseClientEvents);
//# sourceMappingURL=client-types.js.map