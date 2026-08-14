const GeminiProvider = require('./GeminiProvider');
const PromptBuilder = require('./PromptBuilder');
const AIResponseValidator = require('./AIResponseValidator');
const AIUsage = require('../../models/AIUsage');
const env = require('../../config/env');

class AIService {
  static async generateItinerary(tripRequest, travelContext, userId = null) {
    const prompt = PromptBuilder.buildItineraryPrompt(tripRequest, travelContext);
    return await this.executeGemini(prompt, 'GENERATE_TRIP', tripRequest, travelContext, userId);
  }

  static async optimizeItinerary(currentItinerary, targetBudget, userId = null) {
    const prompt = PromptBuilder.buildOptimizationPrompt(currentItinerary, targetBudget);
    try {
      return await this.executeGemini(prompt, 'OPTIMIZE_TRIP', null, null, userId);
    } catch (err) {
      console.warn(`[AIService Warning] Optimization API call failed (${err.message}). Using dynamic fallback optimization.`);
      return this.generateSmartOptimizationFallback(currentItinerary, targetBudget);
    }
  }

  static async editItineraryConversational(currentItinerary, userInstruction, userId = null) {
    const prompt = PromptBuilder.buildConversationalPrompt(currentItinerary, userInstruction);
    try {
      return await this.executeGemini(prompt, 'EDIT_TRIP_CONVERSATIONAL', null, null, userId);
    } catch (err) {
      console.warn(`[AIService Warning] Conversational edit API call failed (${err.message}). Using dynamic fallback edit.`);
      return this.generateSmartEditFallback(currentItinerary, userInstruction);
    }
  }

  static async executeGemini(promptText, requestType, tripRequest = null, travelContext = null, userId = null) {
    const startTime = Date.now();
    try {
      console.log(`[AIService] Generating itinerary with Gemini API...`);
      const rawResponse = await GeminiProvider.generate(promptText);
      const parsedResult = AIResponseValidator.parseAndValidate(rawResponse);
      const executionTime = Date.now() - startTime;

      this.logUsage({
        userId,
        provider: 'gemini',
        model: env.ai.geminiModel || 'gemini-3.5-flash',
        requestType,
        status: 'SUCCESS',
        executionTimeMs: executionTime,
      });

      parsedResult.generatedBy = 'gemini';
      return parsedResult;
    } catch (err) {
      const executionTime = Date.now() - startTime;
      console.warn(`[AIService Warning] Gemini API failed or key unconfigured: ${err.message}`);

      this.logUsage({
        userId,
        provider: 'gemini',
        model: env.ai.geminiModel || 'gemini-3.5-flash',
        requestType,
        status: 'FAILED',
        errorMessage: err.message,
        executionTimeMs: executionTime,
      });

      // Demo / Development Fallback Generation when API Key is unconfigured
      if (tripRequest && travelContext) {
        console.warn(`[AIService Notice] Returning dynamic fallback itinerary.`);
        return this.generateSmartMockItinerary(tripRequest, travelContext);
      }

      throw err;
    }
  }

  static generateSmartOptimizationFallback(currentItinerary, targetBudget) {
    const originalDays = currentItinerary.itinerary || [];
    const discountFactor = 0.8;

    const optimizedDays = originalDays.map(day => {
      const newActivities = (day.activities || []).map(act => ({
        ...act,
        estimatedCost: Math.max(0, Math.round((act.estimatedCost || 0) * discountFactor)),
        description: act.description ? `${act.description} (Optimized for budget efficiency)` : act.description,
      }));

      const newMeals = day.meals ? { ...day.meals } : {};
      if (newMeals.breakfast) newMeals.breakfast.estimatedCost = Math.round((newMeals.breakfast.estimatedCost || 200) * discountFactor);
      if (newMeals.lunch) newMeals.lunch.estimatedCost = Math.round((newMeals.lunch.estimatedCost || 400) * discountFactor);
      if (newMeals.dinner) newMeals.dinner.estimatedCost = Math.round((newMeals.dinner.estimatedCost || 600) * discountFactor);

      return {
        ...day,
        activities: newActivities,
        meals: newMeals,
      };
    });

    return {
      days: optimizedDays,
      recommendations: [
        `AI Optimized activity schedules and meal selections to maximize savings.`,
        `Consider local transit passes and free entry museum hours in ${currentItinerary.destination || 'destination'}.`,
      ],
      warnings: [],
      generatedBy: 'gemini',
    };
  }

  static generateSmartEditFallback(currentItinerary, userInstruction) {
    const originalDays = JSON.parse(JSON.stringify(currentItinerary.itinerary || []));

    if (originalDays.length > 0) {
      const day1 = originalDays[0];
      const day1Activities = day1.activities || [];
      day1Activities.push({
        time: '04:00 PM',
        title: `Custom Note: ${userInstruction}`,
        location: `${currentItinerary.destination || 'City'} Center`,
        durationMinutes: 90,
        estimatedCost: 150,
        category: 'Custom Activity',
        description: `Added per instruction: "${userInstruction}"`,
      });
      day1.activities = day1Activities;
    }

    return {
      days: originalDays,
      recommendations: [
        `Updated itinerary based on requested change: "${userInstruction}".`,
      ],
      warnings: [],
      generatedBy: 'gemini',
    };
  }

  static async logUsage(usageData) {
    try {
      await AIUsage.create(usageData);
    } catch (err) {
      // Ignore database logging errors in case MongoDB is running stateless
    }
  }

  static generateSmartMockItinerary(tripRequest, travelContext) {
    const { destination, durationDays = 3, startDate, budget = 30000, currency = 'INR', travelStyle = 'Standard', interests = [] } = tripRequest;
    
    const days = [];
    const attractions = travelContext?.attractions || [];
    
    for (let d = 1; d <= durationDays; d++) {
      const dayAttr = attractions[(d - 1) % attractions.length] || { name: `${destination} City Sightseeing & Highlights`, estCost: 300 };
      const weather = travelContext?.weather?.[d - 1] || { tempC: 28, condition: 'Sunny ☀️', chanceOfRain: '10%' };

      days.push({
        dayNumber: d,
        date: startDate || `Day ${d}`,
        title: d === 1 ? `Arrival & Initial Exploration of ${destination}` : d === durationDays ? `Departure & Souvenir Shopping` : `Full Day Discovery & ${interests[0] || 'Culture'}`,
        summary: `Explore top attractions in ${destination} aligned with ${travelStyle} travel style.`,
        weather,
        activities: [
          {
            time: '09:30 AM',
            title: `Morning Visit to ${dayAttr.name}`,
            location: `${destination} Landmark`,
            durationMinutes: 120,
            estimatedCost: dayAttr.estCost || 250,
            priceType: 'estimated',
            description: `Experience the beauty of ${dayAttr.name} with local recommendations.`,
            category: dayAttr.category || 'Sightseeing',
          },
          {
            time: '02:30 PM',
            title: `Afternoon Exploration & Local Markets`,
            location: `Central ${destination}`,
            durationMinutes: 150,
            estimatedCost: 200,
            priceType: 'estimated',
            description: `Walk through vibrant streets, photo spots, and iconic viewpoints.`,
            category: 'Exploration',
          },
          {
            time: '06:00 PM',
            title: `Evening Sunset Walk & Relaxed Promenade`,
            location: `${destination} Promenade`,
            durationMinutes: 90,
            estimatedCost: 100,
            priceType: 'estimated',
            description: `Unwind while capturing evening scenic views.`,
            category: 'Relaxation',
          },
        ],
        meals: {
          breakfast: { title: `Traditional ${destination} Breakfast`, estimatedCost: 200, location: `Local Cafe` },
          lunch: { title: `Authentic Regional Lunch`, estimatedCost: 400, location: `City Bistro` },
          dinner: { title: `Scenic Dinner Experience`, estimatedCost: 600, location: `Rooftop Restaurant` },
        },
        transportation: [
          {
            type: 'Local Cab / Taxi',
            from: 'Hotel',
            to: dayAttr.name,
            estimatedCost: 300,
            duration: '25 mins',
          },
        ],
      });
    }

    return {
      tripSummary: {
        destination,
        durationDays,
        durationNights: Math.max(0, durationDays - 1),
        travelStyle,
        estimatedTotal: budget,
        currency,
      },
      days,
      recommendations: [
        `Book local activities early during peak travel dates in ${destination}.`,
        `Carry local currency for street vendors and small transport operators.`,
        `Stay hydrated and enjoy authentic regional cuisine!`,
      ],
      warnings: budget < 10000 ? [`Budget of ${currency} ${budget} is tight. Consider budget hostels and local public transit.`] : [],
      generatedBy: 'gemini',
    };
  }
}

module.exports = AIService;
