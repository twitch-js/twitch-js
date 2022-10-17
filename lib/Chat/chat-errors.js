"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = exports.JoinError = exports.ParseError = exports.ChatError = void 0;
var error_1 = require("../utils/error");
__exportStar(require("../utils/error"), exports);
var ChatError = /** @class */ (function (_super) {
    __extends(ChatError, _super);
    function ChatError(message, body) {
        var _this = _super.call(this, message) || this;
        _this.body = body;
        Object.defineProperty(_this, 'name', {
            value: 'TwitchJSChatError',
        });
        return _this;
    }
    return ChatError;
}(error_1.TwitchJSError));
exports.ChatError = ChatError;
var ParseError = /** @class */ (function (_super) {
    __extends(ParseError, _super);
    function ParseError(message, body) {
        var _this = _super.call(this, message) || this;
        _this.body = body;
        Object.defineProperty(_this, 'name', {
            value: 'TwitchJSChatParseError',
        });
        return _this;
    }
    return ParseError;
}(error_1.TwitchJSError));
exports.ParseError = ParseError;
var JoinError = /** @class */ (function (_super) {
    __extends(JoinError, _super);
    function JoinError(message, body) {
        var _this = _super.call(this, message) || this;
        _this.body = body;
        Object.defineProperty(_this, 'name', {
            value: 'TwitchJSChatJoinError',
        });
        return _this;
    }
    return JoinError;
}(error_1.TwitchJSError));
exports.JoinError = JoinError;
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError(message, body) {
        var _this = _super.call(this, message) || this;
        _this.body = body;
        Object.defineProperty(_this, 'name', {
            value: 'TwitchJSChatTimeoutError',
        });
        return _this;
    }
    return TimeoutError;
}(error_1.TwitchJSError));
exports.TimeoutError = TimeoutError;
//# sourceMappingURL=chat-errors.js.map