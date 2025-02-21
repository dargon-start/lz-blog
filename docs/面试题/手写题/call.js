Function.prototype.lzcall = function (thisArg, ...args) {
  thisArg =
    thisArg !== undefined && thisArg !== null ? Object(thisArg) : window;
  //fn为调用lzcall的函数
  thisArg.fn = this;
  //执行fn函数
  const result = thisArg.fn(...args);
  //执行完后，为了防止内存泄漏，清除thisArg上的fn函数
  delete thisArg.fn;
  //返回函数执行结果
  return result;
};

function foo(a, b, c) {
  console.log(a, b, c);
  console.log(this);
  this.name = "ewang";
  return "afe";
}

const res = foo.lzcall(123, 2, 5, 3);
console.log(res);
