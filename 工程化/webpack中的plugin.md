
# 插件（plugin）


Loader是用于特定的模块类型进行转换；



Plugin可以用于执行更加广泛的任务，比如打包优化、资源管理、环境变量注入等;



### **CleanWebpackPlugin**


该插件帮助我们，在每次打包时，自动删除上一次打包后的文件。



安装：



```plain
npm install clean-webpack-plugin -D
```



配置：



```javascript
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports={
    plugins: [new CleanWebpackPlugin()]
}
```



### HtmlWebpackPlugin


在打包完成的文件夹（dist/）中生成一个index.html文件。



安装：



```plain
npm install html-webpack-plugin -D
```



配置：



```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports={
    plugins: [new HtmlWebpackPlugin()]
}
```



index.html是通过ejs模板生成的，我们也可以自定义模板来生成index.html文件。



1.  创建一个模板文件（public/index.html） 

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

 

2.  对HtmlWebpackPlugin插件进行配置 
3.  配置DefinePlugin插件 
4.  配置CopyWebpackPlugin插件 



完整配置：



```javascript
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {DefinePlugin} = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

modult.exports={
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "./dist"),
    },
    plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      //模板文件
      template: "./public/index.html",
      //模板中使用到的title属性
      title: "webpack项目",
    }),
    new DefinePlugin({
      //设置全局变量
      BASE_URL: "'./'",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          //文件来源
          from: "public",
          //文件去向
          to: "./", //相对于output的path属性来定位的（./代表dist/）
          globOptions: {
            //如果使用了HtmlWebpackPlugin,模板和要copy的文件在同一个文件夹中，
            //必须设置该属性，忽略掉模板文件
            ignore: ["**/index.html"],
          },
        },
      ],
    }),
  ],
}
```



### **DefinePlugin**


DefinePlugin允许在编译时创建配置的全局常量，是一个webpack内置的插件。



配置：



```javascript
module.exports={
    plugins: [new DefinePlugin()]
}
```



### **CopyWebpackPlugin**


在vue的打包过程中，如果我们将一些文件放到public的目录下，那么这个目录会被复制到dist文件夹中。



这个复制的功能，我们可以使用CopyWebpackPlugin来完成；



安装：



```plain
npm install copy-webpack-plugin -D
```



**接下来配置CopyWebpackPlugin即可：**



复制的规则在patterns中设置；



1. **from：**设置从哪一个源中开始复制；
2. **to：**复制到的位置，可以省略，会默认复制到打包的目录下；
3. **globOptions：**设置一些额外的选项，其中可以编写需要忽略的文件：



	index.html：不需要复制，因为我们已经通过HtmlWebpackPlugin完成了index.html的生成；