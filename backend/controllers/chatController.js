// backend/controllers/chatController.js
// Using native fetch (Node.js 18+)
const chatController = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Add system-level prompt to guide the model
    const systemPrompt = 'You are a helpful assistant. Respond clearly and concisely to user questions.';

    // Format chat history with system prompt
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
        model: 'mistral',
        prompt: chatPrompt,
        stream: false
      })
    });

    const data = await response.json();
    const reply = data.response;

    res.json({ response: reply });
  } catch (err) {
    console.error('Error in chatController:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = chatController;
