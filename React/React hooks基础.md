# React Hooks 基础指南

React Hooks 是 React 16.8 引入的一项重大特性，它允许你在不编写类组件的情况下使用状态和其他 React 特性。

## Hooks 使用规则

在使用 Hooks 时，必须遵循以下两条核心规则：

1. **只在最顶层调用 Hooks**：不要在循环、条件或嵌套函数中调用 Hook。这确保了 Hooks 在每次渲染时都以相同的顺序被调用。
2. **只在 React 函数中调用 Hooks**：不要在普通的 JavaScript 函数中调用 Hook，而应该在 React 的函数组件或自定义 Hook 中调用。

---

## 1. useState：管理状态

`useState` 是最常用的 Hook，用于在函数组件中添加状态。

### 基本用法
```tsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数值: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

### 进阶：函数式更新
如果你需要根据之前的状态来计算新的状态，请向 `setCount` 传递一个函数。这可以确保在多次连续更新时，状态能够正确累加。

```tsx
const [count, setCount] = useState(0);

// 正确的做法：基于前一个值更新
const handleIncrement = () => {
  setCount(prevCount => prevCount + 1);
  setCount(prevCount => prevCount + 1); // 结果会是 +2
};
```

---

## 2. useEffect：处理副作用

`useEffect` 用于处理副作用，如数据获取、订阅或手动修改 DOM。

### 执行机制
```tsx
useEffect(() => {
  // 这里是副作用逻辑（例如：API 调用）
  console.log('组件挂载或依赖项更新');

  return () => {
    // 这里是清理函数（例如：清除定时器）
    console.log('组件卸载或下一次 Effect 执行前');
  };
}, [dependencies]); // 依赖项数组
```

### 依赖项对照表
| 依赖项 | 执行时机 |
| :--- | :--- |
| **不传依赖项** | 每次组件渲染后都会执行 |
| **空数组 `[]`** | 仅在组件挂载（Mount）时执行一次 |
| **有值数组 `[count]`** | 仅在 `count` 发生变化时执行 |

---

## 3. useRef：访问 DOM 与持久化变量

`useRef` 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数。

### 访问 DOM 元素
```tsx
import React, { useRef } from 'react';

function TextInputWithFocusButton() {
  const inputEl = useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    // 直接操作 DOM
    inputEl.current?.focus();
  };

  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>聚焦输入框</button>
    </>
  );
}
```

---

## 4. useMemo & useCallback：性能优化

这两个 Hooks 用于缓存计算结果或函数，避免不必要的重渲染。

- **`useMemo`**：返回一个**缓存的值**。
- **`useCallback`**：返回一个**缓存的函数**。

```tsx
// useMemo 示例：缓存昂贵的计算
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// useCallback 示例：防止传递给子组件的函数在重渲染时改变引用
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

---

## 5. useLayoutEffect：同步执行

`useLayoutEffect` 与 `useEffect` 结构相同，但它在 **所有的 DOM 变更之后、浏览器绘制之前** 同步触发。

### useEffect vs useLayoutEffect

| 特性 | useEffect | useLayoutEffect |
| :--- | :--- | :--- |
| **执行时机** | 浏览器完成布局和绘制**之后**（异步） | 浏览器渲染**之前**（同步） |
| **渲染影响** | 不阻塞 DOM 渲染，可能出现闪烁 | **阻塞 DOM 渲染**，防止闪烁 |
| **主要场景** | 大多数副作用（API、订阅） | DOM 尺寸测量、同步布局调整 |

### 实际案例：防止数值闪烁
如果你在 `useEffect` 中修改 DOM 位置，用户可能会看到元素先出现在位置 A，然后闪跳到位置 B。使用 `useLayoutEffect` 可以消除这种视觉不一致。

```tsx
import React, { useLayoutEffect, useState, useRef } from 'react';

function Tooltip() {
  const [position, setPosition] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // 在浏览器绘制前获取 DOM 尺寸并更新状态
    if (divRef.current) {
      const { width } = divRef.current.getBoundingClientRect();
      setPosition(width / 2);
    }
  }, []); // 仅在挂载时运行

  return <div ref={divRef} style={{ left: position }}>Tooltip</div>;
}
```

---

## 6. useContext：跨组件通信

`useContext` 让你能够订阅 React 的 Context 而不必嵌套 Consumer 容器。

```tsx
const ThemeContext = React.createContext('light');

function Display() {
  const theme = useContext(ThemeContext);
  return <div>当前主题: {theme}</div>;
}
```

---

## 总结：如何选择 Hook？

1. **基本状态**用 `useState`。
2. **大多数副作用**（请求数据、修改 Document 标题）用 `useEffect`。
3. **需要操作 DOM** 用 `useRef`。
4. **性能瓶颈**时考虑 `useMemo` 或 `useCallback`。
5. **修改 DOM 布局且需要防闪烁**用 `useLayoutEffect`。
6. **逻辑非常复杂的状态管理**可以考虑 `useReducer`。



## 为什么 Hooks 不能在循环、条件或嵌套函数中调用？

这是 React 的核心渲染机制决定的。React 并不像我们想象中那样通过“变量名”来记住 Hook 的状态，而是通过 **调用顺序**。

### 1. 底层原理：链表结构
在 React 内部，每个组件实例都有一个索引，用于记录当前正在执行哪个 Hook。所有的 Hooks 状态都被存储在一个简单的**链表**（Linked List）中。

- 第一次渲染时，React 按照代码编写的顺序依次创建链表节点。
- 第二次（及以后）渲染时，React 会按顺序“对号入座”，取出上一次渲染保存的状态。

### 2. 如果顺序被打乱会发生什么？
假设你将 Hook 放在了条件判断中：

```tsx
function MyComponent() {
  const [name, setName] = useState('Alice');

  // ❌ 错误做法：放在条件语句中
  if (name !== '') {
    useEffect(() => {
      console.log('执行副作用');
    }, []);
  }

  const [count, setCount] = useState(0);
  // ...
}
```

**后果分析：**
1. **渲染 1 (name != '')**：Hook 顺序为 `useState(name)` -> `useEffect` -> `useState(count)`。
2. **重渲染 (name == '')**：条件不满足，`useEffect` 被跳过。此时 React 依然按照旧顺序去链表里找第二个 Hook。
3. **结果**：React 会把原本属于 `useEffect` 的数据（或者位次）错误地分配给 `useState(count)`。

这会导致后续所有 Hook 的状态发生偏移，产生难以调试的 Bug。

### 3. 如何解决？
如果你需要有条件地执行副作用，请将判断逻辑写在 **Hook 内部**：

```tsx
useEffect(() => {
  // ✅ 正确做法：在 Hook 内部进行条件判断
  if (name !== '') {
    console.log('执行副作用');
  }
}, [name]);
```

Hooks 的调用顺序必须在每次渲染中保持绝对一致，这样 React 才能正确地将状态与对应的 Hook 关联。

一个组件中的 hook 会以链表的形式串起来， FiberNode 的 memoizedState 中保存了 Hooks 链表中的第一个 Hook。

在更新时，会复用之前的 Hook，如果通过了条件或循环语句，增加或者删除 hooks，在复用 hooks 过程中，会产生复用 hooks状态和当前 hooks 不一致的问题。