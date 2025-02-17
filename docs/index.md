---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Lz blog"
  text: "记录学习、成长！"
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

# features:
#   - title: css编写技巧
#     details: 
#   - title: el-tabs切换，对象数据发生变化
#     details: 因为el-tabs组件的active发生改变，会重新渲染包含的子组件，虽然OperationRecord已经渲染过，但是会重新给它传递props，这是传了一个新的incomingValue对象，造成watch函数执行了操作。
  


