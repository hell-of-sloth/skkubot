const chatbotAI = require("../models/chatbotAI");

function getChatbot(req, res, next) {
  res.render("chatbot");
}

async function postChatbot(req, res, next) {
  const question = req.body.inputString;
  console.log(question)
  await chatbotAI.addvectordb()
  chatbotAI.askAI()
  res.redirect("/");
}

module.exports = {
    getChatbot,
    postChatbot
};