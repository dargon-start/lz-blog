class lzPromise{
  constructor(){

  }
}



new Promise((resolve,reject)=>{
  console.log(1);

  resolve(12)
}).then(res=>{
  console.log(res);
})