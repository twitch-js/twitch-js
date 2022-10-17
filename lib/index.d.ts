import Chat from './Chat';
import { ChatOptions } from './Chat/chat-types';
import Api from './Api';
import { ApiOptions } from './Api/api-types';
import { LoggerOptions } from './utils/logger';
export { Chat };
export { Api };
export * from './twitch';
declare type BaseTwitchJsOptions = {
    clientId?: string;
    token?: string;
    username?: string;
    log?: LoggerOptions;
    onAuthenticationFailure?: () => Promise<string>;
};
declare type IndividualClassOptions = {
    chat?: ChatOptions;
    api?: ApiOptions;
};
export declare type TwitchJsOptions = BaseTwitchJsOptions & IndividualClassOptions;
/**
 * Interact with chat and make requests to Twitch API.
 *
 * ## Initializing
 * ```
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2'
 * const username = 'ronni'
 * const twitchJs = new TwitchJs({ token, clientId, username })
 *
 * twitchJs.chat.connect().then(globalUserState => {
 *   // Do stuff ...
 * })
 *
 * twitchJs.api.get('channel').then(response => {
 *   // Do stuff ...
 * })
 * ```
 */
declare class TwitchJs {
    chat: Chat;
    api: Api;
    static Chat: typeof Chat;
    static Api: typeof Api;
    constructor(options: TwitchJsOptions);
    /**
     * Update client options.
     */
    updateOptions(options: IndividualClassOptions): void;
}
export default TwitchJs;
