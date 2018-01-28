/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, no-console */

// Require the TwitchJS library.
const TwitchJS = require('twitch-js');

// Setup the client with your configuration; more details here:
// https://github.com/twitch-apis/twitch-js/wiki/Configuration.
const options = {
  channels: ['#isak_'],
  // Provide an identity
  // identity: {
  //   username: "Isak_",
  //   password: "oauth:a29b68aede41e25179a66c5978b21437"
  // },
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
