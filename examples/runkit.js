/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, no-console */

// Require the TwitchJS library.
const TwitchJS = require('twitch-js');

// Setup the client with your configuration; more details here:
// https://github.com/twitch-apis/twitch-js/blob/master/docs/Chat/Configuration.md
const options = {
  connection: {
    reconnect: true,
    secure: true,
  },
  options: {
    // Some methods may require a client ID. If needed, please provide a
    // client ID below.
    // clientId: CLIENT_ID,
    debug: true,
  },
  // Some methods may require an identity. If needed, please provide one
  // here. Prepend your token with "oauth:".
  // identity: {
  //   username: 'twitchapis',
  //   password: TOKEN,
  // },
  channels: ['#twitchapis'],
};

const client = new TwitchJS.Client(options);

// Add chat event listener that will respond to "!command" messages with:
// "Hello world!".
client.on('chat', (channel, userstate, message, self) => {
  console.log(
    `Message "${message}" received from ${userstate['display-name']}`,
  );

  // Do not repond if the message is from the connected identity.
  if (self) return;

  if (options.identity && message === '!command') {
    // If an identity was provided, respond in channel with message.
    client.say(channel, 'Hello world!');
  }
});

// Finally, connect to the channel
client.connect();
