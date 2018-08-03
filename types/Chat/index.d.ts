import { EventEmitter } from "eventemitter3";

export interface KeyValueMap {
  [key: string]: any;
}

export interface ChatOptions {
  token: string;
  username: string;
  connectionTimeout?: number;
  joinTimeout?: number;
  debug?: boolean;
}

export enum ReadyState {
  NOT_READY = 0,
  CONNECTING = 1,
  CONNECTED = 2,
  DISCONNECTING = 3,
  DISCONNECTED = 4,
}

export interface GlobalUserStateTags extends KeyValueMap {
  emoteSets: string[];
  userType: string;
  username: string;
  isTurboSubscriber: boolean;
}

export interface ChannelState {
  roomState: RoomStateTags;
  userState: UserStateTags;
}

export interface RoomStateTags extends KeyValueMap {
  broadcasterLanguage: string;
  slowDelay: number;
  isFollowersOnly: boolean;
  isSubscribersOnly: boolean;
  isEmoteOnly: boolean;
  isR9kEnabled: boolean;
}

export interface UserStateTags extends KeyValueMap {
  badges: BadgesTag;
  bits?: number;
  emotes: {[key: number]: EmoteTag};
  emoteSets: string[];
  isModerator: boolean;
  isSubscriber: boolean;
  isTurboSubscriber: boolean;
}

export interface BadgesTag {
  admin?: boolean;
  bits?: number;
  broadcaster?: boolean;
  globalMod?: boolean;
  moderator?: boolean;
  subscriber?: boolean;
  staff?: boolean;
  turbo?: boolean;
}

export interface EmoteTag {
  start: number;
  end: number;
}

export interface ClearChatTags extends KeyValueMap {
  banReason?: string;
  banDuration?: number;
}

// tslint:disable-next-line no-empty-interface
export interface PrivateMessageTags extends UserStateTags { }

// tslint:disable-next-line no-empty-interface
export interface UserNoticeTags extends UserStateTags { }

export interface BaseMessage {
  timestamp: Date;
  command: string;
  tags: ClearChatTags|GlobalUserStateTags|PrivateMessageTags|RoomStateTags|UserNoticeTags|UserStateTags;
  channel?: string;
  message?: string;
  event?: string;
}

export interface GlobalUserStateMessage extends BaseMessage {
  tags: GlobalUserStateTags;
}

export interface UserStateMessage extends BaseMessage {
  tags: UserStateTags;
}

export class Chat extends EventEmitter {
  static prefixed: boolean;

  readyState: ReadyState;
  userState: GlobalUserStateTags;
  channels: {[key: string]: ChannelState};

  constructor(opts: ChatOptions);

  /**
   * Broadcast message to all connected channels.
   */
  broadcast(message: string): Promise<UserStateMessage[]>;

  /**
   * Connect to Twitch.
   */
  connect(): Promise<GlobalUserStateMessage>;

  /**
   * Disconnect from Twitch.
   */
  disconnect(): void;

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
  join(channel: string): Promise<ChannelState>;

  /**
   * Depart from a channel.
   */
  part(channel: string): void;

  /**
   * Reconnect to Twitch.
   */
  reconnect(): Promise<ChannelState[]>;

  /**
   * Send a message to a channel.
   */
  say(channel: string, message: string): Promise<UserStateMessage>;

  /**
   * Send a raw message to Twitch.
   */
  send(message: string): void;

  //TODO (https://github.com/twitch-apis/twitch-js/issues/52): Fill these in.
  ban(channel: string, ...args: string[]): Promise<string>;
  clear(channel: string, ...args: string[]): Promise<void>;
  color(channel: string, ...args: string[]): Promise<void>;
  commercial(channel: string, ...args: string[]): Promise<void>;
  emoteOnly(channel: string, ...args: string[]): Promise<string>;
  emoteOnlyOff(channel: string, ...args: string[]): Promise<string>;
  followersOnly(channel: string, ...args: string[]): Promise<void>;
  followersOnlyOff(channel: string, ...args: string[]): Promise<void>;
  host(channel: string, ...args: string[]): Promise<void>;
  me(channel: string, ...args: string[]): Promise<void>;
  mod(channel: string, ...args: string[]): Promise<void>;
  mods(channel: string, ...args: string[]): Promise<string>;
  part(channel: string, ...args: string[]): Promise<void>;
  r9k(channel: string, ...args: string[]): Promise<void>;
  r9kOff(channel: string, ...args: string[]): Promise<void>;
  slow(channel: string, ...args: string[]): Promise<void>;
  slowOff(channel: string, ...args: string[]): Promise<void>;
  subscribers(channel: string, ...args: string[]): Promise<void>;
  subscribersOff(channel: string, ...args: string[]): Promise<void>;
  timeout(channel: string, ...args: string[]): Promise<void>;
  unban(channel: string, ...args: string[]): Promise<void>;
  unhost(channel: string, ...args: string[]): Promise<void>;
  unmod(channel: string, ...args: string[]): Promise<void>;
  whisper(channel: string, ...args: string[]): Promise<void>;
}
