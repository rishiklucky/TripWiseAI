require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tripwise_ai',
  jwtSecret: process.env.JWT_SECRET || 'tripwise_ai_super_secret_jwt_key_2026',
  
  ai: {
    provider: 'gemini',
    geminiKey: process.env.GEMINI_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  },

  apis: {
    mapsKey: process.env.MAPS_API_KEY || '',
    weatherKey: process.env.WEATHER_API_KEY || '',
    flightKey: process.env.FLIGHT_API_KEY || '',
    hotelKey: process.env.HOTEL_API_KEY || '',
  }
};
