import "dotenv/config";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { FAISS } from "@langchain/community/vectorstores/faiss";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";

const INDEX_PATH = "./faiss_index";

async function query(question) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ 错误: 请在 .env 文件中设置 OPENAI_API_KEY");
    return;
  }

  console.log(`🤖 正在思考: "${question}"...`);

  // 1. 加载 Embeddings 和向量库
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small"
  });

  const vectorStore = await FAISS.load(INDEX_PATH, embeddings);
  const retriever = vectorStore.asRetriever();

  // 2. 初始化 LLM
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0
  });

  // 3. 自定义 Prompt
  const template = `你是一个博客智能助手。请根据以下提供的上下文内容来回答用户的问题。
如果你不知道答案，就直接说不知道，不要尝试编造答案。
回答时请保持专业且友好的语气。

上下文:
{context}

问题: {question}

回答:`;

  const prompt = PromptTemplate.fromTemplate(template);

  // 4. 使用 LCEL 构建 RAG 链
  // 我们需要手动处理 sourceDocuments 的返回，所以使用 RunnableSequence
  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough()
    },
    prompt,
    model,
    new StringOutputParser()
  ]);

  // 5. 执行查询
  // 为了能拿到源文档，我们先单独检索一下
  const sourceDocs = await retriever.getRelevantDocuments(question);
  const result = await chain.invoke(question);

  console.log("\n✨ 回答:");
  console.log(result);

  console.log("\n📚 参考文档:");
  const sources = [...new Set(sourceDocs.map(doc => doc.metadata.source))];
  sources.forEach(src => console.log(`- ${src}`));
}

const userQuestion = process.argv.slice(2).join(" ");
if (userQuestion) {
  query(userQuestion);
} else {
  console.log("用法: node query-agent.js \"你的问题\"");
}
