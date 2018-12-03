---
id: class
title: Classes
sidebar_label: Classes
---

## Overview

<dl>
<dt><a href="#Api">Api</a></dt>
  <dd></dd>
  <dt><a href="#ChatError">ChatError</a> ⇐ <code><a href="class#BaseError">BaseError</a></code></dt>
  <dd><p>Base error for the chat module</p>
</dd>
  <dt><a href="#AuthenticationError">AuthenticationError</a> ⇐ <code><a href="class#ChatError">ChatError</a></code></dt>
  <dd></dd>
  <dt><a href="#ParseError">ParseError</a> ⇐ <code><a href="class#ChatError">ChatError</a></code></dt>
  <dd></dd>
  <dt><a href="#JoinError">JoinError</a> ⇐ <code><a href="class#ChatError">ChatError</a></code></dt>
  <dd></dd>
  <dt><a href="#TimeoutError">TimeoutError</a> ⇐ <code><a href="class#ChatError">ChatError</a></code></dt>
  <dd></dd>
  <dt><a href="#Chat">Chat</a> ⇐ <code>EventEmitter</code></dt>
  <dd><p>Twitch Chat Client</p>
</dd>
  <dt><a href="#TwitchJs">TwitchJs</a></dt>
  <dd><p>TwitchJs client</p>
</dd>
  <dt><a href="#BaseError">BaseError</a> ⇐ <code>Error</code></dt>
  <dd></dd>
  </dl>

<a name="Api"></a>

## Api
**Kind**: global class  
**Access**: public  

* [Api](#Api)
    * [new Api(options)](#new_Api_new)
    * [.log](#Api+log) : <code>any</code>
    * [.setOptions(options)](#Api+setOptions)
    * [.getOptions()](#Api+getOptions) ⇒ [<code>ApiOptions</code>](typedef#ApiOptions)
    * [.getReadyState()](#Api+getReadyState) ⇒ <code>number</code>
    * [.getStatus()](#Api+getStatus) ⇒ [<code>ApiStatusState</code>](typedef#ApiStatusState)
    * [.updateOptions(options)](#Api+updateOptions)
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
    <td>options</td><td><code><a href="typedef#ApiOptions">ApiOptions</a></code></td>
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

<a name="Api+log"></a>

### api.log : <code>any</code>
**Kind**: instance property of [<code>Api</code>](class#Api)  
**Access**: public  

* * *

<a name="Api+setOptions"></a>

### api.setOptions(options)
**Kind**: instance method of [<code>Api</code>](class#Api)  
**Access**: public  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code><a href="typedef#ApiOptions">ApiOptions</a></code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Api+getOptions"></a>

### api.getOptions() ⇒ [<code>ApiOptions</code>](typedef#ApiOptions)
**Kind**: instance method of [<code>Api</code>](class#Api)  
**Access**: public  

* * *

<a name="Api+getReadyState"></a>

### api.getReadyState() ⇒ <code>number</code>
**Kind**: instance method of [<code>Api</code>](class#Api)  
**Access**: public  

* * *

<a name="Api+getStatus"></a>

### api.getStatus() ⇒ [<code>ApiStatusState</code>](typedef#ApiStatusState)
**Kind**: instance method of [<code>Api</code>](class#Api)  
**Access**: public  

* * *

<a name="Api+updateOptions"></a>

### api.updateOptions(options)
Update client options.

**Kind**: instance method of [<code>Api</code>](class#Api)  
**Access**: public  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code><a href="typedef#ApiOptions">ApiOptions</a></code></td><td><p>New client options. To update <code>token</code> or <code>clientId</code>, use <a href="Api#initialize"><strong>api.initialize()</strong></a>.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="Api+get"></a>

### api.get(endpoint, [options])
**Kind**: instance method of [<code>Api</code>](class#Api)  
**Access**: public  
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
    <td>[options]</td><td><code><a href="typedef#FetchOptions">FetchOptions</a></code></td>
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
**Kind**: instance method of [<code>Api</code>](class#Api)  
**Access**: public  
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
    <td>[options]</td><td><code><a href="typedef#FetchOptions">FetchOptions</a></code></td><td><code>{method:&#x27;post&#x27;}</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Api+put"></a>

### api.put(endpoint, [options])
**Kind**: instance method of [<code>Api</code>](class#Api)  
**Access**: public  
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
    <td>[options]</td><td><code><a href="typedef#FetchOptions">FetchOptions</a></code></td><td><code>{method:&#x27;put&#x27;}</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="ChatError"></a>

## ChatError ⇐ [<code>BaseError</code>](class#BaseError)
Base error for the chat module

**Kind**: global class  
**Extends**: [<code>BaseError</code>](class#BaseError)  

* [ChatError](#ChatError) ⇐ [<code>BaseError</code>](class#BaseError)
    * [new ChatError(message, ...other)](#new_ChatError_new)
    * [.message](#BaseError+message)
    * [.timestamp](#BaseError+timestamp)


* * *

<a name="new_ChatError_new"></a>

### new ChatError(message, ...other)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td>
    </tr><tr>
    <td>...other</td><td><code>any</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="BaseError+message"></a>

### chatError.message
**Kind**: instance property of [<code>ChatError</code>](class#ChatError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="BaseError+timestamp"></a>

### chatError.timestamp
**Kind**: instance property of [<code>ChatError</code>](class#ChatError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>timestamp</td><td><code>Date</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="AuthenticationError"></a>

## AuthenticationError ⇐ [<code>ChatError</code>](class#ChatError)
**Kind**: global class  
**Extends**: [<code>ChatError</code>](class#ChatError)  

* [AuthenticationError](#AuthenticationError) ⇐ [<code>ChatError</code>](class#ChatError)
    * [new AuthenticationError(error, ...other)](#new_AuthenticationError_new)
    * [.message](#BaseError+message)
    * [.timestamp](#BaseError+timestamp)


* * *

<a name="new_AuthenticationError_new"></a>

### new AuthenticationError(error, ...other)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>error</td><td><code>string</code></td>
    </tr><tr>
    <td>...other</td><td><code>any</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="BaseError+message"></a>

### authenticationError.message
**Kind**: instance property of [<code>AuthenticationError</code>](class#AuthenticationError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="BaseError+timestamp"></a>

### authenticationError.timestamp
**Kind**: instance property of [<code>AuthenticationError</code>](class#AuthenticationError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>timestamp</td><td><code>Date</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="ParseError"></a>

## ParseError ⇐ [<code>ChatError</code>](class#ChatError)
**Kind**: global class  
**Extends**: [<code>ChatError</code>](class#ChatError)  

* [ParseError](#ParseError) ⇐ [<code>ChatError</code>](class#ChatError)
    * [new ParseError(error, rawMessage, ...other)](#new_ParseError_new)
    * [._raw](#ParseError+_raw)
    * [.command](#ParseError+command)
    * [.message](#ParseError+message)
    * [.stack](#ParseError+stack)
    * [.timestamp](#BaseError+timestamp)


* * *

<a name="new_ParseError_new"></a>

### new ParseError(error, rawMessage, ...other)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>error</td><td><code>string</code></td>
    </tr><tr>
    <td>rawMessage</td><td><code>string</code></td>
    </tr><tr>
    <td>...other</td><td><code>any</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="ParseError+_raw"></a>

### parseError.\_raw
**Kind**: instance property of [<code>ParseError</code>](class#ParseError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>_raw</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="ParseError+command"></a>

### parseError.command
**Kind**: instance property of [<code>ParseError</code>](class#ParseError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>command</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="ParseError+message"></a>

### parseError.message
**Kind**: instance property of [<code>ParseError</code>](class#ParseError)  
**Overrides**: [<code>message</code>](#BaseError+message)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="ParseError+stack"></a>

### parseError.stack
**Kind**: instance property of [<code>ParseError</code>](class#ParseError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>stack</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="BaseError+timestamp"></a>

### parseError.timestamp
**Kind**: instance property of [<code>ParseError</code>](class#ParseError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>timestamp</td><td><code>Date</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="JoinError"></a>

## JoinError ⇐ [<code>ChatError</code>](class#ChatError)
**Kind**: global class  
**Extends**: [<code>ChatError</code>](class#ChatError)  

* [JoinError](#JoinError) ⇐ [<code>ChatError</code>](class#ChatError)
    * [new JoinError(message, ...other)](#new_JoinError_new)
    * [.message](#BaseError+message)
    * [.timestamp](#BaseError+timestamp)


* * *

<a name="new_JoinError_new"></a>

### new JoinError(message, ...other)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td>
    </tr><tr>
    <td>...other</td><td><code>any</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="BaseError+message"></a>

### joinError.message
**Kind**: instance property of [<code>JoinError</code>](class#JoinError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="BaseError+timestamp"></a>

### joinError.timestamp
**Kind**: instance property of [<code>JoinError</code>](class#JoinError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>timestamp</td><td><code>Date</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="TimeoutError"></a>

## TimeoutError ⇐ [<code>ChatError</code>](class#ChatError)
**Kind**: global class  
**Extends**: [<code>ChatError</code>](class#ChatError)  

* [TimeoutError](#TimeoutError) ⇐ [<code>ChatError</code>](class#ChatError)
    * [new TimeoutError(message, ...other)](#new_TimeoutError_new)
    * [.message](#BaseError+message)
    * [.timestamp](#BaseError+timestamp)


* * *

<a name="new_TimeoutError_new"></a>

### new TimeoutError(message, ...other)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td>
    </tr><tr>
    <td>...other</td><td><code>any</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="BaseError+message"></a>

### timeoutError.message
**Kind**: instance property of [<code>TimeoutError</code>](class#TimeoutError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="BaseError+timestamp"></a>

### timeoutError.timestamp
**Kind**: instance property of [<code>TimeoutError</code>](class#TimeoutError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>timestamp</td><td><code>Date</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat"></a>

## Chat ⇐ <code>EventEmitter</code>
Twitch Chat Client

**Kind**: global class  
**Extends**: <code>EventEmitter</code>  
**Emits**: <code>Chat#event:\*</code>, [<code>CLEARCHAT</code>](#Chat+event_CLEARCHAT), [<code>CLEARCHAT/USER\_BANNED</code>](#Chat+event_CLEARCHAT/USER_BANNED), [<code>GLOBALUSERSTATE</code>](#Chat+event_GLOBALUSERSTATE), [<code>HOSTTARGET</code>](#Chat+event_HOSTTARGET), [<code>JOIN</code>](#Chat+event_JOIN), [<code>MODE</code>](#Chat+event_MODE), [<code>NAMES</code>](#Chat+event_NAMES), [<code>NAMES\_END</code>](#Chat+event_NAMES_END), [<code>NOTICE</code>](#Chat+event_NOTICE), [<code>NOTICE/ROOM\_MODS</code>](#Chat+event_NOTICE/ROOM_MODS), [<code>PART</code>](#Chat+event_PART), [<code>PRIVMSG</code>](#Chat+event_PRIVMSG), [<code>PRIVMSG/CHEER</code>](#Chat+event_PRIVMSG/CHEER), [<code>ROOMSTATE</code>](#Chat+event_ROOMSTATE), <code>Chat#event:USERNOTICE</code>, [<code>USERNOTICE/ANON\_GIFT\_PAID\_UPGRADE</code>](#Chat+event_USERNOTICE/ANON_GIFT_PAID_UPGRADE), [<code>USERNOTICE/GIFT\_PAID\_UPGRADE</code>](#Chat+event_USERNOTICE/GIFT_PAID_UPGRADE), [<code>USERNOTICE/RAID</code>](#Chat+event_USERNOTICE/RAID), [<code>USERNOTICE/RESUBSCRIPTION</code>](#Chat+event_USERNOTICE/RESUBSCRIPTION), [<code>USERNOTICE/RITUAL</code>](#Chat+event_USERNOTICE/RITUAL), [<code>USERNOTICE/SUBSCRIPTION</code>](#Chat+event_USERNOTICE/SUBSCRIPTION), [<code>USERNOTICE/SUBSCRIPTION\_GIFT</code>](#Chat+event_USERNOTICE/SUBSCRIPTION_GIFT), [<code>USERSTATE</code>](#Chat+event_USERSTATE)  
**Access**: public  

* [Chat](#Chat) ⇐ <code>EventEmitter</code>
    * [new Chat(options)](#new_Chat_new)
    * [.log](#Chat+log) : <code>any</code>
    * [.getOptions()](#Chat+getOptions) ⇒ [<code>ChatOptions</code>](typedef#ChatOptions)
    * [.setOptions(options)](#Chat+setOptions)
    * [.getReadyState()](#Chat+getReadyState) ⇒ <code>number</code>
    * [.getUserState()](#Chat+getUserState) ⇒ [<code>GlobalUserState</code>](typedef#GlobalUserState)
    * [.updateOptions(options)](#Chat+updateOptions)
    * [.getChannels()](#Chat+getChannels) ⇒ <code>Array.&lt;string&gt;</code>
    * [.getChannelState(channel)](#Chat+getChannelState) ⇒ [<code>ChannelState</code>](typedef#ChannelState)
    * [.setChannelState(channel, state)](#Chat+setChannelState)
    * [.removeChannelState(channel)](#Chat+removeChannelState) ⇒ [<code>ChannelState</code>](typedef#ChannelState)
    * [.clearChannelState()](#Chat+clearChannelState)
    * [.connect()](#Chat+connect) ⇒ <code>Promise.&lt;?GlobalUserState, string&gt;</code>
    * [.send(message)](#Chat+send) ⇒ <code>Promise</code>
    * [.disconnect()](#Chat+disconnect)
    * [.reconnect(newOptions)](#Chat+reconnect) ⇒ <code>Promise.&lt;Array.&lt;ChannelState&gt;, string&gt;</code>
    * [.join(channel)](#Chat+join) ⇒ <code>Promise.&lt;ChannelState, string&gt;</code>
    * [.part(channel)](#Chat+part)
    * [.say(channel, message)](#Chat+say) ⇒ <code>Promise.&lt;?UserStateMessage, string&gt;</code>
    * [.whisper(user, message)](#Chat+whisper) ⇒ <code>Promise.&lt;undefined&gt;</code>
    * [.broadcast(message)](#Chat+broadcast) ⇒ <code>Promise.&lt;Array.&lt;UserStateMessage&gt;&gt;</code>
    * [.emit(eventName, message)](#Chat+emit)
    * [.isUserAuthenticated()](#Chat+isUserAuthenticated) ⇒ <code>Promise</code>
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
    * ["PRIVMSG/CHEER"](#Chat+event_PRIVMSG/CHEER)
    * ["PRIVMSG/HOSTED"](#Chat+event_PRIVMSG/HOSTED)
    * ["USERNOTICE/ANON_GIFT_PAID_UPGRADE"](#Chat+event_USERNOTICE/ANON_GIFT_PAID_UPGRADE)
    * ["USERNOTICE/GIFT_PAID_UPGRADE"](#Chat+event_USERNOTICE/GIFT_PAID_UPGRADE)
    * ["USERNOTICE/RAID"](#Chat+event_USERNOTICE/RAID)
    * ["USERNOTICE/RESUBSCRIPTION"](#Chat+event_USERNOTICE/RESUBSCRIPTION)
    * ["USERNOTICE/RITUAL"](#Chat+event_USERNOTICE/RITUAL)
    * ["USERNOTICE/SUBSCRIPTION_GIFT_COMMUNITY"](#Chat+event_USERNOTICE/SUBSCRIPTION_GIFT_COMMUNITY)
    * ["USERNOTICE/SUBSCRIPTION_GIFT"](#Chat+event_USERNOTICE/SUBSCRIPTION_GIFT)
    * ["USERNOTICE/SUBSCRIPTION"](#Chat+event_USERNOTICE/SUBSCRIPTION)


* * *

<a name="new_Chat_new"></a>

### new Chat(options)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code><a href="typedef#ChatOptions">ChatOptions</a></code></td>
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

<a name="Chat+log"></a>

### chat.log : <code>any</code>
**Kind**: instance property of [<code>Chat</code>](class#Chat)  
**Access**: public  

* * *

<a name="Chat+getOptions"></a>

### chat.getOptions() ⇒ [<code>ChatOptions</code>](typedef#ChatOptions)
Retrieves the current [ChatOptions](Chat#ChatOptions)

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Returns**: [<code>ChatOptions</code>](typedef#ChatOptions) - Options of the client  
**Access**: public  

* * *

<a name="Chat+setOptions"></a>

### chat.setOptions(options)
Validates the passed options before changing `_options`

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code><a href="typedef#ChatOptions">ChatOptions</a></code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+getReadyState"></a>

### chat.getReadyState() ⇒ <code>number</code>
Retrieves the current `_readyState` of the client.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Returns**: <code>number</code> - Ready state  
**Access**: public  

* * *

<a name="Chat+getUserState"></a>

### chat.getUserState() ⇒ [<code>GlobalUserState</code>](typedef#GlobalUserState)
Retrieves the current `_userState`  of the client.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Returns**: [<code>GlobalUserState</code>](typedef#GlobalUserState) - User state tags  
**Access**: public  

* * *

<a name="Chat+updateOptions"></a>

### chat.updateOptions(options)
Updates the clients options after first instantiation.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code><a href="typedef#ApiOptions">ApiOptions</a></code></td><td><p>New client options. To update <code>token</code> or <code>username</code>, use <a href="#Chat+reconnect"><strong>api.reconnect()</strong></a>.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+getChannels"></a>

### chat.getChannels() ⇒ <code>Array.&lt;string&gt;</code>
Retrieves all channels the client is connected to.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Returns**: <code>Array.&lt;string&gt;</code> - Array of channel names  
**Access**: public  

* * *

<a name="Chat+getChannelState"></a>

### chat.getChannelState(channel) ⇒ [<code>ChannelState</code>](typedef#ChannelState)
Retrieves and return the internal `_channelState` object.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Returns**: [<code>ChannelState</code>](typedef#ChannelState) - Internal `_channelState` object.  
**Access**: public  
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

<a name="Chat+setChannelState"></a>

### chat.setChannelState(channel, state)
Sets the state of a specific channel in the client.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  
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
    <td>state</td><td><code>object</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+removeChannelState"></a>

### chat.removeChannelState(channel) ⇒ [<code>ChannelState</code>](typedef#ChannelState)
Removes the state of a specific channel from the client.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Returns**: [<code>ChannelState</code>](typedef#ChannelState) - Clients `_channelState` with the requested channel state removed.  
**Access**: public  
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

<a name="Chat+clearChannelState"></a>

### chat.clearChannelState()
Clears the client `_channelState`.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  

* * *

<a name="Chat+connect"></a>

### chat.connect() ⇒ <code>Promise.&lt;?GlobalUserState, string&gt;</code>
Connect to Twitch.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  

* * *

<a name="Chat+send"></a>

### chat.send(message) ⇒ <code>Promise</code>
Sends a raw message to Twitch.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Returns**: <code>Promise</code> - Resolves on success, rejects on failure.  
**Access**: public  
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
Disconnected from Twitch.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  

* * *

<a name="Chat+reconnect"></a>

### chat.reconnect(newOptions) ⇒ <code>Promise.&lt;Array.&lt;ChannelState&gt;, string&gt;</code>
Reconnect to Twitch.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>newOptions</td><td><code>object</code></td><td><p>Provide new options to client.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+join"></a>

### chat.join(channel) ⇒ <code>Promise.&lt;ChannelState, string&gt;</code>
Join a channel.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  
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

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  
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

### chat.say(channel, message) ⇒ <code>Promise.&lt;?UserStateMessage, string&gt;</code>
Send a message to a channel.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  
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

<a name="Chat+whisper"></a>

### chat.whisper(user, message) ⇒ <code>Promise.&lt;undefined&gt;</code>
Whisper to another user.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>user</td><td><code>string</code></td>
    </tr><tr>
    <td>message</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+broadcast"></a>

### chat.broadcast(message) ⇒ <code>Promise.&lt;Array.&lt;UserStateMessage&gt;&gt;</code>
Broadcast message to all connected channels.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  
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

<a name="Chat+emit"></a>

### chat.emit(eventName, message)
**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>eventName</td><td><code>string</code></td>
    </tr><tr>
    <td>message</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+isUserAuthenticated"></a>

### chat.isUserAuthenticated() ⇒ <code>Promise</code>
Ensure the user is authenticated.

**Kind**: instance method of [<code>Chat</code>](class#Chat)  
**Access**: public  

* * *

<a name="Chat+event_JOIN"></a>

### "JOIN"
Join a channel.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>BaseMessage</code>](mixin#BaseMessage)  
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

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>BaseMessage</code>](mixin#BaseMessage)  
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

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>BaseMessage</code>](mixin#BaseMessage)  
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

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>BaseMessage</code>](mixin#BaseMessage)  
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

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>BaseMessage</code>](mixin#BaseMessage)  
**See**: https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership  

* * *

<a name="Chat+event_GLOBALUSERSTATE"></a>

### "GLOBALUSERSTATE"
On successful login.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>GlobalUserStateMessage</code>](mixin#GlobalUserStateMessage)  

* * *

<a name="Chat+event_CLEARCHAT/USER_BANNED"></a>

### "CLEARCHAT/USER_BANNED"
Temporary or permanent ban on a channel.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>BaseMessage</code>](mixin#BaseMessage)  
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
    <td>tags</td><td><code><a href="typedef#ClearChatTags">ClearChatTags</a></code></td>
    </tr><tr>
    <td>username</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_CLEARCHAT"></a>

### "CLEARCHAT"
All chat is cleared (deleted).

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>BaseMessage</code>](mixin#BaseMessage)  
**See**

- https://dev.twitch.tv/docs/irc/commands/#clearchat-twitch-commands
- https://dev.twitch.tv/docs/irc/tags/#clearchat-twitch-tags


* * *

<a name="Chat+event_HOSTTARGET"></a>

### "HOSTTARGET"
Host starts or stops a message.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>BaseMessage</code>](mixin#BaseMessage)  
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

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>BaseMessage</code>](mixin#BaseMessage)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>tags</td><td><code><a href="typedef#RoomStateTags">RoomStateTags</a></code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_NOTICE/ROOM_MODS"></a>

### "NOTICE/ROOM_MODS"
NOTICE/ROOM_MODS message

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>NoticeMessage</code>](mixin#NoticeMessage)  
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
**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>NoticeMessage</code>](mixin#NoticeMessage)  
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

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>UserStateMessage</code>](mixin#UserStateMessage)  

* * *

<a name="Chat+event_PRIVMSG"></a>

### "PRIVMSG"
When a user joins a channel or sends a PRIVMSG to a channel.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>UserStateMessage</code>](mixin#UserStateMessage)  

* * *

<a name="Chat+event_PRIVMSG/CHEER"></a>

### "PRIVMSG/CHEER"
When a user cheers a channel.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>UserStateMessage</code>](mixin#UserStateMessage)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>&#x27;CHEER&#x27;</code></td>
    </tr><tr>
    <td>bits</td><td><code>number</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_PRIVMSG/HOSTED"></a>

### "PRIVMSG/HOSTED"
When a user hosts your channel while connected as broadcaster.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>UserStateMessage</code>](mixin#UserStateMessage)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>&#x27;HOSTED/WITH_VIEWERS&#x27;</code> | <code>&#x27;HOSTED/WITHOUT_VIEWERS&#x27;</code> | <code>&#x27;HOSTED/AUTO&#x27;</code></td>
    </tr><tr>
    <td>tags</td><td><code>Object</code></td>
    </tr><tr>
    <td>tags.displayName</td><td><code>string</code></td>
    </tr><tr>
    <td>[numberOfViewers]</td><td><code>number</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/ANON_GIFT_PAID_UPGRADE"></a>

### "USERNOTICE/ANON_GIFT_PAID_UPGRADE"
On anonymous gifted subscription paid upgrade to a channel.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>UserStateMessage</code>](mixin#UserStateMessage)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>&#x27;ANON_GIFT_PAID_UPGRADE&#x27;</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/GIFT_PAID_UPGRADE"></a>

### "USERNOTICE/GIFT_PAID_UPGRADE"
On gifted subscription paid upgrade to a channel.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>UserStateMessage</code>](mixin#UserStateMessage)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>&#x27;GIFT_PAID_UPGRADE&#x27;</code></td>
    </tr><tr>
    <td>parameters</td><td><code>Object</code></td>
    </tr><tr>
    <td>parameters.promoGiftTotal</td><td><code>number</code></td>
    </tr><tr>
    <td>parameters.promoName</td><td><code>string</code></td>
    </tr><tr>
    <td>parameters.senderLogin</td><td><code>string</code></td>
    </tr><tr>
    <td>parameters.senderName</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/RAID"></a>

### "USERNOTICE/RAID"
On channel raid.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>UserStateMessage</code>](mixin#UserStateMessage)  
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
    <td>parameters</td><td><code>Object</code></td>
    </tr><tr>
    <td>parameters.displayName</td><td><code>string</code></td>
    </tr><tr>
    <td>parameters.login</td><td><code>string</code></td>
    </tr><tr>
    <td>parameters.viewerCount</td><td><code>number</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/RESUBSCRIPTION"></a>

### "USERNOTICE/RESUBSCRIPTION"
On resubscription (subsequent months) to a channel.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>UserStateMessage</code>](mixin#UserStateMessage)  
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
    </tr><tr>
    <td>parameters</td><td><code>Object</code></td>
    </tr><tr>
    <td>parameters.months</td><td><code>number</code></td>
    </tr><tr>
    <td>parameters.subPlan</td><td><code>string</code></td>
    </tr><tr>
    <td>parameters.subPlanName</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/RITUAL"></a>

### "USERNOTICE/RITUAL"
On channel ritual.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>UserStateMessage</code>](mixin#UserStateMessage)  
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
    <td>parameters</td><td><code>Object</code></td>
    </tr><tr>
    <td>parameters.ritualName</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/SUBSCRIPTION_GIFT_COMMUNITY"></a>

### "USERNOTICE/SUBSCRIPTION_GIFT_COMMUNITY"
On subscription gift to a channel community.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>UserStateMessage</code>](mixin#UserStateMessage)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>event</td><td><code>&#x27;SUBSCRIPTION_GIFT_COMMUNITY&#x27;</code></td>
    </tr><tr>
    <td>parameters</td><td><code>Object</code></td>
    </tr><tr>
    <td>parameters.massGiftCount</td><td><code>number</code></td>
    </tr><tr>
    <td>parameters.senderCount</td><td><code>number</code></td>
    </tr><tr>
    <td>parameters.subPlan</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/SUBSCRIPTION_GIFT"></a>

### "USERNOTICE/SUBSCRIPTION_GIFT"
On subscription gift to a channel.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>UserStateMessage</code>](mixin#UserStateMessage)  
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
    <td>parameters</td><td><code>Object</code></td>
    </tr><tr>
    <td>parameters.months</td><td><code>number</code></td>
    </tr><tr>
    <td>parameters.subPlan</td><td><code>string</code></td>
    </tr><tr>
    <td>parameters.subPlanName</td><td><code>string</code></td>
    </tr><tr>
    <td>parameters.recipientDisplayName</td><td><code>string</code></td>
    </tr><tr>
    <td>parameters.recipientId</td><td><code>string</code></td>
    </tr><tr>
    <td>parameters.recipientName</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="Chat+event_USERNOTICE/SUBSCRIPTION"></a>

### "USERNOTICE/SUBSCRIPTION"
On subscription (first month) to a channel.

**Kind**: event emitted by [<code>Chat</code>](class#Chat)  
**Mixes**: [<code>UserStateMessage</code>](mixin#UserStateMessage)  
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
    <td>parameters</td><td><code>Object</code></td>
    </tr><tr>
    <td>parameters.months</td><td><code>1</code></td>
    </tr><tr>
    <td>parameters.subPlan</td><td><code>string</code></td>
    </tr><tr>
    <td>parameters.subPlanName</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="TwitchJs"></a>

## TwitchJs
TwitchJs client

**Kind**: global class  
**Access**: public  

* [TwitchJs](#TwitchJs)
    * [new TwitchJs(options)](#new_TwitchJs_new)
    * [.chat](#TwitchJs+chat)
    * [.chatConstants](#TwitchJs+chatConstants)
    * [.api](#TwitchJs+api)
    * [.updateOptions(options)](#TwitchJs+updateOptions)


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
    <td>options.clientId</td><td><code>string</code></td>
    </tr><tr>
    <td>options.log</td><td><code>Object</code></td>
    </tr><tr>
    <td>[options.onAuthenticationFailure]</td><td><code>function</code></td>
    </tr><tr>
    <td>[options.chat]</td><td><code><a href="typedef#ChatOptions">ChatOptions</a></code></td>
    </tr><tr>
    <td>[options.api]</td><td><code><a href="typedef#ApiOptions">ApiOptions</a></code></td>
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

### twitchJs.chat
**Kind**: instance property of [<code>TwitchJs</code>](class#TwitchJs)  
**Access**: public  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>chat</td><td><code><a href="class#Chat">Chat</a></code></td>
    </tr>  </tbody>
</table>


* * *

<a name="TwitchJs+chatConstants"></a>

### twitchJs.chatConstants
**Kind**: instance property of [<code>TwitchJs</code>](class#TwitchJs)  
**Access**: public  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>chatConstants</td><td><code>Object</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="TwitchJs+api"></a>

### twitchJs.api
**Kind**: instance property of [<code>TwitchJs</code>](class#TwitchJs)  
**Access**: public  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>api</td><td><code><a href="class#Api">Api</a></code></td>
    </tr>  </tbody>
</table>


* * *

<a name="TwitchJs+updateOptions"></a>

### twitchJs.updateOptions(options)
Update client options.

**Kind**: instance method of [<code>TwitchJs</code>](class#TwitchJs)  
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>options</td><td><code>Object</code></td><td></td>
    </tr><tr>
    <td>[options.chat]</td><td><code><a href="typedef#ChatOptions">ChatOptions</a></code></td><td><p>New chat client options.</p>
</td>
    </tr><tr>
    <td>[options.api]</td><td><code><a href="typedef#ApiOptions">ApiOptions</a></code></td><td><p>New API client options.</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="BaseError"></a>

## BaseError ⇐ <code>Error</code>
**Kind**: global class  
**Extends**: <code>Error</code>  

* [BaseError](#BaseError) ⇐ <code>Error</code>
    * [new BaseError(message, ...params)](#new_BaseError_new)
    * [.message](#BaseError+message)
    * [.timestamp](#BaseError+timestamp)


* * *

<a name="new_BaseError_new"></a>

### new BaseError(message, ...params)
<table>
  <thead>
    <tr>
      <th>Param</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td>
    </tr><tr>
    <td>...params</td><td><code>any</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="BaseError+message"></a>

### baseError.message
**Kind**: instance property of [<code>BaseError</code>](class#BaseError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>message</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="BaseError+timestamp"></a>

### baseError.timestamp
**Kind**: instance property of [<code>BaseError</code>](class#BaseError)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>timestamp</td><td><code>Date</code></td>
    </tr>  </tbody>
</table>


* * *

