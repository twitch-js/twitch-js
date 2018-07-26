# Chat Client

## Configuration

Each and every option listed below is optional. Running TwitchJS without options will result as an anonymous connection to Twitch and you will have to join the channels manually.

`options`: (_Optional_)

* `clientId`: _String_ - Used to identify your [application](https://dev.twitch.tv/dashboard/apps) to the API (Default: `null`)
* `debug`: _Boolean_ - Show debug messages in console (Default: `false`)
* `commandTimeout`: _Integer_ - Number of ms before command will timeout if no response from server (Default: `600`)

`connection`: (_Optional_)

* `server`: _String_ - Connect to this server (_Overrides cluster and connect to this server instead_)
* `port`: _Integer_ - Connect on this port (Default: `80`)
* `reconnect`: _Boolean_ - Reconnect to Twitch when disconnected from server (Default: `false`)
* `maxReconnectAttempts`: _Integer_ - Max number of reconnection attempts (Default: `Infinity`)
* `maxReconnectInterval`: _Integer_ - Max number of ms to delay a reconnection (Default: `30000`)
* `reconnectDecay`: _Integer_ - The rate of increase of the reconnect delay (Default: `1.5`)
* `reconnectInterval`: _Integer_ - Number of ms before attempting to reconnect (Default: `1000`)
* `secure`: _Boolean_ - Use secure connection (SSL / HTTPS) (_Overrides port to `443`_)
* `timeout`: _Integer_ - Number of ms to disconnect if no responses from server (Default: `9999`)

`identity`: (_Optional_)

* `username`: _String_ - Username on Twitch
* `password`: _String_ - [OAuth password](http://twitchapps.com/tmi/) on Twitch

`channels`: _Array_ - List of channels to join when connected (Default: `[]`)

`logger`: _Object_ - Custom logger with the methods `info`, `warn`, and `error`

## More information

For more information, see the [Examples](/docs/Examples.md) section of the [Wiki](/docs).
