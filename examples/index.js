/* eslint-disable wrap-iife, func-names, prefer-destructuring, no-console */

(function() {
  // To get started with this example, specify a channel with which to connect.
  const channels = ['#twitchapis'];

  // In this example, TwitchJS is included via a <script /> tag, so we can
  // access the library from window.
  const TwitchJS = window.TwitchJS;

  // Define client options.
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
    channels,
  };

  const client = new TwitchJS.Client(options);

  // Add listeners for events, e.g. a chat event.
  client.on('chat', (channel, userstate, message, self) => {
    // You can do something with the chat message here ...
    console.info({
      channel,
      userstate,
      message,
      self,
    });
  });

  // Finally, connect to the Twitch channel.
  client.connect();
})();
