/* 
    数组扁平化
*/

const testArray = [1, [2, [3, [4, [5, [6, [7, [[[[[[8, ["ha"]]]]]]]]]]]]]];
// 1.flit
const resultArr = testArray.flat(Infinity);
console.log(resultArr);

//2.归并函数方式
function flatten(arr) {
  return arr.reduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
  }, []);
}
//3.递归方式
function flatten(arr) {
  let result = [];
  arr.forEach((value) => {
    if (Array.isArray(value)) {
      result = result.concat(flatten(value));
    } else {
      result.push(value);
    }
  });
  return result;
}

//4.some()
function flatten(arr) {
  while (arr.some((value) => Array.isArray(value))) {
    arr = [].concat(...arr);
  }
  return arr;
}
const arr1 = flatten(testArray);
console.log(testArray);
console.log(arr1);
