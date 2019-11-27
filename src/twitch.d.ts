declare enum ApiVersions {
  Helix = 'helix',
  Kraken = 'kraken',
}

/**
 * Root URL response
 * @see https://dev.twitch.tv/docs/v5#root-url
 */
declare type ApiRootResponse = {
  token: {
    authorization: {
      createdAt: Date
      updatedAt: Date
      scopes: string[]
    }
    clientId: string
    userId: string
    userName: string
    valid: boolean
  }
}

/**
 * @see https://dev.twitch.tv/docs/irc/membership
 */
declare enum MembershipCommands {
  JOIN = 'JOIN',
  MODE = 'MODE',
  PART = 'PART',
  NAMES = '353',
  NAMES_END = '366',
}

/**
 * @see https://dev.twitch.tv/docs/irc/tags
 */
declare enum TagCommands {
  CLEAR_CHAT = 'CLEARCHAT',
  GLOBAL_USER_STATE = 'GLOBALUSERSTATE',
  PRIVATE_MESSAGE = 'PRIVMSG',
  ROOM_STATE = 'ROOMSTATE',
  USER_NOTICE = 'USERNOTICE',
  USER_STATE = 'USERSTATE',
}

declare enum OtherCommands {
  WELCOME = '001',
  PING = 'PING',
  PONG = 'PONG',
  WHISPER = 'PRIVMSG #jtv',
}

/**
 * @see https://dev.twitch.tv/docs/irc/commands
 */
declare enum BaseCommands {
  CLEAR_CHAT = 'CLEARCHAT',
  HOST_TARGET = 'HOSTTARGET',
  NOTICE = 'NOTICE',
  RECONNECT = 'RECONNECT',
  ROOM_STATE = 'ROOMSTATE',
  USER_NOTICE = 'USERNOTICE',
  USER_STATE = 'USERSTATE',
}

declare enum Commands {
  WELCOME = '001',

  PING = 'PING',
  PONG = 'PONG',
  RECONNECT = 'RECONNECT',

  WHISPER = 'PRIVMSG #jtv',

  JOIN = 'JOIN',
  MODE = 'MODE',
  PART = 'PART',
  NAMES = '353',
  NAMES_END = '366',

  CLEAR_CHAT = 'CLEARCHAT',
  GLOBAL_USER_STATE = 'GLOBALUSERSTATE',
  HOST_TARGET = 'HOSTTARGET',
  NOTICE = 'NOTICE',
  PRIVATE_MESSAGE = 'PRIVMSG',
  ROOM_STATE = 'ROOMSTATE',
  USER_NOTICE = 'USERNOTICE',
  USER_STATE = 'USERSTATE',
}

declare enum ChatEvents {
  RAW = 'RAW',

  ALL = '*',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RECONNECT = 'RECONNECT',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  ERROR_ENCOUNTERED = 'ERROR_ENCOUNTERED',
  PARSE_ERROR_ENCOUNTERED = 'PARSE_ERROR_ENCOUNTERED',

  ANON_GIFT_PAID_UPGRADE = 'ANON_GIFT_PAID_UPGRADE',
  GIFT_PAID_UPGRADE = 'GIFT_PAID_UPGRADE',
  RAID = 'RAID',
  RESUBSCRIPTION = 'RESUBSCRIPTION',
  RITUAL = 'RITUAL',
  SUBSCRIPTION = 'SUBSCRIPTION',
  SUBSCRIPTION_GIFT = 'SUBSCRIPTION_GIFT',
  SUBSCRIPTION_GIFT_COMMUNITY = 'SUBSCRIPTION_GIFT_COMMUNITY',

  ROOM_MODS = 'ROOM_MODS',
  MOD_GAINED = 'MOD_GAINED',
  MOD_LOST = 'MOD_LOST',

  USER_BANNED = 'USER_BANNED',

  CHEER = 'CHEER',

  HOST_ON = 'HOST_ON',
  HOST_OFF = 'HOST_OFF',

  HOSTED = 'HOSTED',
  HOSTED_WITHOUT_VIEWERS = 'HOSTED/WITHOUT_VIEWERS',
  HOSTED_WITH_VIEWERS = 'HOSTED/WITH_VIEWERS',
  HOSTED_AUTO = 'HOSTED/AUTO',
}

declare type Events =
  | MembershipCommands
  | TagCommands
  | OtherCommands
  | BaseCommands
  | ChatEvents

/**
 * @see https://help.twitch.tv/customer/en/portal/articles/659095-chat-moderation-commands
 */
declare enum ChatCommands {
  BAN = 'ban',
  CLEAR = 'clear',
  COLOR = 'color',
  COMMERCIAL = 'commercial',
  // DISCONNECTED = 'disconnect',
  EMOTE_ONLY = 'emoteonly',
  EMOTE_ONLY_OFF = 'emoteonlyoff',
  FOLLOWERS_ONLY = 'followers',
  FOLLOWERS_ONLY_OFF = 'followersoff',
  HELP = 'help',
  HOST = 'host',
  MARKER = 'marker',
  ME = 'me',
  MOD = 'mod',
  MODS = 'mods',
  // PART = 'part',
  R9K = 'r9kbeta',
  R9K_OFF = 'r9kbetaoff',
  RAID = 'raid',
  SLOW = 'slow',
  SLOW_OFF = 'slowoff',
  SUBSCRIBERS = 'subscribers',
  SUBSCRIBERS_OFF = 'subscribersoff',
  TIMEOUT = 'timeout',
  UNBAN = 'unban',
  UNHOST = 'unhost',
  UNMOD = 'unmod',
  UNRAID = 'unraid',
  // WHISPER = 'w',
}

declare enum KnownNoticeMessageIds {
  ALREADY_BANNED = 'already_banned',
  ALREADY_EMOTE_ONLY_OFF = 'already_emote_only_off',
  ALREADY_EMOTE_ONLY_ON = 'already_emote_only_on',
  ALREADY_R9K_OFF = 'already_r9k_off',
  ALREADY_R9K_ON = 'already_r9k_on',
  ALREADY_SUBS_OFF = 'already_subs_off',
  ALREADY_SUBS_ON = 'already_subs_on',
  BAD_HOST_HOSTING = 'bad_host_hosting',
  BAD_MOD_MOD = 'bad_mod_mod',
  BAN_SUCCESS = 'ban_success',
  BAD_UNBAN_NO_BAN = 'bad_unban_no_ban',
  COLOR_CHANGED = 'color_changed',
  CMDS_AVAILABLE = 'cmds_available',
  COMMERCIAL_SUCCESS = 'commercial_success',
  EMOTE_ONLY_OFF = 'emote_only_off',
  EMOTE_ONLY_ON = 'emote_only_on',
  FOLLOWERS_OFF = 'followers_off',
  FOLLOWERS_ON = 'followers_on',
  FOLLOWERS_ON_ZERO = 'followers_on_zero',
  HOST_OFF = 'host_off',
  HOST_ON = 'host_on',
  HOSTS_REMAINING = 'hosts_remaining',
  MSG_CHANNEL_SUSPENDED = 'msg_channel_suspended',
  MOD_SUCCESS = 'mod_success',
  R9K_OFF = 'r9k_off',
  R9K_ON = 'r9k_on',
  ROOM_MODS = 'room_mods',
  SLOW_OFF = 'slow_off',
  SLOW_ON = 'slow_on',
  SUBS_OFF = 'subs_off',
  SUBS_ON = 'subs_on',
  TIMEOUT_SUCCESS = 'timeout_success',
  UNBAN_SUCCESS = 'unban_success',
  UNRAID_SUCCESS = 'unraid_success',
  UNRECOGNIZED_CMD = 'unrecognized_cmd',
}
declare type NoticeMessageIds = KnownNoticeMessageIds | string

/**
 * @see https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags
 */
declare enum KnownUserNoticeMessageIds {
  ANON_GIFT_PAID_UPGRADE = 'anongiftpaidupgrade',
  GIFT_PAID_UPGRADE = 'giftpaidupgrade',
  RAID = 'raid',
  RESUBSCRIPTION = 'resub',
  RITUAL = 'ritual',
  SUBSCRIPTION = 'sub',
  SUBSCRIPTION_GIFT = 'subgift',
  SUBSCRIPTION_GIFT_COMMUNITY = 'submysterygift',
}

declare type UserNoticeMessageIds = KnownUserNoticeMessageIds | string

declare enum BooleanBadges {
  'admin',
  'broadcaster',
  'globalMod',
  'moderator',
  'partner',
  'premium',
  'staff',
  'subGifter',
  'turbo',
  'vip',
}

declare enum NumberBadges {
  'bits',
  'bitsLeader',
  'subscriber',
}

declare type Badges =
  | {
      // Booleans
      admin: boolean
      broadcaster: boolean
      globalMod: boolean
      moderator: boolean
      partner: boolean
      premium: boolean
      staff: boolean
      subGifter: boolean
      turbo: boolean
      vip: boolean
      // Numbers
      bits: number
      bitsLeader: number
      subscriber: number
    }
  | {
      [key: string]: string
    }

declare type EmoteTag = {
  id: string
  start: number
  end: number
}

declare interface BaseTags {
  [key: string]: any
}

/**
 * CLEARCHAT tags
 * @see https://dev.twitch.tv/docs/irc/tags#clearchat-twitch-tags
 */
declare interface ClearChatTags extends BaseTags {
  banReason: string
  banDuration: number
}

/**
 * GLOBALUSERSTATE tags
 * @see https://dev.twitch.tv/docs/irc/tags#globaluserstate-twitch-tags
 */
declare interface GlobalUserStateTags extends BaseTags {
  emoteSets: string[]
  userType: string
  username: string
}

/**
 * ROOMSTATE Tag
 * @see https://dev.twitch.tv/docs/irc/tags#roomstate-twitch-tags
 */
declare interface RoomStateTags extends BaseTags {
  followersOnly?: number | boolean
  broadcasterLang?: string
  slow?: number
  emoteOnly?: boolean
  r9k?: boolean
  subsOnly?: boolean
}

declare interface UserNoticeMessageParameterTags extends BaseTags {
  months: number
  massGiftCount: number
  promoGiftTotal: number
  senderCount: number
  viewerCount: number
}

/**
 * USERSTATE tags
 * @see https://dev.twitch.tv/docs/irc/tags#userstate-twitch-tags
 */
declare interface UserStateTags extends BaseTags {
  badges: Partial<Badges>
  color: string
  displayName: string
  emotes: EmoteTag[]
  emoteSets: string[]
  mod?: string
  subscriber?: string
  turbo?: string
  userType: string
}

/**
 * PRIVMSG tags
 * @see https://dev.twitch.tv/docs/irc/tags#privmsg-twitch-tags
 */
declare interface PrivateMessageTags extends UserStateTags {
  bits?: string
}

/**
 * USERNOTICE tags
 * @see https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags
 */
declare interface UserNoticeTags extends UserStateTags {
  id: string
  login: string
  msgId: UserNoticeMessageIds
  roomId: string
  systemMsg: string
  tmiSentTs: string
}

declare type Tags =
  | ClearChatTags
  | GlobalUserStateTags
  | RoomStateTags
  | UserNoticeMessageParameterTags
  | UserStateTags
  | PrivateMessageTags
  | UserNoticeTags

/* Base message parsed from Twitch */
declare interface BaseMessage {
  _raw: string
  timestamp: Date
  channel: string
  username: string
  command: Commands
  event?: Events | string
  // isSelf: boolean
  message: string
  tags: { [key: string]: any }
}

/**
 * Join a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#join-twitch-membership
 */
declare interface JoinMessage extends Omit<BaseMessage, 'message'> {
  command: Commands.JOIN
  event: Commands.JOIN
}

/**
 * Depart from a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#part-twitch-membership
 */
declare interface PartMessage extends Omit<BaseMessage, 'message'> {
  command: Commands.PART
  event: Commands.PART
}

/**
 * Gain/lose moderator (operator) status in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#mode-twitch-membership
 */
declare interface ModeMessage extends Omit<BaseMessage, 'message'> {
  command: Commands.MODE
  event: ChatEvents.MOD_GAINED | ChatEvents.MOD_LOST
  message: '+o' | '-o'
  isModerator: boolean
}

/**
 * List current chatters in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
 */
declare interface NamesMessage extends Omit<BaseMessage, 'message'> {
  command: Commands.NAMES
  event: Commands.NAMES
  usernames: string[]
}

/**
 * End of list current chatters in a channel.
 * @see https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership
 */
declare interface NamesEndMessage extends Omit<BaseMessage, 'message'> {
  command: Commands.NAMES_END
  event: Commands.NAMES_END
}

/**
 * GLOBALUSERSTATE message
 * @see https://dev.twitch.tv/docs/irc/tags#globaluserstate-twitch-tags
 */
declare interface GlobalUserStateMessage extends BaseMessage {
  command: Commands.GLOBAL_USER_STATE
  event: Commands.GLOBAL_USER_STATE
  tags: GlobalUserStateTags
}

/**
 * Temporary or permanent ban on a channel.
 * @see https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
 * @see https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags
 */
declare interface ClearChatUserBannedMessage
  extends Omit<BaseMessage, 'message'> {
  command: Commands.CLEAR_CHAT
  event: ChatEvents.USER_BANNED
  tags: ClearChatTags
}

/**
 * All chat is cleared (deleted).
 * @see https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
 * @see https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags
 */
declare interface ClearChatNormalMessage
  extends Omit<BaseMessage, 'tags' | 'username' | 'message'> {
  command: Commands.CLEAR_CHAT
  event: Commands.CLEAR_CHAT
}

declare type ClearChatMessage =
  | ClearChatUserBannedMessage
  | ClearChatNormalMessage

/**
 * Host starts or stops a message.
 * @see https://dev.twitch.tv/docs/irc/commands/#hosttarget-twitch-commands
 */
declare interface HostTargetMessage extends BaseMessage {
  command: Commands.HOST_TARGET
  event: ChatEvents.HOST_ON | ChatEvents.HOST_OFF
  numberOfViewers?: number
}

/**
 * When a user joins a channel or a room setting is changed.
 * @see https://dev.twitch.tv/docs/irc/tags#roomstate-twitch-tags
 */
declare interface RoomStateMessage extends BaseMessage {
  command: Commands.ROOM_STATE
  event: Commands.ROOM_STATE
  tags: RoomStateTags
}

/**
 * Base NOTICE message
 */
declare interface BaseNoticeMessage extends BaseMessage {
  command: Commands.NOTICE
  event: Exclude<keyof typeof KnownNoticeMessageIds, 'ROOM_MODS'> | string
  tags: { msgId: NoticeMessageIds }
  username: 'tmi.twitch.tv' | string
}

/**
 * NOTICE/ROOM_MODS message
 */
declare interface NoticeRoomModsMessage extends BaseNoticeMessage {
  event: KnownNoticeMessageIds.ROOM_MODS
  mods: string[]
}

/**
 * NOTICE message
 * @see https://dev.twitch.tv/docs/irc/commands/#msg-id-tags-for-the-notice-commands-capability
 */
declare type NoticeMessage = NoticeRoomModsMessage | BaseNoticeMessage

/**
 * USERSTATE message
 */
declare interface UserStateMessage extends BaseMessage {
  command: Commands.USER_STATE
  event: Commands.USER_STATE
  tags: UserStateTags
}

/**
 * When a user joins a channel or sends a PRIVMSG to a channel.
 */
declare interface BasePrivateMessage
  extends Omit<UserStateMessage, 'command' | 'event'> {
  command: Commands.PRIVATE_MESSAGE
  event: Commands.PRIVATE_MESSAGE
}

declare interface PrivateMessageWithBits
  extends Omit<BasePrivateMessage, 'event'> {
  event: ChatEvents.CHEER
  bits: number
}

/**
 * When a user hosts your channel while connected as broadcaster.
 */
declare interface HostingPrivateMessage
  extends Omit<BasePrivateMessage, 'event' | 'tags'> {
  event: ChatEvents.HOSTED_WITHOUT_VIEWERS
  tags: { displayName: string }
}

declare interface HostingWithViewersPrivateMessage
  extends Omit<HostingPrivateMessage, 'event'> {
  event: ChatEvents.HOSTED_WITH_VIEWERS
  numberOfViewers: number
}

declare interface HostingAutoPrivateMessage
  extends Omit<HostingWithViewersPrivateMessage, 'event'> {
  event: ChatEvents.HOSTED_AUTO
  tags: { displayName: string }
  numberOfViewers: number
}

declare type PrivateMessage =
  | BasePrivateMessage
  | PrivateMessageWithBits
  | HostingPrivateMessage
  | HostingWithViewersPrivateMessage
  | HostingAutoPrivateMessage

declare interface UserNoticeBaseMessage extends BaseMessage {
  command: Commands.USER_NOTICE
  event: string
  tags: UserNoticeTags
  parameters: { [key: string]: string }
  systemMessage: string
}

/**
 * On anonymous gifted subscription paid upgrade to a channel.
 */
declare interface UserNoticeAnonymousGiftPaidUpgradeMessage
  extends UserNoticeBaseMessage {
  event: ChatEvents.ANON_GIFT_PAID_UPGRADE
}

/**
 * On gifted subscription paid upgrade to a channel.
 */
declare interface UserNoticeGiftPaidUpgradeMessage
  extends Omit<UserNoticeBaseMessage, 'parameters'> {
  event: ChatEvents.GIFT_PAID_UPGRADE
  parameters: {
    promoGiftTotal: number
    promoName: string
    senderLogin: string
    senderName: string
  }
}

/**
 * On channel raid.
 */
declare interface UserNoticeRaidMessage
  extends Omit<UserNoticeBaseMessage, 'parameters'> {
  event: ChatEvents.RAID
  parameters: {
    displayName: string
    login: string
    viewerCount: number
  }
}

/**
 * On resubscription (subsequent months) to a channel.
 */
declare interface UserNoticeResubscriptionMessage
  extends Omit<UserNoticeBaseMessage, 'parameters'> {
  event: ChatEvents.RESUBSCRIPTION
  parameters: {
    months: number
    subPlan: string
    subPlanName: string
  }
}

/**
 * On channel ritual.
 */
declare interface UserNoticeRitualMessage
  extends Omit<UserNoticeBaseMessage, 'parameters'> {
  event: ChatEvents.RITUAL
  parameters: {
    ritualName: string
  }
}

/**
 * On subscription gift to a channel community.
 */
declare interface UserNoticeSubscriptionGiftCommunityMessage
  extends Omit<UserNoticeBaseMessage, 'parameters'> {
  event: ChatEvents.SUBSCRIPTION_GIFT_COMMUNITY
  parameters: {
    massGiftCount: number
    senderCount: number
    subPlan: number
  }
}

/**
 * On subscription gift to a channel.
 */
declare interface UserNoticeSubscriptionGiftMessage
  extends Omit<UserNoticeBaseMessage, 'parameters'> {
  event: ChatEvents.SUBSCRIPTION_GIFT
  parameters: {
    months: number
    subPlan: string
    subPlanName: string
    recipientDisplayName: string
    recipientId: string
    recipientName: string
  }
}

/**
 * On subscription (first month) to a channel.
 */
declare interface UserNoticeSubscriptionMessage
  extends Omit<UserNoticeBaseMessage, 'parameters'> {
  event: ChatEvents.SUBSCRIPTION
  parameters: {
    months: 1
    subPlan: string
    subPlanName: string
  }
}

declare type UserNoticeMessage =
  | UserNoticeBaseMessage
  | UserNoticeAnonymousGiftPaidUpgradeMessage
  | UserNoticeGiftPaidUpgradeMessage
  | UserNoticeRaidMessage
  | UserNoticeResubscriptionMessage
  | UserNoticeRitualMessage
  | UserNoticeSubscriptionGiftCommunityMessage
  | UserNoticeSubscriptionGiftMessage
  | UserNoticeSubscriptionMessage
