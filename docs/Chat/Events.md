# Chat Client

## Events

Some events will only be fired if you are logged in. If you are not familiar with event listeners, please [read this](https://nodejs.org/api/events.html).

#### Contents

- [Action](#action) - Received action message on channel.
- [Ban](#ban) - Username has been banned on a channel.
- [Chat](#chat) - Received message on channel.
- [Cheer](#cheer) - Username has cheered to a channel.
- [Clearchat](#clearchat) - Chat of a channel got cleared.
- [Connected](#connected) - Connected to server.
- [Connecting](#connecting) - Connecting to a server.
- [Disconnected](#disconnected) - Got disconnected from server.
- [Emoteonly](#emoteonly) - Channel enabled or disabled emote-only mode.
- [Emotesets](#emotesets) - Received the ``emote-sets`` from Twitch.
- [Followersonly](#followersonly) - Channel enabled or disabled followers-only mode.
- [Hosted](#hosted) - Channel is now hosted by another broadcaster.
- [Hosting](#hosting) - Channel is now hosting another channel.
- [Join](#join) - Username has joined a channel.
- [Logon](#logon) - Connection established, sending informations to server.
- [Message](#message) - Received a message.
- [Mod](#mod) - Someone got modded on a channel.
- [Mods](#mods) - Received the list of moderators of a channel.
- [Notice](#notice) - Received a notice from server.
- [Part](#part) - User has left a channel.
- [Ping](#ping) - Received PING from server.
- [Pong](#pong) - Sent a PING request ? PONG.
- [R9kbeta](#r9kbeta) - Channel enabled or disabled R9K mode.
- [Reconnect](#reconnect) - Trying to reconnect to server.
- [Resub](#resub) - Username has [resubbed](https://blog.twitch.tv/shout-out-your-channel-loyalty-with-resub-notifications-547d20b6efa2#.oxd0lqrc7) on a channel.
- [Roomstate](#roomstate) - The current state of the channel.
- [Serverchange](#serverchange) - Channel is no longer located on this cluster.
- [Slowmode](#slowmode) - Gives you the current state of the channel.
- [Subgift](#subgift) - Username has [gifted](https://blog.twitch.tv/subscriptionsbeta-4f7535749f2c) a subscription to a user on the channel.
- [Subscribers](#subscribers) - Channel enabled or disabled subscribers-only mode.
- [Subscription](#subscription) - Username has subscribed to a channel.
- [Timeout](#timeout) - Username has been timed out on a channel.
- [Unhost](#unhost) - Channel ended the current hosting.
- [Unmod](#unmod) - Someone got unmodded on a channel.
- [Whisper](#whisper) - Received a whisper.

### Action

Received action message on channel. (/me &lt;message&gt;)

**Parameters:**

- ``channel``: _String_ - Channel name
- ``userstate``: _Object_ - Userstate object
- ``message``: _String_ - Message received
- ``self``: _Boolean_ - Message was sent by the client

~~~ javascript
client.on("action", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Do your stuff.
});
~~~

According to Twitch, the userstate object is always subject to change.

~~~ bash
{
    'badges': { 'broadcaster': '1', 'warcraft': 'horde' },
    'color': '#FFFFFF',
    'display-name': 'Schmoopiie',
    'emotes': { '25': [ '0-4' ] },
    'mod': true,
    'room-id': '58355428',
    'subscriber': false,
    'turbo': true,
    'user-id': '58355428',
    'user-type': 'mod',
    'emotes-raw': '25:0-4',
    'badges-raw': 'broadcaster/1,warcraft/horde',
    'username': 'schmoopiie',
    'message-type': 'action'
}
~~~

### Ban

Username has been banned on a channel.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``username``: _String_ - Username
- ``reason``: _String_ - Reason of the ban can also be _null_

~~~ javascript
client.on("ban", function (channel, username, reason) {
    // Do your stuff.
});
~~~

### Chat

Received message on channel.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``userstate``: _Object_ - Userstate object
- ``message``: _String_ - Message received
- ``self``: _Boolean_ - Message was sent by the client

~~~ javascript
client.on("chat", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Do your stuff.
});
~~~

According to Twitch, the user object is always subject to change.

~~~ bash
{
    'badges': { 'broadcaster': '1', 'warcraft': 'horde' },
    'color': '#FFFFFF',
    'display-name': 'Schmoopiie',
    'emotes': { '25': [ '0-4' ] },
    'mod': true,
    'room-id': '58355428',
    'subscriber': false,
    'turbo': true,
    'user-id': '58355428',
    'user-type': 'mod',
    'emotes-raw': '25:0-4',
    'badges-raw': 'broadcaster/1,warcraft/horde',
    'username': 'schmoopiie',
    'message-type': 'chat'
}
~~~

### Cheer

Username has [cheered](https://blog.twitch.tv/introducing-cheering-celebrate-together-da62af41fac6) to a channel.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``userstate``: _Object_ - Userstate object
- ``message``: _String_ - Message

~~~ javascript
client.on("cheer", function (channel, userstate, message) {
    // Do your stuff.
});
~~~

Note: The amount of bits the user sent is inside the userstate (``userstate.bits``) - Read the [Twitch API documentation](https://github.com/justintv/Twitch-API/blob/master/IRC.md#bits-message) for more information.

### Clearchat

Chat of a channel got cleared.

**Parameters:**

- ``channel``: _String_ - Channel name

~~~ javascript
client.on("clearchat", function (channel) {
    // Do your stuff.
});
~~~

### Connected

Connected to server.

**Parameters:**

- ``address``: _String_ - Remote address
- ``port``: _Integer_ - Remote port

~~~ javascript
client.on("connected", function (address, port) {
    // Do your stuff.
});
~~~

### Connecting

Connecting to a server.

**Parameters:**

- ``address``: _String_ - Remote address
- ``port``: _Integer_ - Remote port

~~~ javascript
client.on("connecting", function (address, port) {
    // Do your stuff.
});
~~~

### Disconnected

Got disconnected from server.

**Parameters:**

- ``reason``: _String_ - Reason why you got disconnected

~~~ javascript
client.on("disconnected", function (reason) {
    // Do your stuff.
});
~~~

### Emoteonly

Channel enabled or disabled emote-only mode.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``enabled``: _Boolean_ - Returns ``true`` if mode is enabled or ``false`` if disabled

~~~ javascript
client.on("emoteonly", function (channel, enabled) {
    // Do your stuff.
});
~~~

### Emotesets

Received the ``emote-sets`` from Twitch.

**Parameters:**

- ``sets``: _String_ - Your emote sets (always contains the default emoticons set ``0``)
- ``obj``: _Object_ - Your emote sets with IDs and codes received from the Twitch API

~~~ javascript
client.on("emotesets", function(sets, obj) {
    // Here are the emotes I can use:
    console.log(obj);
});
~~~

### Followersonly

Channel enabled or disabled followers-only mode.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``enabled``: _Boolean_ - Returns ``true`` if mode is enabled or ``false`` if disabled
- ``length``: _Integer_ - Length in minutes

~~~ javascript
client.on("followersonly", function (channel, enabled, length) {
    // Do your stuff.
});
~~~

### Hosted

Channel is now hosted by another broadcaster. This event is fired only if you are logged in as the broadcaster.

**Parameters:**

- ``channel``: _String_ - Channel name being hosted
- ``username``: _String_ - Username hosting you
- ``viewers``: _Integer_ - Viewers count
- ``autohost``: _Boolean_ - [Auto-hosting](https://blog.twitch.tv/grow-your-community-with-auto-hosting-e80c1460f6e1)

~~~ javascript
client.on("hosted", function (channel, username, viewers, autohost) {
    // Do your stuff.
});
~~~

### Hosting

Channel is now hosting another channel.

**Parameters:**

- ``channel``: _String_ - Channel name that is now hosting
- ``target``: _String_ - Channel being hosted
- ``viewers``: _Integer_ - Viewers count

~~~ javascript
client.on("hosting", function (channel, target, viewers) {
    // Do your stuff.
});
~~~

### Join

Username has joined a channel. Not available on large channels and is also sent in batch every 30-60secs.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``username``: _String_ - Username who joined the channel
- ``self``: _Boolean_ - Client has joined the channel

~~~ javascript
client.on("join", function (channel, username, self) {
    // Do your stuff.
});
~~~

### Logon

Connection established, sending informations to server.

~~~ javascript
client.on("logon", function () {
    // Do your stuff.
});
~~~

### Message

Received a message. This event is fired whenever you receive a [chat](#chat), [action](action) or [whisper](whisper) message.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``userstate``: _Object_ - Userstate object
- ``message``: _String_ - Message received
- ``self``: _Boolean_ - Message was sent by the client

~~~ javascript
client.on("message", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Handle different message types..
    switch(userstate["message-type"]) {
        case "action":
            // This is an action message..
            break;
        case "chat":
            // This is a chat message..
            break;
        case "whisper":
            // This is a whisper..
            break;
        default:
            // Something else ?
            break;
    }
});
~~~

According to Twitch, the userstate object is always subject to change.

~~~ bash
{
    'badges': { 'broadcaster': '1', 'warcraft': 'horde' },
    'color': '#FFFFFF',
    'display-name': 'Schmoopiie',
    'emotes': { '25': [ '0-4' ] },
    'mod': true,
    'room-id': '58355428',
    'subscriber': false,
    'turbo': true,
    'user-id': '58355428',
    'user-type': 'mod',
    'emotes-raw': '25:0-4',
    'badges-raw': 'broadcaster/1,warcraft/horde',
    'username': 'schmoopiie',
    'message-type': 'action'
}
~~~

### Mod

Someone got modded on a channel.

**Important:** It doesn't detect if ``username`` is a new moderator, it is triggered when jtv gives the moderator status to someone on a channel. You will see a lot of ``mod`` / ``unmod`` events on a channel. When a moderator joins a channel, it will take a few seconds for jtv to give the user the moderator status. When leaving a channel, the user gets unmodded.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``username``: _String_ - Username

~~~ javascript
client.on("mod", function (channel, username) {
    // Do your stuff.
});
~~~

### Mods

Received the list of moderators of a channel.

Parameters:

- ``channel``: _String_ - Channel name
- ``mods``: _Array_ - Moderators of the channel

~~~ javascript
client.on("mods", function (channel, mods) {
    // Do your stuff.
});
~~~

### Notice

Received a notice from server. The goal of these notices is to allow the users to change their language settings and still be able to know programmatically what message was sent by the server. We encourage to use the ``msg-id`` to compare these messages.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``msgid``: _String_ - Message ID (See known msg-ids below)
- ``message``: _String_ - Message received

Known msg-ids:

- ``already_banned``: X is already banned in this room.
- ``already_emote_only_on``: This room is already in emote-only mode.
- ``already_emote_only_off``: This room is not in emote-only mode.
- ``already_subs_on``: This room is already in subscribers-only mode.
- ``already_subs_off``: This room is not in subscribers-only mode.
- ``bad_ban_admin``: You cannot ban admin X.
- ``bad_ban_broadcaster``: You cannot ban the broadcaster.
- ``bad_ban_global_mod``: You cannot ban global moderator X.
- ``bad_ban_self``: You cannot ban yourself.
- ``bad_ban_staff``: You cannot ban staff X.
- ``bad_commercial_error``: Failed to start commercial.
- ``bad_host_hosting``: This channel is already hosting X.
- ``bad_host_rate_exceeded``: Host target cannot be changed more than 3 times every half hour.
- ``bad_mod_mod``: X is already a moderator of this room.
- ``bad_mod_banned``: X is banned in this room.
- ``bad_timeout_admin``: You cannot timeout admin X.
- ``bad_timeout_global_mod``: You cannot timeout global moderator X.
- ``bad_timeout_self``: You cannot timeout yourself.
- ``bad_timeout_staff``: You cannot timeout staff X.
- ``bad_unban_no_ban``: X is not banned from this room.
- ``bad_unmod_mod``: X is not a moderator of this room.
- ``ban_success``: X is now banned from this room.
- ``cmds_available``: Commands available to you in this room (use /help for details)..
- ``color_changed``: Your color has been changed.
- ``commercial_success``: Initiating X second commercial break. Please keep in mind..
- ``emote_only_on``: This room is now in emote-only mode.
- ``emote_only_off``: This room is no longer in emote-only mode.
- ``hosts_remaining``: X host commands remaining this half hour.
- ``host_target_went_offline``: X has gone offline. Exiting host mode
- ``mod_success``: You have added X as a moderator of this room.
- ``msg_banned``: You are permanently banned from talking in channel.
- ``msg_censored_broadcaster``: Your message was modified for using words banned by X.
- ``msg_channel_suspended``: This channel has been suspended.
- ``msg_duplicate``: Your message was not sent because you are sending messages too quickly.
- ``msg_emoteonly``: This room is in emote only mode.
- ``msg_ratelimit``: Your message was not sent because you are sending messages too quickly.
- ``msg_subsonly``: This room is in subscribers only mode. To talk, purchase..
- ``msg_timedout``: You are banned from talking in X for Y more seconds.
- ``msg_verified_email``: This room requires a verified email address to chat.
- ``no_help``: No help available.
- ``no_permission``: You don't have permission to perform that action.
- ``not_hosting``: No channel is currently being hosted.
- ``timeout_success``: X has been timed out for length seconds.
- ``unban_success``: X is no longer banned from this room.
- ``unmod_success``: You have removed X as a moderator of this room.
- ``unrecognized_cmd``: Unrecognized command: X
- ``usage_ban``: Usage: "/ban " - Permanently prevent a user from chatting..
- ``usage_clear``: Usage: "/clear" - Clear chat history for all users in this room.
- ``usage_color``: Usage: "/color <color>" - Change your username color. Color must be..
- ``usage_commercial``: Usage: "/commercial [length]" - Triggers a commercial.
- ``usage_disconnect``: Usage: "/disconnect" - Reconnects to chat.
- ``usage_emote_only_on``: Usage: "/emoteonly" - Enables emote-only mode..
- ``usage_emote_only_off``: Usage: "/emoteonlyoff" - Disables emote-only mode..
- ``usage_help``: Usage: "/help" - Lists the commands available to you in this room.
- ``usage_host``: Usage: "/host " - Host another channel. Use "unhost" to unset host mode.
- ``usage_me``: Usage: "/me " - Send an "emote" message in the third person.
- ``usage_mod``: Usage: "/mod " - Grant mod status to a user. Use "mods" to list the..
- ``usage_mods``: Usage: "/mods" - Lists the moderators of this channel.
- ``usage_r9k_on``: Usage: "/r9kbeta" - Enables r9k mode. See http://bit.ly/bGtBDf for details.
- ``usage_r9k_off``: Usage: "/r9kbetaoff" - Disables r9k mode.
- ``usage_slow_on``: Usage: "/slow [duration]" - Enables slow mode..
- ``usage_slow_off``: Usage: "/slowoff" - Disables slow mode.
- ``usage_subs_on``: Usage: "/subscribers" - Enables subscribers-only mode..
- ``usage_subs_off``: Usage: "/subscribersoff" - Disables subscribers-only mode.
- ``usage_timeout``: Usage: "/timeout [duration]" - Temporarily prevent a user from chatting.
- ``usage_unban``: Usage: "/unban " - Removes a ban on a user.
- ``usage_unhost``: Usage: "/unhost" - Stop hosting another channel.
- ``usage_unmod``: Usage: "/unmod " - Revoke mod status from a user..
- ``whisper_invalid_self``: You cannot whisper to yourself.
- ``whisper_limit_per_min``: You are sending whispers too fast. Try again in a minute.
- ``whisper_limit_per_sec``: You are sending whispers too fast. Try again in a second.
- ``whisper_restricted_recipient``: That user's settings prevent them from receiving this whisper.

The following msg-ids wont be returned in the ``notice`` event because they are already available as event listeners:

- ``host_off``: Exited hosting mode.
- ``host_on``: Now hosting X
- ``no_mods``: There are no moderators for this room.
- ``r9k_off``: This room is no longer in r9k mode.
- ``r9k_on``: This room is now in r9k mode.
- ``room_mods``: The moderators of this room are X
- ``slow_off``: This room is no longer in slow mode.
- ``slow_on``: This room is now in slow mode. You may send messages every X seconds.
- ``subs_off``: This room is no longer in subscribers-only mode.
- ``subs_on``: This room is now in subscribers-only mode.

~~~ javascript
client.on("notice", function (channel, msgid, message) {
    // Do your stuff.
});
~~~

### Part

User has left a channel.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``username``: _String_ - Username who left the channel
- ``self``: _Boolean_ - Client has left the channel

~~~ javascript
client.on("part", function (channel, username, self) {
    // Do your stuff.
});
~~~

### Ping

Received PING from server.

~~~ javascript
client.on("ping", function () {
    // Do your stuff.
});
~~~

### Pong

Sent a PING request ? PONG.

**Parameters:**

- ``latency``: _Float_ - Current latency

~~~ javascript
client.on("pong", function (latency) {
    // Do your stuff.
});
~~~

### R9kbeta

Channel enabled or disabled R9K mode.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``enabled``: _Boolean_ - Returns ``true`` if mode is enabled or ``false`` if disabled

~~~ javascript
client.on("r9kbeta", function (channel, enabled) {
    // Do your stuff.
});
~~~

### Reconnect

Trying to reconnect to server.

~~~ javascript
client.on("reconnect", function () {
    // Do your stuff.
});
~~~

### Resub

Username has [resubbed](https://blog.twitch.tv/shout-out-your-channel-loyalty-with-resub-notifications-547d20b6efa2#.oxd0lqrc7) on a channel.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``username``: _String_ - Username
- ``months``: _Integer_ - How many months
- ``message``: _String_ - Custom message
- ``userstate``: _Object_ - Userstate
- ``methods``: _Object_ - Resub methods and plan (such as Prime)

~~~ javascript
client.on("resub", function (channel, username, months, message, userstate, methods) {
    // Do your stuff.
});
~~~

### Roomstate

Triggered upon joining a channel. Gives you the current state of the channel.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``state``: _Object_ - Current state of the channel

~~~ javascript
client.on("roomstate", function (channel, state) {
    // Do your stuff.
});
~~~

According to Twitch, the state object is always subject to change.

~~~ bash
{
    'broadcaster-lang': null,
    'r9k': false,
    'slow': false,
    'subs-only': false,
    'channel': '#schmoopiie'
}
~~~

### Serverchange

Channel is no longer located on this cluster.

**Parameters:**

- ``channel``: _String_ - Channel name

~~~ javascript
client.on("serverchange", function (channel) {
    // Do your stuff.
});
~~~

### Slowmode

Channel enabled or disabled slow mode.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``enabled``: _Boolean_ - Returns ``true`` if mode is enabled or ``false`` if disabled
- ``length``: _Integer_ - Slow length value

~~~ javascript
client.on("slowmode", function (channel, enabled, length) {
    // Do your stuff.
});
~~~

### Subscribers

Channel enabled or disabled subscribers-only mode.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``enabled``: _Boolean_ - Returns ``true`` if mode is enabled or ``false`` if disabled

~~~ javascript
client.on("subscribers", function (channel, enabled) {
    // Do your stuff.
});
~~~

### Subgift

Username has gifted a subscription to a user on a channel.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``username``: _String_ - Gifter username
- ``recipient``: _String_ - Giftee username
- ``method``: _Object_ - Methods and plan used to subscribe
- ``userstate``: _Object_ - Userstate

~~~ javascript
client.on("subgift", function (channel, username, recipient, method, userstate) {
    // Do your stuff.
});
~~~

Note: more information is available with the userstate :
- ``userstate['user-id']``: Gifter Id
- ``userstate['msg-param-recipient-id']``: Recipient Id
- ``userstate['msg-param-recipient-display-name']``: Recipient Display Name

### Subscription

Username has subscribed to a channel.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``username``: _String_ - Username
- ``method``: _Object_ - Methods and plan used to subscribe
- ``message``: _String_ - Custom message
- ``userstate``: _Object_ - Userstate

~~~ javascript
client.on("subscription", function (channel, username, method, message, userstate) {
    // Do your stuff.
});
~~~

### Timeout

Username has been timed out on a channel.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``username``: _String_ - Username
- ``reason``: _String_ - Reason of the timeout can also be _null_
- ``duration``: _Integer_ - Duration of the timeout

~~~ javascript
client.on("timeout", function (channel, username, reason, duration) {
    // Do your stuff.
});
~~~

### Unhost

Channel ended the current hosting.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``viewers``: _Integer_ - Viewer count

~~~ javascript
client.on("unhost", function (channel, viewers) {
    // Do your stuff.
});
~~~

### Unmod

Someone got unmodded on a channel.

**Important:** It doesn't detect if ``username`` got removed from moderators list. You will see a lot of ``mod`` / ``unmod`` events on a channel. When a moderator joins a channel, it will take a few seconds for jtv to give the user the moderator status. When leaving a channel, the user gets unmodded.

**Parameters:**

- ``channel``: _String_ - Channel name
- ``username``: _String_ - Username

~~~ javascript
client.on("unmod", function (channel, username) {
    // Do your stuff.
});
~~~

### Whisper

Received a whisper. You won't receive whispers from ignored users.

**Parameters:**

- ``from``: _String_ - Username who sent the message
- ``userstate``: _Object_ - Userstate object
- ``message``: _String_ - Message received
- ``self``: _Boolean_ - Message was sent by the client

~~~ javascript
client.on("whisper", function (from, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Do your stuff.
});
~~~

According to Twitch, the userstate object is always subject to change.

~~~ bash
{
    'badges': null,
    'color': '#FFFFFF',
    'display-name': 'Schmoopiie',
    'emotes': { '25': [ '0-4' ] },
    'message-id': '123',
    'thread-id': '1234567_12345678',
    'turbo': true,
    'user-id': '58355428',
    'user-type': null,
    'badges-raw': null,
    'emotes-raw': '25:0-4',
    'username': 'schmoopiie',
    'message-type': 'whisper'
}
~~~