# TwitchJS

[![Travis branch](https://img.shields.io/travis/marcandrews/twitch-js/master.svg)](https://travis-ci.org/marcandrews/twitch-js)
[![npm](https://img.shields.io/npm/v/twitch-js.svg)](https://www.npmjs.com/package/twitch-js)
[![npm](https://img.shields.io/npm/dw/twitch-js.svg)](https://www.npmjs.com/package/twitch-js)
[![GitHub issues](https://img.shields.io/github/issues/marcandrews/twitch-js.svg)](https://github.com/marcandrews/twitch-js/issues)
[![Coverage Status](https://coveralls.io/repos/github/marcandrews/twitch-js/badge.svg)](https://coveralls.io/github/marcandrews/twitch-js)

A community-centric, community-supported version of [`tmi.js`](https://github.com/tmijs/tmi.js).


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
    import TwitchJS from 'twitch-js';

    // OR ES5 syntax
    var TwitchJS = require('twitch-js');
    ```

#### UMD
If you are not using a module bundler, precompiled builds are available in the [`dist` folder](https://unpkg.com/twitch-js/dist/):
1.  Include a script tag in your HTML:
    ```html
    <script src="//unpkg.com/twitch-js@latest/dist/twitch-js.min.js"></script>
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