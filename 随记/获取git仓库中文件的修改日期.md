# 获取git仓库中文件的修改日期

在博客首页显示文章最近更新时间，需要获取git仓库中文件的修改日期。

```js
import{ existsSync } from 'fs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { spawn } from 'child_process'
import { basename, join, dirname } from "path";

dayjs.extend(utc);
dayjs.extend(timezone);

// 路径转换为绝对路径
function transformUrlToPath(url: string) {
  const siteConfig = globalThis.VITEPRESS_CONFIG;
  
  let file = url.replace(/(^|\/)$/, "$1index").replace(/(\.html)?$/, ".md");
  file = siteConfig.rewrites.inv[file] || file;
  return join(siteConfig.srcDir, file);
}

// 获取git仓库中文件的修改日期
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
    // 时间转为中东时间
    child.on("close", () => resolve(dayjs(output).tz('Asia/Shanghai').format("YYYY-MM-DD HH:mm")));
    child.on("error", reject);
  })
}
```