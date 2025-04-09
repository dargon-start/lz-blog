/* 
防抖函数

*/

function debounce(fn, delay) {
  let timer = null;
  //真正执行的函数
  return function () {
    return new Promise((resolve, reject) => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        //绑定this
        console.log(this);
        const result = fn.apply(this);
        resolve(result);
      }, delay);
    });
  };
}

function clickFn() {
  console.log("dianji");
  return "xixi";
}

const box = document.querySelector(".box");
box.addEventListener("click", debounce(clickFn, 1000));


/* 为什么防抖函数里面要使用apply绑定this？
  为了能正确绑定到this,不会因为使用了防抖函数，而丢失了正确的this指向，案例如下。
*/
function foo(){
  console.log(this);
}

const obj = {
  foo,
  dfo:debounce(foo)
}


obj.foo()
obj.dfo()