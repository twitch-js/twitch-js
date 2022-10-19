import { ClearChatMessages, Events, HostingAutoPrivateMessage, HostingPrivateMessage, HostingWithViewersPrivateMessage, HostTargetMessage, JoinMessage, Messages, ModeMessages, NamesEndMessage, NamesMessage, NoticeMessage, NoticeMessages, NoticeRoomModsMessage, PartMessage, PrivateMessages, PrivateMessageWithBits, RoomStateMessage, RoomStateTags, UserNoticeAnonymousGiftPaidUpgradeMessage, UserNoticeGiftPaidUpgradeMessage, UserNoticeMessages, UserNoticeRaidMessage, UserNoticeResubscriptionMessage, UserNoticeRitualMessage, UserNoticeSubscriptionGiftCommunityMessage, UserNoticeSubscriptionGiftMessage, UserNoticeSubscriptionMessage, UserStateMessage, UserStateTags } from '../twitch';
import { LoggerOptions } from '../utils/logger';
import { ClientEventTypes, BaseClientEvents } from '../Client/client-types';
export declare type ChatOptions = {
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
export declare type ClientOptions = {
    username?: string;
    token?: string;
    isKnown: boolean;
    isVerified: boolean;
    server: string;
    port: number;
    ssl: boolean;
    log?: LoggerOptions;
};
export declare enum ChatReadyStates {
    'WAITING' = 0,
    'CONNECTING' = 1,
    'RECONNECTING' = 2,
    'CONNECTED' = 3,
    'DISCONNECTING' = 4,
    'DISCONNECTED' = 5
}
export declare type ChannelState = {
    roomState: RoomStateTags;
    userState?: UserStateTags;
};
export declare type ChannelStates = Record<string, ChannelState>;
export declare enum NoticeCompounds {
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
export declare enum PrivateMessageCompounds {
    CHEER = "PRIVMSG/CHEER",
    HOSTED_WITHOUT_VIEWERS = "PRIVMSG/HOSTED_WITHOUT_VIEWERS",
    HOSTED_WITH_VIEWERS = "PRIVMSG/HOSTED_WITH_VIEWERS",
    HOSTED_AUTO = "PRIVMSG/HOSTED_AUTO"
}
export declare enum UserNoticeCompounds {
    ANON_GIFT_PAID_UPGRADE = "USERNOTICE/ANON_GIFT_PAID_UPGRADE",
    GIFT_PAID_UPGRADE = "USERNOTICE/GIFT_PAID_UPGRADE",
    RAID = "USERNOTICE/RAID",
    RESUBSCRIPTION = "USERNOTICE/RESUBSCRIPTION",
    RITUAL = "USERNOTICE/RITUAL",
    SUBSCRIPTION = "USERNOTICE/SUBSCRIPTION",
    SUBSCRIPTION_GIFT = "USERNOTICE/SUBSCRIPTION_GIFT",
    SUBSCRIPTION_GIFT_COMMUNITY = "USERNOTICE/SUBSCRIPTION_GIFT_COMMUNITY"
}
export declare type EventTypes = Omit<ClientEventTypes, BaseClientEvents.ALL> & {
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
    [eventName: string]: [Messages];
};
