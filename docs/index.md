---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Lz blog"
  text: "记录开发日常"
  actions:
    - theme: brand
      text: 问题记录
      link: /问题记录/el-tabs切换，对象数据发生变化

features:
  - title: el-tabs切换，对象数据发生变化
    details: 因为el-tabs组件的active发生改变，会重新渲染包含的子组件，虽然OperationRecord已经渲染过，但是会重新给它传递props，这是传了一个新的incomingValue对象，造成watch函数执行了操作。
  


