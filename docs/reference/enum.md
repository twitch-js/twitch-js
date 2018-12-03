---
id: enum
title: Enums
sidebar_label: Enums
---

## Overview

<dl>
<dt><a href="#READY_STATES">READY_STATES</a> : <code>enum</code></dt>
  <dd><p>API client ready state</p>
</dd>
  <dt><a href="#READY_STATES">READY_STATES</a> : <code>enum</code></dt>
  <dd><p>Chat client ready state</p>
</dd>
  <dt><a href="#MEMBERSHIP_COMMANDS">MEMBERSHIP_COMMANDS</a> : <code>enum</code></dt>
  <dd></dd>
  <dt><a href="#TAG_COMMANDS">TAG_COMMANDS</a> : <code>enum</code></dt>
  <dd></dd>
  <dt><a href="#OTHER_COMMANDS">OTHER_COMMANDS</a> : <code>enum</code></dt>
  <dd></dd>
  <dt><a href="#COMMANDS">COMMANDS</a> : <code>enum</code></dt>
  <dd></dd>
  <dt><a href="#NOTICE_MESSAGE_IDS">NOTICE_MESSAGE_IDS</a> : <code>enum</code></dt>
  <dd></dd>
  <dt><a href="#USER_NOTICE_MESSAGE_IDS">USER_NOTICE_MESSAGE_IDS</a> : <code>enum</code></dt>
  <dd></dd>
  <dt><a href="#MESSAGE_IDS">MESSAGE_IDS</a> : <code>enum</code></dt>
  <dd></dd>
  <dt><a href="#EVENTS">EVENTS</a> : <code>enum</code></dt>
  <dd></dd>
  <dt><a href="#CHAT_COMMANDS">CHAT_COMMANDS</a> : <code>enum</code></dt>
  <dd></dd>
  </dl>

<a name="READY_STATES"></a>

## READY\_STATES : <code>enum</code>
API client ready state

**Kind**: global enum  
**Read only**: true  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>0</td><td><code>string</code></td><td><p>not ready</p>
</td>
    </tr><tr>
    <td>1</td><td><code>string</code></td><td><p>ready</p>
</td>
    </tr><tr>
    <td>2</td><td><code>string</code></td><td><p>initialized</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="READY_STATES"></a>

## READY\_STATES : <code>enum</code>
Chat client ready state

**Kind**: global enum  
**Read only**: true  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>0</td><td><code>string</code></td><td><p>Not Ready</p>
</td>
    </tr><tr>
    <td>1</td><td><code>string</code></td><td><p>Connecting</p>
</td>
    </tr><tr>
    <td>2</td><td><code>string</code></td><td><p>Reconnecting</p>
</td>
    </tr><tr>
    <td>3</td><td><code>string</code></td><td><p>Connecting</p>
</td>
    </tr><tr>
    <td>4</td><td><code>string</code></td><td><p>Disconnecting</p>
</td>
    </tr><tr>
    <td>5</td><td><code>string</code></td><td><p>Disconnected</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="MEMBERSHIP_COMMANDS"></a>

## MEMBERSHIP\_COMMANDS : <code>enum</code>
**Kind**: global enum  
**Read only**: true  
**See**: [https://dev.twitch.tv/docs/irc/membership/](https://dev.twitch.tv/docs/irc/membership/)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>JOIN</td><td><code>string</code></td>
    </tr><tr>
    <td>MODE</td><td><code>string</code></td>
    </tr><tr>
    <td>PART</td><td><code>string</code></td>
    </tr><tr>
    <td>NAMES</td><td><code>string</code></td>
    </tr><tr>
    <td>NAMES_END</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="TAG_COMMANDS"></a>

## TAG\_COMMANDS : <code>enum</code>
**Kind**: global enum  
**Read only**: true  
**See**: [https://dev.twitch.tv/docs/irc/tags/](https://dev.twitch.tv/docs/irc/tags/)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>CLEAR_CHAT</td><td><code>string</code></td>
    </tr><tr>
    <td>GLOBAL_USER_STATE</td><td><code>string</code></td>
    </tr><tr>
    <td>PRIVATE_MESSAGE</td><td><code>string</code></td>
    </tr><tr>
    <td>ROOM_STATE</td><td><code>string</code></td>
    </tr><tr>
    <td>USER_NOTICE</td><td><code>string</code></td>
    </tr><tr>
    <td>USER_STATE</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="OTHER_COMMANDS"></a>

## OTHER\_COMMANDS : <code>enum</code>
**Kind**: global enum  
**Read only**: true  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>WELCOME</td><td><code>string</code></td>
    </tr><tr>
    <td>PING</td><td><code>string</code></td>
    </tr><tr>
    <td>PONG</td><td><code>string</code></td>
    </tr><tr>
    <td>WHISPER</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="COMMANDS"></a>

## COMMANDS : <code>enum</code>
**Kind**: global enum  
**Read only**: true  
**See**: [https://dev.twitch.tv/docs/irc/commands/](https://dev.twitch.tv/docs/irc/commands/)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>OTHER_COMMANDS</td><td><code>string</code></td>
    </tr><tr>
    <td>MEMBERSHIP_COMMANDS</td><td><code>string</code></td>
    </tr><tr>
    <td>TAG_COMMANDS</td><td><code>string</code></td>
    </tr><tr>
    <td>CLEAR_CHAT</td><td><code>string</code></td>
    </tr><tr>
    <td>HOST_TARGET</td><td><code>string</code></td>
    </tr><tr>
    <td>NOTICE</td><td><code>string</code></td>
    </tr><tr>
    <td>RECONNECT</td><td><code>string</code></td>
    </tr><tr>
    <td>ROOM_STATE</td><td><code>string</code></td>
    </tr><tr>
    <td>USER_NOTICE</td><td><code>string</code></td>
    </tr><tr>
    <td>USER_STATE</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="NOTICE_MESSAGE_IDS"></a>

## NOTICE\_MESSAGE\_IDS : <code>enum</code>
**Kind**: global enum  
**Read only**: true  
**See**: [https://dev.twitch.tv/docs/irc/commands/#msg-id-tags-for-the-notice-commands-capability](https://dev.twitch.tv/docs/irc/commands/#msg-id-tags-for-the-notice-commands-capability)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>ALREADY_BANNED</td><td><code>string</code></td>
    </tr><tr>
    <td>ALREADY_EMOTE_ONLY_OFF</td><td><code>string</code></td>
    </tr><tr>
    <td>ALREADY_EMOTES_ONLY_ON</td><td><code>string</code></td>
    </tr><tr>
    <td>ALREADY_R9K_OFF</td><td><code>string</code></td>
    </tr><tr>
    <td>ALREADY_R9K_ON</td><td><code>string</code></td>
    </tr><tr>
    <td>ALREADY_SUBS_OFF</td><td><code>string</code></td>
    </tr><tr>
    <td>ALREADY_SUBS_ON</td><td><code>string</code></td>
    </tr><tr>
    <td>BAD_HOST_HOSTING</td><td><code>string</code></td>
    </tr><tr>
    <td>BAN_SUCCESS</td><td><code>string</code></td>
    </tr><tr>
    <td>BAD_UNBAN_NO_BAN</td><td><code>string</code></td>
    </tr><tr>
    <td>EMOTE_ONLY_OFF</td><td><code>string</code></td>
    </tr><tr>
    <td>EMOTE_ONLY_ON</td><td><code>string</code></td>
    </tr><tr>
    <td>HOST_OFF</td><td><code>string</code></td>
    </tr><tr>
    <td>HOST_ON</td><td><code>string</code></td>
    </tr><tr>
    <td>HOSTS_REMAINING</td><td><code>string</code></td>
    </tr><tr>
    <td>MSG_CHANNEL_SUSPENDED</td><td><code>string</code></td>
    </tr><tr>
    <td>R9K_OFF</td><td><code>string</code></td>
    </tr><tr>
    <td>R9K_ON</td><td><code>string</code></td>
    </tr><tr>
    <td>ROOM_MODS</td><td><code>string</code></td>
    </tr><tr>
    <td>SLOW_OFF</td><td><code>string</code></td>
    </tr><tr>
    <td>SLOW_ON</td><td><code>string</code></td>
    </tr><tr>
    <td>SUBS_OFF</td><td><code>string</code></td>
    </tr><tr>
    <td>SUBS_ON</td><td><code>string</code></td>
    </tr><tr>
    <td>TIMEOUT_SUCCESS</td><td><code>string</code></td>
    </tr><tr>
    <td>UNBAN_SUCCESS</td><td><code>string</code></td>
    </tr><tr>
    <td>UNRECOGNIZED_COMMAND</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="USER_NOTICE_MESSAGE_IDS"></a>

## USER\_NOTICE\_MESSAGE\_IDS : <code>enum</code>
**Kind**: global enum  
**Read only**: true  
**See**: [https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags](https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>ANON_GIFT_PAID_UPGRADE</td><td><code>string</code></td>
    </tr><tr>
    <td>GIFT_PAID_UPGRADE</td><td><code>string</code></td>
    </tr><tr>
    <td>RAID</td><td><code>string</code></td>
    </tr><tr>
    <td>RESUBSCRIPTION</td><td><code>string</code></td>
    </tr><tr>
    <td>RITUAL</td><td><code>string</code></td>
    </tr><tr>
    <td>SUBSCRIPTION</td><td><code>string</code></td>
    </tr><tr>
    <td>SUBSCRIPTION_GIFT</td><td><code>string</code></td>
    </tr><tr>
    <td>SUBSCRIPTION_GIFT_COMMUNITY</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="MESSAGE_IDS"></a>

## MESSAGE\_IDS : <code>enum</code>
**Kind**: global enum  
**Read only**: true  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>NOTICE_MESSAGE_IDS</td><td><code>string</code></td>
    </tr><tr>
    <td>USER_NOTICE_MESSAGE_IDS</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="EVENTS"></a>

## EVENTS : <code>enum</code>
**Kind**: global enum  
**Read only**: true  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>RAW</td><td><code>string</code></td>
    </tr><tr>
    <td>ALL</td><td><code>string</code></td>
    </tr><tr>
    <td>CONNECTED</td><td><code>string</code></td>
    </tr><tr>
    <td>DISCONNECTED</td><td><code>string</code></td>
    </tr><tr>
    <td>AUTHENTICATION_FAILED</td><td><code>string</code></td>
    </tr><tr>
    <td>ERROR_ENCOUNTERED</td><td><code>string</code></td>
    </tr><tr>
    <td>PARSE_ERROR_ENCOUNTERED</td><td><code>string</code></td>
    </tr><tr>
    <td>ANON_GIFT_PAID_UPGRADE</td><td><code>string</code></td>
    </tr><tr>
    <td>GIFT_PAID_UPGRADE</td><td><code>string</code></td>
    </tr><tr>
    <td>RAID</td><td><code>string</code></td>
    </tr><tr>
    <td>RESUBSCRIPTION</td><td><code>string</code></td>
    </tr><tr>
    <td>RITUAL</td><td><code>string</code></td>
    </tr><tr>
    <td>SUBSCRIPTION</td><td><code>string</code></td>
    </tr><tr>
    <td>SUBSCRIPTION_GIFT</td><td><code>string</code></td>
    </tr><tr>
    <td>SUBSCRIPTION_GIFT_COMMUNITY</td><td><code>string</code></td>
    </tr><tr>
    <td>ROOM_MODS</td><td><code>string</code></td>
    </tr><tr>
    <td>MOD_GAINED</td><td><code>string</code></td>
    </tr><tr>
    <td>MOD_LOST</td><td><code>string</code></td>
    </tr><tr>
    <td>USER_BANNED</td><td><code>string</code></td>
    </tr><tr>
    <td>CHEER</td><td><code>string</code></td>
    </tr><tr>
    <td>HOSTED</td><td><code>string</code></td>
    </tr><tr>
    <td>HOSTED_WITHOUT_VIEWERS</td><td><code>string</code></td>
    </tr><tr>
    <td>HOSTED_WITH_VIEWERS</td><td><code>string</code></td>
    </tr><tr>
    <td>HOSTED_AUTO</td><td><code>string</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="CHAT_COMMANDS"></a>

## CHAT\_COMMANDS : <code>enum</code>
**Kind**: global enum  
**Read only**: true  
**See**: [https://help.twitch.tv/customer/en/portal/articles/659095-chat-moderation-commands](https://help.twitch.tv/customer/en/portal/articles/659095-chat-moderation-commands)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>ME</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>BAN</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>CLEAR</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>COLOR</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>COMMERCIAL</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>EMOTE_ONLY</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>EMOTE_ONLY_OFF</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>FOLLOWERS_ONLY</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>FOLLOWERS_ONLY_OFF</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>HOST</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>MOD</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>MODS</td><td><code>string</code></td><td><p>//@property {string} PART</p>
</td>
    </tr><tr>
    <td>R9K</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>R9K_OFF</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>SLOW</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>SLOW_OFF</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>SUBSCRIBERS</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>SUBSCRIBERS_OFF</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>TIMEOUT</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>UNBAN</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>UNHOST</td><td><code>string</code></td><td></td>
    </tr><tr>
    <td>UNMOD</td><td><code>string</code></td><td><p>//@property {string} WHISPER</p>
</td>
    </tr>  </tbody>
</table>


* * *

