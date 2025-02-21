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
