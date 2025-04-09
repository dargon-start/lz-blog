# JSON和数据存储

JSON是一种轻量级的数据交换格式。

使用场景：

1. 网络数据的传输
2. 项目的配置文件
3. 非关系型数据库（NoSQL）将json作为存储格式。

### json顶层的数据类型

1. 简单值：Number ,string（必须是双引号），Boolean ，null
2. 对象：key和value，key必须是字符串，必须是双引号包裹，value可以是简单值，对象值，数组值
3. 数组值：数组值中可以是简单值，对象值，数组值

### JSON序列化

因为有时我们需要JSON格式的字符串，所以我们需要有转换方法，来实现格式的转化。



`JSON.stringifg()` 方法可以将javascript的数据类型，转为json格式的数据。

传入三个参数：

1. 转换的对象

2. replacer  (过滤对象相应的键)
   1. replacer数组时，只会将数组中传入的key进行转化
   2. replacer函数时，可以对value的值进行处理后返回。
   
3. space ：表示每一级缩进的字符数，默认是空格，最大值为10，大于10会自动设置为10。

   也可以设置为其他字符，如tab或者--，最大的设置量也是10个。

```js
let obj = {
  name: "fea",
  age: 12,
  friend: {
    name: "litao",
    address: "北京市",
  },
};
//1.repalcer为数组
// let jsonString = JSON.stringify(obj, ["name", "age"]);
//2.repalcer为函数
let jsonString = JSON.stringify(
  obj,
  (key, value) => {
    if (key == "age") {
      return value + 1;
    }
    //除了key为age时进行处理，其他的还返回默认值
    return value;
  },
  4
  //或者使用 '--'
);

```



`JSON.parse（）` 将json格式的数据转为javascript的数据类型。例如讲一个json格式的字符串对象转为js中真正的对象。

传入的参数：

1. 需要转换的json对象
2. **reviver** 函数，用于在返回之前对处理返回的值。

```js
let parseStr = JSON.parse(getobj, (key, value) => {
  if (key === "age") {
    return value - 1;
  }
  return value;
});
```

 `toJSON()`:我们可以自定义要序列化的属性，可以在要序列化的对象上实现toJSON()方法，那么当我们使用JSON.stringfy()方法时，就会按toJSON()返回的对象进行处理。

```js
let obj = {
    name: "fea",
    age: 12,
    friend: {
        name: "litao",
        address: "北京市",
    },
    toJSON() {
        return {
            name: this.name,
            age: this.age,
        };
    },
};

let jsonString = JSON.stringify(
    obj,
    (key, value) => {
        if (key == "age") {
            return value + 1;
        }
        //除了key为age时进行处理，其他的还返回默认值
        return value;
    },
    4
    //或者使用 '--'
);
console.log(jsonString);
/*{
    "name": "fea",
    "age": 13
}*/

```

注意:toJSON()不能使用箭头函数。

#### JSON.stringfy()的执行步骤

1. 如果对象中有实现了toJSON()方法，则处理toJSON()方法返回的值。否则默认处理整个对象。
2. 如果传入了第二个参数，则对第一步返回的值进行过滤处理。
3. 对过滤后的值进行序列化。
4. 如果提供了第三个参数，则进行相应的缩进。

### Storage

WebStorage主要提供了一种机制，可以让浏览器提供一种比cookie更直观的key、value存储方式。

Storage类型提供了两个存储对象：

1. `sessionStorage`对象 ：只会存储回话数据
2. `loaclStorage` 对象 ：永久性的存储数据



`sessionStorage`和`loaclStorage` 的区别：

1. 关闭网页后重新打开，localStorage会保留，而sessionStorage会被删除
2. 在页面内跳转，localStorage和seesionStorage都会保留。
3. 跳转页面（打开新的页面后）localStorage会保留，而sessionStorage不会保留

#### 属性和方法

属性：

1. length：数据的个数
2. 通过Storage.key的方式添加数据

```js
//local为key的值，jsonString为value的值
  localStorage.local = jsonString;
```

方法：

`Storage.key()`：该方法接受一个数值n作为参数，返回存储中的第n个key名称； 

`Storage.getItem()`：该方法接受一个key作为参数，并且返回key对应的value； 

`Storage.setItem()`：该方法接受一个key和value，并且将会把key和value添加到存储中，														如果key存在，则更新其对应的值；

`Storage.removeItem()`：该方法接受一个key作为参数，并把该key从存储中删除； 

`Storage.clear()`：该方法的作用是清空存储中的所有key；

### 封装Storage

```js
class LzStorage {
  constructor(isLoacl = true) {
    //默认为localStorage
    this.storage = isLoacl ? localStorage : sessionStorage;
  }

  setItem(key, value) {
    if (value) {
      let jsonStr = JSON.stringify(value);
      this.storage.setItem(key, jsonStr);
    }
  }

  getItem(key) {
    let value = this.storage.getItem(key);
    if (value) {
      value = JSON.parse(value);
      return value;
    }
  }

  removeItem(key) {
    this.storage.removeItem(key);
  }

  key(index) {
    return this.storage.key(index);
  }

  clear() {
    this.storage.clear();
  }

  length() {
    return this.storage.length;
  }
}
```

### indexedDB

> 第一步：打开indexDB的某一个数据库；
>
>  通过indexDB.open(数据库名称, 数据库版本)方法；
>
>  如果数据库不存在，那么会创建这个数据；
>
>  如果数据库已经存在，那么会打开这个数据库；
>
>  第二步：通过监听回调得到数据库连接结果；
>
>  数据库的open方法会得到一个**IDBOpenDBRequest**类型
>
>  我们可以通过下面的三个回调来确定结果：
>
>  onerror：当数据库连接失败时；
>
>  onsuccess：当数据库连接成功时回调；
>
>  onupgradeneeded：当数据库的version发生变化并且高于之前版本时回调；
>
>  通常我们在这里会创建具体的存储对象：db.createObjectStore(存储对象名称, { keypath: 存储的主键 })
>
> 我们可以通过onsuccess回调的event获取到db对象：event.target.result
>
> 
>
> 我们对数据库的操作要通过事务对象来完成：
>
> 第一步：通过db获取对应存储的事务 db.transaction(存储名称, 可写操作)； 
>
> 第二步：通过事务获取对应的存储对象 transaction.objectStore(存储名称)； 
>
> 接下来我们就可以进行增删改查操作了：
>
> 新增数据 store.add
>
>  查询数据
>
>  方式一：store.get(key)
>
> 方式二：通过 store.openCursor 拿到游标对象
>
>  在request.onsuccess中获取cursor：event.target.result
>
> 获取对应的key：cursor.key； 
>
> 获取对应的value：cursor.value； 
>
> 可以通过cursor.continue来继续执行；
>
> 修改数据 cursor.update(value)
>
> 删除数据 cursor.delete()

```js
const dbRequest = indexedDB.open("index");
dbRequest.onerror = function (err) {
  console.log("打开数据库失败！");
};
let db = null;
dbRequest.onsuccess = function (event) {
  db = event.target.result;
};
//首次打开或者版本升级
dbRequest.onupgradeneeded = function (event) {
  const db = event.target.result;
  // 创建一些存储对象
  db.createObjectStore("users", {keyPath: "id"});
};

class User {
  constructor(id, name, age) {
    this.id = id;
    this.name = name;
    this.age = age;
  }
}

const users = [
  new User(100, "why", 18),
  new User(101, "kobe", 40),
  new User(102, "james", 30),
];

let btns = document.getElementsByTagName("button");
console.log(btns);
for (let i = 0; i < btns.length; i++) {
  btns[i].onclick = function () {
    //创建事务
    const transaction = db.transaction("users", "readwrite");
    //获取到表
    const store = transaction.objectStore("users");
    switch (i) {
      case 0:
        //添加
        for (const user of users) {
          const request = store.add(user);
          request.onsuccess = function () {
            console.log(user.name + "添加成功");
          };
        }
        console.log("点击了新增！");
        break;
      case 1:
        //查询方式一：主键查询
        // const res = store.get(101);
        // res.onsuccess = function (event) {
        //   console.log(event.target.result);
        // };
        //查询方式二：游标查询
        const request = store.openCursor();
        request.onsuccess = function (event) {
          //获取游标
          const cursor = event.target.result;
          //如果游标存在，游标进行位移
          if (cursor) {
            if (cursor.key === 101) {
              console.log(cursor.key, cursor.value);
            } else {
              cursor.continue();
            }
          } else {
            console.log("查询完成");
          }
        };
        break;
      case 2:
        //删除
        const requestD = store.openCursor();
        requestD.onsuccess = function (event) {
          //获取游标
          const cursor = event.target.result;
          //如果游标存在，游标进行位移
          if (cursor) {
            if (cursor.key === 101) {
              cursor.delete();
            } else {
              cursor.continue();
            }
          } else {
            console.log("查询完成");
          }
        };
        break;
      case 3:
        //修改
        const requestU = store.openCursor();
        requestU.onsuccess = function (event) {
          //获取游标
          const cursor = event.target.result;
          //如果游标存在，游标进行位移
          if (cursor) {
            if (cursor.key === 101) {
              const value = cursor.value;
              value.name = "lll";
              cursor.update(value);
            } else {
              cursor.continue();
            }
          } else {
            console.log("查询完成");
          }
        };
        break;
    }
  };
}

```

### cookie

cookie是为了辨别用户身份存储在用户本地终端上的数据。

cookie是存储在浏览器的，但是是由服务器发送过来的，在响应头中包含了一个set-cookie的属性，此属性中包含了cookie信息。

由于cookie在客户端的存储位置不同，可分为内存cookie和硬盘cookie：

1. 内存cookie：关闭浏览器后cookie消失 
2. 硬盘cookie：手动删除或到达过期时间时cookie才会消失。

不设置过期时间时，默认是内存cookie，设置过期时间后为硬盘cookie

cookie的属性：

1. Max-Age :设置多少秒后过期

2. expires: 设置具体的过期时间，：设置的是Date.toUTCString()

3. Domain: 假如没有指定，那么默认值为当前文档访问地址中的主机部分（但是不包含子域名）。与之前的规范不同的是，域名之前的点号会被忽略。假如指定了域名，那么相当于各个子域名也包含在内了。

   ​	如果指定Domain，则包含子域名。例如，如果设置 Domain=mozilla.org，则 Cookie 也包含在			    子域名中（如developer.mozilla.org）

4. Path：指定路径下那些路径可以携带cooKie

5. httponly：值允许http请求，不允许js脚本使用document.cookie改变cookie，防止标本攻击。



#### koa框架中设置和获取cookie.

```js
const koa = require("koa");
const router = require("koa-router");

const app = new koa();
const testRouter = new router({prefix: "/test"});

testRouter.get("/", (ctx, next) => {
  ctx.cookies.set("name", "code", {
    maxAge: 1000 * 5,
  });
  ctx.body = "aaa";
});
const userRouter = new router({prefix: "/user"});
userRouter.get("/", (ctx, next) => {
  const cookie = ctx.cookies.get("name");
  ctx.body = "欢迎" + cookie;
});

app.use(testRouter.routes());
app.use(userRouter.routes());
app.listen(8001, () => {
  console.log("服务启动成功");
});

```

### 	session

　　除了使用Cookie，Web应用程序中还经常使用Session来记录客户端状态。**Session是服务器端使用的一种记录客户端状态的机制**，使用上比Cookie简单一些，相应的也**增加了服务器的存储压力**。

##### **什么是session?**

　Session是另一种记录客户状态的机制，不同的是Cookie保存在客户端浏览器中，而Session保存在服务器上。客户端浏览器访问服务器的时候，服务器把客户端信息以某种形式记录在服务器上。这就是Session。客户端浏览器再次访问时只需要从该Session中查找该客户的状态就可以了。

　　如果说**Cookie机制是通过检查客户身上的“通行证”来确定客户身份的话，那么Session机制就是通过检查服务器上的“客户明细表”来确认客户身份。Session相当于程序在服务器上建立的一份客户档案，客户来访的时候只需要查询客户档案表就可以了。**

 koa-session的使用：

```js
const koa = require("koa");
const router = require("koa-router");
const koaSession = require("koa-session");

const app = new koa();

const session = koaSession(
  {
    key: "sessionid",
    maxAge: 1000 * 60,
    signed: true,
  },
  app
);
app.keys = ["aabb"];

app.use(session);
const testRouter = new router({prefix: "/test"});

testRouter.get("/", (ctx, next) => {
  ctx.session.user = {id: 110, name: "wnag"};
  ctx.body = "session设置成功";
});

const userRouter = new router({prefix: "/user"});
userRouter.get("/", (ctx, next) => {
  console.log(ctx.session.user);
  ctx.body = "请求成功！";
});

app.use(testRouter.routes());
app.use(userRouter.routes());

app.listen(8001, () => {
  console.log("服务启动成功");
});

```

cookie和session的方式有很多的缺点：

1.  Cookie会被附加在每个HTTP请求中，所以无形中增加了流量（事实上某些请求是不需要的）；
2. Cookie是明文传递的，所以存在安全性的问题；
3. Cookie的大小限制是4KB，对于复杂的需求来说是不够的；
4.  对于浏览器外的其他客户端（比如iOS、Android），必须手动的设置cookie和session； 
5. 对于分布式系统和服务器集群中，无法保证其他系统也可以正确的解析session。

