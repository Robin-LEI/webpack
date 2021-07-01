# 安装
`npm install  webpack webpack-cli --save-dev`

# 配置文件
`webpack.config.js`

# 入口
`entry: './src/index.js'`

# 出口
```js
output: {
  // 输出目录的绝对路径
  path: resolve(__dirname, 'dist'),
  // 文件名 默认输出文件名 main.js
  filename: 'main.js'
}
```

# module 模块
1. 包含两个属性rules:[]，plugins: []

# __dirname
1. 当前文件所在的绝对路径目录

# loader 加载器
1. webpack本身只能理解js和json
2. loader让webpack可以处理其它类型的文件
3. loader本质上是一个函数，接受源文件，返回一个js代码

# resolve(a, b)和join(a, b)的区别
1. resolve拼接出绝对路径，也就是说会把相对路径转成绝对路径
2. join简单的拼接 a/b

# webpack5特点
1. 做到了零配置，直接执行`webpack`就可以进行打包到dist目录，什么都不要配置

# webpack的特点
1. webpack只能理解js和json文件

# scripts配置
1. `build: 'webpack'`，执行`npm run build`的时候，`webpack`会先去找`webpack.config.js`这个配置文件，这个是可以修改的，比如 `build: webpack --config webpack.config2.js`，在打包的时候，会去找`webpack.config2.js`这个文件

# 常用的loader
1. `raw-loader`，解析txt文件
```js
{
  test: /\.txt$/,
  loader: 'raw-loader' // 或者 use: 'raw-loader'
}
```

# 常用的plugin

# webpack5和webpack4的区别
