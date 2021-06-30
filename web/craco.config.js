/* eslint-disable import/no-extraneous-dependencies */
const WebpackBar = require('webpackbar');
const CracoLessPlugin = require('craco-less');

module.exports = {
  webpack: {
    plugins: [
      new WebpackBar({ profile: true }),
    ],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
