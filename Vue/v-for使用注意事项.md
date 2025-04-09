# v-for使用注意事项

### v-for和v-if是不能一同使用

例如：我们向通过某一个属性，来动态的决定该元素是否渲染时，我们要使用v-if进行判断，但是v-if的优先级高于v-for，不能实现我们想要的效果。

我们可以通过template来解决这个问题。

```html
<ul>
    <template v-for="item in arr" :key="item.name">
        <li v-if="item.isshow">{{item.name}}</li>
    </template>
</ul>


 arr: [
    {name: "a", isshow: true},
    {name: "b", isshow: false},
    {name: "c", isshow: true},
    {name: "d", isshow: true},
],
```

### key关键字的深度解析

举例：有a,b,c,d一个数组，我们对它进行v-for遍历渲染，然后我们在b后面插入一个新的值f。数组变为a,b,f,c,d；通过ul列表进行渲染，分析有key和无key的情况。

vue源码中通过判断是否有key，来执行不同的对比函数。

#### 无key

没有key时，会执行patchUnkeyedChildren方法。



#### 有key

有key时，会执行patchkeyedChildren方法。


第五步，通过key来建立map，寻找相同的vnode.

1. 从不相同的节点位置开始，遍历新的vdom树，建立keyToNewIndexMap ，key -> i 
2. 从不相同的节点位置开始，遍历旧的vdom树，通过旧vnode的key从keyToNewIndexMap找到要插入到新vdom树的位置的索引 i 。如果没有找到索引，则卸载当前的旧vnode。如果找到了i ，则将当前旧vnode和 新vdom树中索引为i的vnod进行patch，更新dom。
3. 如果没有找到对应的旧node,就挂载新的vnode

```js
 const s1 = i // prev starting index
      const s2 = i // next starting index

      // 5.1 build key:index map for newChildren
      const keyToNewIndexMap: Map<string | number | symbol, number> = new Map()
      //遍历新的节点树，简历map

      for (i = s2; i <= e2; i++) {
        const nextChild = (c2[i] = optimized
          ? cloneIfMounted(c2[i] as VNode)
          : normalizeVNode(c2[i]))
        if (nextChild.key != null) {
          //
          if (__DEV__ && keyToNewIndexMap.has(nextChild.key)) {
            warn(
              `Duplicate keys found during update:`,
              JSON.stringify(nextChild.key),
              `Make sure keys are unique.`
            ) 
          }
          keyToNewIndexMap.set(nextChild.key, i)
        }
      }

      // 5.2 loop through old children left to be patched and try to patch
      // matching nodes & remove nodes that are no longer present
      let j
      let patched = 0
      const toBePatched = e2 - s2 + 1
      let moved = false
      // used to track whether any node has moved
      let maxNewIndexSoFar = 0
      // works as Map<newIndex, oldIndex>
      // Note that oldIndex is offset by +1
      // and oldIndex = 0 is a special value indicating the new node has
      // no corresponding old node.
      // used for determining longest stable subsequence
      const newIndexToOldIndexMap = new Array(toBePatched)
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
      //遍历旧的vnode树
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        if (patched >= toBePatched) {
          // all new children have been patched so this can only be a removal
          unmount(prevChild, parentComponent, parentSuspense, true)
          continue
        }
        let newIndex
        // 如果旧vnode有key，则从map中找到应该插到新vnode中的index
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          //否则，遍历寻找相同类型的节点
          // key-less node, try to locate a key-less node of the same type
          for (j = s2; j <= e2; j++) {
            if (
              newIndexToOldIndexMap[j - s2] === 0 &&
              isSameVNodeType(prevChild, c2[j] as VNode)
            ) {
              newIndex = j
              break
            }
          }
        }
        // newIndex === undefined ，说明在旧vnode树种没有找到与新vnode相同的vnode
        if (newIndex === undefined) {
          unmount(prevChild, parentComponent, parentSuspense, true)
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }
          //找到了相同vnode，让这两个相同类型的vnode进行patch
          patch(
            prevChild,
            c2[newIndex] as VNode,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
          patched++
        }
      }

      // 5.3 move and mount
      // generate longest stable subsequence only when nodes have moved
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : EMPTY_ARR
      j = increasingNewIndexSequence.length - 1
      // looping backwards so that we can use last patched node as anchor
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i
        const nextChild = c2[nextIndex] as VNode
        const anchor =
          nextIndex + 1 < l2 ? (c2[nextIndex + 1] as VNode).el : parentAnchor
        // 如果没有找到对应的旧node,就挂载新的vnode
        if (newIndexToOldIndexMap[i] === 0) {
          // mount new
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
        } else if (moved) {
          // move if:
          // There is no stable subsequence (e.g. a reverse)
          // OR current node is not among the stable sequence
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, MoveType.REORDER)
          } else {
            j--
          }
        }
      }
    }
```

上面代码片段用于高效更新列表（如 `v-for` 生成的循环元素）的核心 diff 算法（双端比较 + 最长递增子序列优化）。以下是其替换循环元素的关键步骤分析：

---

### **1. 建立新节点的 Key-Index 映射表**
```javascript
const keyToNewIndexMap = new Map()
for (i = s2; i <= e2; i++) {
  const nextChild = c2[i] // 新子节点
  if (nextChild.key != null) {
    keyToNewIndexMap.set(nextChild.key, i) // 记录 key 对应的新索引
  }
}
```
- **目的**：快速通过 `key` 查找新节点位置，避免后续遍历。

---

### **2. 遍历旧节点，寻找可复用的节点**
```javascript
// newIndexToOldIndexMa表示新节点在旧节点中的索引（0 表示新节点无对应旧节点）。
const newIndexToOldIndexMap = new Array(toBePatched).fill(0)
for (i = s1; i <= e1; i++) {
  const prevChild = c1[i] // 旧子节点
  if (patched >= toBePatched) {
    unmount(prevChild) // 多余的旧节点直接卸载
    continue
  }
  
  // 通过 key 或遍历查找新节点位置
  let newIndex = prevChild.key != null 
    ? keyToNewIndexMap.get(prevChild.key) 
    : findIndexByType(prevChild, c2, s2, e2)

  if (newIndex === undefined) {
    unmount(prevChild) // 无对应新节点，卸载
  } else {
    newIndexToOldIndexMap[newIndex - s2] = i + 1 // 记录新旧索引关系
    patch(prevChild, c2[newIndex]) // 更新节点内容
    patched++
  }
}
```

- **核心操作**：
  - 复用相同 `key` 或同类型节点，通过 `patch()` 更新内容。
  - 无复用的旧节点被卸载。
  - 记录新旧索引映射到 `newIndexToOldIndexMap`（0 表示新节点无对应旧节点）。

---

### **3. 计算最长递增子序列（LIS）**
```javascript
const increasingNewIndexSequence = moved 
  ? getSequence(newIndexToOldIndexMap) 
  : []
```
- **目的**：LIS 代表**无需移动的节点**，其相对顺序在新旧列表中一致。
- **优化依据**：移动不在 LIS 中的节点，最小化 DOM 操作。

---

### **4. 移动或挂载新节点**
```javascript
for (i = toBePatched - 1; i >= 0; i--) {
  const nextIndex = s2 + i
  const nextChild = c2[nextIndex]
  
  if (newIndexToOldIndexMap[i] === 0) {
    // 全新节点，挂载
    patch(null, nextChild, container, anchor)
  } else if (moved) {
    // 需要移动的节点
    if (j < 0 || i !== increasingNewIndexSequence[j]) {
      move(nextChild, container, anchor)
    } else {
      j-- // LIS 中的节点保持不动
    }
  }
}
```
- **关键逻辑**：
  - 无对应旧节点时，挂载新节点。
  - 移动不在 LIS 中的节点到正确位置。
  - LIS 中的节点已处于正确位置，无需移动。

---

### **总结：替换循环元素的策略**
1. **复用**：通过 `key` 或类型匹配复用旧节点，更新内容。
2. **卸载**：无对应新节点的旧节点被移除。
3. **挂载**：新增节点插入到正确位置。
4. **移动优化**：通过 LIS 减少不必要的 DOM 移动。

这种算法以 `O(n)` 复杂度高效处理列表更新，优先复用节点，避免大规模 DOM 操作，是 Vue 高效渲染的核心机制之一。
