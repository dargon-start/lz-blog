import { MemoryVectorStore } from "@langchain/community/vectorstores/memory";
import { ZhipuAIEmbeddings } from "@langchain/community/embeddings/zhipuai";
import { ChatZhipuAI } from "@langchain/community/chat_models/zhipuai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { Document } from "@langchain/core/documents";
import { createReadStream } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VECTORS_PATH = path.join(__dirname, "vectors.json");
const TOP_K = 5;

// 模块级缓存，避免同一函数实例重复加载
let cachedVectorStore = null;

async function getVectorStore() {
  if (cachedVectorStore) {
    return cachedVectorStore;
  }

  const raw = await readFile(VECTORS_PATH, "utf-8");
  const { vectors } = JSON.parse(raw);

  // 使用 Embeddings 实例初始化，但不重新计算向量
  const embeddings = new ZhipuAIEmbeddings({
    model: "embedding-3",
    apiKey: process.env.OPENAI_API_KEY,
    batchSize: 32
  });

  const store = new MemoryVectorStore(embeddings);

  // 直接注入预计算的向量数据，无需重新 embed
  store.memoryVectors = vectors.map(v => ({
    content: v.content,
    embedding: v.embedding,
    metadata: v.metadata
  }));

  cachedVectorStore = store;
  return store;
}

const PROMPT_TEMPLATE = `你是 lz-blog 的智能助手，专门回答与博客文章相关的技术问题。
请根据以下检索到的上下文内容回答用户的问题。
如果上下文中没有足够信息，请直接告知用户，不要编造答案。
回答时保持专业、简洁、友好的语气，可以使用 Markdown 格式。

上下文:
{context}

问题: {question}

回答:`;

export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // 支持跨域
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { message } = req.body || {};
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "请提供有效的问题（message 字段）" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "服务器未配置 API Key" });
  }

  try {
    // 1. 加载向量库
    const vectorStore = await getVectorStore();

    // 2. 相似度检索
    const retriever = vectorStore.asRetriever(TOP_K);
    const sourceDocs = await retriever.getRelevantDocuments(message);
    const sources = [...new Set(sourceDocs.map(d => d.metadata.source))];

    // 3. 初始化 LLM（ZhipuAI GLM-4-Flash，支持流式）
    const llm = new ChatZhipuAI({
      model: "glm-4-flash",
      apiKey: process.env.OPENAI_API_KEY,
      temperature: 0.1,
      streaming: true
    });

    // 4. 构建 RAG Chain
    const prompt = PromptTemplate.fromTemplate(PROMPT_TEMPLATE);
    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocumentsAsString),
        question: new RunnablePassthrough()
      },
      prompt,
      llm,
      new StringOutputParser()
    ]);

    // 5. 设置 SSE 响应头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    // 6. 先发送参考来源
    res.write(`data: ${JSON.stringify({ type: "sources", sources })}\n\n`);

    // 7. 流式输出 LLM 回答
    const stream = await chain.stream(message);
    for await (const chunk of stream) {
      if (chunk) {
        res.write(`data: ${JSON.stringify({ type: "token", token: chunk })}\n\n`);
      }
    }

    // 8. 发送结束标记
    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (error) {
    console.error("[chat API error]", error);
    // 如果响应还没开始写，返回 JSON 错误
    if (!res.headersSent) {
      return res.status(500).json({ error: "内部服务器错误，请稍后重试" });
    }
    // 否则通过 SSE 发送错误
    res.write(`data: ${JSON.stringify({ type: "error", message: error.message })}\n\n`);
    res.end();
  }
}
