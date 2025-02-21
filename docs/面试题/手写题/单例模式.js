const singletonify = (className) => {
  return new Proxy(className.prototype.constructor, {
    instance: null,
    construct: (target, argumentsList) => {
      if (!this.instance)
        this.instance = new target(...argumentsList);
      return this.instance;
    }
  });
} 

class Student {
  constructor(name){
    this.name = name;
  }
}

const sigleCla = singletonify(Student)

const n1 = new sigleCla('wang')

const n2 = new sigleCla('li')

console.log(n1,n2);

