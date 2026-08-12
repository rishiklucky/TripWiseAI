const RealTravelDataProvider = require('../services/travel/RealTravelDataProvider');

exports.getWeather = async (req, res, next) => {
  try {
    const { destination, days = 5 } = req.query;
    if (!destination) return res.status(400).json({ success: false, message: 'Destination is required' });

    const weather = await RealTravelDataProvider.getWeather(destination, Number(days));
    res.json({ success: true, data: weather });
  } catch (error) {
    next(error);
  }
};

exports.getHotels = async (req, res, next) => {
  try {
    const { destination, budget = 30000, currency = 'INR' } = req.query;
    if (!destination) return res.status(400).json({ success: false, message: 'Destination is required' });

    const hotels = await RealTravelDataProvider.getHotels(destination, Number(budget), currency);
    res.json({ success: true, data: hotels });
  } catch (error) {
    next(error);
  }
};

exports.getTransport = async (req, res, next) => {
  try {
    const { origin, destination, currency = 'INR' } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ success: false, message: 'Origin and Destination are required' });
    }

    const transport = await RealTravelDataProvider.getTransport(origin, destination, currency);
    res.json({ success: true, data: transport });
  } catch (error) {
    next(error);
  }
};
