const chatbotAI = require('../models/chatbotAI');

function getChatbot(req, res, next) {
  res.render("chatbot");
}

function postChatbot(req, res, next) {
  const question = req.body.inputString;
  console.log(question)
  res.redirect("/");
}

module.exports = {
    getChatbot,
    postChatbot
};