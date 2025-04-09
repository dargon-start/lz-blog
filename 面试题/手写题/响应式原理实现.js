//思路：使用weakMap来保存每一个对象映射一个map
/* WeakMap:{
    obj:map
}
//map映射每一个属性对应一个set
map:{
    name:set
} 
//set中保存的每个属性的所有的副作用函数
set:[effect1,effect2]
*/

//活跃的副作用函数
let activeEffect = null;

class Dep {
  constructor() {
    this.reactiveFns = new Set();
  }
  //收集依赖
  depend() {
    //这里必须判断不为null，
    //因为当修改属性后，先通知所有的副作用函数执行，在执行副作用函数时，又访问了属性，因此会再次收集副作用函数，
    //但是此时activeEffect=null,不判断的话会将null填加进去
    if (activeEffect) {
      this.reactiveFns.add(activeEffect);
    }
  }
  //通知执行所有的副作用函数
  notify() {
    this.reactiveFns.forEach((fn) => {
      console.log("fn:", fn);
      fn();
    });
  }
}
let targetMap = new WeakMap();
//通过对象和key寻找到相应的dep（set集合）
function getDep(target, key) {
  let deps = targetMap.get(target);
  if (!deps) {
    deps = new Map();
    targetMap.set(target, deps);
  }

  let dep = deps.get(key);
  if (!dep) {
    dep = new Dep();
    deps.set(key, dep);
  }
  return dep;
}

//副作用函数
function watchEffect(effect) {
  activeEffect = effect;
  effect();
  activeEffect = null;
}
//响应式函数
function reactive(raw) {
  return new Proxy(raw, {
    set(target, key, value, receiver) {
      console.log("set");
      Reflect.set(target, key, value, receiver);
      let dep = getDep(target, key);
      dep.notify();
    },
    get(target, key, receiver) {
      console.log("get");
      let dep = getDep(target, key);
      dep.depend();
      return Reflect.get(target, key, receiver);
    },
  });
}

let obj = {
  name: "wnag",
  age: 12,
};

let objPro = reactive(obj);

watchEffect(() => {
  console.log(objPro.name);
});

objPro.name = "xixi";
