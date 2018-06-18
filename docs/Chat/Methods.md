# Chat Client

## Methods

### Contents

* [client.getChannels()](#clientgetchannels) - Get the current channels.
* [client.getOptions()](#clientgetoptions) - Get the current options.
* [client.getUsername()](#clientgetusername) - Get the current username.
* [client.isMod()](#clientismod) - Is a mod on a channel.
* [client.readyState()](#clientreadystate) - Get the current state of the socket.

### client.getChannels()

Get the current channels. (_Array_)

```javascript
console.log(client.getChannels());
```

### client.getOptions()

Get the current options. (_Object_)

```javascript
console.log(client.getOptions());
```

### client.getUsername()

Get the current username. (_String_)

```javascript
console.log(client.getUsername());
```

### client.isMod()

**NOT RECOMMENDED**

Function to check if user is a mod on a channel. (_Boolean_)

**Important**: Might not be accurate.

**Parameters:**

* `channel`: _String_ - Channel name
* `username`: _String_ - Username

```javascript
if (client.isMod('#schmoopiie', 'bob')) {
  // Do something..
}
```

**RECOMMENDED**

Everytime you receive a message on Twitch, you receive an object that contains all the information you need from the user.

```javascript
client.on('chat', function(channel, user, message, self) {
  if (user.mod) {
    // User is a mod.
  }
});
```

### client.readyState()

Get the current state of the socket. (_String_)

```javascript
// Returns one of the following states: "CONNECTING", "OPEN", "CLOSING" or "CLOSED".
console.log(client.readyState());
```
