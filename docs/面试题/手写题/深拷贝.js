/* 
  参数中的map用来处理循环引用
*/

function isObject(value) {
  const typeVal = typeof value;
  return value !== null && typeVal === "object"
}
//深拷贝
function deepClone(originValue, map = new Map()) {
  if (originValue instanceof Set) {
    return new Set([...originValue]);
  }
  if (originValue instanceof Map) {
    return new Map([...originValue]);
  }
  //如果是一个函数，直接返回
  if (typeof originValue === "function") {
    return originValue;
  }
  //是symbol
  if (typeof originValue === "symbol") {
    return Symbol(originValue.description);
  }
  //如果是普通值，直接返回 
  if (!isObject(originValue)) return originValue;
  //处理循环引用
  if (map.has(originValue)) {
    return map.get(originValue);
  }
  //创建新对象
  let destObj = Array.isArray(originValue) ? [] : {};
  //将创建的对象保存起来
  map.set(originValue, destObj);

  for (const key in originValue) {
    destObj[key] = deepClone(originValue[key], map);
  }
  //对key为symbol时
  const symbobs = Object.getOwnPropertySymbols(originValue);
  for (const skey of symbobs) {
    destObj[skey] = deepClone(originValue[skey], map);
  }

  return destObj;
}



const s2 = Symbol("x");
let obj1 = {
  name: "wang",
  friends: {
    name: "xixi",
  },
  hobby: ["a", "b", "c"],
  fn: function () {
    console.log("hahah1");
  },
  s1: Symbol(123),
  [s2]: "symbos",
  set1: new Set([1, 2, 34]),
  map1: new Map([
    ["key1", "value1"],
    ["key2", "value2"],
  ]),
};
obj1.info = obj1;

const obj2 = deepClone(obj1);
obj2.name = "aaa";
console.log(obj2.name);
console.log(obj1.name);
