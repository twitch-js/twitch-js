import { Badges, EmoteTag } from '../../../twitch';
export declare const generalString: (maybeMessage: string) => string | undefined;
export declare const generalNumber: (maybeNumber: string) => number | undefined;
export declare const generalBoolean: (maybeBoolean: string) => boolean;
export declare const generalTimestamp: (maybeTimestamp: string) => Date;
export declare const userType: (maybeUserType: string) => string | undefined;
export declare const broadcasterLanguage: (maybeLanguage: string) => string | undefined;
export declare const followersOnly: (maybeFollowersOnly: string) => number | boolean;
/**
 * Badges tag
 * @see https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags
 */
export declare const badges: (maybeBadges: string) => Partial<Badges>;
/**
 * Emote tag
 * @see https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags
 */
export declare const emotes: (maybeEmotes: string) => EmoteTag[];
export declare const emoteSets: (maybeEmoteSets: string) => string[];
export declare const mods: (message: string) => string[];
export declare const username: (...maybeUsernames: any[]) => string;
