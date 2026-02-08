import { name as aName } from './a.mjs';
console.log('b.js:', aName); // 可以正确获取到值
export var name = 'module-b';