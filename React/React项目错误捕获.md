# React 项目错误捕获指南

在 React 应用中，一个组件的运行时错误如果不加捕获，会导致整个组件树的卸载（白屏）。为了提升应用的健壮性，我们需要一套完善的错误捕获机制。

---

## 1. 核心武器：错误边界 (Error Boundary)

**错误边界**是一种 React 组件，它可以捕获其子组件树中任意位置的 JavaScript 错误，并展示降级 UI。

### 类组件实现
由于 Hooks 目前还不支持 `getDerivedStateFromError` 或 `componentDidCatch`，因此错误边界必须通过类组件来实现。

```tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  // 当子组件抛出错误时触发
  public static getDerivedStateFromError(_: Error): State {
    // 更新 state 使下一次渲染能够显示降级 UI
    return { hasError: true };
  }

  // 用于记录错误信息（例如发送到 Sentry）
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>抱歉，页面出错了。</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 使用方式
```tsx
<ErrorBoundary fallback={<p>组件加载失败</p>}>
  <MyWidget />
</ErrorBoundary>
```

---

## 2. 错误边界的“遮羞布”：局限性

错误边界**无法**捕获以下场景中的错误：
1. **事件处理函数**（例如 `onClick` 内部抛错）。
2. **异步代码**（例如 `setTimeout` 或 `requestAnimationFrame` 回调）。
3. **服务端渲染 (SSR)**。
4. **它自身抛出的错误**。

---

## 3. 标准化方案：`react-error-boundary`

在实际项目中，我们通常推荐使用成熟的开源库 [react-error-boundary](https://github.com/bvaughn/react-error-boundary)，因为它功能更全且符合 React 的函数式心智模型。
[react-error-boundary](https://react-error-boundary-lib.vercel.app/)文档

### 基本用法
```tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div role="alert">
      <p>出错了：</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>重试</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // 重置应用状态，以便用户重试
      }}
    >
      <MyComponent />
    </ErrorBoundary>
  );
}
```

---

## 4. 挑战：捕获异步错误

由于错误边界无法捕获异步错误，我们需要一种技巧来主动将异步错误“抛给” React 渲染周期。

### 方案 A：使用 `useErrorHandler` (react-error-boundary 提供)
```tsx
import { useErrorHandler } from 'react-error-boundary';

function MyComponent() {
  const handleError = useErrorHandler();

  const fetchData = async () => {
    try {
      await apiCall();
    } catch (e) {
      // 通过该 Hook 将错误抛出，这样外层的 ErrorBoundary 就能捕获到
      handleError(e);
    }
  };
}
```

### 方案 B：手动更新状态抛错
本质上是利用 React 在状态更新时的同步检查机制。
```tsx
const [_, setError] = useState();

const handleAsyncError = (error: any) => {
  // 设置状态为一个函数，并在其中抛错
  setError(() => { throw error; });
};
```

---

## 5. 全局最后防线

某些极其严重的错误（如资源加载失败、未处理的 Promise 拒绝）不经过 React 渲染周期，需要通过 Window 事件监听：

```tsx
// 捕获全局未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

// 捕获普通 JS 运行时错误
window.onerror = function (message, source, lineno, colno, error) {
  // 上报错误日志
};
```

---

## 总结：最佳实践建议

1. **分层捕获**：
   - **全局级别**：捕获所有未知错误，展示整屏崩溃页。
   - **业务组件级别**：如侧边栏、详情页卡片，报错时不影响其他区域。
2. **记录日志**：在 `componentDidCatch` 或 `onError` 回调中将错误堆栈上报至 **Sentry** 或 **LogRocket**。
3. **提供反馈**：不要只留白屏，降级 UI 应包含“返回首页”或“点击重试”的按钮。

