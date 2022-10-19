import EventEmitter from 'eventemitter3';
import { CancelablePromise } from 'p-event';
import { Commands, Events, NoticeMessages } from '../twitch';
import { EventTypes, ChatOptions, NoticeCompounds, PrivateMessageCompounds, UserNoticeCompounds } from './chat-types';
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
        CHEER: import("../twitch").PrivateMessageEvents.CHEER;
        HOSTED_WITHOUT_VIEWERS: import("../twitch").PrivateMessageEvents.HOSTED_WITHOUT_VIEWERS;
        HOSTED_WITH_VIEWERS: import("../twitch").PrivateMessageEvents.HOSTED_WITH_VIEWERS;
        HOSTED_AUTO: import("../twitch").PrivateMessageEvents.HOSTED_AUTO;
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
        RAW: import("../twitch").ChatEvents.RAW;
        ALL: import("../twitch").ChatEvents.ALL;
        CONNECTED: import("../twitch").ChatEvents.CONNECTED;
        DISCONNECTED: import("../twitch").ChatEvents.DISCONNECTED;
        RECONNECT: import("../twitch").ChatEvents.RECONNECT;
        AUTHENTICATED: import("../twitch").ChatEvents.AUTHENTICATED;
        AUTHENTICATION_FAILED: import("../twitch").ChatEvents.AUTHENTICATION_FAILED;
        GLOBALUSERSTATE: import("../twitch").ChatEvents.GLOBALUSERSTATE;
        ERROR_ENCOUNTERED: import("../twitch").ChatEvents.ERROR_ENCOUNTERED;
        PARSE_ERROR_ENCOUNTERED: import("../twitch").ChatEvents.PARSE_ERROR_ENCOUNTERED;
        MOD_GAINED: import("../twitch").ChatEvents.MOD_GAINED;
        MOD_LOST: import("../twitch").ChatEvents.MOD_LOST;
        USER_BANNED: import("../twitch").ChatEvents.USER_BANNED;
        HOSTED: import("../twitch").ChatEvents.HOSTED;
        CLEAR_CHAT: import("../twitch").BaseCommands.CLEAR_CHAT;
        CLEAR_MESSAGE: import("../twitch").BaseCommands.CLEAR_MESSAGE;
        HOST_TARGET: import("../twitch").BaseCommands.HOST_TARGET;
        NOTICE: import("../twitch").BaseCommands.NOTICE;
        ROOM_STATE: import("../twitch").BaseCommands.ROOM_STATE;
        USER_NOTICE: import("../twitch").BaseCommands.USER_NOTICE;
        USER_STATE: import("../twitch").BaseCommands.USER_STATE;
        WELCOME: import("../twitch").OtherCommands.WELCOME;
        PING: import("../twitch").OtherCommands.PING;
        PONG: import("../twitch").OtherCommands.PONG;
        WHISPER: import("../twitch").OtherCommands.WHISPER;
        PRIVATE_MESSAGE: import("../twitch").TagCommands.PRIVATE_MESSAGE;
        JOIN: import("../twitch").MembershipCommands.JOIN;
        MODE: import("../twitch").MembershipCommands.MODE;
        PART: import("../twitch").MembershipCommands.PART;
        NAMES: import("../twitch").MembershipCommands.NAMES;
        NAMES_END: import("../twitch").MembershipCommands.NAMES_END;
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
        roomState: import("../twitch").RoomStateTags;
        userState: import("../twitch").UserStateTags | undefined;
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
export default Chat;
