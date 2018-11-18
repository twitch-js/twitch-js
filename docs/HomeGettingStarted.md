# Home

Welcome to the **TwitchJS Wiki**.

## Getting started

### CommonJS

If you are using a module bundler, such [Webpack](https://webpack.js.org/), [Browserify](http://browserify.org/), or a in a Node environment:

1. Add TwitchJS to your project:
   ```bash
   npm install --save twitch-js
   
2. Import TwitchJS

   ```js
   // ES2015 syntax
   import Twitch from 'twitch-js';

   // OR ES5 syntax
   var twitch = require('twitch-js');
   ```

### UMD

If you are not using a module bundler, precompiled builds are available in the [`dist` folder](https://unpkg.com/twitch-js/dist/):

1. Include a script tag in your HTML:
   ```html
   <script src="//unpkg.com/twitch-js@latest/dist/twitch-js.min.js"></script>
   ```
2. Consume the library:
   ```html
   <script type="javascript">
     window.TwitchJS ...
   </script>
   ```

## More information

For more information, please see the [Examples](/docs/Examples.md) section of the [Wiki](/docs).
