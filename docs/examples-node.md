---
id: examples-node
title: Node Example
sidebar_label: Node
---

```js
const TwitchJs = require('twitch-js').default

// Provide your token, username and channel. You can generate a token here:
// https://twitchapps.com/tmi/
const token = TWITCH_TOKEN
const username = TWITCH_USERNAME

const channel = 'twitchapis'

// Instantiate Chat client.
const { chat, chatConstants } = new TwitchJs({ token, username })

// Listen to all events.
const log = msg => console.log(msg)
chat.on(chatConstants.EVENTS.ALL, log)

// Connect ...
chat.connect().then(() => {
  // ... and then join the channel.
  chat.join(channel)
})
```
