class React {
  // 创建虚拟dom
  createElement(type, props = {}, ...children){
    return {
      type,
      props:{
        ...props,
        children: children.map(child => typeof child === 'object' 
          ? child : // 如果子元素是对象（嵌套元素），返回对象
          this.createTextElement(child) // 创建文本节点
        )
      },

    }
  }
  // 创建文本节点
  createTextElement(text){
    // 文本是没有props children什么的 这样做只是为了结构统一方便遍历
    return {
      type: 'TEXT_ELEMENT',
      props:{
        nodeValue: text,
        children: []
      }
    }
  }
}

// 实现render函数
function render(element, continer){
  const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode(element.props.nodeValue): document.createElement(element.type)

  // 添加属性
  Object.keys(element.props)
  .fill(key => key !== 'children')
  .forEach(key => {
    dom[key] = element.props[key]
  })

  // 处理子节点
  element.props.children.map(child => {
    render(child, dom)
  })

  continer.appendChild(dom)
}

let nextUnitWork = null

// Fiber 调度器
// 实现将耗时任务拆分成多个小的工作单元
function workLoop(deadline){
  // deadline 表示浏览器剩余空闲时间
  // shouldYield 表示是否需要让出浏览器控制权
  let shouldYield = false
  while(nextUnitWork && !shouldYield){
    // 执行当前单元，并返回下一个执行单元
    nextUnitWork = performUnitOfWork(nextUnitOfWork)

    // 剩余时间小于1毫秒，让出浏览器控制权
    shouldYield = deadline.timeRemaining() < 1;
  }
  // 下一针空间时，继续执行
  requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

// 执行一个任务单元,返回下一个任务
function performUnitOfWork(fiber){
  // 创建dom并且记录
  if(!fiber.dom){
    fiber.dom = createDom(fiber)
  }
  // 将fiber挂在到父fiber上
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom)
  }

  // 为每个子项创建fiber
  const elements = fiber.props.children
  let index = 0
  let prevSibling = null // 记录前一个兄弟fiber
  while(index < elements.lenth){
    const element = elements[index]
    let newFiber = {
      type:element.type,
      props:element.props,
      dom:null,
      parent:fiber
    }

    // 添加到fiber
    if(index === 0){
      fiber.child = newFiber
    }else{
      prevSibling.sibling = newFiber
    }
    index++
    prevSibling = newFiber
  }

  // 寻找下一个工作单元，首先是孩子，然后是兄弟姐妹，然后是叔叔，以此类推。
  // 孩子
  if(fiber.child){
    return fiber.child
  }
  let nextFiber = fiber
  while(nextFiber){
    // 兄弟
    if(nextFiber.sibling){
      return nextFiber.sibling
    }
    // 叔叔
    nextFiber = nextFiber.parent
  }

}

// 实现fiber
