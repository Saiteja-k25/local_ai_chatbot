(async () => {
  try {
    const res = await fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tinyllama',
        messages: [{ role: 'user', content: 'Hello from Node!' }],
        stream: false
      })
    });
    console.log(await res.text());
  } catch (err) {
    console.error('Error connecting to Ollama:', err);
  }
})();
