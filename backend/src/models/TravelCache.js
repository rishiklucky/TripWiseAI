const mongoose = require('mongoose');

const travelCacheSchema = new mongoose.Schema(
  {
    cacheKey: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: ['WEATHER', 'PLACES', 'HOTELS', 'FLIGHTS'],
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL index
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TravelCache', travelCacheSchema);
