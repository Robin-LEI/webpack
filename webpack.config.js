const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  devServer: {
    port: 9000,
    open: true,
    host: 'localhost',
    before(app) {
      app.get('/api/user', (req, res) => {
        res.json({name: 'xiaoli'})
      })
    }
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        loader: 'raw-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  // watch: true,
  watchOptions: {
    ignored: /node_modules/, // 指定忽略的文件
    aggregateTimeout: 600, // 监听到文件变化后 600ms 才会去重新编译
    poll: 1000 // 每一秒检查一次
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, './src/index.html')
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, 'src/static'),
          to: resolve(__dirname, 'dist/static')
        }
      ]
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*'] // 清空所有
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
}