const express = require('express');
const router = express.Router();

const chatbotController = require('../controllers/chatbot-controller');

router.get('/', chatbotController.getChatbot);
router.post('/question', chatbotController.postChatbot);
router.post('/add-to-DB', chatbotController.postVectorDB);
router.post('/deleteDB', chatbotController.postDeleteDB);

exports.routes = router;