## Bom和Dom

### Bom

Bom（browser Object Modle）是浏览器对象模型，是通过js操作浏览器的一个桥梁。

Bom包括以下的对象模型：

1. window:包括全局属性和方法
2. location:操作URL
3. history：操作浏览器的历史
4. domcument:当前窗口操作文档的对象

###### window对象

window对象有两重身份：

1. 全局对象：

   1. 在ECMAscript中window是全局对象，Node中代表global对象

   2. 在浏览器中代表window对象

      

2. 浏览器窗口对象：用于操作浏览器窗口

###### loaction对象

loaction包含的属性：

1. href: 当前window对应的超链接URL, 整个URL； 
2. protocol: 当前的协议；
3. host: 主机地址；
4. hostname: 主机地址(不带端口)； 
5. port: 端口；
6. pathname: 路径；
7. search: 查询字符串；
8. hash: 哈希值；
9. username：URL中的username（很多浏览器已经禁用）；
10. password：URL中的password（很多浏览器已经禁用）；

地址：http://127.0.0.1:5500/index.html#aaa


创建方法：

1. location.assign():跳转到新的URL，会保存到history中，可以回退
2. location.replace():跳转到新的URL，不会保存到history中，不可以回退
3. reload():重新加载页面，传入一个布尔值，true为强制刷新页面，从服务器获取数据，false会向查找缓存。
4. 


###### history对象

history对象允许我们访问浏览器曾经的回话历史记录。

属性：

1. length：回话中的记录条数
2. state:当前回话页面的状态值

方法：

1. back()：返回上一页，等价于history.go(-1)； 
2. forward()：前进下一页，等价于history.go(1)； 
3. go()：加载历史中的某一页；
4. pushState()：打开一个指定的地址； 传入两个参数，状态对象和url地址
5. replaceState()：打开一个新的地址，并且使用replace； 传入两个参数，状态对象和url地址

### EventTarget

Window继承自EventTarget，所以会继承其中的属性和方法：

- addEventListener：注册某个事件类型以及事件处理函数；
- removeEventListener：移除某个事件类型以及事件处理函数；
-  dispatchEvent：派发某个事件类型到EventTarget上；

### 窗口API

#### 窗口大小

所有现代浏览器都支持的属性：

1. innerWidth ， innerHeight   返回浏览器页面视口的大小(不包含边框和工具栏)
2. outerWidth ，outerHeight  返回浏览器页面视口的大小，包含浏览器边框和工具栏

返回浏览器页面视口的大小(不包含边框和工具栏)：

标准模式：document.documentElement.clientHeight





