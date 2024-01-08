const express = require('express');
const router = express.Router();

const chatbot = require('../controllers/chatbot');

router.get('/', chatbot.getChatbot);
router.post('/', chatbot.postChatbot);

exports.router = router;