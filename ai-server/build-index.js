import "dotenv/config";
import fs from "fs";
import path from "path";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ZhipuAIEmbeddings } from "@langchain/community/embeddings/zhipuai"; 
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
// import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const ROOT_PATH = "../";
const INDEX_PATH = "./faiss_index";
const EXCLUDE_DIRS = ["node_modules", ".vitepress", ".git", "ai-server", "public", ".gemini", "test"];

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

      // 为该文件的所有文档块添加相对路径元数据
      return docs.map(doc => {
        doc.metadata.source = path.relative(ROOT_PATH, file);
        return doc;
      });
    })
  )).flat();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 150
  });

  const splitDocs = await splitter.splitDocuments(documents);

  console.log(process.env.OPENAI_BASE_URL);
  

  const embeddings = new ZhipuAIEmbeddings({
    model: "embedding-3",
    apiKey: process.env.OPENAI_API_KEY,
    batchSize: 32
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  // await vectorStore.save(INDEX_PATH);

  console.log("✅ VitePress 文档索引构建完成");
  console.log("✅ 索引构建完成！内存中可用。");

  // vectorStore 已就绪，可直接 similaritySearch
  const testResults = await vectorStore.similaritySearch("git tag", 10);
  
  // 检索结果去重：基于 metadata.source
  const uniqueSources = [...new Set(testResults.map(d => d.metadata.source))];
  console.log("🧪 测试检索 (已去重):", uniqueSources);
}

buildIndex();