const mongoose = require('mongoose');

const aiUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    provider: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    requestType: {
      type: String,
      enum: ['GENERATE_TRIP', 'OPTIMIZE_TRIP', 'EDIT_TRIP_CONVERSATIONAL'],
      default: 'GENERATE_TRIP',
    },
    promptTokens: Number,
    completionTokens: Number,
    totalTokens: Number,
    status: {
      type: String,
      enum: ['SUCCESS', 'FALLBACK', 'FAILED'],
      default: 'SUCCESS',
    },
    errorMessage: String,
    executionTimeMs: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AIUsage', aiUsageSchema);
