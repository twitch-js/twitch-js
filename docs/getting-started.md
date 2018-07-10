---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

## CommonJS

If you are using a module bundler, such [Webpack](https://webpack.js.org/),
[Browserify](http://browserify.org/), or a in a Node environment:

1. Add TwitchJS to your project:
   ```bash
   npm install --save twitch-js@next
   ```
2. Import TwitchJS

   ```js
   // ES2015 syntax
   import TwitchJS from 'twitch-js'

   // OR ES5 syntax
   var TwitchJS = require('twitch-js').default
   ```

## UMD

If you are not using a module bundler, precompiled builds are available in the
[`dist` folder](https://unpkg.com/twitch-js@>2.0.0-beta/dist/):

1. Include a script tag in your HTML:
   ```html
   <script src="//unpkg.com/twitch-js@>2.0.0-beta/dist/twitch-js.min.js"></script>
   ```
2. Consume the library:
   ```html
   <script type="javascript">
     window.TwitchJs ...
   </script>
   ```
