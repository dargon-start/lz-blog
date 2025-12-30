# 测试页面

这是一个用于测试 `test.vue` 组件的页面。

<script setup>
import Test from './.vitepress/components/test.vue'

const handleSubmit = (data) => {
  console.log('Received submit event in markdown:', data)
}

const handleUpdateTitle = (title) => {
  console.log('Received updateTitle event in markdown:', title)
}
</script>

<Test 
  title="测试标题" 
  @submit="handleSubmit"
  @updateTitle="handleUpdateTitle"
/>
