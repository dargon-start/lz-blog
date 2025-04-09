# This

### 全局指向

在浏览器中，this指向window

在node环境中  ， this指向{}（空对象）

### 函数内this的指向

1. this的绑定和定义的位置（编写的位置）没有关系；
2. this的绑定和调用方式以及调用的位置有关系；

#### 规则一：默认绑定

独立的函数调用我们可以理解成函数没有被绑定到某个对象上进行调用；

例：foo1是独立调用函数，因此两个this都是指向window对象

```js
function foo() {
    console.log(this);
}

function foo1() {
    console.log(this);
    foo()
}
foo1();
```

#### 规则二：隐式绑定

隐式绑定就是它的调用位置中，是通过某个对象发起的函数调用

```js

function foo1() {
    console.log(this);

}
var obj = {
    name: 'wang',
    foo: foo1
}

obj.foo()  //this指向obj
```

#### 规则三：显示绑定

通过call,apply,bind 方法进行this的绑定

call方法和aplly方法的作用相同，只是传递参数的方式不同，第一个参数都是规定this的指向、

apply()是通过数组的方式传递参数

call( ) 是通过逗号的方式传递参数

bind( )是可以绑定this后返回一个函数，然后再调用此函数，this始终指向的是bind绑定的this。    		bind可以预设传入的参数，也可以在调用bind返回的函数时传入新的参数，传入的参数会和预设的参数合并，如果参数够了，那么预设参数的优先级高。

==注意==：如果在显示绑定中，我们传入一个null或者undefined，那么这个显示绑定会被忽略，使用默认规则（this->window）

严格模式下：传入null或undefined，this就指向null或undefined

```js
function foo(name, age) {
    console.log(this + name + age);
}

foo.apply('a：', ['王', 12]);//a：王12

foo.call('b:', '里', 19); //b:里19

var bindFoo = foo.bind('abc', 'one+');
bindFoo(14); //abcone+14

//bind绑定
var obj = {
        name: "feawf",
      };
      function foo(a, b) {
        console.log(this);
        console.log(a, b);//20,20
      }

const fn = foo.bind(obj, 20, 20);
fn(30);
```

错误提示：bind()绑定后，this就不会改变了。

```js
let obj = {
    name: "wang",
    say() {
    console.log(this.name);
    },
};

let say = obj.say;
let obj2 = {
    name: "two",	
};

let res = say.bind(obj2).call(obj); //wang
```

#### 规则四：new绑定

1. 创建一个全新的对象；

2. 这个新对象会被执行prototype连接；

3. this指向创建的新对象（this的绑定在这个步骤完成）；

4. 如果函数没有返回其他对象，表达式会返回这个新对象；

例：new关键字创建新的对象，this绑定new创建的对象。

第一次绑定的是`{name:'王哥‘ ，age:12}`

第二次绑定的是`{name:'li'，age:45}`

```js
function Person(name, age) {
    console.log(this);
    this.name = name;
    this.age = age;
}

var p = new Person('王哥', 12); 
var p1 = new Person('li', 45);
```

### 内置函数this绑定

1. setTimeout , setInterval 函数中的this都是指向window
2. 事件的回调函数中，this指向发生事件的元素
3. forEach/map/filter/find等高阶函数中默认this绑定window，函数可以传入第二个参数，指定this绑定哪个对象

```js
//1.setTimeout函数
setTimeout(function() {
   console.log(this) // window
}, 2000)
//事件
const boxDiv = document.querySelector('.box')
boxDiv.onclick = function() {
    console.log(this) //  <div class="box"></div>
}
boxDiv.addEventListener('click', function() {
    console.log(this)//  <div class="box"></div>
})

//3.高阶函数
var names = ["abc", "cba", "nba"]
names.forEach(function(item) {
    console.log( this) //window
})
names.map(function(item) {
    console.log(this) 
    /*   严格模式下，this绑定不会默认转成对象
    
    	非严格模式下
    	{
            0:'c',
            1:'b',
            2:'a'
    	}
    	
    	严格模式下
    	'cab'
    */
}, "cba")
```

### 绑定规则的优先级

1. **默认规则的优先级最低**
2. **显示绑定优先级高于隐式绑定**
3. **new绑定优先级高于隐式绑定**
4. **new绑定优先级高于bind**

```js
var obj = {
    name: "obj",
    foo: function() {
        console.log(this)
    }
}
obj.foo.apply('ab'); //ab
obj.foo.call('ab');//ab
//bind
function foo() {
    console.log(this)
}

var obj = {
    name: "obj",
    foo: foo.bind("aaa")
}

obj.foo() //aaa

// new的优先级高于隐式绑定
var obj = {
  name: "obj",
  foo: function() {
    console.log(this)
  }
}
var f = new obj.foo()  //foo{}

// 结论: new关键字不能和apply/call一起来使用
// new的优先级高于bind
function foo() {
    console.log(this)
}

var bar = foo.bind("aaa")

var obj = new bar()  //foo
```

### 间接函数引用

相当于间接的引用了foo函数，是直接调用函数，所以为默认绑定（window）

```js
var obj1 = {
  name: "obj1",
  foo: function() {
    console.log(this)
  }
}

var obj2 = {
  name: "obj2"
};

 obj2.bar = obj1.foo
 obj2.bar()  //obj2 
 //因为赋值表达式的值是函数本身，this值不再与任何对象绑定。
(obj2.bar = obj1.foo)() //window
```

### this在箭头函数中的指向

在箭头函数中，this是不使用函数的四个绑定规则的，而是根据外层作用域来决定this的。

```js
//目的是将获取到的数据添加到obj的result中，通过function的方式，需要提前声明一个变量_this=this,然后在settimeout中_this指向就是obj,因为foo是通过obj隐式绑定了this指向obj的。
//如果使用箭头函数，则不需要提前指定_this,因为箭头函数中的this会在外城作用域中寻找this的指向。
let obj = {
    name: 'wang',
    result: [],
    foo: function() {
        // let _this = this;
        // setTimeout(function() {
        //     let resutls = [1, 2, 3, 4, 5, 6];
        //     _this.result = resutls;
        // }, 200);
        setTimeout(() => {
            let resutls = [1, 2, 3, 4, 5, 6];
            this.result = resutls;
        })
    }
}
obj.foo();
```

### 面试题

##### 1.

```js
var name = "window";

var person = {
    name: "person",
    sayName: function() {
        console.log(this.name);
    }
};

function sayName() {
    var sss = person.sayName;
    sss(); // window: 独立函数调用
    person.sayName(); // person: 隐式调用
    (person.sayName)(); // person: 隐式调用
    (b = person.sayName)(); // window: 赋值表达式(独立函数调用)
}

sayName();
```

##### 2，

```js
var name = 'window'

var person1 = {
    name: 'person1',
    foo1: function() {
        console.log(this.name)
    },
    foo2: () => console.log(this.name),
    foo3: function() {
        return function() {
            console.log(this.name)
        }
    },
    foo4: function() {
        return () => {
            console.log(this.name)
        }
    }
}

var person2 = { name: 'person2' }

person1.foo1(); // person1(隐式绑定)
person1.foo1.call(person2); // person2(显示绑定优先级大于隐式绑定)

person1.foo2(); // window(不绑定作用域,上层作用域是全局)
person1.foo2.call(person2); // window

person1.foo3()(); // window(独立函数调用)
person1.foo3.call(person2)(); // window(独立函数调用)
person1.foo3().call(person2); // person2(最终调用返回函数时, 使用的是显示绑定)

person1.foo4()(); // person1(箭头函数不绑定this, 上层作用域this是person1)
person1.foo4.call(person2)(); // person2(上层作用域被显示的绑定了一个person2)
person1.foo4().call(person2); // person1(上层找到person1)
```

##### 3.

```js
var name = 'window'

function Person (name) {
  this.name = name
  this.foo1 = function () {
    console.log(this.name)
  },
  this.foo2 = () => console.log(this.name),
  this.foo3 = function () {
    return function () {
      console.log(this.name)
    }
  },
  this.foo4 = function () {
    return () => {
      console.log(this.name)
    }
  }
}

var person1 = new Person('person1')
var person2 = new Person('person2')

person1.foo1() // person1
person1.foo1.call(person2) // person2(显示高于隐式绑定)

person1.foo2() // person1 (上层作用域中的this是person1)
person1.foo2.call(person2) // person1 (上层作用域中的this是person1)

person1.foo3()() // window(独立函数调用)
person1.foo3.call(person2)() // window
person1.foo3().call(person2) // person2

person1.foo4()() // person1
person1.foo4.call(person2)() // person2
person1.foo4().call(person2) // person1


var obj = {
  name: "obj",
  foo: function() {

  }
}
```

##### 4.

```js
var name = 'window'

function Person (name) {
  this.name = name
  this.obj = {
    name: 'obj',
    foo1: function () {
      return function () {
        console.log(this.name)
      }
    },
    foo2: function () {
      return () => {
        console.log(this.name)
      }
    }
  }
}

var person1 = new Person('person1')
var person2 = new Person('person2')

person1.obj.foo1()() // window
person1.obj.foo1.call(person2)() // window
person1.obj.foo1().call(person2) // person2

person1.obj.foo2()() // obj
person1.obj.foo2.call(person2)() // person2
person1.obj.foo2().call(person2) // obj


// 

// 上层作用域的理解
// var obj = {
//   name: "obj",
//   foo: function() {
//     // 上层作用域是全局
//   }
// }

// function Student() {
//   this.foo = function() {

//   }
// }


```

切记：function函数的this是在调用时确定的，而箭头函数的this是在定义决定。

但是箭头函数的this会根据上层作用域的this指向的改变而改变。
