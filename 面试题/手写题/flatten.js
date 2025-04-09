function flatten(arr){
  return arr.reduce((pre,cur)=>{
    return pre.concat(Array.isArray(cur) ? flatten(cur) : cur)
  },[])
}


const testArr = [1,[2,3],[22,['f','d']]]

const res = flatten(testArr)

console.log(res);