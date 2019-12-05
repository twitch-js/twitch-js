const TwitchJs = require('twitch-js');

// Provide your token, username and channel. You can generate a token here:
// https://twitchapps.com/tmi/
const token = process.env.TWITCH_TOKEN;
const username = process.env.TWITCH_USERNAME;

const channel = 'twitchapis';

// Instantiate clients.
const { api, chat } = new TwitchJs({ token, username });

// Get featured streams.
api.get('streams/featured', { version: 'kraken' }).then(response => {
  console.log(response);
  // Do stuff ...
});

const handleMessage = message => {
  console.log(message);
  // Do other stuff ...
};

// Listen for all events.
chat.on(TwitchJs.Chat.events.ALL, handleMessage);

// Connect ...
chat.connect().then(() => {
  // ... and then join the channel.
  chat.join(channel);
});
