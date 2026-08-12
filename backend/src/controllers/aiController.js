const env = require('../config/env');
const AIUsage = require('../models/AIUsage');

exports.getAIStatus = async (req, res, next) => {
  try {
    const usageCount = await AIUsage.countDocuments();
    res.json({
      success: true,
      data: {
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        isKeyConfigured: Boolean(env.ai.geminiKey),
        totalRequestsLogged: usageCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
