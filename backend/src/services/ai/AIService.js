const env = require('../../config/env');
const GeminiProvider = require('./GeminiProvider');
const OpenRouterProvider = require('./OpenRouterProvider');
const GroqProvider = require('./GroqProvider');
const PromptBuilder = require('./PromptBuilder');
const AIResponseValidator = require('./AIResponseValidator');
const AIUsage = require('../../models/AIUsage');

class AIService {
  static getProviderMap() {
    return {
      gemini: GeminiProvider,
      openrouter: OpenRouterProvider,
      groq: GroqProvider,
    };
  }

  static async generateItinerary(tripRequest, travelContext, userId = null) {
    const prompt = PromptBuilder.buildItineraryPrompt(tripRequest, travelContext);
    return await this.executeWithFallback(prompt, 'GENERATE_TRIP', tripRequest, travelContext, userId);
  }

  static async optimizeItinerary(currentItinerary, targetBudget, userId = null) {
    const prompt = PromptBuilder.buildOptimizationPrompt(currentItinerary, targetBudget);
    return await this.executeWithFallback(prompt, 'OPTIMIZE_TRIP', null, null, userId);
  }

  static async editItineraryConversational(currentItinerary, userInstruction, userId = null) {
    const prompt = PromptBuilder.buildConversationalPrompt(currentItinerary, userInstruction);
    return await this.executeWithFallback(prompt, 'EDIT_TRIP_CONVERSATIONAL', null, null, userId);
  }

  static async executeWithFallback(promptText, requestType, tripRequest = null, travelContext = null, userId = null) {
    const providersList = [
      env.ai.primaryProvider || 'gemini',
      env.ai.fallbackProvider || 'openrouter',
      env.ai.secondaryFallback || 'groq',
    ].map((p) => p.toLowerCase());

    const providerMap = this.getProviderMap();
    let lastError = null;

    for (const providerName of providersList) {
      const provider = providerMap[providerName];
      if (!provider) continue;

      const startTime = Date.now();
      try {
        console.log(`[AIService] Attempting generation with provider: ${providerName.toUpperCase()}`);
        const rawResponse = await provider.generate(promptText);
        const parsedResult = AIResponseValidator.parseAndValidate(rawResponse);
        const executionTime = Date.now() - startTime;

        // Log successful AI usage
        this.logUsage({
          userId,
          provider: providerName,
          model: providerName === 'gemini' ? 'gemini-2.5-flash' : providerName === 'groq' ? 'llama-3.3-70b' : 'openrouter-gemini',
          requestType,
          status: 'SUCCESS',
          executionTimeMs: executionTime,
        });

        parsedResult.generatedBy = providerName;
        return parsedResult;
      } catch (err) {
        const executionTime = Date.now() - startTime;
        console.warn(`[AIService Warning] Provider ${providerName} failed: ${err.message}`);
        lastError = err;

        this.logUsage({
          userId,
          provider: providerName,
          model: providerName,
          requestType,
          status: 'FALLBACK',
          errorMessage: err.message,
          executionTimeMs: executionTime,
        });
      }
    }

    // Demo / Development Fallback Generation when API Keys are not configured
    console.warn(`[AIService Notice] All external AI providers unavailable or key unconfigured. Returning dynamic fallback itinerary.`);
    if (tripRequest && travelContext) {
      return this.generateSmartMockItinerary(tripRequest, travelContext);
    }

    throw new Error(`AI Generation Failed: ${lastError ? lastError.message : 'All AI providers exhausted'}`);
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
      generatedBy: 'tripwise-demo-ai',
    };
  }
}

module.exports = AIService;
