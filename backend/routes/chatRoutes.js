const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/chat', chatController);
//router.post('/chat/:chatId/message', chatController.sendMessage);
//router.post('/chat/:chatId/stop', chatController.stopMessage);
//router.get('/chats', chatController.getAllChats);
//router.get('/chat/:chatId', chatController.getChatById);

module.exports = router;
