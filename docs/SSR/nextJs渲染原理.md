# nextJs渲染原理


![Alt text](./images/nextjs-1.png)

渲染流程：

1. 接口请求
2. 服务端返回生成的html文件和js文件
3. 浏览器加载html,渲染页面。此时页面还不能交互
4. 浏览器执行js文件，页面进行水合，给页面元素添加事件。
5. 浏览器渲染完成，可交互。
6. 页面跳转时，想服务器请求新页面的state，使用spa单页面的特性更新页面内容。（浏览器会返回一个json文件，里面包含将要渲染的内容）


如下图，点击link时，浏览器请求了getting-started.json文件
![Alt text](./images/nextjs-2.png)

刷页面时，回去请求当前页面的html资源，而不是去更新原有页面内容。
![Alt text](./images/nextjs-3.png)