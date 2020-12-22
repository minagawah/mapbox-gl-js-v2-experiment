const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const base = require('./webpack.base.js');
const dotenv = require('dotenv').config({ path: __dirname + '/.env.local' });

module.exports = merge(base, {
  mode: 'development',
  devtool: 'inline-source-map',
  // https://github.com/webpack/webpack-dev-server/issues/2758#issuecomment-710086019
  target: 'web',
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      ...dotenv.parsed,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
