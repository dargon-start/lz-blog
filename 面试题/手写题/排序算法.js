let arr = [1, 12, 4, 5, 2, 11, 45, 10, 999, 1000, 932, 111, 100];
/* 
    1、冒泡排序
    每次遍历将最大的元素放到最后，经过多次遍历实现升序
*/
function bublleSort(arr) {
  let len = arr.length - 1;
  for (let j = len; j > 0; j--) {
    for (let i = 0; i < j; i++) {
      if (arr[i] > arr[i + 1]) {
        temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
      }
    }
  }
  return arr;
}

/* 
  2、选择排序
  每次循环找到最小值的下标，然后记录下来
  最后将最小值与当前循环次数的arr[i]进行交换
*/
function selectSort(arr) {
  let len = arr.length - 1;
  for (let i = 0; i < len; i++) {
    let minIndex = i;
    for (let j = i; j < len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
  return arr;
}

/* 
  3、插入排序 
  思想：局部有序
*/

function insertSort(ar) {
  let len = arr.length - 1;

  for (let i = 1; i < len; i++) {
    let insertEle = arr[i];
    //插入到前面有序的部分中
    let j = i;
    while (insertEle < arr[j - 1] && j > 0) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = insertEle;
  }
  return arr;
}

/* 
  4.希尔排序
  通过从大的间距的项，先进行一次排序，然后减小间距，重新排序，直到间距为一，排序完成。
  可以避免最小值位于最后面，那么前面的值都需要移动的情况，可以提高效率
  let arr = [1, 12, 4, 5, 2, 11, 45, 10];
*/

function shellSort(arr) {
  const len = arr.length;
  let gap = Math.floor(len / 2);
  //根据gap来判断是否继续分组排序 
  while (gap >= 1) {
    console.log(gap);
    //插入排序算法
    for (let i = gap; i < len; i++) {
      let j = i;
      let temp = arr[j];
      //j要大于等于gap，否则会出现arr[j-gap]出界问题
      while (temp < arr[j - gap] && j >= gap) {
        //元素向后移动
        arr[j] = arr[j - gap];
        j -= gap;
      }
      //arr[j-gap]<=temp，那么temp就应该插入到arr[j]
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  return arr;
}

/* 
  5.快速排序
  核心思想：分而治之
  let arr = [1, 12, 4, 5, 2, 11, 45, 10];
  9 , 5, 3
  5, 9 3
  5 3 9
*/
//交换函数
function swap(i, j, arr) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
//去除left,center,right三个下标对应值得中位数，作为枢纽值
function getPovit(left, right, arr) {
  //这里需要向下取整，例如：left=4 right=5  ,如果向上取整，
  //center=5,最后的center和right-1交换，会覆盖掉left值，会出错
  let center = Math.floor((left + right) / 2);
  //从小到大排序
  if (arr[left] > arr[center]) {
    swap(left, center, arr);
  }
  if (arr[center] > arr[right]) {
    swap(center, right, arr);
  }
  //由于上面两步完成了最后right值肯定是最大的，那么最后我们还需要判断，left和center值的大小
  if (arr[left] > arr[center]) {
    swap(left, center, arr);
  }
  //将center这个枢纽值放到right-1位置
  //原因：由于right肯定大于，放入right-1，只需对right-1之前的值进行判断和交换即可，避免枢纽值被移动
  swap(center, right - 1, arr);
  return arr[right - 1];
}

function quickSort(arr) {
  function recSort(left, right) {
    //递归结束条件
    if (left >= right) return;
    //基数
    let povit = getPovit(left, right, arr);

    let i = left;

    let j = right - 1;
    //将大于枢纽值得放入枢纽值右边，小于的放入枢纽值左边
    while (i < j) {
      //由于初始值i==left,left肯定小于枢纽值，因次要++i,而不是i++
      while (arr[++i] < povit) {}
      //由于初始值j==right-1,right-1等于枢纽值，因次要--j,而不是j--
      while (arr[--j] > povit) {}
      //交换找到的两个值
      if (i < j) {
        swap(i, j, arr);
      }
    }

    swap(i, right - 1, arr);
    //对左侧进行递归
    recSort(left, i - 1);
    //对有测进行递归
    recSort(i + 1, right);
  }
  //开始递归
  recSort(0, arr.length - 1);
  return arr;
}

/* 简易版快速排序 */

function simpleQuickSort(arr) {
  if (arr.length <= 1) return arr;

  const left = [], right = [];
  const container = arr.splice(0, 1)[0];

  console.log(container);
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < container) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return simpleQuickSort(left).concat(container, simpleQuickSort(right));
}

/*
    堆的特点：
    1、parent比children大
    2、是一个完全二叉树
*/
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

//参数为：数组 变化的长度 操作的下标
function heapify(arr, n, i) {
  let c1 = 2 * i + 1;
  let c2 = 2 * i + 2;
  let max = i;

  if (c1 < n && arr[c1] > arr[max]) {
      max = c1;
  }
  if (c2 < n && arr[c2] > arr[max]) {
      max = c2;
  }
  if (max != i) {
      swap(arr, max, i);
      heapify(arr, n, max);
  }
}
//构建堆
function heapify_build(arr, n) {
  let last_node = n - 1;
  //最后一个节点的父节点为 (lanst_node - 1) / 2
  let parent = Math.floor((last_node - 1) / 2);
  for (let i = parent; i >= 0; i--) {
      heapify(arr, n, i);
  }
}
function heapSort(arr) {
  let len = arr.length;
  //创建堆
  heapify_build(arr, len);  
  //对堆进行排序
  //让根节点和最后一个节点交换，然后砍掉最后一个节点，重新heapify。
  for (let i = len - 1; i >= 0; i--) {
      swap(arr, i, 0);
      heapify(arr, i, 0);
  }
  return arr;
}

const sortArr = simpleQuickSort(arr);

console.log(sortArr);
