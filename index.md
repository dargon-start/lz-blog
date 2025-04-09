---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Lz blog"
  text: "龙仔的个人博客"
  tagline: "实践是检验真理的唯一标准！"
  image:
    src: /logo.png
    alt: VitePress
  actions:
    - theme: brand
      text: 随记
      link: /随记/el-tabs切换，对象数据发生变化
    - theme: brand
      text: CSS
      link: /CSS/css编写技巧
    - theme: brand
      text: JavaScript
      link: /JavaScript/语法基础
    - theme: brand
      text: Vue
      link: /Vue/Vue3基础
    - theme: brand
      text: 工程化
      link: /工程化/npm包打补丁

--- 


<script setup>
import Home from './.vitepress/components/Home.vue'
</script>

<Home />
