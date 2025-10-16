# 🧾 Vue CLI 打包文件名与 Hash 机制详解

## 一、为什么要给文件名加 Hash

在前端构建中，我们常常在打包后的文件名中看到类似：

```
app.7f8d2a31.js
chunk-vendors.5c4d8e90.js
style.13ad9f1b.css
```

这些 **hash 值** 用于浏览器缓存优化（Cache Busting）：

* 浏览器缓存资源文件；
* 当内容改变时，hash 改变，浏览器自动加载新文件；
* 内容不变时，hash 保持不变，命中缓存，提升性能。

---

## 二、Hash 的类型与区别

Webpack 提供了三种常见的哈希方案：

| 名称              | 示例                        | 粒度  | 说明                                      |
| --------------- | ------------------------- | --- | --------------------------------------- |
| `[hash]`        | `app.[hash].js`           | 构建级 | 整个项目构建生成一个 hash，任何文件改动都会导致所有文件的 hash 改变 |
| `[chunkhash]`   | `app.[chunkhash].js`      | 入口级 | 每个入口（chunk）单独计算 hash，仅改动的入口文件 hash 变化   |
| `[contenthash]` | `style.[contenthash].css` | 内容级 | 根据文件内容生成 hash，只要内容不变，hash 不变（最常用）       |

在现代前端项目中，通常推荐使用 **`[contenthash]`**，因为它最稳定、最适合缓存优化。

---

## 三、Vue CLI 的默认文件名规则

Vue CLI 内部基于 Webpack，它自动为我们设置了合适的文件命名规则：

源码（简化）：

```js
const outputFilename = getAssetPath(
  options,
  `js/[name]${isLegacyBundle ? '-legacy' : ''}${isProd && options.filenameHashing ? '.[contenthash:8]' : ''}.js`
)

webpackConfig.output
  .filename(outputFilename)
  .chunkFilename(outputFilename)
```

解析：

* 开发模式 (`isProd=false`)：`js/[name].js`
* 生产模式：`js/[name].[contenthash:8].js`
* Modern 模式（旧浏览器兼容）：`js/[name]-legacy.[contenthash:8].js`
* 如果在配置中关闭 `filenameHashing`，则不带 hash。

---

## 四、Vue CLI 的相关配置项

你可以在 `vue.config.js` 里控制这些行为：

### 1️⃣ 默认设置（带 contenthash）

```js
module.exports = {
  productionSourceMap: false // 不生成 map 文件（可选）
}
```

输出示例：

```
js/app.5f4c123a.js
js/chunk-vendors.82af912b.js
css/app.13ad9f1b.css
```

---

### 2️⃣ 不带 hash（开发或调试）

```js
module.exports = {
  filenameHashing: false
}
```

输出：

```
js/app.js
js/chunk-vendors.js
css/app.css
```

---

### 3️⃣ 自定义 hash 规则（例如改为 chunkhash）

```js
module.exports = {
  configureWebpack: {
    output: {
      filename: 'static/js/[name].[chunkhash:6].js',
      chunkFilename: 'static/js/[name].[chunkhash:6].js'
    }
  }
}
```

---

### 4️⃣ 自定义资源路径结构

```js
module.exports = {
  outputDir: 'dist',
  assetsDir: 'static',
  configureWebpack: {
    output: {
      filename: 'static/js/[name].[contenthash:8].js',
      chunkFilename: 'static/js/[name].[contenthash:8].js'
    }
  }
}
```

结果：

```
dist/
 ├── static/js/
 ├── static/css/
 ├── static/img/
 └── index.html
```

---

## 五、内部实现原理简析

Vue CLI 使用以下内部逻辑保证 hash 稳定性：

| 机制                          | 作用                                 |
| --------------------------- | ---------------------------------- |
| **`HashedModuleIdsPlugin`** | 确保模块 ID 稳定，避免 hash 因引入顺序变化而改变      |
| **`MiniCssExtractPlugin`**  | 生成带 `[contenthash]` 的 CSS 文件       |
| **`HtmlWebpackPlugin`**     | 自动注入带 hash 的 JS/CSS 到 `index.html` |
| **`SplitChunksPlugin`**     | 拆分 vendors 与业务代码，减少 hash 影响范围      |

---

## 六、常见命名策略推荐

| 场景       | JS 文件名                      | CSS 文件名                      | 说明            |
| -------- | --------------------------- | ---------------------------- | ------------- |
| 开发环境     | `[name].js`                 | `[name].css`                 | 简单直观，方便调试     |
| 生产环境（推荐） | `[name].[contenthash:8].js` | `[name].[contenthash:8].css` | 内容级 hash，缓存友好 |
| 测试或旧系统兼容 | `[name].[chunkhash:8].js`   | `[name].[contenthash:8].css` | 控制粒度稍粗，但兼容性好  |

---

## 七、总结

* Vue CLI 默认已启用 **`[contenthash:8]`** 文件名；
* 可以通过 `filenameHashing`、`configureWebpack.output` 等方式自定义；
* 推荐生产环境使用 `contenthash`；
* 若开启 `--modern` 模式，会自动生成 `-legacy` 文件；
* 内部借助多种插件确保 hash 稳定性。



