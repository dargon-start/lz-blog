# class

es6中的class类，实际上是构造函数的语法糖，与构造函数有相同的原型类型。

### constructor

class类中通过constructor构造函数来创建对象。

constructor执行的操作：

1. 在内存中创建一个新的对象（空对象）；
2. 这个对象内部的[[prototype]]属性会被赋值为该构造函数的prototype属性；；
3. 构造函数内部的this，会指向创建出来的新对象；
4. 执行函数的内部代码（函数体代码）；
5. 如果构造函数没有返回非空对象，则返回创建出来的新对象；

### 方法

1. 普通方法
2. 访问器方法
3. 静态方法

```js
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this._address = '北京市';
    }

    //普通方法
    eating() {
        console.log(this.name + 'eating');
    }

    //访问器方法
    get address() {
        return this._address;
    }
    set address(newAddress) {
        this._address = newAddress;
    }

    //静态方法
    static Mothed() {
        console.log('静态方法');
    }
}

var p1 = new Person('张三', 12);
p1.eating();
console.log(p1.address);
p1.address = '南京市';
console.log(p1.address);

//静态方法可以不创建对象实例，直接调用
Person.Mothed();
```

### super

注意：在子（派生）类的构造函数中使用this或者返回默认对象之前，必须先通过super调用父类的构造函数

使用位置：累的构造函数中，类的普通方法中，类的静态方法中

### 实现继承

```js
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this._address = '北京市';
    }

    //普通方法
    eating() {
        console.log(this.name + 'eating');
    }
    runing() {
            console.log(this.name + '跑步了');
        }
        //访问器方法
    get address() {
        return this._address;
    }
    set address(newAddress) {
        this._address = newAddress;
    }

    //静态方法
    static Mothed() {
        console.log('静态方法');
    }
}

class Student extends Person {
    constructor(name, age, sno) {
        //使用this之前必须用super调用父类的构造函数，
        super(name, age);
        this.sno = sno;
    }

    studing() {
            console.log(this.name + '正在学习');
        }
        //重写父类方法，
    eating() {
            console.log(this.name + '吃了米饭');
        }
        //通过super复用父类方法的逻辑
    runing() {
            super.runing();
            console.log(this.name + '和老王一起跑步了');
        }
        // 静态方法， 也可以通过super复用父类逻辑
    static Mothed() {
        super.Mothed();
        console.log('sub静态方法');
    }
}

var stu = new Student('张三', 16, 001);
console.log(stu);
stu.eating();
stu.runing();
stu.studing();
//静态方法调用
Student.Mothed();
```

### 继承内置类

```js
class HYArray extends Array {
    firstItem() {
        return this[0]
    }

    lastItem() {
        return this[this.length - 1]
    }
}

var arr = new HYArray(1, 2, 3)
console.log(arr.firstItem())
console.log(arr.lastItem())
```

### 混入

js中类只能有一个父类，当我们在开发中需要在一个类中添加更多相似的功能时，可以使用混入。

```js
class Person {

}

function mixinRunner(BaseClass) {
  class NewClass extends BaseClass {
    running() {
      console.log("running~")
    }
  }
  return NewClass
}

function mixinEater(BaseClass) {
  return class extends BaseClass {
    eating() {
      console.log("eating~")
    }
  }
}

// 在JS中类只能有一个父类: 单继承
class Student extends Person {

}

var NewStudent = mixinEater(mixinRunner(Student))
var ns = new NewStudent()
```

### 多态

**多态**（polymorphism）指为不同数据类型的实体提供统一的接口，或使用一个单一的符号来表示多个不同的类型。

理解：不同的数据类型进行同一个操作，表现出不同的行为，就是多态的体现。

```js
function calcArea(foo) {
  console.log(foo.getArea())
}

var obj1 = {
  name: "why",
  getArea: function() {
    return 1000
  }
}

class Person {
  getArea() {
    return 100
  }
}

var p = new Person()
//调用相同的函数，返回不同的结果，这就是多态
calcArea(obj1)
calcArea(p)


// 给相同函数传入了不同的数据类型，返回不同的结果，
function sum(m, n) {
  return m + n
}

sum(20, 30)
sum("abc", "cba")
```

