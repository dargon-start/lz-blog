import { defineConfig } from 'vitepress'
import path from 'path';
import fs from 'fs';

// 动态生成侧边栏函数
export const walk = function (dir, subDir = '') {
	let results:any[] = [];
	const list = fs.readdirSync(dir + subDir);
  
	list.forEach((file) => {
		file = dir + subDir+ '/' + file;
		if (path.extname(file) === '.md') {
			results.push(file);
		}
	})
	const items = results.map((item) => {
		return {
			text: path.basename(item, '.md'),
			link: item.slice(6,-3)
		}
	}).sort((a, b) => {
		const index1 = Number(a.text.split('.')[0])
		const index2 = Number(b.text.split('.')[0])
		return index1 - index2
	})
  
	return {
		text: subDir,
		collapsible: true,
		collapsed: false,
		items: items
	}
};

const baseDir = './docs/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Lz blog",
  description: "记录开发日常",
  cleanUrls:true,
  head: [
    ['link', { rel: 'icon', href: '/logo.jpg' }]
  ],
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
    logo:'/logo.jpg',
    nav: [
      { text: '随记', link: '/随记/el-tabs切换，对象数据发生变化' },
      { text: 'JavaScript', link: '/JavaScript/基本引用类型' },
      { text: 'CSS', link: '/CSS/css中隐藏元素的方式' },
      { text: '工程化', link: '/工程化/npm包打补丁' },
      { text: 'Vue', link: '/Vue/Vue3基础' },
    ],
    sidebar: {
      '/随记/':[walk('./docs/','随记')],
      '/JavaScript/': [walk('./docs/','JavaScript')],
      '/CSS/':[walk('./docs/','CSS')],
      '/工程化':[walk('./docs/', '工程化')],
      '/Vue':[walk('./docs/', 'Vue')],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dargon-start/lz-blog' }
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
})
