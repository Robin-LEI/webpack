# 安装
`npm install  webpack webpack-cli --save-dev`

# 配置文件
`webpack.config.js`

# 入口
1. `entry: './src/index.js'`
2. 可以有多个
```js
extry: {
  main: ''
}
```

# 出口
```js
output: {
  // 输出目录的绝对路径
  path: resolve(__dirname, 'dist'),
  // 文件名 默认输出文件名 main.js
  filename: 'main.js'
}
```
# __dirname
1. 当前文件所在的绝对路径目录

# module 模块
1. rules:[]

# loader 加载器
1. webpack本身只能理解js和json
2. loader让webpack可以处理其它类型的文件
3. loader本质上是一个函数，接受源文件，返回一个js代码
4. loader.raw = true，得到的是一个二进制的Buffer，为false，得到的是一个utf8的字符串

# plugin 插件
1. 很强大，可以干任何事情
2. 和module平级，plugins: []

# mode 模式，webpack4.x引入
1. development
2. production
3. 区别

| mode | 特点 |
| -- | -- |
| development | 打包后的文件体积大，不会进行代码压缩 |
| production | 打包后的文件体积小，会进行代码压缩 |


# resolve(a, b)和join(a, b)的区别
1. resolve拼接出绝对路径，也就是说会把相对路径转成绝对路径
2. join简单的拼接 a/b

# webpack5特点
1. 做到了零配置，直接执行`webpack`就可以进行打包到dist目录，什么都不要配置

# webpack的特点
1. webpack只能理解js和json文件

# scripts配置
1. `build: 'webpack'`，执行`npm run build`的时候，`webpack`会先去找`webpack.config.js`这个配置文件，这个是可以修改的，比如 `build: webpack --config webpack.config2.js`，在打包的时候，会去找`webpack.config2.js`这个文件

# 开发服务器 devServer
1. devServer会启动一个http服务器，把一个文件夹作为静态根目录
2. 为了提高性能，会把打包文件写到内存文件系统，而不是写到硬盘中
3. 默认情况下，devServer会读取打包后的路径
4. 先找output中指定的path，没有，再找contentBase指定的根目录，静态文件根目录是可以有多个的
5. 线上不能用
```js
devServer: {
  contentBase // 指定把哪个目录变为静态资源根目录，推荐使用绝对路径
  port // 端口号
  open // 自动打开
  compress // 是否压缩
  writeToDisk // 是否写到硬盘中，好处是便于调式
}
```

# publicPath 公开访问路径
```js
output: {
  filename: 'main.js',
  publicPath: '/assets' // 成为打包后文件的前缀
}
// 打包后文件为 /assets/main.js

devServer: {
  publicPath: '/', // 默认是 /
  publicPath: '/assets', // http://localhost:8080/assets/bundle.js
  publicPath: 'http://localhost:8080/assets/' // 可以指定一个完整路径
}
```

# 支持CSS
1. 安装 `style-loader`和`css-loader`
2. `css-loader`转换`@import`和`url`语法
3. webpack默认不支持css类型的文件
4. `style-loader`把css脚本插入到head
```js
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader'] // 从右到左执行
}
```

# 支持less
1. 安装 less less-loader
2. less-loader把less变成css
```js
{
  test: /\.less$/,
  use: ['style-loader', 'css-loader', 'less-loader']
}
```

# 支持scss
1. 安装 node-sass sass-loader
```js
{
  test: /\.scss$/,
  use: ['style-loader', 'css-loader', 'sass-loader']
}
```

# 支持图片img
1. 在webpack中使用图片有三种方式
- 直接通过import 和require引入
```js
// require一个图片，会返回图片的新路径
let logo = requrie('./images/logo.png')
let image = new Image()
image.src = logo.default;
document.body.appendChild(image)
```
- 在css中
```css
.box {
  background-image: url('./images/logo.png')
}
```
- 可以通过配置静态文件根目录来实现，在html中直接引入，需要配置contentBase
```html
<img alt src='/logo.png' />
```

2. 安装file-loader和url-loader和html-loader
- file-loader 文件加载器，找到项目中使用的img路径，拷贝到dist目录，并改名
- url-loader 是对file-loader的增强，多了个参数 limit，内部依赖file-loader
```js
{
  test: /\.(png|jpg|bmp|gif)$/,
  use: [{
    loader: 'file-loader',
    options: {
      name: '[hash:10].[ext]', // hash值32位，取10位
      esModule: false // 不变成es6模块，使用的时候不需要 .default，默认为true
    }
  }]
}

{
  test: /\.(png|jpg|bmp|gif)$/,
  use: [{
    loader: 'url-loader',
    options: {
      name: '[hash:10].[ext]', // hash值32位，取10位
      esModule: false,
      limit: 8 * 1024 // 如果文件的体积小于8k，就转换为base64字符串内嵌到html中，否则和file-loader一样 
    }
  }]
}
```
3. 在html中使用相对路径引入图片
```html
<img alt src='./images/logo.png' />
```
- 需要配置html-loader解析
```js
{
  test: /\.html$/,
  use: ['html-loader'] // 把相对路径解析为绝对路径
}
```

# 支持JS
- babel-loader，转换器，是一个函数，内部调用babel-core，因为它本身不知道怎么把es6转为es5
- babel-core，本身提供一个过程管理功能，把源代码抽象成抽象语法树，它本身也不知道，具体要转换什么语法，以及如何转换
- babel-preset-env，它知道怎么转，把es6语法树转为es5语法树，然后babel-core在根据es5语法树生成es5代码
```js
{
  test: /\.jsx?$/,
  use: [{
    loader: 'babel-loader',
    options: {
      preset: [ // 预设是插件的集合，没有预设要写很多插件
        // @babel/preset-env 默认不能转化 Promise
        // 可以采取引入polyfill腻子的方式解决低版本浏览器兼容性的问题
        // require('@babel/polyfill); 缺点就是打包后的体积过大
        // '@babel/preset-env', // 可以转换js语法
        ['@babel/preset-env', {
          // 按需加载
          useBuiltIns: "usage", // 按需加载polyfill
          // useBuiltIns有三种取值，分别是usage、false、entry
          // 如果是false，表示全部加载引入的polyfill
          // 如果是entry，需要在入口文件手动添加 import '@babel/polyfill',这里需要指定corejs的版本号，如果是3，需要这样引入：import 'core-js/stable'; import 'regenerator-runtime/runtime'
          corejs: {
            version: 3 // 制定corejs的版本号 2或者3 其实就是polyfill
          },
          targets: { // 兼容到指定浏览器的指定版本
            chrome: '60',
            firefox: '60',
            ie: '9',
            safari: '10',
            edge: '17'
          }
          // 这样操作还是体积有点大，最完美的是利用polyfill service
          // polyfill.io 自动化的polyfill JavaScript服务
          // <script src="https://polyfill.io/v3/polyfill.min.js"></script>
        }],
        '@babel/preset-react' // 可以转换react语法
      ],
      plugins: [ // 为啥不把这两个放到预设中，因为不常用
        ['@babel/plugin-proposal-decorators', { legacy: true }], // 把类和对象装饰器编译成ES5 @readonly 叫装饰器
        // legacy为true，表示使用stage 1语提案，语法提案分为stage 1,2,3,4，stage 1支持@readonly
        ['@babel/plugin-proposal-class-properties', { loose: true }] // 转换静态类属性以及使用属性初始值化语法声明的属性 class Person {@readonly PI = 3.14}
        // loose为true，会把类的属性编译为 赋值表达式 this.x = 'bar'
        // loose为false，会把类的属性编译为Object.defineProperty
      ]
    }
  }]
}
```

# watch 实时编译，及时更新dist目录
```js
// 第一种，在webpack.config.js中开启watch监视
watch: true,
watchOption: {
  ignored: /node_modules/,
  aggregateTimeout: 600, // 监听到更改，延迟600ms再去重新编译
  poll: 1000 // 每一秒检查一次
}
// 第二种，在package.json配置编译脚本的地方开启watch监视
"scripts": {
  "build": "webpack --watch"
}
```

# 代理
```js
// 第一种，在devServer中配置proxy选项
devServer: {
  port: 9000,
  open: true,
  host: 'localhost',
  // create-react-app 支持把代理写在package.json中
  proxy: {
    '/api': {
      target: 'http://localhost:9001',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}

// 第二种，也是在derServer中进入配置，使用before属性，只不过不用单独写一套后端服务用来mock
derServer: {
  port: 9000,
  open: true,
  host: 'localhost',
  // webpack-dev-server就是一个express服务器
  // 这里不是新启动了一个服务器，而是在原来老的9000端口的服务器新添加了一个路由
  before(app) {
    app.get('/api/user', (req, res) => {
      res.json({name: 'xiaoli'})
    })
  }
}
```

# 中间件
- webpack有两种用法
  1. webpack-dev-server
  2. webpack-dev-middleware
- 如果你已经有一个express的服务器，想要添加打包的功能就可以使用中间件

```js
let express = require('express')
let app = express()

const webpack = require('webpack')
const webpackOptions = require('webpack.config')
const WebpackDevMiddleware = require('webpack-dev-middleware')
webpackOptions.mode = 'development'
// compiler 是webpack工作的主要对象
const compiler = webpack(webpackOptions)
// WebpackDevMiddleware会返回一个express的中间件
// 1. 会启动webpack的编译，产出main.hash.js
// 2. 会返回一个中间件，当接受到客户端请求这些产出文件的请求时，把内容返回
app.use(WebpackDevMiddleware(compiler, {}))

app.listen(9000)
```

# webpack5 tree-shaking的弊端
> webpack5的tree-shaking相较之前的版本已经变得十分智能和强大，但是也会存在一些问题，比如会把一些不该优化的给优化掉，比如css，如何解决呢？

# CSS兼容性
- 为了浏览器的兼容性，有时候我们要在css前面加上前缀，有-moz-、-o、-ms、-webkit
- 安装postcss-loader，可以使用postcss处理css
- 安装postcss-preset-env，把现代的浏览器转化成大多数浏览器可以理解的（已经包含了autoprefixer和browser）
- `npm install postcss-loader postcss-preset-env -D`
```js
// webpack.config.js
{
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
}

// postcss.config.js
let postcssPresetEnv = require('postcss-preset-env');
module.exports = {
  plugins: [postcssPresetEnv({
    browsers: 'last 5 version'
  })]
}

// 在package.json中也可以配置postcss
"postcss": {
  "postcssOptions": {
    "plugins": [
      "postcss-preset-env"
    ]
  }
}
```

# px自动转成rem
- 用到一个loader和一个库
  - px2rem-loader 自动把px转化成rem
  - lib-flexible 动态设置根元素的fontSize
```js
// index.html
let docElement = document.documentElement;
function setRemUnit() {
  // 750 / 75 = 10  1个rem等于多少个px
  docElement.style.fontSize = docElement.clientWidth / 10 + 'px'
}
setRemUnit();
window.addEventListener('resize', setRemUnit)

// webpack.config.js
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

// main.js，如果引入这个库，我们就不要自己手写动态计算fontSize的代码了
import 'lib-flexible';

// lib-flexible源代码
(function flexible (window, document) {
  var docEl = document.documentElement // 获取到文档元素
  var dpr = window.devicePixelRatio || 1

  // adjust body font size
  function setBodyFontSize () {
    if (document.body) {
      document.body.style.fontSize = (12 * dpr) + 'px'
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit () {
    var rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) { // 页面显示事件
    if (e.persisted) { // 判断是否后退进入
      setRemUnit()
    }
  })

  // detect 0.5px supports
  // 解决移动端1px的问题
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))
```

# MPA 多入口
```js
entry: {
  page1: './src/pages/page1.js',
  page2: './src/pages/page2.js'
}

// html-webpack-plugin 利用chunks也支持多入口打包
new HtmlWebpackPlugin({
  template: resolve(__dirname, './src/index.html'),
  filename: 'page1.html',
  chunks: ['page1']
}),
```

# webpack-merge
1. 用来merge webpack的配置项，比如，可以把dev和prod生成各自的配置文件，在不同环境打包的时候，读取不同的配置文件
2. npm install webpack-merge -D
```js
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
```

# .env 文件
1. NODE_ENV=development
2. 就相当于 给process.env.NODE_ENV 赋值
3. 需要配合安装 dotenv 使用
4. `require('dotenv').config()`，如果不设置path，默认去查找项目目录的.env文件

# path的区别和联系
- output > path：输出文件夹的绝对路径
- output > publicPath，打包生成的index.html文件里面引用资源的前缀，如果不写，输出的就是一个文件名，默认为 /，也可以写成线上的CDN地址
- devServer > publicPath，dist的虚拟目录，表示打包生成的静态文件所在的目录，如果没有设置，会从output的publicPath中获取

# eslint 代码校验
- npm install eslint eslint-loader babel-eslint --D
- 配置文件 .eslintrc.js
```js
// webpack.config.js
{
  test: /\.jsx?$/,
  loader: 'eslint-loader',
  enforce: 'pre', // exforce：强制指定顺序 pre之前，校验编译前的代码，保证顺序
  options: {
    fix: true // 启动自动修复
  },
  exclude: /node_modules/, // 排除掉那些不校验的文件
  include: path.resolve(__dirname, 'src') // 只校验src目录下面的文件
}

// .eslintrc.js
module.exports = {
  root: true, // 根配置文件
  parser:"babel-eslint", // 需要一个解析器把源代码转为抽象语法树
  //指定解析器选项
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2015
  },
  //指定脚本的运行环境
  env: {
    browser: true,
  },
  // 启用的规则及其各自的错误级别
  rules: {
    "indent": "off",//缩进风格
    // indent: ['error', 4] 缩进不是4个就报错
    "quotes":  "off",//引号类型 
    "no-console": "error",//禁止使用console
  }
}
```
- ;;;; 只保留一个;如何处理？
> 使用airbnb

# sourcemap
- 编译前的代码和编译后的代码形成一个映射
- 利用devtool设置sourcemap

devtool有几个选项
- eval：打包后的代码用eval包裹起来，速度快，可以缓存，但是不会产生.map文件
- source-map:会产生.map文件，是一个映射文件，包含行和列信息，包含loader的sourcemap（可以映射到最原始的源文件）
- cheap-source-map：会产生一个.map文件，包含行，不包含列，不包含loader的sourcemap（映射不到最原始的源文件，只能看到babel-loader编译转换后的代码）
- cheap-module-source-map：会产生一个.map文件，包含loader的sourcemap，包含行的信息
- inline-source-map：不会生成单独的.map文件，内嵌在打包后的代码里面
- 开发环境最佳实践：cheap-module-eval-source-map，信息全，速度快
- 生产环境最佳实践：hidden-source-map，隐藏source-map，这里的隐藏指的是会生成map文件，但是在打包后的文件中不会映射map文件，直接映射会出现代码泄露的风险，需要把map文件单独放到调试服务器上

# 如何打包第三方库
1. 直接引入，`import _ from 'lodash'`，缺点是比较麻烦，每次都要引入
2. 插件引入，new webpack.ProvidePlugin，就不要import或者require单独引用了，优点是不需要手工引入，缺点是不能全局使用（指的是在index.html中不能直接通过window访问）
```js
// 打包lodash
new webpack.ProvidePlugin({
  _: 'lodash'
})
```

3. 利用expose-loader，会在window全局上注入
```js
rules: [
  {
    test: require.resolve('lodash'),
    loader: 'expose-loader',
    options: {
      exposes: {
        globalName: "_",
        override: true
      }
    }
  }
]
```

4. 通过CDN引入，缺点：需要手工插入CDN脚本，不管你代码中用到没用到，都会引入
```js
// 现在模块index.html文件，引入 <script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js"></script>
// 如果我已经通过CDN外链引入了一个 lodash库并且挂载了_变量，这样在引入require('lodash')的时候就不会打包了
externals: {
  lodash: '_'
}
// index.js使用
require('lodash')
```

5. 借助插件html-webpack-externals-plugin，好处是不需要手工引入，而且做到了按需引入
```js
HtmlWebpackExternalsPlugin({
  externals: [
    {
      module: 'lodash',
      entry: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js',
      global: '_'
    }
  ]
})
```



# 常用的loader
1. `raw-loader`，解析txt文件
```js
{
  test: /\.txt$/,
  loader: 'raw-loader' // 或者 use: 'raw-loader'
}
```
2. style-loader 把css source生成脚本插入到head，使用时需要安装 npm i style-loader -S
```js
function loader(cssSource) {
  return `
    let style = document.createElement('style')
    style.innerHTML = ${cssSource}
    document.head.appendChild(style)
  `
}
module.exports = loader
```
3. `css-loader` 解析css文件中用到的import和url语法，npm i css-loader -S
4. `url-loader`
5. `file-loader`
6. `html-loader`
7. `less less-loader`
8. `node-sass sass-loader`
9. `postcss-loader postcss-preset-env`
10. `expose-loader`，把一个模块的返回值注册到全局中

# 常用的plugin
1. `html-webpack-plugin` 指定模板，往里面插入打包后的资源
2. `copy-webpack-plugin` 将单个文件或者整个目录拷贝到构建的目录
3. `clean-webpack-plugin` 每次重新构建的时候，删除output.path目录下面的所有文件及其目录
4. `mini-css-extract-plugin` 把收集到的所有css都写入到一个文件中
5. `purgecss-webpack-plugin` 把css文件中没有用到的样式在编译打包的时候给删除

# webpack5和webpack4的区别
1. 热更新，webpack4叫做 `webpack-dev-serve`，webpack5叫做 `webpack serve`
2. webpack4的tree-shaking很弱，webpack5的tree-shaking功能很强大
3. webpack4在做vue-ssr的时候，配合vue-server-renderer支持自动往html插入客户端的bundle.js文件，webpack5不支持，但是可以借助html-webpack-plugin实现，在打包的时候给html-webpack-plugin增加一个属性，指定打包后的客户端js脚本文件，在html中通过ejs取出这个属性值

# webpack.config.js配置结构
```js
module.exports = {
  mode: '',
  entry: '',
  output: {
    path: '',
    filename: '',
    publicPath: '/'
  },
  devtool,
  watch: true,
  watchOption: {},
  devServer: {
    contentBase: '',
    port,
    open,
    writeToDisk,
    compress,
    publicPath
  },
  module: {
    rules: []
  },
  plugins: []
}
```

# webpack.config.js
```js
const path = require('path')
const glob = require('glob') // 用来匹配路径的
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgeCSSWebpackPlugin = require('purgecss-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '',
    publicPath: '/'
  },
  devtool: 'source-map',
  watch: true,
  watchOption: {
    ignored: /node_modules/, 
    aggregateTimeout: 600, 
    poll: 1000
  },
  devServer: {
    contentBase: '',
    port: 9000,
    open: true,
    writeToDisk: false,
    compress: true,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.txt$/,
        loader: 'raw-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true, // 移除空格
        removeComments: true // 移除注释
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/static'),
          to: path.resolve(__dirname, 'dist/static')
        }
      ]
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*'] // 清空所有  读 output中的path路径
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new PurgeCSSWebpackPlugin({
      // nodir。如果将其设置为true，则输出中将没有任何目录路径。
      paths: glob.sync(`${path.resolve(__dirname, 'src')}/**/*`, {nodir: true})
    })
  ]
}
```
