const PROMISE_STATUS_PENDING = "pending";
const PROMISE_STATUS_FULLILED = "fulfilled";
const PROMISE_STATUS_REJECTED = "rejected";

function tryWidthCatchFn(exfn, value, resolve, reject) {
  try {
    const result = exfn(value);
    resolve(result);
  } catch (error) {
    reject(error);
  }
}

class lzPromise {
  constructor(executor) {
    this.status = PROMISE_STATUS_PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledFns = [];
    this.onRejectedFns = [];
    const resolve = (value) => {
      if (this.status == PROMISE_STATUS_PENDING) {
        //将执行的代码加入微任务队列中，如果是同步代码，此时还没有onFulfilld函数
        queueMicrotask(() => {
          if (this.status != PROMISE_STATUS_PENDING) return;
          this.status = PROMISE_STATUS_FULLILED;
          this.value = value;
          this.onFulfilledFns.forEach((fn) => {
            fn(value);
          });
        });
      }
    };
    const reject = (reason) => {
      if (this.status == PROMISE_STATUS_PENDING) {
        queueMicrotask(() => {
          //将执行的代码加入微任务队列中，如果是同步代码，此时还没有onRejected函数
          if (this.status != PROMISE_STATUS_PENDING) return;
          this.status = PROMISE_STATUS_REJECTED;
          this.reason = reason;
          this.onRejectedFns.forEach((fn) => {
            fn(reason);
          });
        });
      }
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      //执行中出现错误，执行reject
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    //处理没有传入回调的情况
    onFulfilled =
      onFulfilled ||
      ((res) => {
        return res;
      });
    onRejected =
      onRejected ||
      ((err) => {
        throw err;
      });

    //默认情况下，返回的是一个promise
    return new lzPromise((resolve, reject) => {
      //如果promise已经确定状态，那么直接调用onFulfilled或onRejected即可
      if (this.status == PROMISE_STATUS_FULLILED && onFulfilled) {
        tryWidthCatchFn(onFulfilled, this.value, resolve, reject);
      }
      if (this.status == PROMISE_STATUS_REJECTED && onRejected) {
        tryWidthCatchFn(onRejected, this.reason, resolve, reject);
      }
      //pending状态时，添加到数组中
      //多次调用then方法，这里将多个回调函数放入数组中
      if (this.status == PROMISE_STATUS_PENDING) {
        // if (onFulfilled) {
        //   this.onFulfilledFns.push(() => {
        //     tryWidthCatchFn(onFulfilled, this.value, resolve, reject);
        //   });
        // } else {
        //   this.onRejectedFns.push(() => {
        //     tryWidthCatchFn(onRejected, this.reason, resolve, reject);
        //   });
        // }
        this.onFulfilledFns.push(() => {
          tryWidthCatchFn(onFulfilled, this.value, resolve, reject);
        });
        this.onRejectedFns.push(() => {
          tryWidthCatchFn(onRejected, this.reason, resolve, reject);
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  // all方法
  static all(promises) {
    return new lzPromise((resolve, reject) => {
      let resArr = [];
      let count = 0 // fuilled 个数
      //当所有的promise状态都变为fulfilled时，返回结果
      for(let i = 0; i < promises.length; i++){
        // 包裹一层resolve，防止传入的不是promise
        promises[i].then((res) => {
          resArr[i] = res // 不能用push，因为要保持和输入的promise数组顺序一致
          count++
          if (count === promises.length) {
            console.log(resArr);
            resolve(resArr);
          }
        })
        .catch((err) => {
          reject(err);
        });
      }
    });
  }

  // race
  static race(promises){
    return new lzPromise((resolve, reject) => {
      const res = null
      
      for (let i = 0; i < promises.length; i++) {
        // 只要有结果，就立马返回
        Promise.resolve(promises[i]).then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
        
      }
    })
  }
}

const p = new lzPromise((resolve, reject) => {
  
  setTimeout(() => {
    resolve("你好呀1");
  }, 1000);
  // reject("error了");
});

const p1 = new lzPromise((resolve, reject) => {
  resolve("你好呀2");
  // reject("error了");
  
});
const p2 = new lzPromise((resolve, reject) => {
  resolve("你好呀3");
  // reject("error了");
});

lzPromise
  .race([p, p1, p2])
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
