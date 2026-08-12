const env = require('../config/env');
const AIUsage = require('../models/AIUsage');

exports.getAIStatus = async (req, res, next) => {
  try {
    const usageCount = await AIUsage.countDocuments();
    res.json({
      success: true,
      data: {
        primaryProvider: env.ai.primaryProvider,
        fallbackProvider: env.ai.fallbackProvider,
        secondaryFallback: env.ai.secondaryFallback,
        keysConfigured: {
          gemini: Boolean(env.ai.geminiKey),
          openrouter: Boolean(env.ai.openrouterKey),
          groq: Boolean(env.ai.groqKey),
        },
        totalRequestsLogged: usageCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
