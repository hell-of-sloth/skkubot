import { ChatOpenAI } from '@langchain/openai';
import { Injectable } from '@nestjs/common';
import { ChromaClient } from 'chromadb';

require("dotenv").config();

const apiKey = process.env.OPENAI_API_KEY;

const client = new ChromaClient({
    path: "http://chroma:8000",
});

const model = new ChatOpenAI({

});
let vectorStore;

@Injectable()
export class ChatbotService {

    
}
