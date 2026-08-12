const express = require('express');
const router = express.Router();
const {
  generateTrip,
  saveTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  optimizeTrip,
  editTripAI,
} = require('../controllers/tripController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const { validateTripRequest } = require('../middleware/validationMiddleware');

router.post('/generate', optionalProtect, validateTripRequest, generateTrip);
router.post('/optimize', optionalProtect, optimizeTrip);
router.post('/edit-ai', optionalProtect, editTripAI);

router.route('/')
  .post(protect, saveTrip)
  .get(protect, getUserTrips);

router.route('/:id')
  .get(getTripById)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

module.exports = router;
