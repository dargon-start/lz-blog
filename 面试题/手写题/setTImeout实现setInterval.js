function lzSetInterval(fn,interval){
  let timer = null,isClear = false
  const  timeFunction = function(){
    // isClear=true,清楚了定时器
    if(isClear){
      isClear = false
      clearTimeout(timer)
      timer = null
      return
    }
    // 执行回调
    fn()
    setTimeout(timeFunction,interval)
  }

  timer = setTimeout(timeFunction, interval);

  // 返回清除定时器的回调函数
  return ()=>{
    isClear = true
  }

}

lzSetInterval(()=>{
  console.log(111);
},1000)