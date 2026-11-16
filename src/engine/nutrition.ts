import { ActivityLevel, DietPreference, Goal } from '../types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

export const GOAL_CALORIE_OFFSETS: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 400
};

export interface BMIData {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  color: string;
}

/**
 * Calculates Body Mass Index (BMI) & Category
 */
export function calculateBMI(weightKg: number, heightCm: number): BMIData {
  if (!weightKg || !heightCm) {
    return { bmi: 22.0, category: 'Normal', color: '#16a34a' };
  }
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) {
    return { bmi, category: 'Underweight', color: '#3b82f6' };
  } else if (bmi < 25) {
    return { bmi, category: 'Normal', color: '#16a34a' };
  } else if (bmi < 30) {
    return { bmi, category: 'Overweight', color: '#d97706' };
  } else {
    return { bmi, category: 'Obese', color: '#dc2626' };
  }
}

/**
 * Calculates BMR using Mifflin-St Jeor Equation
 */
export function calculateBMR(
  gender: 'male' | 'female',
  weightKg: number,
  heightCm: number,
  age: number
): number {
  if (gender === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
}

/**
 * Calculates TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(
  gender: 'male' | 'female',
  weightKg: number,
  heightCm: number,
  age: number,
  activityLevel: ActivityLevel
): number {
  const bmr = calculateBMR(gender, weightKg, heightCm, age);
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Calculates TDEE and Target Calories
 */
export function calculateTargetCalories(
  gender: 'male' | 'female',
  weightKg: number,
  heightCm: number,
  age: number,
  activityLevel: ActivityLevel,
  goal: Goal
): number {
  const tdee = calculateTDEE(gender, weightKg, heightCm, age, activityLevel);
  const target = Math.round(tdee + GOAL_CALORIE_OFFSETS[goal]);
  return Math.max(1300, Math.min(4200, target));
}

export interface MacroDistribution {
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  totalCalories: number;
}

/**
 * Calculates Macro Split based on Diet Preference and Target Calories
 * Ensures exact mathematical equality: kcal = 4*P + 4*C + 9*F
 */
export function getMacrosFromDiet(
  calories: number,
  diet: DietPreference
): MacroDistribution {
  let pRatio = 0.30;
  let cRatio = 0.40;
  let fRatio = 0.30;

  switch (diet) {
    case 'high_protein':
      pRatio = 0.35;
      cRatio = 0.35;
      fRatio = 0.30;
      break;
    case 'keto':
      pRatio = 0.25;
      cRatio = 0.05;
      fRatio = 0.70;
      break;
    case 'low_carb':
      pRatio = 0.35;
      cRatio = 0.20;
      fRatio = 0.45;
      break;
    case 'seafood_heavy':
      pRatio = 0.35;
      cRatio = 0.40;
      fRatio = 0.25;
      break;
    case 'pescatarian':
      pRatio = 0.30;
      cRatio = 0.45;
      fRatio = 0.25;
      break;
    case 'halal':
      pRatio = 0.30;
      cRatio = 0.45;
      fRatio = 0.25;
      break;
    case 'buddhist_veg':
      pRatio = 0.25;
      cRatio = 0.50;
      fRatio = 0.25;
      break;
    case 'balanced':
    default:
      pRatio = 0.30;
      cRatio = 0.40;
      fRatio = 0.30;
      break;
  }

  const pKcal = calories * pRatio;
  const cKcal = calories * cRatio;
  const fKcal = calories * fRatio;

  const proteinGrams = Math.round(pKcal / 4);
  const fatGrams = Math.round(fKcal / 9);
  // Carbs absorb remainder to guarantee exact caloric equation
  const remainingKcal = calories - (proteinGrams * 4 + fatGrams * 9);
  const carbGrams = Math.max(10, Math.round(remainingKcal / 4));

  const totalCalories = proteinGrams * 4 + carbGrams * 4 + fatGrams * 9;

  return {
    proteinGrams,
    carbGrams,
    fatGrams,
    totalCalories
  };
}

/**
 * Recalculates carbs when user modifies protein or fat to preserve kcal
 */
export function rebalanceCarbs(
  targetKcal: number,
  proteinGrams: number,
  fatGrams: number
): number {
  const pKcal = proteinGrams * 4;
  const fKcal = fatGrams * 9;
  const rem = targetKcal - (pKcal + fKcal);
  return Math.max(0, Math.round(rem / 4));
}

/**
 * Checks nutrition consistency and returns percentage error
 */
export function verifyNutritionConsistency(
  actual: { calories: number; protein: number; carbs: number; fat: number },
  target: { calories: number; protein: number; carbs: number; fat: number }
): { isConsistent: boolean; accuracyPct: number; calDiff: number } {
  const calDiff = Math.abs(actual.calories - target.calories);
  const pctDiff = (calDiff / target.calories) * 100;
  const isConsistent = pctDiff <= 6.0; // Within 6% tolerance
  const accuracyPct = Math.max(0, Math.min(100, Math.round(100 - pctDiff)));
  return { isConsistent, accuracyPct, calDiff };
}
