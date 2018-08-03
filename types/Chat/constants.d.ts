export const CHAT_COMMANDS: ChatConstants.ChatCommands;
export const CHAT_SERVER: "irc-ws.chat.twitch.tv";
export const CHAT_SERVER_PORT: 6667;
export const CHAT_SERVER_SSL_PORT: 443;
export const CLIENT_PRIORITY: 100;
export const COMMANDS: ChatConstants.Commands;
export const COMMAND_TIMEOUT: 1000;
export const CONNECTION_TIMEOUT: 5000;
export const ERROR_COMMAND_TIMED_OUT: "ERROR: command timed out";
export const ERROR_COMMAND_UNRECOGNIZED: "ERROR: command unrecognized";
export const ERROR_CONNECTION_IN_PROGRESS: "ERROR: connection in progress";
export const ERROR_CONNECT_TIMED_OUT: "ERROR: connect timed out";
export const ERROR_JOIN_TIMED_OUT: "ERROR: join timed out";
export const ERROR_PART_TIMED_OUT: "ERROR: part timed out";
export const ERROR_SAY_TIMED_OUT: "ERROR: say timed out";
export const EVENTS: ChatConstants.Events;
export const JOIN_TIMEOUT: 1000;
export const KEEP_ALIVE_PING_TIMEOUT: 55000;
export const KEEP_ALIVE_RECONNECT_TIMEOUT: 60000;
export const MEMBERSHIP_COMMANDS: ChatConstants.MembershipCommands;
export const MESSAGE_IDS: ChatConstants.MessageIds;
export const NOTICE_MESSAGE_IDS: ChatConstants.NoticeMessageIds;
export const OTHER_COMMANDS: ChatConstants.OtherCommands;
export const QUEUE_TICK_RATE: 1000;
export const RATE_LIMIT_KNOWN_BOT: 100;
export const RATE_LIMIT_MODERATOR: 200;
export const RATE_LIMIT_USER: 40;
export const RATE_LIMIT_VERIFIED_BOT: 15000;
export const TAG_COMMANDS: ChatConstants.TagCommands;
export const USER_NOTICE_MESSAGE_IDS: ChatConstants.UserNoticeMessageIds;

export namespace ChatConstants {
  interface ChatCommands {
    BAN: "ban";
    CLEAR: "clear";
    COLOR: "color";
    COMMERCIAL: "commercial";
    EMOTE_ONLY_OFF: "emoteonlyoff";
    EMOTE_ONLY: "emoteonly";
    FOLLOWERS_ONLY_OFF: "followersonlyoff";
    FOLLOWERS_ONLY: "followers";
    HOST: "host";
    ME: "me";
    MOD: "mod";
    MODS: "mods";
    R9K_OFF: "r9koff";
    R9K: "r9k";
    SLOW_OFF: "slowoff";
    SLOW: "slow";
    SUBSCRIBERS_OFF: "subscribersoff";
    SUBSCRIBERS: "subscribers";
    TIMEOUT: "timeout";
    UNBAN: "unban";
    UNHOST: "unhost";
    UNMOD: "unmod";
    WHISPER: "whisper";
  }

  interface Commands extends OtherCommands, MembershipCommands, TagCommands {
    CLEAR_CHAT: "CLEARCHAT";
    HOST_TARGET: "HOSTTARGET";
    RECONNECT: "RECONNECT";
    ROOM_STATE: "ROOMSTATE";
    USER_NOTICE: "USERNOTICE";
    USER_STATE: "USERSTATE";
  }

  interface Events extends Commands {
    ALL: "*";
    CHANNEL_HOSTED_STOPPED: "CHANNEL_HOSTED_STOPPED";
    CHANNEL_HOSTED: "CHANNEL_HOSTED";
    CONNECTED: "CONNECTED";
    DISCONNECTED: "DISCONNECTED";
    ERROR_ENCOUNTERED: "ERROR_ENCOUNTERED";
    MOD_GAINED: "MOD_GAINED";
    MOD_LOST: "MOD_LOST";
    PARSE_ERROR_ENCOUNTERED: "PARSE_ERROR_ENCOUNTERED";
    RAID: "RAID";
    RAW: "RAW";
    RESUBSCRIPTION: "RESUBSCRIPTION";
    RITUAL: "RITUAL";
    ROOM_MODS: "ROOM_MODS";
    SUBSCRIPTION_GIFT: "SUBSCRIPTION_GIFT";
    SUBSCRIPTION: "SUBSCRIPTION";
    USER_BANNED: "USER_BANNED";
  }

  interface MembershipCommands {
    JOIN: "JOIN";
    MODE: "MODE";
    NAMES_END: "366";
    NAMES: "353";
    PART: "PART";
  }

  interface MessageIds extends NoticeMessageIds, UserNoticeMessageIds { }

  interface NoticeMessageIds {
    ALREADY_BANNED: "already_banned";
    ALREADY_EMOTE_ONLY_OFF: "already_emote_only_off";
    ALREADY_EMOTE_ONLY_ON: "already_emote_only_on";
    ALREADY_R9K_OFF: "already_r9k_off";
    ALREADY_R9K_ON: "already_r9k_on";
    ALREADY_SUBS_OFF: "already_subs_off";
    ALREADY_SUBS_ON: "already_subs_on";
    BAD_HOST_HOSTING: "bad_host_hosting";
    BAD_UNBAN_NO_BAN: "bad_unban_no_ban";
    BAN_SUCCESS: "ban_success";
    EMOTE_ONLY_OFF: "emote_only_off";
    EMOTE_ONLY_ON: "emote_only_on";
    HOST_OFF: "host_off";
    HOST_ON: "host_on";
    HOSTS_REMAINING: "hosts_remaining";
    MSG_CHANNEL_SUSPENDED: "msg_channel_suspended";
    R9K_OFF: "r9k_off";
    R9K_ON: "r9k_on";
    ROOM_MODS: "room_mods";
    SLOW_OFF: "slow_off";
    SLOW_ON: "slow_on";
    SUBS_OFF: "subs_off";
    SUBS_ON: "subs_on";
    TIMEOUT_SUCCESS: "timeout_success";
    UNBAN_SUCCESS: "unban_success";
    UNRECOGNIZED_COMMAND: "unrecognized_cmd";
  }

  interface OtherCommands {
    PING: "PING";
    PONG: "PONG";
  }

  interface TagCommands {
    CLEAR_CHAT: "CLEARCHAT";
    GLOBAL_USER_STATE: "GLOBALUSERSTATE";
    PRIVATE_MESSAGE: "PRIVMSG";
    ROOM_STATE: "ROOMSTATE";
    USER_NOTICE: "USERNOTICE";
    USER_STATE: "USERSTATE";
  }

  interface UserNoticeMessageIds {
    RAID: "raid";
    RESUBSCRIPTION: "resub";
    RITUAL: "ritual";
    SUBSCRIPTION_GIFT: "subgift";
    SUBSCRIPTION: "sub";
  }
}
