import TwitchJs, { ApiVersions, Message } from 'twitch-js';

// Provide your token, username and channel. You can generate a token here:
// https://twitchapps.com/tmi/
const token = process.env.TWITCH_TOKEN;
const username = process.env.TWITCH_USERNAME;

const channel = 'twitchapis';

// Instantiate clients.
const { api, chat } = new TwitchJs({ token, username });

// Get featured streams.
api
  .get('streams/featured', { version: ApiVersions.Kraken })
  .then((response) => {
    console.log(response);
    // Do stuff ...
  });

// Listen for all messages.
chat.on(TwitchJs.Chat.Events.ALL, (message) => {
  // Use discriminated unions on `message.command` and `message.event` to
  // determine the type of `message`.
  if (
    message.command === TwitchJs.Chat.Commands.USER_NOTICE &&
    message.event === TwitchJs.Chat.Events.SUBSCRIPTION
  ) {
    console.log(message.parameters.subPlan);
    // Do stuff with subscription message ...
  }
});

// ... or just listen for subscription messages only.
chat.on(TwitchJs.Chat.Events.SUBSCRIPTION, (message) => {
  console.log(message.parameters.subPlan);
  // Do stuff with subscription message ...
});

// For unknown commands or events, cast `message` as `Message` ...
chat.on('UNKNOWN', (message: Message) => {
  console.log(message.tags);
  // Do stuff with unknown message ...
});

// Connect ...
chat.connect().then(() => {
  // ... and then join the channel.
  chat.join(channel);
});
