const axios = require('axios');
const env = require('../../config/env');
const MockTravelDataProvider = require('./MockTravelDataProvider');
const CacheService = require('../cache/CacheService');

class RealTravelDataProvider {
  static async getWeather(destination, durationDays) {
    if (!env.apis.weatherKey) {
      return MockTravelDataProvider.getMockWeather(destination, durationDays);
    }

    const cacheKey = `weather_${destination.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(destination)}&appid=${env.apis.weatherKey}&units=metric`
      );
      
      const weatherData = [];
      const list = response.data.list || [];
      for (let i = 0; i < durationDays; i++) {
        const item = list[i * 8] || list[list.length - 1] || {};
        weatherData.push({
          dayNumber: i + 1,
          tempC: Math.round(item.main?.temp || 28),
          condition: item.weather?.[0]?.description || 'Partly Cloudy',
          icon: item.weather?.[0]?.icon || '02d',
          chanceOfRain: `${Math.round((item.pop || 0) * 100)}%`,
          priceType: 'live',
        });
      }

      await CacheService.set(cacheKey, 'WEATHER', weatherData, 43200); // 12 hours
      return weatherData;
    } catch (error) {
      console.warn(`[Weather API Warning] ${error.message}. Using mock weather.`);
      return MockTravelDataProvider.getMockWeather(destination, durationDays);
    }
  }

  static async getHotels(destination, budget, currency) {
    // Hotel live provider integration point (e.g. Amadeus / Booking API)
    if (!env.apis.hotelKey) {
      return MockTravelDataProvider.getMockHotels(destination, budget, currency);
    }
    return MockTravelDataProvider.getMockHotels(destination, budget, currency);
  }

  static async getTransport(origin, destination, currency) {
    if (!env.apis.flightKey) {
      return MockTravelDataProvider.getMockTransport(origin, destination, currency);
    }
    return MockTravelDataProvider.getMockTransport(origin, destination, currency);
  }

  static async getAttractions(destination) {
    return MockTravelDataProvider.getMockAttractions(destination);
  }
}

module.exports = RealTravelDataProvider;
