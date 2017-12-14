# TwitchJS

A community-centric, community-supported version of `tmi.js`.


## Contribution guidelines

If you wish to contribute, please see the [CONTRIBUTING](https://github.com/marcandrews/twitch-js/blob/master/CONTRIBUTING.md) doc.


## Getting started

### Installation

#### CommonJS
If you are using a module bundler, such [Webpack](https://webpack.js.org/), [Browserify](http://browserify.org/), or a in a Node environment:
1.  Add TwitchJS to your project:
    ```bash
    npm install --save twitch-js
    ```
2.  Import TwitchJS
    ```js
    // ES2015 syntax
    import Twitch from 'twitch-js';

    // OR ES5 syntax
    var twitch = require('twitch-js');
    ```

#### UMD
If you are not using a module bundler, precompiled builds are available in the [`dist` folder](https://unpkg.com/twitch-js/dist/):
1.  Include a script tag in your HTML:
    ```html
    <script src="//https://unpkg.com/twitch-js/"></script>
    ```
2.  Consume the library:
    ```html
    <script type="javascript">
    windows.TwitchJS ...
    </script>
    ```

For more information, please see the original [`tmi.js` documentation](https://docs.tmijs.org/).


## Special thanks

[Schmoopiie](https://github.com/Schmoopiie) and all the [original contributors](https://github.com/tmijs/tmi.js/graphs/contributors) of `tmi.js`.

## License

MIT