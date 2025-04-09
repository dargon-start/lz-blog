Function.prototype.lzbind = function (thisArg, ...args) {
  thisArg =
    thisArg !== undefined && thisArg !== null ? Object(thisArg) : window;
  thisArg.fn = this;

  return function (...newargs) {
    const allargs = [...args, ...newargs];
    const result = thisArg.fn(...allargs);
    delete thisArg.fn;
    return result;
  };
};

function foo(a, b, c) {
  console.log(a, b, c);
  console.log(this);
}

const baz = foo.lzbind({name: "nwag"}, "3", "fe");
baz("xxx");
