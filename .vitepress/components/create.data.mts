import { createContentLoader } from 'vitepress'
import { basename, extname, sep, normalize, join, dirname } from "path";
import{ existsSync } from 'fs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { spawn } from 'child_process'
import type { Feature } from "vitepress/dist/client/theme-default/components/VPFeatures.vue";


dayjs.extend(utc);
dayjs.extend(timezone);

type pageType = {
  title: string,
  details: string,
  link: string,
  linkText: string,
}

declare global {
  var VITEPRESS_CONFIG: {
    srcDir: string;
    rewrites: {
      inv: Record<string, string>;
    };
  };
}

// 避免导入时报错
let data: Feature[];
export { data };

function transformUrlToPath(url: string) {
  const siteConfig = globalThis.VITEPRESS_CONFIG;

  let file = url.replace(/(^|\/)$/, "$1index").replace(/(\.html)?$/, ".md");
  file = siteConfig.rewrites.inv[file] || file;
  return join(siteConfig.srcDir, file);
}

async function getLastModified(filePath, cwd = process.cwd()) {
  const file = transformUrlToPath(filePath);

  return new Promise((resolve, reject) => {
    const cwd = dirname(file);
    if (!existsSync(cwd)) return resolve(0);
    const fileName = basename(file);

    const args = [
      'log', 
      '-1',                  // 只取最后一次提交
      '--pretty=format:%aI', // ISO 8601 格式时间
      '--', 
      fileName
    ]

    const child = spawn('git', args, { cwd })

    let output = "";
    child.stdout.on("data", (data: Buffer) => (output += String(data)));
    child.on("close", () => resolve(dayjs(output).tz('Asia/Shanghai').format("YYYY-MM-DD HH:mm")));
    child.on("error", reject);
  })
}

// 获取并处理所有文档数据，供首页等使用
// createContentLoader会默认忽略'**/node_modules/**', '**/dist/**'
export default  createContentLoader(
  [
    "!(.vitepress|public|images|.guthub|components|snippets)/**/!(index|README).md",
  ],
  {
    includeSrc: true,
    async transform(rawData) {
      const pages: pageType[] = []

      await Promise.all(
        rawData.map(async ({ frontmatter, src, url }) => {
        
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
  
          // 获取文件修改时间
          const lastModified  = await getLastModified(url)
          
  
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
              .slice(0, 50) || "",
            link,
            // linkText 可以显示更新时间
            linkText: lastModified as string ?? dayjs(frontmatter.date).tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm'),
          }
  
          pages.push(page);
        })
      )

      // 更新时间降序排列
      return pages.sort((a, b) => {
        let time1 = dayjs(a.linkText);
        let time2 = dayjs(b.linkText);
        return time1.isAfter(time2) ? -1 : 1;
      })
      // 发布时间降序排列
      
      // return pages.sort((a, b) => b.fileTimeInfo[0] - a.fileTimeInfo[0]);
    },
  }
);