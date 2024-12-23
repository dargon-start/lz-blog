import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lz blog",
  description: "记录开发日常",
  cleanUrls:true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: '问题记录', link: '/问题记录/el-tabs切换，对象数据发生变化' }
    ],

    sidebar: {
      '/':[
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        }
      ],
      '/问题记录/':[
        {
          text: '问题记录',
          items: [
            { text: 'el-tabs切换，对象数据发生变化', link: '/问题记录/el-tabs切换，对象数据发生变化' },
            { text: '测试路由', link: '/问题记录/index' }
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/dargon-start/lz-blog' }
    ]
  }
})
