import { Dish, DishTier, MealType } from '../types';

export interface IngredientModule {
  name: string;
  burmeseName?: string;
  category: 'protein' | 'carb' | 'veg';
  tier: DishTier;
  caloriesPer100g: number;
  proteinGPer100g: number;
  carbGPer100g: number;
  fatGPer100g: number;
  costMMKPer100g: number;
  defaultGrams: { breakfast: number; lunch: number; dinner: number; snack?: number };
}

// Modular Ingredient Inventory mapped to Yangon market portions
export const PROTEIN_MODULES: IngredientModule[] = [
  // --- Tier 1 Staples ---
  { name: 'Local Chicken', burmeseName: 'ကြက်ရင်အုံသား', category: 'protein', tier: 1, caloriesPer100g: 165, proteinGPer100g: 31, carbGPer100g: 0, fatGPer100g: 3.6, costMMKPer100g: 1350, defaultGrams: { breakfast: 120, lunch: 170, dinner: 160 } },
  { name: 'Farm Egg', burmeseName: 'ကြက်ဥ', category: 'protein', tier: 1, caloriesPer100g: 143, proteinGPer100g: 13, carbGPer100g: 0.7, fatGPer100g: 9.5, costMMKPer100g: 1200, defaultGrams: { breakfast: 150, lunch: 150, dinner: 150 } },
  { name: 'Shan Tofu', burmeseName: 'ရှမ်းတို့ဟူး', category: 'protein', tier: 1, caloriesPer100g: 110, proteinGPer100g: 12, carbGPer100g: 6, fatGPer100g: 4.5, costMMKPer100g: 800, defaultGrams: { breakfast: 140, lunch: 180, dinner: 160 } },
  { name: 'Yellow Vatana Peas', burmeseName: 'ပဲပြုတ် / စားတော်ပဲ', category: 'protein', tier: 1, caloriesPer100g: 118, proteinGPer100g: 9, carbGPer100g: 21, fatGPer100g: 0.8, costMMKPer100g: 700, defaultGrams: { breakfast: 130, lunch: 160, dinner: 150 } },
  
  // --- Tier 2 Quality ---
  { name: 'Inle Seabass', burmeseName: 'အင်းလေး ကကတစ်ငါး', category: 'protein', tier: 2, caloriesPer100g: 124, proteinGPer100g: 24, carbGPer100g: 0, fatGPer100g: 2.6, costMMKPer100g: 2950, defaultGrams: { breakfast: 120, lunch: 180, dinner: 170 } },
  { name: 'Beef Sirloin', burmeseName: 'အမဲသား (ဆာလွိုင်း)', category: 'protein', tier: 2, caloriesPer100g: 180, proteinGPer100g: 26, carbGPer100g: 0, fatGPer100g: 8.5, costMMKPer100g: 3450, defaultGrams: { breakfast: 110, lunch: 170, dinner: 160 } },
  { name: 'Pork Tenderloin', burmeseName: 'ဝက်တင်သား သန့်သန့်', category: 'protein', tier: 2, caloriesPer100g: 160, proteinGPer100g: 28, carbGPer100g: 0, fatGPer100g: 5.0, costMMKPer100g: 2350, defaultGrams: { breakfast: 110, lunch: 170, dinner: 160 } },
  { name: 'White Pomfret', burmeseName: 'ငါးမုတ်ဖြူ', category: 'protein', tier: 2, caloriesPer100g: 138, proteinGPer100g: 22, carbGPer100g: 0, fatGPer100g: 5.2, costMMKPer100g: 2850, defaultGrams: { breakfast: 110, lunch: 175, dinner: 165 } },
  { name: 'Calamari / Squid', burmeseName: 'ပြည်ကြီးငါး', category: 'protein', tier: 2, caloriesPer100g: 92, proteinGPer100g: 18, carbGPer100g: 3, fatGPer100g: 1.4, costMMKPer100g: 2600, defaultGrams: { breakfast: 110, lunch: 170, dinner: 160 } },

  // --- Tier 3 Premium Exclusives ---
  { name: 'Air-Flown Salmon', burmeseName: 'နော်ဝေဆယ်လမွန်ငါး', category: 'protein', tier: 3, caloriesPer100g: 208, proteinGPer100g: 22, carbGPer100g: 0, fatGPer100g: 13, costMMKPer100g: 17000, defaultGrams: { breakfast: 100, lunch: 150, dinner: 140 } },
  { name: 'Wagyu Striploin (MB 5+)', burmeseName: 'သြစတြေးလျ ဝါဂျူးအမဲ (MB 5+)', category: 'protein', tier: 3, caloriesPer100g: 235, proteinGPer100g: 24, carbGPer100g: 0, fatGPer100g: 15, costMMKPer100g: 31600, defaultGrams: { breakfast: 90, lunch: 140, dinner: 130 } },
  { name: 'Wild Tiger Prawn', burmeseName: 'ပင်လယ်ကျားပုစွန်ကြီး', category: 'protein', tier: 3, caloriesPer100g: 99, proteinGPer100g: 24, carbGPer100g: 0.2, fatGPer100g: 0.3, costMMKPer100g: 4600, defaultGrams: { breakfast: 120, lunch: 170, dinner: 160 } },
  { name: 'Giant River Prawn', burmeseName: 'ဧရာဝတီမြစ်ပုစွန်ထုပ်ကြီး', category: 'protein', tier: 3, caloriesPer100g: 106, proteinGPer100g: 23, carbGPer100g: 0.5, fatGPer100g: 1.2, costMMKPer100g: 5030, defaultGrams: { breakfast: 120, lunch: 170, dinner: 160 } },
  { name: 'Hokkaido Scallop', burmeseName: 'ဂျပန်ဟော့ကိုင်းဒိုးကမာခရု', category: 'protein', tier: 3, caloriesPer100g: 111, proteinGPer100g: 20, carbGPer100g: 5.4, fatGPer100g: 0.8, costMMKPer100g: 19600, defaultGrams: { breakfast: 90, lunch: 140, dinner: 130 } },
  { name: 'Yellowfin Tuna Loin', burmeseName: 'ဆာရှိမိအဆင့်တူနာငါး', category: 'protein', tier: 3, caloriesPer100g: 132, proteinGPer100g: 29, carbGPer100g: 0, fatGPer100g: 1.0, costMMKPer100g: 15600, defaultGrams: { breakfast: 100, lunch: 150, dinner: 140 } }
];

export const CARB_MODULES: IngredientModule[] = [
  // --- Tier 1 ---
  { name: 'Shwebo Pawsan Rice', burmeseName: 'ရွှေဘိုပေါ်ဆန်းထမင်း', category: 'carb', tier: 1, caloriesPer100g: 130, proteinGPer100g: 2.7, carbGPer100g: 28, fatGPer100g: 0.3, costMMKPer100g: 450, defaultGrams: { breakfast: 80, lunch: 100, dinner: 90 } },
  { name: 'Steamed Sweet Potato', burmeseName: 'ကန်စွန်းဥပေါင်း', category: 'carb', tier: 1, caloriesPer100g: 86, proteinGPer100g: 1.6, carbGPer100g: 20, fatGPer100g: 0.1, costMMKPer100g: 520, defaultGrams: { breakfast: 110, lunch: 140, dinner: 130 } },
  
  // --- Tier 2 ---
  { name: 'Shan Brown Rice', burmeseName: 'ရှမ်းဆန်လုံးညို', category: 'carb', tier: 2, caloriesPer100g: 123, proteinGPer100g: 2.7, carbGPer100g: 26, fatGPer100g: 1.0, costMMKPer100g: 850, defaultGrams: { breakfast: 80, lunch: 95, dinner: 85 } },
  { name: 'Purple Sweet Potato', burmeseName: 'ခရမ်းရောင်ကန်စွန်းဥ', category: 'carb', tier: 2, caloriesPer100g: 90, proteinGPer100g: 1.8, carbGPer100g: 21, fatGPer100g: 0.2, costMMKPer100g: 650, defaultGrams: { breakfast: 100, lunch: 130, dinner: 120 } },
  
  // --- Tier 3 ---
  { name: 'Royal Quinoa', burmeseName: 'သုံးရောင်စပ်ကွီနို', category: 'carb', tier: 3, caloriesPer100g: 120, proteinGPer100g: 4.4, carbGPer100g: 21, fatGPer100g: 1.9, costMMKPer100g: 4500, defaultGrams: { breakfast: 75, lunch: 90, dinner: 85 } },
  { name: 'Buckwheat Soba', burmeseName: 'ဂျပန်ဆိုဘာခေါက်ဆွဲ', category: 'carb', tier: 3, caloriesPer100g: 132, proteinGPer100g: 5.1, carbGPer100g: 27, fatGPer100g: 0.7, costMMKPer100g: 4500, defaultGrams: { breakfast: 75, lunch: 85, dinner: 80 } },
  { name: 'Forbidden Black Rice', burmeseName: 'အာဟာရပြည့်ဆန်နက်', category: 'carb', tier: 3, caloriesPer100g: 130, proteinGPer100g: 3.5, carbGPer100g: 27, fatGPer100g: 1.2, costMMKPer100g: 2800, defaultGrams: { breakfast: 75, lunch: 90, dinner: 85 } }
];

export const VEG_MODULES: IngredientModule[] = [
  // --- Tier 1 ---
  { name: 'Morning Glory', burmeseName: 'ကန်စွန်းရွက်', category: 'veg', tier: 1, caloriesPer100g: 19, proteinGPer100g: 2.6, carbGPer100g: 3.1, fatGPer100g: 0.2, costMMKPer100g: 200, defaultGrams: { breakfast: 80, lunch: 110, dinner: 110 } },
  { name: 'Chayote Squash', burmeseName: 'ဘူးသီး / ဂေါ်ရခါးသီး', category: 'veg', tier: 1, caloriesPer100g: 19, proteinGPer100g: 0.8, carbGPer100g: 4.5, fatGPer100g: 0.1, costMMKPer100g: 180, defaultGrams: { breakfast: 80, lunch: 100, dinner: 100 } },
  { name: 'Crisp Cabbage', burmeseName: 'ဂေါ်ဖီထုပ်', category: 'veg', tier: 1, caloriesPer100g: 23, proteinGPer100g: 1.5, carbGPer100g: 5.0, fatGPer100g: 0.1, costMMKPer100g: 190, defaultGrams: { breakfast: 80, lunch: 100, dinner: 100 } },

  // --- Tier 2 ---
  { name: 'Highland Broccoli', burmeseName: 'ပန်းဂေါ်ဖီစိမ်း (ဘရိုကိုလီ)', category: 'veg', tier: 2, caloriesPer100g: 34, proteinGPer100g: 2.8, carbGPer100g: 6.6, fatGPer100g: 0.4, costMMKPer100g: 750, defaultGrams: { breakfast: 70, lunch: 100, dinner: 100 } },
  { name: 'King Oyster Mushroom', burmeseName: 'ဘုရင်မှို (King Oyster)', category: 'veg', tier: 2, caloriesPer100g: 35, proteinGPer100g: 3.1, carbGPer100g: 5.3, fatGPer100g: 0.3, costMMKPer100g: 1400, defaultGrams: { breakfast: 70, lunch: 90, dinner: 90 } },
  { name: 'Baby Bok Choy', burmeseName: 'ဘေဘီမုန်ညင်းဖြူ', category: 'veg', tier: 2, caloriesPer100g: 25, proteinGPer100g: 2.0, carbGPer100g: 4.0, fatGPer100g: 0.2, costMMKPer100g: 600, defaultGrams: { breakfast: 70, lunch: 100, dinner: 100 } },

  // --- Tier 3 ---
  { name: 'Hass Avocado', burmeseName: 'ဟက်စ်အာဗိုကာဒိုသီး', category: 'veg', tier: 3, caloriesPer100g: 160, proteinGPer100g: 2.0, carbGPer100g: 8.5, fatGPer100g: 15.0, costMMKPer100g: 2800, defaultGrams: { breakfast: 60, lunch: 70, dinner: 70 } },
  { name: 'Baby Asparagus', burmeseName: 'နုနယ်သောကညွတ်စိမ်း', category: 'veg', tier: 3, caloriesPer100g: 20, proteinGPer100g: 2.2, carbGPer100g: 3.9, fatGPer100g: 0.1, costMMKPer100g: 5200, defaultGrams: { breakfast: 70, lunch: 90, dinner: 90 } },
  { name: 'Organic Curly Kale', burmeseName: 'ရှမ်းသဘာဝကေးလ်ရွက်', category: 'veg', tier: 3, caloriesPer100g: 49, proteinGPer100g: 4.3, carbGPer100g: 8.8, fatGPer100g: 0.9, costMMKPer100g: 3600, defaultGrams: { breakfast: 60, lunch: 80, dinner: 80 } }
];

export const COOKING_STYLES = [
  'Grilled',
  'Steamed',
  'Stir-fried',
  'Soup',
  'Curry (Light)',
  'Raw/Salad'
];

/**
 * Generates a dynamic synthesized dish by combining protein + carb + veg + cooking style
 */
export function synthesizeDish(
  protein: IngredientModule,
  carb: IngredientModule,
  veg: IngredientModule,
  cookingStyle: string,
  mealType: MealType
): Dish {
  const slot = (mealType === 'snack' ? 'lunch' : mealType) as 'breakfast' | 'lunch' | 'dinner';
  const pGrams = protein.defaultGrams[slot] || 120;
  const cGrams = carb.defaultGrams[slot] || 85;
  const vGrams = veg.defaultGrams[slot] || 90;

  const pProtein = (protein.proteinGPer100g * pGrams) / 100;
  const cProtein = (carb.proteinGPer100g * cGrams) / 100;
  const vProtein = (veg.proteinGPer100g * vGrams) / 100;
  const totalProtein = Math.round(pProtein + cProtein + vProtein);

  const pCarb = (protein.carbGPer100g * pGrams) / 100;
  const cCarb = (carb.carbGPer100g * cGrams) / 100;
  const vCarb = (veg.carbGPer100g * vGrams) / 100;
  const totalCarb = Math.round(pCarb + cCarb + vCarb);

  let extraFat = 0;
  if (cookingStyle === 'Stir-fried' || cookingStyle === 'Grilled') {
    extraFat = 8;
  } else if (cookingStyle === 'Soup' || cookingStyle === 'Steamed') {
    extraFat = 4;
  } else if (cookingStyle === 'Curry (Light)') {
    extraFat = 7;
  } else if (cookingStyle === 'Raw/Salad') {
    extraFat = 6;
  }

  const pFat = (protein.fatGPer100g * pGrams) / 100;
  const cFat = (carb.fatGPer100g * cGrams) / 100;
  const vFat = (veg.fatGPer100g * vGrams) / 100;
  const totalFat = Math.round(pFat + cFat + vFat + extraFat);

  const totalCalories = totalProtein * 4 + totalCarb * 4 + totalFat * 9;

  const maxTier = Math.max(protein.tier, carb.tier, veg.tier) as DishTier;
  
  // Calibrated target price bands per meal:
  // Tier 1: 4,500 – 5,500 MMK | Tier 2: 9,000 – 11,500 MMK | Tier 3: 15,500 – 18,500 MMK
  let calibratedCostMMK = 5000;
  if (maxTier === 1) {
    calibratedCostMMK = 4600 + ((pGrams + cGrams + vGrams) * 3) % 800;
  } else if (maxTier === 2) {
    calibratedCostMMK = 9300 + ((pGrams + cGrams + vGrams) * 7) % 1800;
  } else {
    calibratedCostMMK = 15900 + ((pGrams + cGrams + vGrams) * 11) % 2400;
  }

  const stylePrefix = cookingStyle === 'Soup' ? 'Simmered' : cookingStyle;
  const name = `${stylePrefix} ${protein.name} with ${veg.name} & ${carb.name}`;
  const burmeseName = `${protein.burmeseName || protein.name} ${veg.burmeseName || veg.name} ${carb.burmeseName || carb.name}`;

  const normProtein = protein.name.toLowerCase().replace(/\s+/g, '');
  const normCarb = carb.name.toLowerCase().replace(/\s+/g, '');
  const normVeg = veg.name.toLowerCase().replace(/\s+/g, '');
  const normStyle = cookingStyle.toLowerCase().slice(0, 4);
  const dishId = `dyn-${normProtein}-${normCarb}-${normVeg}-${normStyle}`;

  return {
    id: dishId,
    name,
    burmeseName,
    mealType,
    tier: maxTier,
    calories: totalCalories,
    proteinG: totalProtein,
    carbG: totalCarb,
    fatG: totalFat,
    ingredientCostMMK: calibratedCostMMK,
    primaryProtein: protein.name,
    primaryCarb: carb.name,
    primaryVeg: veg.name,
    cookingStyle,
    description: `Freshly prepared ${cookingStyle.toLowerCase()} ${protein.name.toLowerCase()} accompanied by ${veg.name.toLowerCase()} and warm ${carb.name.toLowerCase()}.`,
    ingredients: [
      `${protein.name} ${pGrams}g`,
      `${carb.name} ${cGrams}g`,
      `${veg.name} ${vGrams}g`,
      'Herbal garlic & seasoning'
    ],
    tags: [maxTier === 3 ? 'tier_3_signature' : maxTier === 2 ? 'clean_eating' : 'halal', 'high_protein']
  };
}

/**
 * Synthesizes a vast dynamic dish pool for a given meal type and tier constraint
 */
export function generateDynamicDishPool(mealType: MealType, packageTier: 'basic' | 'standard' | 'premium'): Dish[] {
  const pool: Dish[] = [];

  const validProteins = PROTEIN_MODULES.filter(p => {
    if (packageTier === 'basic') return p.tier === 1;
    if (packageTier === 'standard') return p.tier <= 2;
    return true;
  });

  const validCarbs = CARB_MODULES.filter(c => {
    if (packageTier === 'basic') return c.tier === 1;
    if (packageTier === 'standard') return c.tier <= 2;
    return true;
  });

  const validVegs = VEG_MODULES.filter(v => {
    if (packageTier === 'basic') return v.tier === 1;
    if (packageTier === 'standard') return v.tier <= 2;
    return true;
  });

  for (const protein of validProteins) {
    for (const carb of validCarbs) {
      for (const veg of validVegs) {
        const styles = (protein.name === 'Egg' || protein.name === 'Tofu')
          ? ['Stir-fried', 'Soup', 'Steamed']
          : ['Grilled', 'Steamed', 'Curry (Light)'];

        for (const style of styles) {
          const dish = synthesizeDish(protein, carb, veg, style, mealType);
          if (packageTier === 'basic' && dish.tier === 1) {
            pool.push(dish);
          } else if (packageTier === 'standard' && dish.tier <= 2) {
            pool.push(dish);
          } else if (packageTier === 'premium') {
            pool.push(dish);
          }
        }
      }
    }
  }

  return pool;
}
