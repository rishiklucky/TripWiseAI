const TravelCache = require('../../models/TravelCache');

class CacheService {
  static async get(cacheKey) {
    try {
      const cached = await TravelCache.findOne({ cacheKey });
      if (cached && cached.expiresAt > new Date()) {
        return cached.data;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  static async set(cacheKey, category, data, ttlSeconds = 86400) {
    try {
      const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
      await TravelCache.findOneAndUpdate(
        { cacheKey },
        { cacheKey, category, data, expiresAt },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn(`[CacheService Warning] Failed to set cache key: ${cacheKey}`);
    }
  }
}

module.exports = CacheService;
