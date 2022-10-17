import { BaseMessage, ClearChatMessages, ClearMessageMessage, GlobalUserStateMessage, HostTargetMessage, JoinMessage, ModeMessages, NamesEndMessage, NamesMessage, NoticeMessages, PartMessage, PrivateMessages, RoomStateMessage, UserNoticeMessages, UserStateMessage } from '../../../twitch';
export declare const base: (rawMessages: string, username?: string) => BaseMessage[];
/**
 * Join a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#join-twitch-membership
 */
export declare const joinMessage: (baseMessage: BaseMessage) => JoinMessage;
/**
 * Join or depart from a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#join-twitch-membership
 * @see https://dev.twitch.tv/docs/irc/membership/#part-twitch-membership
 */
export declare const partMessage: (baseMessage: BaseMessage) => PartMessage;
/**
 * Gain/lose moderator (operator) status in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#mode-twitch-membership
 */
export declare const modeMessage: (baseMessage: BaseMessage) => ModeMessages;
/**
 * List current chatters in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
 */
export declare const namesMessage: (baseMessage: BaseMessage) => NamesMessage;
/**
 * End of list current chatters in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
 */
export declare const namesEndMessage: (baseMessage: BaseMessage) => NamesEndMessage;
/**
 * GLOBALUSERSTATE message
 */
export declare const globalUserStateMessage: (baseMessage: BaseMessage) => GlobalUserStateMessage;
/**
 * Temporary or permanent ban on a channel.
 * @see https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
 *
 * All chat is cleared (deleted).
 * @see https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags
 */
export declare const clearChatMessage: (baseMessage: BaseMessage) => ClearChatMessages;
/**
 * Single message removal on a channel.
 * @see https://dev.twitch.tv/docs/irc/commands#clearmsg-twitch-commands
 */
export declare const clearMessageMessage: (baseMessage: BaseMessage) => ClearMessageMessage;
/**
 * Host starts or stops a message.
 * @see https://dev.twitch.tv/docs/irc/commands/#hosttarget-twitch-commands
 */
export declare const hostTargetMessage: (baseMessage: BaseMessage) => HostTargetMessage;
/**
 * When a user joins a channel or a room setting is changed.
 */
export declare const roomStateMessage: (baseMessage: BaseMessage) => RoomStateMessage;
/**
 * NOTICE/ROOM_MODS message
 * @see https://dev.twitch.tv/docs/irc/commands/#msg-id-tags-for-the-notice-commands-capability
 */
export declare const noticeMessage: (baseMessage: BaseMessage) => NoticeMessages;
/**
 * USERSTATE message
 * When a user joins a channel or sends a PRIVMSG to a channel.
 */
export declare const userStateMessage: (baseMessage: BaseMessage) => UserStateMessage;
/**
 * PRIVMSG message
 * When a user joins a channel or sends a PRIVMSG to a channel.
 * When a user cheers a channel.
 * When a user hosts your channel while connected as broadcaster.
 */
export declare const privateMessage: (baseMessage: BaseMessage) => PrivateMessages;
/**
 * USERNOTICE message
 */
export declare const userNoticeMessage: (baseMessage: BaseMessage) => UserNoticeMessages;
export default base;
