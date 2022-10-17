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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = exports.TwitchJSError = void 0;
var ts_custom_error_1 = require("ts-custom-error");
var TwitchJSError = /** @class */ (function (_super) {
    __extends(TwitchJSError, _super);
    function TwitchJSError(message) {
        var _this = _super.call(this, message) || this;
        _this.timestamp = new Date();
        Object.defineProperty(_this, 'name', { value: 'TwitchJSError' });
        return _this;
    }
    return TwitchJSError;
}(ts_custom_error_1.CustomError));
exports.TwitchJSError = TwitchJSError;
var AuthenticationError = /** @class */ (function (_super) {
    __extends(AuthenticationError, _super);
    function AuthenticationError(message, body) {
        var _this = _super.call(this, message) || this;
        _this.body = body;
        Object.defineProperty(_this, 'name', {
            value: 'TwitchJSAuthenticationError',
        });
        return _this;
    }
    return AuthenticationError;
}(TwitchJSError));
exports.AuthenticationError = AuthenticationError;
//# sourceMappingURL=error.js.map