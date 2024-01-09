import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChromaClient } from "chromadb";
import { TextLoader } from "langchain/document_loaders/fs/text";

process.env.OPENAI_API_KEY="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"; 

const client = new ChromaClient({
  path: "http://localhost:8000"
});

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
const response = await vectorStore.similaritySearch("성적 우수 장학금 신청해야하는 학과는?", 1);

const collections = await client.listCollections();

console.log(response);
console.log(collections);
/*
[
  Document {
    pageContent: 'Foo\nBar\nBaz\n\n',
    metadata: { source: 'src/document_loaders/example_data/example.txt' }
  }
]
*/