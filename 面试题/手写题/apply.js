Function.prototype.lzapply = function (thisArg, args) {
  thisArg =
    thisArg !== undefined && thisArg !== null ? Object(thisArg) : window;
  thisArg.fn = this;
  let result;
  //判断是否传入数组参数，如果没有传参，则不能对args进行解构
  if (!args) {
    thisArg.fn();
  } else {
    result = thisArg.fn(...args);
  }
  delete thisArg.fn;
  return result;
};

function foo(a, b, c) {
  console.log(a, b, c);
  console.log(this);
}

foo.lzapply("nihao");
