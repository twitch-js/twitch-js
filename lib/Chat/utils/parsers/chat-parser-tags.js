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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userNotice = exports.privateMessage = exports.globalUserState = exports.userState = exports.userNoticeMessageParameters = exports.roomState = exports.privateMessageCheerEvent = exports.clearChat = void 0;
var camelCase_1 = __importDefault(require("lodash/camelCase"));
var gt_1 = __importDefault(require("lodash/gt"));
var toLower_1 = __importDefault(require("lodash/toLower"));
var twitch_1 = require("../../../twitch");
var constants = __importStar(require("../../chat-constants"));
var helpers = __importStar(require("./chat-parser-helpers"));
exports.clearChat = function (tags) { return (__assign(__assign({}, tags), { banReason: helpers.generalString(tags.banReason), banDuration: helpers.generalNumber(tags.banDuration) })); };
exports.privateMessageCheerEvent = function (tags) {
    return gt_1.default(tags.bits, 0)
        ? { event: twitch_1.ChatEvents.CHEER, bits: parseInt(tags.bits, 10) }
        : { event: twitch_1.Commands.PRIVATE_MESSAGE };
};
exports.roomState = function (roomStateTags) {
    return Object.entries(roomStateTags).reduce(function (tags, _a) {
        var _b, _c, _d, _e, _f;
        var _g = __read(_a, 2), tag = _g[0], value = _g[1];
        switch (tag) {
            case 'followersOnly':
                return __assign(__assign({}, tags), (_b = {}, _b[tag] = helpers.followersOnly(value), _b));
            // Strings
            case 'broadcasterLang':
                return __assign(__assign({}, tags), (_c = {}, _c[tag] = helpers.generalString(value), _c));
            // Numbers
            case 'slow':
                return __assign(__assign({}, tags), (_d = {}, _d[tag] = helpers.generalNumber(value), _d));
            // Booleans
            case 'emoteOnly':
            case 'r9k':
            case 'subsOnly':
                return __assign(__assign({}, tags), (_e = {}, _e[tag] = helpers.generalBoolean(value), _e));
            default:
                return __assign(__assign({}, tags), (_f = {}, _f[tag] = value, _f));
        }
    }, {});
};
exports.userNoticeMessageParameters = function (tags) {
    return Object.entries(tags).reduce(function (parameters, _a) {
        var _b, _c;
        var _d = __read(_a, 2), tag = _d[0], value = _d[1];
        var _e = __read(constants.MESSAGE_PARAMETER_PREFIX_RE.exec(tag) || [], 2), param = _e[1];
        switch (param) {
            // Numbers.
            case 'Months':
            case 'MassGiftCount':
            case 'PromoGiftTotal':
            case 'SenderCount':
            case 'ViewerCount':
                return __assign(__assign({}, parameters), (_b = {}, _b[camelCase_1.default(param)] = helpers.generalNumber(value), _b));
            // Not a msgParam.
            case undefined:
                return parameters;
            // Strings
            default:
                return __assign(__assign({}, parameters), (_c = {}, _c[camelCase_1.default(param)] = helpers.generalString(value), _c));
        }
    }, {});
};
exports.userState = function (tags) { return (__assign(__assign({}, tags), { badges: helpers.badges(tags.badges), bits: helpers.generalNumber(tags.bits), color: tags.color, displayName: tags.displayName, emotes: helpers.emotes(tags.emotes), emoteSets: helpers.emoteSets(tags.emoteSets), userType: helpers.userType(tags.userType), username: tags.displayName ? toLower_1.default(tags.displayName) : tags.username, isModerator: tags.mod === '1' })); };
exports.globalUserState = function (tags) { return (__assign(__assign({}, tags), exports.userState(tags))); };
exports.privateMessage = exports.userState;
exports.userNotice = exports.userState;
//# sourceMappingURL=chat-parser-tags.js.map