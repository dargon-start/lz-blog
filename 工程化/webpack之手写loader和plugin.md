# webpack之手写loader和plugin

## 手写loader

### 项目结构
首先用一张图，来看我们的项目结构。如下图所示：

![Alt text](./images/loader-1.png)

其中 loaders 文件夹下放置我们想要写的 loader ，同时里面的 replaceLoader.js 文件放置我们即将要写的 loader 的代码逻辑。之后，index.js 文件是我们的入口文件，放置我们的业务逻辑。 webpack.config.js 文件放置关于 webpack 的相关配置，而 dist 文件夹内的内容，放置的是我们通过 webpack 打包后，生成的打包文件。

### 业务代码编写

**（1）入口文件代码**

现在，我们先来编写入口文件 index.js 的代码。具体代码如下：

```console.log('hello monday');```

**（2）编写loader**

入口文件的内容很简单，我们想要达到的目的就是输出 hello monday 这个语句。现在，我们来编写 loader 的内容，已达到对入口文件 index.js 的内容进行修改。 replaceLoader.js 文件的代码具体如下：

```
module.exports = function(source) {  
    const result = source.replace('monday', 'mondaylab');
    this.callback(null, result);
}
```
以上的代码意思为，将入口文件 index.js 文件中的 monday 替换为 mondaylab 。这样写似乎没啥问题，但是大家有没有想过，我们有时候传的属性可能会很诡异，不一定每次都能像这样以字符串的形式来替换。

所以，我们引用 webpack 官方推荐的 loadertils 这个工具，来解决这个问题。

**第一步：** 安装 loader-utils 插件。具体命令如下：

npm install loader-utils --save-dev

**第二步：** 改造 loader 文件。接下来，我们对 replaceLoader.js 文件进行改造升级，具体代码如下：

```
const loaderUtils = require('loader-utils');

//用function的原因在于为了业务层可以调用this
//source为引入文件的源代码

module.exports = function(source) {
    //getOptions会自动地帮我们分析this.query,然后把参数的所有内容放在options里面去
    const options = loaderUtils.getOptions(this);
    const result = source.replace('monday', options.name);
    this.callback(null, result);
}
```
大家可以看到，通过使用 loaderUtils 插件，间接地，调用 getOptions 方法，来自动的帮我们分析 this.query ，从而取到我们想要的内容。


### 引用loader
现在，我们在 webpack.config.js 中，来引入我们上面的 loader 。具体配置如下：

```const path = require('path');

module.exports = {
   
    mode: 'development',
    entry: {
   
        main: './src/index.js'
    },
    module: {
   
        rules: [{
   
            test: /\.js/,
            use: [
                {
   
                    loader: path.resolve(__dirname, './loaders/replaceLoader.js'),
                    //上面的options.name中的name
                    options: {
   
                        name: 'mondaylab'
                    }
                }   
            ]
        }]
    },
    output: {
   
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js' 
    }
}
```

通过以上方式，我们写了一个简易的 loader ，这个 loader 实现了将 monday 替换为 mondaylab 的功能。并且供我们在 webpack 中使用自己书写的 loader 。

### 在loader里面做一些异步的操作

好了现在，如果我们想要给 loader 做一些异步操作，该怎么实现呢？

在我们所写的 loader 当中，加入异步操作，那么我们需要调用官方提供给我们的 this.async() 这个 API 来实现。现在，我们来改造一下 replaceLoader.js 文件的代码。具体代码如下：
```
const loaderUtils = require('loader-utils');

module.exports = function(source) {
   

    const options = loaderUtils.getOptions(this);
    //调用this.async()这个API，来给异步代码使用
    const callback = this.async();

    setTimeout(() => {
   
        const result = source.replace('monday', options.name);
        callback(null, result);
    }, 1000);
}
```

通过这种方式，我们就可以在 loader 中编写异步代码，来达到我们想要的效果。

### loader路径自定义

有一个很小的注意点就是，当我们在配置 webpack.config.js 文件中， loader 的路径时，每回都要 path.resolve 去寻找路径文件。文件少的时候还好，但如果遇到多文件的时候呢？岂不是会很麻烦。

所以，我们引用 resolveLoader 来简化它。现在我们在 webpack.config.js 文件中进行改造。具体配置如下：

```
const path = require('path');

module.exports = {  
    // 先到node_modules中去找，找不到则去./loaders目录下去找
    resolveLoader: {
        modules: ['node_modules', './loaders']
    },
    module: {
        rules: [{
            test: /\.js/,
            use: [
                {
                    loader: 'replaceLoader'
                }
            ]
        }]
    }
}
```
通过配置 resolveLoader ，来对文件文件目录进行查找，从而简化了路径内容。

### 总结：loader 开发要点

1. 链式调用支持
使用 this.callback 传递内容、SourceMap 和元数据，确保下游 Loader 能继续处理24。

2. 异步处理
通过 this.async() 标记异步操作，避免阻塞构建流程2。

3. 项配置
通过 this.getOptions() 获取 Loader 配置


# 手写plugin

## loader 和 plugin 的区别

在讲解 plugin 之前，我们先来了解 loader 和 plugin 的区别。

当我们在源代码里面，去引入一个新的 js 文件，或者是一个其他格式的文件时，这个时候我们可以借用 loader ，来帮我们处理我们引用的 loader 文件。 loader 的作用就在于，帮助我们处理引用的模块。

而 plugin 呢，是当我们在做打包的时候，在某些具体时刻上，比如说，当我们打包结束之后，我们要生成一个 html 文件，这个时候，我们就可以使用一个 htmlWebpackPlugin 的插件。使用它之后，他就会在打包结束之后，帮我们生成对应的 html 文件。

再比如，我们要在打包之前，把 dist 目录进行清空，这个时候我们就可以使用 cleanWebpackPlugin 来帮助我们做这件事情。

所以， plugin 插件，在什么时候生效呢？

它在我们打包过程中的某些时刻里，就是插件生效的场景。

plugin 的编写相对于 loader 来说，会难一点点。但是呢，如果有看过 webpack 源码的小伙伴们可能会知道， webpack 的一些底层原理都是依据 plugin 来进行编写的。所以，我们还是有必要来学习一下 plugin 的编写。

下面就带领大家来编写一个简易的 plugin ~

### 项目结构

对于 webpack 的 plugin 来说，它是是基于发布者订阅的设计模式，也可以说是基于事件驱动来实现的。在这个事件驱动里，代码之间的执行，是通过事件来进行驱动的。

接下来，我们就来写一个简易的 plugin 。

首先用一张图，来看我们的项目结构。如下图所示：

![Alt text](./images/plugin-1.png)

plugin项目结构

其中 plugins 文件夹下放置我们想要写的 plugin ，同时里面的 copyright-webpack-plugin.js 文件放置我们即将要写的 plugin 的代码逻辑。之后，index.js 文件是我们的入口文件，放置我们的业务逻辑。 webpack.config.js 文件放置关于 webpack 的相关配置，而 dist 文件夹内的内容，放置的是我们通过 webpack 打包后，生成的打包文件。

### 业务代码编写

**（1）入口文件代码**

现在，我们先来编写入口文件 index.js 的代码。具体代码如下：

```console.log('hello monday');```

**（2）编写plugin**

现在，我们来编写 plugin 的内容， copyright-webpack-plugin.js 文件的代码具体如下：

```
class CopyrightWebpackPlugin {
   
    //编写一个构造器
    constructor(options) {
   
         console.log(options)
     }

    apply(compiler) {
   
        //遇到同步时刻
        compiler.hooks.compile.tap('CopyrightWebpackPlugin',() => {
   
            console.log('compiler');
        });

        //遇到异步时刻
        //当要把代码放到dist目录之前，要走下面这个函数
        //Compilation存放打包的所有内容，Compilation.assets放置生成的内容
        compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (Compilation, cb) => {
   
            debugger;
            // 往代码中增加一个文件，copyright.txt
            Compilation.assets['copyright.txt'] = {
                source: function() {
                    return 'copyright by monday';
                },
                size: function() {
                    return 19;
                }
            };
            cb();
        })
    }
}

module.exports = CopyrightWebpackPlugin;
```
上面的这个插件中想要实现的功能就是，获取版权信息。

**（3）引用plugin**

现在，我们在 webpack.config.js 中，来引入我们上面的 plugin 。具体配置如下：

```const path = require('path');
const CopyrightWebpackPlugin = require('./plugins/copyright-webpack-plugin');

module.exports = {
   
    mode: 'development',
    entry: {
        main: './src/index.js'
    },
    plugins: [
        new CopyrightWebpackPlugin({
            name: 'monday'
        })
    ],
    output: {
   
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    }
}
```
通过上述代码，我们可以了解到，在（2）中，我们首先需要定义一个类，之后呢，在类中写一个构造器和一个 apply() 方法来调用。然后呢，大家看到（3），通过 require 的方式，来进行 new 实例 ，实例化一个插件，从而在项目中使用这个插件。

最终，我们项目进行打包时，就会生成一个 dist 目录，并且在目录下增加一个 copyright.txt 文件，并且文件中的内容就是 copyright by monday。

### 知识补充


```
// beforeCompile 之后立即调用，但在一个新的 compilation 创建之前。这个钩子 不会 被复制到子编译器。 beforeCompile在创建 compilation parameter 之后执行。
compiler.hooks.compile
// 输出 asset 到 output 目录之前执行
compiler.hooks.emit
```

编写插件是我们用到以上代码，他们都是complier的钩子函数，在不同的时间节点执行

参考文献：

https://developer.aliyun.com/article/1613908