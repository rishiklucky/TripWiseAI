const axios = require('axios');
const env = require('../../config/env');

class GroqProvider {
  static async generate(promptText) {
    const apiKey = env.ai.groqKey;
    if (!apiKey) {
      const error = new Error('Groq API key is not configured');
      error.statusCode = 401;
      throw error;
    }

    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

    const payload = {
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: promptText }],
      temperature: 0.4,
      response_format: { type: 'json_object' },
    };

    try {
      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      const text = response.data?.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error('Empty content from Groq API');
      }
      return text;
    } catch (err) {
      const status = err.response?.status || 500;
      const message = err.response?.data?.error?.message || err.message;
      const error = new Error(`Groq Provider Error (${status}): ${message}`);
      error.statusCode = status;
      throw error;
    }
  }
}

module.exports = GroqProvider;
