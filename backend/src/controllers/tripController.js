const Trip = require('../models/Trip');
const TravelDataProvider = require('../services/travel/TravelDataProvider');
const AIService = require('../services/ai/AIService');
const BudgetService = require('../services/budget/BudgetService');

// @desc    Generate dynamic AI Trip Itinerary
// @route   POST /api/trips/generate
exports.generateTrip = async (req, res, next) => {
  try {
    const tripRequest = req.body;
    const userId = req.user ? req.user._id : null;

    // Calculate dates & duration if not explicitly passed
    if (tripRequest.startDate && tripRequest.endDate) {
      const start = new Date(tripRequest.startDate);
      const end = new Date(tripRequest.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      tripRequest.durationDays = diffDays > 0 ? diffDays : 1;
      tripRequest.durationNights = Math.max(0, tripRequest.durationDays - 1);
    }

    // 1. Fetch Travel Context (Weather, Hotels, Transport, Places)
    const travelContext = await TravelDataProvider.getTravelContext(tripRequest);

    // 2. Call AI Provider Abstraction (with Gemini/OpenRouter/Groq fallbacks)
    const aiResponse = await AIService.generateItinerary(tripRequest, travelContext, userId);

    // 3. Compute Budget Verification via Independent Budget Engine
    const rawDays = aiResponse.days || [];
    const budgetBreakdown = BudgetService.calculateTripBudget(
      rawDays,
      tripRequest.budget,
      tripRequest.currency || 'INR'
    );

    // 4. Assemble Full Trip Response Data
    const fullTripData = {
      title: `${tripRequest.durationDays}-Day Trip to ${tripRequest.destination}`,
      origin: tripRequest.origin,
      destination: tripRequest.destination,
      startDate: tripRequest.startDate,
      endDate: tripRequest.endDate,
      durationDays: tripRequest.durationDays,
      durationNights: tripRequest.durationNights,
      travelers: tripRequest.travelers || { adults: 1, children: 0, infants: 0 },
      budget: Number(tripRequest.budget),
      currency: tripRequest.currency || 'INR',
      travelStyle: tripRequest.travelStyle || 'Standard',
      pace: tripRequest.pace || 'Balanced',
      interests: tripRequest.interests || [],
      foodPreference: tripRequest.foodPreference || 'No Preference',
      accommodationPreference: tripRequest.accommodationPreference || 'No Preference',
      transportationPreference: tripRequest.transportationPreference || 'No Preference',
      mustVisit: tripRequest.mustVisit || [],
      placesToAvoid: tripRequest.placesToAvoid || [],
      specialOccasion: tripRequest.specialOccasion || 'Normal Trip',
      accessibilityRequirements: tripRequest.accessibilityRequirements || [],
      additionalNotes: tripRequest.additionalNotes || '',
      itinerary: rawDays,
      budgetBreakdown,
      hotels: travelContext.hotels || [],
      transportOptions: travelContext.transport || [],
      recommendations: aiResponse.recommendations || [],
      warnings: aiResponse.warnings || [],
      generatedBy: aiResponse.generatedBy || 'gemini',
    };

    res.status(200).json({
      success: true,
      data: fullTripData,
    });
  } catch (error) {
    next(error);
  }
};

const mongoose = require('mongoose');

// @desc    Save generated trip to database (or update existing saved trip)
// @route   POST /api/trips
exports.saveTrip = async (req, res, next) => {
  try {
    const { _id, createdAt, updatedAt, __v, ...bodyData } = req.body;
    const tripData = { ...bodyData, userId: req.user._id };

    let savedTrip;
    if (_id && mongoose.Types.ObjectId.isValid(_id)) {
      savedTrip = await Trip.findByIdAndUpdate(_id, tripData, {
        new: true,
        upsert: true,
        runValidators: true,
      });
    } else {
      savedTrip = await Trip.create(tripData);
    }

    res.status(200).json({ success: true, data: savedTrip });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all saved trips for logged in user
// @route   GET /api/trips
exports.getUserTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: trips.length, data: trips });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trip details by ID
// @route   GET /api/trips/:id
exports.getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
exports.updateTrip = async (req, res, next) => {
  try {
    let trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    if (trip.userId && trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this trip' });
    }

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    if (trip.userId && trip.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this trip' });
    }

    await trip.deleteOne();
    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Budget Optimization ("✨ Optimize Budget")
// @route   POST /api/trips/optimize
exports.optimizeTrip = async (req, res, next) => {
  try {
    const { currentTrip, targetBudget } = req.body;

    const optimizedAI = await AIService.optimizeItinerary(
      currentTrip,
      targetBudget || currentTrip.budget,
      req.user ? req.user._id : null
    );

    const newDays = optimizedAI.days || currentTrip.itinerary;
    const rawBreakdown = BudgetService.calculateTripBudget(
      newDays,
      targetBudget || currentTrip.budget,
      currentTrip.currency
    );
    const optimizedBreakdown = BudgetService.optimizeBudgetBreakdown(rawBreakdown, targetBudget || currentTrip.budget);

    const updatedTrip = {
      ...currentTrip,
      itinerary: newDays,
      budgetBreakdown: optimizedBreakdown,
      isOptimized: true,
    };

    res.json({
      success: true,
      data: updatedTrip,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Conversational AI Trip Editor ("Ask TripWise")
// @route   POST /api/trips/edit-ai
exports.editTripAI = async (req, res, next) => {
  try {
    const { currentTrip, userInstruction } = req.body;

    if (!userInstruction || !userInstruction.trim()) {
      return res.status(400).json({ success: false, message: 'Instruction is required for AI trip editor' });
    }

    const editedAI = await AIService.editItineraryConversational(
      currentTrip,
      userInstruction,
      req.user ? req.user._id : null
    );

    const newDays = editedAI.days || currentTrip.itinerary;
    const updatedBreakdown = BudgetService.calculateTripBudget(
      newDays,
      currentTrip.budget,
      currentTrip.currency
    );

    const updatedTrip = {
      ...currentTrip,
      itinerary: newDays,
      budgetBreakdown: updatedBreakdown,
    };

    res.json({
      success: true,
      data: updatedTrip,
    });
  } catch (error) {
    next(error);
  }
};
