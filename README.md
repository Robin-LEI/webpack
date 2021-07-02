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

# 支持img
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
        '@babel/preset-env', // 可以转换js语法
        '@babel/preset-react' // 可以转换react语法
      ],
      plugins: [ // 为啥不把这两个放到预设中，因为不常用
        ['@babel/plugin-proposal-decorators', { legacy: true }], // 把类和对象装饰器编译成ES5 @readonly 叫装饰器
        ['@babel/plugin-proposal-class-properties', { loose: true }] // 转换静态类属性以及使用属性初始值化语法声明的属性 class Person {@readonly PI = 3.14}
      ]
    }
  }]
}
```


# 常用的loader
1. `raw-loader`，解析txt文件
```js
{
  test: /\.txt$/,
  loader: 'raw-loader' // 或者 use: 'raw-loader'
}
```

# 常用的plugin
1. `html-webpack-plugin` 指定模板，往里面插入打包后的资源

# webpack5和webpack4的区别
1. 热更新，webpack4叫做 `webpack-dev-serve`，webpack5叫做 `webpack serve`

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
