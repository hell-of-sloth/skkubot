/* Retrieval-Augmented Generation 

    retrieval ⮕ prompt ⮕ model ⮕ parser
       ⬇   
    database 
  (vector store)
*/

require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;

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
  path: "http://localhost:8000"
});
const model = new ChatOpenAI({
  apiKey: apiKey
});
let vectorStore;

async function initvectordb(userinput) { //vectorDB에 들어갈 txt 파일 경로 변수로 받음
  // Create docs with a loader
  const loader = new TextLoader(userinput);
  const docs = await loader.load();

  // Create vector store and index the docs
  vectorStore = await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), { //collection이 없으면 생성 있으면 추가해줌
    collectionName: "skkubot",
    url: "http://localhost:8000", // Optional, will default to this value
    collectionMetadata: {
      "hnsw:space": "cosine",
    }, 
  });
} //결국 scrapper로 각 공지사항 TXT파일로 만들어서 이 함수 반복해서 돌리는 것도 방법일듯

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

async function resetDB(){
  await client.deleteCollection({name: "skkubot"})
const collections = await client.listCollections();

console.log(collections)
}

module.exports = {
  initvectordb:initvectordb,
  askAI:askAI,
  resetDB:resetDB
};

