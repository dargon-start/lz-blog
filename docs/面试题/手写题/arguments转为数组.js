Array.prototype.lzslice = function (start, end) {
  const args = this;
  start = start || 0;
  end = end || this.length;
  let arr = [];
  for (let i = start; i < end; i++) {
    arr.push(args[i]);
  }
  return arr;
};

function foo() {
  console.log(arguments);
  //1.遍历转化
  let arr = [];
  for (const item of arguments) {
    arr.push(item);
  }
  console.log(arr);
  //2.slice方式
  const arr2 = Array.prototype.lzslice.call(arguments);
  console.log(arr2);
  //3.es6以后
  const arr3 = [...arguments];
  const arr4 = Array.from(arguments);
  console.log(arr3, arr4);
}

foo("12", "32");
