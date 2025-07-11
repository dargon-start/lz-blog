// generateSidebar.js

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

/**
 * 获取某个文件的最后 Git 提交时间
 */
function getLastCommitTime(filePath) {
  try {
    const output = execSync(`git log -1 --format=%ad --date=iso ${filePath}`, {
      encoding: "utf8",
    });
    return output.trim();
  } catch (e) {
    console.warn(`Git commit time not found for ${filePath}`);
    return new Date().toISOString(); // fallback
  }
}

/**
 * 判断是否是 Markdown 文件
 */
function isMarkdownFile(file) {
  return file.endsWith(".md");
}

/**
 * 递归遍历目录并收集所有 .md 文件信息
 */
async function collectMarkdownFiles(startPath) {
  const files: any[] = [];

  function walk(currentPath, relativePath = "") {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relPath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath, relPath);
      } else if (isMarkdownFile(entry.name)) {
        const gitTime = getLastCommitTime(fullPath);
        const title = entry.name.replace(/\.md$/, "");
        const link = `${fullPath.replace(/\.md$/, "")}`;

        files.push({
          text: title,
          link,
          gitTime,
        });
      }
    }
  }

  walk(startPath);

  return files;
}

/**
 * 根据 Git 提交时间排序，并生成 VitePress 的 sidebar 配置
 */
async function generateSidebarConfig(docsDir = "./docs") {
  const files = await collectMarkdownFiles(docsDir);

  // 排序：最新的提交排在最前面
  files.sort(
    (a, b) => new Date(b.gitTime).getTime() - new Date(a.gitTime).getTime()
  );

  // 返回 VitePress 支持的 sidebar 数组结构
  return files.map(({ text, link }) => ({ text, link }));
}

export default generateSidebarConfig;
