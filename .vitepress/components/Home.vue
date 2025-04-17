<template>
  <VPFeatures :features="pages" ref="featureRef"/>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import VPFeatures from 'vitepress/dist/client/theme-default/components/VPFeatures.vue'
import { data as pages } from './create.data'

const featureRef = ref(null)

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