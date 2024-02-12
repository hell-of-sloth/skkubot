import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { addDBDto } from './dto/addDB.dto';
import { questionDto } from './dto/question.dto';

@Controller('chatbot')
export class ChatbotController {
    constructor(private chatbotService: ChatbotService) { }

    @Get()
    getChatbot(): void {
        // 프론트 엔드 출력용
    }

    @Post('addDB')
    postVectorDB(@Body() adddbdto: addDBDto): Promise<void> {
        const { filename } = adddbdto;
        console.log(filename);
        return this.chatbotService.startvectordb(filename);
    }

    @Post('question')
    postChatbot(@Body() questiondto: questionDto): Promise<string> {
        const { question } = questiondto;
        console.log(question);
        return this.chatbotService.askAI(question);
    }

    @Delete('resetDB')
    deleteResetDB(): Promise<void> {
        return this.chatbotService.resetDB();
    }
}
