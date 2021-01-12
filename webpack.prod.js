const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LicenseWebpackPlugin = require('license-webpack-plugin')
  .LicenseWebpackPlugin;

const base = require('./webpack.base.js');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });

const stringify = data =>
  Object.keys(data).reduce((acc, key) => {
    if (data[key]) {
      acc[key] = JSON.stringify(data[key]);
    }
    return acc;
  }, {});

module.exports = merge(base, {
  mode: 'production',
  devtool: 'hidden-source-map',
  target: 'browserslist',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: '"production"',
      ...stringify(dotenv.parsed),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
      chunkFilename: '[id].[chunkhash].css',
    }),
    new LicenseWebpackPlugin(),
  ],
});
