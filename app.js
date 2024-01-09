// express 이용 간당한 서버 라우팅

const express = require('express');
const app = express();

const chatbotRouter = require('./routes/chatbot');

app.use(chatbotRouter.routes);

app.listen(3000);