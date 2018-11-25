---
id: api
title: API Interface
sidebar_label: API
---

Use the API interface to make requests to Twitch API v5.

## Initializing

```js
// With a token ...
const token = 'cfabdegwdoklmawdzdo98xt2fo512y'
const { api } = new TwitchJs({ token })

// ... or with a client ID
const clientId = 'uo6dggojyb8d6soh92zknwmi5ej1q2'
const { api } = new TwitchJs({ clientId })
```

**Note:** The recommended way to initialize the API client is with a token.

## Making requests

The API client exposes `get(endpoint, options)`, `post(endpoint, options)` and
`put(endpoint, options)` methods. Query string parameters and body parameters
are provided via `options.search` and `options.body` properties, respectively.

```js
// Get the latest Overwatch live streams
api.get('streams', { search: { game: 'Overwatch' } }).then(response => {
  // Do stuff with response ...
})

// Start a channel commercial
const channelId = '44322889'
api
  .post(`channels/${channelId}/commercial`, { body: { length: 30 } })
  .then(response => {
    // Do stuff with response ...
  })
```

## New Twitch API (Helix)

Support for New Twitch API (Helix) is
[planned](https://github.com/twitch-devs/twitch-js/issues/92).
