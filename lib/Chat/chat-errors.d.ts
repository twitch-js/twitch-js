import { TwitchJSError } from '../utils/error';
export * from '../utils/error';
export declare class ChatError extends TwitchJSError {
    body?: any;
    constructor(message: string, body?: any);
}
export declare class ParseError extends TwitchJSError {
    body?: any;
    constructor(message: string, body?: any);
}
export declare class JoinError extends TwitchJSError {
    body?: any;
    constructor(message: string, body?: any);
}
export declare class TimeoutError extends TwitchJSError {
    body?: any;
    constructor(message: string, body?: any);
}
