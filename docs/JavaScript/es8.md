## es8

### Object.values()

Object.values 来获取对象所有的value值，返回一个数组

### Object.entries()

将对象转为entries类型（[ [ 'name', 'isil' ], [ 'age', 23 ] ]），通过数组来保存键值对

### **String Padding**

padStart 和padEnd 分别在字符串开头或者末尾添加字符

```js
let str = 'hello world'
let newStr = str.padStart(15, '*');//在字符串开头以*号填充字符串长到15
let newStr1 = str.padEnd(15, '*');//在字符串末尾以*号填充字符串长到15
```

### **Trailing Commas**

在ES8中，我们允许在函数定义和调用时多加一个逗号：

```js
function foo(a, b, ) {
    console.log(a, b);
}
foo(1, 2, );
```

### **Object Descriptors**

ES8中增加了另一个对对象的操作是 Object.getOwnPropertyDescriptors ，获取对象所有的属性的属性描述符。

```js
var obj = {
    name: 'isil',
    age: 23
}
console.log(Object.getOwnPropertyDescriptors(obj));
```

