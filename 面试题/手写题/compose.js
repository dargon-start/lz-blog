function lzCompose(...fns) {
  //判断传入的是否为函数
  const length = fns.length;
  for (const fn of fns) {
    if (typeof fn !== "function") {
      throw TypeError("compose函数的参数类型需要是function");
    }
  }
  return function (...args) {
    let index = 0;
    let result = length ? fns[index].apply(this, args) : args;
    while (++index < length) {
      //前面函数的执行结果，做为参数传入下一个函数
      result = fns[index].call(this, result);
    }
    console.log(result);
    return result;
  };
}

function foo(a, b) {
  return a + b;
}

function baz(m) {
  return m * 2;
}
//此时代表，先完成相加后，在执行乘法操作。
const resFn = lzCompose(foo, baz);
resFn(5, 3);
