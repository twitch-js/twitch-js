const TwitchJs = require('../lib').default;

require('dotenv').config();

// Provide your token, username and channel. You can generate a token here:
// https://twitchapps.com/tmi/
const token = process.env.TWITCH_TOKEN;
const refreshToken = process.env.TWITCH_REFRESH_TOKEN;
const username = process.env.TWITCH_USERNAME;

const channel = process.env.TWITCH_CHANNEL;
const otherChannels = [
  // 'og_arist0tle',
  // 'spencerawest',
  // 'kate',
  // '88bitmusic',
  'riss',
  'g33z3r_hd',
];

// Instantiate clients.
const { api, chat, chatConstants } = new TwitchJs({
  token,
  username,
  log: { level: 'info' },
  api: { log: { level: 'debug' } },
});

// Start example.
(async function() {
  // Retrieve latest stream.
  const { streams } = await api.get('streams', {
    search: { offset: 500, limit: 5 },
  });

  const channels = streams.map(s => s.channel.name);

  // Connect to chat.
  await chat.connect();

  // Join channel.
  await Promise.all(otherChannels.map(chat.join.bind(chat)));
})();
