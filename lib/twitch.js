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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberBadges = exports.BooleanBadges = exports.Events = exports.UserNoticeEvents = exports.KnownUserNoticeMessageIds = exports.PrivateMessageEvents = exports.NoticeEvents = exports.KnownNoticeMessageIdsUpperCase = exports.KnownNoticeMessageIds = exports.ChatCommands = exports.ChatEvents = exports.Commands = exports.BaseCommands = exports.OtherCommands = exports.TagCommands = exports.MembershipCommands = exports.Capabilities = void 0;
/**
 * @see https://dev.twitch.tv/docs/irc/guide#twitch-irc-capabilities
 */
var Capabilities;
(function (Capabilities) {
    Capabilities["tags"] = "twitch.tv/tags";
    Capabilities["commands"] = "twitch.tv/commands";
    Capabilities["membership"] = "twitch.tv/membership";
})(Capabilities = exports.Capabilities || (exports.Capabilities = {}));
/**
 * @see https://dev.twitch.tv/docs/irc/membership
 */
var MembershipCommands;
(function (MembershipCommands) {
    MembershipCommands["JOIN"] = "JOIN";
    MembershipCommands["MODE"] = "MODE";
    MembershipCommands["PART"] = "PART";
    MembershipCommands["NAMES"] = "353";
    MembershipCommands["NAMES_END"] = "366";
})(MembershipCommands = exports.MembershipCommands || (exports.MembershipCommands = {}));
/**
 * @see https://dev.twitch.tv/docs/irc/tags
 */
var TagCommands;
(function (TagCommands) {
    TagCommands["CLEAR_CHAT"] = "CLEARCHAT";
    TagCommands["GLOBALUSERSTATE"] = "GLOBALUSERSTATE";
    TagCommands["PRIVATE_MESSAGE"] = "PRIVMSG";
    TagCommands["ROOM_STATE"] = "ROOMSTATE";
    TagCommands["USER_NOTICE"] = "USERNOTICE";
    TagCommands["USER_STATE"] = "USERSTATE";
})(TagCommands = exports.TagCommands || (exports.TagCommands = {}));
var OtherCommands;
(function (OtherCommands) {
    OtherCommands["WELCOME"] = "001";
    OtherCommands["PING"] = "PING";
    OtherCommands["PONG"] = "PONG";
    OtherCommands["WHISPER"] = "WHISPER";
})(OtherCommands = exports.OtherCommands || (exports.OtherCommands = {}));
/**
 * @see https://dev.twitch.tv/docs/irc/commands
 */
var BaseCommands;
(function (BaseCommands) {
    BaseCommands["CLEAR_CHAT"] = "CLEARCHAT";
    BaseCommands["CLEAR_MESSAGE"] = "CLEARMSG";
    BaseCommands["HOST_TARGET"] = "HOSTTARGET";
    BaseCommands["NOTICE"] = "NOTICE";
    BaseCommands["RECONNECT"] = "RECONNECT";
    BaseCommands["ROOM_STATE"] = "ROOMSTATE";
    BaseCommands["USER_NOTICE"] = "USERNOTICE";
    BaseCommands["USER_STATE"] = "USERSTATE";
})(BaseCommands = exports.BaseCommands || (exports.BaseCommands = {}));
var Commands;
(function (Commands) {
    Commands["WELCOME"] = "001";
    Commands["PING"] = "PING";
    Commands["PONG"] = "PONG";
    Commands["RECONNECT"] = "RECONNECT";
    Commands["WHISPER"] = "PRIVMSG #jtv";
    Commands["JOIN"] = "JOIN";
    Commands["MODE"] = "MODE";
    Commands["PART"] = "PART";
    Commands["NAMES"] = "353";
    Commands["NAMES_END"] = "366";
    Commands["CLEAR_CHAT"] = "CLEARCHAT";
    Commands["CLEAR_MESSAGE"] = "CLEARMSG";
    Commands["GLOBALUSERSTATE"] = "GLOBALUSERSTATE";
    Commands["HOST_TARGET"] = "HOSTTARGET";
    Commands["NOTICE"] = "NOTICE";
    Commands["PRIVATE_MESSAGE"] = "PRIVMSG";
    Commands["ROOM_STATE"] = "ROOMSTATE";
    Commands["USER_NOTICE"] = "USERNOTICE";
    Commands["USER_STATE"] = "USERSTATE";
})(Commands = exports.Commands || (exports.Commands = {}));
var ChatEvents;
(function (ChatEvents) {
    ChatEvents["RAW"] = "RAW";
    ChatEvents["ALL"] = "*";
    ChatEvents["CONNECTED"] = "CONNECTED";
    ChatEvents["DISCONNECTED"] = "DISCONNECTED";
    ChatEvents["RECONNECT"] = "RECONNECT";
    ChatEvents["AUTHENTICATED"] = "AUTHENTICATED";
    ChatEvents["AUTHENTICATION_FAILED"] = "AUTHENTICATION_FAILED";
    ChatEvents["GLOBALUSERSTATE"] = "GLOBALUSERSTATE";
    ChatEvents["ERROR_ENCOUNTERED"] = "ERROR_ENCOUNTERED";
    ChatEvents["PARSE_ERROR_ENCOUNTERED"] = "PARSE_ERROR_ENCOUNTERED";
    ChatEvents["ANON_GIFT_PAID_UPGRADE"] = "ANON_GIFT_PAID_UPGRADE";
    ChatEvents["GIFT_PAID_UPGRADE"] = "GIFT_PAID_UPGRADE";
    ChatEvents["RAID"] = "RAID";
    ChatEvents["RESUBSCRIPTION"] = "RESUBSCRIPTION";
    ChatEvents["RITUAL"] = "RITUAL";
    ChatEvents["SUBSCRIPTION"] = "SUBSCRIPTION";
    ChatEvents["SUBSCRIPTION_GIFT"] = "SUBSCRIPTION_GIFT";
    ChatEvents["SUBSCRIPTION_GIFT_COMMUNITY"] = "SUBSCRIPTION_GIFT_COMMUNITY";
    ChatEvents["ROOM_MODS"] = "ROOM_MODS";
    ChatEvents["MOD_GAINED"] = "MOD_GAINED";
    ChatEvents["MOD_LOST"] = "MOD_LOST";
    ChatEvents["USER_BANNED"] = "USER_BANNED";
    ChatEvents["CHEER"] = "CHEER";
    ChatEvents["HOST_ON"] = "HOST_ON";
    ChatEvents["HOST_OFF"] = "HOST_OFF";
    ChatEvents["HOSTED"] = "HOSTED";
    ChatEvents["HOSTED_WITHOUT_VIEWERS"] = "HOSTED/WITHOUT_VIEWERS";
    ChatEvents["HOSTED_WITH_VIEWERS"] = "HOSTED/WITH_VIEWERS";
    ChatEvents["HOSTED_AUTO"] = "HOSTED/AUTO";
})(ChatEvents = exports.ChatEvents || (exports.ChatEvents = {}));
/**
 * @see https://help.twitch.tv/customer/en/portal/articles/659095-chat-moderation-commands
 */
var ChatCommands;
(function (ChatCommands) {
    ChatCommands["BAN"] = "ban";
    ChatCommands["BLOCK"] = "block";
    ChatCommands["CLEAR"] = "clear";
    ChatCommands["COLOR"] = "color";
    ChatCommands["COMMERCIAL"] = "commercial";
    // DISCONNECTED = 'disconnect',
    ChatCommands["DELETE"] = "delete";
    ChatCommands["EMOTE_ONLY"] = "emoteonly";
    ChatCommands["EMOTE_ONLY_OFF"] = "emoteonlyoff";
    ChatCommands["FOLLOWERS_ONLY"] = "followers";
    ChatCommands["FOLLOWERS_ONLY_OFF"] = "followersoff";
    ChatCommands["HELP"] = "help";
    ChatCommands["HOST"] = "host";
    ChatCommands["MARKER"] = "marker";
    ChatCommands["ME"] = "me";
    ChatCommands["MOD"] = "mod";
    ChatCommands["MODS"] = "mods";
    // PART = 'part',
    ChatCommands["R9K"] = "r9kbeta";
    ChatCommands["R9K_OFF"] = "r9kbetaoff";
    ChatCommands["RAID"] = "raid";
    ChatCommands["SLOW"] = "slow";
    ChatCommands["SLOW_OFF"] = "slowoff";
    ChatCommands["SUBSCRIBERS"] = "subscribers";
    ChatCommands["SUBSCRIBERS_OFF"] = "subscribersoff";
    ChatCommands["TIMEOUT"] = "timeout";
    ChatCommands["UNBAN"] = "unban";
    ChatCommands["UNBLOCK"] = "unblock";
    ChatCommands["UNHOST"] = "unhost";
    ChatCommands["UNMOD"] = "unmod";
    ChatCommands["UNRAID"] = "unraid";
    ChatCommands["UNVIP"] = "unvip";
    ChatCommands["VIP"] = "vip";
    ChatCommands["VIPS"] = "vips";
    ChatCommands["WHISPER"] = "w";
})(ChatCommands = exports.ChatCommands || (exports.ChatCommands = {}));
var KnownNoticeMessageIds;
(function (KnownNoticeMessageIds) {
    KnownNoticeMessageIds["ALREADY_BANNED"] = "already_banned";
    KnownNoticeMessageIds["ALREADY_EMOTE_ONLY_OFF"] = "already_emote_only_off";
    KnownNoticeMessageIds["ALREADY_EMOTE_ONLY_ON"] = "already_emote_only_on";
    KnownNoticeMessageIds["ALREADY_R9K_OFF"] = "already_r9k_off";
    KnownNoticeMessageIds["ALREADY_R9K_ON"] = "already_r9k_on";
    KnownNoticeMessageIds["ALREADY_SUBS_OFF"] = "already_subs_off";
    KnownNoticeMessageIds["ALREADY_SUBS_ON"] = "already_subs_on";
    KnownNoticeMessageIds["BAD_HOST_HOSTING"] = "bad_host_hosting";
    KnownNoticeMessageIds["BAD_MOD_MOD"] = "bad_mod_mod";
    KnownNoticeMessageIds["BAN_SUCCESS"] = "ban_success";
    KnownNoticeMessageIds["BAD_UNBAN_NO_BAN"] = "bad_unban_no_ban";
    KnownNoticeMessageIds["COLOR_CHANGED"] = "color_changed";
    KnownNoticeMessageIds["CMDS_AVAILABLE"] = "cmds_available";
    KnownNoticeMessageIds["COMMERCIAL_SUCCESS"] = "commercial_success";
    KnownNoticeMessageIds["EMOTE_ONLY_OFF"] = "emote_only_off";
    KnownNoticeMessageIds["EMOTE_ONLY_ON"] = "emote_only_on";
    KnownNoticeMessageIds["FOLLOWERS_OFF"] = "followers_off";
    KnownNoticeMessageIds["FOLLOWERS_ON"] = "followers_on";
    KnownNoticeMessageIds["FOLLOWERS_ONZERO"] = "followers_onzero";
    KnownNoticeMessageIds["HOST_OFF"] = "host_off";
    KnownNoticeMessageIds["HOST_ON"] = "host_on";
    KnownNoticeMessageIds["HOSTS_REMAINING"] = "hosts_remaining";
    KnownNoticeMessageIds["MSG_CHANNEL_SUSPENDED"] = "msg_channel_suspended";
    KnownNoticeMessageIds["MOD_SUCCESS"] = "mod_success";
    KnownNoticeMessageIds["NOT_HOSTING"] = "not_hosting";
    KnownNoticeMessageIds["R9K_OFF"] = "r9k_off";
    KnownNoticeMessageIds["R9K_ON"] = "r9k_on";
    KnownNoticeMessageIds["ROOM_MODS"] = "room_mods";
    KnownNoticeMessageIds["SLOW_OFF"] = "slow_off";
    KnownNoticeMessageIds["SLOW_ON"] = "slow_on";
    KnownNoticeMessageIds["SUBS_OFF"] = "subs_off";
    KnownNoticeMessageIds["SUBS_ON"] = "subs_on";
    KnownNoticeMessageIds["TIMEOUT_SUCCESS"] = "timeout_success";
    KnownNoticeMessageIds["UNBAN_SUCCESS"] = "unban_success";
    KnownNoticeMessageIds["UNMOD_SUCCESS"] = "unmod_success";
    KnownNoticeMessageIds["UNRAID_SUCCESS"] = "unraid_success";
    KnownNoticeMessageIds["UNRECOGNIZED_CMD"] = "unrecognized_cmd";
})(KnownNoticeMessageIds = exports.KnownNoticeMessageIds || (exports.KnownNoticeMessageIds = {}));
exports.KnownNoticeMessageIdsUpperCase = Object.entries(KnownNoticeMessageIds).reduce(function (uppercase, _a) {
    var _b;
    var _c = __read(_a, 2), key = _c[0], value = _c[1];
    return (__assign(__assign({}, uppercase), (_b = {}, _b[key] = value.toUpperCase(), _b)));
}, {});
exports.NoticeEvents = Object.keys(KnownNoticeMessageIds).reduce(function (events, event) {
    var _a;
    return (__assign(__assign({}, events), (_a = {}, _a[event] = event, _a[Commands.NOTICE + "/" + event.toUpperCase()] = event, _a)));
}, {});
var PrivateMessageEvents;
(function (PrivateMessageEvents) {
    PrivateMessageEvents["CHEER"] = "CHEER";
    PrivateMessageEvents["HOSTED_WITHOUT_VIEWERS"] = "HOSTED_WITHOUT_VIEWERS";
    PrivateMessageEvents["HOSTED_WITH_VIEWERS"] = "HOSTED_WITH_VIEWERS";
    PrivateMessageEvents["HOSTED_AUTO"] = "HOSTED_AUTO";
})(PrivateMessageEvents = exports.PrivateMessageEvents || (exports.PrivateMessageEvents = {}));
/**
 * @see https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags
 */
var KnownUserNoticeMessageIds;
(function (KnownUserNoticeMessageIds) {
    KnownUserNoticeMessageIds["ANON_GIFT_PAID_UPGRADE"] = "anongiftpaidupgrade";
    KnownUserNoticeMessageIds["GIFT_PAID_UPGRADE"] = "giftpaidupgrade";
    KnownUserNoticeMessageIds["RAID"] = "raid";
    KnownUserNoticeMessageIds["RESUBSCRIPTION"] = "resub";
    KnownUserNoticeMessageIds["RITUAL"] = "ritual";
    KnownUserNoticeMessageIds["SUBSCRIPTION"] = "sub";
    KnownUserNoticeMessageIds["SUBSCRIPTION_GIFT"] = "subgift";
    KnownUserNoticeMessageIds["SUBSCRIPTION_GIFT_COMMUNITY"] = "submysterygift";
})(KnownUserNoticeMessageIds = exports.KnownUserNoticeMessageIds || (exports.KnownUserNoticeMessageIds = {}));
exports.UserNoticeEvents = Object.keys(KnownUserNoticeMessageIds).reduce(function (events, event) {
    var _a;
    return (__assign(__assign({}, events), (_a = {}, _a[event] = event, _a[Commands.USER_NOTICE + "/" + event] = event, _a)));
}, {});
exports.Events = __assign(__assign(__assign(__assign(__assign(__assign(__assign(__assign({}, MembershipCommands), TagCommands), OtherCommands), BaseCommands), ChatEvents), exports.NoticeEvents), PrivateMessageEvents), exports.UserNoticeEvents);
var BooleanBadges;
(function (BooleanBadges) {
    BooleanBadges[BooleanBadges["admin"] = 0] = "admin";
    BooleanBadges[BooleanBadges["broadcaster"] = 1] = "broadcaster";
    BooleanBadges[BooleanBadges["globalMod"] = 2] = "globalMod";
    BooleanBadges[BooleanBadges["moderator"] = 3] = "moderator";
    BooleanBadges[BooleanBadges["partner"] = 4] = "partner";
    BooleanBadges[BooleanBadges["premium"] = 5] = "premium";
    BooleanBadges[BooleanBadges["staff"] = 6] = "staff";
    BooleanBadges[BooleanBadges["subGifter"] = 7] = "subGifter";
    BooleanBadges[BooleanBadges["turbo"] = 8] = "turbo";
    BooleanBadges[BooleanBadges["vip"] = 9] = "vip";
})(BooleanBadges = exports.BooleanBadges || (exports.BooleanBadges = {}));
var NumberBadges;
(function (NumberBadges) {
    NumberBadges[NumberBadges["bits"] = 0] = "bits";
    NumberBadges[NumberBadges["bitsLeader"] = 1] = "bitsLeader";
    NumberBadges[NumberBadges["subscriber"] = 2] = "subscriber";
})(NumberBadges = exports.NumberBadges || (exports.NumberBadges = {}));
//# sourceMappingURL=twitch.js.map