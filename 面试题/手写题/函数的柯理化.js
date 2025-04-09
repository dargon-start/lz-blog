function lzCurry(fn) {
  function curried(...args) {
    //fn.length可以获取到函数需要传入的参数个数
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      function curried2(...args2) {
        return curried.apply(this, [...args, ...args2]);
      }
      return curried2;
    }
  }
  return curried;
}

function foo(a, b, c) {
  console.log(a, b, c);
}

const baz = lzCurry(foo);
baz(10)(39)(20);
