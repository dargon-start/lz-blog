### vue3源码

vue3优化：

优化一：vue3使用monorepo管理代码

优化二：引入了tree-shaking 

### 组件渲染

![image-20220429094826926](images/image-20220429094826926.png)



### reactive()和ref()是实现的区别

reactive()是通过Proxy来实现的。

ref() 是通过class中的set,get来实现的。

如果是一个对象，会使用reactive()代理这个对象。

ref包裹整个对象。

```js
 constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }
```

