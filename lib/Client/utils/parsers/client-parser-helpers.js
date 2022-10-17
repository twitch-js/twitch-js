"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.username = exports.generalTimestamp = void 0;
var toLower_1 = __importDefault(require("lodash/toLower"));
exports.generalTimestamp = function (maybeTimestamp) {
    var timestamp = new Date(parseInt(maybeTimestamp, 10));
    return timestamp.toString() !== 'Invalid Date' ? timestamp : new Date();
};
exports.username = function () {
    var maybeUsernames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        maybeUsernames[_i] = arguments[_i];
    }
    return maybeUsernames.reduce(function (maybeUsername, name) {
        if (typeof name !== 'string') {
            return maybeUsername;
        }
        if (name === 'tmi.twitch.tv') {
            return 'tmi.twitch.tv';
        }
        return toLower_1.default(name).split('.')[0];
    }, undefined);
};
//# sourceMappingURL=client-parser-helpers.js.map