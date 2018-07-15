---
id: class
title: Classes
sidebar_label: Classes
---

## Overview

<dl>
<dt><a href="#Api">Api</a></dt>
  <dd><p>API client</p>
</dd>
  <dt><a href="#Chat">Chat</a> ⇐ <code>external:EventEmitter3</code></dt>
  <dd><p>Chat client</p>
</dd>
  <dt><a href="#TwitchJs">TwitchJs</a></dt>
  <dd><p>TwitchJs client</p>
</dd>
  </dl>

<a name="Api"></a>

## Api
API client

**Kind**: global class  

* [Api](#Api)
    * [new Api(options)](#new_Api_new)
    * [.readyState](#Api+readyState) : <code>number</code>
    * [.status](#Api+status) : <code>ApiStatusState</code>
    * [.initialize()](#Api+initialize) ⇒ <code>Promise.&lt;ApiStatusState, Object&gt;</code>
    * [.hasScope(scope)](#Api+hasScope) ⇒ <code>Promise.&lt;boolean, boolean&gt;</code>
    * [.get(endpoint, [options])](#Api+get)
    * [.post(endpoint, [options])](#Api+post)
    * [.put(endpoint, [options])](#Api+put)


* * *

<a name="new_Api_new"></a>

### new Api(options)
API constructor.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>ApiOptions</code></td>
    </tr>  </tbody>
</table>

**Example** *(Get Featured Streams)*  
```js
const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
const username = 'ronni'
const { api } = new TwitchJs({ token, username })

api.get('streams/featured').then(response => {
  // Do stuff ...
})
```

* * *

<a name="Api+readyState"></a>

### api.readyState : <code>number</code>
API client ready state : **1** ready; **2** initialized.

**Kind**: instance property of [<code>Api</code>](#Api)  

* * *

<a name="Api+status"></a>

### api.status : <code>ApiStatusState</code>
API status.

**Kind**: instance property of [<code>Api</code>](#Api)  

* * *

<a name="Api+initialize"></a>

### api.initialize() ⇒ <code>Promise.&lt;ApiStatusState, Object&gt;</code>
Initialize API client and retrieve status.

**Kind**: instance method of [<code>Api</code>](#Api)  
**See**: https://dev.twitch.tv/docs/v5/#root-url  

* * *

<a name="Api+hasScope"></a>

### api.hasScope(scope) ⇒ <code>Promise.&lt;boolean, boolean&gt;</code>
Check if current credentials include `scope`.

**Kind**: instance method of [<code>Api</code>](#Api)  
**See**: https://dev.twitch.tv/docs/authentication/#twitch-api-v5  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>scope</td><td><code>string</code></td><td><p>Scope to check.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="Api+get"></a>

### api.get(endpoint, [options])
GET endpoint.

**Kind**: instance method of [<code>Api</code>](#Api)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>endpoint</td><td><code>string</code></td>
    </tr><tr>
    <td>[options]</td><td><code>FetchOptions</code></td>
    </tr>  </tbody>
</table>

**Example** *(Get Live Overwatch Streams)*  
```js
api.get('streams', { search: { game: 'Overwatch' } })
  .then(response => {
    // Do stuff with response ...
  })
```

* * *

<a name="Api+post"></a>

### api.post(endpoint, [options])
POST endpoint.

**Kind**: instance method of [<code>Api</code>](#Api)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>endpoint</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>[options]</td><td><code>FetchOptions</code></td><td><code>{method:&#x27;post&#x27;}</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Api+put"></a>

### api.put(endpoint, [options])
PUT endpoint.

**Kind**: instance method of [<code>Api</code>](#Api)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Default</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>endpoint</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>[options]</td><td><code>FetchOptions</code></td><td><code>{method:&#x27;put&#x27;}</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat"></a>

## Chat ⇐ <code>external:EventEmitter3</code>
Chat client

**Kind**: global class  
**Extends**: <code>external:EventEmitter3</code>  
**Emits**: [<code>\*</code>](#Chat+event_*), [<code>CLEARCHAT</code>](#Chat+event_CLEARCHAT), [<code>CLEARCHAT/USER_BANNED</code>](#Chat+event_CLEARCHAT/USER_BANNED), [<code>GLOBALUSERSTATE</code>](#Chat+event_GLOBALUSERSTATE), [<code>HOSTTARGET</code>](#Chat+event_HOSTTARGET), [<code>JOIN</code>](#Chat+event_JOIN), [<code>MODE</code>](#Chat+event_MODE), [<code>NAMES</code>](#Chat+event_NAMES), [<code>NAMES_END</code>](#Chat+event_NAMES_END), [<code>NOTICE</code>](#Chat+event_NOTICE), [<code>NOTICE/ROOM_MODS</code>](#Chat+event_NOTICE/ROOM_MODS), [<code>PART</code>](#Chat+event_PART), [<code>PRIVMSG</code>](#Chat+event_PRIVMSG), [<code>ROOMSTATE</code>](#Chat+event_ROOMSTATE), [<code>USERNOTICE/RAID</code>](#Chat+event_USERNOTICE/RAID), [<code>USERNOTICE/RESUBSCRIPTION</code>](#Chat+event_USERNOTICE/RESUBSCRIPTION), [<code>USERNOTICE/RITUAL</code>](#Chat+event_USERNOTICE/RITUAL), [<code>USERNOTICE/SUBSCRIPTION</code>](#Chat+event_USERNOTICE/SUBSCRIPTION), [<code>USERNOTICE/SUBSCRIPTION_GIFT</code>](#Chat+event_USERNOTICE/SUBSCRIPTION_GIFT), [<code>USERSTATE</code>](#Chat+event_USERSTATE)  

* [Chat](#Chat) ⇐ <code>external:EventEmitter3</code>
    * [new Chat(options)](#new_Chat_new)
    * [.readyState](#Chat+readyState) : <code>number</code>
    * [.userState](#Chat+userState) : <code>GlobalUserStateTags</code>
    * [.channels](#Chat+channels) : <code>Object.&lt;string, ChannelState&gt;</code>
    * [.options](#Chat+options) : <code>ChatOptions</code>
    * [.connect()](#Chat+connect) ⇒ <code>Promise.&lt;GlobalUserStateMessage, string&gt;</code>
    * [.send(message)](#Chat+send)
    * [.disconnect()](#Chat+disconnect)
    * [.join(channel)](#Chat+join) ⇒ <code>Promise.&lt;ChannelState, string&gt;</code>
    * [.part(channel)](#Chat+part)
    * [.say(channel, message)](#Chat+say) ⇒ <code>Promise.&lt;UserStateMessage, string&gt;</code>
    * [.broadcast(message)](#Chat+broadcast) ⇒ <code>Promise.&lt;Array.&lt;UserStateMessage&gt;&gt;</code>
    * ["*"](#Chat+event_*)
    * ["JOIN"](#Chat+event_JOIN)
    * ["PART"](#Chat+event_PART)
    * ["MODE"](#Chat+event_MODE)
    * ["NAMES"](#Chat+event_NAMES)
    * ["NAMES_END"](#Chat+event_NAMES_END)
    * ["GLOBALUSERSTATE"](#Chat+event_GLOBALUSERSTATE)
    * ["CLEARCHAT/USER_BANNED"](#Chat+event_CLEARCHAT/USER_BANNED)
    * ["CLEARCHAT"](#Chat+event_CLEARCHAT)
    * ["HOSTTARGET"](#Chat+event_HOSTTARGET)
    * ["ROOMSTATE"](#Chat+event_ROOMSTATE)
    * ["NOTICE/ROOM_MODS"](#Chat+event_NOTICE/ROOM_MODS)
    * ["NOTICE"](#Chat+event_NOTICE)
    * ["USERSTATE"](#Chat+event_USERSTATE)
    * ["PRIVMSG"](#Chat+event_PRIVMSG)
    * ["USERNOTICE/SUBSCRIPTION"](#Chat+event_USERNOTICE/SUBSCRIPTION)
    * ["USERNOTICE/RESUBSCRIPTION"](#Chat+event_USERNOTICE/RESUBSCRIPTION)
    * ["USERNOTICE/SUBSCRIPTION_GIFT"](#Chat+event_USERNOTICE/SUBSCRIPTION_GIFT)
    * ["USERNOTICE/RAID"](#Chat+event_USERNOTICE/RAID)
    * ["USERNOTICE/RITUAL"](#Chat+event_USERNOTICE/RITUAL)


* * *

<a name="new_Chat_new"></a>

### new Chat(options)
Chat constructor.

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>ChatOptions</code></td>
    </tr>  </tbody>
</table>

**Example** *(Connecting to Twitch and joining #dallas)*  
```js
const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
const username = 'ronni'
const channel = '#dallas'
const { chat } = new TwitchJs({ token, username })

chat.connect().then(globalUserState => {
  // Listen to all messages
  chat.on('*', message => {
    // Do stuff with message ...
  })

  // Listen to PRIVMSG
  chat.on('PRIVMSG', privateMessage => {
    // Do stuff with privateMessage ...
  })

  // Do other stuff ...

  chat.join(channel).then(channelState => {
    // Do stuff with channelState...
  })
})
```

* * *

<a name="Chat+readyState"></a>

### chat.readyState : <code>number</code>
Chat client ready state: **0** not ready; **1** connecting; **2**
connected **3**; disconnecting, or; **4** disconnected.

**Kind**: instance property of [<code>Chat</code>](#Chat)  

* * *

<a name="Chat+userState"></a>

### chat.userState : <code>GlobalUserStateTags</code>
**Kind**: instance property of [<code>Chat</code>](#Chat)  

* * *

<a name="Chat+channels"></a>

### chat.channels : <code>Object.&lt;string, ChannelState&gt;</code>
**Kind**: instance property of [<code>Chat</code>](#Chat)  

* * *

<a name="Chat+options"></a>

### chat.options : <code>ChatOptions</code>
Validated options.

**Kind**: instance property of [<code>Chat</code>](#Chat)  

* * *

<a name="Chat+connect"></a>

### chat.connect() ⇒ <code>Promise.&lt;GlobalUserStateMessage, string&gt;</code>
Connect to Twitch.

**Kind**: instance method of [<code>Chat</code>](#Chat)  
**Returns**: <code>Promise.&lt;GlobalUserStateMessage, string&gt;</code> - Global user state message  

* * *

<a name="Chat+send"></a>

### chat.send(message)
Sends a raw message to Twitch.

**Kind**: instance method of [<code>Chat</code>](#Chat)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td><td><p>Message to send.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+disconnect"></a>

### chat.disconnect()
Disconnect from Twitch.

**Kind**: instance method of [<code>Chat</code>](#Chat)  

* * *

<a name="Chat+join"></a>

### chat.join(channel) ⇒ <code>Promise.&lt;ChannelState, string&gt;</code>
Join a channel.

**Kind**: instance method of [<code>Chat</code>](#Chat)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>channel</td><td><code>string</code></td>
    </tr>  </tbody>
</table>

**Example** *(Joining #dallas)*  
```js
const channel = '#dallas'

chat.join(channel).then(channelState => {
  // Do stuff with channelState...
})
```
**Example** *(Joining multiple channels)*  
```js
const channels = ['#dallas', '#ronni']

Promise.all(channels.map(channel => chat.join(channel)))
  .then(channelStates => {
    // Listen to all PRIVMSG
    chat.on('PRIVMSG', privateMessage => {
      // Do stuff with privateMessage ...
    })

    // Listen to PRIVMSG from #dallas ONLY
    chat.on('PRIVMSG/#dallas', privateMessage => {
      // Do stuff with privateMessage ...
    })
    // Listen to all PRIVMSG from #ronni ONLY
    chat.on('PRIVMSG/#ronni', privateMessage => {
      // Do stuff with privateMessage ...
    })
  })
```

* * *

<a name="Chat+part"></a>

### chat.part(channel)
Depart from a channel.

**Kind**: instance method of [<code>Chat</code>](#Chat)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>channel</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+say"></a>

### chat.say(channel, message) ⇒ <code>Promise.&lt;UserStateMessage, string&gt;</code>
Send a message to a channel.

**Kind**: instance method of [<code>Chat</code>](#Chat)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>channel</td><td><code>string</code></td>
    </tr><tr>
    <td>message</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+broadcast"></a>

### chat.broadcast(message) ⇒ <code>Promise.&lt;Array.&lt;UserStateMessage&gt;&gt;</code>
Broadcast message to all connected channels.

**Kind**: instance method of [<code>Chat</code>](#Chat)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_*"></a>

### "*"
All events are also emitted with this event name.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  

* * *

<a name="Chat+event_JOIN"></a>

### "JOIN"
Join a channel.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>BaseMessage</code>  
**See**: https://dev.twitch.tv/docs/irc/membership/#join-twitch-membership  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>username</td><td><code>string</code></td><td><p>Username (lower-case)</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_PART"></a>

### "PART"
Depart from a channel.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>BaseMessage</code>  
**See**: https://dev.twitch.tv/docs/irc/membership/#part-twitch-membership  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>username</td><td><code>string</code></td><td><p>Username (lower-case)</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_MODE"></a>

### "MODE"
Gain/lose moderator (operator) status in a channel.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>BaseMessage</code>  
**See**: https://dev.twitch.tv/docs/irc/membership/#mode-twitch-membership  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>string</code></td>
    </tr><tr>
    <td>username</td><td><code>string</code></td>
    </tr><tr>
    <td>isModerator</td><td><code>boolean</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_NAMES"></a>

### "NAMES"
List current chatters in a channel.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>BaseMessage</code>  
**See**: https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>usernames</td><td><code>Array.&lt;string&gt;</code></td><td><p>Array of usernames present in channel</p>
</td>
    </tr><tr>
    <td>listType</td><td><code>&#x27;mods&#x27;</code> | <code>&#x27;chatters&#x27;</code></td><td></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_NAMES_END"></a>

### "NAMES_END"
End of list current chatters in a channel.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>BaseMessage</code>  
**See**: https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership  

* * *

<a name="Chat+event_GLOBALUSERSTATE"></a>

### "GLOBALUSERSTATE"
On successful login.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>GlobalUserStateMessage</code>  

* * *

<a name="Chat+event_CLEARCHAT/USER_BANNED"></a>

### "CLEARCHAT/USER_BANNED"
Temporary or permanent ban on a channel.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>BaseMessage</code>  
**See**

- https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
- https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags

**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>tags</td><td><code>ClearChatTags</code></td>
    </tr><tr>
    <td>username</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_CLEARCHAT"></a>

### "CLEARCHAT"
All chat is cleared (deleted).

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>BaseMessage</code>  
**See**

- https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
- https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags


* * *

<a name="Chat+event_HOSTTARGET"></a>

### "HOSTTARGET"
Host starts or stops a message.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>BaseMessage</code>  
**See**: https://dev.twitch.tv/docs/irc/commands/#hosttarget-twitch-commands  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[numberOfViewers]</td><td><code>number</code></td><td><p>Number of viewers</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_ROOMSTATE"></a>

### "ROOMSTATE"
When a user joins a channel or a room setting is changed.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>BaseMessage</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>tags</td><td><code>RoomStateTags</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_NOTICE/ROOM_MODS"></a>

### "NOTICE/ROOM_MODS"
NOTICE/ROOM_MODS message

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>NoticeMessage</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>&#x27;ROOM_MODS&#x27;</code></td>
    </tr><tr>
    <td>mods</td><td><code>Array.&lt;string&gt;</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_NOTICE"></a>

### "NOTICE"
**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>NoticeMessage</code>  
**See**: https://dev.twitch.tv/docs/irc/commands/#msg-id-tags-for-the-notice-commands-capability  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>string</code></td><td><p><code>msg-id</code> tag (snake uppercase)</p>
</td>
    </tr><tr>
    <td>tags</td><td><code>Object</code></td><td></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERSTATE"></a>

### "USERSTATE"
When a user joins a channel or sends a PRIVMSG to a channel.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>UserStateMessage</code>  

* * *

<a name="Chat+event_PRIVMSG"></a>

### "PRIVMSG"
When a user joins a channel or sends a PRIVMSG to a channel.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>UserStateMessage</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[event]</td><td><code>&#x27;CHEER&#x27;</code></td>
    </tr><tr>
    <td>[event]</td><td><code>string</code></td>
    </tr><tr>
    <td>[bits]</td><td><code>number</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/SUBSCRIPTION"></a>

### "USERNOTICE/SUBSCRIPTION"
On subscription (first month) to a channel.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>UserStateMessage</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>&#x27;SUBSCRIPTION&#x27;</code></td>
    </tr><tr>
    <td>systemMessage</td><td><code>string</code></td>
    </tr><tr>
    <td>months</td><td><code>string</code></td>
    </tr><tr>
    <td>subPlan</td><td><code>string</code></td>
    </tr><tr>
    <td>subPlanName</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/RESUBSCRIPTION"></a>

### "USERNOTICE/RESUBSCRIPTION"
On resubscription (subsequent months) to a channel.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>UserNoticeSubscriptionMessage</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>&#x27;RESUBSCRIPTION&#x27;</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/SUBSCRIPTION_GIFT"></a>

### "USERNOTICE/SUBSCRIPTION_GIFT"
On subscription gift to a channel.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>UserStateMessage</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>&#x27;SUBSCRIPTION_GIFT&#x27;</code></td>
    </tr><tr>
    <td>systemMessage</td><td><code>string</code></td>
    </tr><tr>
    <td>recipientDisplayName</td><td><code>string</code></td>
    </tr><tr>
    <td>recipientId</td><td><code>string</code></td>
    </tr><tr>
    <td>recipientUserName</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/RAID"></a>

### "USERNOTICE/RAID"
On channel raid.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>UserStateMessage</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>&#x27;RAID&#x27;</code></td>
    </tr><tr>
    <td>systemMessage</td><td><code>string</code></td>
    </tr><tr>
    <td>raiderDisplayName</td><td><code>string</code></td>
    </tr><tr>
    <td>raiderUserName</td><td><code>string</code></td>
    </tr><tr>
    <td>raiderViewerCount</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/RITUAL"></a>

### "USERNOTICE/RITUAL"
On channel ritual.

**Kind**: event emitted by [<code>Chat</code>](#Chat)  
**Mixes**: <code>UserStateMessage</code>  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>&#x27;RITUAL&#x27;</code></td>
    </tr><tr>
    <td>systemMessage</td><td><code>string</code></td>
    </tr><tr>
    <td>ritualName</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="TwitchJs"></a>

## TwitchJs
TwitchJs client

**Kind**: global class  

* [TwitchJs](#TwitchJs)
    * [new TwitchJs(options)](#new_TwitchJs_new)
    * [.chat](#TwitchJs+chat) : [<code>Chat</code>](#Chat)
    * [.chatConstants](#TwitchJs+chatConstants) : <code>Object</code>
    * [.api](#TwitchJs+api) : [<code>Api</code>](#Api)


* * *

<a name="new_TwitchJs_new"></a>

### new TwitchJs(options)
TwitchJs constructor

<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td>
    </tr><tr>
    <td>options.token</td><td><code>string</code></td>
    </tr><tr>
    <td>options.username</td><td><code>string</code></td>
    </tr><tr>
    <td>[options.chat]</td><td><code>ChatOptions</code></td>
    </tr><tr>
    <td>[options.api]</td><td><code>ApiOptions</code></td>
    </tr>  </tbody>
</table>

**Example** *(Instantiating TwitchJS)*  
```js
const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
const username = 'ronni'
const twitchJs = new TwitchJs({ token, username })

twitchJs.chat.connect().then(globalUserState => {
  // Do stuff ...
})

twitchJs.api.get('channel').then(response => {
  // Do stuff ...
})
```

* * *

<a name="TwitchJs+chat"></a>

### twitchJs.chat : [<code>Chat</code>](#Chat)
**Kind**: instance property of [<code>TwitchJs</code>](#TwitchJs)  

* * *

<a name="TwitchJs+chatConstants"></a>

### twitchJs.chatConstants : <code>Object</code>
**Kind**: instance property of [<code>TwitchJs</code>](#TwitchJs)  

* * *

<a name="TwitchJs+api"></a>

### twitchJs.api : [<code>Api</code>](#Api)
**Kind**: instance property of [<code>TwitchJs</code>](#TwitchJs)  

* * *

