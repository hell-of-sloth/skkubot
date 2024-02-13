import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ChromaClient } from 'chromadb';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { Chroma } from '@langchain/community/vectorstores/chroma'
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ConfigService } from '@nestjs/config';

// require("dotenv").config(); nestjs에서는 @nestjs/config를 사용하여 환경변수를 설정하는 것을 권장



@Injectable()
export class ChatbotService {
    constructor(private configService: ConfigService) { }

    apiKey = this.configService.get<string>('OPENAI_API_KEY');
    client = new ChromaClient({
        path: "http://chroma:8000",
    });

    model = new ChatOpenAI({
        openAIApiKey: this.apiKey,
    });

    async startvectordb(userinput: string): Promise<void> {
        //vectorDB에 들어갈 txt 파일 경로 변수로 받음
        // Create docs with a loader
        const loader = new TextLoader(userinput);
        const docs = await loader.load();

        // Create a new vector store and index the docs
        await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), {
            //collection이 없으면 생성 있으면 추가해줌
            collectionName: "skkubot",
            url: "http://chroma:8000",
            collectionMetadata: {
            "hnsw:space": "cosine",
            },
        });
    } //결국 scrapper로 각 공지사항 TXT파일로 만들어서 이 함수 반복해서 돌리는 것도 방법일듯

    async askAI(userinput: string): Promise<string> {
        const vectorStore = await Chroma.fromExistingCollection(
            new OpenAIEmbeddings(),
            { collectionName: "skkubot" }
          );

        const prompt =
            PromptTemplate.fromTemplate(`Answer the question based only on the following context:
            {context}
            Question: {question}`);

        const serializeDocs = (docs) => docs.map((doc) => doc.pageContent).join("\n");

        const chain = RunnableSequence.from([
            {
                context: vectorStore.asRetriever().pipe(serializeDocs),
                question: new RunnablePassthrough(),
            },
            prompt,
            this.model,
            new StringOutputParser(),
        ]);
            
        const result = await chain.invoke(userinput);

        console.log(result);
        return result;
    }

    async resetDB(): Promise<void> {
        await this.client.deleteCollection({ name: "skkubot" });
        const collections = await this.client.listCollections();

        console.log(collections);
    }
}
