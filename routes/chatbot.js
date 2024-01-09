const express = require('express');
const router = express.Router();

const chatbotController = require('../controllers/chatbot-controller');

router.get('/', chatbotController.getChatbot);
router.post('/', chatbotController.postChatbot);

exports.routes = router;