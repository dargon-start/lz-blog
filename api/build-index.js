import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ZhipuAIEmbeddings } from "@langchain/community/embeddings/zhipuai";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_PATH = path.resolve(__dirname, "../");
const OUTPUT_PATH = path.resolve(__dirname, "../api/vectors.json");
const EXCLUDE_DIRS = ["node_modules", ".vitepress", ".git", "ai-server", "public", ".gemini", "test", "api"];

function getAllMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        getAllMarkdownFiles(fullPath, fileList);
      }
    } else if (file.endsWith(".md") && file !== "README.md") {
      fileList.push(fullPath);
    }
  });

  return fileList;
}

async function buildIndex() {
  console.log("🔍 正在扫描文档...");
  const files = getAllMarkdownFiles(ROOT_PATH);
  console.log(`Found ${files.length} markdown files.`);

  const documents = (await Promise.all(
    files.map(async (file) => {
      const loader = new TextLoader(file);
      const docs = await loader.load();

      return docs.map(doc => {
        doc.metadata.source = path.relative(ROOT_PATH, file).replace(/\\/g, "/");
        return doc;
      });
    })
  )).flat();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 150
  });

  const splitDocs = await splitter.splitDocuments(documents);
  console.log(`📄 共切分为 ${splitDocs.length} 个文档块`);

  const embeddings = new ZhipuAIEmbeddings({
    model: "embedding-3",
    apiKey: process.env.OPENAI_API_KEY,
    batchSize: 32
  });

  console.log("⚡ 正在生成向量 Embeddings（智谱 AI）...");
  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);

  // 序列化向量数据，保存到 api/vectors.json 供 Vercel 函数使用
  const memoryVectors = vectorStore.memoryVectors;
  const outputData = {
    createdAt: new Date().toISOString(),
    count: memoryVectors.length,
    vectors: memoryVectors.map(v => ({
      content: v.content,
      embedding: v.embedding,
      metadata: v.metadata
    }))
  };

  // 确保 api 目录存在
  const apiDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(outputData));
  const fileSizeKB = (fs.statSync(OUTPUT_PATH).size / 1024).toFixed(1);
  console.log(`✅ 向量索引已保存到 ${OUTPUT_PATH}（${fileSizeKB} KB，共 ${memoryVectors.length} 条）`);

  // 测试检索
  const testResults = await vectorStore.similaritySearch("git tag", 5);
  const uniqueSources = [...new Set(testResults.map(d => d.metadata.source))];
  console.log("🧪 测试检索 (已去重):", uniqueSources);
}

buildIndex();