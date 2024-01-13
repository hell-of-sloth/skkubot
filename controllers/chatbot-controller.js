const chatbotAI = require("../models/chatbotAI");

function getChatbot(req, res, next) {
  res.render("chatbot",{
    question : '',
    answer : ''
  });
}
async function postVectorDB(req,res,next){
  const filename = req.body.filename;
  await chatbotAI.initvectordb(filename)
  console.log(filename);
  res.render("chatbot",{
    question : '',
    answer : ''
  });
}

async function postChatbot(req, res, next) {
  const question = req.body.question;
  console.log(question)
  answer = await chatbotAI.askAI(question)
  res.render("chatbot",{
    question, answer
  });
}

module.exports = {
    getChatbot,
    postChatbot,
    postVectorDB
};