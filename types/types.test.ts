import { TwitchJs } from ".";
import { Chat } from "./Chat";
import { Api } from "./Api";

const twitch = new TwitchJs({username: "foo", token: "foo"});
twitch.chat.userState.username = "foo";

twitch.chatContants.CHAT_COMMANDS.BAN;
needsString(twitch.chatContants.CHAT_COMMANDS.BAN);

function needsString(param: string) { }

new Chat({username: "foo", token: "foo"});

const api = new Api();
