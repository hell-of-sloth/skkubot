// express 이용 간당한 서버 라우팅

const express = require('express');
const app = express();

const chatbot = require('./routes/chatbot');

app.use('/', chatbot);

app.listen(3000);