// Type definitions for twitch-js 1.2
// Project: https://github.com/twitch-apis/twitch-js#readme
// Definitions by: Evan Steinkerchner <https://github.com/roundaround>
// TypeScript Version: 2.3

// DefinitelyTyped compatible
// TypeScript v2.3 is only required because of the dependency on request.

/// <reference path="./node_modules/@types/ws/index.d.ts" />
/// <reference path="./node_modules/@types/request/index.d.ts" />

import * as WebSocket from 'ws';
import { RequestCallback, Options as ApiOptions } from 'request';

export interface Logger {
  info: (message?: any, ...optionalParams: any[]) => void;
  warn: (message?: any, ...optionalParams: any[]) => void;
  error: (message?: any, ...optionalParams: any[]) => void;
}

export type Listener = (...args: any[]) => void;

export class EventEmitter {
  static defaultMaxListeners: number;

  /**
   * A class method that returns the number of listeners for the given eventName
   * registered on the given emitter.
   * @deprecated Use emitter.listenerCount() instead.
   */
  static listenerCount(emitter: EventEmitter, eventName: string | symbol): number;

  /**
   * By default EventEmitters will print a warning if more than 10 listeners are
   * added for a particular event. This is a useful default that helps finding
   * memory leaks. Obviously, not all events should be limited to just 10
   * listeners. The emitter.setMaxListeners() method allows the limit to be
   * modified for this specific EventEmitter instance. The value can be set to
   * Infinity (or 0) to indicate an unlimited number of listeners.
   */
  setMaxListeners(n: number): this;

  /**
   * Synchronously calls each of the listeners registered for the event named
   * eventName, in the order they were registered, passing the supplied
   * arguments to each.
   * @returns true if the event had listeners, false otherwise
   */
  emit(eventName: string | symbol, ...args: any[]): boolean;

  /**
   * Adds the listener function to the end of the listeners array for the event
   * named eventName. Alias for on.
   */
  addListener(eventName: string | symbol, listener: Listener): this;

  /**
   * Adds the listener function to the end of the listeners array for the event
   * named eventName.
   */
  on(eventName: string | symbol, listener: Listener): this;

  /**
   * Adds a one-time listener function for the event named eventName. The next
   * time eventName is triggered, this listener is removed and then invoked.
   */
  once(eventName: string | symbol, listener: Listener): this;

  /**
   * Removes the specified listener from the listener array for the event named
   * eventName.
   */
  removeListener(eventName: string | symbol, listener: Listener): this;

  /**
   * Removes all listeners, or those of the specified eventName.
   */
  removeAllListeners(eventName?: string | symbol): this;

  /**
   * Returns a copy of the array of listeners for the event named eventName.
   */
  listeners(eventName: string | symbol): Listener[];

  /**
   * Returns the number of listeners listening to the event named eventName.
   */
  listenerCount(eventName: string | symbol): number;

  /**
   * Emits multiple events named eventNames[i] with the data of values[i].
   */
  emits(eventNames: ReadonlyArray<string | symbol>, values: ReadonlyArray<any>): void;
}

export interface ClientOptions {
  channels?: string[];
  connection?: {
    server?: string,
    port?: number,
    reconnect?: boolean,
    maxReconnectAttempts?: number,
    maxReconnectInterval?: number,
    reconnectDecay?: number,
    reconnectInterval?: number,
    secure?: boolean,
    timeout?: number,
  };
  identity?: {
    username?: string,
    password?: string,
  };
  options?: {
    clientId?: string,
    debug?: boolean,
    commandTimeout?: number,
  };
  logger?: Logger;
}

export interface Message {
  raw: string;
  tags: TagsCollection;
  prefix: string|null;
  command: string;
  params: string[];
}

export interface Emote {
  code: string;
  id: number;
}

export interface TagsCollection {
  [key: string]: string|boolean|number|null;
}

export interface Utilities {
  /**
   * Perform a Levenshtein distance calculation between two strings.
   */
  levenshtein: (s1: string, s2: string, caseSensitive: boolean) => number;
  raffle: Raffle;
  /**
   * Count the number of symbols in a string of text.
   */
  symbols: (line: string) => number;
  /**
   * Count the number of uppercase letters in a string of text.
   */
  uppercase: (line: string) => number;
}

export interface Raffle {
  /**
   * Initialize a raffle for a channel. No need to call this manually, because
   * it is automatically called for you at the beginning of each other method.
   */
  init: (channel: string) => void;
  /**
   * Enter a user into the raffle on a channel.
   */
  enter: (channel: string, username: string) => void;
  /**
   * Remove a user from the raffle on a channel.
   */
  leave: (channel: string, username: string) => boolean;
  /**
   * Choose a winner for the raffle on a channel.
   */
  pick: (channel: string) => string|null;
  /**
   * Clear/reset the pool of entries for the raffle on a channel.
   */
  reset: (channel: string) => void;
  /**
   * Count the number of entries for the raffle on a channel.
   */
  count: (channel: string) => number;
  /**
   * Check if a user is entered for the raffle on a channel.
   */
  isParticipating: (channel: string, username: string) => boolean;
}

export class Client extends EventEmitter {
  channels: string[];
  clientId: string|null;
  currentLatency: number;
  emotes: string;
  emotesets: {[key: string]: Emote[]};
  globaluserstate: TagsCollection;
  lastJoined: string;
  latency: Date;
  log: Logger;
  maxReconnectAttempts: number;
  maxReconnectInterval: number;
  moderators: {[key: string]: string[]};
  opts: ClientOptions;
  pingLoop: number|null;
  pingTimeout: number|null;
  port: string;
  reason: string;
  reconnect: boolean;
  reconnectDecay: number;
  reconnectInterval: number;
  reconnectTimer: number;
  secure: boolean;
  server: string;
  username: string;
  userstate: TagsCollection;
  wasCloseCalled: boolean;
  ws: WebSocket|null;

  readonly utils: Utilities;

  constructor(opts?: ClientOptions);

  /// Base Methods
  /**
   * Make a call to the Twitch.tv kraken api.
   * See https://dev.twitch.tv/docs/v5/.
   * @returns Promise(apiResponse)
   */
  api(options?: ApiOptions, cb?: RequestCallback): Promise<any>;

  /**
   * Connect to server.
   * @returns Promise([server, port])
   */
  connect(): Promise<[string, number]>;

  /**
   * Disconnect from server.
   * @returns Promise([server, port])
   */
  disconnect(): Promise<[string, number]>;

  /**
   * Get the current channels.
   */
  getChannels(): string[];

  /**
   * Get the current options.
   */
  getOptions(): ClientOptions;

  /**
   * Get the current username.
   */
  getUsername(): string;

  /**
   * Handle parsed chat server message. Do not call this manually unless you
   * replace the onmessage handler on the WebSocket.
   */
  handleMessage(message: Message): void;

  /**
   * NOT RECOMMENDED. Might not be accurate dure to race conditions. Use the
   * chat event and check the user's mod property to tell if they are a mod or
   * not.
   * 
   * Check if username is a moderator on a channel.
   */
  isMod(channel: string, username: string): boolean;

  /**
   * Get the current state of the socket.
   */
  readyState(): 'CONNECTING'|'OPEN'|'CLOSING'|'CLOSED';

  /// Commands
  /**
   * Send action message (/me <message>) on a channel.
   * @returns Promise([channel, message])
   */
  action(channel: string, message: string): Promise<[string, string]>;

  /**
   * Ban username on channel.
   * @returns Promise([channel, username, reason])
   */
  ban(channel: string, username: string, reason: string): Promise<[string, string, string]>;

  /**
   * Clear all messages on a channel.
   * @returns Promise([channel])
   */
  clear(channel: string): Promise<[string]>;

  /**
   * Change the color of your username.
   * @returns Promise([color])
   */
  color(newColor: string): Promise<[string]>;

  /**
   * Change the color of your username. Attempts to set the color to the first
   * parameter, and sets as the second on failure. Useful for setting turbo-only
   * colors with normal color fallbacks.
   * @returns Promise([color])
   */
  // tslint:disable-next-line unified-signatures
  color(newColorAttempt: string, newColorFallback: string): Promise<[string]>;

  /**
   * Run commercial on a channel for X seconds.
   * @returns Promise([channel, seconds])
   */
  commercial(channel: string, seconds: number): Promise<[string, number]>;
  
  /**
   * Enable emote-only mode on a channel.
   * @returns Promise([channel])
   */
  emoteonly(channel: string): Promise<[string]>;

  /**
   * Disable emote-only mode on a channel.
   * @returns Promise([channel])
   */
  emoteonlyoff(channel: string): Promise<[string]>;

  /**
   * Enable followers-only mode on a channel. Alias of followersonly.
   * @returns Promise([channel, minutes])
   */
  followersmode(channel: string, minutes: number): Promise<[string, number]>;

  /**
   * Disable followers-only mode on a channel. Alias of followersonlyoff.
   * @returns Promise([channel])
   */
  followersmodeoff(channel: string): Promise<[string]>;

  /**
   * Enable followers-only mode on a channel.
   * @returns Promise([channel, minutes])
   */
  followersonly(channel: string, minutes: number): Promise<[string, number]>;

  /**
   * Disable followers-only mode on a channel.
   * @returns Promise([channel])
   */
  followersonlyoff(channel: string): Promise<[string]>;

  /**
   * Host a channel.
   * @returns Promise([channel, target, hostsRemaining])
   */
  host(channel: string, target: string): Promise<[string, string, number]>;

  /**
   * Join a channel.
   * @returns Promise([channel])
   */
  join(channel: string): Promise<[string]>;

  /**
   * Leave a channel. Alias of part.
   * @returns Promise([channel])
   */
  leave(channel: string): Promise<[string]>;

  /**
   * Mod username on channel.
   * @returns Promise([channel, username ])
   */
  mod(channel: string, username: string): Promise<[string, string]>;

  /**
   * Get list of mods on a channel.
   * @returns Promise([channel])
   */
  mods(channel: string): Promise<string[]>;

  /**
   * Leave a channel.
   * @returns Promise([channel])
   */
  part(channel: string): Promise<[string]>;

  /**
   * Send a ping to the server.
   * @returns Promise([latency])
   */
  ping(): Promise<[number]>;

  /**
   * Enable R9KBeta mode on a channel.
   * @returns Promise([channel])
   */
  r9kbeta(channel: string): Promise<[string]>;

  /**
   * Disable R9KBeta mode on a channel.
   * @returns Promise([channel])
   */
  r9kbetaoff(channel: string): Promise<[string]>;

  /**
   * Enable R9KBeta mode on a channel. Alias of r9kbeta.
   * @returns Promise([channel])
   */
  r9kmode(channel: string): Promise<[string]>;

  /**
   * Disable R9KBeta mode on a channel. Alias of r9kbetaoff.
   * @returns Promise([channel])
   */
  r9kmodeoff(channel: string): Promise<[string]>;

  /**
   * Send a raw message to the server.
   * @returns Promise([message])
   */
  raw(message: string): Promise<[string]>;

  /**
   * Send a message on a channel.
   * @returns Promise([channel, message])
   */
  say(channel: string, message: string): Promise<[string, string]>;

  /**
   * Enable slow mode on a channel.
   * @returns Promise([channel])
   */
  slow(channel: string, seconds: number): Promise<[string, number]>;

  /**
   * Enable slow mode on a channel. Alias of slow.
   * @returns Promise([channel])
   */
  slowmode(channel: string, seconds: number): Promise<[string, number]>;

  /**
   * Disable slow mode on a channel. Alias of slowoff.
   * @returns Promise([channel])
   */
  slowmodeoff(channel: string): Promise<[string]>;

  /**
   * Disable slow mode on a channel.
   * @returns Promise([channel])
   */
  slowoff(channel: string): Promise<[string]>;

  /**
   * Enable subscribers mode on a channel.
   * @returns Promise([channel])
   */
  subscribers(channel: string): Promise<[string]>;

  /**
   * Disable subscribers mode on a channel.
   * @returns Promise([channel])
   */
  subscribersoff(channel: string): Promise<[string]>;

  /**
   * Timeout username on channel for X seconds.
   * @returns Promise([channel, username, seconds, reason])
   */
  timeout(channel: string, username: string, seconds: number, reason: string): Promise<[string, string, number, string]>;
  
  /**
   * Unban username on channel.
   * @returns Promise([channel, username])
   */
  unban(channel: string, username: string): Promise<[string, string]>;

  /**
   * End the current hosting.
   * @returns Promise([channel])
   */
  unhost(channel: string): Promise<[string]>;

  /**
   * Unmod username on channel.
   * @returns Promise([channel, username])
   */
  unmod(channel: string, username: string): Promise<[string, string]>;

  /**
   * Send a whisper message to a user.
   * @returns Promise([username, message])
   */
  whisper(username: string, message: string): Promise<[string, string]>;
}

export class client extends Client {
  /**
   * Alias for Client. Prefer to use Client instead.
   */
  constructor(opts?: ClientOptions);
}
