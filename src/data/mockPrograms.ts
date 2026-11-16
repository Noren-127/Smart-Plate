import { ChefProgram } from '../types';

export const DEFAULT_CHEF_PROGRAMS: ChefProgram[] = [
  // =========================================================================
  // COLUMN 1: BASIC TIER (15,000 MMK / day target)
  // =========================================================================
  {
    id: 'prog-b1',
    chefId: 'chef-aung',
    chefName: 'Chef Aung Min',
    programName: 'Smart Metro Balanced Daily Fuel',
    description: 'Fresh, high-protein staple program cooked with traditional herbs, local tender chicken breast, yellow vatana peas, and fresh morning glory.',
    durationDays: 7,
    packageTier: 'basic',
    originalPriceMMK: 105000, // 7 days * 15,000 MMK
    discountPercentage: 10,
    finalPriceMMK: 94500,     // 13,500 MMK / day
    maxCustomers: 30,
    enrolledCustomers: 27,
    startDate: '2026-08-22',
    targetGoal: 'maintain',
    dailyAvgCalories: 2000,
    tags: ['Basic Tier-1', 'Local Chicken', 'Shan Tofu', 'Fresh Greens'],
    sampleDishes: ['Steamed Chicken Egg Rice', 'Shan Yellow Tofu Bowl', 'Garlic Morning Glory Chicken'],
    deliveryAllowed: false,
    mealsReleased: false
  },
  {
    id: 'prog-b2',
    chefId: 'chef-sumon',
    chefName: 'Chef Su Mon',
    programName: 'Clean Gut & Metabolism Reset',
    description: 'Gut-healing staple program rich in steamed farm eggs, Shan chickpea tofu, yellow vatana pea purees, and fiber-rich local chayote squash.',
    durationDays: 10,
    packageTier: 'basic',
    originalPriceMMK: 150000, // 10 days * 15,000 MMK
    discountPercentage: 12,
    finalPriceMMK: 132000,    // 13,200 MMK / day
    maxCustomers: 25,
    enrolledCustomers: 21,
    startDate: '2026-08-24',
    targetGoal: 'lose',
    dailyAvgCalories: 1900,
    tags: ['Basic Tier-1', 'High Fiber', 'Chayote & Egg', 'Shan Chickpea'],
    sampleDishes: ['Boiled Farm Egg Sweet Potato', 'Minced Chicken Green Beans', 'Shan Tofu & Egg Clear Broth'],
    deliveryAllowed: false,
    mealsReleased: false
  },

  // =========================================================================
  // COLUMN 2: STANDARD TIER (30,000 MMK / day target)
  // =========================================================================
  {
    id: 'prog-s1',
    chefId: 'chef-kyaw',
    chefName: 'Chef Kyaw Zeya',
    programName: 'Yangon Lean Beast',
    description: 'Precision cut program featuring Inle seabass, grass-fed beef sirloin, Shan brown rice, sweet potatoes, and recovery highland broccoli.',
    durationDays: 10,
    packageTier: 'standard',
    originalPriceMMK: 300000, // 10 days * 30,000 MMK
    discountPercentage: 15,
    finalPriceMMK: 255000,    // 25,500 MMK / day
    maxCustomers: 25,
    enrolledCustomers: 22,
    startDate: '2026-08-25',
    targetGoal: 'lose',
    dailyAvgCalories: 2050,
    tags: ['Standard Tier-2', 'Inle Seabass', 'Beef Sirloin', 'Shan Brown Rice'],
    sampleDishes: ['Inle Seabass & Brown Rice', 'Charred Beef Hash', 'Lemongrass Flame Chicken'],
    deliveryAllowed: false,
    mealsReleased: false
  },
  {
    id: 'prog-s2',
    chefId: 'chef-htet',
    chefName: 'Chef Htet Myat',
    programName: 'Highland Muscle Hypertrophy',
    description: 'Comprehensive 1-month high-protein conditioning menu featuring white pomfret, beef tenderloin, calamari, king oyster mushrooms, and Shan brown rice.',
    durationDays: 30,
    packageTier: 'standard',
    originalPriceMMK: 900000, // 30 days * 30,000 MMK
    discountPercentage: 18,
    finalPriceMMK: 738000,    // 24,600 MMK / day
    maxCustomers: 20,
    enrolledCustomers: 16,
    startDate: '2026-08-23',
    targetGoal: 'gain',
    dailyAvgCalories: 2400,
    tags: ['Standard Tier-2', 'White Pomfret', 'Beef Tenderloin', 'King Oyster'],
    sampleDishes: ['Pan-Roasted White Pomfret', 'Char-Grilled Beef Skewers', 'Seabass Shiitake Stew'],
    deliveryAllowed: false,
    mealsReleased: false
  },

  // =========================================================================
  // COLUMN 3: PREMIUM TIER (50,000 MMK / day target)
  // =========================================================================
  {
    id: 'prog-p1',
    chefId: 'chef-minkhant',
    chefName: 'Chef Min Khant',
    programName: 'Executive Signature Chef Table',
    description: 'Executive gourmet dining featuring Australian Wagyu MB 5+, Hokkaido scallops, wild giant tiger prawns, baby asparagus, and forbidden black rice.',
    durationDays: 10,
    packageTier: 'premium',
    originalPriceMMK: 500000, // 10 days * 50,000 MMK
    discountPercentage: 15,
    finalPriceMMK: 425000,    // 42,500 MMK / day
    maxCustomers: 15,
    enrolledCustomers: 13,
    startDate: '2026-08-26',
    targetGoal: 'maintain',
    dailyAvgCalories: 2200,
    tags: ['Premium Tier-3', 'Wagyu MB 5+', 'Hokkaido Scallops', 'Forbidden Black Rice'],
    sampleDishes: ['Wagyu Tenderloin Asparagus Slices', 'Pan-Seared Hokkaido Scallops', 'Giant River Prawn Soba'],
    deliveryAllowed: false,
    mealsReleased: false
  },
  {
    id: 'prog-p2',
    chefId: 'chef-thiri',
    chefName: 'Chef Thiri May',
    programName: 'Gourmet Omega Superfood Experience',
    description: '30-day elite superfood journey with air-flown Norwegian salmon, Hass avocado, wild giant tiger prawns, organic tri-color quinoa, and buckwheat soba.',
    durationDays: 30,
    packageTier: 'premium',
    originalPriceMMK: 1500000, // 30 days * 50,000 MMK
    discountPercentage: 20,
    finalPriceMMK: 1200000,    // 40,000 MMK / day
    maxCustomers: 12,
    enrolledCustomers: 9,
    startDate: '2026-08-28',
    targetGoal: 'maintain',
    dailyAvgCalories: 2250,
    tags: ['Premium Tier-3', 'Norwegian Salmon', 'Tiger Prawns', 'Organic Quinoa'],
    sampleDishes: ['Air-Flown Salmon Quinoa Bowl', 'Tiger Prawn Buckwheat Soba', 'Avocado Poached Egg Puree'],
    deliveryAllowed: false,
    mealsReleased: false
  }
];
