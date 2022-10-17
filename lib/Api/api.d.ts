import { ApiValidateResponse } from '../twitch';
import { ApiOptions, ApiReadyStates, ApiFetchOptions } from './api-types';
/**
 * Make requests to Twitch API.
 *
 * ## Initializing
 *
 * ```js
 * const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
 * const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2'
 * const { api } = new TwitchJs({ token, clientId })
 * ```
 *
 * ## Making requests
 *
 * By default, the API client makes requests to the
 * [Helix API](https://dev.twitch.tv/docs/api), and exposes [[Api.get]],
 * [[Api.post]] and [[Api.put]] methods. Query and body parameters are provided
 * via `options.search` and `options.body` properties, respectively.
 *
 * ### Examples
 *
 * #### Get bits leaderboard
 * ```js
 * api
 *   .get('bits/leaderboard', { search: { user_id: '44322889' } })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 *
 * #### Get the latest Overwatch live streams
 * ```
 * api
 *   .get('streams', { search: { game_id: '1234' } })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 *
 * #### Start a channel commercial
 * ```
 * api
 *   .post('/channels/commercial', {
 *     body: { broadcaster_id: '44322889', length: 30 },
 *   })
 *   .then(response => {
 *     // Do stuff with response ...
 *   })
 * ```
 */
declare class Api {
    private _options;
    private _log;
    private _readyState;
    private _status;
    constructor(options: Partial<ApiOptions>);
    get readyState(): ApiReadyStates;
    get status(): ApiValidateResponse;
    /**
     * Update client options.
     */
    updateOptions(options: Partial<ApiOptions>): void;
    /**
     * Initialize API client and retrieve status.
     * @see https://dev.twitch.tv/docs/v5/#root-url
     */
    initialize(newOptions?: Partial<ApiOptions>): Promise<void>;
    /**
     * Check if current credentials include `scope`.
     * @see https://dev.twitch.tv/docs/authentication/#twitch-api-v5
     */
    hasScope(
    /** Scope to check */
    scope: string): Promise<boolean>;
    /**
     * GET endpoint.
     *
     * @example <caption>Get user follows (Helix)</caption>
     * ```
     * api.get('users/follows', { search: { to_id: '23161357' } })
     *   .then(response => {
     *     // Do stuff with response ...
     *   })
     * ```
     */
    get<T = any>(endpoint?: string, options?: ApiFetchOptions): Promise<T>;
    /**
     * POST endpoint.
     */
    post<T = any>(endpoint: string, options?: ApiFetchOptions): Promise<T>;
    /**
     * PUT endpoint.
     */
    put<T = any>(endpoint: string, options?: ApiFetchOptions): Promise<T>;
    private _getAuthenticationHeaders;
    private _handleFetch;
    private _handleAuthenticationFailure;
}
export default Api;
