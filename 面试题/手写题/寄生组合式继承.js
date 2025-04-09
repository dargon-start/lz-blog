//寄生组合式继承

//修改类型
function inheritPrototype(SubType, SuperType) {
  SubType.prototype = Object.create(SuperType.prototype);
  //纠正类型问题
  Object.defineProperty(SubType.prototype, "constructor", {
    configurable: true,
    enumerable: false,
    writable: true,
    value: SubType,
  });
}
//父类
function Person(name, age, friends) {
  this.name = name;
  this.age = age;
  this.friends = friends;
}

Person.prototype.running = function () {
  console.log("running~");
};

Person.prototype.eating = function () {
  console.log("eating~");
};

//子类
function Student(name, age, friends, sno, score) {
  Person.call(this, name, age, friends);
  this.sno = sno;
  this.score = score;
}
inheritPrototype(Student, Person);

Student.prototype.studying = function () {
  console.log("studying~");
};
//老师
function Teacher(name, age, friends, tno) {
  Person.call(this, name, age, friends);
  this.tno = tno;
}
// Teacher.prototype = Object.create(Person.prototype);
inheritPrototype(Teacher, Person);

Teacher.prototype.teaching = function () {
  console.log("~教学");
};

var stu1 = new Student("王五", 16, ["老李"], 1, 99);
console.log(stu1);
stu1.studying();
stu1.running();

var stu2 = new Student("李四", 12, ["老王"], 2, 60);
console.log(stu2);
stu2.studying();
stu2.running();

var teacher1 = new Teacher("王老师", 45, ["李老师"], 3);
console.log(teacher1);
teacher1.teaching();
teacher1.running();
