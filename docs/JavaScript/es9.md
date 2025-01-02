##  es9

### **Async iterators**



### **Object spread operators**

扩展运算符，可以通过...来遍历对象

### Promise finally

es9新增方法，Promise对象无论变成fulfilled还是reject状态，最终都会被执行的代码

finally方法是不接收参数的，因为无论前面是fulfilled状态，还是reject状态，它都会执行。

### 正则表达式（命名捕获组）

```js
const text = "2018-03-14";
// const re = /(?<y>\d+)-(?<m>\d+)-(?<d>\d+)/;
const re = /(\d+)-(\d+)-(\d+)/;

console.log(re.exec(text));
//[2018-03-14', '2018', '03', '14']
```

将捕获组与有效 JavaScript 标识符关联

```js
const text = "2018-03-14";
const re = /(?<y>\d+)-(?<m>\d+)-(?<d>\d+)/;

console.log(re.exec(text).groups);
//{y: '2018', m: '03', d: '14'}
```

