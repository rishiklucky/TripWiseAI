const axios = require('axios');
const env = require('../../config/env');

class OpenRouterProvider {
  static async generate(promptText) {
    const apiKey = env.ai.openrouterKey;
    if (!apiKey) {
      const error = new Error('OpenRouter API key is not configured');
      error.statusCode = 401;
      throw error;
    }

    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

    const payload = {
      model: 'openai/gpt-oss-120b:free',
      messages: [{ role: 'user', content: promptText }],
      temperature: 0.4,
    };

    try {
      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://tripwise.ai',
          'X-Title': 'TripWise AI Planner',
        },
        timeout: 30000,
      });

      const text = response.data?.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error('Empty content from OpenRouter API');
      }
      return text;
    } catch (err) {
      const status = err.response?.status || 500;
      const message = err.response?.data?.error?.message || err.message;
      const error = new Error(`OpenRouter Provider Error (${status}): ${message}`);
      error.statusCode = status;
      throw error;
    }
  }
}

module.exports = OpenRouterProvider;
