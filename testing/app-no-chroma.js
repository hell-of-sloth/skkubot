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
    "교육학과, 한문교육과는 별도의 성적우수장학금을 신청하지 않으셔도 학과에서 선발을 진행합니다. 컴퓨터교육과, 수학교육과는 GLS로 성적우수장학금을 신청해야지만 신청자 중에서 선발하여 장학금을 받을 수 있습니다.",
    "2024년도 겨울 졸업예정자에 대한 교원자격무시험검정원서를 학생 소속 대학 행정실에서 다음과 같이 접수하오니 교원자격 취득요건을 모두 충족한 해당 학생은 기한 내에 반드시 제출하기 바랍니다.",
    "내년 세계조사학회(World Association for Public Opinion Research, WAPOR)/세계조사학회 아시아 퍼시픽(WAPOR ASIA PACIFIC)  공동 학술대회가 2024년 7월28일부터  31일까지  성균관대학교 국제관에서 개최되며, 학술대회 논문 모집을 공고합니다. ",
  ],
  [{ id: 1 }, { id: 2 }, { id: 3 }],
  new OpenAIEmbeddings(),
);

const retriever = ScoreThresholdRetriever.fromVectorStore(vectorStore, {
  minSimilarityScore: 0.9, // Finds results with at least this similarity score
  maxK: 100, // The maximum K value to use. Use it based to your chunk size to make sure you don't run out of tokens
  kIncrement: 2, // How much to increase K by each time. It'll fetch N results, then N + kIncrement, then N + kIncrement * 2, etc.
});

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

const result = await chain.invoke("성적 우수 장학금 신청해야하는 학과는?");

console.log(result);
