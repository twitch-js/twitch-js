import { BaseMessage, Commands } from '../twitch';
import { LoggerOptions } from '../utils/logger';
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
export declare enum BaseClientEvents {
    RAW = "RAW",
    ALL = "*",
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
    RECONNECT = "RECONNECT",
    AUTHENTICATED = "AUTHENTICATED",
    AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
    ERROR_ENCOUNTERED = "ERROR_ENCOUNTERED"
}
export declare const ClientEvents: {
    RAW: BaseClientEvents.RAW;
    ALL: BaseClientEvents.ALL;
    CONNECTED: BaseClientEvents.CONNECTED;
    DISCONNECTED: BaseClientEvents.DISCONNECTED;
    RECONNECT: BaseClientEvents.RECONNECT;
    AUTHENTICATED: BaseClientEvents.AUTHENTICATED;
    AUTHENTICATION_FAILED: BaseClientEvents.AUTHENTICATION_FAILED;
    ERROR_ENCOUNTERED: BaseClientEvents.ERROR_ENCOUNTERED;
    WELCOME: Commands.WELCOME;
    PING: Commands.PING;
    PONG: Commands.PONG;
    WHISPER: Commands.WHISPER;
    JOIN: Commands.JOIN;
    MODE: Commands.MODE;
    PART: Commands.PART;
    NAMES: Commands.NAMES;
    NAMES_END: Commands.NAMES_END;
    CLEAR_CHAT: Commands.CLEAR_CHAT;
    CLEAR_MESSAGE: Commands.CLEAR_MESSAGE;
    GLOBALUSERSTATE: Commands.GLOBALUSERSTATE;
    HOST_TARGET: Commands.HOST_TARGET;
    NOTICE: Commands.NOTICE;
    PRIVATE_MESSAGE: Commands.PRIVATE_MESSAGE;
    ROOM_STATE: Commands.ROOM_STATE;
    USER_NOTICE: Commands.USER_NOTICE;
    USER_STATE: Commands.USER_STATE;
};
export declare type ClientEvents = Commands | BaseClientEvents;
export declare type ClientEventTypes = {
    [ClientEvents.RAW]: [string];
    [ClientEvents.ALL]: [BaseMessage];
    [ClientEvents.CONNECTED]: [BaseMessage];
    [ClientEvents.DISCONNECTED]: [];
    [ClientEvents.RECONNECT]: [];
    [ClientEvents.AUTHENTICATED]: [BaseMessage];
    [ClientEvents.AUTHENTICATION_FAILED]: [BaseMessage];
    [ClientEvents.ERROR_ENCOUNTERED]: [Error];
};
