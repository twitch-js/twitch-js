const webpack = require('webpack');
const path = require('path');

const isProdBuild = process.env.NODE_ENV === 'PRODUCTION';

module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ },
    ],
  },

  entry: {
    'dist/twitch-js': './src/index',
  },

  output: {
    path: path.join(__dirname, './'),
    filename: isProdBuild ? '[name].min.js' : '[name].js',
    library: 'TwitchJS',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },

  plugins: isProdBuild ? [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false,
      },
    }),
  ] : [],
};