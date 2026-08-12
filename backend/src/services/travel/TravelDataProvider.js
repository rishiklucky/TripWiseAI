const RealTravelDataProvider = require('./RealTravelDataProvider');
const MockTravelDataProvider = require('./MockTravelDataProvider');
const env = require('../../config/env');

class TravelDataProvider {
  static async getTravelContext(tripRequest) {
    const { origin, destination, durationDays, budget, currency = 'INR' } = tripRequest;

    const [weather, hotels, transport, attractions] = await Promise.all([
      RealTravelDataProvider.getWeather(destination, durationDays),
      RealTravelDataProvider.getHotels(destination, budget, currency),
      RealTravelDataProvider.getTransport(origin, destination, currency),
      RealTravelDataProvider.getAttractions(destination),
    ]);

    return {
      weather,
      hotels,
      transport,
      attractions,
      hasLiveAPIs: Boolean(env.apis.weatherKey || env.apis.hotelKey || env.apis.flightKey),
    };
  }
}

module.exports = TravelDataProvider;
