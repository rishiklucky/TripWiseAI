class PromptBuilder {
  static buildItineraryPrompt(tripRequest, travelContext) {
    const {
      origin,
      destination,
      startDate,
      endDate,
      durationDays,
      durationNights,
      travelers,
      budget,
      currency = 'INR',
      travelStyle = 'Standard',
      pace = 'Balanced',
      interests = [],
      foodPreference = 'No Preference',
      accommodationPreference = 'No Preference',
      transportationPreference = 'No Preference',
      mustVisit = [],
      placesToAvoid = [],
      specialOccasion = 'Normal Trip',
      accessibilityRequirements = [],
      additionalNotes = '',
    } = tripRequest;

    const adultCount = travelers?.adults || 1;
    const childCount = travelers?.children || 0;

    return `
You are TripWise AI, an expert travel planner who creates highly realistic, budget-aware, geographically sensible travel itineraries.

TRIP REQUIREMENTS:
- Origin: ${origin}
- Destination: ${destination}
- Dates: ${startDate} to ${endDate} (${durationDays} Days, ${durationNights} Nights)
- Travelers: ${adultCount} Adult(s), ${childCount} Child(ren)
- Total Budget: ${currency} ${budget}
- Travel Style: ${travelStyle}
- Pace: ${pace} (If Relaxed: 2-3 activities/day max. If Packed: 4-6 activities/day. If Balanced: 3-4 activities/day)
- Interests: ${interests.join(', ') || 'General Sightseeing'}
- Food Preference: ${foodPreference}
- Accommodation Preference: ${accommodationPreference}
- Transportation Preference: ${transportationPreference}
- Must-Visit Places: ${mustVisit.join(', ') || 'None specified (pick top rated)'}
- Places to Avoid: ${placesToAvoid.join(', ') || 'None'}
- Special Occasion: ${specialOccasion}
- Accessibility Requirements: ${accessibilityRequirements.join(', ') || 'None'}
- Additional Notes: ${additionalNotes || 'None'}

REAL-TIME / SUPPLIED TRAVEL DATA:
- Weather Forecast: ${JSON.stringify(travelContext.weather || [])}
- Available Hotels: ${JSON.stringify(travelContext.hotels || [])}
- Transport Options: ${JSON.stringify(travelContext.transport || [])}
- Recommended Attractions: ${JSON.stringify(travelContext.attractions || [])}

STRICT INSTRUCTIONS:
1. Stay within the user's budget (${currency} ${budget}) as closely as possible.
2. LIVE DATA RULE: Do NOT invent live flight or hotel prices. Use the supplied price data or label estimated costs clearly as "estimated".
3. Provide a realistic day-by-day schedule for ALL ${durationDays} days.
4. Ensure logical geographical ordering to minimize travel time and avoid backtracking.
5. Respect food preferences (${foodPreference}) and accessibility needs.
6. MUST-VISIT: Prioritize placing ${mustVisit.join(', ')} into the itinerary days.
7. Output format MUST be strictly a valid JSON object matching the exact structure below. Do NOT wrap in markdown or backticks. Return JSON ONLY.

EXPECTED JSON STRUCTURE:
{
  "tripSummary": {
    "destination": "${destination}",
    "durationDays": ${durationDays},
    "durationNights": ${durationNights},
    "travelStyle": "${travelStyle}",
    "estimatedTotal": ${budget},
    "currency": "${currency}"
  },
  "days": [
    {
      "dayNumber": 1,
      "date": "${startDate}",
      "title": "Day Title",
      "summary": "Short overview of the day",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity Name",
          "location": "Location Name",
          "durationMinutes": 120,
          "estimatedCost": 300,
          "priceType": "estimated",
          "description": "Brief description and why it fits user preferences",
          "category": "Culture"
        }
      ],
      "meals": {
        "breakfast": { "title": "Breakfast spot", "estimatedCost": 250, "location": "Area" },
        "lunch": { "title": "Lunch spot", "estimatedCost": 400, "location": "Area" },
        "dinner": { "title": "Dinner spot", "estimatedCost": 600, "location": "Area" }
      },
      "transportation": [
        {
          "type": "Cab",
          "from": "Hotel",
          "to": "Attraction",
          "estimatedCost": 200,
          "duration": "20 mins"
        }
      ]
    }
  ],
  "recommendations": ["Tip 1", "Tip 2"],
  "warnings": ["Warning if budget is tight or weather rainy"]
}
`;
  }

  static buildOptimizationPrompt(currentItinerary, targetBudget) {
    return `
You are TripWise AI Budget Optimizer.
The user's current trip to ${currentItinerary.destination} exceeds their target budget of ${currentItinerary.currency} ${targetBudget}.

CURRENT ITINERARY DATA:
${JSON.stringify(currentItinerary)}

INSTRUCTIONS:
1. Re-optimize the itinerary so the total cost fits within ${currentItinerary.currency} ${targetBudget}.
2. Replace expensive activities with high-quality budget or free alternatives.
3. Suggest cheaper dining and transport options.
4. Keep all must-visit places and overall structure intact.
5. Return the full optimized JSON object with the exact same structure.
`;
  }

  static buildConversationalPrompt(currentItinerary, userInstruction) {
    return `
You are TripWise AI Conversational Editor ("Ask TripWise").
The user wants to modify their existing trip itinerary for ${currentItinerary.destination}.

USER INSTRUCTION:
"${userInstruction}"

CURRENT ITINERARY DATA:
${JSON.stringify(currentItinerary)}

INSTRUCTIONS:
1. Apply the user's requested edit precisely while maintaining the validity of the itinerary.
2. Return the complete updated itinerary JSON object in the exact same format.
`;
  }
}

module.exports = PromptBuilder;
