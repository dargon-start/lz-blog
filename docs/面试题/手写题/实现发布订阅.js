class LzeventBus{
  constructor (){
    this.eventBus = {}
  }

  on(eventName,eventCallback){
    let handlers = this.eventBus[eventName];

    if(!handlers){
      handlers = []
      this.eventBus[eventName] = handlers;
    }
  
    handlers.push(eventCallback)
  }

  emit(eventName,...args){
    let handlers = this.eventBus[eventName];
    if(!handlers) throw new Error('事件类型不存在')
    handlers.forEach(handler=>{
      handler(...args)
    })
  }


  off(eventName,cb){
    //没有传cb,那么删除整个handlers 
    if(!cb) delete this.eventBus[eventName];

    let handlers = this.eventBus[eventName];
    if(!handlers) throw new Error('事件类型不存在');

    const index = handlers.indexOf(cb);
    if(index === -1) throw new Error('事件处理函数不存在');
    handlers.splice(index,1);
    console.log(handlers);
    if(handlers.length === 0) {
      delete this.eventBus[eventName]
    }
  }
}


const eventbus = new LzeventBus();

const foo = ()=>{
  console.log('fn');
}

eventbus.on('event1',function(a,c){
  console.log(a,c);
  console.log('12312');
})
eventbus.on('event1',foo);


// eventbus.off('event1',foo)


eventbus.emit('event2',12,32);

