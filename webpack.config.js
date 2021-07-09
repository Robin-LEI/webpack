const { resolve } = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
require('dotenv').config()

console.log(666, process.env.NODE_ENV)

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  // entry: {
  //   page1: './src/pages/page1.js',
  //   page2: './src/pages/page2.js'
  // },
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
        res.json({ name: 'xiaoli' })
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
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader', 
          'postcss-loader', 
          {
            loader: 'px2rem-loader', 
            options: {
              remUnit: 75, // 此处填写的是设计稿宽度的十分之一，例如设计稿的宽度是750px，1rem=75px
              remPrecision: 8 // rem保留几位小数
            }
          }
        ]
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
    // new HtmlWebpackPlugin({
    //   template: resolve(__dirname, './src/index.html'),
    //   filename: 'page1.html',
    //   chunks: ['page1']
    // }),
    // new HtmlWebpackPlugin({
    //   template: resolve(__dirname, './src/index.html'),
    //   filename: 'page2.html',
    //   chunks: ['page2']
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, 'src/static'),
          to: resolve(__dirname, 'dist/static')
        }
      ]
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${resolve(__dirname, 'src')}/**/*`, { nodir: true }),
    })
  ]
}