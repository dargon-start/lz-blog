import { defineConfig } from "vitepress";
import { La51Plugin } from "vitepress-plugin-51la";
import generateSidebar from "./generateSidebar";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lz blog",
  description: "龙仔个人博客",
  cleanUrls: true,
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  // 忽略文章中的死链接，VitePress 不会因死链接而导致构建失败
  ignoreDeadLinks: true,
  // 是否展示最近git提交时间
  lastUpdated: true,
  // markdown-it插件配置
  markdown: {
    // 默认显示行号
    lineNumbers: true,
    // 不写语言名时，默认识别为js
    defaultHighlightLang: "js",
  },
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "随记", link: "/随记/el-tabs切换，对象数据发生变化" },
      { text: "JavaScript", link: "/JavaScript/基本引用类型" },
      { text: "CSS", link: "/CSS/css中隐藏元素的方式" },
      { text: "工程化", link: "/工程化/npm包打补丁" },
      { text: "Vue", link: "/Vue/Vue3基础" },
      { text: "React", link: "/React/Immutable" },
      { text: "SSR", link: "/SSR/nextJs渲染原理" },
      { text: "NestJs", link: "/NestJs/初始NestJs" },
    ],
    sidebar: {
      "/随记/": [{ text: "随记", items: await generateSidebar("./随记") }],
      "/JavaScript/": [
        { text: "JavaScript", items: await generateSidebar("./JavaScript") },
      ],
      "/CSS/": [{ text: "CSS", items: await generateSidebar("./CSS") }],
      "/工程化/": [
        { text: "工程化", items: await generateSidebar("./工程化") },
      ],
      "/Vue/": [{ text: "Vue", items: await generateSidebar("./Vue") }],
      "/React/": [{ text: "React", items: await generateSidebar("./React") }],
      "/SSR/": [{ text: "SSR", items: await generateSidebar("./SSR") }],
      "/NestJs": [
        {
          text: "NestJs",
          items: await generateSidebar("./NestJs"),
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/dargon-start/lz-blog" },
    ],

    // 右侧文章索引级别
    outline: "deep",
    // 右侧索引展示文本
    outlineTitle: "目录",

    // git提交时间展示文本
    lastUpdatedText: "更新时间",
    // 回到顶部展示文本
    returnToTopLabel: "回到顶部",
    // 移动端展示弹出sidebar展示文本
    sidebarMenuLabel: "菜单",

    // 搜索功能
    search: {
      // 使用本地搜索
      provider: "local",
      options: {
        // 配置搜索组件展示文本
        translations: {
          button: {
            buttonText: "搜索文档",
          },
          modal: {
            displayDetails: "显示详情",
            noResultsText: "未找到相关结果",
            resetButtonTitle: "清除",
            footer: {
              closeText: "关闭",
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
  },
  vite: {
    plugins: [
      La51Plugin({
        id: "3LnhWXc4ckxdNjVU",
        ck: "3LnhWXc4ckxdNjVU",
      }),
    ],
  },
});
