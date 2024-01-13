// express 이용 간당한 서버 라우팅

const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

const {Pool}= require('pg');
const pg = new Pool({
    user:'postgres',
    host:'localhost',
    database:'postgres',
    password:'1234',
    port:5432
})

pg.connect(err=>{
    if(err) console.log(err);
    else{
        console.log("db connected");
    }
})

const chatbotRouter = require('./routes/chatbot');

app.use(chatbotRouter.routes);

app.listen(3000);