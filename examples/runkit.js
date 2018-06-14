const TwitchJs = require('twitch-js@2.0.0-beta.1').default;

// Provide your token, username and channel. You can generate a token here:
// https://twitchapps.com/tmi/
const token = process.env.TWITCH_TOKEN;
const username = process.env.TWITCH_USERNAME;

const channel = 'twitchapis';

// Instantiate Chat client.
const { chat, chatConstants } = new TwitchJs({ token, username });

// Specify event handlers.
const log = msg => console.log(JSON.stringify(msg, null, 2));
chat.on(chatConstants.EVENTS.ALL, log);

// Connect ...
chat.connect().then(res => {
  // ... and then join a channel or channels.
  chat.join(channel);
});
