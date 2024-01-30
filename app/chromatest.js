const ChatOpenAI = require("@langchain/openai").ChatOpenAI;
const OpenAIEmbeddings = require("@langchain/openai").OpenAIEmbeddings;
const { PromptTemplate } = require("@langchain/core/prompts");
const {
  RunnableSequence,
  RunnablePassthrough,
} = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { ChromaClient } = require("chromadb");
const { TextLoader } = require("langchain/document_loaders/fs/text");

const client = new ChromaClient({
  path: "http://chroma:8000",
});
// const embedder = new OpenAIEmbeddingFunction({
//   openai_api_key: "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",
// });

// await client.deleteCollection({name: "skkubot"})
async function findcollections() {
  const collections = await client.listCollections();
  console.log(collections);
}

findcollections();
async function readdb() {
  const collection = await client.getCollection({
    name: "skkubot",
  });
  const results = await collection.peek({
    limit: 10,
  });
  console.log(results);
}
readdb();
