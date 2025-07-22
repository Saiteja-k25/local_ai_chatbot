
const axios = require('axios');

function streamLLM(prompt) {
  return axios.post('http://localhost:11434/api/generate', {
    model: "gemma:1b",
    prompt,
    stream: true
  }, { responseType: 'stream' });
}

module.exports = { streamLLM };