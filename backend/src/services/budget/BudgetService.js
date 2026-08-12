class BudgetService {
  static calculateTripBudget(days = [], userBudget = 0, currency = 'INR') {
    let totalTransport = 0;
    let totalAccommodation = 0;
    let totalFood = 0;
    let totalActivities = 0;

    days.forEach((day) => {
      // Activities
      if (Array.isArray(day.activities)) {
        day.activities.forEach((act) => {
          totalActivities += Number(act.estimatedCost || 0);
        });
      }

      // Meals
      if (day.meals) {
        if (day.meals.breakfast?.estimatedCost) totalFood += Number(day.meals.breakfast.estimatedCost);
        if (day.meals.lunch?.estimatedCost) totalFood += Number(day.meals.lunch.estimatedCost);
        if (day.meals.dinner?.estimatedCost) totalFood += Number(day.meals.dinner.estimatedCost);
      }

      // Day Transportation
      if (Array.isArray(day.transportation)) {
        day.transportation.forEach((t) => {
          totalTransport += Number(t.estimatedCost || 0);
        });
      }
    });

    // Default accommodation estimation if not explicitly separated per day (approx 35% of total budget)
    if (totalAccommodation === 0 && days.length > 0) {
      totalAccommodation = Math.round(userBudget * 0.35);
    }

    const totalFoodAndActivities = totalFood + totalActivities;
    const totalTransportAndAccom = totalTransport + totalAccommodation;
    const rawTotal = totalTransportAndAccom + totalFoodAndActivities;

    // Buffer / Miscellaneous (~5% of subtotal)
    const miscellaneous = Math.round(rawTotal * 0.05);
    const totalEstimated = rawTotal + miscellaneous;

    const difference = Math.abs(userBudget - totalEstimated);
    const status = totalEstimated <= userBudget ? 'WITHIN_BUDGET' : 'OVER_BUDGET';

    return {
      transportation: Math.round(totalTransport),
      accommodation: Math.round(totalAccommodation),
      food: Math.round(totalFood),
      activities: Math.round(totalActivities),
      miscellaneous: Math.round(miscellaneous),
      totalEstimated: Math.round(totalEstimated),
      targetBudget: Number(userBudget),
      difference: Math.round(difference),
      status,
      savingsFromOptimization: 0,
    };
  }

  static optimizeBudgetBreakdown(originalBreakdown, targetBudget) {
    const totalEst = originalBreakdown.totalEstimated;
    if (totalEst <= targetBudget) {
      return { ...originalBreakdown, savingsFromOptimization: 0, status: 'WITHIN_BUDGET' };
    }

    // Apply optimization reductions (e.g. 20% off accommodation, 15% off food/activities)
    const newAccom = Math.round(originalBreakdown.accommodation * 0.75);
    const newFood = Math.round(originalBreakdown.food * 0.85);
    const newAct = Math.round(originalBreakdown.activities * 0.80);
    const newTrans = Math.round(originalBreakdown.transportation * 0.90);
    const newMisc = Math.round((newAccom + newFood + newAct + newTrans) * 0.05);

    const newTotal = newAccom + newFood + newAct + newTrans + newMisc;
    const savings = Math.max(0, totalEst - newTotal);

    return {
      transportation: newTrans,
      accommodation: newAccom,
      food: newFood,
      activities: newAct,
      miscellaneous: newMisc,
      totalEstimated: newTotal,
      targetBudget: Number(targetBudget),
      difference: Math.abs(targetBudget - newTotal),
      status: newTotal <= targetBudget ? 'WITHIN_BUDGET' : 'OVER_BUDGET',
      savingsFromOptimization: savings,
    };
  }
}

module.exports = BudgetService;
