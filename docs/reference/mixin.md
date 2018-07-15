---
id: mixin
title: Mixins
sidebar_label: Mixins
---

## Overview

<dl>
<dt><a href="#BaseMessage">BaseMessage</a></dt>
  <dd><p>Base message parsed from Twitch</p>
</dd>
  <dt><a href="#GlobalUserStateMessage">GlobalUserStateMessage</a></dt>
  <dd><p>GLOBALUSERSTATE message</p>
</dd>
  <dt><a href="#NoticeMessage">NoticeMessage</a></dt>
  <dd><p>NOTICE message</p>
</dd>
  <dt><a href="#UserStateMessage">UserStateMessage</a></dt>
  <dd><p>USERSTATE message</p>
</dd>
  </dl>

<a name="BaseMessage"></a>

## BaseMessage
Base message parsed from Twitch

**Kind**: global mixin  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>_raw</td><td><code>string</code></td><td><p>Un-parsed message</p>
</td>
    </tr><tr>
    <td>timestamp</td><td><code>Date</code></td><td><p>Timestamp</p>
</td>
    </tr><tr>
    <td>command</td><td><code>string</code></td><td><p>Command</p>
</td>
    </tr><tr>
    <td>tags</td><td><code>ClearChatTags</code> | <code>GlobalUserStateTags</code> | <code>PrivateMessageTags</code> | <code>RoomStateTags</code> | <code>UserNoticeTags</code> | <code>UserStateTags</code></td><td><p>Twitch tags</p>
</td>
    </tr><tr>
    <td>[channel]</td><td><code>string</code></td><td><p>Channel</p>
</td>
    </tr><tr>
    <td>[message]</td><td><code>string</code></td><td><p>Message</p>
</td>
    </tr><tr>
    <td>[event]</td><td><code>string</code></td><td><p>Associated event</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="GlobalUserStateMessage"></a>

## GlobalUserStateMessage
GLOBALUSERSTATE message

**Kind**: global mixin  
**Mixes**: [<code>BaseMessage</code>](#BaseMessage)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>tags</td><td><code>GlobalUserStateTags</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="NoticeMessage"></a>

## NoticeMessage
NOTICE message

**Kind**: global mixin  
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

<a name="UserStateMessage"></a>

## UserStateMessage
USERSTATE message

**Kind**: global mixin  
**Mixes**: [<code>BaseMessage</code>](#BaseMessage)  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>tags</td><td><code>UserStateTags</code></td>
    </tr>  </tbody>
</table>


* * *

