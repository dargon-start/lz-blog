---
sidebar: auto
---

## 流式布局

只管宽度，不管高度

## flex 布局

### 父元素属性

**`flex-direction`** 设置主轴的方向

```js
flex-direction: row;  //从左到右排列
flex-direction: row-reverse;  //从右到左
flex-direction: column; //从上到下
flex-direction: column-reverse;  //从下到上
```

**`justify-content`**设置主轴上的元素排列方式

==使用之前必须确定好主轴的方向==

| 属性值        | 作用                                      |
| ------------- | ----------------------------------------- |
| flex-start    | 默认值 从头部开始 如果是 x 轴，则从左到右 |
| flex-end      | 从尾部开始                                |
| center        | 在主轴上居中对齐                          |
| space-around  | 平分剩余空间                              |
| space-between | 先两边贴边，再平分剩余空间                |

**`flex-wrap`**设置子元素是否换行

特点：flex 布局中，子元素默认是不会换行的，而是压缩盒子大小

```javascript
flex-wrap: wrap;  //换行
```

**`align-items`**设置侧轴上的子元素排列方式（单行）

控制子项在侧轴（默认是 y 轴）上的排列方式，在子项为 1 单项（单行）的时候使用

| 属性值     | 作用           |
| ---------- | -------------- |
| flex-start | 从上而下       |
| flex-end   | 从下而上       |
| center     | 挤在一起居中   |
| stretch    | 拉伸（默认值） |

**`align-content`**设置侧轴上的子元素排列方式（多行）

| 属性值        | 作用                                     |
| ------------- | ---------------------------------------- |
| flex-start    | 默认值，从侧轴的头部开始排列             |
| flex-end      | 从侧轴的尾部开始排列                     |
| center        | 在侧轴上居中显示                         |
| space-around  | 子项子侧轴平分剩余空间                   |
| space-between | 子项在侧轴先分布在两头，再平分剩余的空间 |
| stretch       | 拉伸（默认值）                           |

**`flex-flow`**是 flex-direction 和 flex-wrap 的结合

```
flex-flow: row wrap;
```

### 子元素属性

一、`flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。

二、`align-self`控制子项自己在侧轴上的排列方式

align-self 允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性。默认值为 auto, 表示继承父元素的 align-items 属性，如果没有父元素等同于 stretch。

三、`order`属性定义子项的排列顺序

​ 数值越小，排列越靠前，默认为 0。

四、`flow-grow` 属性定义项目的放大比例，默认为`0`，即如果存在剩余空间，也不放大。

按比例来划分，如果一个盒子的 flow-grow 为 2，其他两个盒子的 flow-grow 为 1，则第一个盒子占剩余空间的四分之二。

五、`flex-shrink`属性定义项目的缩小比例，默认为`1`，即如果空间不足，该项目将缩小。

按比例来划分，如果一个盒子的 flow-shrink 为 2，其他两个盒子的 flex-shrink 为 1，则第一个盒子缩小超出部分的四分之二。

六、`flex-basis` 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目的本来大小。

flex:1 表示：flex:1 1 0%

因此元素会均等分。

## rem 布局

### em 和 rem

em:是相对于父元素的字体大小来改变的。

rem:是相对于 html 元素的字体大小来改变的。

### 媒体查询

```js
@media mediatype and|not|only (media feature) {
   CSS-Code;
}
```

mediatype(媒体类型): all , print (打印机) ，screen（手机电脑和 ipad 屏幕）

### 元素取值算法

1.页面元素的 rem 值=页面元素值(px）/(屏幕宽度/划分的份数)

2.屏幕宽度/划分的份数就是 html 中 font-size 的值

3.页面元素的 rem 值=页面元素值（px）/html font-size 字体大小

## vw,vh 布局

vw,vh 为视口布局，vw 为视口的宽度，vh 为视口的高度。

1vw 为视口宽度的 100 分之一

1vh 为视口高度的 100 分之一

查看属性的兼容： https://caniuse.com

### 常用的效果插件：

swiper https://www.swiper.com.cn/

SuperSlide http://www.superslide2.com/

betterscroll

### 视频样式统一个插件：zy.media.js

https://github.com/ireaderlab/zyMedia

### fastclick.js

清楚移动端默认的点击 300ms 延迟。

https://github.com/ftlabs/fastclick

## gird 网格布局
