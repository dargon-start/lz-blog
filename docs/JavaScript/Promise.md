# Promise

## Promise对象方法

### Promise和它的三种状态

es6之后为了处理异步任务，js为我们提供了Promise类。它相当于一个承诺，有固定的的使用方式，我们可以无需了解内部实现直接使用，与之前我们自己封装的回调函数相比更加方便使用。

```js
//创建Promise后传入一个回调函数，我们称之为executor(执行者)
new Promise((resolve, reject) => {
    //成功是调用resolve()
    resolve();
    //拒绝时调用reject()
    reject();
})
```

Promise有三种状态

1. 执行executor函数时称为待定（pending）状态
2. 执行resolve()函数时称为成功（fulfilled）状态
3. 执行reject()函数时称为拒绝（rejected）状态

==注意：==一旦状态被确定下来，Promise的状态会被锁死，该Promise的状态是不可更改的

### resolove

1. 如果resolve传入一个普通的值或者对象，那么这个值会作为then回调的参数

2. 如果resolve中传入的是另外一个Promise，那么这个新Promise会决定原Promise的状态

3. 如果resolve中传入的是一个对象，并且这个对象有实现then方法，那么会执行该then方法，并且根据

   then方法的结果来决定Promise的状态

```js
function requestDate(url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (url == '/list') {
                //1.普通的值
                resolve({ name: 'feawf' }); //{ name: 'feawf' }
                //传入一个Promise
                resolve(new Promise((resolve, reject) => {
                        reject('inner Promise err');
                    })) //inner Promise err
                    //传入一个实现了then方法的对象
                resolve({
                    then: function(resolve, reject) {
                        // resolve('feafewa');
                        reject('obj err') //obj err
                    }
                })

            } else {
                reject('err');
            }
        }, 2000);
    })
}

requestDate('/list').then((res) => {
    console.log(res);
}, err => {
    console.log(err);
});
```

### then方法

1. then方法可以接受两个参数，第一个为fullied的回调函数，第二个为rejected的回调函数。
2. then方法可以被多次调用。
3. then方法本身是有返回值的，它的返回值是一个Promise，所以我们可以进行如下的链式调用。
   1. 如果我们返回的是一个普通值(数值/字符串/普通对象/undefined), 那么这个普通的值被作为一个新的Promise的resolve值
   2. 如果我们返回的是一个Promise，当前Promise作为要返回的Promise，决定后续的状态。
   3. 如果返回的是一个对象, 并且该对象实现了thenable，then方法的返回状态决定后面Promise的状态

如果传入的是非函数类型，那么会被忽略

```js
Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log);
//输出为：1

//由于then方法传入的非函数类型，那么会向下透传，后面的then来处理promise的状态。
```



### catch方法

当Promise的状态变成reject的时候，这些回调函数都会被执行；

1. catch方法可以被多次调用。
2. catch方法本身是有返回值的，它的返回值是一个Promise，所以我们可以进行如下的链式调用。
   1. 如果我们返回的是一个普通值(数值/字符串/普通对象/undefined), 那么这个普通的值被作为一个新的Promise的resolve值
   2. 如果我们返回的是一个Promise，当前Promise作为要返回的Promise，决定后续的状态。
   3. 如果返回的是一个对象, 并且该对象实现了thenable，then方法的返回状态决定后面Promise的状态

### finally方法

es9新增方法，Promise对象无论变成fulfilled还是reject状态，最终都会被执行的代码

finally方法是不接收参数的，因为无论前面是fulfilled状态，还是reject状态，它都会执行。



finally()函数默认会向下传递状态。

1. 在finally()中返回一个pending状态的promise，会返回pending状态的契约
2. 在finally()中返回一个rejected状态的promise或者抛出错误，会返回rejected状态的契约

## Promise类方法

直接通过Promise类来调用的方法。

```js
Promise.resolve('rere');
```

### resolve方法

有时候我们已经有一个现成的内容了，希望将其转成Promise来使用，这个时候我们可以使用 Promise.resolve 方法来完成。

resolve（）方法可以三种不同的值。

1. 如果resolve传入一个普通的值或者对象，那么这个值会作为then回调的参数

2. 如果resolve中传入的是另外一个Promise，那么这个新Promise会决定原Promise的状态

3. 如果resolve中传入的是一个对象，并且这个对象有实现then方法，那么会执行该then方法，并且根据

   then方法的结果来决定Promise的状态

### reject方法

将Promise对象的状态设置为rejected状态，并且传入任何值都不会影响Promise的状态，都是调用Promise的catch方法。



## 期约的合成方法

参数都是中传入一个包含多个promise对象的可迭代对象。

如果可迭代对象中的元素是普通值，那么会自动使用Promise.resolve()进行包裹。

```js
//迭代对象中的元素会通过Promise.resolve()进行包裹
Promise.all([3, 2]).then((res) => {
    console.log(res);
});
```

### all方法

Promise.all方法中传入一个包含多个promise对象的可迭代对象，状态由多个Promise对象共同决定。

1. 所有Promise对象的状态都变为fulfiled时，Promise.all的Promise也为fulfiled，并且以数组形式返回所有的Promise结果。
2. 如果有Promise为rejected时，返回最先返回rejected状态的Promise对象的err。
2. 如果有一个为一直为pending状态，那么Promise.all()的状态也一直会是pending.

```js
const p1 = new Promise((resolve, reject) => {
    // reject("111111")
    setTimeout(() => {
        resolve(1111)
    }, 1000);
})
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(2222)
    }, 2000);
})
const p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(3333)
    }, 3000);
})
Promise.all([p1, p2, p3]).then(res => {
    console.log('res' + res);
}).catch(err => {
    console.log('err:' + err);
});
//返回err:2222 因为p2先最先返回rejected状态。
```

### **allSettled方法**

es11中新增方法，与all方法相同，都是接受多个Promise对象，allSettled方法是无论Promise对象的返回状态为fulfiled或rejected，都会等所有的Promise执行完以后，并且allSettled的Promise只会调用then方法，*永远为fulfiled状态*，以数组形式返回每一个Promise对象的返回状态。

> [
>         	{ status: 'fulfilled', value: 1111 },
>         	{ status: 'rejected', reason: 2222 },
>         	{ status: 'rejected', reason: 3333 }
> 		]

### race

race表示多个Promise相互竞争，谁先有结果，那么就使用谁的结果。

### any

es12中新增的方法，会等到第一个为fulfiled的promise对象，然后返回fuliled状态返回的结果。

如果都为rejected状态，那么会报错：err:AggregateError: All promises were rejected。

### 手写promise

promiseA+规范：https://promisesaplus.com/ 

```js
//状态常量
const PROMISE_STATUS_PENDING = 'pending'
const PROMISE_STATUS_FULFILLED = 'fulfilled'
const PROMISE_STATUS_REJECTED = 'rejected'

//封装try/catch函数
function TryWitchCatchFn(exefn,value,resolve,reject) {
    try {
        const result = exefn(value);
        resolve(result);
    } catch (error) {
        reject(error);
    }    
}


//封装Promise类
class LzPromise {
    //传入exector回调函数
    constructor(exector) {
        this.status = PROMISE_STATUS_PENDING;
        this.value=undefined;
        this.reason=undefined;
        this.onFulfilledFns=[];
        this.onRejectedFns=[];
        const resolve = (value) => {
            if (this.status == PROMISE_STATUS_PENDING) {
                queueMicrotask(() => {
                    if (this.status !== PROMISE_STATUS_PENDING) return;
                    this.status = PROMISE_STATUS_FULFILLED;
                    this.value = value;
                    this.onFulfilledFns.forEach(fn=>{
                        fn(this.value);
                    })
                });
            }
        }

        const reject = (reason) => {
            if (this.status == PROMISE_STATUS_PENDING) {
                queueMicrotask(() => {
                    if (this.status !== PROMISE_STATUS_PENDING) return;
                    this.status = PROMISE_STATUS_REJECTED;
                    this.reason = reason;
                    this.onRejectedFns.forEach(fn=>{
                        fn(this.reason);
                    })
                });
            }
        }

        //接受传入的两个回调函数参数
        try {
            exector(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    Lthen(onFulfilled,onRejected) {
        //如果Lthen没有传入onRejected函数，则将错误抛出，交给Lcathc方法处理
        onRejected = onRejected || (err=>{ throw err});
        //
        onFulfilled =onFulfilled || (value=>{ return value});
        //默认返回一个Promise对象
        return new LzPromise((resolve,reject)=>{
            //如果有状态，直接执行
            if(this.status===PROMISE_STATUS_FULFILLED && onFulfilled){
                TryWitchCatchFn(onFulfilled,this.value,resolve,reject);
            }
            //如果有状态，直接执行
            if(this.status===PROMISE_STATUS_REJECTED && onRejected){
                TryWitchCatchFn(onFulfilled,this.reason,resolve,reject);
            }
            //如果为Pending状态，则添加到数组当中
            if(this.status===PROMISE_STATUS_PENDING){
                if(onFulfilled){
                    this.onFulfilledFns.push(()=>{
                        TryWitchCatchFn(onFulfilled,this.value,resolve,reject);
                    });
                }
                if(onRejected){
                    this.onRejectedFns.push(()=>{
                        TryWitchCatchFn(onRejected,this.reason,resolve,reject);
                    });
                }
            }
        })
    }

    Lcatch (onRejected) {
        return  this.Lthen(undefined,onRejected);
    }

    Lfinally(onFinally){
        this.Lthen(()=> {
            onFinally()
        },err=>{
            onFinally();
        })
    }

    static resolve(value){
        return new LzPromise((resolve,reject)=>{
            resolve(value);
        })
    }

    static reject(value){
        return new LzPromise((resolve,reject)=>{
            reject(value);
        })
    }

    static all(promises){
        return new LzPromise((resolve,reject)=>{
           let values=[];
           promises.forEach(promise=>{
               promise.Lthen(res=>{
                   values.push(res);
                   //所有的promise都返回结果再执行resolve
                   if(values.length === promises.length){
                       resolve(values);
                   }
               },err=>{
                   //有err直接返回
                   reject(err);
               })
           })
        })
    }

    static allSettled(promises){
        return new LzPromise((resolve,reject)=>{
            let resultOjb=[];
            promises.forEach(promise=>{
                promise.Lthen(res=>{
                    resultOjb.push({status:PROMISE_STATUS_FULFILLED,value:res})
                    if(resultOjb.length===promises.length){
                        resolve(resultOjb);
                    }
                },err=>{
                    resultOjb.push({status:PROMISE_STATUS_REJECTED,value:err});
                    if(resultOjb.length===promises.length){
                        resolve(resultOjb);
                    }
                })
            })
        })
    }
    //只要有一个返回结构就结束，不管是fulfiled，还是rejected状态
    static race(promises){
        return new LzPromise((resolve,reject)=>{
            promises.forEach(promise=>{
                promise.Lthen(res=>{
                    resolve(res);
                },err=>{
                    reject(err);
                })
            })
        })
    }
    //等到以fulfiled结果后才返回，所有都是rejected时，抛出固定错误
    static any(promises){
        return new LzPromise((resolve,reject)=>{
            let reasons=[];
            promises.forEach(promise=>{
                promise.Lthen(res=>{
                    resolve(res);
                },err=>{
                    reasons.push(err);
                    if(reasons.length===promises.length){
                        reject(new AggregateError(reasons));
                    }
                })
            })
        })
    }

}
```

