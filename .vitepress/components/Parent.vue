<template>
  <div class="parent-container" :style="{ borderColor: color }">
    <h2>Parent Component (Provider)</h2>
    <div class="controls">
      <label>
        Choose Theme Color:
        <input type="color" v-model="color" />
      </label>
      <span>Current Color: {{ color }}</span>
    </div>
    
    <div class="child-wrapper">
      <h3>Child Component Section</h3>
      <!-- Using the test component -->
      <TestComponent title="I am the Child" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import TestComponent from './test.vue'
import type { InjectionKey, Ref } from 'vue'

const themeColorKey: InjectionKey<Ref<number>> = Symbol('themeColor')
// const color = ref('#42b883') // Vue green default
// const color = 12
const color = ref<number>(12)

// Key 'themeColor' matches the inject key in test.vue
// We provide the Ref itself so it remains reactive in the child
provide(themeColorKey, color)
</script>

<style scoped>
.parent-container {
  padding: 20px;
  border: 2px solid;
  border-radius: 8px;
  margin: 20px;
}

.controls {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.child-wrapper {
  margin-top: 20px;
  padding: 20px;
  border: 1px dashed #ccc;
}
</style>
