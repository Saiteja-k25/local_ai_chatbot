const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// In-memory chat history
let chatHistory = [];

app.use(cors());
app.use(bodyParser.json());

// Chat endpoint
app.post('/ollama', async (req, res) => {
  const userMessage = req.body.message;
  console.log('Received message:', userMessage);

  try {
    console.log('Connecting to Ollama at http://localhost:11434/api/chat');

    const ollamaRes = await fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tinyllama',
        messages: [{ role: 'user', content: userMessage }],
        stream: false // Request a single JSON response
      })
    });

    console.log('Ollama response status:', ollamaRes.status);

    if (!ollamaRes.ok) {
      console.error('Ollama API failed with status:', ollamaRes.status);
      const reply = `⚠️ Ollama API error (status ${ollamaRes.status}).`;
      chatHistory.push({ user_message: userMessage, bot_reply: reply });
      return res.json({ response: reply });
    }

    const text = await ollamaRes.text();
    console.log('Raw Ollama response:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('Failed to parse Ollama response:', err);
      const reply = '🤖 Mock reply: Ollama returned invalid JSON.';
      chatHistory.push({ user_message: userMessage, bot_reply: reply });
      return res.json({ response: reply });
    }

    const reply = data.message?.content || '⚠️ No response from Ollama.';
    chatHistory.push({ user_message: userMessage, bot_reply: reply });

    return res.json({ response: reply });
  } catch (err) {
    console.error('Error connecting to Ollama:', err);
    const reply = `🤖 Mock reply: Hello! (Ollama is unreachable)`;
    chatHistory.push({ user_message: userMessage, bot_reply: reply });
    return res.json({ response: reply });
  }
});

// History endpoint
app.get('/api/history', (req, res) => {
  console.log('History requested');
  res.json(chatHistory.slice(-20));
});

// Health check
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
