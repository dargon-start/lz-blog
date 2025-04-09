/* 
    async的内部实现原理
    目标:当我们上一次请求后，让上一次请求的结果作为下次请求的参数
*/

function requestData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(url);
    }, 1000);
  });
}

//1.普通的回调
// requestData("longzai").then((res) => {
//   console.log(res);
//   requestData(res + "heihei").then((res) => {
//     console.log(res);
//   });
// });

//2.连续the方法
// requestData("aaa")
//   .then((res) => {
//     console.log(res);
//     return requestData(res + "xixi");
//   })
//   .then((res) => {
//     console.log(res);
//   });

//3.通过promise和genetor来实现请求,但是又出现了回调地狱

// function* getData() {
//   const res1 = yield requestData("long");
//   const res2 = yield requestData(res1 + "zai");
// }
//得到生成器
// const getdate = getData();

// getdate.next().value.then((res1) => {
//   console.log(res1);
//   getdate.next(res1).value.then((res2) => {
//     console.log(res2);
//   });
// });

//由于回调都是相似的，可以编写自执行函数，自动实现
// function exectFn(fn) {
//   //1.得到生成器
//   const genFn = fn();
//   //传入
//   function exec(url) {
//     const result = genFn.next(url); //{value:Promise,done:true|false}
//     //判断是否迭代完
//     if (result.done) {
//       return;
//     } else {
//       result.value.then((res) => {
//         console.log(res);
//         exec(res);
//       });
//     }
//   }
//   exec();
// }

// exectFn(getData);

//async和await
async function getData2() {
  //res1实际上就是await后面的promise中执行then()后的res结果，省去了我们自己去调用then方法，然后作为参数传入给生成器
  const res1 = await requestData("123");
  console.log(res1);
  const res2 = await requestData(res1 + "xixi");
  console.log(res2);
}

getData2();
