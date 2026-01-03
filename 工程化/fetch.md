# Fetch 请求拦截原理详解

## 一、背景与目的

随着现代浏览器标准的普及，`fetch` API 逐渐成为替代 `XMLHttpRequest` 的主流网络请求方式。在前端监控 SDK 中，为了全方位捕捉用户通过 `fetch` 发起的网络请求（包括成功率、耗时、错误信息等），我们需要对全局的 `fetch` 函数进行拦截。

与 `XMLHttpRequest` 不同，`fetch` 是基于 Promise 的，其拦截逻辑主要基于 **AOP（面向切面编程）** 思想，即在保持原有功能的基础上，通过重写 `window.fetch` 插入监控代码。

## 二、核心原理：代理模式与流处理

拦截 `fetch` 的核心逻辑可以概括为以下三步：
1.  **保存原生方法**：将浏览器原生的 `window.fetch` 保存下来。
2.  **重写方法**：将 `window.fetch` 替换为一个自定义的高阶函数。
3.  **双向采集**：
    *   **请求阶段**：记录请求时间、URL、Method、Headers 等参数。
    *   **响应阶段**：拦截 Promise 的 resolve/reject，计算耗时，并读取响应内容。

### 关键难点：Response Body 的读取

`fetch` 响应返回的 `Response` 对象，其 Body 数据流（Stream）**只能被读取一次**。
*   如果监控代码调用了 `res.text()` 或 `res.json()` 读取了数据，业务代码再次读取时就会报错：`TypeError: Body has already been used`。
*   **解决方案**：使用 `res.clone()` 克隆一份响应对象，监控代码读取克隆对象的 Body，而将原始响应对象返回给业务代码。

## 三、源码深度解析 (fetchReplace)

以下是 `fetchReplace` 的实现分析：

```typescript
function fetchReplace(): void {
  if (!('fetch' in _global)) {
    return;
  }

  // 1. 使用 replaceAop 劫持 fetch
  replaceAop(_global, 'fetch', (originalFetch) => {
    return function (url: string | Request, config: Partial<Request> = {}) {
      // 2. 记录请求开始时间
      const sTime = getTimestamp();
      
      // 3. 收集请求参数
      // 处理 url 和 config 的兼容性（fetch 支持 (url, config) 或 (Request) 两种调用方式）
      const method = (config && config.method) || 'GET';
      const handlerData = {
        type: HTTPTYPE.FETCH,
        method,
        reqData: config && config.body, // 采集请求体
        url: url instanceof Request ? url.url : url // 获取请求 URL
      };

      // 4. 处理 Headers 
      const headers = new Headers(config.headers || {});
      Object.assign(headers, {
        setRequestHeader: headers.set
      });
      config = Object.assign({}, config, headers);

      // 5. 调用原生 fetch
      return originalFetch.apply(_global, [url, config]).then(
        (res: Response) => {
          // 6. 拦截成功响应
          // IMPORTANT: 克隆响应，避免锁定流
          const tempRes = res.clone();
          const eTime = getTimestamp();
          
          handlerData.elapsedTime = eTime - sTime;
          handlerData.time = sTime;
          handlerData.Status = tempRes.status;

          // 读取响应体
          tempRes.text().then((data) => {
            // 7. 过滤与上报
            // 过滤 SDK 自身的上报请求，防止死循环
            if ( method === EMethods.Post && transportData.isSdkTransportUrl(handlerData.url)) return;
            // 过滤用户配置忽略的 URL
            if (isFilterHttpUrl(handlerData.url)) return;

            // 根据配置决定是否收集详细响应数据
            if (options.handleHttpStatus && typeof options.handleHttpStatus == 'function') {
                handlerData.response = data; // 只有在特定条件下才全量收集 text，避免流量浪费
            }

            // 触发上报
            report(handlerData);
          });

          // 返回原始响应给业务
          return res;
        },
        (err: Error) => {
          // 8. 拦截网络错误
          const eTime = getTimestamp();
          handlerData.elapsedTime = eTime - sTime;
          handlerData.time = sTime;
          handlerData.Status = 0; // 失败状态码通常记为 0
          handlerData.response = undefined;

          report(handlerData);
          throw err; // 继续抛出错误，不影响业务
        }
      );
    };
  });
}
```

## 四、Fetch 关键参数介绍

`fetch(input, init)` 的参数配置直接影响监控数据的采集策略：

| 参数 | 类型 | 说明 | 监控关注点 |
| :--- | :--- | :--- | :--- |
| **input** (必选) | `USVString` \| `Request` | 请求的资源地址 |如果是 Request 对象，需从中提取 url 和 method |
| **init** (可选) | `RequestInit` | 配置对象 | 包含 header, body, method 等核心信息 |
| `method` | `String` | GET, POST, PUT 等 | 区分读写操作，RESTful 风格分析 |
| `body` | `Blob` \| `FormData` \| `String`等 | 请求体 | 需注意能否转为字符串（如 JSON vs 文件流） |
| `headers` | `Headers` \| `Object` | 请求头 | 可能包含 TraceId 用于全链路追踪 |
| `keepalive` | `Boolean` | 是否保持长连接 | SDK 发送埋点时常设为 `true` (防止页面关闭中断) |
| `mode` | `String` | cors, no-cors, same-origin | 跨域与安全策略 |

## 五、总结

`fetchReplace` 的设计体现了监控 SDK "无侵入" 的核心原则：

1.  **透明性**：对业务代码完全透明，不改变原有的 Promise 链式调用和返回值。
2.  **安全性**：严格处理 Response 流的克隆，防止破坏业务逻辑；严格过滤 SDK 自身请求，防止死循环。
3.  **鲁棒性**：无论请求成功与否，甚至发生网络错误，都能捕获并上报，同时确保错误能正确透传给业务层。