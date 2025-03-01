class eventEmitter {
  constructor(){
    this.events = {}
  }

  on(type,cb){
    let handlers = this.events[type]

    if(!handlers){
      handlers = []
      this.events[type] = handlers
    }

    if(typeof cb !== 'function') return new Error('事件回调应该是函数类型')

    handlers.push(cb)
  }

  emit(type,...args){
    const handlers = this.events[type]

    if(!handlers) return new Error('事件类型不存在在')
    
    handlers.forEach(fn => {
      fn(...args)
    });
  }

  off(type,cb){
    const handlers = this.events[type]

    if(!handlers) return new Error('事件类型不存在在')

    const index = handlers.indexOf(cb)
    if(index === -1) return new Error('事件回调函数不存在')

    handlers.splice(index,1)
  }
}


const eventbus = new eventEmitter()

const foo = ()=>{
  console.log('fn');
}

eventbus.on('event1',function(a,c){
  console.log(a,c);
  console.log('12312');
})
eventbus.on('event1',foo);


// eventbus.off('event1',foo)


eventbus.emit('event1',12,32);




