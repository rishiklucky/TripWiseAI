const express = require('express');
const router = express.Router();
const { getWeather, getHotels, getTransport } = require('../controllers/travelController');

router.get('/weather', getWeather);
router.get('/hotels', getHotels);
router.get('/transport', getTransport);

module.exports = router;
