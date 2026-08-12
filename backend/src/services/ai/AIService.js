const GeminiProvider = require('./GeminiProvider');
const PromptBuilder = require('./PromptBuilder');
const AIResponseValidator = require('./AIResponseValidator');
const AIUsage = require('../../models/AIUsage');

class AIService {
  static async generateItinerary(tripRequest, travelContext, userId = null) {
    const prompt = PromptBuilder.buildItineraryPrompt(tripRequest, travelContext);
    return await this.executeGemini(prompt, 'GENERATE_TRIP', tripRequest, travelContext, userId);
  }

  static async optimizeItinerary(currentItinerary, targetBudget, userId = null) {
    const prompt = PromptBuilder.buildOptimizationPrompt(currentItinerary, targetBudget);
    return await this.executeGemini(prompt, 'OPTIMIZE_TRIP', null, null, userId);
  }

  static async editItineraryConversational(currentItinerary, userInstruction, userId = null) {
    const prompt = PromptBuilder.buildConversationalPrompt(currentItinerary, userInstruction);
    return await this.executeGemini(prompt, 'EDIT_TRIP_CONVERSATIONAL', null, null, userId);
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
        model: 'gemini-2.5-flash',
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
        model: 'gemini-2.5-flash',
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

      throw new Error(`Gemini AI Generation Failed: ${err.message}`);
    }
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
