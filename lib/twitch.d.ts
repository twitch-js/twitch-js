declare type DistributeKeys<T> = {
    [P in keyof T]: P;
};
/**
 * Validate response
 * @see https://dev.twitch.tv/docs/authentication#validating-requests
 */
export declare type ApiValidateResponse = {
    client_id: string;
    login: string;
    scopes: string[];
    user_id: string;
    expires_in: number;
};
/**
 * @see https://dev.twitch.tv/docs/irc/guide#twitch-irc-capabilities
 */
export declare enum Capabilities {
    'tags' = "twitch.tv/tags",
    'commands' = "twitch.tv/commands",
    'membership' = "twitch.tv/membership"
}
/**
 * @see https://dev.twitch.tv/docs/irc/membership
 */
export declare enum MembershipCommands {
    JOIN = "JOIN",
    MODE = "MODE",
    PART = "PART",
    NAMES = "353",
    NAMES_END = "366"
}
/**
 * @see https://dev.twitch.tv/docs/irc/tags
 */
export declare enum TagCommands {
    CLEAR_CHAT = "CLEARCHAT",
    GLOBALUSERSTATE = "GLOBALUSERSTATE",
    PRIVATE_MESSAGE = "PRIVMSG",
    ROOM_STATE = "ROOMSTATE",
    USER_NOTICE = "USERNOTICE",
    USER_STATE = "USERSTATE"
}
export declare enum OtherCommands {
    WELCOME = "001",
    PING = "PING",
    PONG = "PONG",
    WHISPER = "WHISPER"
}
/**
 * @see https://dev.twitch.tv/docs/irc/commands
 */
export declare enum BaseCommands {
    CLEAR_CHAT = "CLEARCHAT",
    CLEAR_MESSAGE = "CLEARMSG",
    HOST_TARGET = "HOSTTARGET",
    NOTICE = "NOTICE",
    RECONNECT = "RECONNECT",
    ROOM_STATE = "ROOMSTATE",
    USER_NOTICE = "USERNOTICE",
    USER_STATE = "USERSTATE"
}
export declare enum Commands {
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
export declare enum ChatEvents {
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
export declare enum ChatCommands {
    BAN = "ban",
    BLOCK = "block",
    CLEAR = "clear",
    COLOR = "color",
    COMMERCIAL = "commercial",
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
export declare enum KnownNoticeMessageIds {
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
export declare const KnownNoticeMessageIdsUpperCase: Record<"ALREADY_BANNED" | "ALREADY_EMOTE_ONLY_OFF" | "ALREADY_EMOTE_ONLY_ON" | "ALREADY_R9K_OFF" | "ALREADY_R9K_ON" | "ALREADY_SUBS_OFF" | "ALREADY_SUBS_ON" | "BAD_HOST_HOSTING" | "BAD_MOD_MOD" | "BAN_SUCCESS" | "BAD_UNBAN_NO_BAN" | "COLOR_CHANGED" | "CMDS_AVAILABLE" | "COMMERCIAL_SUCCESS" | "EMOTE_ONLY_OFF" | "EMOTE_ONLY_ON" | "FOLLOWERS_OFF" | "FOLLOWERS_ON" | "FOLLOWERS_ONZERO" | "HOST_OFF" | "HOST_ON" | "HOSTS_REMAINING" | "MSG_CHANNEL_SUSPENDED" | "MOD_SUCCESS" | "NOT_HOSTING" | "R9K_OFF" | "R9K_ON" | "ROOM_MODS" | "SLOW_OFF" | "SLOW_ON" | "SUBS_OFF" | "SUBS_ON" | "TIMEOUT_SUCCESS" | "UNBAN_SUCCESS" | "UNMOD_SUCCESS" | "UNRAID_SUCCESS" | "UNRECOGNIZED_CMD", string>;
export declare const NoticeEvents: DistributeKeys<typeof KnownNoticeMessageIds>;
export declare type NoticeEvents = keyof typeof NoticeEvents;
export declare enum PrivateMessageEvents {
    CHEER = "CHEER",
    HOSTED_WITHOUT_VIEWERS = "HOSTED_WITHOUT_VIEWERS",
    HOSTED_WITH_VIEWERS = "HOSTED_WITH_VIEWERS",
    HOSTED_AUTO = "HOSTED_AUTO"
}
/**
 * @see https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags
 */
export declare enum KnownUserNoticeMessageIds {
    ANON_GIFT_PAID_UPGRADE = "anongiftpaidupgrade",
    GIFT_PAID_UPGRADE = "giftpaidupgrade",
    RAID = "raid",
    RESUBSCRIPTION = "resub",
    RITUAL = "ritual",
    SUBSCRIPTION = "sub",
    SUBSCRIPTION_GIFT = "subgift",
    SUBSCRIPTION_GIFT_COMMUNITY = "submysterygift"
}
export declare const UserNoticeEvents: DistributeKeys<typeof KnownUserNoticeMessageIds>;
export declare type UserNoticeEvents = keyof typeof UserNoticeEvents;
export declare const Events: {
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
export declare type Events = keyof DistributeKeys<typeof Events>;
export declare enum BooleanBadges {
    'admin' = 0,
    'broadcaster' = 1,
    'globalMod' = 2,
    'moderator' = 3,
    'partner' = 4,
    'premium' = 5,
    'staff' = 6,
    'subGifter' = 7,
    'turbo' = 8,
    'vip' = 9
}
export declare enum NumberBadges {
    'bits' = 0,
    'bitsLeader' = 1,
    'subscriber' = 2
}
export declare type Badges = {
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
    bits: number;
    bitsLeader: number;
    subscriber: number;
} | {
    [key: string]: string;
};
export declare type EmoteTag = {
    id: string;
    start: number;
    end: number;
};
/**
 * Tags
 */
export interface BaseTags {
    [key: string]: any;
}
/**
 * CLEARCHAT tags
 * @see https://dev.twitch.tv/docs/irc/tags#clearchat-twitch-tags
 */
export interface ClearChatTags extends BaseTags {
    banReason?: string;
    banDuration?: number;
}
/**
 * CLEARMSG tags
 * @see https://dev.twitch.tv/docs/irc/tags#clearmsg-twitch-tags
 */
export interface ClearMessageTags extends BaseTags {
    login: string;
    targetMsgId: string;
}
/**
 * GLOBALUSERSTATE tags
 * @see https://dev.twitch.tv/docs/irc/tags#globaluserstate-twitch-tags
 */
export interface GlobalUserStateTags extends BaseTags {
    emoteSets: string[];
    userType?: string;
    username: string;
}
/**
 * ROOMSTATE Tag
 * @see https://dev.twitch.tv/docs/irc/tags#roomstate-twitch-tags
 */
export interface RoomStateTags extends BaseTags {
    followersOnly?: number | boolean;
    broadcasterLang?: string;
    slow?: number;
    emoteOnly?: boolean;
    r9k?: boolean;
    subsOnly?: boolean;
}
export interface NoticeTags extends BaseTags {
    msgId: KnownNoticeMessageIds;
}
/**
 * USERSTATE tags
 * @see https://dev.twitch.tv/docs/irc/tags#userstate-twitch-tags
 */
export interface UserStateTags extends BaseTags {
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
export interface PrivateMessageTags extends UserStateTags {
    bits?: string;
}
/**
 * USERNOTICE tags
 * @see https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags
 */
export interface UserNoticeTags extends UserStateTags {
    id: string;
    login: string;
    msgId: KnownUserNoticeMessageIds;
    roomId: string;
    systemMsg: string;
    tmiSentTs: string;
}
export declare type Tags = ClearChatTags | GlobalUserStateTags | RoomStateTags | UserStateTags | PrivateMessageTags | NoticeTags | UserNoticeTags;
/**
 * Messages
 */
export interface Message {
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
export interface BaseMessage extends Message {
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
export interface JoinMessage extends Omit<BaseMessage, 'message'> {
    command: Commands.JOIN;
    event: Commands.JOIN;
}
/**
 * Depart from a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#part-twitch-membership
 */
export interface PartMessage extends Omit<BaseMessage, 'message'> {
    command: Commands.PART;
    event: Commands.PART;
}
/**
 * Gain/lose moderator (operator) status in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#mode-twitch-membership
 */
export interface ModeModGainedMessage extends BaseMessage {
    command: Commands.MODE;
    event: ChatEvents.MOD_GAINED;
    message: '+o';
    isModerator: true;
}
export interface ModeModLostMessage extends BaseMessage {
    command: Commands.MODE;
    event: ChatEvents.MOD_LOST;
    message: '-o';
    isModerator: false;
}
export declare type ModeMessages = ModeModGainedMessage | ModeModLostMessage;
/**
 * List current chatters in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
 */
export interface NamesMessage extends Omit<BaseMessage, 'message'> {
    command: Commands.NAMES;
    event: Commands.NAMES;
    usernames: string[];
}
/**
 * End of list current chatters in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
 */
export interface NamesEndMessage extends Omit<BaseMessage, 'message'> {
    command: Commands.NAMES_END;
    event: Commands.NAMES_END;
}
/**
 * GLOBALUSERSTATE message
 * @see https://dev.twitch.tv/docs/irc/tags#globaluserstate-twitch-tags
 */
export interface GlobalUserStateMessage extends BaseMessage {
    command: Commands.GLOBALUSERSTATE;
    event: Commands.GLOBALUSERSTATE;
    tags: GlobalUserStateTags;
}
/**
 * Temporary or permanent ban on a channel.
 * @see https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
 * @see https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags
 */
export interface ClearChatUserBannedMessage extends Omit<BaseMessage, 'message'> {
    command: Commands.CLEAR_CHAT;
    event: ChatEvents.USER_BANNED;
    tags: ClearChatTags;
}
/**
 * All chat is cleared (deleted).
 * @see https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
 * @see https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags
 */
export interface ClearChatMessage extends Omit<BaseMessage, 'tags' | 'username' | 'message'> {
    command: Commands.CLEAR_CHAT;
    event: Commands.CLEAR_CHAT;
}
export declare type ClearChatMessages = ClearChatMessage | ClearChatUserBannedMessage;
/**
 * Single message removal on a channel.
 * @see https://dev.twitch.tv/docs/irc/commands#clearmsg-twitch-commands
 * @see https://dev.twitch.tv/docs/irc/tags#clearmsg-twitch-tags
 */
export interface ClearMessageMessage extends Omit<BaseMessage, 'message'> {
    command: Commands.CLEAR_MESSAGE;
    event: Commands.CLEAR_MESSAGE;
    tags: ClearMessageTags;
    targetMessageId: string;
}
/**
 * Host starts or stops a message.
 * @see https://dev.twitch.tv/docs/irc/commands/#hosttarget-twitch-commands
 */
export interface HostTargetMessage extends Omit<BaseMessage, 'message'> {
    command: Commands.HOST_TARGET;
    event: ChatEvents.HOST_ON | ChatEvents.HOST_OFF;
    numberOfViewers?: number;
}
/**
 * When a user joins a channel or a room setting is changed.
 * @see https://dev.twitch.tv/docs/irc/tags#roomstate-twitch-tags
 */
export interface RoomStateMessage extends BaseMessage {
    command: Commands.ROOM_STATE;
    event: Commands.ROOM_STATE;
    tags: RoomStateTags;
}
/**
 * Base NOTICE message
 */
export interface NoticeMessage extends Omit<BaseMessage, 'event'> {
    command: Commands.NOTICE;
    event: Exclude<NoticeEvents, typeof NoticeEvents.ROOM_MODS>;
    tags: NoticeTags;
    username: 'tmi.twitch.tv' | string;
}
/**
 * NOTICE/ROOM_MODS message
 */
export interface NoticeRoomModsMessage extends Omit<NoticeMessage, 'event'> {
    event: typeof NoticeEvents.ROOM_MODS;
    /** The moderators of this channel. */
    mods: string[];
}
/**
 * NOTICE message
 * @see https://dev.twitch.tv/docs/irc/commands/#msg-id-tags-for-the-notice-commands-capability
 */
export declare type NoticeMessages = NoticeMessage | NoticeRoomModsMessage;
/**
 * USERSTATE message
 */
export interface UserStateMessage extends BaseMessage {
    command: Commands.USER_STATE;
    event: Commands.USER_STATE;
    tags: UserStateTags;
}
/**
 * PRIVMSG messages
 */
interface BasePrivateMessage extends Omit<UserStateMessage, 'command' | 'event'> {
    command: Commands.PRIVATE_MESSAGE;
}
/**
 * When a user joins a channel or sends a PRIVMSG to a channel.
 */
export interface PrivateMessage extends BasePrivateMessage {
    event: Commands.PRIVATE_MESSAGE;
}
export interface PrivateMessageWithBits extends BasePrivateMessage {
    event: ChatEvents.CHEER;
    bits: number;
}
interface BaseHostingPrivateMessage extends Omit<BasePrivateMessage, 'tags'> {
}
/**
 * When a user hosts your channel while connected as broadcaster.
 */
export interface HostingPrivateMessage extends BaseHostingPrivateMessage {
    event: ChatEvents.HOSTED_WITHOUT_VIEWERS;
    tags: {
        displayName: string;
    };
}
export interface HostingWithViewersPrivateMessage extends BaseHostingPrivateMessage {
    event: ChatEvents.HOSTED_WITH_VIEWERS;
    tags: {
        displayName: string;
    };
    numberOfViewers?: number;
}
export interface HostingAutoPrivateMessage extends BaseHostingPrivateMessage {
    event: ChatEvents.HOSTED_AUTO;
    tags: {
        displayName: string;
    };
    numberOfViewers?: number;
}
export declare type PrivateMessages = PrivateMessage | PrivateMessageWithBits | HostingPrivateMessage | HostingWithViewersPrivateMessage | HostingAutoPrivateMessage;
export interface MessageParameters {
    [key: string]: string | number | boolean | Date | undefined;
}
export interface AnonymousGiftPaidUpgradeParameters extends MessageParameters {
}
export interface GiftPaidUpgradeParameters extends MessageParameters {
    promoGiftTotal: number;
    promoName: string;
    senderLogin: string;
    senderName: string;
}
export interface RaidParameters extends MessageParameters {
    displayName: string;
    login: string;
    viewerCount: number;
}
export interface ResubscriptionParameters extends MessageParameters {
    months: number;
    subPlan: string;
    subPlanName: string;
}
export interface RitualParameters extends MessageParameters {
    ritualName: string;
}
export interface SubscriptionGiftCommunityParameters extends MessageParameters {
    massGiftCount: number;
    senderCount: number;
    subPlan: number;
}
export interface SubscriptionGiftParameters extends MessageParameters {
    months: number;
    subPlan: string;
    subPlanName: string;
    recipientDisplayName: string;
    recipientId: string;
    recipientName: string;
}
export interface SubscriptionParameters extends MessageParameters {
    months: 1;
    subPlan: string;
    subPlanName: string;
}
export declare type UserNoticeMessageParameters = AnonymousGiftPaidUpgradeParameters | GiftPaidUpgradeParameters | RaidParameters | ResubscriptionParameters | RitualParameters | SubscriptionGiftCommunityParameters | SubscriptionGiftParameters | SubscriptionParameters;
export interface UserNoticeMessage extends Omit<BaseMessage, 'event' | 'parameters'> {
    command: Commands.USER_NOTICE;
    event: UserNoticeEvents;
    tags: UserNoticeTags;
    parameters: MessageParameters;
    systemMessage: string;
}
/**
 * On anonymous gifted subscription paid upgrade to a channel.
 */
export interface UserNoticeAnonymousGiftPaidUpgradeMessage extends UserNoticeMessage {
    command: Commands.USER_NOTICE;
    event: typeof UserNoticeEvents.ANON_GIFT_PAID_UPGRADE;
    parameters: AnonymousGiftPaidUpgradeParameters;
}
/**
 * On gifted subscription paid upgrade to a channel.
 */
export interface UserNoticeGiftPaidUpgradeMessage extends Omit<UserNoticeMessage, 'parameters'> {
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
export interface UserNoticeRaidMessage extends Omit<UserNoticeMessage, 'parameters'> {
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
export interface UserNoticeResubscriptionMessage extends Omit<UserNoticeMessage, 'parameters'> {
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
export interface UserNoticeRitualMessage extends Omit<UserNoticeMessage, 'parameters'> {
    event: typeof UserNoticeEvents.RITUAL;
    parameters: {
        ritualName: string;
    };
}
/**
 * On subscription gift to a channel community.
 */
export interface UserNoticeSubscriptionGiftCommunityMessage extends Omit<UserNoticeMessage, 'parameters'> {
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
export interface UserNoticeSubscriptionGiftMessage extends Omit<UserNoticeMessage, 'parameters'> {
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
export interface UserNoticeSubscriptionMessage extends Omit<UserNoticeMessage, 'event' | 'parameters'> {
    event: typeof UserNoticeEvents.SUBSCRIPTION;
    parameters: {
        months: 1;
        subPlan: string;
        subPlanName: string;
    };
}
export declare type UserNoticeMessages = UserNoticeAnonymousGiftPaidUpgradeMessage | UserNoticeGiftPaidUpgradeMessage | UserNoticeRaidMessage | UserNoticeResubscriptionMessage | UserNoticeRitualMessage | UserNoticeSubscriptionGiftCommunityMessage | UserNoticeSubscriptionGiftMessage | UserNoticeSubscriptionMessage;
export declare type Messages = BaseMessage | JoinMessage | PartMessage | ModeMessages | NamesMessage | NamesEndMessage | GlobalUserStateMessage | ClearChatMessages | ClearMessageMessage | HostTargetMessage | RoomStateMessage | NoticeMessages | UserStateMessage | PrivateMessages | UserNoticeMessages;
export {};
