<template>
  <div>
    <h1>{{ title }}</h1>
    <button @click="emits('submit', 'test')">submit</button>
    <button @click="emits('updateTitle', 'new title')">updateTitle</button>
    <button @click="count++">{{ count }}</button>
    <button @click="obj.name = 'new name'">{{ obj.name }}</button>
    <p :style="{ color: themeColor }">Injected Theme Color: {{ themeColor }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed ,inject} from 'vue'

const emits = defineEmits({
  submit: (data: string) => {
    console.log(data)
    if(data === '空'){
      return false
    }
    return true
  },
  updateTitle: (title: string) => {
    console.log(title)
    return true
  }
})

const props = withDefaults(defineProps<{ title: string }>(), {
    title: 'default title'
})

//vue 3.5以上可以直接解构props，否则会导致响应式失效
const { title } = props


const count = ref<number>(0)
const obj: { name: string, age: number } = reactive({
  name: 'test',
  age: 18
})

const totle = computed<number>(() => {
  return count.value + obj.age
})

const themeColor = inject<string>('themeColor', 'yellow')





</script>
<style scoped >

</style>