## Proxy和Reflect

Proxy是es6中新增的代理对象，通过Proxy，我们可以监听对象的变化，实现响应式。

Reflect也是ES6新增的一个API，它是**一个对象**，字面的意思是**反射**。用于替换在Object构造函数上实现的一些方法，es6之后用Reflect会更加规范。



**捕获器不变式：**如果目标对象有一个不可写的数据属性，那么在捕获器返回一个与该属性不同的值时，会抛出TypeError。

可撤销代理：Proxy.Revocable(target,heandler);  定义可撤销的代理。

通过revoke()函数撤销

```js
const obj = {
    name: "fewa",
};
const {proxy, revoke} = Proxy.revocable(obj, {
    get(target, key) {
        console.log("fe");
        return Reflect.get(target, key);
    },
});
console.log(proxy.name); //fewa
revoke();
console.log(proxy.name); //Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked
```

代理中this的问题：如果目标对象依赖于对象标识，那this可能会出错。

```js
const wm = new WeakMap();
class User {
    constructor(userId) {
        wm.set(this, userId);
    }
    set id(userId) {
        wm.set(this, userId);
    }
    get id() {
        return wm.get(this);
    }
}

const user = new User(2);

console.log(user.id); //2
const proxy = new Proxy(User, {}); //User类
//const userProxy =  new Proxy(user,{}) //代理实例时，由于this指向代理对象，但是vm中找不到代理对象，因此userProxy.id会打印undefined
const userProxy = new proxy(2);
console.log(userProxy.id); //2
```

不能代理Date对象，因为Date类型方法的执行依赖this值上的内部槽位[[NumberDate]]

```js
const target = new Date();
const proxy = new Proxy(target, {});
console.log(proxy instanceof Date);
proxy.getDate();// TypeError: this is not a Date object.
```

Proxy和Relect的基本使用：

```js
 let obj = {
        name: "wag",
        age: 12,
      };

let objpro = new Proxy(obj, {
    //target为被被代理的obj对象，receiver为objpro代理对象
    set(target, key, value, receiver) {
        Reflect.set(target, key, value, receiver);
    },
    get(target, key, receiver) {
        return Reflect.get(target, key, receiver);
    },
    has(target, key) {
        return Reflect.has(target, key);
    },
    deleteProperty(target, key) {
        Reflect.deleteProperty(target, key);
    },
});
```

#### 参数receiver的作用

receiver实际上是代理对象，当我们在Reflect的set() 和get()方法中传入receiver是，可以改变别代理对象obj中的this指向，让this指向objpro代理对象。从而实现访问objpro的_name，实现私有属性的监听。

```js
const obj = {
    _name: "wang",
    set name(value) {
        //this指向obj
        this._name = value;
    },
    get name() {
        //this指向obj
        return this._name;
    },
};

const objpro = new Proxy(obj, {
    set(target, key, value, receiver) {
        console.log("----set");
        Reflect.set(target, key, value,receiver);
    },
    get(target, key, receiver) {
        console.log("----get");
        return Reflect.get(target, key,receiver);
    },
});
//没有传入receiver时，我们只能监听到name属性的访问和修改，监听不到_name
//传入receiver后，都可以监听到
console.log(objpro.name);
objpro.name = "sisi";
```

#### Reflect.constructor()

创建一个对象，可以指定对象的类型。

```js
function student(name) {
    this.name = name;
}

function Animal() {}

const stu = Reflect.construct(student, ["name"], Animal);
console.log(stu); //原型指向Animal
```

### 响应式

#### vue3响应式

```js
//正在执行的函数
let reactiveFn = null;
//封装Depend类，
class Depend {
    constructor() {
        //使用Set()，防止一个函数多次使用同一个key,
        //导致多次添加此函数到数组中,因此使用set可以防止重复
        this.reactiveFns = new Set();
    };
    // addFns(fn) {
    //     this.reactiveFns.push(fn);
    // };
    //不用传递参数，直接调用方法，就可以传入响应函数
    depend() {
        if (reactiveFn) {
            this.reactiveFns.add(reactiveFn);
        }
    }
    notify() {
        this.reactiveFns.forEach(fn => {
            fn();
        });
    }
}

//监听响应式函数
function WatchFns(fn) {
    //添加需要监听的函数
    reactiveFn = fn;
    fn();
    reactiveFn = null;
}

//封装获取depend的函数
const targetMap = new WeakMap();

function getDepend(target, key) {
    //从weakMap中通过target来获取Map对象
    let map = targetMap.get(target);
    if (!map) {
        map = new Map();
        targetMap.set(target, map);
    }

    //从Map中通过key来获取depend
    let depend = map.get(key);
    if (!depend) {
        depend = new Depend();
        map.set(key, depend);
    }
    return depend;
}

//封装创建代理对象函数
function newProxy(obj) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            // console.log('get-----', target, key);
            //收集使用对象属性的函数（需要响应的函数）
            const dep = getDepend(target, key);
            dep.depend();
            return Reflect.get(target, key, receiver);
        },
        set(target, key, newValue, receiver) {
            // console.log('set-----', target, key);
            Reflect.set(target, key, newValue, receiver);
            let depend = getDepend(target, key);
            //执行需要响应的函数
            depend.notify();
        }
    });
}

let obj = {
    name: 'wag',
    age: 15
}

let info = {
    name: 'kkk',
    age: 19,
    address: '北京市'
}

let objproxy = newProxy(obj);
let infoproxy = newProxy(info);

WatchFns(function() {
    console.log(objproxy.name + '-----name1');
})

WatchFns(function() {
    console.log(objproxy.name + '-----name2');
    console.log(objproxy.name + '-----name2');
})
WatchFns(function() {
    console.log(objproxy.age + '-----age1');
})

WatchFns(function() {
    console.log(infoproxy.age + '-----info-age');
})


objproxy.age = 45;
infoproxy.age = 78
```

#### vue2响应式

```js
// 保存当前需要收集的响应式函数
let activeReactiveFn = null

/**
 * Depend优化:
 *  1> depend方法
 *  2> 使用Set来保存依赖函数, 而不是数组[]
 */

class Depend {
    constructor() {
        this.reactiveFns = new Set()
    }


    depend() {
        if (activeReactiveFn) {
            this.reactiveFns.add(activeReactiveFn)
        }
    }

    notify() {
        this.reactiveFns.forEach(fn => {
            fn()
        })
    }
}

// 封装一个响应式的函数
function watchFn(fn) {
    activeReactiveFn = fn
    fn()
    activeReactiveFn = null
}

// 封装一个获取depend函数
const targetMap = new WeakMap()

function getDepend(target, key) {
    // 根据target对象获取map的过程
    let map = targetMap.get(target)
    if (!map) {
        map = new Map()
        targetMap.set(target, map)
    }

    // 根据key获取depend对象
    let depend = map.get(key)
    if (!depend) {
        depend = new Depend()
        map.set(key, depend)
    }
    return depend
}

function reactive(obj) {
    // {name: "why", age: 18}
    // ES6之前, 使用Object.defineProperty
    Object.keys(obj).forEach(key => {
        let value = obj[key]
        Object.defineProperty(obj, key, {
            get: function() {
                const depend = getDepend(obj, key)
                depend.depend()
                return value
            },
            set: function(newValue) {
                value = newValue
                const depend = getDepend(obj, key)
                depend.notify()
            }
        })
    })
    return obj
}

// 监听对象的属性变量: Proxy(vue3)/Object.defineProperty(vue2)
const objProxy = reactive({
    name: "why", // depend对象
    age: 18 // depend对象
})

const infoProxy = reactive({
    address: "广州市",
    height: 1.88
})

watchFn(() => {
    console.log(infoProxy.address)
})

infoProxy.address = "北京市"

const foo = reactive({
    name: "foo"
})

watchFn(() => {
    console.log(foo.name)
})

foo.name = "bar"
```

响应式原理图解析：

Denpend类中的set用于保存每一个对象的每一个属性需要相应的函数，通过weakMap来引用Obj对象（防止obj对象无法销毁），Map中保存key和相应Depnend的依赖关系。这样可以实现每一个Depend中只存放属于一个key的响应函数。


