# Redux

Redux 状态更新流程可以概括为一个**单向数据流 (one-way data flow)**，主要分为 **5 个关键步骤**：

---

## 🧭 一图概览

```
UI 组件 -> dispatch(action) -> reducer -> new state -> store 通知订阅者 -> UI 重新渲染
```

---

## 💡 流程详细说明

### ① 用户触发 Action

当用户在界面上执行操作（比如点击按钮、输入文本等），
组件通过 `dispatch()` 方法发送一个 **action 对象**：

```js
dispatch({ type: 'INCREMENT' })
```

Action 是一个普通的 JavaScript 对象，至少包含一个 `type` 属性，用来描述发生了什么。

---

### ② Store 接收到 Action

Redux 的 **store** 是应用状态的唯一来源。
当调用 `store.dispatch(action)` 时，store 会把这个 action 交给 **reducer** 来处理。

---

### ③ Reducer 处理状态更新

Reducer 是一个**纯函数**，根据当前 `state` 和传入的 `action`，返回一个新的状态：

```js
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    default:
      return state
  }
}
```

> ⚠️ 重要：Reducer **不能直接修改原 state**，必须返回一个新对象（不可变性原则）。

---

### ④ Store 更新并保存新状态

Reducer 返回的新 state 会替换掉旧 state，
Redux 内部会存储这个新状态，并触发通知。

---

### ⑤ 订阅者 (UI 层) 被通知

所有通过 `store.subscribe()` 注册的监听函数（例如 React 组件中的 `useSelector`）
都会被调用，从 store 获取最新的 state，然后触发 **UI 重新渲染**。

例如，在 React 中：

```jsx
const count = useSelector(state => state.count)
```

当 store 的状态改变时，这个组件会自动重新渲染以反映最新数据。

---

## 🧩 可视化理解

```
用户操作
   ↓
dispatch(action)
   ↓
reducer(state, action)
   ↓
返回新 state
   ↓
store 更新
   ↓
UI 重新渲染
```



## redux 创建reducer

```js
// store.js
import { createStore } from 'redux'

// 1. 定义初始状态
const initialState = {
  count: 0
}

// 2. 定义 reducer (纯函数)
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    default:
      return state
  }
}

// 3. 创建 store
const store = createStore(counterReducer)

// 导出 store
export default store

```

## redux-tooltik 创建reducer

### 🚀 createAsyncThunk

`createAsyncThunk` 是 Redux Toolkit 提供的一个用于处理异步逻辑的工具。它能够自动生成代表异步请求生命周期的 **Action Types**，并根据 Promise 的状态触发相应的 Action。

#### 1. 基本语法
```js
const actionCreator = createAsyncThunk(typePrefix, payloadCreator)
```
- **`typePrefix`**: 字符串，用于生成 Action 类型的标识符（如 `home/fetchHomeData`）。生成的三个类型的 Action 分别是：
    - `typePrefix/pending`: 请求开始。
    - `typePrefix/fulfilled`: 请求成功（Promise 已解决）。
    - `typePrefix/rejected`: 请求失败（Promise 已拒绝）。
- **`payloadCreator`**: 异步回调函数，返回一个 Promise（或使用 `async/await`）。它接收两个参数：
    - `arg`: 调用该 action 时传递的参数（payload）。
    - `thunkAPI`: 一个包含 `dispatch`, `getState`, `rejectWithValue` 等工具的对象。

#### 2. 处理异步数据的两种方式

1.  **直接在 Payload Creator 中 dispatch (如本例)**：在回调函数中手动调用其他 action 来更新状态。适用于一个请求需要触发布局多个 reducer 的场景。
2.  **通过 `extraReducers` (官方推荐)**：在 `createSlice` 中使用 `extraReducers` 监听生成的 `pending/fulfilled/rejected` 状态。这种方式更加清晰，逻辑更内聚。

```js


import { createSlice , createAsyncThunk } from '@reduxjs/toolkit'
import { getDiscount, getGoodPrice, getHighScore, getHomeHotRecommendData, getHomeLongforData } from '@/services/modules/home';




export const fetchHomeData = createAsyncThunk('goodPriceData', (payload,{dispatch,getState})=>{
     getGoodPrice().then(res=>{
        dispatch(goodPriceAction(res))
     })
     getHighScore().then(res=>{
        dispatch(highscoreAction(res))
     })
     getDiscount().then(res=>{
        dispatch(discountAction(res))
     })
     getHomeHotRecommendData().then(res=>{
        dispatch(HotRecommendAction(res))
     })
     getHomeLongforData().then(res=>{
        console.log(res);
        dispatch(longForAction(res))
     })
})

const homeSlice = createSlice({
  name: "home",
  initialState: {
    goodPrice:{},
    highScore:{},
    disCount:{},
    hotRecommend:{},
    longFor:{}
  },
  reducers: {
    goodPriceAction(state,{payload}){
        state.goodPrice = payload
    },
    highscoreAction(state,{payload}){
        state.highScore = payload
    },
    discountAction(state,{payload}){
        state.disCount = payload
    },
    HotRecommendAction(state,{payload}){
      state.hotRecommend = payload
    },
    longForAction(state,{payload}){
      state.longFor = payload
    }
  },
})
export const {goodPriceAction,highscoreAction,discountAction,HotRecommendAction,longForAction} = homeSlice.actions

export default homeSlice.reducer

```

## 案例

https://github.com/altence/lightence-ant-design-react-template/blob/main/src/store/slices/authSlice.ts

https://github.com/dargon-start/lz-airbnd/tree/main/src/store
