import { FetchOptions } from '../utils/fetch';
import { LoggerOptions } from '../utils/logger';
export declare type ApiOptions = {
    token: string;
    clientId: string;
    log?: LoggerOptions;
    onAuthenticationFailure?: () => Promise<string>;
};
export declare enum ApiReadyStates {
    'NOT_READY' = 0,
    'READY' = 1,
    'INITIALIZED' = 2
}
export declare type ApiFetchOptions = FetchOptions;
