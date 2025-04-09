# async和await

### async

函数前加上async代表是一个异步函数，默认情况下和普通函数一样都是同步执行的。

**异步函数始终返回期约对象。**

异步函数和普通函数的区别：

1. 异步函数的返回值默认会被包裹在Promise.resolve中
2. 如果我们的异步函数的返回值是Promise，Promise.resolve的状态会由Promise决定；
3. 如果我们的异步函数的返回值是一个对象并且实现了thenable，那么会由对象的then方法来决定；

错误处理：

1. 与在期约处理程序中一样，在异步函数中抛出错误会返回拒绝的期约。 

2. 但是拒绝期约的错误不会被异步函数捕获。

```js
async function baz() {
    Promise.reject("cuowu"); //Uncaught (in promise) cuowu
}
baz().catch(console.log);
```

### await

只有异步函数中才可以使用await关键字。

await后面默认跟上的是一个表达式，表达式返回一个Promise，等到Promise的状态变为fulfiled时，继续执行异步函数。

await返回值有以下三种情况：

1. 如果是一个普通的值，直接返回
2. 如果是一个实现了thenable的对象，则会根据then方法来确定返回的值。
3. 如果是一个Promise，并且Promsie返回reject,则rejiect会作为异步函数的reject进行返回。



异步函数中，单独的Promise.reject()不会被异步函数捕获，而会抛出未捕获的错误。

但是，对拒绝的期约使用await则会释放（unwrap）错误值。（将拒绝期约返回）

```js
async function baz() {
    console.log("start");
    await Promise.reject("ccc");
}
baz().catch(console.log);

/*
	start
	ccc
*/
```

   
