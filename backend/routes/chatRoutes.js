const express = require('express');
const router = express.Router();
const { createChat, getChatHistory } = require('../controllers/chatController');

router.post('/chat', createChat);
router.get('/history', getChatHistory);

module.exports = router;
