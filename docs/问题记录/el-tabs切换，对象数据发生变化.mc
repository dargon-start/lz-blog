```vue
<el-tabs v-model="active" class="mt12">
  <el-tab-pane name="operate" label="操作记录">
    <OperationRecord
      v-if="detail.rectQuestCode"
      :incomingValue="incomingValue"
    />
  </el-tab-pane>
  <el-tab-pane name="audit" label="审核记录">
    <AuditRecord
      v-if="detail.rectQuestCode"
      :auditConfig="auditConfig"
    />
  </el-tab-pane>
</el-tabs>

computed: {
  incomingValue() {
    return {
      moduleCode: 'xxx',
      functionCode: 'xxxx',
      operateCode: this.detail?.rectQuestCode,
    }
  },
  auditConfig() {
    return {
      moduleCode: 'xxxx',
      functionCode: 'xxxx',
      code: this.detail?.rectQuestCode,
    }
  },
},
```

```vue
//监控data中的数据变化
  watch: {
    incomingValue: {
      handler(val, pre) {
        if (Object.keys(val).length) {
          this.paramDTO = { ...val }
          this.getList()
        }
      },
      immediate: true,
    },
  },
```



incomingValue 需要传入一个引用对象，不能之家传一个对象

下面代码会造成监听incomingValue的值发生变化，重复调用接口

```vue
<OperationRecord
  v-if="detail.rectQuestCode"
  :incomingValue="{
    moduleCode: 'SGGL',
    functionCode: 'SGRW',
    code: this.detail?.rectQuestCode,
  }"
/>
```



造成原因：因为el-tabs组件的active发生改变，会重新渲染包含的子组件，虽然OperationRecord已经渲染过，但是会重新给它传递props，这是传了一个新的incomingValue对象，造成watch函数执行了操作。

