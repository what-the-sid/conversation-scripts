const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CopyPlugin = require("copy-webpack-plugin");

// Detect functions by folder
const entries = fs.readdirSync('./src').reduce((result, element) => {
  if (element !== '__tests__' && element !== 'lib') {
    const accum = {
      ...result,
    };
    accum[element] = `./src/${element}/index.js`;
    return accum;
  }
  return result;
}, {});

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: entries,
  devtool: isProduction ? 'source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@lib': path.resolve(__dirname, './lib'),
    },
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'scripts/'),
    filename: '[name].js',
  },
  target: 'node',
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new CopyPlugin({
      patterns: [
        "./gcloud-credentials.json"
      ],
      options: {
        concurrency: 100,
      },
    }),
  ],
};
