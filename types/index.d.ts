import EventEmitter from "eventemitter3";
import { CancelablePromise } from "p-event";
import { LoggerOptions as PinoLoggerOptions } from "pino";
type DistributeKeys<T> = {
    [P in keyof T]: P;
};
/**
 * Validate response
 * @see https://dev.twitch.tv/docs/authentication#validating-requests
 */
type ApiValidateResponse = {
    client_id: string;
    login: string;
    scopes: string[];
    user_id: string;
    expires_in: number;
};
/**
 * @see https://dev.twitch.tv/docs/irc/guide#twitch-irc-capabilities
 */
declare enum Capabilities {
    "tags" = "twitch.tv/tags",
    "commands" = "twitch.tv/commands",
    "membership" = "twitch.tv/membership"
}
/**
 * @see https://dev.twitch.tv/docs/irc/membership
 */
declare enum MembershipCommands {
    JOIN = "JOIN",
    MODE = "MODE",
    PART = "PART",
    NAMES = "353",
    NAMES_END = "366"
}
/**
 * @see https://dev.twitch.tv/docs/irc/tags
 */
declare enum TagCommands {
    CLEAR_CHAT = "CLEARCHAT",
    GLOBALUSERSTATE = "GLOBALUSERSTATE",
    PRIVATE_MESSAGE = "PRIVMSG",
    ROOM_STATE = "ROOMSTATE",
    USER_NOTICE = "USERNOTICE",
    USER_STATE = "USERSTATE"
}
declare enum OtherCommands {
    WELCOME = "001",
    PING = "PING",
    PONG = "PONG",
    WHISPER = "WHISPER"
}
/**
 * @see https://dev.twitch.tv/docs/irc/commands
 */
declare enum BaseCommands {
    CLEAR_CHAT = "CLEARCHAT",
    CLEAR_MESSAGE = "CLEARMSG",
    HOST_TARGET = "HOSTTARGET",
    NOTICE = "NOTICE",
    RECONNECT = "RECONNECT",
    ROOM_STATE = "ROOMSTATE",
    USER_NOTICE = "USERNOTICE",
    USER_STATE = "USERSTATE"
}
declare enum Commands {
    WELCOME = "001",
    PING = "PING",
    PONG = "PONG",
    RECONNECT = "RECONNECT",
    WHISPER = "PRIVMSG #jtv",
    JOIN = "JOIN",
    MODE = "MODE",
    PART = "PART",
    NAMES = "353",
    NAMES_END = "366",
    CLEAR_CHAT = "CLEARCHAT",
    CLEAR_MESSAGE = "CLEARMSG",
    GLOBALUSERSTATE = "GLOBALUSERSTATE",
    HOST_TARGET = "HOSTTARGET",
    NOTICE = "NOTICE",
    PRIVATE_MESSAGE = "PRIVMSG",
    ROOM_STATE = "ROOMSTATE",
    USER_NOTICE = "USERNOTICE",
    USER_STATE = "USERSTATE"
}
declare enum ChatEvents {
    RAW = "RAW",
    ALL = "*",
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
    RECONNECT = "RECONNECT",
    AUTHENTICATED = "AUTHENTICATED",
    AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
    GLOBALUSERSTATE = "GLOBALUSERSTATE",
    ERROR_ENCOUNTERED = "ERROR_ENCOUNTERED",
    PARSE_ERROR_ENCOUNTERED = "PARSE_ERROR_ENCOUNTERED",
    ANON_GIFT_PAID_UPGRADE = "ANON_GIFT_PAID_UPGRADE",
    GIFT_PAID_UPGRADE = "GIFT_PAID_UPGRADE",
    RAID = "RAID",
    RESUBSCRIPTION = "RESUBSCRIPTION",
    RITUAL = "RITUAL",
    SUBSCRIPTION = "SUBSCRIPTION",
    SUBSCRIPTION_GIFT = "SUBSCRIPTION_GIFT",
    SUBSCRIPTION_GIFT_COMMUNITY = "SUBSCRIPTION_GIFT_COMMUNITY",
    ROOM_MODS = "ROOM_MODS",
    MOD_GAINED = "MOD_GAINED",
    MOD_LOST = "MOD_LOST",
    USER_BANNED = "USER_BANNED",
    CHEER = "CHEER",
    HOST_ON = "HOST_ON",
    HOST_OFF = "HOST_OFF",
    HOSTED = "HOSTED",
    HOSTED_WITHOUT_VIEWERS = "HOSTED/WITHOUT_VIEWERS",
    HOSTED_WITH_VIEWERS = "HOSTED/WITH_VIEWERS",
    HOSTED_AUTO = "HOSTED/AUTO"
}
/**
 * @see https://help.twitch.tv/customer/en/portal/articles/659095-chat-moderation-commands
 */
declare enum ChatCommands {
    BAN = "ban",
    BLOCK = "block",
    CLEAR = "clear",
    COLOR = "color",
    COMMERCIAL = "commercial",
    // DISCONNECTED = 'disconnect',
    DELETE = "delete",
    EMOTE_ONLY = "emoteonly",
    EMOTE_ONLY_OFF = "emoteonlyoff",
    FOLLOWERS_ONLY = "followers",
    FOLLOWERS_ONLY_OFF = "followersoff",
    HELP = "help",
    HOST = "host",
    MARKER = "marker",
    ME = "me",
    MOD = "mod",
    MODS = "mods",
    // PART = 'part',
    R9K = "r9kbeta",
    R9K_OFF = "r9kbetaoff",
    RAID = "raid",
    SLOW = "slow",
    SLOW_OFF = "slowoff",
    SUBSCRIBERS = "subscribers",
    SUBSCRIBERS_OFF = "subscribersoff",
    TIMEOUT = "timeout",
    UNBAN = "unban",
    UNBLOCK = "unblock",
    UNHOST = "unhost",
    UNMOD = "unmod",
    UNRAID = "unraid",
    UNVIP = "unvip",
    VIP = "vip",
    VIPS = "vips",
    WHISPER = "w"
}
declare enum KnownNoticeMessageIds {
    ALREADY_BANNED = "already_banned",
    ALREADY_EMOTE_ONLY_OFF = "already_emote_only_off",
    ALREADY_EMOTE_ONLY_ON = "already_emote_only_on",
    ALREADY_R9K_OFF = "already_r9k_off",
    ALREADY_R9K_ON = "already_r9k_on",
    ALREADY_SUBS_OFF = "already_subs_off",
    ALREADY_SUBS_ON = "already_subs_on",
    BAD_HOST_HOSTING = "bad_host_hosting",
    BAD_MOD_MOD = "bad_mod_mod",
    BAN_SUCCESS = "ban_success",
    BAD_UNBAN_NO_BAN = "bad_unban_no_ban",
    COLOR_CHANGED = "color_changed",
    CMDS_AVAILABLE = "cmds_available",
    COMMERCIAL_SUCCESS = "commercial_success",
    EMOTE_ONLY_OFF = "emote_only_off",
    EMOTE_ONLY_ON = "emote_only_on",
    FOLLOWERS_OFF = "followers_off",
    FOLLOWERS_ON = "followers_on",
    FOLLOWERS_ONZERO = "followers_onzero",
    HOST_OFF = "host_off",
    HOST_ON = "host_on",
    HOSTS_REMAINING = "hosts_remaining",
    MSG_CHANNEL_SUSPENDED = "msg_channel_suspended",
    MOD_SUCCESS = "mod_success",
    NOT_HOSTING = "not_hosting",
    R9K_OFF = "r9k_off",
    R9K_ON = "r9k_on",
    ROOM_MODS = "room_mods",
    SLOW_OFF = "slow_off",
    SLOW_ON = "slow_on",
    SUBS_OFF = "subs_off",
    SUBS_ON = "subs_on",
    TIMEOUT_SUCCESS = "timeout_success",
    UNBAN_SUCCESS = "unban_success",
    UNMOD_SUCCESS = "unmod_success",
    UNRAID_SUCCESS = "unraid_success",
    UNRECOGNIZED_CMD = "unrecognized_cmd"
}
declare const KnownNoticeMessageIdsUpperCase: Record<"ALREADY_BANNED" | "ALREADY_EMOTE_ONLY_OFF" | "ALREADY_EMOTE_ONLY_ON" | "ALREADY_R9K_OFF" | "ALREADY_R9K_ON" | "ALREADY_SUBS_OFF" | "ALREADY_SUBS_ON" | "BAD_HOST_HOSTING" | "BAD_MOD_MOD" | "BAN_SUCCESS" | "BAD_UNBAN_NO_BAN" | "COLOR_CHANGED" | "CMDS_AVAILABLE" | "COMMERCIAL_SUCCESS" | "EMOTE_ONLY_OFF" | "EMOTE_ONLY_ON" | "FOLLOWERS_OFF" | "FOLLOWERS_ON" | "FOLLOWERS_ONZERO" | "HOST_OFF" | "HOST_ON" | "HOSTS_REMAINING" | "MSG_CHANNEL_SUSPENDED" | "MOD_SUCCESS" | "NOT_HOSTING" | "R9K_OFF" | "R9K_ON" | "ROOM_MODS" | "SLOW_OFF" | "SLOW_ON" | "SUBS_OFF" | "SUBS_ON" | "TIMEOUT_SUCCESS" | "UNBAN_SUCCESS" | "UNMOD_SUCCESS" | "UNRAID_SUCCESS" | "UNRECOGNIZED_CMD", string>;
declare const NoticeEvents: DistributeKeys<typeof KnownNoticeMessageIds>;
type NoticeEvents = keyof typeof NoticeEvents;
declare enum PrivateMessageEvents {
    CHEER = "CHEER",
    HOSTED_WITHOUT_VIEWERS = "HOSTED_WITHOUT_VIEWERS",
    HOSTED_WITH_VIEWERS = "HOSTED_WITH_VIEWERS",
    HOSTED_AUTO = "HOSTED_AUTO"
}
/**
 * @see https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags
 */
declare enum KnownUserNoticeMessageIds {
    ANON_GIFT_PAID_UPGRADE = "anongiftpaidupgrade",
    GIFT_PAID_UPGRADE = "giftpaidupgrade",
    RAID = "raid",
    RESUBSCRIPTION = "resub",
    RITUAL = "ritual",
    SUBSCRIPTION = "sub",
    SUBSCRIPTION_GIFT = "subgift",
    SUBSCRIPTION_GIFT_COMMUNITY = "submysterygift"
}
declare const UserNoticeEvents: DistributeKeys<typeof KnownUserNoticeMessageIds>;
type UserNoticeEvents = keyof typeof UserNoticeEvents;
declare const Events: {
    ANON_GIFT_PAID_UPGRADE: "ANON_GIFT_PAID_UPGRADE";
    GIFT_PAID_UPGRADE: "GIFT_PAID_UPGRADE";
    RAID: "RAID";
    RESUBSCRIPTION: "RESUBSCRIPTION";
    RITUAL: "RITUAL";
    SUBSCRIPTION: "SUBSCRIPTION";
    SUBSCRIPTION_GIFT: "SUBSCRIPTION_GIFT";
    SUBSCRIPTION_GIFT_COMMUNITY: "SUBSCRIPTION_GIFT_COMMUNITY";
    CHEER: PrivateMessageEvents.CHEER;
    HOSTED_WITHOUT_VIEWERS: PrivateMessageEvents.HOSTED_WITHOUT_VIEWERS;
    HOSTED_WITH_VIEWERS: PrivateMessageEvents.HOSTED_WITH_VIEWERS;
    HOSTED_AUTO: PrivateMessageEvents.HOSTED_AUTO;
    ALREADY_BANNED: "ALREADY_BANNED";
    ALREADY_EMOTE_ONLY_OFF: "ALREADY_EMOTE_ONLY_OFF";
    ALREADY_EMOTE_ONLY_ON: "ALREADY_EMOTE_ONLY_ON";
    ALREADY_R9K_OFF: "ALREADY_R9K_OFF";
    ALREADY_R9K_ON: "ALREADY_R9K_ON";
    ALREADY_SUBS_OFF: "ALREADY_SUBS_OFF";
    ALREADY_SUBS_ON: "ALREADY_SUBS_ON";
    BAD_HOST_HOSTING: "BAD_HOST_HOSTING";
    BAD_MOD_MOD: "BAD_MOD_MOD";
    BAN_SUCCESS: "BAN_SUCCESS";
    BAD_UNBAN_NO_BAN: "BAD_UNBAN_NO_BAN";
    COLOR_CHANGED: "COLOR_CHANGED";
    CMDS_AVAILABLE: "CMDS_AVAILABLE";
    COMMERCIAL_SUCCESS: "COMMERCIAL_SUCCESS";
    EMOTE_ONLY_OFF: "EMOTE_ONLY_OFF";
    EMOTE_ONLY_ON: "EMOTE_ONLY_ON";
    FOLLOWERS_OFF: "FOLLOWERS_OFF";
    FOLLOWERS_ON: "FOLLOWERS_ON";
    FOLLOWERS_ONZERO: "FOLLOWERS_ONZERO";
    HOST_OFF: "HOST_OFF";
    HOST_ON: "HOST_ON";
    HOSTS_REMAINING: "HOSTS_REMAINING";
    MSG_CHANNEL_SUSPENDED: "MSG_CHANNEL_SUSPENDED";
    MOD_SUCCESS: "MOD_SUCCESS";
    NOT_HOSTING: "NOT_HOSTING";
    R9K_OFF: "R9K_OFF";
    R9K_ON: "R9K_ON";
    ROOM_MODS: "ROOM_MODS";
    SLOW_OFF: "SLOW_OFF";
    SLOW_ON: "SLOW_ON";
    SUBS_OFF: "SUBS_OFF";
    SUBS_ON: "SUBS_ON";
    TIMEOUT_SUCCESS: "TIMEOUT_SUCCESS";
    UNBAN_SUCCESS: "UNBAN_SUCCESS";
    UNMOD_SUCCESS: "UNMOD_SUCCESS";
    UNRAID_SUCCESS: "UNRAID_SUCCESS";
    UNRECOGNIZED_CMD: "UNRECOGNIZED_CMD";
    RAW: ChatEvents.RAW;
    ALL: ChatEvents.ALL;
    CONNECTED: ChatEvents.CONNECTED;
    DISCONNECTED: ChatEvents.DISCONNECTED;
    RECONNECT: ChatEvents.RECONNECT;
    AUTHENTICATED: ChatEvents.AUTHENTICATED;
    AUTHENTICATION_FAILED: ChatEvents.AUTHENTICATION_FAILED;
    GLOBALUSERSTATE: ChatEvents.GLOBALUSERSTATE;
    ERROR_ENCOUNTERED: ChatEvents.ERROR_ENCOUNTERED;
    PARSE_ERROR_ENCOUNTERED: ChatEvents.PARSE_ERROR_ENCOUNTERED;
    MOD_GAINED: ChatEvents.MOD_GAINED;
    MOD_LOST: ChatEvents.MOD_LOST;
    USER_BANNED: ChatEvents.USER_BANNED;
    HOSTED: ChatEvents.HOSTED;
    CLEAR_CHAT: BaseCommands.CLEAR_CHAT;
    CLEAR_MESSAGE: BaseCommands.CLEAR_MESSAGE;
    HOST_TARGET: BaseCommands.HOST_TARGET;
    NOTICE: BaseCommands.NOTICE;
    ROOM_STATE: BaseCommands.ROOM_STATE;
    USER_NOTICE: BaseCommands.USER_NOTICE;
    USER_STATE: BaseCommands.USER_STATE;
    WELCOME: OtherCommands.WELCOME;
    PING: OtherCommands.PING;
    PONG: OtherCommands.PONG;
    WHISPER: OtherCommands.WHISPER;
    PRIVATE_MESSAGE: TagCommands.PRIVATE_MESSAGE;
    JOIN: MembershipCommands.JOIN;
    MODE: MembershipCommands.MODE;
    PART: MembershipCommands.PART;
    NAMES: MembershipCommands.NAMES;
    NAMES_END: MembershipCommands.NAMES_END;
};
type Events = keyof DistributeKeys<typeof Events>;
declare enum BooleanBadges {
    "admin" = 0,
    "broadcaster" = 1,
    "globalMod" = 2,
    "moderator" = 3,
    "partner" = 4,
    "premium" = 5,
    "staff" = 6,
    "subGifter" = 7,
    "turbo" = 8,
    "vip" = 9
}
declare enum NumberBadges {
    "bits" = 0,
    "bitsLeader" = 1,
    "subscriber" = 2
}
type Badges = {
    // Booleans
    admin: boolean;
    broadcaster: boolean;
    globalMod: boolean;
    moderator: boolean;
    partner: boolean;
    premium: boolean;
    staff: boolean;
    subGifter: boolean;
    turbo: boolean;
    vip: boolean;
    // Numbers
    bits: number;
    bitsLeader: number;
    subscriber: number;
} | {
    [key: string]: string;
};
type EmoteTag = {
    id: string;
    start: number;
    end: number;
};
/**
 * Tags
 */
interface BaseTags {
    [key: string]: any;
}
/**
 * CLEARCHAT tags
 * @see https://dev.twitch.tv/docs/irc/tags#clearchat-twitch-tags
 */
interface ClearChatTags extends BaseTags {
    banReason?: string;
    banDuration?: number;
}
/**
 * CLEARMSG tags
 * @see https://dev.twitch.tv/docs/irc/tags#clearmsg-twitch-tags
 */
interface ClearMessageTags extends BaseTags {
    login: string;
    targetMsgId: string;
}
/**
 * GLOBALUSERSTATE tags
 * @see https://dev.twitch.tv/docs/irc/tags#globaluserstate-twitch-tags
 */
interface GlobalUserStateTags extends BaseTags {
    emoteSets: string[];
    userType?: string;
    username: string;
}
/**
 * ROOMSTATE Tag
 * @see https://dev.twitch.tv/docs/irc/tags#roomstate-twitch-tags
 */
interface RoomStateTags extends BaseTags {
    followersOnly?: number | boolean;
    broadcasterLang?: string;
    slow?: number;
    emoteOnly?: boolean;
    r9k?: boolean;
    subsOnly?: boolean;
}
interface NoticeTags extends BaseTags {
    msgId: KnownNoticeMessageIds;
}
/**
 * USERSTATE tags
 * @see https://dev.twitch.tv/docs/irc/tags#userstate-twitch-tags
 */
interface UserStateTags extends BaseTags {
    badges: Partial<Badges>;
    color: string;
    displayName: string;
    emotes: EmoteTag[];
    emoteSets: string[];
    mod?: string;
    subscriber?: string;
    turbo?: string;
    userType?: string;
    username: string;
    isModerator: boolean;
}
/**
 * PRIVMSG tags
 * @see https://dev.twitch.tv/docs/irc/tags#privmsg-twitch-tags
 */
interface PrivateMessageTags extends UserStateTags {
    bits?: string;
}
/**
 * USERNOTICE tags
 * @see https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags
 */
interface UserNoticeTags extends UserStateTags {
    id: string;
    login: string;
    msgId: KnownUserNoticeMessageIds;
    roomId: string;
    systemMsg: string;
    tmiSentTs: string;
}
type Tags = ClearChatTags | GlobalUserStateTags | RoomStateTags | UserStateTags | PrivateMessageTags | NoticeTags | UserNoticeTags;
/**
 * Messages
 */
/* Base message parsed from Twitch */
interface Message {
    _raw: string;
    timestamp: Date;
    channel: string;
    username: string;
    command: string;
    event: string;
    isSelf: boolean;
    message: string;
    tags: {
        [key: string]: any;
    };
    parameters?: {
        [key: string]: string | number | boolean;
    };
}
interface BaseMessage extends Message {
    _raw: string;
    timestamp: Date;
    channel: string;
    username: string;
    command: string;
    event: string;
    isSelf: boolean;
    message: string;
    tags: {
        [key: string]: any;
    };
}
/**
 * Join a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#join-twitch-membership
 */
interface JoinMessage extends Omit<BaseMessage, "message"> {
    command: Commands.JOIN;
    event: Commands.JOIN;
}
/**
 * Depart from a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#part-twitch-membership
 */
interface PartMessage extends Omit<BaseMessage, "message"> {
    command: Commands.PART;
    event: Commands.PART;
}
/**
 * Gain/lose moderator (operator) status in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#mode-twitch-membership
 */
interface ModeModGainedMessage extends BaseMessage {
    command: Commands.MODE;
    event: ChatEvents.MOD_GAINED;
    message: "+o";
    isModerator: true;
}
interface ModeModLostMessage extends BaseMessage {
    command: Commands.MODE;
    event: ChatEvents.MOD_LOST;
    message: "-o";
    isModerator: false;
}
type ModeMessages = ModeModGainedMessage | ModeModLostMessage;
/**
 * List current chatters in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
 */
interface NamesMessage extends Omit<BaseMessage, "message"> {
    command: Commands.NAMES;
    event: Commands.NAMES;
    usernames: string[];
}
/**
 * End of list current chatters in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
 */
interface NamesEndMessage extends Omit<BaseMessage, "message"> {
    command: Commands.NAMES_END;
    event: Commands.NAMES_END;
}
/**
 * GLOBALUSERSTATE message
 * @see https://dev.twitch.tv/docs/irc/tags#globaluserstate-twitch-tags
 */
interface GlobalUserStateMessage extends BaseMessage {
    command: Commands.GLOBALUSERSTATE;
    event: Commands.GLOBALUSERSTATE;
    tags: GlobalUserStateTags;
}
/**
 * Temporary or permanent ban on a channel.
 * @see https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
 * @see https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags
 */
interface ClearChatUserBannedMessage extends Omit<BaseMessage, "message"> {
    command: Commands.CLEAR_CHAT;
    event: ChatEvents.USER_BANNED;
    tags: ClearChatTags;
}
/**
 * All chat is cleared (deleted).
 * @see https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
 * @see https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags
 */
interface ClearChatMessage extends Omit<BaseMessage, "tags" | "username" | "message"> {
    command: Commands.CLEAR_CHAT;
    event: Commands.CLEAR_CHAT;
}
type ClearChatMessages = ClearChatMessage | ClearChatUserBannedMessage;
/**
 * Single message removal on a channel.
 * @see https://dev.twitch.tv/docs/irc/commands#clearmsg-twitch-commands
 * @see https://dev.twitch.tv/docs/irc/tags#clearmsg-twitch-tags
 */
interface ClearMessageMessage extends Omit<BaseMessage, "message"> {
    command: Commands.CLEAR_MESSAGE;
    event: Commands.CLEAR_MESSAGE;
    tags: ClearMessageTags;
    targetMessageId: string;
}
/**
 * Host starts or stops a message.
 * @see https://dev.twitch.tv/docs/irc/commands/#hosttarget-twitch-commands
 */
interface HostTargetMessage extends Omit<BaseMessage, "message"> {
    command: Commands.HOST_TARGET;
    event: ChatEvents.HOST_ON | ChatEvents.HOST_OFF;
    numberOfViewers?: number;
}
/**
 * When a user joins a channel or a room setting is changed.
 * @see https://dev.twitch.tv/docs/irc/tags#roomstate-twitch-tags
 */
interface RoomStateMessage extends BaseMessage {
    command: Commands.ROOM_STATE;
    event: Commands.ROOM_STATE;
    tags: RoomStateTags;
}
/**
 * Base NOTICE message
 */
interface NoticeMessage extends Omit<BaseMessage, "event"> {
    command: Commands.NOTICE;
    event: Exclude<NoticeEvents, typeof NoticeEvents.ROOM_MODS>;
    tags: NoticeTags;
    username: "tmi.twitch.tv" | string;
}
/**
 * NOTICE/ROOM_MODS message
 */
interface NoticeRoomModsMessage extends Omit<NoticeMessage, "event"> {
    event: typeof NoticeEvents.ROOM_MODS;
    /** The moderators of this channel. */
    mods: string[];
}
/**
 * NOTICE message
 * @see https://dev.twitch.tv/docs/irc/commands/#msg-id-tags-for-the-notice-commands-capability
 */
type NoticeMessages = NoticeMessage | NoticeRoomModsMessage;
/**
 * USERSTATE message
 */
interface UserStateMessage extends BaseMessage {
    command: Commands.USER_STATE;
    event: Commands.USER_STATE;
    tags: UserStateTags;
}
/**
 * PRIVMSG messages
 */
interface BasePrivateMessage extends Omit<UserStateMessage, "command" | "event"> {
    command: Commands.PRIVATE_MESSAGE;
}
/**
 * When a user joins a channel or sends a PRIVMSG to a channel.
 */
interface PrivateMessage extends BasePrivateMessage {
    event: Commands.PRIVATE_MESSAGE;
}
interface PrivateMessageWithBits extends BasePrivateMessage {
    event: ChatEvents.CHEER;
    bits: number;
}
interface BaseHostingPrivateMessage extends Omit<BasePrivateMessage, "tags"> {
}
/**
 * When a user hosts your channel while connected as broadcaster.
 */
interface HostingPrivateMessage extends BaseHostingPrivateMessage {
    event: ChatEvents.HOSTED_WITHOUT_VIEWERS;
    tags: {
        displayName: string;
    };
}
interface HostingWithViewersPrivateMessage extends BaseHostingPrivateMessage {
    event: ChatEvents.HOSTED_WITH_VIEWERS;
    tags: {
        displayName: string;
    };
    numberOfViewers?: number;
}
interface HostingAutoPrivateMessage extends BaseHostingPrivateMessage {
    event: ChatEvents.HOSTED_AUTO;
    tags: {
        displayName: string;
    };
    numberOfViewers?: number;
}
type PrivateMessages = PrivateMessage | PrivateMessageWithBits | HostingPrivateMessage | HostingWithViewersPrivateMessage | HostingAutoPrivateMessage;
interface MessageParameters {
    [key: string]: string | number | boolean | Date | undefined;
}
interface AnonymousGiftPaidUpgradeParameters extends MessageParameters {
}
interface GiftPaidUpgradeParameters extends MessageParameters {
    promoGiftTotal: number;
    promoName: string;
    senderLogin: string;
    senderName: string;
}
interface RaidParameters extends MessageParameters {
    displayName: string;
    login: string;
    viewerCount: number;
}
interface ResubscriptionParameters extends MessageParameters {
    months: number;
    subPlan: string;
    subPlanName: string;
}
interface RitualParameters extends MessageParameters {
    ritualName: string;
}
interface SubscriptionGiftCommunityParameters extends MessageParameters {
    massGiftCount: number;
    senderCount: number;
    subPlan: number;
}
interface SubscriptionGiftParameters extends MessageParameters {
    months: number;
    subPlan: string;
    subPlanName: string;
    recipientDisplayName: string;
    recipientId: string;
    recipientName: string;
}
interface SubscriptionParameters extends MessageParameters {
    months: 1;
    subPlan: string;
    subPlanName: string;
}
type UserNoticeMessageParameters = AnonymousGiftPaidUpgradeParameters | GiftPaidUpgradeParameters | RaidParameters | ResubscriptionParameters | RitualParameters | SubscriptionGiftCommunityParameters | SubscriptionGiftParameters | SubscriptionParameters;
interface UserNoticeMessage extends Omit<BaseMessage, "event" | "parameters"> {
    command: Commands.USER_NOTICE;
    event: UserNoticeEvents;
    tags: UserNoticeTags;
    parameters: MessageParameters;
    systemMessage: string;
}
/**
 * On anonymous gifted subscription paid upgrade to a channel.
 */
interface UserNoticeAnonymousGiftPaidUpgradeMessage extends UserNoticeMessage {
    command: Commands.USER_NOTICE;
    event: typeof UserNoticeEvents.ANON_GIFT_PAID_UPGRADE;
    parameters: AnonymousGiftPaidUpgradeParameters;
}
/**
 * On gifted subscription paid upgrade to a channel.
 */
interface UserNoticeGiftPaidUpgradeMessage extends Omit<UserNoticeMessage, "parameters"> {
    event: typeof UserNoticeEvents.GIFT_PAID_UPGRADE;
    parameters: {
        promoGiftTotal: number;
        promoName: string;
        senderLogin: string;
        senderName: string;
    };
}
/**
 * On channel raid.
 */
interface UserNoticeRaidMessage extends Omit<UserNoticeMessage, "parameters"> {
    event: typeof UserNoticeEvents.RAID;
    parameters: {
        displayName: string;
        login: string;
        viewerCount: number;
    };
}
/**
 * On resubscription (subsequent months) to a channel.
 */
interface UserNoticeResubscriptionMessage extends Omit<UserNoticeMessage, "parameters"> {
    event: typeof UserNoticeEvents.RESUBSCRIPTION;
    parameters: {
        months: number;
        subPlan: string;
        subPlanName: string;
    };
}
/**
 * On channel ritual.
 */
interface UserNoticeRitualMessage extends Omit<UserNoticeMessage, "parameters"> {
    event: typeof UserNoticeEvents.RITUAL;
    parameters: {
        ritualName: string;
    };
}
/**
 * On subscription gift to a channel community.
 */
interface UserNoticeSubscriptionGiftCommunityMessage extends Omit<UserNoticeMessage, "parameters"> {
    event: typeof UserNoticeEvents.SUBSCRIPTION_GIFT_COMMUNITY;
    parameters: {
        massGiftCount: number;
        senderCount: number;
        subPlan: number;
    };
}
/**
 * On subscription gift to a channel.
 */
interface UserNoticeSubscriptionGiftMessage extends Omit<UserNoticeMessage, "parameters"> {
    event: typeof UserNoticeEvents.SUBSCRIPTION_GIFT;
    parameters: {
        months: number;
        subPlan: string;
        subPlanName: string;
        recipientDisplayName: string;
        recipientId: string;
        recipientName: string;
    };
}
/**
 * On subscription (first month) to a channel.
 */
interface UserNoticeSubscriptionMessage extends Omit<UserNoticeMessage, "event" | "parameters"> {
    event: typeof UserNoticeEvents.SUBSCRIPTION;
    parameters: {
        months: 1;
        subPlan: string;
        subPlanName: string;
    };
}
type UserNoticeMessages = UserNoticeAnonymousGiftPaidUpgradeMessage | UserNoticeGiftPaidUpgradeMessage | UserNoticeRaidMessage | UserNoticeResubscriptionMessage | UserNoticeRitualMessage | UserNoticeSubscriptionGiftCommunityMessage | UserNoticeSubscriptionGiftMessage | UserNoticeSubscriptionMessage;
type Messages = BaseMessage | JoinMessage | PartMessage | ModeMessages | NamesMessage | NamesEndMessage | GlobalUserStateMessage | ClearChatMessages | ClearMessageMessage | HostTargetMessage | RoomStateMessage | NoticeMessages | UserStateMessage | PrivateMessages | UserNoticeMessages;
/**
 * @see https://github.com/pinojs/pino/blob/v6.3.1/docs/api.md#options
 */
type LoggerOptions = PinoLoggerOptions;
declare enum BaseClientEvents {
    RAW = "RAW",
    ALL = "*",
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
    RECONNECT = "RECONNECT",
    AUTHENTICATED = "AUTHENTICATED",
    AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
    ERROR_ENCOUNTERED = "ERROR_ENCOUNTERED"
}
declare const ClientEvents: {
    RAW: BaseClientEvents.RAW;
    ALL: BaseClientEvents.ALL;
    CONNECTED: BaseClientEvents.CONNECTED;
    DISCONNECTED: BaseClientEvents.DISCONNECTED;
    RECONNECT: BaseClientEvents.RECONNECT;
    AUTHENTICATED: BaseClientEvents.AUTHENTICATED;
    AUTHENTICATION_FAILED: BaseClientEvents.AUTHENTICATION_FAILED;
    ERROR_ENCOUNTERED: BaseClientEvents.ERROR_ENCOUNTERED;
    WELCOME: Commands.WELCOME;
    PING: Commands.PING;
    PONG: Commands.PONG;
    WHISPER: Commands.WHISPER;
    JOIN: Commands.JOIN;
    MODE: Commands.MODE;
    PART: Commands.PART;
    NAMES: Commands.NAMES;
    NAMES_END: Commands.NAMES_END;
    CLEAR_CHAT: Commands.CLEAR_CHAT;
    CLEAR_MESSAGE: Commands.CLEAR_MESSAGE;
    GLOBALUSERSTATE: Commands.GLOBALUSERSTATE;
    HOST_TARGET: Commands.HOST_TARGET;
    NOTICE: Commands.NOTICE;
    PRIVATE_MESSAGE: Commands.PRIVATE_MESSAGE;
    ROOM_STATE: Commands.ROOM_STATE;
    USER_NOTICE: Commands.USER_NOTICE;
    USER_STATE: Commands.USER_STATE;
};
type ClientEvents = Commands | BaseClientEvents;
type ClientEventTypes = {
    [ClientEvents.RAW]: [string];
    [ClientEvents.ALL]: [BaseMessage];
    [ClientEvents.CONNECTED]: [BaseMessage];
    [ClientEvents.DISCONNECTED]: [];
    [ClientEvents.RECONNECT]: [];
    [ClientEvents.AUTHENTICATED]: [BaseMessage];
    [ClientEvents.AUTHENTICATION_FAILED]: [BaseMessage];
    [ClientEvents.ERROR_ENCOUNTERED]: [Error];
};
type ChatOptions = {
    username?: string;
    /**
     * OAuth token
     * @see https://twitchtokengenerator.com/ to generate a token
     */
    token?: string;
    /**
     * Bot is known
     * @see https://dev.twitch.tv/docs/irc/guide/#known-and-verified-bots
     */
    isKnown?: boolean;
    /**
     * Bot is verified
     * @see https://dev.twitch.tv/docs/irc/guide/#known-and-verified-bots
     */
    isVerified?: boolean;
    connectionTimeout: number;
    joinTimeout: number;
    log?: LoggerOptions;
    onAuthenticationFailure?: () => Promise<string>;
};
declare enum NoticeCompounds {
    ALREADY_BANNED = "NOTICE/ALREADY_BANNED",
    ALREADY_EMOTE_ONLY_OFF = "NOTICE/ALREADY_EMOTE_ONLY_OFF",
    ALREADY_EMOTE_ONLY_ON = "NOTICE/ALREADY_EMOTE_ONLY_ON",
    ALREADY_R9K_OFF = "NOTICE/ALREADY_R9K_OFF",
    ALREADY_R9K_ON = "NOTICE/ALREADY_R9K_ON",
    ALREADY_SUBS_OFF = "NOTICE/ALREADY_SUBS_OFF",
    ALREADY_SUBS_ON = "NOTICE/ALREADY_SUBS_ON",
    BAD_HOST_HOSTING = "NOTICE/BAD_HOST_HOSTING",
    BAD_MOD_MOD = "NOTICE/BAD_MOD_MOD",
    BAN_SUCCESS = "NOTICE/BAN_SUCCESS",
    BAD_UNBAN_NO_BAN = "NOTICE/BAD_UNBAN_NO_BAN",
    COLOR_CHANGED = "NOTICE/COLOR_CHANGED",
    CMDS_AVAILABLE = "NOTICE/CMDS_AVAILABLE",
    COMMERCIAL_SUCCESS = "NOTICE/COMMERCIAL_SUCCESS",
    EMOTE_ONLY_OFF = "NOTICE/EMOTE_ONLY_OFF",
    EMOTE_ONLY_ON = "NOTICE/EMOTE_ONLY_ON",
    FOLLOWERS_OFF = "NOTICE/FOLLOWERS_OFF",
    FOLLOWERS_ON = "NOTICE/FOLLOWERS_ON",
    FOLLOWERS_ONZERO = "NOTICE/FOLLOWERS_ONZERO",
    HOST_OFF = "NOTICE/HOST_OFF",
    HOST_ON = "NOTICE/HOST_ON",
    HOSTS_REMAINING = "NOTICE/HOSTS_REMAINING",
    MSG_CHANNEL_SUSPENDED = "NOTICE/MSG_CHANNEL_SUSPENDED",
    MOD_SUCCESS = "NOTICE/MOD_SUCCESS",
    NOT_HOSTING = "NOTICE/NOT_HOSTING",
    R9K_OFF = "NOTICE/R9K_OFF",
    R9K_ON = "NOTICE/R9K_ON",
    ROOM_MODS = "NOTICE/ROOM_MODS",
    SLOW_OFF = "NOTICE/SLOW_OFF",
    SLOW_ON = "NOTICE/SLOW_ON",
    SUBS_OFF = "NOTICE/SUBS_OFF",
    SUBS_ON = "NOTICE/SUBS_ON",
    TIMEOUT_SUCCESS = "NOTICE/TIMEOUT_SUCCESS",
    UNBAN_SUCCESS = "NOTICE/UNBAN_SUCCESS",
    UNMOD_SUCCESS = "NOTICE/UNMOD_SUCCESS",
    UNRAID_SUCCESS = "NOTICE/UNRAID_SUCCESS",
    UNRECOGNIZED_CMD = "NOTICE/UNRECOGNIZED_CMD"
}
declare enum PrivateMessageCompounds {
    CHEER = "PRIVMSG/CHEER",
    HOSTED_WITHOUT_VIEWERS = "PRIVMSG/HOSTED_WITHOUT_VIEWERS",
    HOSTED_WITH_VIEWERS = "PRIVMSG/HOSTED_WITH_VIEWERS",
    HOSTED_AUTO = "PRIVMSG/HOSTED_AUTO"
}
declare enum UserNoticeCompounds {
    ANON_GIFT_PAID_UPGRADE = "USERNOTICE/ANON_GIFT_PAID_UPGRADE",
    GIFT_PAID_UPGRADE = "USERNOTICE/GIFT_PAID_UPGRADE",
    RAID = "USERNOTICE/RAID",
    RESUBSCRIPTION = "USERNOTICE/RESUBSCRIPTION",
    RITUAL = "USERNOTICE/RITUAL",
    SUBSCRIPTION = "USERNOTICE/SUBSCRIPTION",
    SUBSCRIPTION_GIFT = "USERNOTICE/SUBSCRIPTION_GIFT",
    SUBSCRIPTION_GIFT_COMMUNITY = "USERNOTICE/SUBSCRIPTION_GIFT_COMMUNITY"
}
type EventTypes = Omit<ClientEventTypes, BaseClientEvents.ALL> & {
    [Events.ALL]: [Messages];
    [Events.JOIN]: [JoinMessage];
    [Events.PART]: [PartMessage];
    [Events.ROOM_STATE]: [RoomStateMessage];
    [Events.USER_STATE]: [UserStateMessage];
    [Events.CLEAR_CHAT]: [ClearChatMessages];
    [Events.HOST_TARGET]: [HostTargetMessage];
    [Events.MODE]: [ModeMessages];
    [Events.NAMES]: [NamesMessage];
    [Events.NAMES_END]: [NamesEndMessage];
    /**
     * NOTICE messages
     */
    [Events.NOTICE]: [NoticeMessages];
    [Events.ALREADY_BANNED]: [NoticeMessage];
    [Events.ALREADY_EMOTE_ONLY_OFF]: [NoticeMessage];
    [Events.ALREADY_EMOTE_ONLY_ON]: [NoticeMessage];
    [Events.ALREADY_R9K_OFF]: [NoticeMessage];
    [Events.ALREADY_R9K_ON]: [NoticeMessage];
    [Events.ALREADY_SUBS_OFF]: [NoticeMessage];
    [Events.ALREADY_SUBS_ON]: [NoticeMessage];
    [Events.BAD_HOST_HOSTING]: [NoticeMessage];
    [Events.BAD_MOD_MOD]: [NoticeMessage];
    [Events.BAN_SUCCESS]: [NoticeMessage];
    [Events.BAD_UNBAN_NO_BAN]: [NoticeMessage];
    [Events.COLOR_CHANGED]: [NoticeMessage];
    [Events.CMDS_AVAILABLE]: [NoticeMessage];
    [Events.COMMERCIAL_SUCCESS]: [NoticeMessage];
    [Events.EMOTE_ONLY_OFF]: [NoticeMessage];
    [Events.EMOTE_ONLY_ON]: [NoticeMessage];
    [Events.FOLLOWERS_OFF]: [NoticeMessage];
    [Events.FOLLOWERS_ON]: [NoticeMessage];
    [Events.FOLLOWERS_ONZERO]: [NoticeMessage];
    [Events.HOST_OFF]: [NoticeMessage];
    [Events.HOST_ON]: [NoticeMessage];
    [Events.HOSTS_REMAINING]: [NoticeMessage];
    [Events.MSG_CHANNEL_SUSPENDED]: [NoticeMessage];
    [Events.MOD_SUCCESS]: [NoticeMessage];
    [Events.R9K_OFF]: [NoticeMessage];
    [Events.R9K_ON]: [NoticeMessage];
    [Events.ROOM_MODS]: [NoticeRoomModsMessage];
    [Events.SLOW_OFF]: [NoticeMessage];
    [Events.SLOW_ON]: [NoticeMessage];
    [Events.SUBS_OFF]: [NoticeMessage];
    [Events.SUBS_ON]: [NoticeMessage];
    [Events.TIMEOUT_SUCCESS]: [NoticeMessage];
    [Events.UNBAN_SUCCESS]: [NoticeMessage];
    [Events.UNRAID_SUCCESS]: [NoticeMessage];
    [Events.UNRECOGNIZED_CMD]: [NoticeMessage];
    [NoticeCompounds.ALREADY_BANNED]: [NoticeMessage];
    [NoticeCompounds.ALREADY_EMOTE_ONLY_OFF]: [NoticeMessage];
    [NoticeCompounds.ALREADY_EMOTE_ONLY_ON]: [NoticeMessage];
    [NoticeCompounds.ALREADY_R9K_OFF]: [NoticeMessage];
    [NoticeCompounds.ALREADY_R9K_ON]: [NoticeMessage];
    [NoticeCompounds.ALREADY_SUBS_OFF]: [NoticeMessage];
    [NoticeCompounds.ALREADY_SUBS_ON]: [NoticeMessage];
    [NoticeCompounds.BAD_HOST_HOSTING]: [NoticeMessage];
    [NoticeCompounds.BAD_MOD_MOD]: [NoticeMessage];
    [NoticeCompounds.BAN_SUCCESS]: [NoticeMessage];
    [NoticeCompounds.BAD_UNBAN_NO_BAN]: [NoticeMessage];
    [NoticeCompounds.COLOR_CHANGED]: [NoticeMessage];
    [NoticeCompounds.CMDS_AVAILABLE]: [NoticeMessage];
    [NoticeCompounds.COMMERCIAL_SUCCESS]: [NoticeMessage];
    [NoticeCompounds.EMOTE_ONLY_OFF]: [NoticeMessage];
    [NoticeCompounds.EMOTE_ONLY_ON]: [NoticeMessage];
    [NoticeCompounds.FOLLOWERS_OFF]: [NoticeMessage];
    [NoticeCompounds.FOLLOWERS_ON]: [NoticeMessage];
    [NoticeCompounds.FOLLOWERS_ONZERO]: [NoticeMessage];
    [NoticeCompounds.HOST_OFF]: [NoticeMessage];
    [NoticeCompounds.HOST_ON]: [NoticeMessage];
    [NoticeCompounds.HOSTS_REMAINING]: [NoticeMessage];
    [NoticeCompounds.MSG_CHANNEL_SUSPENDED]: [NoticeMessage];
    [NoticeCompounds.MOD_SUCCESS]: [NoticeMessage];
    [NoticeCompounds.R9K_OFF]: [NoticeMessage];
    [NoticeCompounds.R9K_ON]: [NoticeMessage];
    [NoticeCompounds.ROOM_MODS]: [NoticeRoomModsMessage];
    [NoticeCompounds.SLOW_OFF]: [NoticeMessage];
    [NoticeCompounds.SLOW_ON]: [NoticeMessage];
    [NoticeCompounds.SUBS_OFF]: [NoticeMessage];
    [NoticeCompounds.SUBS_ON]: [NoticeMessage];
    [NoticeCompounds.TIMEOUT_SUCCESS]: [NoticeMessage];
    [NoticeCompounds.UNBAN_SUCCESS]: [NoticeMessage];
    [NoticeCompounds.UNRAID_SUCCESS]: [NoticeMessage];
    [NoticeCompounds.UNRECOGNIZED_CMD]: [NoticeMessage];
    /**
     * PRIVMSG messages
     */
    [Events.PRIVATE_MESSAGE]: [PrivateMessages];
    [Events.CHEER]: [PrivateMessageWithBits];
    [Events.HOSTED_WITHOUT_VIEWERS]: [HostingPrivateMessage];
    [Events.HOSTED_WITH_VIEWERS]: [HostingWithViewersPrivateMessage];
    [Events.HOSTED_AUTO]: [HostingAutoPrivateMessage];
    [PrivateMessageCompounds.CHEER]: [PrivateMessageWithBits];
    [PrivateMessageCompounds.HOSTED_WITHOUT_VIEWERS]: [HostingPrivateMessage];
    [PrivateMessageCompounds.HOSTED_WITH_VIEWERS]: [HostingWithViewersPrivateMessage];
    [PrivateMessageCompounds.HOSTED_AUTO]: [HostingAutoPrivateMessage];
    /**
     * USERNOTICE messages
     */
    [Events.USER_NOTICE]: [UserNoticeMessages];
    [Events.ANON_GIFT_PAID_UPGRADE]: [UserNoticeAnonymousGiftPaidUpgradeMessage];
    [Events.GIFT_PAID_UPGRADE]: [UserNoticeGiftPaidUpgradeMessage];
    [Events.RAID]: [UserNoticeRaidMessage];
    [Events.RESUBSCRIPTION]: [UserNoticeResubscriptionMessage];
    [Events.RITUAL]: [UserNoticeRitualMessage];
    [Events.SUBSCRIPTION]: [UserNoticeSubscriptionMessage];
    [Events.SUBSCRIPTION_GIFT]: [UserNoticeSubscriptionGiftMessage];
    [Events.SUBSCRIPTION_GIFT_COMMUNITY]: [UserNoticeSubscriptionGiftCommunityMessage];
    [UserNoticeCompounds.ANON_GIFT_PAID_UPGRADE]: [UserNoticeAnonymousGiftPaidUpgradeMessage];
    [UserNoticeCompounds.GIFT_PAID_UPGRADE]: [UserNoticeGiftPaidUpgradeMessage];
    [UserNoticeCompounds.RAID]: [UserNoticeRaidMessage];
    [UserNoticeCompounds.RESUBSCRIPTION]: [UserNoticeResubscriptionMessage];
    [UserNoticeCompounds.RITUAL]: [UserNoticeRitualMessage];
    [UserNoticeCompounds.SUBSCRIPTION]: [UserNoticeSubscriptionMessage];
    [UserNoticeCompounds.SUBSCRIPTION_GIFT]: [UserNoticeSubscriptionGiftMessage];
    [UserNoticeCompounds.SUBSCRIPTION_GIFT_COMMUNITY]: [UserNoticeSubscriptionGiftCommunityMessage];
    [eventName: string]: [Messages]; // This break p-event typing.
};
/**
 * Interact with Twitch chat.
 *
 * ## Connecting
 *
 * ```js
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const username = 'ronni'
 * const { chat } = new TwitchJs({ token, username })
 *
 * chat.connect().then(globalUserState => {
 *   // Do stuff ...
 * })
 * ```
 *
 * **Note:** Connecting with a `token` and a `username` is optional.
 *
 * Once connected, `chat.userState` will contain
 * [[GlobalUserStateTags|global user state information]].
 *
 * ## Joining a channel
 *
 * ```js
 * const channel = '#dallas'
 *
 * chat.join(channel).then(channelState => {
 *   // Do stuff with channelState...
 * })
 * ```
 *
 * After joining a channel, `chat.channels[channel]` will contain
 * [[ChannelState|channel state information]].
 *
 * ## Listening for events
 *
 * ```js
 * // Listen to all events
 * chat.on('*', message => {
 *   // Do stuff with message ...
 * })
 *
 * // Listen to private messages
 * chat.on('PRIVMSG', privateMessage => {
 *   // Do stuff with privateMessage ...
 * })
 * ```
 *
 * Events are nested; for example:
 *
 * ```js
 * // Listen to subscriptions only
 * chat.on('USERNOTICE/SUBSCRIPTION', userStateMessage => {
 *   // Do stuff with userStateMessage ...
 * })
 *
 * // Listen to all user notices
 * chat.on('USERNOTICE', userStateMessage => {
 *   // Do stuff with userStateMessage ...
 * })
 * ```
 *
 * For added convenience, TwitchJS also exposes event constants.
 *
 * ```js
 * const { chat } = new TwitchJs({ token, username })
 *
 * // Listen to all user notices
 * chat.on(chat.events.USER_NOTICE, userStateMessage => {
 *   // Do stuff with userStateMessage ...
 * })
 * ```
 *
 * ## Sending messages
 *
 * To send messages, [Chat] must be initialized with a `username` and a
 * [`token`](../#authentication) with `chat_login` scope.
 *
 * All messages sent to Twitch are automatically rate-limited according to
 * [Twitch Developer documentation](https://dev.twitch.tv/docs/irc/guide/#command--message-limits).
 *
 * ### Speak in channel
 *
 * ```js
 * const channel = '#dallas'
 *
 * chat
 *   .say(channel, 'Kappa Keepo Kappa')
 *   // Optionally ...
 *   .then(() => {
 *     // ... do stuff on success ...
 *   })
 * ```
 *
 * ### Send command to channel
 *
 * All chat commands are currently supported and exposed as camel-case methods. For
 * example:
 *
 * ```js
 * const channel = '#dallas'
 *
 * // Enable followers-only for 1 week
 * chat.followersOnly(channel, '1w')
 *
 * // Ban ronni
 * chat.ban(channel, 'ronni')
 * ```
 *
 * **Note:** `Promise`-resolves for each commands are
 * [planned](https://github.com/twitch-devs/twitch-js/issues/87).
 *
 * ## Joining multiple channels
 *
 * ```js
 * const channels = ['#dallas', '#ronni']
 *
 * Promise.all(channels.map(channel => chat.join(channel))).then(channelStates => {
 *   // Listen to all messages from #dallas only
 *   chat.on('#dallas', message => {
 *     // Do stuff with message ...
 *   })
 *
 *   // Listen to private messages from #dallas and #ronni
 *   chat.on('PRIVMSG', privateMessage => {
 *     // Do stuff with privateMessage ...
 *   })
 *
 *   // Listen to private messages from #dallas only
 *   chat.on('PRIVMSG/#dallas', privateMessage => {
 *     // Do stuff with privateMessage ...
 *   })
 *
 *   // Listen to all private messages from #ronni only
 *   chat.on('PRIVMSG/#ronni', privateMessage => {
 *     // Do stuff with privateMessage ...
 *   })
 * })
 * ```
 *
 * ### Broadcasting to all channels
 *
 * ```js
 * chat
 *   .broadcast('Kappa Keepo Kappa')
 *   // Optionally ...
 *   .then(userStateMessages => {
 *     // ... do stuff with userStateMessages on success ...
 *   })
 * ```
 */
declare class Chat extends EventEmitter<EventTypes> {
    static Commands: typeof Commands;
    static Events: {
        ANON_GIFT_PAID_UPGRADE: "ANON_GIFT_PAID_UPGRADE";
        GIFT_PAID_UPGRADE: "GIFT_PAID_UPGRADE";
        RAID: "RAID";
        RESUBSCRIPTION: "RESUBSCRIPTION";
        RITUAL: "RITUAL";
        SUBSCRIPTION: "SUBSCRIPTION";
        SUBSCRIPTION_GIFT: "SUBSCRIPTION_GIFT";
        SUBSCRIPTION_GIFT_COMMUNITY: "SUBSCRIPTION_GIFT_COMMUNITY";
        CHEER: PrivateMessageEvents.CHEER;
        HOSTED_WITHOUT_VIEWERS: PrivateMessageEvents.HOSTED_WITHOUT_VIEWERS;
        HOSTED_WITH_VIEWERS: PrivateMessageEvents.HOSTED_WITH_VIEWERS;
        HOSTED_AUTO: PrivateMessageEvents.HOSTED_AUTO;
        ALREADY_BANNED: "ALREADY_BANNED";
        ALREADY_EMOTE_ONLY_OFF: "ALREADY_EMOTE_ONLY_OFF";
        ALREADY_EMOTE_ONLY_ON: "ALREADY_EMOTE_ONLY_ON";
        ALREADY_R9K_OFF: "ALREADY_R9K_OFF";
        ALREADY_R9K_ON: "ALREADY_R9K_ON";
        ALREADY_SUBS_OFF: "ALREADY_SUBS_OFF";
        ALREADY_SUBS_ON: "ALREADY_SUBS_ON";
        BAD_HOST_HOSTING: "BAD_HOST_HOSTING";
        BAD_MOD_MOD: "BAD_MOD_MOD";
        BAN_SUCCESS: "BAN_SUCCESS";
        BAD_UNBAN_NO_BAN: "BAD_UNBAN_NO_BAN";
        COLOR_CHANGED: "COLOR_CHANGED";
        CMDS_AVAILABLE: "CMDS_AVAILABLE";
        COMMERCIAL_SUCCESS: "COMMERCIAL_SUCCESS";
        EMOTE_ONLY_OFF: "EMOTE_ONLY_OFF";
        EMOTE_ONLY_ON: "EMOTE_ONLY_ON";
        FOLLOWERS_OFF: "FOLLOWERS_OFF";
        FOLLOWERS_ON: "FOLLOWERS_ON";
        FOLLOWERS_ONZERO: "FOLLOWERS_ONZERO";
        HOST_OFF: "HOST_OFF";
        HOST_ON: "HOST_ON";
        HOSTS_REMAINING: "HOSTS_REMAINING";
        MSG_CHANNEL_SUSPENDED: "MSG_CHANNEL_SUSPENDED";
        MOD_SUCCESS: "MOD_SUCCESS";
        NOT_HOSTING: "NOT_HOSTING";
        R9K_OFF: "R9K_OFF";
        R9K_ON: "R9K_ON";
        ROOM_MODS: "ROOM_MODS";
        SLOW_OFF: "SLOW_OFF";
        SLOW_ON: "SLOW_ON";
        SUBS_OFF: "SUBS_OFF";
        SUBS_ON: "SUBS_ON";
        TIMEOUT_SUCCESS: "TIMEOUT_SUCCESS";
        UNBAN_SUCCESS: "UNBAN_SUCCESS";
        UNMOD_SUCCESS: "UNMOD_SUCCESS";
        UNRAID_SUCCESS: "UNRAID_SUCCESS";
        UNRECOGNIZED_CMD: "UNRECOGNIZED_CMD";
        RAW: ChatEvents.RAW;
        ALL: ChatEvents.ALL;
        CONNECTED: ChatEvents.CONNECTED;
        DISCONNECTED: ChatEvents.DISCONNECTED;
        RECONNECT: ChatEvents.RECONNECT;
        AUTHENTICATED: ChatEvents.AUTHENTICATED;
        AUTHENTICATION_FAILED: ChatEvents.AUTHENTICATION_FAILED;
        GLOBALUSERSTATE: ChatEvents.GLOBALUSERSTATE;
        ERROR_ENCOUNTERED: ChatEvents.ERROR_ENCOUNTERED;
        PARSE_ERROR_ENCOUNTERED: ChatEvents.PARSE_ERROR_ENCOUNTERED;
        MOD_GAINED: ChatEvents.MOD_GAINED;
        MOD_LOST: ChatEvents.MOD_LOST;
        USER_BANNED: ChatEvents.USER_BANNED;
        HOSTED: ChatEvents.HOSTED;
        CLEAR_CHAT: BaseCommands.CLEAR_CHAT;
        CLEAR_MESSAGE: BaseCommands.CLEAR_MESSAGE;
        HOST_TARGET: BaseCommands.HOST_TARGET;
        NOTICE: BaseCommands.NOTICE;
        ROOM_STATE: BaseCommands.ROOM_STATE;
        USER_NOTICE: BaseCommands.USER_NOTICE;
        USER_STATE: BaseCommands.USER_STATE;
        WELCOME: OtherCommands.WELCOME;
        PING: OtherCommands.PING;
        PONG: OtherCommands.PONG;
        WHISPER: OtherCommands.WHISPER;
        PRIVATE_MESSAGE: TagCommands.PRIVATE_MESSAGE;
        JOIN: MembershipCommands.JOIN;
        MODE: MembershipCommands.MODE;
        PART: MembershipCommands.PART;
        NAMES: MembershipCommands.NAMES;
        NAMES_END: MembershipCommands.NAMES_END;
    };
    static CompoundEvents: {
        NOTICE: typeof NoticeCompounds;
        PRIVMSG: typeof PrivateMessageCompounds;
        USERNOTICE: typeof UserNoticeCompounds;
    };
    private _internalEmitter;
    private _options;
    private _log;
    private _client?;
    private _readyState;
    private _connectionAttempts;
    private _connectionInProgress?;
    private _disconnectionInProgress?;
    private _reconnectionInProgress?;
    private _globalUserState?;
    private _channelState;
    private _isAuthenticated;
    /**
     * Chat constructor.
     */
    constructor(options: Partial<ChatOptions>);
    /**
     * Connect to Twitch.
     */
    connect(): Promise<void>;
    /**
     * Updates the client options after instantiation.
     * To update `token` or `username`, use `reconnect()`.
     */
    updateOptions(options: Partial<ChatOptions>): void;
    /**
     * Send a raw message to Twitch.
     */
    send(message: string, options?: Partial<{
        priority: number;
        isModerator: boolean;
    }>): Promise<void>;
    /**
     * Disconnected from Twitch.
     */
    disconnect(): Promise<void>;
    /**
     * Reconnect to Twitch, providing new options to the client.
     */
    reconnect(options?: Partial<ChatOptions>): CancelablePromise<any>;
    /**
     * Join a channel.
     *
     * @example <caption>Joining #dallas</caption>
     * const channel = '#dallas'
     *
     * chat.join(channel).then(channelState => {
     *   // Do stuff with channelState...
     * })
     *
     * @example <caption>Joining multiple channels</caption>
     * const channels = ['#dallas', '#ronni']
     *
     * Promise.all(channels.map(channel => chat.join(channel)))
     *   .then(channelStates => {
     *     // Listen to all PRIVMSG
     *     chat.on('PRIVMSG', privateMessage => {
     *       // Do stuff with privateMessage ...
     *     })
     *
     *     // Listen to PRIVMSG from #dallas ONLY
     *     chat.on('PRIVMSG/#dallas', privateMessage => {
     *       // Do stuff with privateMessage ...
     *     })
     *     // Listen to all PRIVMSG from #ronni ONLY
     *     chat.on('PRIVMSG/#ronni', privateMessage => {
     *       // Do stuff with privateMessage ...
     *     })
     *   })
     */
    join(channel: string): Promise<{
        roomState: RoomStateTags;
        userState: UserStateTags | undefined;
    }>;
    /**
     * Depart from a channel.
     */
    part(channel: string): Promise<void>;
    /**
     * Send a message to a channel.
     */
    say(channel: string, message: string, options?: {
        priority?: number;
    }): Promise<void>;
    /**
     * Broadcast message to all connected channels.
     */
    broadcast(message: string): Promise<Promise<void>[]>;
    /**
     * This command will allow you to permanently ban a user from the chat room.
     */
    ban(channel: string, username: string): Promise<NoticeMessages>;
    /**
     * This command will allow you to block all messages from a specific user in
     * chat and whispers if you do not wish to see their comments.
     */
    block(channel: string, username: string): Promise<void>;
    /**
     * Single message removal on a channel.
     */
    delete(channel: string, targetMessageId: string): Promise<void>;
    /**
     * This command will allow the Broadcaster and chat moderators to completely
     * wipe the previous chat history.
     */
    clear(channel: string): Promise<NoticeMessages>;
    /**
     * Allows you to change the color of your username.
     */
    color(channel: string, color: string): Promise<NoticeMessages>;
    /**
     * An Affiliate and Partner command that runs a commercial for all of your
     * viewers.
     */
    commercial(channel: string, length: 30 | 60 | 90 | 120 | 150 | 180): Promise<NoticeMessages>;
    /**
     * This command allows you to set your room so only messages that are 100%
     * emotes are allowed.
     */
    emoteOnly(channel: string): Promise<NoticeMessages>;
    /**
     * This command allows you to disable emote only mode if you previously
     * enabled it.
     */
    emoteOnlyOff(channel: string): Promise<NoticeMessages>;
    /**
     * This command allows you or your mods to restrict chat to all or some of
     * your followers, based on how long they’ve followed.
     * @param period - Follow time from 0 minutes (all followers) to 3 months.
     */
    followersOnly(channel: string, period: string): Promise<NoticeMessages>;
    /**
     * This command will disable followers only mode if it was previously enabled
     * on the channel.
     */
    followersOnlyOff(channel: string): Promise<NoticeMessages>;
    help(channel: string): Promise<NoticeMessages>;
    /**
     * This command will allow you to host another channel on yours.
     */
    host(channel: string, hostChannel: string): Promise<NoticeMessages>;
    /**
     * Adds a stream marker (with an optional description, max 140 characters) at
     * the current timestamp. You can use markers in the Highlighter for easier
     * editing.
     */
    marker(channel: string, description: string): Promise<void>;
    /**
     * This command will color your text based on your chat name color.
     */
    me(channel: string, text: string): Promise<void>;
    /**
     * This command will allow you to promote a user to a channel moderator.
     */
    mod(channel: string, username: string): Promise<NoticeMessages>;
    /**
     * This command will display a list of all chat moderators for that specific
     * channel.
     */
    mods(channel: string): Promise<NoticeMessages>;
    /**
     * @deprecated
     */
    r9K(channel: string): Promise<NoticeMessages>;
    /**
     * @deprecated
     */
    r9KOff(channel: string): Promise<NoticeMessages>;
    /**
     * This command will send the viewer to another live channel.
     */
    raid(channel: string, raidChannel: string): Promise<void>;
    /**
     * This command allows you to set a limit on how often users in the chat room
     * are allowed to send messages (rate limiting).
     */
    slow(channel: string, seconds: string): Promise<NoticeMessages>;
    /**
     * This command allows you to disable slow mode if you had previously set it.
     */
    slowOff(channel: string): Promise<NoticeMessages>;
    /**
     * This command allows you to set your room so only users subscribed to you
     * can talk in the chat room. If you don't have the subscription feature it
     * will only allow the Broadcaster and the channel moderators to talk in the
     * chat room.
     */
    subscribers(channel: string): Promise<NoticeMessages>;
    /**
     * This command allows you to disable subscribers only chat room if you
     * previously enabled it.
     */
    subscribersOff(channel: string): Promise<NoticeMessages>;
    /**
     * This command allows you to temporarily ban someone from the chat room for
     * 10 minutes by default. This will be indicated to yourself and the
     * temporarily banned subject in chat on a successful temporary ban. A new
     * timeout command will overwrite an old one.
     */
    timeout(channel: string, username: string, timeout?: number): Promise<NoticeMessages>;
    /**
     * This command will allow you to lift a permanent ban on a user from the
     * chat room. You can also use this command to end a ban early; this also
     * applies to timeouts.
     */
    unban(channel: string, username: string): Promise<NoticeMessages>;
    /**
     * This command will allow you to remove users from your block list that you
     * previously added.
     */
    unblock(channel: string, username: string): Promise<void>;
    /**
     * Using this command will revert the embedding from hosting a channel and
     * return it to its normal state.
     */
    unhost(channel: string): Promise<NoticeMessages>;
    /**
     * This command will allow you to demote an existing moderator back to viewer
     * status (removing their moderator abilities).
     */
    unmod(channel: string, username: string): Promise<NoticeMessages>;
    /**
     * This command will cancel the raid.
     */
    unraid(channel: string): Promise<NoticeMessages>;
    /**
     * This command will grant VIP status to a user.
     */
    unvip(channel: string, username: string): Promise<void>;
    /**
     * This command will grant VIP status to a user.
     */
    vip(channel: string, username: string): Promise<void>;
    /**
     * This command will display a list of VIPs for that specific channel.
     */
    vips(channel: string): Promise<void>;
    /**
     * This command sends a private message to another user on Twitch.
     */
    whisper(username: string, message: string): Promise<void>;
    private _handleConnect;
    private _handleDisconnect;
    private _handleReconnect;
    private _handleClientAuthenticationFailure;
    private _handleClientMessage;
    private _handleJoinsAfterConnect;
    private _getChannels;
    private _getChannelState;
    private _setChannelState;
    private _removeChannelState;
    private _clearChannelState;
    private _parseMessageForEmitter;
    private _emit;
}
type QueryParams = {
    /** Any query parameters you want to add to your request. */
    [key: string]: string | number | boolean;
};
interface BodyParams {
    [key: string]: any;
}
type FetchOptions<Query = QueryParams, Body = BodyParams> = Omit<RequestInit, "body"> & {
    search?: Query;
} & {
    body?: Body;
};
type ApiOptions = {
    token: string;
    clientId: string;
    log?: LoggerOptions;
    onAuthenticationFailure?: () => Promise<string>;
};
declare enum ApiReadyStates {
    "NOT_READY" = 0,
    "READY" = 1,
    "INITIALIZED" = 2
}
type ApiFetchOptions = FetchOptions;
/**
 * Make requests to Twitch API.
 *
 * ## Initializing
 *
 * ```js
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2'
 * const { api } = new TwitchJs({ token, clientId })
 * ```
 *
 * ## Making requests
 *
 * By default, the API client makes requests to the
 * [Helix API](https://dev.twitch.tv/docs/api), and exposes [[Api.get]],
 * [[Api.post]] and [[Api.put]] methods. Query and body parameters are provided
 * via `options.search` and `options.body` properties, respectively.
 *
 * ### Examples
 *
 * #### Get bits leaderboard
 * ```js
 * api
 *   .get('bits/leaderboard', { search: { user_id: '44322889' } })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 *
 * #### Get the latest Overwatch live streams
 * ```
 * api
 *   .get('streams', { search: { game_id: '1234' } })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 *
 * #### Start a channel commercial
 * ```
 * api
 *   .post('/channels/commercial', {
 *     body: { broadcaster_id: '44322889', length: 30 },
 *   })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 */
declare class Api {
    private _options;
    private _log;
    private _readyState;
    private _status;
    constructor(options: Partial<ApiOptions>);
    get readyState(): ApiReadyStates;
    get status(): ApiValidateResponse;
    /**
     * Update client options.
     */
    updateOptions(options: Partial<ApiOptions>): void;
    /**
     * Initialize API client and retrieve status.
     * @see https://dev.twitch.tv/docs/v5/#root-url
     */
    initialize(newOptions?: Partial<ApiOptions>): Promise<void>;
    /**
     * Check if current credentials include `scope`.
     * @see https://dev.twitch.tv/docs/authentication/#twitch-api-v5
     */
    hasScope(/** Scope to check */
    scope: string): Promise<boolean>;
    /**
     * GET endpoint.
     *
     * @example <caption>Get user follows (Helix)</caption>
     * ```
     * api.get('users/follows', { search: { to_id: '23161357' } })
     *   .then(response => {
     *     // Do stuff with response ...
     *   })
     * ```
     */
    get<T = any>(endpoint?: string, options?: ApiFetchOptions): Promise<T>;
    /**
     * POST endpoint.
     */
    post<T = any>(endpoint: string, options?: ApiFetchOptions): Promise<T>;
    /**
     * PUT endpoint.
     */
    put<T = any>(endpoint: string, options?: ApiFetchOptions): Promise<T>;
    private _getAuthenticationHeaders;
    private _handleFetch;
    private _handleAuthenticationFailure;
}
type BaseTwitchJsOptions = {
    clientId?: string;
    token?: string;
    username?: string;
    log?: LoggerOptions;
    onAuthenticationFailure?: () => Promise<string>;
};
type IndividualClassOptions = {
    chat?: ChatOptions;
    api?: ApiOptions;
};
type TwitchJsOptions = BaseTwitchJsOptions & IndividualClassOptions;
/**
 * Interact with chat and make requests to Twitch API.
 *
 * ## Initializing
 * ```
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2'
 * const username = 'ronni'
 * const twitchJs = new TwitchJs({ token, clientId, username })
 *
 * twitchJs.chat.connect().then(globalUserState => {
 *   // Do stuff ...
 * })
 *
 * twitchJs.api.get('channel').then(response => {
 *   // Do stuff ...
 * })
 * ```
 */
declare class TwitchJs {
    chat: Chat;
    api: Api;
    static Chat: typeof Chat;
    static Api: typeof Api;
    constructor(options: TwitchJsOptions);
    /**
     * Update client options.
     */
    /**
     * Update client options.
     */
    updateOptions(options: IndividualClassOptions): void;
}
export { TwitchJs as default, Chat, Api, ApiValidateResponse, Capabilities, MembershipCommands, TagCommands, OtherCommands, BaseCommands, Commands, ChatEvents, ChatCommands, KnownNoticeMessageIds, KnownNoticeMessageIdsUpperCase, NoticeEvents, PrivateMessageEvents, KnownUserNoticeMessageIds, UserNoticeEvents, Events, BooleanBadges, NumberBadges, Badges, EmoteTag, BaseTags, ClearChatTags, ClearMessageTags, GlobalUserStateTags, RoomStateTags, NoticeTags, UserStateTags, PrivateMessageTags, UserNoticeTags, Tags, Message, BaseMessage, JoinMessage, PartMessage, ModeModGainedMessage, ModeModLostMessage, ModeMessages, NamesMessage, NamesEndMessage, GlobalUserStateMessage, ClearChatUserBannedMessage, ClearChatMessage, ClearChatMessages, ClearMessageMessage, HostTargetMessage, RoomStateMessage, NoticeMessage, NoticeRoomModsMessage, NoticeMessages, UserStateMessage, PrivateMessage, PrivateMessageWithBits, HostingPrivateMessage, HostingWithViewersPrivateMessage, HostingAutoPrivateMessage, PrivateMessages, MessageParameters, AnonymousGiftPaidUpgradeParameters, GiftPaidUpgradeParameters, RaidParameters, ResubscriptionParameters, RitualParameters, SubscriptionGiftCommunityParameters, SubscriptionGiftParameters, SubscriptionParameters, UserNoticeMessageParameters, UserNoticeMessage, UserNoticeAnonymousGiftPaidUpgradeMessage, UserNoticeGiftPaidUpgradeMessage, UserNoticeRaidMessage, UserNoticeResubscriptionMessage, UserNoticeRitualMessage, UserNoticeSubscriptionGiftCommunityMessage, UserNoticeSubscriptionGiftMessage, UserNoticeSubscriptionMessage, UserNoticeMessages, Messages, TwitchJsOptions };
