---
id: typedef
title: Type Definitions
sidebar_label: Type Definitions
---

## Overview

<dl>
<dt><a href="#ApiReadyState">ApiReadyState</a> : <code>string</code></dt>
  <dd></dd>
  <dt><a href="#ApiStatusState">ApiStatusState</a> : <code>Object</code></dt>
  <dd><p>API status state.</p>
</dd>
  <dt><a href="#ApiOptions">ApiOptions</a> : <code>Object</code></dt>
  <dd><p>API options</p>
</dd>
  <dt><a href="#ClientReadyState">ClientReadyState</a> : <code>string</code></dt>
  <dd></dd>
  <dt><a href="#ChannelState">ChannelState</a> : <code>Object</code></dt>
  <dd><p>Channel state information</p>
</dd>
  <dt><a href="#ClearChatTags">ClearChatTags</a> : <code>Object</code></dt>
  <dd><p>CLEARCHAT tags</p>
</dd>
  <dt><a href="#GlobalUserStateTags">GlobalUserStateTags</a> : <code>Object</code></dt>
  <dd><p>GLOBALUSERSTATE tags</p>
</dd>
  <dt><a href="#PrivateMessageTags">PrivateMessageTags</a> : <code><a href="typedef#UserStateTags">UserStateTags</a></code></dt>
  <dd><p>PRIVMSG tags</p>
</dd>
  <dt><a href="#RoomStateTags">RoomStateTags</a> : <code>Object</code></dt>
  <dd><p>ROOMSTATE Tag</p>
</dd>
  <dt><a href="#UserNoticeTags">UserNoticeTags</a> : <code><a href="typedef#UserStateTags">UserStateTags</a></code></dt>
  <dd><p>USERNOTICE tags</p>
</dd>
  <dt><a href="#UserStateTags">UserStateTags</a> : <code>Object</code></dt>
  <dd><p>USERSTATE tags</p>
</dd>
  <dt><a href="#BadgesTag">BadgesTag</a> : <code>Object</code></dt>
  <dd><p>Badges tag</p>
</dd>
  <dt><a href="#EmoteTag">EmoteTag</a> : <code>Object</code></dt>
  <dd><p>Emote tag</p>
</dd>
  <dt><a href="#ChatOptions">ChatOptions</a> : <code>Object</code></dt>
  <dd><p>Chat options</p>
</dd>
  <dt><a href="#FetchOptions">FetchOptions</a> : <code>Object</code></dt>
  <dd><p>Fetch options</p>
</dd>
  </dl>

<a name="ApiReadyState"></a>

## ApiReadyState : <code>string</code>
**Kind**: global typedef  

* * *

<a name="ApiStatusState"></a>

## ApiStatusState : <code>Object</code>
API status state.

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>token</td><td><code>Object</code></td>
    </tr><tr>
    <td>token.authorization</td><td><code>Object</code></td>
    </tr><tr>
    <td>token.authorization.scopes</td><td><code>Array.&lt;string&gt;</code></td>
    </tr><tr>
    <td>token.authorization.createdAt</td><td><code>string</code></td>
    </tr><tr>
    <td>token.authorization.updatedAt</td><td><code>string</code></td>
    </tr><tr>
    <td>token.clientId</td><td><code>string</code></td>
    </tr><tr>
    <td>token.userId</td><td><code>string</code></td>
    </tr><tr>
    <td>token.userName</td><td><code>string</code></td>
    </tr><tr>
    <td>token.valid</td><td><code>boolean</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="ApiOptions"></a>

## ApiOptions : <code>Object</code>
API options

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[clientId]</td><td><code>string</code></td><td></td><td><p>Optional if token is defined.</p>
</td>
    </tr><tr>
    <td>[token]</td><td><code>string</code></td><td></td><td><p>Optional if clientId is defined.</p>
</td>
    </tr><tr>
    <td>[urlRoot]</td><td><code>string</code></td><td></td><td></td>
    </tr><tr>
    <td>[debug]</td><td><code>boolean</code></td><td><code>false</code></td><td></td>
    </tr><tr>
    <td>[onAuthenticationFailure]</td><td><code>function</code></td><td></td><td></td>
    </tr>  </tbody>
</table>


* * *

<a name="ClientReadyState"></a>

## ClientReadyState : <code>string</code>
**Kind**: global typedef  

* * *

<a name="ChannelState"></a>

## ChannelState : <code>Object</code>
Channel state information

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>roomState</td><td><code><a href="typedef#RoomStateTags">RoomStateTags</a></code></td>
    </tr><tr>
    <td>userState</td><td><code><a href="typedef#UserStateTags">UserStateTags</a></code></td>
    </tr>  </tbody>
</table>


* * *

<a name="ClearChatTags"></a>

## ClearChatTags : <code>Object</code>
CLEARCHAT tags

**Kind**: global typedef  
**See**: https://dev.twitch.tv/docs/irc/tags#clearchat-twitch-tags  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[banReason]</td><td><code>string</code></td>
    </tr><tr>
    <td>[banDuration]</td><td><code>number</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="GlobalUserStateTags"></a>

## GlobalUserStateTags : <code>Object</code>
GLOBALUSERSTATE tags

**Kind**: global typedef  
**See**: https://dev.twitch.tv/docs/irc/tags#globaluserstate-twitch-tags  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>emoteSets</td><td><code>Array.&lt;string&gt;</code></td>
    </tr><tr>
    <td>userType</td><td><code>string</code></td>
    </tr><tr>
    <td>username</td><td><code>string</code></td>
    </tr><tr>
    <td>isTurboSubscriber</td><td><code>boolean</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="PrivateMessageTags"></a>

## PrivateMessageTags : [<code>UserStateTags</code>](typedef#UserStateTags)
PRIVMSG tags

**Kind**: global typedef  
**See**: https://dev.twitch.tv/docs/irc/tags#privmsg-twitch-tags  

* * *

<a name="RoomStateTags"></a>

## RoomStateTags : <code>Object</code>
ROOMSTATE Tag

**Kind**: global typedef  
**See**: https://dev.twitch.tv/docs/irc/tags#roomstate-twitch-tags  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>broadcasterLanguage</td><td><code>string</code></td>
    </tr><tr>
    <td>slowDelay</td><td><code>number</code></td>
    </tr><tr>
    <td>isFollowersOnly</td><td><code>boolean</code></td>
    </tr><tr>
    <td>isSubscribersOnly</td><td><code>boolean</code></td>
    </tr><tr>
    <td>isEmoteOnly</td><td><code>boolean</code></td>
    </tr><tr>
    <td>isR9kEnabled</td><td><code>boolean</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="UserNoticeTags"></a>

## UserNoticeTags : [<code>UserStateTags</code>](typedef#UserStateTags)
USERNOTICE tags

**Kind**: global typedef  
**See**: https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags  

* * *

<a name="UserStateTags"></a>

## UserStateTags : <code>Object</code>
USERSTATE tags

**Kind**: global typedef  
**See**: https://dev.twitch.tv/docs/irc/tags#userstate-twitch-tags  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>badges</td><td><code><a href="typedef#BadgesTag">BadgesTag</a></code></td>
    </tr><tr>
    <td>emotes</td><td><code><a href="typedef#EmoteTag">Array.&lt;EmoteTag&gt;</a></code></td>
    </tr><tr>
    <td>emoteSets</td><td><code>Array.&lt;string&gt;</code></td>
    </tr><tr>
    <td>isModerator</td><td><code>boolean</code></td>
    </tr><tr>
    <td>isSubscriber</td><td><code>boolean</code></td>
    </tr><tr>
    <td>isSubGifter</td><td><code>boolean</code></td>
    </tr><tr>
    <td>isTurboSubscriber</td><td><code>boolean</code></td>
    </tr><tr>
    <td>[bits]</td><td><code>number</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="BadgesTag"></a>

## BadgesTag : <code>Object</code>
Badges tag

**Kind**: global typedef  
**See**: https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[admin]</td><td><code>boolean</code></td>
    </tr><tr>
    <td>[bits]</td><td><code>number</code></td>
    </tr><tr>
    <td>[broadcaster]</td><td><code>boolean</code></td>
    </tr><tr>
    <td>[globalMod]</td><td><code>boolean</code></td>
    </tr><tr>
    <td>[moderator]</td><td><code>boolean</code></td>
    </tr><tr>
    <td>[subscriber]</td><td><code>boolean</code></td>
    </tr><tr>
    <td>[staff]</td><td><code>boolean</code></td>
    </tr><tr>
    <td>[turbo]</td><td><code>boolean</code></td>
    </tr>  </tbody>
</table>


* * *

<a name="EmoteTag"></a>

## EmoteTag : <code>Object</code>
Emote tag

**Kind**: global typedef  
**See**: https://dev.twitch.tv/docs/irc/tags/#privmsg-twitch-tags  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>id</td><td><code>string</code></td><td><p>ID</p>
</td>
    </tr><tr>
    <td>start</td><td><code>number</code></td><td><p>Starting index</p>
</td>
    </tr><tr>
    <td>end</td><td><code>number</code></td><td><p>Ending index</p>
</td>
    </tr>  </tbody>
</table>


* * *

<a name="ChatOptions"></a>

## ChatOptions : <code>Object</code>
Chat options

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[username]</td><td><code>string</code></td><td></td><td></td>
    </tr><tr>
    <td>[token]</td><td><code>string</code></td><td></td><td><p>OAuth token (use <a href="https://twitchapps.com/tmi/">https://twitchapps.com/tmi/</a> to generate one)</p>
</td>
    </tr><tr>
    <td>[connectionTimeout]</td><td><code>number</code></td><td><code>CONNECTION_TIMEOUT</code></td><td></td>
    </tr><tr>
    <td>[joinTimeout]</td><td><code>number</code></td><td><code>JOIN_TIMEOUT</code></td><td></td>
    </tr><tr>
    <td>[debug]</td><td><code>boolean</code></td><td><code>false</code></td><td></td>
    </tr><tr>
    <td>[onAuthenticationFailure]</td><td><code>function</code></td><td></td><td></td>
    </tr>  </tbody>
</table>


* * *

<a name="FetchOptions"></a>

## FetchOptions : <code>Object</code>
Fetch options

**Kind**: global typedef  
**Properties**

<table>
  <thead>
    <tr>
      <th>Name</th><th>Type</th><th>Default</th><th>Description</th>
    </tr>
  </thead>
  <tbody>
<tr>
    <td>[options.method]</td><td><code>string</code></td><td><code>&quot;get&quot;</code></td><td><p>The request method, e.g., <code>get</code>, <code>post</code>.</p>
</td>
    </tr><tr>
    <td>[options.headers]</td><td><code>Object</code></td><td></td><td><p>Any headers you want to add to your request.</p>
</td>
    </tr><tr>
    <td>[options.search]</td><td><code>Object</code></td><td></td><td><p>Any query parameters you want to add to your request.</p>
</td>
    </tr><tr>
    <td>[options.body]</td><td><code>Object</code> | <code>FormData</code></td><td></td><td><p>Any body that you want to add to your request.</p>
</td>
    </tr>  </tbody>
</table>


* * *

