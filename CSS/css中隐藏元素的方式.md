# css中隐藏元素的方式

通过css实现隐藏元素方法有如下：

1. display:none
2. visibility:hidden
3. opacity:0
4. width: 0; height: 0; 配合overflow: hidden;
5. position:absolute
6. clip-path

## display:none

特点：元素不可见，不占据空间，无法响应点击事件。

```css
.hide{
    display: none; 
}
```

## visibility:hidden

特点：元素不可见，占据空间，无法响应点击事件。

```css
.hide{
    visibility: hidden;
}
```

## opacity:0

特点：改变元素透明度，元素不可见，占据页面空间，可以响应点击事件。

```css
.hide{
    opacity: 0;
    filter:Alpha(opacity=0);   
}
```

## width: 0; height: 0; 配合overflow: hidden;

特点：元素不可见，不占据页面空间，无法响应点击事件。但 padding值 和 margin值 依然存在，需要将内外边距都调整为0。

```css
.hide{
   display: inline-block;
   width: 0;
   height: 0;
   padding: 0;
   margin: 0;
   overflow: hidden; 
}
```
## position:absolute

特点：元素不可见，不占据页面空间，无法响应点击事件。

```css
.wrap{
    position: relative;
    width: 500px;
    height: 500px;
    background: blueviolet;
}
.hidden{
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: red;
    /* 百分比是根据父元素的高/宽来计算 */
    left: -100%; //-500px
    top: -100%; //-500px
}

<div class="wrap">
    <div class="hidden">
        测试
    </div>
</div>
```
## clip-path

特点：占据空间，元素不可见，无法响应点击事件。

```css
.hide {
    // 设置多变形的顶点都为0
	clip-path: polygon(0px 0px, 0px 0px, 0px 0px, 0px 0px);
}
```



