const path = require('path');
const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

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

  devtool: 'source-map',

  plugins: isProdBuild
    ? [
        new LodashModuleReplacementPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true,
            warnings: false,
          },
          sourceMap: true,
        }),
        new CompressionPlugin(),
      ]
    : [],
};
