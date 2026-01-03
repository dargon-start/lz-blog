# 📡 XMLHttpRequest 请求拦截原理详解

## 一、背景与目的

在前端监控、性能分析、用户行为追踪等场景中，开发者常常需要 **无侵入地监听所有通过 `XMLHttpRequest` 发出的网络请求**。  
由于原生 XHR 是浏览器内置对象，我们无法直接“订阅”其事件，但可以通过 **劫持（Monkey Patching）其原型方法** 来实现拦截和数据采集。


## 二、核心原理：原型劫持 + 事件监听

### 1. 劫持 `XMLHttpRequest.prototype.open`

```ts
xhr.open(method, url, async, user, password)
```

- **作用**：初始化一个请求（尚未发送）
- **拦截时机**：在调用 `open()` 时，提前记录：
  - 请求方法（转为大写）
  - 请求 URL
  - 开始时间戳（`sTime`）
- **存储位置**：挂载到 XHR 实例自身（`this.websee_xhr = {...}`），确保后续 `send` 和事件回调能访问

> ✅ 为什么在这里记录？因为 `open` 是第一个被调用的方法，且参数明确。

---

### 2. 劫持 `XMLHttpRequest.prototype.send`

XMLHttpRequest.send() 方法用于发送 HTTP 请求。如果是异步请求（默认为异步请求），则此方法会在请求发送后立即返回；

```ts
xhr.send(body)
```

- **作用**：真正发起 HTTP 请求
- **拦截逻辑**：
  1. 在调用原生 `send` **之前**，为当前 XHR 实例注册 `loadend` 事件监听器
  2. 调用原生 `send` 发送请求

> ⚠️ 注意：必须在 `send()` 调用前绑定事件，否则可能错过事件触发（尤其同步请求）。

---

### 3. 监听 `loadend` 事件

```js
xhr.addEventListener('loadend', callback)
```

- **触发时机**：无论请求成功（2xx）、失败（4xx/5xx）、网络错误、超时、中止（abort），**都会触发**
- **优势**：比单独监听 `load` / `error` / `abort` 更简洁可靠
- **在回调中**：
  - 判断是否为 SDK 上报接口（避免无限循环）
  - 判断是否为用户配置需过滤的 URL
  - 采集：
    - `status`：HTTP 状态码
    - `responseType`：响应类型（影响如何读取 `response`）
    - `response`：响应体（需根据类型处理）
    - `requestData`：即 `send(body)` 中的 `body`
    - `elapsedTime`：结束时间 - 开始时间
  - 触发上报函数（如 `notify(EVENTTYPES.XHR, data)`）

---

## 三、关键 XHR 方法与参数详解

| 方法 / 属性 | 说明 | 在拦截中的用途 |
|------------|------|----------------|
| `open(method, url, async?, user?, password?)` | 初始化请求 | 获取 method、url；记录开始时间 |
| `send(body?)` | 发起请求 | 获取请求体（`body`）；绑定 `loadend` 事件 |
| `addEventListener(type, listener)` | 注册事件监听 | 监听 `loadend` 获取最终结果 |
| `status` | 响应状态码（如 200, 404） | 判断请求成功与否 |
| `responseType` | 期望的响应类型（`""`, `"json"`, `"text"`, `"blob"` 等） | 决定如何解析 `response` |
| `response` | 响应体（类型由 `responseType` 决定） | 采集错误详情或业务数据 |


---


## xhrReplace函数

```ts
function xhrReplace(): void {
  if (!('XMLHttpRequest' in _global)) {
    return;
  }
  const originalXhrProto = XMLHttpRequest.prototype;
  replaceAop(originalXhrProto, 'open', (originalOpen: voidFun) => {
    return function (this: any, ...args: any[]): void {
      this.websee_xhr = {
        method: variableTypeDetection.isString(args[0]) ? args[0].toUpperCase() : args[0],
        url: args[1],
        sTime: getTimestamp(),
        type: HTTPTYPE.XHR
      };
      originalOpen.apply(this, args);
    };
  });
  
  replaceAop(originalXhrProto, 'send', (originalSend: voidFun) => {
    return function (this: any, ...args: any[]): void {
      const { method, url } = this.websee_xhr;
      // 监听loadend事件，接口成功或失败都会执行
      on(this, 'loadend', function (this: any) {
        // isSdkTransportUrl 判断当前接口是否为上报的接口
        // isFilterHttpUrl 判断当前接口是否为需要过滤掉的接口
        if ((method === EMethods.Post && transportData.isSdkTransportUrl(url)) 
          || isFilterHttpUrl(url)) return;

        const { responseType, response, status } = this;
        this.websee_xhr.requestData = args[0];
        const eTime = getTimestamp();
        // 设置该接口的time，用户用户行为按时间排序
        this.websee_xhr.time = this.websee_xhr.sTime;
        this.websee_xhr.Status = status;
        if (['', 'json', 'text'].indexOf(responseType) !== -1) {
          // 用户设置handleHttpStatus函数来判断接口是否正确，只有接口报错时才保留response
          if (options.handleHttpStatus && typeof options.handleHttpStatus == 'function') {
            this.websee_xhr.response = response && JSON.parse(response);
          }
        }
        // 接口的执行时长
        this.websee_xhr.elapsedTime = eTime - this.websee_xhr.sTime;
        // 执行之前注册的xhr回调函数
        notify(EVENTTYPES.XHR, this.websee_xhr);
      });
      originalSend.apply(this, args);
    };
  });
}
```

