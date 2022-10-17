import { CustomError } from 'ts-custom-error';
export declare class TwitchJSError extends CustomError {
    timestamp: Date;
    constructor(message: string);
}
export declare class AuthenticationError extends TwitchJSError {
    body?: any;
    constructor(message: string, body?: any);
}
