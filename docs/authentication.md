---
id: authentication
title: Authentication
sidebar_label: Authentication
---

## Obtaining a client ID

To obtain a client ID, follow the
[instructions](https://dev.twitch.tv/docs/authentication/#registration) found in
the [Twitch Developers documentation](https://dev.twitch.tv/docs).

## Obtaining a token

With a client ID,
[tokens may be generated](https://dev.twitch.tv/docs/authentication/#getting-tokens)
on behalf of your users.

To quickly get started without a client ID, you may generate token using the
following, community-maintained, sites:

1. [Twitch Chat OAuth Password Generator](https://twitchapps.com/tmi) (v5)
2. [Twitch Token Generator](https://twitchtokengenerator.com) (Helix)

## Refreshing tokens

While, v5 tokens currently do not expire, Helix tokens expire and will need to
be refreshed.

To help with refreshing tokens, an `onAuthenticationFailure` function may be
provided to the Messaging and API clients. `onAuthenticationFailure()` must
return a `Promise` that resolves with the refreshed token. Upon resolution, any
actions that yielded a an _expired token_ response will be retried with the new,
refreshed token.

### Handling token refresh example

```js
// Optionally, use fetchUtil to help.
import fetchUtil from 'twitch-js/lib/utils/fetch'

const refreshToken = 'eyJfaWQmNzMtNGCJ9%6VFV5LNrZFUj8oU231/3Aj'
const clientId = 'fooid'
const secret = 'barbazsecret'

const onAuthenticationFailure = () =>
  fetchUtil('https://id.twitch.tv/oauth2/token', {
    method: 'post',
    search: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    },
  }).then(response => response.access_token)

const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
const username = 'ronni'
const twitchJs = new TwitchJs({ token, username, onAuthenticationFailure })

twitchJs.chat.connect().then(globalUserState => {
  // Do stuff ...
})
```

See
[Refreshing access tokens](https://dev.twitch.tv/docs/authentication/#refreshing-access-tokens)
for more information.

## More information

See the
[Twitch Developers documentation](https://dev.twitch.tv/docs/authentication) for
more information on authentication.
