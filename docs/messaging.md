---
id: messaging
title: Messaging Interface
sidebar_label: Messaging
---

Use the Messaging interface for chatbots and to interact with Twitch chat.

## Connecting

Connecting to Twitch chat requires a [token](authentication#obtaining-a-token)
with `chat_login` scope and a username.

```js
const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
const username = 'ronni'
const { chat } = new TwitchJs({ token, username })

chat.connect().then(globalUserState => {
  // Do stuff ...
})
```

Once connected, `chat.userState` will contain
[global user state information](reference/typedef#GlobalUserStateTags).

## Joining a channel

```js
const channel = '#dallas'

chat.join(channel).then(channelState => {
  // Do stuff with channelState...
})
```

After joining a channel, `chat.channels[channel]` will contain
[channel state information](reference/typedef#ChannelState).

## Listening for events

```js
// Listen to all messages
chat.on('*', message => {
  // Do stuff with message ...
})

// Listen to private messages
chat.on('PRIVMSG', privateMessage => {
  // Do stuff with privateMessage ...
})
```

Events are nested; for example:

```js
// Listen to subscriptions only
chat.on('USERNOTICE/SUBSCRIPTION', userStateMessage => {
  // Do stuff with userStateMessage ...
})

// Listen to all user notices
chat.on('USERNOTICE', userStateMessage => {
  // Do stuff with userStateMessage ...
})
```

For added convenience, TwitchJS also exposes event constants.

```js
const { chat, chatConstants } = new TwitchJs({ token, username })

// Listen to all user notices
chat.on(chatConstants.EVENTS.USER_NOTICE, userStateMessage => {
  // Do stuff with userStateMessage ...
})
```

## Sending messages

```js
const channel = '#dallas'

chat
  .say(channel, 'Kappa Keepo Kappa')
  // Optionally ...
  .then(userStateMessage => {
    // ... do stuff with userStateMessage on success ...
  })
```

## Sending commands

All chat commands are currently supported and exposed as camel-case methods. For
example:

```js
// Enable followers-only for 1 week
chat.followersOnly('1w')

// Ban ronni
chat.ban('ronni')
```

**Note:** `Promise`-resolves for each commands are
[planned](https://github.com/twitch-apis/twitch-js/issues/87).

## Joining multiple channels

```js
const channels = ['#dallas', '#ronni']

Promise.all(channels.map(channel => chat.join(channel))).then(channelStates => {
  // Listen to all private messages
  chat.on('PRIVMSG', privateMessage => {
    // Do stuff with privateMessage ...
  })

  // Listen to private messages from #dallas only
  chat.on('PRIVMSG/#dallas', privateMessage => {
    // Do stuff with privateMessage ...
  })
  // Listen to all private messages from #ronni only
  chat.on('PRIVMSG/#ronni', privateMessage => {
    // Do stuff with privateMessage ...
  })
})
```
