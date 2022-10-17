import { BaseMessage } from '../../twitch';
export declare const isAuthenticationFailedMessage: (message?: BaseMessage | undefined) => boolean;
export declare const getEventNameFromMessage: (message: BaseMessage) => string;
export declare const isUserAnonymous: (value: string) => boolean;
