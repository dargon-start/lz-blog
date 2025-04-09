import { createContentLoader } from 'vitepress'
import { basename, extname, sep, normalize } from "path";
import { spawn } from "child_process";
import { statSync } from "fs";
import dayjs from 'dayjs';
import type { Feature } from "vitepress/dist/client/theme-default/components/VPFeatures.vue";

type pageType = {
  title: string,
  details: string,
  link: string,
  linkText: string,
}

// 避免导入时报错
let data: Feature[];
export { data };


// 获取并处理所有文档数据，供首页等使用
// createContentLoader会默认忽略'**/node_modules/**', '**/dist/**'
export default createContentLoader(
  [
    "!(.vitepress|public|images|.guthub|components|snippets)/**/!(index|README).md",
  ],
  {
    includeSrc: true,
    async transform(rawData) {
      const pages: pageType[] = []

      rawData.forEach(({ frontmatter, src, url }) => {
        console.log("url", url);
        console.log("frontmatter", frontmatter);
        
        
        // 用页面的一级标题作为文章标题（因为sidebar中可能是精简的标题）
        let title:string =
          src?.match(/^\s*#\s+(.*)\s*$/m)?.[1] ||
          basename(url).replace(extname(url), "");

        // 标题可能用到了变量，需要替换
        const regexp = /\{\{\s*\$frontmatter\.(\S+?)\s*\}\}/g;
        let match;
        while ((match = regexp.exec(title)) !== null) {
          const replaceReg = new RegExp(
            "\\{\\{\\s*\\$frontmatter\\." + match[1] + "\\s*\\}\\}",
            "g"
          );
          title = title.replace(replaceReg, frontmatter[match[1]]);
        }

        // 链接去掉项目名
        const link = normalize(url)
          .split(sep)
          .filter((item) => item)
          .join(sep) || '';

        // 获取发布时间
        const page:pageType = {
          title,
          details: src
            // 去除html标签
            ?.replace(/<[^>]+?>/g, "")
            // 去除frontmatter
            .replace(/^---[\s\S]*?---/, "")
            // 去除标题
            .replace(/^#+\s+.*?$/gm, "")
            // 去除引用
            .replace(/^\>/gm, "")
            // 只保留反引号内部内容
            .replace(/`(.+?)`/g, "$1")
            // 只保留加粗、倾斜符号中的内容
            .replace(/\*{1,3}(.+?)\*{1,3}/g, "$1")
            // 只保留跳转内容
            .replace(/\[(.+?)\]\(.+?\)/g, "$1")
            // 去除提示块
            .replace(/^:::.*$/gm, "")
            // 统一空白字符为一个空格
            .replace(/\s/g, " ")
            // 仅保留可能显示的部分，减小数据大小
            .slice(0, 200) || "",
          link,
          // linkText 可以显示更新时间
          linkText: dayjs(frontmatter.date).format('YYYY-MM-DD HH:mm:ss'),
        }

        pages.push(page);
      });

      // return pages;
      // 更新时间降序排列
      return pages.sort((a, b) => {
        let time1 = dayjs(a.linkText);
        let time2 = dayjs(b.linkText);
        return time1.isAfter(time2) ? 1 : -1;
      })
      // 发布时间降序排列
      
      // return pages.sort((a, b) => b.fileTimeInfo[0] - a.fileTimeInfo[0]);
    },
  }
);