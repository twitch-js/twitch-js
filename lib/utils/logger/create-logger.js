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
var pino_1 = __importDefault(require("pino"));
var createLogger = function (options) {
    if (options === void 0) { options = {}; }
    var name = options.name, other = __rest(options, ["name"]);
    var scope = ['TwitchJS'].concat(name || []).join('/');
    var logger = pino_1.default(__assign({ name: scope, prettyPrint: true, level: 'info' }, other));
    var profile = function (startMessage) {
        var now = Date.now();
        if (startMessage) {
            logger.info(startMessage);
        }
        return {
            done: function (endMessage, error) {
                var elapsed = Date.now() - now;
                var message = endMessage + " (" + elapsed + "ms)";
                if (error) {
                    logger.error(message, error);
                }
                else {
                    logger.info(message);
                }
            },
        };
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    logger.profile = profile;
    return logger;
};
exports.default = createLogger;
//# sourceMappingURL=create-logger.js.map