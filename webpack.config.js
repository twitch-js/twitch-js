const path = require('path');

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (env = {}, argv) => {
  const isProd = env.production === true;

  return {
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
      filename: isProd ? '[name].min.js' : '[name].js',
      library: 'TwitchJs',
      libraryExport: 'default',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },

    devtool: isProd ? false : 'source-map',

    plugins: isProd
      ? [
          new LodashModuleReplacementPlugin({ coercions: true, paths: true }),
          new MinifyPlugin({}, { sourceMap: 'source-map' }),
          new CompressionPlugin(),
        ]
      : [new LodashModuleReplacementPlugin({ coercions: true, paths: true })],
  };
};
