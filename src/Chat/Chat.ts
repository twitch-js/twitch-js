import EventEmitter from 'eventemitter3'
import delay from 'delay'
import pEvent from 'p-event'

import uniq from 'lodash/uniq'

import {
  BaseMessage,
  ChatCommands,
  Commands,
  Events,
  GlobalUserStateTags,
  KnownNoticeMessageIdsUpperCase as NoticeMessageIds,
  Messages,
  NoticeMessages,
  RoomStateMessage,
  UserStateMessage,
} from '../twitch'

import createLogger, { Logger } from '../utils/logger'

import * as chatUtils from './utils'

import Client, { ClientEvents } from '../Client'
import * as Errors from './Errors'

import * as parsers from './utils/parsers'
import * as sanitizers from './utils/sanitizers'
import * as validators from './utils/validators'

import {
  ChatReadyStates,
  EventTypes,
  ChatOptions,
  ChannelStates,
  NoticeCompounds,
  PrivateMessageCompounds,
  UserNoticeCompounds,
  ChannelState,
} from './types'

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
 *   .then(userStateMessage => {
 *     // ... do stuff with userStateMessage on success ...
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
class Chat extends EventEmitter<EventTypes> {
  static Commands = Commands

  static Events = Events

  static CompoundEvents = {
    [Events.NOTICE]: NoticeCompounds,
    [Events.PRIVATE_MESSAGE]: PrivateMessageCompounds,
    [Events.USER_NOTICE]: UserNoticeCompounds,
  }

  private _options: ChatOptions

  private _log: Logger

  private _client?: Client

  private _readyState: ChatReadyStates = ChatReadyStates.WAITING

  private _connectionAttempts = 0
  private _connectionInProgress?: Promise<void> | void

  private _globalUserState?: GlobalUserStateTags
  private _channelState: ChannelStates = {}

  private _isAuthenticated = false

  /**
   * Chat constructor.
   */
  constructor(options: Partial<ChatOptions>) {
    super()

    this._options = validators.chatOptions(options)

    // Create logger.
    this._log = createLogger({ name: 'Chat', ...this._options.log })
  }

  /**
   * Connect to Twitch.
   */
  async connect(): Promise<void> {
    try {
      this._readyState = ChatReadyStates.CONNECTING

      if (this._connectionInProgress) {
        return this._connectionInProgress
      }

      this._connectionInProgress = await this._handleConnectionAttempt()

      this._readyState = ChatReadyStates.CONNECTED
      this._connectionAttempts = 0
    } catch (err) {
      if (
        this._readyState !== ChatReadyStates.DISCONNECTING &&
        this._readyState !== ChatReadyStates.DISCONNECTED
      ) {
        this._log.info('Retrying ...')
        await delay(this._options.connectionTimeout)

        await this._handleAuthenticationFailure()
        return this.connect()
      } else {
        throw err
      }
    }
  }

  /**
   * Updates the client options after instantiation.
   * To update `token` or `username`, use `reconnect()`.
   */
  updateOptions(options: Partial<ChatOptions>) {
    const { token, username } = this._options
    this._options = validators.chatOptions({ ...options, token, username })
  }

  /**
   * Send a raw message to Twitch.
   */
  send(
    message: string,
    options?: Partial<{ priority: number; isModerator: boolean }>,
  ): Promise<void> {
    if (!this._client) {
      throw new Errors.ChatError('Not connected')
    }

    return this._client.send(message, options)
  }

  /**
   * This command will allow you to permanently ban a user from the chat room.
   */
  async ban(channel: string, username: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.BAN} ${username}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [
          `${NoticeMessageIds.BAN_SUCCESS}/${channel}`,
          `${NoticeMessageIds.ALREADY_BANNED}/${channel}`,
        ],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command will allow you to block all messages from a specific user in
   * chat and whispers if you do not wish to see their comments.
   */
  async block(channel: string, username: string): Promise<UserStateMessage> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.BLOCK} ${username}`
    return this.say(channel, message)
  }

  /**
   * This command will allow the Broadcaster and chat moderators to completely
   * wipe the previous chat history.
   */
  async clear(channel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.CLEAR}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${Commands.CLEAR_CHAT}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * Allows you to change the color of your username.
   */
  async color(channel: string, color: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.COLOR} ${color}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${NoticeMessageIds.COLOR_CHANGED}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * An Affiliate and Partner command that runs a commercial for all of your
   * viewers.
   */
  async commercial(
    channel: string,
    length: 30 | 60 | 90 | 120 | 150 | 180,
  ): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.COMMERCIAL} ${length}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${NoticeMessageIds.COMMERCIAL_SUCCESS}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command allows you to set your room so only messages that are 100%
   * emotes are allowed.
   */
  async emoteOnly(channel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.EMOTE_ONLY}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [
          `${NoticeMessageIds.EMOTE_ONLY_ON}/${channel}`,
          `${NoticeMessageIds.ALREADY_EMOTE_ONLY_ON}/${channel}`,
        ],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command allows you to disable emote only mode if you previously
   * enabled it.
   */
  async emoteOnlyOff(channel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.EMOTE_ONLY_OFF}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [
          `${NoticeMessageIds.EMOTE_ONLY_OFF}/${channel}`,
          `${NoticeMessageIds.ALREADY_EMOTE_ONLY_OFF}/${channel}`,
        ],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command allows you or your mods to restrict chat to all or some of
   * your followers, based on how long they’ve followed.
   * @param period - Follow time from 0 minutes (all followers) to 3 months.
   */
  async followersOnly(
    channel: string,
    period: string,
  ): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.FOLLOWERS_ONLY} ${period}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [
          `${NoticeMessageIds.FOLLOWERS_ON_ZERO}/${channel}`,
          `${NoticeMessageIds.FOLLOWERS_ON}/${channel}`,
        ],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command will disable followers only mode if it was previously enabled
   * on the channel.
   */
  async followersOnlyOff(channel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.FOLLOWERS_ONLY_OFF}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${NoticeMessageIds.FOLLOWERS_OFF}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  async help(channel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.HELP}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${NoticeMessageIds.CMDS_AVAILABLE}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command will allow you to host another channel on yours.
   */
  async host(channel: string, hostChannel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.HOST} ${hostChannel}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${NoticeMessageIds.HOST_ON}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * Adds a stream marker (with an optional description, max 140 characters) at
   * the current timestamp. You can use markers in the Highlighter for easier
   * editing.
   */
  async marker(
    channel: string,
    description: string,
  ): Promise<UserStateMessage> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.MARKER} ${description.slice(0, 140)}`
    return this.say(channel, message)
  }

  /**
   * This command will color your text based on your chat name color.
   */
  async me(channel: string, text: string): Promise<UserStateMessage> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.ME} ${text}`
    return this.say(channel, message)
  }

  /**
   * This command will allow you to promote a user to a channel moderator.
   */
  async mod(channel: string, username: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.MOD} ${username}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [
          `${NoticeMessageIds.MOD_SUCCESS}/${channel}`,
          `${NoticeMessageIds.BAD_MOD_MOD}/${channel}`,
        ],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command will display a list of all chat moderators for that specific
   * channel.
   */
  async mods(channel: string, ...args: string[]): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.MODS} ${args.join(' ')}`

    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${NoticeMessageIds.ROOM_MODS}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])

    return notice
  }

  /**
   * @deprecated
   */
  async r9K(channel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.R9K}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [
          `${NoticeMessageIds.R9K_ON}/${channel}`,
          `${NoticeMessageIds.ALREADY_R9K_ON}/${channel}`,
        ],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * @deprecated
   */
  async r9KOff(channel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.R9K_OFF}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [
          `${NoticeMessageIds.R9K_OFF}/${channel}`,
          `${NoticeMessageIds.ALREADY_R9K_OFF}/${channel}`,
        ],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command will send the viewer to another live channel.
   */
  async raid(channel: string, raidChannel: string): Promise<UserStateMessage> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.RAID} ${raidChannel}`
    return this.say(channel, message)
  }

  /**
   * This command allows you to set a limit on how often users in the chat room
   * are allowed to send messages (rate limiting).
   */
  async slow(channel: string, seconds: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.SLOW} ${seconds}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${NoticeMessageIds.SLOW_ON}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command allows you to disable slow mode if you had previously set it.
   */
  async slowOff(channel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.SLOW_OFF}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${NoticeMessageIds.SLOW_OFF}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command allows you to set your room so only users subscribed to you
   * can talk in the chat room. If you don't have the subscription feature it
   * will only allow the Broadcaster and the channel moderators to talk in the
   * chat room.
   */
  async subscribers(channel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.SUBSCRIBERS}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [
          `${NoticeMessageIds.SUBS_ON}/${channel}`,
          `${NoticeMessageIds.ALREADY_SUBS_ON}/${channel}`,
        ],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command allows you to disable subscribers only chat room if you
   * previously enabled it.
   */
  async subscribersOff(channel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.SUBSCRIBERS_OFF}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [
          `${NoticeMessageIds.SUBS_OFF}/${channel}`,
          `${NoticeMessageIds.ALREADY_SUBS_OFF}/${channel}`,
        ],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command allows you to temporarily ban someone from the chat room for
   * 10 minutes by default. This will be indicated to yourself and the
   * temporarily banned subject in chat on a successful temporary ban. A new
   * timeout command will overwrite an old one.
   */
  async timeout(
    channel: string,
    username: string,
    timeout?: number,
  ): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const timeoutArg = timeout ? ` ${timeout}` : ''
    const message = `/${ChatCommands.TIMEOUT} ${username}${timeoutArg}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${NoticeMessageIds.TIMEOUT_SUCCESS}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command will allow you to lift a permanent ban on a user from the
   * chat room. You can also use this command to end a ban early; this also
   * applies to timeouts.
   */
  async unban(channel: string, username: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.UNBAN} ${username}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [
          `${NoticeMessageIds.UNBAN_SUCCESS}/${channel}`,
          `${NoticeMessageIds.BAD_UNBAN_NO_BAN}/${channel}`,
        ],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command will allow you to remove users from your block list that you
   * previously added.
   */
  async unblock(channel: string, username: string): Promise<UserStateMessage> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.UNBLOCK} ${username}`
    return this.say(channel, message)
  }

  /**
   * Using this command will revert the embedding from hosting a channel and
   * return it to its normal state.
   */
  async unhost(channel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.UNHOST}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${NoticeMessageIds.HOST_OFF}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command will allow you to demote an existing moderator back to viewer
   * status (removing their moderator abilities).
   */
  async unmod(channel: string, username: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.UNMOD} ${username}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${NoticeMessageIds.UNMOD_SUCCESS}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command will cancel the raid.
   */
  async unraid(channel: string): Promise<NoticeMessages> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.UNRAID}`
    const [notice] = await Promise.all([
      pEvent<string, NoticeMessages>(
        // @ts-expect-error
        this,
        [`${NoticeMessageIds.UNRAID_SUCCESS}/${channel}`],
        {},
      ),
      this.say(channel, message),
    ])
    return notice
  }

  /**
   * This command will grant VIP status to a user.
   */
  unvip(channel: string, username: string): Promise<UserStateMessage> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.UNVIP} ${username}`
    return this.say(channel, message)
  }

  /**
   * This command will grant VIP status to a user.
   */
  vip(channel: string, username: string): Promise<UserStateMessage> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.VIP} ${username}`
    return this.say(channel, message)
  }

  /**
   * This command will display a list of VIPs for that specific channel.
   */
  vips(channel: string): Promise<UserStateMessage> {
    channel = sanitizers.channel(channel)
    const message = `/${ChatCommands.VIPS}`
    return this.say(channel, message)
  }

  /**
   * Disconnected from Twitch.
   */
  disconnect() {
    this._readyState = ChatReadyStates.DISCONNECTING
    this._client?.disconnect()
    this._readyState = ChatReadyStates.DISCONNECTED
  }

  /**
   * Reconnect to Twitch, providing new options to the client.
   */
  async reconnect(options?: ChatOptions) {
    if (options) {
      this._options = validators.chatOptions({ ...this._options, ...options })
    }

    this._connectionInProgress = undefined
    this._readyState = ChatReadyStates.RECONNECTING

    const channels = this._getChannels()
    this.disconnect()

    await this.connect()

    return Promise.all(channels.map((channel) => this.join(channel)))
  }

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
  async join(channel: string) {
    const sanitizedChannel = sanitizers.channel(channel)

    const joinProfiler = this._log.profile(`Joining ${sanitizedChannel}`)

    const [roomState, userState] = await Promise.all([
      pEvent<string, RoomStateMessage>(
        // @ts-expect-error
        this,
        `${Commands.ROOM_STATE}/${sanitizedChannel}`,
      ),

      this._isAuthenticated
        ? pEvent<string, UserStateMessage>(
            // @ts-expect-error
            this,
            `${Commands.USER_STATE}/${sanitizedChannel}`,
          )
        : undefined,
      this.send(`${Commands.JOIN} ${sanitizedChannel}`),
    ])

    const channelState = {
      roomState: roomState.tags,
      userState: userState ? userState.tags : undefined,
    }
    this._setChannelState(roomState.channel, channelState)

    joinProfiler.done(`Joined ${sanitizedChannel}`)

    return channelState
  }

  /**
   * Depart from a channel.
   */
  part(maybeChannel: string) {
    const channel = sanitizers.channel(maybeChannel)
    this._log.info(`Parting ${channel}`)

    this._removeChannelState(channel)
    return this.send(`${Commands.PART} ${channel}`)
  }

  /**
   * Send a message to a channel.
   */
  async say(channel: string, message: string, options?: { priority: number }) {
    if (!this._isAuthenticated) {
      throw new Errors.ChatError(
        'To whisper, please provide a token and username',
      )
    }

    const sanitizedChannel = sanitizers.channel(channel)

    this._log.info(`PRIVMSG/${sanitizedChannel} :${message}`)

    const isModerator =
      this._channelState[sanitizedChannel]?.userState?.mod === '1'

    const [userState] = await Promise.all([
      pEvent<string, UserStateMessage>(
        // @ts-expect-error
        this,
        `${Commands.USER_STATE}/${channel}`,
      ),
      this.send(`${Commands.PRIVATE_MESSAGE} ${sanitizedChannel} :${message}`, {
        isModerator,
        ...options,
      }),
    ])

    return userState
  }

  /**
   * Whisper to another user.
   */
  async whisper(user: string, message: string) {
    if (!this._isAuthenticated) {
      throw new Errors.ChatError(
        'To whisper, please provide a token and username',
      )
    }

    return this.send(`${Commands.WHISPER} :/w ${user} ${message}`)
  }

  /**
   * Broadcast message to all connected channels.
   */
  async broadcast(message: string) {
    if (!this._isAuthenticated) {
      throw new Errors.ChatError(
        'To broadcast, please provide a token and username',
      )
    }

    return this._getChannels().map((channel) => this.say(channel, message))
  }

  private _handleConnectionAttempt(): Promise<void> {
    return new Promise((resolve, reject) => {
      const connectProfiler = this._log.profile('Connecting ...')

      const { token, username } = this._options

      // Connect ...
      this._readyState = ChatReadyStates.CONNECTING

      // Increment connection attempts.
      this._connectionAttempts += 1

      if (this._client) {
        // Remove all listeners, just in case.
        this._client.removeAllListeners()
      }

      // Create client and connect.
      this._client = new Client(this._options)

      // Handle disconnects.
      this._client.on(ClientEvents.DISCONNECTED, this._handleDisconnect, this)

      // Listen for reconnects.
      this._client.once(ClientEvents.RECONNECT, () => this.reconnect())

      // Listen for authentication failure.
      this._client.once(ClientEvents.AUTHENTICATION_FAILED, reject)

      // Once the client is connected, resolve ...
      this._client.once(ClientEvents.CONNECTED, (message) => {
        if (token && username) {
          this._handleAuthenticated(message)
        }
        this._handleJoinsAfterConnect()
        resolve()
        connectProfiler.done('Connected')
      })

      // Handle messages.
      this._client.on(ClientEvents.ALL, this._handleMessage, this)
    })
  }

  private _handleDisconnect() {
    this._log.info('Disconnecting ...')
    this._connectionInProgress = undefined
    this._isAuthenticated = false
    this._clearChannelState()
    this._log.info('Disconnected')
  }

  private _handleAuthenticated(message: BaseMessage) {
    const globalUserStateMessage = parsers.globalUserStateMessage(message)
    this._globalUserState = globalUserStateMessage.tags
    this._isAuthenticated = true
  }

  private async _handleAuthenticationFailure() {
    try {
      this._log.info('Retrying ...')

      const token = await this._options.onAuthenticationFailure?.()

      if (token) {
        this._log.info('Re-authenticating ...')
        this._options = { ...this._options, token }
        return this.connect()
      }
    } catch (err) {
      this._log.error('Re-authentication failed')
      throw new Errors.AuthenticationError(err)
    }
  }

  private _handleMessage(baseMessage: BaseMessage) {
    if (baseMessage instanceof Error) {
      this.emit('error', baseMessage)
      return
    }

    const [eventName, message] = this._parseMessageForEmitter(baseMessage)

    this._emit(eventName, message)
  }

  private async _handleJoinsAfterConnect() {
    const channels = this._getChannels()
    await Promise.all(channels.map((channel) => this.join(channel)))
  }

  private _getChannels() {
    return Object.keys(this._channelState)
  }

  private _getChannelState(channel: string) {
    return this._channelState[channel]
  }

  private _setChannelState(channel: string, state: ChannelState) {
    this._channelState[channel] = state
  }

  private _removeChannelState(channel: string) {
    this._channelState = Object.entries(this._channelState).reduce(
      (channelStates, [name, state]) => {
        return name === channel
          ? channelStates
          : { ...channelStates, [name]: state }
      },
      {},
    )
  }

  private _clearChannelState() {
    this._channelState = {}
  }

  private _parseMessageForEmitter(
    baseMessage: BaseMessage,
  ): [string, Messages] {
    const channel = sanitizers.channel(baseMessage.channel)

    switch (baseMessage.command) {
      case Events.JOIN: {
        const message = parsers.joinMessage(baseMessage)
        const eventName = `${message.command}/${channel}`
        return [eventName, message]
      }

      case Events.PART: {
        const message = parsers.partMessage(baseMessage)
        const eventName = `${message.command}/${channel}`
        return [eventName, message]
      }

      case Events.NAMES: {
        const message = parsers.namesMessage(baseMessage)
        const eventName = `${message.command}/${channel}`
        return [eventName, message]
      }

      case Events.NAMES_END: {
        const message = parsers.namesEndMessage(baseMessage)
        const eventName = `${message.command}/${channel}`
        return [eventName, message]
      }

      case Events.CLEAR_CHAT: {
        const message = parsers.clearChatMessage(baseMessage)
        const eventName = `${message.command}/${message.event}/${channel}`
        return [eventName, message]
      }

      case Events.HOST_TARGET: {
        const message = parsers.hostTargetMessage(baseMessage)
        const eventName = `${message.command}/${channel}`
        return [eventName, message]
      }

      case Events.MODE: {
        const message = parsers.modeMessage(baseMessage)
        const eventName = `${message.command}/${channel}`

        const channelState = this._getChannelState(channel)

        if (
          this._isAuthenticated &&
          typeof channelState.userState !== 'undefined' &&
          message.username === this._options.username
        ) {
          this._setChannelState(channel, {
            ...channelState,
            userState: {
              ...channelState.userState,
              mod: message.isModerator ? '1' : '0',
              isModerator: message.isModerator,
            },
          })
        }
        return [eventName, message]
      }

      case Events.USER_STATE: {
        const message = parsers.userStateMessage(baseMessage)
        const eventName = `${message.command}/${channel}`

        this._setChannelState(channel, {
          ...this._getChannelState(channel),
          userState: message.tags,
        })
        return [eventName, message]
      }

      case Events.ROOM_STATE: {
        const message = parsers.roomStateMessage(baseMessage)
        const eventName = `${message.command}/${channel}`

        this._setChannelState(channel, {
          ...this._getChannelState(channel),
          roomState: message,
        })
        return [eventName, message]
      }

      case Events.NOTICE: {
        const message = parsers.noticeMessage(baseMessage)
        const eventName = `${message.command}/${message.event}/${channel}`
        return [eventName, message]
      }

      case Events.USER_NOTICE: {
        const message = parsers.userNoticeMessage(baseMessage)
        const eventName = `${message.command}/${message.event}/${channel}`
        return [eventName, message]
      }

      case Events.PRIVATE_MESSAGE: {
        const message = parsers.privateMessage(baseMessage)
        const eventName = `${message.command}/${message.event}/${channel}`
        return [eventName, message]
      }

      default: {
        const command = chatUtils.getEventNameFromMessage(baseMessage)
        const eventName = channel === '#' ? command : `${command}/${channel}`
        return [eventName, baseMessage]
      }
    }
  }

  private _emit(eventName: string, message: Messages) {
    if (message instanceof Error) {
      super.emit('error', message)
      return
    }

    if (eventName) {
      const events = uniq(eventName.split('/'))

      const tagsDisplayName =
        'tags' in message ? message.tags.displayName : undefined
      const username = 'username' in message ? message.username : undefined

      const displayName = tagsDisplayName || username || 'tmi.twitch.tv'

      const info = 'message' in message ? message.message : eventName
      this._log.info(
        `${events.join('/')}`,
        `${displayName}${info ? ':' : ''}`,
        info,
      )

      events
        .filter((part) => part !== '#')
        .reduce<string[]>((parents, part) => {
          const eventParts = [...parents, part]
          if (eventParts.length > 1) {
            super.emit(part as keyof EventTypes, message)
          }
          super.emit(eventParts.join('/') as keyof EventTypes, message)
          return eventParts
        }, [])
    }

    /**
     * All events are also emitted with this event name.
     * @event Chat#*
     */
    super.emit(Events.ALL, message)
  }
}

export default Chat
