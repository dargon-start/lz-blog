# es7

### Array新增includes方法

includes( ) 从头匹配是否存在相应元素，参数一为要匹配的元素，参数二为从当前下标开始 ，返回布尔值

includes可以判断数组中是否存在NaN，indexOf( )方法无法判断是否存在NaN.

### 新增指数乘方运算符（**）

es7之前需要通过Math.pow( )方法来表示乘方

es7中新增了**，可以来表示乘方

```js
var a = 2;
console.log(Math.pow(a, 4));
console.log(a ** 4);
```

