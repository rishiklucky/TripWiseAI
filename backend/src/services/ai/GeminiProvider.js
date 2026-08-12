const axios = require('axios');
const env = require('../../config/env');

class GeminiProvider {
  static async generate(promptText) {
    const apiKey = env.ai.geminiKey;
    if (!apiKey) {
      const error = new Error('Gemini API key is not configured');
      error.statusCode = 401;
      throw error;
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [{ text: promptText }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
    };

    try {
      const response = await axios.post(endpoint, payload, { timeout: 30000 });
      const candidates = response.data?.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('Empty response from Gemini API');
      }
      const text = candidates[0]?.content?.parts?.[0]?.text;
      return text;
    } catch (err) {
      const status = err.response?.status || 500;
      const message = err.response?.data?.error?.message || err.message;
      const error = new Error(`Gemini Provider Error (${status}): ${message}`);
      error.statusCode = status;
      throw error;
    }
  }
}

module.exports = GeminiProvider;
