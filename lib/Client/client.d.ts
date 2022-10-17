import EventEmitter from 'eventemitter3';
import { BaseMessage } from '../twitch';
import { ClientOptions, ClientEventTypes } from './client-types';
declare class Client extends EventEmitter<ClientEventTypes & {
    [eventName: string]: [BaseMessage];
}> {
    private _options;
    private _log;
    private _ws;
    private _queueJoin;
    private _queueAuthenticate;
    private _queue;
    private _moderatorQueue?;
    private _heartbeatTimeoutId?;
    private _reconnectTimeoutId?;
    private _clientPriority;
    constructor(options: Partial<ClientOptions>);
    isReady(): boolean;
    /**
     * Send message to Twitch
     */
    send(message: string, options?: Partial<{
        priority: number;
        isModerator: boolean;
    }>): Promise<void>;
    disconnect(): void;
    private _handleOpen;
    private _handleMessage;
    private _handleError;
    private _handleClose;
    private _handleHeartbeat;
    private _handleHeartbeatReset;
    private _multiEmit;
}
export default Client;
