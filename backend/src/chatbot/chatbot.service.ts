import { ChatOpenAI, OpenAIEmbeddings, OpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ChromaClient } from 'chromadb';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { PromptTemplate } from '@langchain/core/prompts';
import {
    RunnableSequence,
    RunnablePassthrough,
} from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ConfigService } from '@nestjs/config';
import { loadSummarizationChain, AnalyzeDocumentChain } from 'langchain/chains';
import * as fs from 'fs';

// require("dotenv").config(); nestjs에서는 @nestjs/config를 사용하여 환경변수를 설정하는 것을 권장

@Injectable()
export class ChatbotService {
    constructor(private configService: ConfigService) {}

    apiKey = this.configService.get<string>('OPENAI_API_KEY');
    client = new ChromaClient({
        path: 'http://chroma:8000',
    });

    model = new ChatOpenAI({
        modelName: 'gpt-3.5-turbo-0125',
        openAIApiKey: this.apiKey,
    });

    async addvectordb(userinput: string): Promise<void> {
        //vectorDB에 들어갈 txt 파일 경로 변수로 받음
        // Create docs with a loader
        const loader = new TextLoader(userinput);
        const docs = await loader.load();

        // Create a new vector store and index the docs
        await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), {
            //collection이 없으면 생성 있으면 추가해줌
            collectionName: 'skkubot',
            url: 'http://chroma:8000',
            collectionMetadata: {
                'hnsw:space': 'cosine',
            },
        });
    } //결국 scrapper로 각 공지사항 TXT파일로 만들어서 이 함수 반복해서 돌리는 것도 방법일듯
    i = 0;
    async testaddvectordb(userinput: string): Promise<void> {
        //token count 넘어가는 것만 시행하는 방식으로
        //version 1
        // const text = fs.readFileSync(userinput, 'utf8');
        // const model = new OpenAI({
        //     modelName: 'gpt-3.5-turbo-0125',
        //     temperature: 0,
        // });
        // const combineDocsChain = loadSummarizationChain(model);
        // const chain = new AnalyzeDocumentChain({
        //     combineDocumentsChain: combineDocsChain,
        // });
        // const res = await chain.call({
        //     input_document: text,
        // });
        //version 2
        const text = fs.readFileSync(
            'src/scrapper/txt_files/2024학년.txt', // 이부분을 userinput으로 받아서 돌리면 될듯
            'utf8',
        );

        const prompt = PromptTemplate.fromTemplate(
            `
    You are an expert in providing information to students.
    Your goal is to make a school notice just a little bit shorter.
    Below you find the text of a school notice:
    --------
    {text}
    --------
    Try to keep as much information as possible.
    Provide a very detailed answer.
    The result should be the original text with as little text removed as possible.
    
    result:
    `,
        );

        const chain = RunnableSequence.from([
            {
                text: new RunnablePassthrough(),
            },
            prompt,
            this.model,
            new StringOutputParser(),
        ]);
        const result = await chain.invoke(text);
        const txtfile = [result];
        await Chroma.fromTexts(
            txtfile,
            [{ id: this.i++ }],
            new OpenAIEmbeddings(),
            {
                //collection이 없으면 생성 있으면 추가해줌
                collectionName: 'skkubot',
                url: 'http://chroma:8000',
                collectionMetadata: {
                    'hnsw:space': 'cosine',
                },
            },
        );
    }

    async askAI(userinput: string): Promise<string> {
        const vectorStore = await Chroma.fromExistingCollection(
            new OpenAIEmbeddings(),
            {
                collectionName: 'skkubot',
                url: 'http://chroma:8000',
                collectionMetadata: {
                    'hnsw:space': 'cosine',
                },
            },
        );

        const prompt =
            PromptTemplate.fromTemplate(`Answer the question based only on the following context:
            {context}
            Question: {question}`);

        const serializeDocs = (docs) =>
            docs.map((doc) => doc.pageContent).join('\n');

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
        await this.client.deleteCollection({ name: 'skkubot' });
        const collections = await this.client.listCollections();

        console.log(collections);
    }
}
