# babel插件编写

首先了解ast树的结构
https://astexplorer.net/

## 案例：将箭头函数转换为function函数

插件

```js
export default function ({ types: t }) {
  return {
    name: "my-plugin",
    visitor: {
      ArrowFunctionExpression(path) {
        const node = path.node;

        const fn = t.functionExpression(
          null,
          node.params, // 参数列表
          t.blockStatement([t.returnStatement(node.body)]),
          node.async // 是否为异步函数
        );

        // 替换当前箭头函数节点为普通函数节点
        path.replaceWith(fn);
      },
    },
  };
}
```

箭头函数

```js
const foo = (a) => a + 1;
```

插件使用

```js
import babel from "@babel/core";
import myPlugin from "./my-plugin.mjs";
import fs from "fs";

const inputCode = fs.readFileSync("./demo.js", "utf-8");

const res = babel.transformSync(inputCode, {
  plugins: [myPlugin],
});

console.log(res.code);
```

转换结果

```js
const foo = function (a) {
  return a + 1;
};
```
