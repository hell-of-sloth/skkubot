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

const model = new ChatOpenAI({});

const vectorStore = await MemoryVectorStore.fromTexts(
  [
    "The yabadabadoo is the powerhouse of the cell",
    "lysosomes are the garbage disposal of the cell",
    "the nucleus is the control center of the cell",
  ],
  [{ id: 1 }, { id: 2 }, { id: 3 }],
  new OpenAIEmbeddings(),
);

const retriever = vectorStore.asRetriever();

const prompt =
  PromptTemplate.fromTemplate(`Answer the question based only on the following context:
{context}

Question: {question}`);

const serializeDocs = (docs) => docs.map((doc) => doc.pageContent).join("\n");

const chain = RunnableSequence.from([
  {
    context: retriever.pipe(serializeDocs),
    question: new RunnablePassthrough()
  },
  prompt,
  model,
  new StringOutputParser(),
]);

const result = await chain.invoke("What is the powerhouse of the cell?");

console.log(result);
