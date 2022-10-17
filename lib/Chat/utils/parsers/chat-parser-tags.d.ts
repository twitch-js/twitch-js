import { BaseTags, ClearChatTags, GlobalUserStateTags, ChatEvents, Commands, RoomStateTags, UserStateTags, MessageParameters } from '../../../twitch';
export declare const clearChat: (tags: BaseTags) => ClearChatTags;
export declare const privateMessageCheerEvent: (tags: BaseTags) => {
    event: ChatEvents;
    bits: number;
} | {
    event: Commands;
    bits?: undefined;
};
export declare const roomState: (roomStateTags: BaseTags) => RoomStateTags;
export declare const userNoticeMessageParameters: (tags: BaseTags) => MessageParameters;
export declare const userState: (tags: BaseTags) => UserStateTags;
export declare const globalUserState: (tags: BaseTags) => GlobalUserStateTags;
export declare const privateMessage: (tags: BaseTags) => UserStateTags;
export declare const userNotice: (tags: BaseTags) => UserStateTags;
