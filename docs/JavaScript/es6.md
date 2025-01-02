## Es6

### 字面量的增强写法

```js
var name = "why"
var age = 18
var obj = {
  // 1.property shorthand(属性的简写)
  name,
  age,

  // 2.method shorthand(方法的简写)
  foo: function() {
    console.log(this)
  },
  bar() {
    console.log(this)
  },
  baz: () => {
    console.log(this)
  },

  // 3.computed property name(计算属性名)
  [name + 123]: 'hehehehe'
}
```

### 解构

#### 数组解构

遍历数组，将数组中的元素赋值给相应的变量。

```js
// 对数组的解构: []
var [item1, item2, item3] = names
console.log(item1, item2, item3)

// 解构后面的元素
var [, , itemz] = names
console.log(itemz)

// 解构出一个元素,后面的元素放到一个新数组中
var [itemx, ...newNames] = names
console.log(itemx, newNames)

// 解构的默认值
var [itema, itemb, itemc, itemd = "aaa"] = names
console.log(itemd)
```

#### 对象解构

利用键进行解构，与解构的顺序无关

```js
var obj = {
  name: "why",
  age: 18,
  height: 1.88
}

// 对象的解构: {}
var { name, age, height } = obj
//修改变量名
var { name: newName } = obj
//设置默认值
var { address: newAddress = "广州市" } = obj
```

### let/const

1. const本质上是传递的值不可以修改，但是如果传递的是一个引用类型(内存地址), 可以通过引用找到对应的对象, 去修改对象内部的属性, 这个是可以的
2. 通过let/const定义的变量名是不可以重复定义
3. 有作用域提升，但是会出现暂时性死区。
4. 全局作用域中，var定义的变量会被添加都window对象上，但const/let定义的变量不会添加都window上

#### 块级作用

{ }形成一个块级作用域

注意：不同的浏览器有不同实现的(大部分浏览器为了兼容以前的代码, 让function是没有块级作用域)  

块级作用域外面可以访问当demo()函数

```js
{
    let foo = "why"

    function demo() {
        console.log("demo function")
    }
    class Person {}
}

demo();
```

#### 应用场景

在循环中使用let，那么循环就会为每个循环创建独立的变量，从而让每个点击处理程序都能引用特定的索引。

```js
//使用let定义i,i会产生块级作用域，在点击button时,会调用函数在上层块级作用域中找到相应的i的值，因此可以正确的找到i
//但是var定义的i,因为没有块级作用域，当btn被点击时，回调函数向上级作用域中查找i,因为没有块级作用域，所以上层作为域为全局作用域，但是此时全局作用域中的i已经被循环执行变为了2,所以不管点击哪一个button都是打印i的值为btns.length-1。

for (let i = 0; i < btns.length; i++) {
  btns[i].onclick = function() {
    console.log("第" + i + "个按钮被点击")
  }
}


//这样会出错,打印的都是length的值,因为这样使用的外层作用域中的i
let i;
for (i = 0; i < btns.length; i++) {
    btns[i].onclick = function () {
        console.log("第" + i + "个按钮被点击");
    };
}
```

### 模板字符串

模板字符串可以保存字符串的书写格式，比普通的字符串更美观。可以通过${}给模板字符串传递定义的变量。

```js
let name = 'wang';
let age = 12
let allName = `${name}wu`;
console.log(allName);//wangwu

function foo() {
    return 'foo is a function'
}
console.log(`my function a ${foo()}`);//my function a foo is a function


//通过模板字符串调用函数
//第一个是被分割的模板字符数组，之后的参数为模板字符串中的变量
function baz(arg1, name, age) {
    console.log(arg1, name, age);//[ 'hel', 'low', 'ord' ] wang 12
}

// baz('fewaf', 'feafe');
baz `hel${name}low${age}ord`;
```

### 函数的默认参数

```js
//参数默认值
function fn(name = 'lisi', age = 20) {
    console.log(name, age);
}
```

对象参数默认值

```js
//方式一
function baz({ name, age } = { name: 'eee', age: 14 }) {
    console.log(name, age);
}
//方式二
function foo({ name = 'serf', age = 15 } = {}) {
    console.log(name, age);
}
```



### 箭头函数

格式：（）=> { }

特点：

1. 箭头函数不能使用arguments，super，new.target，也不能用做构造函数。
1. 没有prototype属性
2. this的指向由父级作用域决定。
3. 箭头函数是没有显式原型的，所以不能作为构造函数，使用new来创建对象；

#### 简写格式

1. 当只有一个参数时，小括号可以省略。
2. 当执行代码只有一句时，可以省略大括号，并且会将这一句代码的返回值作为函数的返回值
3. 当只有一句代码，并且返回的是一个对象是，可以省略return 但是需要在对象外面1加一个小括号，表示把大括号中的内容作为一个对象来解析。`let b = () => ({ name: 'efa', age: 123 })`

### 展开语法

展开语法是一种浅拷贝

```js
const names = ["abc", "cba", "nba"]
const name = "why"
const info = {name: "why", age: 18}

// 1.函数调用时
function foo(x, y, z) {
  console.log(x, y, z)
}

// foo.apply(null, names)
foo(...names)
foo(...name)

// 2.构造数组时
const newNames = [...names, ...name]
console.log(newNames)

// 3.构建对象字面量时ES2018(ES9)
const obj = { ...info, address: "广州市", ...names }
console.log(obj)
```

### Set

size：返回Set中元素的个数；

------

 Set常用的方法：

add(value)：添加某个元素，返回Set对象本身；

delete(value)：从set中删除和这个值相等的元素，返回boolean类型；

has(value)：判断set中是否存在某个元素，返回boolean类型；

clear()：清空set中所有的元素，没有返回值；

forEach(callback, [, thisArg])：通过forEach遍历set； 

------

 另外Set是支持for of的遍历的。



Set中的元素不可以重复，所有通常用于数组去重。

```js
//数组去重
var arr = [1, 5, 7, 3, 2, 1, 5];
var set = new Set(arr);
//将set转为数组
var arr1 = [...set];
var arr2 = Array.from(set);
```

### weakSet

和Set类似的另外一个数据结构称之为WeakSet，也是内部元素不能重复的数据结构

和Set的区别：

1. WeakSet中只能存放对象类型，不能存放基本数据类型；
2. WeakSet对元素的引用是弱引用，如果没有其他引用对某个对象进行引用，那么GC可以对该对象进行回收；

##### 常用方法：

add(value)：添加某个元素，返回WeakSet对象本身；

delete(value)：从WeakSet中删除和这个值相等的元素，返回boolean类型；

 has(value)：判断WeakSet中是否存在某个元素，返回boolean类型

##### 使用场景

使用较少，没有明确的使用场景

```js
const personSet = new WeakSet()
class Person {
    constructor() {
        personSet.add(this)
    }

    running() {
        if (!personSet.has(this)) { //this为调用running方法对象
            throw new Error("不能通过非构造方法创建出来的对象调用running方法")
        }
        console.log("running~", this)
    }
}

let p = new Person();

p.running()

p.running.call({ name: "why" })
```

### Map

Map用于存储映射关系

***和对象存储的区别：***

1. 事实上我们对象存储映射关系只能用字符串（ES6新增了Symbol）作为属性名（key）；

2. 某些情况下我们可能希望通过其他类型作为key，比如对象，这个时候会自动将对象转成字符串来作为key；

##### Map的常用方法

Map常见的属性：size：返回Map中元素的个数；

 ***Map常见的方法：***

set(key, value)：在Map中添加key、value，并且返回整个Map对象；

get(key)：根据key获取Map中的value； 

has(key)：判断是否包括某一个key，返回Boolean类型；

delete(key)：根据key删除一个键值对，返回Boolean类型；

clear()：清空所有的元素；

***遍历方法：***

forEach(callback, [, thisArg])：通过forEach遍历Map； 

 Map也可以通过for of进行遍历

### weakMap

weakMap的key只能用对象类型，weakMap不可以遍历，因为key是弱引用类型。

和Map的区别：

 区别一：WeakMap的key只能使用对象，不接受其他的类型作为key； 

 区别二：WeakMap的key对对象的引用是弱引用，如果没有其他引用引用这个对象，那么GC可以回收该对象；



*常用的四个方法：*

set(key, value)：在Map中添加key、value，并且返回整个Map对象；

get(key)：根据key获取Map中的value； 

 has(key)：判断是否包括某一个key，返回Boolean类型；

 delete(key)：根据key删除一个键值对，返回Boolean类型；

##### 应用场景

vue响应式

### class类

