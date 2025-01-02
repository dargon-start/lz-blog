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

  console.log(items);
  
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
  themeConfig: {
    logo:'/logo.jpg',
    nav: [
      { text: '问题记录', link: '/问题记录/el-tabs切换，对象数据发生变化' },
      { text: 'JavaScript', link: '/JavaScript/基本引用类型' }

    ],
    sidebar: {
      '/问题记录/':[
        {
          text: '问题记录',
          items: [
            { text: 'el-tabs切换，对象数据发生变化', link: '/问题记录/el-tabs切换，对象数据发生变化' },
            { text: '测试路由', link: '/问题记录/index' }
          ]
        }
      ],
      '/JavaScript/': [walk('./docs/','JavaScript')]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/dargon-start/lz-blog' }
    ]
  }
})
