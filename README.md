# [TwitchJS](https://twitch-apis.github.io/twitch-js)

[![Travis branch](https://img.shields.io/travis/twitch-apis/twitch-js/master.svg?longCache=true&style=flat-square)](https://travis-ci.org/twitch-apis/twitch-js)
[![npm](https://img.shields.io/npm/v/twitch-js.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/twitch-js)
[![npm](https://img.shields.io/npm/v/twitch-js/next.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/twitch-js/v/next)
[![npm](https://img.shields.io/npm/dm/twitch-js.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/twitch-js)
[![GitHub issues](https://img.shields.io/github/issues/twitch-apis/twitch-js.svg?longCache=true&style=flat-square)](https://github.com/twitch-apis/twitch-js/issues)
[![Coverage Status](https://img.shields.io/codecov/c/github/twitch-apis/twitch-js/next.svg?longCache=true&style=flat-square)](https://codecov.io/gh/twitch-apis/twitch-js/branch/next)
[![Gitter](https://img.shields.io/gitter/room/twitch-apis/twitch-js.svg?longCache=true&style=flat-square)](https://gitter.im/twitch-apis/twitch-js)

A community-centric, community-supported Twitch JavaScript SDK.

## Warning

This branch is under active development; expect **breaking changes**. Please use
[v1](https://github.com/twitch-apis/twitch-js/tree/master) instead. If you still
choose to use this branch, use version pinning, refer to the diffs, and update
accordingly to avoid regressions.

## Features

* Aligns with official
  [Twitch IRC documentation](https://dev.twitch.tv/docs/irc/)
* Forward-compatible, minimally-assertive architecture
* Supports Node environments
* Supports Browsers
* Connect to multiple channels
* Chat commands
* Rate limiter

### In progress...

Here are the
[planned features](https://github.com/twitch-apis/twitch-js/milestone/1). If you
feel something is missing, create an issue or submit a PR against the next
branch.

## Getting started

### CommonJS

If you are using a module bundler, such [Webpack](https://webpack.js.org/),
[Browserify](http://browserify.org/), or a in a Node environment:

1. Add TwitchJS to your project:
   ```bash
   npm install --save twitch-js@next
   ```
2. Import TwitchJS

   ```js
   // ES2015 syntax
   import Twitch from 'twitch-js'

   // OR ES5 syntax
   var twitch = require('twitch-js')
   ```

### UMD

If you are not using a module bundler, precompiled builds are available in the
[`dist` folder](https://unpkg.com/twitch-js@>2.0.0-beta/dist/):

1. Include a script tag in your HTML:
   ```html
   <script src="//unpkg.com/twitch-js@>2.0.0-beta/dist/twitch-js.min.js"></script>
   ```
2. Consume the library:
   ```html
   <script type="javascript">
     window.TwitchJS ...
   </script>
   ```

## Contribution guidelines

If you wish to contribute, please see the
[CONTRIBUTING](https://github.com/twitch-apis/twitch-js/blob/master/CONTRIBUTING.md)
doc.

## Special thanks

[Schmoopiie](https://github.com/Schmoopiie) and all the
[original contributors](https://github.com/tmijs/tmi.js/graphs/contributors) of
`tmi.js`.

## License

MIT
