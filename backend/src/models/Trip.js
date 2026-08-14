const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  time: String,
  title: String,
  location: String,
  durationMinutes: Number,
  estimatedCost: Number,
  priceType: { type: String, enum: ['live', 'estimated'], default: 'estimated' },
  description: String,
  category: String,
  rating: Number,
});

const daySchema = new mongoose.Schema({
  dayNumber: Number,
  date: String,
  title: String,
  summary: String,
  weather: {
    tempC: Number,
    condition: String,
    icon: String,
    chanceOfRain: String,
  },
  activities: [activitySchema],
  meals: {
    breakfast: { title: String, estimatedCost: Number, location: String },
    lunch: { title: String, estimatedCost: Number, location: String },
    dinner: { title: String, estimatedCost: Number, location: String },
  },
  transportation: [{
    type: { type: String },
    from: String,
    to: String,
    estimatedCost: Number,
    duration: String,
  }],
});

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    durationDays: {
      type: Number,
      default: 1,
    },
    durationNights: {
      type: Number,
      default: 0,
    },
    travelers: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 },
      childrenAges: [Number],
    },
    budget: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    travelStyle: {
      type: String,
      enum: ['Budget', 'Standard', 'Premium', 'Luxury'],
      default: 'Standard',
    },
    pace: {
      type: String,
      enum: ['Relaxed', 'Balanced', 'Packed'],
      default: 'Balanced',
    },
    interests: [String],
    foodPreference: {
      type: String,
      default: 'No Preference',
    },
    accommodationPreference: {
      type: String,
      default: 'No Preference',
    },
    transportationPreference: {
      type: String,
      default: 'No Preference',
    },
    mustVisit: [String],
    placesToAvoid: [String],
    specialOccasion: {
      type: String,
      default: 'Normal Trip',
    },
    accessibilityRequirements: [String],
    additionalNotes: String,

    itinerary: [daySchema],

    budgetBreakdown: {
      transportation: { type: Number, default: 0 },
      accommodation: { type: Number, default: 0 },
      food: { type: Number, default: 0 },
      activities: { type: Number, default: 0 },
      miscellaneous: { type: Number, default: 0 },
      totalEstimated: { type: Number, default: 0 },
      targetBudget: { type: Number, default: 0 },
      difference: { type: Number, default: 0 },
      status: { type: String, enum: ['WITHIN_BUDGET', 'OVER_BUDGET'], default: 'WITHIN_BUDGET' },
      savingsFromOptimization: { type: Number, default: 0 },
    },

    hotels: [{
      name: String,
      rating: Number,
      location: String,
      pricePerNight: Number,
      totalPrice: Number,
      currency: String,
      amenities: [String],
      distanceFromCenter: String,
      source: String,
      priceType: String,
      imageUrl: String,
    }],

    transportOptions: [{
      mode: String,
      carrier: String,
      estimatedPrice: Number,
      currency: String,
      duration: String,
      source: String,
      priceType: String,
    }],

    recommendations: [String],
    warnings: [String],

    generatedBy: {
      type: String,
      default: 'gemini',
    },
    history: [{
      itinerary: [daySchema],
      budgetBreakdown: mongoose.Schema.Types.Mixed,
      label: String,
      createdAt: { type: Date, default: Date.now },
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Trip', tripSchema);
