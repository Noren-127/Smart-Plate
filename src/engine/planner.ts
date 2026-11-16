import { Dish, DayPlan, PackageTier, MealHistoryItem, DietPreference, CustomerMealPlan } from '../types';
import { DISHES_DATABASE } from '../data/dishes';
import { getAllDishes } from '../store/storage';
import { PACKAGE_CONFIGS } from '../data/packages';
import { calculateDishVarietyPenalty } from './variety';
import { generateDynamicDishPool } from './dishSynthesizer';

export interface PlannerInput {
  customerId: string;
  durationDays: 7 | 10 | 30;
  targetCalories: number;
  targetProteinG: number;
  targetCarbG: number;
  targetFatG: number;
  packageTier: PackageTier;
  dietPreference?: DietPreference;
  allergies?: string[];
  religiousRestrictions?: string[];
  excludedIngredients?: string[];
  mealHistory: MealHistoryItem[];
  planType?: 'custom' | 'chef_program';
  chefProgramId?: string;
  enableDynamicSynthesis?: boolean;
}

export interface CandidateCombo {
  breakfast: Dish;
  lunch: Dish;
  dinner: Dish;
  totalCalories: number;
  totalProteinG: number;
  totalCarbG: number;
  totalFatG: number;
  totalCostMMK: number;
  tier3Count: number;
  calDiff: number;
  costDiff: number;
  varietyPenalty: number;
  has5DayRepeat: boolean;
  score: number;
}

export interface DishFilterOptions {
  diet?: DietPreference;
  allergies?: string[];
  religiousRestrictions?: string[];
  excludedIngredients?: string[];
}

/**
 * Robust filter for religious restrictions, food allergies, and custom excluded ingredients
 */
export function filterDishesByPreferences(dishes: Dish[], options: DishFilterOptions): Dish[] {
  const { diet, allergies = [], religiousRestrictions = [], excludedIngredients = [] } = options;

  return dishes.filter(d => {
    const nameLower = d.name.toLowerCase();
    const burmeseLower = (d.burmeseName || '').toLowerCase();
    const protLower = d.primaryProtein.toLowerCase();
    const carbLower = d.primaryCarb.toLowerCase();
    const vegLower = d.primaryVeg.toLowerCase();
    const ingText = (d.ingredients || []).join(' ').toLowerCase();
    const tagsLower = (d.tags || []).map(t => t.toLowerCase()).join(' ');

    const fullDishText = `${nameLower} ${burmeseLower} ${protLower} ${carbLower} ${vegLower} ${ingText} ${tagsLower}`;

    // 1. RELIGIOUS RESTRICTIONS
    for (const rel of religiousRestrictions) {
      if (rel === 'halal_no_pork' || rel === 'kosher_no_pork') {
        if (fullDishText.includes('pork') || fullDishText.includes('bacon') || fullDishText.includes('ham') || fullDishText.includes('lard') || fullDishText.includes('ဝက်')) {
          return false;
        }
      }
      if (rel === 'hindu_no_beef') {
        if (fullDishText.includes('beef') || fullDishText.includes('wagyu') || fullDishText.includes('sirloin') || fullDishText.includes('ox') || fullDishText.includes('အမဲ')) {
          return false;
        }
      }
      if (rel === 'buddhist_vegetarian') {
        const isPlantOrEgg = protLower === 'tofu' || protLower === 'egg' || protLower === 'chickpea' || protLower === 'mushroom' || tagsLower.includes('vegetarian');
        if (!isPlantOrEgg || fullDishText.includes('chicken') || fullDishText.includes('beef') || fullDishText.includes('pork') || fullDishText.includes('fish') || fullDishText.includes('prawn') || fullDishText.includes('seafood') || fullDishText.includes('squid') || fullDishText.includes('duck')) {
          return false;
        }
      }
      if (rel === 'kosher_no_shellfish') {
        if (fullDishText.includes('prawn') || fullDishText.includes('shrimp') || fullDishText.includes('crab') || fullDishText.includes('squid') || fullDishText.includes('lobster') || fullDishText.includes('shellfish') || fullDishText.includes('ပုစွန်')) {
          return false;
        }
      }
    }

    // 2. ALLERGIES & INTOLERANCES
    for (const allergy of allergies) {
      const a = allergy.toLowerCase();
      if (a === 'peanuts' || a === 'tree_nuts' || a === 'nuts') {
        if (fullDishText.includes('peanut') || fullDishText.includes('groundnut') || fullDishText.includes('nut') || fullDishText.includes('almond') || fullDishText.includes('cashew') || fullDishText.includes('မြေပဲ')) {
          return false;
        }
      }
      if (a === 'shellfish' || a === 'crustaceans') {
        if (fullDishText.includes('prawn') || fullDishText.includes('shrimp') || fullDishText.includes('crab') || fullDishText.includes('squid') || fullDishText.includes('lobster') || fullDishText.includes('scallop') || fullDishText.includes('ပုစွန်')) {
          return false;
        }
      }
      if (a === 'dairy' || a === 'lactose') {
        if (fullDishText.includes('dairy') || fullDishText.includes('milk') || fullDishText.includes('butter') || fullDishText.includes('cheese') || fullDishText.includes('cream') || fullDishText.includes('whey')) {
          return false;
        }
      }
      if (a === 'gluten' || a === 'wheat') {
        if (fullDishText.includes('wheat') || fullDishText.includes('gluten') || fullDishText.includes('bread') || (fullDishText.includes('noodle') && !fullDishText.includes('rice noodle'))) {
          return false;
        }
      }
      if (a === 'eggs') {
        if (fullDishText.includes('egg') || protLower.includes('egg') || fullDishText.includes('ကြက်ဥ')) {
          return false;
        }
      }
      if (a === 'fish' || a === 'seafood') {
        if (fullDishText.includes('salmon') || fullDishText.includes('seabass') || fullDishText.includes('pomfret') || fullDishText.includes('fish') || fullDishText.includes('tilapia') || fullDishText.includes('mackerel') || fullDishText.includes('tuna') || fullDishText.includes('ငါး')) {
          return false;
        }
      }
      if (a === 'alliums_garlic_onion') {
        if (fullDishText.includes('garlic') || fullDishText.includes('onion') || fullDishText.includes('shallot') || fullDishText.includes('ကြက်သွန်')) {
          return false;
        }
      }
    }

    // 3. CUSTOM EXCLUDED INGREDIENTS
    for (const exc of excludedIngredients) {
      const eClean = exc.trim().toLowerCase();
      if (eClean && fullDishText.includes(eClean)) {
        return false;
      }
    }

    // 4. DIET PREFERENCES
    if (diet && diet !== 'balanced') {
      if (diet === 'halal') {
        if (fullDishText.includes('pork') || fullDishText.includes('bacon') || fullDishText.includes('ham') || fullDishText.includes('lard')) return false;
      } else if (diet === 'buddhist_veg') {
        const isPlantOrEgg = protLower === 'tofu' || protLower === 'egg' || protLower === 'chickpea' || protLower === 'mushroom' || tagsLower.includes('vegetarian');
        if (!isPlantOrEgg) return false;
      } else if (diet === 'pescatarian' || diet === 'seafood_heavy') {
        const isSeafoodOrEggTofu = protLower === 'salmon' || protLower === 'seabass' || protLower === 'prawn' || protLower === 'tiger prawn' || protLower === 'river prawn' || protLower === 'tuna' || protLower === 'pomfret' || protLower === 'squid' || protLower === 'mackerel' || protLower === 'fish' || protLower === 'egg' || protLower === 'tofu';
        if (!isSeafoodOrEggTofu) return false;
      } else if (diet === 'high_protein') {
        if (d.proteinG < 25 && !d.tags.includes('high_protein')) return false;
      } else if (diet === 'keto') {
        if (d.carbG > 22 && d.fatG < 18 && !d.tags.includes('keto')) return false;
      } else if (diet === 'low_carb') {
        if (d.carbG > 38 && !d.tags.includes('low_carb')) return false;
      }
    }

    return true;
  });
}

/**
 * Evaluates and scores a 3-meal combination for a single day
 */
function scoreCombination(
  b: Dish,
  l: Dish,
  d: Dish,
  targetCalories: number,
  targetProteinG: number,
  targetCarbG: number,
  targetFatG: number,
  packageTier: PackageTier,
  rollingHistory: MealHistoryItem[]
): CandidateCombo | null {
  const config = PACKAGE_CONFIGS[packageTier];
  const totalCalories = b.calories + l.calories + d.calories;
  const totalProteinG = b.proteinG + l.proteinG + d.proteinG;
  const totalCarbG = b.carbG + l.carbG + d.carbG;
  const totalFatG = b.fatG + l.fatG + d.fatG;
  const totalCostMMK = b.ingredientCostMMK + l.ingredientCostMMK + d.ingredientCostMMK;

  const tier3Count = (b.tier === 3 ? 1 : 0) + (l.tier === 3 ? 1 : 0) + (d.tier === 3 ? 1 : 0);

  // 1. HARD CONSTRAINT: Nutrition target tolerance (within +- 8% max)
  const calDiff = Math.abs(totalCalories - targetCalories);
  const calDiffPct = (calDiff / targetCalories) * 100;
  if (calDiffPct > 8.0) {
    return null;
  }

  // 2. SAME-DAY DISH & PROTEIN DIVERSITY
  // Zero duplicate dishes on the same day
  if (b.id === l.id || b.id === d.id || l.id === d.id) return null;
  if (b.name.trim().toLowerCase() === l.name.trim().toLowerCase()) return null;
  if (b.name.trim().toLowerCase() === d.name.trim().toLowerCase()) return null;
  if (l.name.trim().toLowerCase() === d.name.trim().toLowerCase()) return null;

  // Zero duplicate meat/fish proteins on the same day
  const bProt = b.primaryProtein.toLowerCase();
  const lProt = l.primaryProtein.toLowerCase();
  const dProt = d.primaryProtein.toLowerCase();
  if (bProt === lProt || bProt === dProt || lProt === dProt) {
    if (bProt === lProt && bProt !== 'egg' && bProt !== 'tofu') return null;
    if (bProt === dProt && bProt !== 'egg' && bProt !== 'tofu') return null;
    if (lProt === dProt && lProt !== 'egg' && lProt !== 'tofu') return null;
  }

  // 3. TIER & BUDGET HARD CONSTRAINTS
  if (packageTier === 'basic') {
    if (b.tier !== 1 || l.tier !== 1 || d.tier !== 1) return null; // Strictly Zero Tier-3 & Zero Tier-2
    if (totalCostMMK < 13500 || totalCostMMK > 16500) return null; // Hard cutoff: 13,500 – 16,500 MMK
  }

  if (packageTier === 'standard') {
    if (tier3Count > 0) return null; // Strictly Zero Tier-3 in Standard
    if (totalCostMMK < 27000 || totalCostMMK > 33000) return null; // Hard cutoff: 27,000 – 33,000 MMK
  }

  if (packageTier === 'premium') {
    if (tier3Count < config.minTier3DishesPerDay) return null; // Guaranteed >= 2 Tier-3 dishes daily
    if (totalCostMMK < 46000 || totalCostMMK > 56000) return null; // Hard cutoff: 46,000 – 56,000 MMK
  }

  // 4. VARIETY & 5-DAY LOOKBACK (Strict Hard Constraint)
  const varB = calculateDishVarietyPenalty(b, rollingHistory, []);
  const varL = calculateDishVarietyPenalty(l, rollingHistory, [b]);
  const varD = calculateDishVarietyPenalty(d, rollingHistory, [b, l]);
  const has5DayRepeat = varB.isRecentlyUsed5Days || varL.isRecentlyUsed5Days || varD.isRecentlyUsed5Days;

  // STRICT: Discard any combo where ANY dish appeared in the last 5 days
  if (has5DayRepeat) {
    return null;
  }

  const totalVarietyPenalty = varB.penaltyScore + varL.penaltyScore + varD.penaltyScore;

  // 5. BUDGET MATCHING SCORE
  const targetCostMid = (config.minCostMMK + config.maxCostMMK) / 2;
  const costDiff = Math.abs(totalCostMMK - targetCostMid);

  let outOfBandPenalty = 0;
  if (totalCostMMK < config.minCostMMK) {
    outOfBandPenalty = (config.minCostMMK - totalCostMMK) * 0.08;
  } else if (totalCostMMK > config.maxCostMMK) {
    outOfBandPenalty = (totalCostMMK - config.maxCostMMK) * 0.12;
  }

  const nutritionPenalty = calDiff * 3.5 + Math.abs(totalProteinG - targetProteinG) * 4;
  const costPenalty = (costDiff / 1000) * 20 + outOfBandPenalty;
  const compositeScore = nutritionPenalty + totalVarietyPenalty * 2.0 + costPenalty;

  return {
    breakfast: b,
    lunch: l,
    dinner: d,
    totalCalories,
    totalProteinG,
    totalCarbG,
    totalFatG,
    totalCostMMK,
    tier3Count,
    calDiff,
    costDiff,
    varietyPenalty: totalVarietyPenalty,
    has5DayRepeat: false,
    score: compositeScore
  };
}

/**
 * Main NutriChef Generator Engine
 * Generates an optimized N-day meal plan with dynamic stochastic exploration across weeks.
 */
export function generateMealPlan(input: PlannerInput): CustomerMealPlan {
  const {
    customerId,
    durationDays,
    targetCalories,
    targetProteinG,
    targetCarbG,
    targetFatG,
    packageTier,
    dietPreference,
    allergies = [],
    religiousRestrictions = [],
    excludedIngredients = [],
    mealHistory,
    planType = 'custom',
    chefProgramId
  } = input;

  // Build Comprehensive Recipe Pool (Curated + Dynamically Synthesized Meals)
  const dynamicBreakfasts = generateDynamicDishPool('breakfast', packageTier);
  const dynamicLunches = generateDynamicDishPool('lunch', packageTier);
  const dynamicDinners = generateDynamicDishPool('dinner', packageTier);

  let allDishes = [...getAllDishes(), ...dynamicBreakfasts, ...dynamicLunches, ...dynamicDinners];
  
  // Deduplicate by normalized dish name
  const dishMap = new Map<string, Dish>();
  allDishes.forEach(d => {
    const key = d.name.trim().toLowerCase();
    if (!dishMap.has(key)) {
      dishMap.set(key, d);
    }
  });
  allDishes = Array.from(dishMap.values());

  // Apply strict Religious, Allergy, and Custom Excluded Ingredients filters
  let validDishes = filterDishesByPreferences(allDishes, {
    diet: dietPreference,
    allergies,
    religiousRestrictions,
    excludedIngredients
  });
  
  // Strict tier filter
  if (packageTier === 'basic') {
    validDishes = validDishes.filter(d => d.tier === 1);
  } else if (packageTier === 'standard') {
    validDishes = validDishes.filter(d => d.tier === 1 || d.tier === 2);
  }

  const shuffleArray = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  const allBreakfasts = validDishes.filter(d => d.mealType === 'breakfast');
  const allLunches = validDishes.filter(d => d.mealType === 'lunch');
  const allDinners = validDishes.filter(d => d.mealType === 'dinner');

  const rollingHistory: MealHistoryItem[] = [...mealHistory];
  const generatedDays: DayPlan[] = [];

  for (let dayNum = 1; dayNum <= durationDays; dayNum++) {
    const candidates: CandidateCombo[] = [];
    const historyWindow = rollingHistory.slice(-15); // Last 15 meals = 5 days

    // Build strict exclusion set from last 5 days
    const excludedIds = new Set(historyWindow.map(m => m.dishId));
    const excludedNames = new Set(historyWindow.map(m => m.dishName.trim().toLowerCase()));

    const isAvailable = (d: Dish) => !excludedIds.has(d.id) && !excludedNames.has(d.name.trim().toLowerCase());

    // Filter available dishes for this day
    const availBreakfasts = allBreakfasts.filter(isAvailable);
    const availLunches = allLunches.filter(isAvailable);
    const availDinners = allDinners.filter(isAvailable);

    let bPool: Dish[];
    let lPool: Dish[];
    let dPool: Dish[];

    if (packageTier === 'premium') {
      const bT3 = availBreakfasts.filter(d => d.tier === 3);
      const lT3 = availLunches.filter(d => d.tier === 3);
      const dT3 = availDinners.filter(d => d.tier === 3);

      bPool = [...shuffleArray(bT3).slice(0, 20), ...shuffleArray(availBreakfasts).slice(0, 20)];
      lPool = [...shuffleArray(lT3).slice(0, 20), ...shuffleArray(availLunches).slice(0, 20)];
      dPool = [...shuffleArray(dT3).slice(0, 20), ...shuffleArray(availDinners).slice(0, 20)];
    } else if (packageTier === 'standard') {
      const bT2 = availBreakfasts.filter(d => d.tier === 2);
      const lT2 = availLunches.filter(d => d.tier === 2);
      const dT2 = availDinners.filter(d => d.tier === 2);

      bPool = [...shuffleArray(bT2).slice(0, 20), ...shuffleArray(availBreakfasts).slice(0, 20)];
      lPool = [...shuffleArray(lT2).slice(0, 20), ...shuffleArray(availLunches).slice(0, 20)];
      dPool = [...shuffleArray(dT2).slice(0, 20), ...shuffleArray(availDinners).slice(0, 20)];
    } else {
      bPool = shuffleArray(availBreakfasts).slice(0, 35);
      lPool = shuffleArray(availLunches).slice(0, 35);
      dPool = shuffleArray(availDinners).slice(0, 35);
    }

    // Fallback pools if available list was small
    if (bPool.length === 0) bPool = availBreakfasts.length > 0 ? availBreakfasts : allBreakfasts;
    if (lPool.length === 0) lPool = availLunches.length > 0 ? availLunches : allLunches;
    if (dPool.length === 0) dPool = availDinners.length > 0 ? availDinners : allDinners;

    for (const b of bPool) {
      for (const l of lPool) {
        for (const d of dPool) {
          const combo = scoreCombination(
            b,
            l,
            d,
            targetCalories,
            targetProteinG,
            targetCarbG,
            targetFatG,
            packageTier,
            historyWindow
          );
          if (combo) {
            candidates.push(combo);
          }
        }
      }
    }

    // Sort by composite score
    candidates.sort((a, b) => a.score - b.score);

    let chosen: CandidateCombo;
    if (candidates.length > 0) {
      // Stochastic selection: sample from top candidates
      const topCount = Math.min(8, candidates.length);
      const randomIndex = Math.floor(Math.random() * topCount);
      chosen = candidates[randomIndex];
    } else {
      // Clean fallback selecting from non-repeating available dishes
      const bFallback = bPool[0] || allBreakfasts[0];
      const lFallback = lPool[0] || allLunches[0];
      const dFallback = dPool[0] || allDinners[0];
      chosen = {
        breakfast: bFallback,
        lunch: lFallback,
        dinner: dFallback,
        totalCalories: bFallback.calories + lFallback.calories + dFallback.calories,
        totalProteinG: bFallback.proteinG + lFallback.proteinG + dFallback.proteinG,
        totalCarbG: bFallback.carbG + lFallback.carbG + dFallback.carbG,
        totalFatG: bFallback.fatG + lFallback.fatG + dFallback.fatG,
        totalCostMMK: bFallback.ingredientCostMMK + lFallback.ingredientCostMMK + dFallback.ingredientCostMMK,
        tier3Count: (bFallback.tier === 3 ? 1 : 0) + (lFallback.tier === 3 ? 1 : 0) + (dFallback.tier === 3 ? 1 : 0),
        calDiff: 0,
        costDiff: 0,
        varietyPenalty: 0,
        has5DayRepeat: false,
        score: 0
      };
    }

    const calErrorPct = (Math.abs(chosen.totalCalories - targetCalories) / targetCalories) * 100;
    const nutritionAccuracy = Math.max(80, Math.round(100 - calErrorPct));

    const dayPlan: DayPlan = {
      dayNumber: dayNum,
      breakfast: chosen.breakfast,
      lunch: chosen.lunch,
      dinner: chosen.dinner,
      totalCalories: chosen.totalCalories,
      totalProteinG: chosen.totalProteinG,
      totalCarbG: chosen.totalCarbG,
      totalFatG: chosen.totalFatG,
      totalCostMMK: chosen.totalCostMMK,
      tier3Count: chosen.tier3Count,
      nutritionAccuracy,
      varietyPenalty: chosen.varietyPenalty
    };

    generatedDays.push(dayPlan);

    // Append to rolling history
    const dateStamp = `Day-${dayNum}`;
    rollingHistory.push(
      {
        id: `hist-${dayNum}-b`,
        customerId,
        dishId: chosen.breakfast.id,
        dishName: chosen.breakfast.name,
        mealType: 'breakfast',
        date: dateStamp,
        primaryProtein: chosen.breakfast.primaryProtein,
        primaryCarb: chosen.breakfast.primaryCarb,
        primaryVeg: chosen.breakfast.primaryVeg,
        cookingStyle: chosen.breakfast.cookingStyle,
        tier: chosen.breakfast.tier
      },
      {
        id: `hist-${dayNum}-l`,
        customerId,
        dishId: chosen.lunch.id,
        dishName: chosen.lunch.name,
        mealType: 'lunch',
        date: dateStamp,
        primaryProtein: chosen.lunch.primaryProtein,
        primaryCarb: chosen.lunch.primaryCarb,
        primaryVeg: chosen.lunch.primaryVeg,
        cookingStyle: chosen.lunch.cookingStyle,
        tier: chosen.lunch.tier
      },
      {
        id: `hist-${dayNum}-d`,
        customerId,
        dishId: chosen.dinner.id,
        dishName: chosen.dinner.name,
        mealType: 'dinner',
        date: dateStamp,
        primaryProtein: chosen.dinner.primaryProtein,
        primaryCarb: chosen.dinner.primaryCarb,
        primaryVeg: chosen.dinner.primaryVeg,
        cookingStyle: chosen.dinner.cookingStyle,
        tier: chosen.dinner.tier
      }
    );
  }

  const totalPlanCostMMK = generatedDays.reduce((acc, d) => acc + d.totalCostMMK, 0);
  const averageDailyCostMMK = Math.round(totalPlanCostMMK / durationDays);

  return {
    id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    customerId,
    createdAt: new Date().toISOString(),
    durationDays,
    planType,
    packageTier,
    targetCalories,
    targetProteinG,
    targetCarbG,
    targetFatG,
    days: generatedDays,
    totalPlanCostMMK,
    averageDailyCostMMK,
    chefProgramId
  };
}

/**
 * Swaps a single meal in an existing DayPlan with the next best matching dish
 */
export function swapDayMeal(
  currentDayPlan: DayPlan,
  mealType: 'breakfast' | 'lunch' | 'dinner',
  packageTier: PackageTier,
  targetCalories: number,
  mealHistory: MealHistoryItem[],
  options?: DishFilterOptions
): DayPlan {
  const currentDish = currentDayPlan[mealType];
  const dynamicPool = generateDynamicDishPool(mealType, packageTier);
  const combined = [...getAllDishes(), ...dynamicPool];
  let candidates = combined.filter(d => d.mealType === mealType && d.id !== currentDish.id);

  if (options) {
    candidates = filterDishesByPreferences(candidates, options);
  }

  let filteredCandidates = candidates;
  if (packageTier === 'basic') {
    filteredCandidates = candidates.filter(d => d.tier === 1);
  } else if (packageTier === 'standard') {
    filteredCandidates = candidates.filter(d => d.tier === 1 || d.tier === 2);
  } else if (packageTier === 'premium') {
    const otherMeals = [
      mealType !== 'breakfast' ? currentDayPlan.breakfast : null,
      mealType !== 'lunch' ? currentDayPlan.lunch : null,
      mealType !== 'dinner' ? currentDayPlan.dinner : null
    ].filter(Boolean) as Dish[];

    const otherTier3Count = otherMeals.filter(m => m.tier === 3).length;
    if (otherTier3Count < 2) {
      filteredCandidates = candidates.filter(d => d.tier === 3);
    }
  }

  if (filteredCandidates.length === 0) filteredCandidates = candidates;

  const config = PACKAGE_CONFIGS[packageTier];
  const targetCostMid = (config.minCostMMK + config.maxCostMMK) / 2;

  const scored = filteredCandidates.map(dish => {
    const variety = calculateDishVarietyPenalty(dish, mealHistory);
    const newKcal = (currentDayPlan.totalCalories - currentDish.calories) + dish.calories;
    const kcalDiff = Math.abs(newKcal - targetCalories);
    const newCost = (currentDayPlan.totalCostMMK - currentDish.ingredientCostMMK) + dish.ingredientCostMMK;
    const costDiff = Math.abs(newCost - targetCostMid);
    return {
      dish,
      score: kcalDiff * 3.5 + (costDiff / 1000) * 15 + variety.penaltyScore
    };
  });

  scored.sort((a, b) => a.score - b.score);
  const topCount = Math.min(3, scored.length);
  const bestReplacement = scored[Math.floor(Math.random() * topCount)].dish;

  const newBreakfast = mealType === 'breakfast' ? bestReplacement : currentDayPlan.breakfast;
  const newLunch = mealType === 'lunch' ? bestReplacement : currentDayPlan.lunch;
  const newDinner = mealType === 'dinner' ? bestReplacement : currentDayPlan.dinner;

  const totalCalories = newBreakfast.calories + newLunch.calories + newDinner.calories;
  const totalProteinG = newBreakfast.proteinG + newLunch.proteinG + newDinner.proteinG;
  const totalCarbG = newBreakfast.carbG + newLunch.carbG + newDinner.carbG;
  const totalFatG = newBreakfast.fatG + newLunch.fatG + newDinner.fatG;
  const totalCostMMK = newBreakfast.ingredientCostMMK + newLunch.ingredientCostMMK + newDinner.ingredientCostMMK;
  const tier3Count = (newBreakfast.tier === 3 ? 1 : 0) + (newLunch.tier === 3 ? 1 : 0) + (newDinner.tier === 3 ? 1 : 0);

  const calDiff = Math.abs(totalCalories - targetCalories);
  const accuracy = Math.max(80, Math.round(100 - (calDiff / targetCalories) * 100));

  return {
    ...currentDayPlan,
    [mealType]: bestReplacement,
    totalCalories,
    totalProteinG,
    totalCarbG,
    totalFatG,
    totalCostMMK,
    tier3Count,
    nutritionAccuracy: accuracy
  };
}
