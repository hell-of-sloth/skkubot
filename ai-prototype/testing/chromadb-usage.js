import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChromaClient } from "chromadb";
import { TextLoader } from "langchain/document_loaders/fs/text";

const client = new ChromaClient({
    path: "http://localhost:8000"
});

await client.deleteCollection({
    name: 'a-test-collection'
});
await client.deleteCollection({
    name: 'my_collection'
});


const collections = await client.listCollections();

console.log(collections);