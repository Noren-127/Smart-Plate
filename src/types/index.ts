export type Role = 'customer' | 'chef';

export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type DietPreference = 'balanced' | 'high_protein' | 'keto' | 'low_carb' | 'halal' | 'buddhist_veg' | 'seafood_heavy' | 'pescatarian';

export type PackageTier = 'basic' | 'standard' | 'premium';

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  heightCm: number;
  weightKg: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: ActivityLevel;
  goal: Goal;
  calorieTarget: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  dietPreference: DietPreference;
  allergies?: string[];
  religiousRestrictions?: string[];
  excludedIngredients?: string[];
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type DishTier = 1 | 2 | 3;

export interface Dish {
  id: string;
  name: string;
  burmeseName?: string;
  mealType: MealType;
  tier: DishTier; // 1 = Basic, 2 = Standard, 3 = Premium
  calories: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  ingredientCostMMK: number;
  primaryProtein: string; // e.g., 'Chicken', 'Salmon', 'Egg', 'Prawn', 'Tofu', 'Seabass', 'Beef'
  primaryCarb: string;    // e.g., 'White Rice', 'Brown Rice', 'Quinoa', 'Soba', 'Oats', 'Sweet Potato'
  primaryVeg: string;     // e.g., 'Morning Glory', 'Broccoli', 'Asparagus', 'Avocado', 'Spinach', 'Mushroom'
  cookingStyle: string;   // e.g., 'Grilled', 'Steamed', 'Stir-fried', 'Soup', 'Raw/Salad', 'Curry (Light)'
  description: string;
  ingredients: string[];
  tags: string[];
  imageUrl?: string;
}

export interface DayPlan {
  dayNumber: number;
  dateStr?: string;
  breakfast: Dish;
  lunch: Dish;
  dinner: Dish;
  totalCalories: number;
  totalProteinG: number;
  totalCarbG: number;
  totalFatG: number;
  totalCostMMK: number;
  tier3Count: number;
  nutritionAccuracy: number; // percentage alignment to targets (0-100%)
  varietyPenalty: number;
}

export interface CustomerMealPlan {
  id: string;
  customerId: string;
  createdAt: string;
  durationDays: 7 | 10 | 30;
  planType: 'custom' | 'chef_program';
  packageTier: PackageTier;
  targetCalories: number;
  targetProteinG: number;
  targetCarbG: number;
  targetFatG: number;
  days: DayPlan[];
  totalPlanCostMMK: number;
  averageDailyCostMMK: number;
  chefProgramId?: string;
  chefProgramName?: string;
  displayName?: string;
  deliveryAllowed?: boolean;
  startDate?: string;
  endDate?: string;
  cancelledAt?: string;
  mealPlanReleased?: boolean;
}

export interface MealHistoryItem {
  id: string;
  customerId: string;
  dishId: string;
  dishName: string;
  mealType: MealType;
  date: string;
  primaryProtein: string;
  primaryCarb: string;
  primaryVeg: string;
  cookingStyle: string;
  tier: DishTier;
}

export interface ChefProgram {
  id: string;
  chefId: string;
  chefName: string;
  programName: string;
  description: string;
  durationDays: 7 | 10 | 30;
  packageTier: PackageTier;
  originalPriceMMK: number;
  discountPercentage: number;
  finalPriceMMK: number;
  maxCustomers: number;
  enrolledCustomers: number;
  startDate: string;
  targetGoal: Goal;
  dailyAvgCalories: number;
  tags: string[];
  sampleDishes: string[];
  mealsReleased?: boolean;
  deliveryAllowed?: boolean;
}

export interface IngredientPrice {
  id: string;
  name: string;
  burmeseName?: string;
  category: 'protein' | 'carb' | 'vegetable' | 'seasoning_oil';
  unit: string;
  currentPriceMMK: number;
  pricePerGramMMK?: number;
  marketSource: string;
  tier: DishTier;
  lastUpdated: string;
  proteinPer100g?: number;
  carbPer100g?: number;
  fatPer100g?: number;
  caloriesPer100g?: number;
  priceHistory?: { date: string; priceMMK: number }[];
}

export type IngredientPriceIndex = IngredientPrice;

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  planId?: string;
  chefProgramId?: string;
  planDisplayName: string;
  packageTier: PackageTier;
  durationDays: number;
  dailyCalories: number;
  dailyProteinG: number;
  totalAmountMMK: number;
  deliveryTownship: string;
  deliveryAddress: string;
  deliverySlot: 'morning' | 'afternoon';
  contactPhone: string;
  paymentMethod: 'kpay' | 'wave' | 'cbpay' | 'cod';
  paymentStatus: 'paid' | 'pending';
  orderStatus: 'active' | 'confirmed' | 'delivered' | 'cancelled';
  createdAt: string;
  startDate: string;
  notes?: string;
}

export interface TierPackageConfig {
  tier: PackageTier;
  name: string;
  minCostMMK: number;
  maxCostMMK: number;
  targetCostRangeStr: string;
  highlightIngredients: string[];
  minTier3DishesPerDay: number;
  description: string;
  badgeColor: string;
}
