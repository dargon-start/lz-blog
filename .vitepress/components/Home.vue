<template>
  <VPFeatures :features="pages" ref="featureRef"/>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import VPFeatures from 'vitepress/dist/client/theme-default/components/VPFeatures.vue'
import { data as pages } from './create.data'


const featureRef = ref(null)

// onMounted(() => {
//   nextTick(() => {
//     // 处理文本省略
//     console.log(featureRef.value);
    
//     const details = featureRef.value?.$el.querySelectorAll('.VPLink  .details') as NodeListOf<HTMLElement>
//     console.log(details);

//     for (let i = 0; i < details.length; i++) {
//       const el = details[i] as HTMLElement
//       const s = el.innerText;
//       const n = el.offsetHeight; 

//       for(let i=0; i<s.length; i++) {
//         el.innerHTML = s.slice(0, i);
//         if(n < el.scrollHeight) {
//           el.style.overflow = 'hidden';
//           el.innerHTML = s.slice(0, i-3) + '...';
//           break;
//         }
//       }
//     }
//   })
// })



</script>

<style>
.VPLink .title{
  height: 50px !important; 
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.VPLink .details {
  height: 50px !important; 
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.vp-doc a {
  text-decoration: none;
}

.vp-doc h2 {
  margin: 0;
  border: none;
  padding: 0;
}
</style>