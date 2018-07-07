'use strict'
;(function waitForEmbed() {
  const embed = document.getElementById('my-embed')

  if (!embed) {
    window.requestAnimationFrame(waitForEmbed)
  } else {
    window.RunKit.createNotebook({
      element: document.getElementById('my-embed'),
      source: `const TwitchJs = require('twitch-js@2.0.0-beta.2').default;

const token = TWITCH_TOKEN;
const username = TWITCH_USERNAME;

const channel = 'twitchapis';

// Instantiate Chat client.
const { chat, chatConstants } = new TwitchJs({ token, username });

// Listen to all events.
const log = msg => console.log(msg);
chat.on(chatConstants.EVENTS.ALL, log);

// Connect ...
chat.connect().then(() => {
  // ... and then join the channel.
  chat.join(channel);
});`,
    })
  }
})()
