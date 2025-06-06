/* 
    节流函数
*/

// 不控制第一个和最后一次
// function throttle(fn, interval) {
//   let timer = null;
//   let lastTime = 0;
//   return function (...args) {
//     return new Promise((resolve, reject) => {
//       //获取当前时间
//       let nowTime = new Date().getTime();
//       //计算剩余时间
//       let remainTime = interval - (nowTime - lastTime);
//       //如果剩余时间小于或等于0,那么直接执行
//       if (remainTime <= 0) {
//         if (timer) clearTimeout(timer);
//         fn.apply(this, args);
//         lastTime = nowTime;
//       } else {
//         //最后一次执行
//         if (timer) clearTimeout(timer);
//         timer = setTimeout(() => {
//           fn.apply(this, args);
//           lastTime = new Date().getTime();
//           timer = null;
//         }, remainTime);
//       }
//     });
//   };
// }
function throttle(fn, interval, options = { leading: true, trailing: true }) {
  // 1.记录上一次的开始时间
  const { leading, trailing, resultCallback } = options
  let lastTime = 0
  let timer = null

  // 2.事件触发时, 真正执行的函数
  const _throttle = function(...args) {
    return new Promise((resolve, reject) => {
      // 2.1.获取当前事件触发时的时间
      const nowTime = new Date().getTime()
     // 第一次不触发
      if (!lastTime && !leading) lastTime = nowTime

      // 2.2.使用当前触发的时间和之前的时间间隔以及上一次开始的时间, 计算出还剩余多长时间需要去触发函数
      const remainTime = interval - (nowTime - lastTime)
      if (remainTime <= 0) {
        if (timer) {
          clearTimeout(timer)
          timer = null
        }

        // 2.3.真正触发函数
        const result = fn.apply(this, args)
        console.log(nowTime);
        resolve(result)
        // 2.4.保留上次触发的时间
        lastTime = nowTime
        return
      }

      if (trailing && !timer) {
        timer = setTimeout(() => {
          timer = null
          lastTime = !leading ? 0: new Date().getTime()
          console.log(new Date().getTime());
          const result = fn.apply(this, args)
          resolve(result)
        }, remainTime)
      }
    })
  }

  _throttle.cancel = function() {
    if(timer) clearTimeout(timer)
    timer = null
    lastTime = 0
  }

  return _throttle
}




function clickFn() {
  console.log("dianji");
  return "xixi";
}

const box = document.querySelector(".box");
box.addEventListener("click", throttle(clickFn, 2000));
