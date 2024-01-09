/* Retrieval-Augmented Generation 

    retrieval ⮕ prompt ⮕ model ⮕ parser
       ⬇   
    database 
  (vector store)
*/
process.env.OPENAI_API_KEY="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"; 

import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "langchain/schema/runnable";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { StringOutputParser } from "langchain/schema/output_parser";
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChromaClient } from "chromadb";
import { TextLoader } from "langchain/document_loaders/fs/text";

const model = new ChatOpenAI({});

// Create docs with a loader
const loader = new TextLoader("example.txt");
const docs = await loader.load();

// Create vector store and index the docs
const vectorStore = await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), {
  collectionName: "a-test-collection",
  url: "http://localhost:8000", // Optional, will default to this value
  collectionMetadata: {
    "hnsw:space": "cosine",
  }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
});

// Search for the most similar document
const retriever =  vectorStore.similaritySearch("성적 우수 장학금 신청해야하는 학과는?", 1);

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

const result = await chain.invoke("성적 우수 장학금 신청해야하는 학과는?");

console.log(result);
