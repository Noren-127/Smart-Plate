import { Dish, MealHistoryItem } from '../types';

export interface VarietyCheckResult {
  penaltyScore: number; // lower is better (0 = maximum variety / perfectly unique)
  varietyRatingPct: number; // 100% = unique & fresh, <60% = repetitive
  repeatedElements: string[];
  isRecentlyUsed5Days: boolean; // True if the exact dish was served in the last 5 days
}

/**
 * Calculates variety penalty for a candidate dish compared against recent meal history (up to 5 days = 15 meals)
 * and same-day dishes
 */
export function calculateDishVarietyPenalty(
  candidate: Dish,
  recentHistory: MealHistoryItem[],
  sameDayDishes: Dish[] = []
): VarietyCheckResult {
  let penalty = 0;
  const repeated: string[] = [];
  let isRecentlyUsed5Days = false;

  const candidateNormName = candidate.name.trim().toLowerCase();

  // 1. Same day redundancy (e.g. Having chicken for both lunch & dinner)
  for (const dish of sameDayDishes) {
    const dishNormName = dish.name.trim().toLowerCase();
    if (dish.id === candidate.id || dishNormName === candidateNormName) {
      penalty += 1000;
      repeated.push(`Duplicate meal on same day (${candidate.name})`);
      isRecentlyUsed5Days = true;
    }
    if (dish.primaryProtein.toLowerCase() === candidate.primaryProtein.toLowerCase()) {
      penalty += 60;
      repeated.push(`Repeated same-day protein (${candidate.primaryProtein})`);
    }
    if (dish.primaryCarb.toLowerCase() === candidate.primaryCarb.toLowerCase()) {
      penalty += 25;
      repeated.push(`Repeated same-day carb (${candidate.primaryCarb})`);
    }
    if (dish.cookingStyle.toLowerCase() === candidate.cookingStyle.toLowerCase()) {
      penalty += 20;
      repeated.push(`Repeated cooking style (${candidate.cookingStyle})`);
    }
  }

  // 2. Strict 5-Day Historical Lookback (Last 15 meals)
  const lookbackWindow = recentHistory.slice(-15);
  const historyLen = lookbackWindow.length;

  lookbackWindow.forEach((hist, idx) => {
    const recencyFromEnd = historyLen - idx;
    const dayOffset = Math.ceil(recencyFromEnd / 3);
    const histNormName = hist.dishName.trim().toLowerCase();

    // Exact Dish ID or Name repetition within 5 days (Hard constraint flag)
    if (hist.dishId === candidate.id || histNormName === candidateNormName) {
      isRecentlyUsed5Days = true;
      const p = 500 * (6 - dayOffset);
      penalty += p;
      repeated.push(`Repeated dish from ${dayOffset} day(s) ago: ${candidate.name} (-${p} pts)`);
    }

    // Same Meal Slot Protein repetition (e.g. Lunch salmon yesterday, lunch salmon today)
    if (hist.primaryProtein.toLowerCase() === candidate.primaryProtein.toLowerCase()) {
      if (hist.mealType === candidate.mealType && dayOffset <= 2) {
        const p = 50 * (3 - dayOffset);
        penalty += p;
        repeated.push(`Repeated ${candidate.mealType} protein (${candidate.primaryProtein}) from Day -${dayOffset}`);
      } else {
        const p = 20 * (4 - Math.min(3, dayOffset));
        penalty += p;
      }
    }

    // Repeated primary carb within 2 days
    if (hist.primaryCarb.toLowerCase() === candidate.primaryCarb.toLowerCase() && dayOffset <= 2) {
      const p = 15 * (3 - dayOffset);
      penalty += p;
    }

    // Repeated cooking style within 2 days
    if (hist.cookingStyle.toLowerCase() === candidate.cookingStyle.toLowerCase() && dayOffset <= 2) {
      const p = 10 * (3 - dayOffset);
      penalty += p;
    }
  });

  // Calculate 0 - 100 rating
  const varietyRatingPct = Math.max(5, Math.round(100 - Math.min(95, penalty / 2)));

  return {
    penaltyScore: Math.round(penalty),
    varietyRatingPct,
    repeatedElements: repeated,
    isRecentlyUsed5Days
  };
}

/**
 * Calculates aggregate variety score for an entire multi-day meal plan
 */
export function calculatePlanVarietyScore(
  planDays: { breakfast: Dish; lunch: Dish; dinner: Dish }[]
): { score: number; distinctProteins: number; distinctDishes: number; repeatCount5Days: number } {
  const allDishes = planDays.flatMap(d => [d.breakfast, d.lunch, d.dinner]);
  const dishIds = new Set(allDishes.map(d => d.id));
  const proteins = new Set(allDishes.map(d => d.primaryProtein));
  
  const distinctDishes = dishIds.size;
  const distinctProteins = proteins.size;

  // Check 5-day window repetitions (15 meals)
  let repeatCount5Days = 0;
  for (let i = 0; i < allDishes.length; i++) {
    const windowStart = Math.max(0, i - 15);
    const currName = allDishes[i].name.trim().toLowerCase();
    for (let j = windowStart; j < i; j++) {
      const prevName = allDishes[j].name.trim().toLowerCase();
      if (allDishes[i].id === allDishes[j].id || currName === prevName) {
        repeatCount5Days++;
      }
    }
  }

  const dishRatio = distinctDishes / allDishes.length;
  const score = Math.round(dishRatio * 60 + Math.min(40, distinctProteins * 8) - repeatCount5Days * 15);

  return {
    score: Math.min(100, Math.max(20, score)),
    distinctProteins,
    distinctDishes,
    repeatCount5Days
  };
}
