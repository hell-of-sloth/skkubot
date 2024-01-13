/* Retrieval-Augmented Generation 

    retrieval ⮕ prompt ⮕ model ⮕ parser
       ⬇   
    database 
  (vector store)
*/

require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;

const ChatOpenAI = require("langchain/chat_models/openai").ChatOpenAI;
const OpenAIEmbeddings = require("langchain/embeddings/openai").OpenAIEmbeddings;
const { PromptTemplate } = require("langchain/prompts");
const {
  RunnableSequence,
  RunnablePassthrough,
} = require("langchain/schema/runnable");
const { StringOutputParser } = require("langchain/schema/output_parser");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { ChromaClient } = require("chromadb");
const { TextLoader } = require("langchain/document_loaders/fs/text");

const client = new ChromaClient({
  path: "http://localhost:8000"
});
const model = new ChatOpenAI({
  apiKey: apiKey
});
let vectorStore;

async function initvectordb(userinput) {
  // Create docs with a loader
  const loader = new TextLoader(userinput);
  const docs = await loader.load();

  // Create vector store and index the docs
  vectorStore = await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), {
    collectionName: "skkubot",
    url: "http://localhost:8000", // Optional, will default to this value
    collectionMetadata: {
      "hnsw:space": "cosine",
    }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
  });
}

async function askAI(userinput){

const prompt =
  PromptTemplate.fromTemplate(`Answer the question based only on the following context:
{context}
Question: {question}`);

const serializeDocs = (docs) => docs.map((doc) => doc.pageContent).join("\n");

const chain = RunnableSequence.from([
  {
    context: vectorStore.asRetriever().pipe(serializeDocs),
    question: new RunnablePassthrough()
  },
  prompt,
  model,
  new StringOutputParser(),
]);

const result = await chain.invoke(userinput);

console.log(result);
return result;
}

module.exports = {
  initvectordb:initvectordb,
  askAI:askAI,
};

