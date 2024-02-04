import { Module } from '@nestjs/common';
import { ChatbotModule } from './chatbot/chatbot.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ChatbotModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
