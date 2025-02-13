# Vue3中的性能优化

### 一、模板解析与 AST 生成
1. **模板解析**  
   将开发者编写的模板（如 `.vue` 文件中的 `<template>` 内容）解析为**抽象语法树（AST）**，树节点描述模板中的元素、属性、指令等信息。
2. **静态节点标记**  
   遍历 AST，通过静态分析识别**纯静态节点**（如无动态绑定的 `<div>Hello</div>`）和**动态节点**（如含 `{{ data }}` 或 `v-if` 的节点）。


### 二、动态节点识别与 PatchFlag 标记
1. **动态内容分类**  
   根据动态节点的变更类型（如文本、属性、子节点等），为每个动态节点添加 **PatchFlag**（位掩码标记），例如：  
   - `TEXT = 1`（动态文本）  
   - `CLASS = 2`（动态 class）  
   - `PROPS = 8`（动态属性）
2. **指令关联**  
   对 `v-if`、`v-for` 等指令标记为**结构化指令**，这些指令会触发 Block 的嵌套切割。


### 三、Block 划分与树形结构构建
1. **根 Block 创建**  
   通过 `openBlock()` 开启根 Block，所有动态节点会被收集到 `dynamicChildren` 数组中。
2. **嵌套 Block 切割**  
   - **结构化指令触发切割**：遇到 `v-if`、`v-for` 等指令时，生成子 Block，形成嵌套结构。  
     ```javascript
     // 示例：v-for 生成子 Block
     _openBlock(), _createElementBlock("div", { key: 0 }, [
       (_openBlock(true), _createElementBlock(_Fragment, null, 
         _renderList(items, (item) => _createElementVNode("div", { key: item.id }, item.name))
       ))
     ])
     ```
   - **动态节点归集**：每个 Block 仅维护自身内部的动态节点列表（`dynamicChildren`），静态节点被跳过。
3. **Block Tree 形成**  
   通过递归处理模板中的嵌套指令，最终生成树形结构的 Block Tree，每个 Block 独立追踪动态内容。

### 四、渲染函数生成
1. **代码生成**  
   将优化后的 Block Tree 转换为**渲染函数**，使用 `_openBlock()` 和 `_createElementBlock()` 等运行时 API 管理动态节点。
2. **静态提升（HoistStatic）**  
   将纯静态节点提升到渲染函数外部，避免重复创建。

### 五、运行时优化
- **动态节点快速 Diff**  
  更新时仅遍历 `dynamicChildren` 中的动态节点，通过 PatchFlag 的位运算快速定位变更类型（如 `if (patchFlag & TEXT) updateText()`）。
- **SSR 优化**  
  服务端渲染时，静态内容直接输出 HTML，跳过虚拟 DOM 生成。


### 流程总结
```text
模板解析 → AST 生成 → 静态分析 → PatchFlag 标记 → Block 切割 → Block Tree 构建 → 渲染函数生成 → 运行时动态更新
```
