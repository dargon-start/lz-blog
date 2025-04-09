# loader


在我们的项目中，除了js文件，我们会有非常多的文件类型，但是webpack默认是不能处理其他的文件类型的。如果要处理其他文件类型，我们需要使用loader对文件进行处理，之后webapck才能正确的打包。



### 处理.css文件


安装css-loader，用于解析css文件。



安装style-loader，用于将解析后的css插入的页面当中。



```plain
npm install css-loader -D
npm install style-loader -D
```



配置webpack：



```javascript
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,//匹配.css文件
        use: ["style-loader", "css-loader"],//使用css-loader,style-loader
      },
    ],
  },
};
```



注意：loader的书写是由循序要求的，loader是从右到左，从下到上，进行执行的。由于我们需要先使用css-loader解析css，然后使用style-loader将解析后的css插入的页面当中，因此书写顺序不能乱。



### 处理.less文件


浏览器是无法解析less文件的，我们需要使用less工具，将less文件转为css文件。



安装less工具：



```plain
npm install less -D
```



转为css文件：



```plain
 //后面第一个参数为源文件，第二个为目标文件
 npx lessc ./src/one.less one.css
```



在项目为了实现less文件在打包时自动转为css文件，我们需要安装less-loader。



```plain
npm install less-loader -D
```



配置webpack



```javascript
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
};
```



### 浏览器兼容性


在项目会有很多属性在不同浏览器之间存在兼容性的问题，比如css特性、js语法，之间的兼容性。



因此项目中都会用到browserslist工具，用于配置项目应该适配哪些浏览器。



通过该网站我们可以查看到浏览器的市场比例:[https://caniuse.com/usage-table](https://caniuse.com/usage-table)



安装webpack后，webpack自动安装了brobrowserslist



配置浏览器适配版本：



1.  通过在package.json中配置 

```plain
"browserslist": [
    "last 2 version",
    "> 1%",
    "not dead"
  ]
```

 

2.  在`.browserslistrc` 配置  
换行相当于逗号 



```plain
last 2 version
> 1%
not dead
```



browserslist是通过`caniuse-lite`工具从caniuse网站查询浏览器的市场占有率等信息。



![](https://cdn.nlark.com/yuque/0/2022/png/27505031/1655632286296-ded8be86-e30a-4d72-931f-98e00e3d48ff.png)



编写规则：不同符号连接的意义。



![](https://cdn.nlark.com/yuque/0/2022/png/27505031/1655632293449-cf4c3b87-4772-4426-9e29-802bb04319fd.png)



> **defaults：Browserslist的默认浏览器（> 0.5%, last 2 versions, Firefox ESR, not dead）。**
>
>  
>
> **5%：通过全局使用情况统计信息选择的浏览器版本。 >=，<和<=工作过。**
>
>  
>
> 5% in US：使用美国使用情况统计信息。它接受两个字母的国家/地区代码。
>
>  
>
> 5% in alt-AS：使用亚洲地区使用情况统计信息。有关所有区域代码的列表，请参见caniuse-lite/data/regions
>
>  
>
> 5% in my stats：使用自定义用法数据。
>
>  
>
> 5% in browserslist-config-mycompany stats：使用 来自的自定义使用情况数据browserslist-config-mycompany/browserslist-stats.json。
>
>  
>
> cover 99.5%：提供覆盖率的最受欢迎的浏览器。
>
>  
>
> cover 99.5% in US：与上述相同，但国家/地区代码由两个字母组成。
>
>  
>
> cover 99.5% in my stats：使用自定义用法数据。
>
>  
>
> **dead：24个月内没有官方支持或更新的浏览器。现在是IE 10，IE_Mob 11，BlackBerry 10，BlackBerry 7， Samsung 4和OperaMobile 12.1。**
>
>  
>
> **last 2 versions：每个浏览器的最后2个版本。**
>
>  
>
> last 2 Chrome versions：最近2个版本的Chrome浏览器。
>
>  
>
> last 2 major versions或last 2 iOS major versions：最近2个主要版本的所有次要/补丁版本
>
>  
>
> node 10和node 10.4：选择最新的Node.js10.x.x 或10.4.x版本。
>
>  
>
> current node：Browserslist现在使用的Node.js版本。
>
>  
>
> maintained node versions：所有Node.js版本，仍由 Node.js Foundation维护。
>
>  
>
> iOS 7：直接使用iOS浏览器版本7。
>
>  
>
> Firefox > 20：Firefox的版本高于20 >=，<并且<=也可以使用。它也可以与Node.js一起使用。
>
>  
>
> ie 6-8：选择一个包含范围的版本。
>
>  
>
> Firefox ESR：最新的[Firefox ESR]版本。
>
>  
>
> PhantomJS 2.1和PhantomJS 1.9：选择类似于PhantomJS运行时的Safari版本。
>
>  
>
> extends browserslist-config-mycompany：从browserslist-config-mycompanynpm包中查询 。
>
>  
>
> supports es6-module：支持特定功能的浏览器。 es6-module这是“我可以使用” 页面feat的URL上的参数。有关所有可用功能的列表，请参见 。caniuse
>
>  
>
> lite/data/features
>
>  
>
> browserslist config：在Browserslist配置中定义的浏览器。在差异服务中很有用，可用于修改用户的配置，例如 browserslist config and supports es6-module。
>
>  
>
> since 2015或last 2 years：自2015年以来发布的所有版本（since 2015-03以及since 2015-03-10）。
>
>  
>
> unreleased versions或unreleased Chrome versions：Alpha和Beta版本。
>
>  
>
> **not ie <= 8：排除先前查询选择的浏览器**
>



命令行使用：



```plain
npx browserslist ">1%, last 2 version, not dead"
```

### postcss
postcss可以帮助我们进行一些CSS的转换和适配，比如自动添加浏览器前缀、css样式的重置；

但是它的功能是依赖于插件的，因此我们需要安装它的内置插件来完成相应的功能。

安装postcss和postcss-cli



```plain
npm install postcss postcss-cli -D
```



安装autoprefixer插件，可以自动添加前缀。



```plain
npm install autoprefixer -D
```



使用命令来转换要添加前缀的文件。



```plain
//参数一：转换后的目标文件，参数二：需要转换的文件
npx postcss --use autoprefixer -o end.css ./src/css/style.css
```



在项目中，我们可以通过postcss-loader来使用postcss。



安装postcss-loader:



```plain
npm install postcss-loader -D
```



配置webpack:要实现自动添加前缀，我们需要使用autoprefixer插件。



```javascript
{
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("autoprefixer")],
              },
            },
          },
        ],
      },
```



配置插件，我们也可以使用单独的文件postcss.config.js来导入插件。



```javascript
module.exports = {
  plugins: [require("autoprefixer")],
};

//也可以这样写
module.exports = {
  plugins: ["autoprefixer"],
};
```



为了添加前缀，我们不必非要使用autoprefixer插件，postcss-preset-env插件也可以自动添加前缀，并且还可以使用新的css特性，该插件会根据浏览器的不同将其转为该浏览器可以识别的属性。



安装postcss-preset-env:



```plain
npm install postcss-preset-env -D
```



配置插件：



```javascript
module.exports = {
  plugins: [require("postcss-preset-env")],
};

//也可以这样写
module.exports = {
  plugins: ["postcss-preset-env"],
};
```



### 处理图片资源


#### file-loader


安装：



```plain
npm install file-loader -D
```



为了保留原来的名字或扩展名，我们可以使用PlaceHolders进行配置。并且为了防止命名冲突，我们还会使用hash值。



我们这里介绍几个最常用的placeholder：



<!-- **[ext]：** 处理文件的扩展名；



**[name]：**处理文件的名称；



**[hash]：**文件的内容，使用MD4的散列函数处理，生成的一个128位的hash值（32个十六进制）；



**[contentHash]：**在file-loader中和[hash]结果是一致的（在webpack的一些其他地方不一样，后面会讲到）；



**[hash:]：**截图hash的长度，默认32个字符太长了；



**[path]：**文件相对于webpack配置文件的路径； -->



配置：



我们除了可以直接在name中添加目标文件夹，还有一个属性，专门用于是指文件的存放路径。outputPath



```javascript
  {
        test: /\.(png|jpg|svg|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "img",
              name: "[name]_[hash:6].[ext]",
            },
          },
        ],
      },
```



#### url-loader


**url-loader和file-loader**的工作方式是相似的，但是可以将较小的文件，转成base64的URI。



默认情况下，是将所有的图片都进行base64编码。



安装：



```plain
npm install url-loader -D
```



我们可以通过limit属性，来设置只有小的图片进行base64编码，大的图片不进行编码。



这是因为小的图片转换base64之后可以和页面一起被请求，减少不必要的请求过程；



而大的图片也进行转换，反而会影响页面的请求速度



配置：



```javascript
{
        test: /\.(png|jpg|svg|gif)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              outputPath: "img",
              name: "[name]_[hash:6].[ext]",
              limit: 50 * 1024, //小于50kb的进行编码
            },
          },
        ],
      },
```



#### asset module type


webpack5之前，我们使用laoder来处理资源文件。webpack5中，我们可以使用资源模块类型，来替代之前的loader。



**资源模块类型(asset module type)**，通过添加 4 种新的模块类型，来替换所有这些 loader：



**asset/resource** 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现；



**asset/inline** 导出一个资源的 data URI。之前通过使用 url-loader 实现；



**asset/source** 导出资源的源代码。之前通过使用 raw-loader 实现；



**asset** 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现；



##### 自定义文件输出路径：


一、通过generator属性进行配置



```javascript
 {
        test: /\.(png|jpg|svg|gif)$/,
        type: "asset/resource",
        generator: {
          filename: "img/[name]_[hash:6][ext]",
        },
      },
```



二、在output中添加assetModuleFilename属性；



```javascript
 output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
    assetModuleFilename: "img/[name]_[hash:6][ext]",
  },
```



##### 限制文件编码的大小


实现通过url-loader的limit的效果。



步骤：



1. 将type改为asset
2. 添加一个parser属性，并且制定dataUrl的条件，添加maxSize属性；



```javascript
{
        test: /\.(png|jpg|svg|gif)$/,
        type: "asset",
        generator: {
          filename: "img/[name]_[hash:6][ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024,//小于50kb进行编码，转为base64
          },
        },
      },
```



### 处理字体文件


1. 在css-loader的6版本中，可以处理url()中的资源，因此我们不需要单独处理字体文件资源。
2. 如果在低版本中，我们可以通过file-loader来处理字体资源。
3. 在webpack5中可以使用asset modul type来处理字体资源。



```javascript
	//使用资源模块类型进行处理 
{
        test: /\.(eot|ttf|woff2?)$/,
        type: "asset/resource",
        generator: {
          filename: "font/[name]_[hash:6][ext]",
        },
      },
```



###  css-loader新版本（6）中的问题
由于要打包图片资源等，所以引入了file-loader或url-loader，这两个loader都可以对图片资源进行打包。

但是由于最新版本(6之后)中可以对css文件中的url进行解析打包，因此如果是在css文件中通过url（）引入了图片资源，css-loader是可以处理图片资源的。不需要引入其他的loader。

除了在css中使用图片资源，我们还会在js文件中使用图片资源，因此我们还是需要引入file-laoder或者是url-loader的。

问题：但是这里出问题了，这两个loader也会处理css中的图片资源，最终对同一张图片打包出了两张，并且引发了冲突，最终使用了css-loader打包出来的图片，但是由于冲突，导致图片异常，无法正常的在浏览器中显示。

解决方案：

使用webpack5中的asset module type 来处理资源文件，就可以解决问题了。
