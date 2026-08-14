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

    // List of models with gemini-3.5-flash as primary
    const primaryModel = env.ai.geminiModel || 'gemini-3.5-flash';
    const modelsToTry = Array.from(new Set([
      primaryModel,
      'gemini-3.5-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-2.5-flash',
    ]));

    let lastError = null;

    for (const model of modelsToTry) {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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
        console.log(`[GeminiProvider] Requesting AI completion using model: ${model}...`);
        const response = await axios.post(endpoint, payload, { timeout: 60000 });
        const candidates = response.data?.candidates;
        if (!candidates || candidates.length === 0) {
          throw new Error('Empty response from Gemini API');
        }
        const text = candidates[0]?.content?.parts?.[0]?.text;
        if (text) {
          return text;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[GeminiProvider Warning] Model ${model} failed: ${err.message}. Trying next fallback if available...`);
      }
    }

    const status = lastError?.response?.status || 500;
    const message = lastError?.response?.data?.error?.message || lastError?.message || 'Gemini API timeout or error';
    const error = new Error(`Gemini Provider Error (${status}): ${message}`);
    error.statusCode = status;
    throw error;
  }
}

module.exports = GeminiProvider;
