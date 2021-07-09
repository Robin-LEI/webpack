let { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base');
const devConfig =
{
  module: {
    rules: [
      {
        test: /\.css$/
      }
    ]
  }
}

console.log(merge(baseConfig, devConfig));
module.exports = merge(baseConfig, devConfig)