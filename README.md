# TwitchJS

A community-centric, community-supported version of `tmi.js`.


## Contribution guidelines

All submissions must:
- Pass ESLint tests
- Pass TravisCI tests
- Maintain current test coverage
- Receive at least one approval from an existing contributor
- ... more to follow

Anyone who submits a PR that is merged with relatively little-to-no assistance from an existing contributor **will receive merge rights**.


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