const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const pool = require('../db');

const chatController = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const systemPrompt = 'You are a helpful assistant. Respond clearly and concisely to user questions.';
    const chatPrompt = [
      `System: ${systemPrompt}`,
      ...history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`),
      `User: ${message}`,
      'Assistant:'
    ].join('\n');

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi',
        prompt: chatPrompt,
        stream: false
      })
    });

    const data = await response.json();
    const reply = data.response;

    await pool.query(
      'INSERT INTO chats (user_message, bot_reply) VALUES ($1, $2)',
      [message, reply]
    );

    res.json({ response: reply });
  } catch (err) {
    console.error('Error in chatController:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM chats ORDER BY created_at DESC LIMIT 20');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

module.exports = {
  createChat: chatController,
  getChatHistory
};
