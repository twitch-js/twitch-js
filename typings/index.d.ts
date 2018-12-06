//------------------//
//* ./src/index.js *//
//------------------//

/**
 * @class
 * @public
 * @classdesc TwitchJs client
 * @example <caption>Instantiating TwitchJS</caption>
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const username = 'ronni'
 * const twitchJs = new TwitchJs({ token, username })
 * twitchJs.chat.connect().then(globalUserState => {
 *   // Do stuff ...
 * })
 * twitchJs.api.get('channel').then(response => {
 *   // Do stuff ...
 * })
 */
declare class TwitchJs {
    constructor(options: {
        token: string;
        username: string;
        clientId: string;
        log: any;
        onAuthenticationFailure?: ()=>any;
        chat?: ChatOptions;
        api?: ApiOptions;
    });

    /**
     * @public
     * @property {Chat} chat
     */
    chat: Chat;

    /**
     * @public
     * @property {Object} chatConstants
     */
    chatConstants: any;

    /**
     * @public
     * @property {Api} api
     */
    api: Api;

    /**
     * @function TwitchJs#updateOptions
     * @desc Update client options.
     * @param {Object} options
     * @param {ChatOptions} [options.chat] New chat client options.
     * @param {ApiOptions} [options.api] New API client options.
     */
    updateOptions(options: {
        chat?: ChatOptions;
        api?: ApiOptions;
    }): void;

}

//-----------------------//
//* ./src/Chat/index.js *//
//-----------------------//

/**
 * @typedef {object} UserNoticeMessageParam
 * @property {?string} displayName
 * @property {?string} login
 * @property {?string} months
 * @property {?string} recipientDisplayName
 * @property {?string} recipientId
 * @property {?string} recipientUserName
 * @property {?string} subPlan
 * @property {?string} subPlanName
 * @property {?string} viewerCount
 * @property {?string} ritualName
 */
declare type UserNoticeMessageParam = {
    displayName: string;
    login: string;
    months: string;
    recipientDisplayName: string;
    recipientId: string;
    recipientUserName: string;
    subPlan: string;
    subPlanName: string;
    viewerCount: string;
    ritualName: string;
};

/**
 * @external CLEARCHAT
 * @see {@link https://dev.twitch.tv/docsc/irc/tags/#clearchat-twitch-tags}
 * @typedef {object} ClearChatTags
 * @property {string} banDuration
 * @property {string} banReason
 */
declare type ClearChatTags = {
    banDuration: string;
    banReason: string;
};

/**
 * @external CLEARMSG
 * @see {@link https://dev.twitch.tv/docs/irc/tags/#clearmsg-twitch-tags}
 * @typedef {object} ClearMessageTags
 * @property {string} login
 * @property {string} message
 * @property {string} targetMsgId
 */
declare type ClearMessageTags = {
    login: string;
    message: string;
    targetMsgId: string;
};

/**
 * @external GLOBALUSERSTATE
 * @see {@link https://dev.twitch.tv/docs/irc/tags/#globaluserstate-twitch-tags}
 * @typedef {object} GlobalUserState
 * @property {string} raw Raw IRC response
 * @property {string} badges
 * @property {string} color
 * @property {string} displayName
 * @property {string} emoteSets
 */
declare type GlobalUserState = {
    raw: string;
    badges: string;
    color: string;
    displayName: string;
    emoteSets: string;
};

/**
 * @external PRIVMSG
 * @see {@link https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags}
 * @typedef {object} PrivateMessage
 * @property {string} badges
 * @property {?string} bits
 * @property {string} color
 * @property {string} displayName
 * @property {string} emotes
 * @property {string} id
 * @property {string} message
 * @property {string} mod
 * @property {string} roomId
 * @property {string} subscriber
 * @property {string} tmiSentTS
 * @property {string} turbo
 * @property {string} userId
 * @property {string} userType
 */
declare type PrivateMessage = {
    badges: string;
    bits: string;
    color: string;
    displayName: string;
    emotes: string;
    id: string;
    message: string;
    mod: string;
    roomId: string;
    subscriber: string;
    tmiSentTS: string;
    turbo: string;
    userId: string;
    userType: string;
};

/**
 * @external ROOMSTATE
 * @see {@link https://dev.twitch.tv/docs/irc/tags/#roomstate-twitch-tags}
 * @typedef {object} RoomState
 * @property {string} broadcasterLang
 * @property {string} emoteOnly
 * @property {string} followersOnly
 * @property {string} r9k
 * @property {string} slow
 * @property {string} subsOnly
 */
declare type RoomState = {
    broadcasterLang: string;
    emoteOnly: string;
    followersOnly: string;
    r9k: string;
    slow: string;
    subsOnly: string;
};

/**
 * @external USERNOTICE
 * @see {@link https://dev.twitch.tv/docs/irc/tags/#usernotice-twitch-tags}
 * @typedef {object} UserNotice
 * @property {string} badges
 * @property {string} color
 * @property {string} displayName
 * @property {string} emotes
 * @property {string} id
 * @property {string} login
 * @property {string} message
 * @property {string} mod
 * @property {string} msgId
 * @property {UserNoticeMessageParam} msgParam
 * @property {string} roomId
 * @property {string} subscriber
 * @property {string} systemMsg
 * @property {string} tmiSentTS
 * @property {string} turbo
 * @property {string} userId
 * @property {string} userType
 */
declare type UserNotice = {
    badges: string;
    color: string;
    displayName: string;
    emotes: string;
    id: string;
    login: string;
    message: string;
    mod: string;
    msgId: string;
    msgParam: UserNoticeMessageParam;
    roomId: string;
    subscriber: string;
    systemMsg: string;
    tmiSentTS: string;
    turbo: string;
    userId: string;
    userType: string;
};

/**
 * @external USERSTATE
 * @see {@link https://dev.twitch.tv/docs/irc/tags/#userstate-twitch-tags}
 * @typedef {object} UserState
 * @property {string} badges
 * @property {string} color
 * @property {string} displayName
 * @property {string} emotes
 * @property {string} mod
 * @property {string} subscriber
 * @property {string} turbo
 * @property {string} userType
 */
declare type UserState = {
    badges: string;
    color: string;
    displayName: string;
    emotes: string;
    mod: string;
    subscriber: string;
    turbo: string;
    userType: string;
};

/**
 * @typedef {object} ChannelState
 * @property {string} channel
 * @property {RoomState} roomState
 * @property {UserState} userState
 */
declare type ChannelState = {
    roomState: any;
    userState: any;
};

/**
 * @typedef {object} ChatOptions
 * @property {string} [username]
 * @property {string} [token] OAuth token (use {@link https://twitchtokengenerator.com/} to generate one)
 * @property {number} [connectionTimeout=CONNECTION_TIMEOUT]
 * @property {number} [joinTimeout=JOIN_TIMEOUT]
 * @property {object} log
 * @property {Function} [onAuthenticationFailure]
 */
declare type ChatOptions = {
    username?: string;
    token?: string;
    connectionTimeout?: number;
    joinTimeout?: number;
    log: object;
    onAuthenticationFailure?: ()=>any;
};

/**
 * @class
 * @public
 * @extends EventEmitter
 * @classdesc Twitch Chat Client
 * @emits Chat#*
 * @emits Chat#CLEARCHAT
 * @emits Chat#CLEARCHAT/USER_BANNED
 * @emits Chat#GLOBALUSERSTATE
 * @emits Chat#HOSTTARGET
 * @emits Chat#JOIN
 * @emits Chat#MODE
 * @emits Chat#NAMES
 * @emits Chat#NAMES_END
 * @emits Chat#NOTICE
 * @emits Chat#NOTICE/ROOM_MODS
 * @emits Chat#PART
 * @emits Chat#PRIVMSG
 * @emits Chat#PRIVMSG/CHEER
 * @emits Chat#ROOMSTATE
 * @emits Chat#USERNOTICE
 * @emits Chat#USERNOTICE/ANON_GIFT_PAID_UPGRADE
 * @emits Chat#USERNOTICE/GIFT_PAID_UPGRADE
 * @emits Chat#USERNOTICE/RAID
 * @emits Chat#USERNOTICE/RESUBSCRIPTION
 * @emits Chat#USERNOTICE/RITUAL
 * @emits Chat#USERNOTICE/SUBSCRIPTION
 * @emits Chat#USERNOTICE/SUBSCRIPTION_GIFT
 * @emits Chat#USERSTATE
 * @example <caption>Connecting to Twitch and joining #dallas</caption>
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const username = 'ronni'
 * const channel = '#dallas'
 * const { chat } = new TwitchJs({ token, username })
 * chat.connect().then(globalUserState => {
 *   // Listen to all messages
 *   chat.on('*', message => {
 *     // Do stuff with message ...
 *   })
 *   // Listen to PRIVMSG
 *   chat.on('PRIVMSG', privateMessage => {
 *     // Do stuff with privateMessage ...
 *   })
 *   // Do other stuff ...
 *   chat.join(channel).then(channelState => {
 *     // Do stuff with channelState...
 *   })
 * })
 */
declare class Chat {
    constructor(options: ChatOptions);

    /**
     * @function Chat#getOptions
     * @public
     * @desc Retrieves the current [ChatOptions]{@link Chat#ChatOptions}
     * @return {ChatOptions} Options of the client
     */
    getOptions(): ChatOptions;

    /**
     * @function Chat#setOptions
     * @public
     * @desc Validates the passed options before changing `_options`
     * @param {ChatOptions} options
     */
    setOptions(options: ChatOptions): void;

    /**
     * @function Chat#connect
     * @public
     * @desc Connect to Twitch.
     * @return {Promise<?GlobalUserStateMessage, string>} Global user state message
     */
    connect(): Promise<?GlobalUserStateMessage, string>;

    /**
     * @function Chat#updateOptions
     * @public
     * @desc Updates the clients options after first instantiation.
     * @param {ApiOptions} options New client options. To update `token` or `username`, use [**api.reconnect()**]{@link Chat#reconnect}.
     */
    updateOptions(options: ApiOptions): void;

    /**
     * @function Chat#send
     * @public
     * @desc Sends a raw message to Twitch.
     * @param {string} message - Message to send.
     * @return {Promise} Resolves on success, rejects on failure.
     */
    send(message: string): Promise;

    /**
     * @function Chat#disconnect
     * @public
     * @desc Disconnected from Twitch.
     */
    disconnect(): void;

    /**
     * @function Chat#reconnect
     * @public
     * @desc Reconnect to Twitch.
     * @param {object} newOptions Provide new options to client.
     * @return {Promise<Array<ChannelState>, string>}
     */
    reconnect(newOptions: object): Promise<Array<ChannelState>, string>;

    /**
     * @function Chat#join
     * @public
     * @desc Join a channel.
     * @param {string} channel
     * @return {Promise<ChannelState, string>}
     * @example <caption>Joining #dallas</caption>
     * const channel = '#dallas'
     * chat.join(channel).then(channelState => {
     *   // Do stuff with channelState...
     * })
     * @example <caption>Joining multiple channels</caption>
     * const channels = ['#dallas', '#ronni']
     * Promise.all(channels.map(channel => chat.join(channel)))
     *   .then(channelStates => {
     *     // Listen to all PRIVMSG
     *     chat.on('PRIVMSG', privateMessage => {
     *       // Do stuff with privateMessage ...
     *     })
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
    join(channel: string): Promise<ChannelState, string>;

    /**
     * @function Chat#part
     * @public
     * @desc Depart from a channel.
     * @param {string} channel
     */
    part(channel: string): void;

    /**
     * @function Chat#say
     * @public
     * @desc Send a message to a channel.
     * @param {string} channel
     * @param {string} message
     * @return {Promise<?UserStateMessage, string>}
     */
    say(channel: string, message: string): Promise<?UserStateMessage, string>;

    /**
     * @function Chat#whisper
     * @public
     * @desc Whisper to another user.
     * @param {string} user
     * @param {string} message
     * @return {Promise<undefined>}
     */
    whisper(user: string, message: string): Promise<undefined>;

    /**
     * @function Chat#broadcast
     * @public
     * @desc Broadcast message to all connected channels.
     * @param {string} message
     * @return {Promise<Array<UserStateMessage>>}
     */
    broadcast(message: string): Promise<Array<UserStateMessage>>;

}

//----------------------//
//* ./src/Api/index.js *//
//----------------------//

/**
 * @typedef {object} ApiOptions
 * @property {string} [clientId] Optional if token is defined.
 * @property {string} [token] Optional if clientId is defined.
 * @property {object} [log] Log options
 * @property {Function} [onAuthenticationFailure]
 */
declare type ApiOptions = {
    clientId?: string;
    token?: string;
    log?: object;
    onAuthenticationFailure?: ()=>any;
};

/**
 * @class
 * @public
 * @example <caption>Get Featured Streams</caption>
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const username = 'ronni'
 * const { api } = new TwitchJs({ token, username })
 * api.get('streams/featured').then(response => {
 *   // Do stuff ...
 * })
 */
declare class Api {
    constructor(options: ApiOptions);

    /**
     * @type {any}
     * @public
     */
    log: any;

    /**
     * @function Api#setOptions
     * @public
     * @param {ApiOptions} options
     */
    setOptions(options: ApiOptions): void;

    /**
     * @function Api#getOptions
     * @public
     * @return {ApiOptions}
     */
    getOptions(): ApiOptions;

    /**
     * @function Api#getReadyState
     * @public
     * @return {number}
     */
    getReadyState(): number;

    /**
     * @function Api#getStatus
     * @public
     * @return {ApiStatusState}
     */
    getStatus(): ApiStatusState;

    /**
     * Update client options.
     * @function Api#updateOptions
     * @public
     * @param {ApiOptions} options New client options. To update `token` or `clientId`, use [**api.initialize()**]{@link Api#initialize}.
     */
    updateOptions(options: ApiOptions): void;

    /**
     * @function Api#get
     * @public
     * GET endpoint.
     * @param {string} endpoint
     * @param {FetchOptions} [options]
     * @example <caption>Get Live Overwatch Streams</caption>
     * api.get('streams', { search: { game: 'Overwatch' } })
     *   .then(response => {
     *     // Do stuff with response ...
     *   })
     */
    get(endpoint: string, options?: any): void;

    /**
     * @function Api#post
     * @public
     * POST endpoint.
     * @param {string} endpoint
     * @param {FetchOptions} [options={method:'post'}]
     */
    post(endpoint: string, options?: any): void;

    /**
     * @function Api#put
     * @public
     * PUT endpoint.
     * @param {string} endpoint
     * @param {FetchOptions} [options={method:'put'}]
     */
    put(endpoint: string, options?: any): void;

}

/**
 * API status state.
 * @typedef {Object} ApiStatusState
 * @property {Object} token
 * @property {Object} token.authorization
 * @property {Array<string>} token.authorization.scopes
 * @property {string} token.authorization.createdAt
 * @property {string} token.authorization.updatedAt
 * @property {string} token.clientId
 * @property {string} token.userId
 * @property {string} token.userName
 * @property {boolean} token.valid
 */
declare type ApiStatusState = {
    token: {
        authorization: any;
        clientId: string;
        userId: string;
        userName: string;
        valid: boolean;
    };
};
