import { PackageTier, TierPackageConfig } from '../types';

export const PACKAGE_CONFIGS: Record<PackageTier, TierPackageConfig> = {
  basic: {
    tier: 'basic',
    name: 'Basic Package',
    minCostMMK: 13500,
    maxCostMMK: 16500,
    targetCostRangeStr: '15,000 MMK / day (Range: 14,000 – 16,000 MMK)',
    highlightIngredients: ['Local Chicken Breast', 'Farm Fresh Eggs', 'Shan Chickpea Tofu', 'Yellow Vatana Peas', 'Shwebo Pawsan Rice', 'Morning Glory (Gazun)', 'Chayote'],
    minTier3DishesPerDay: 0,
    description: 'Fresh, nutritious Myanmar market staples prioritizing local lean chicken, farm fresh eggs, yellow vatana peas, Shan tofu, and local greens. Zero Tier-3 ingredients.',
    badgeColor: '#16a34a'
  },
  standard: {
    tier: 'standard',
    name: 'Standard Package',
    minCostMMK: 27000,
    maxCostMMK: 33000,
    targetCostRangeStr: '30,000 MMK / day (Range: 28,000 – 32,000 MMK)',
    highlightIngredients: ['Inle Seabass', 'Grass-fed Beef Sirloin/Tenderloin', 'White Pomfret', 'Shan Brown Rice', 'Sweet Potato', 'Highland Broccoli', 'King Oyster Mushrooms'],
    minTier3DishesPerDay: 0,
    description: 'Quality meats, fresh coastal seafood, unrefined grains, and premium mushrooms for balanced high-performance dining. Zero Tier-3 ingredients.',
    badgeColor: '#2563eb'
  },
  premium: {
    tier: 'premium',
    name: 'Premium Package',
    minCostMMK: 46000,
    maxCostMMK: 56000,
    targetCostRangeStr: '50,000 MMK / day (Range: 48,000 – 54,000 MMK)',
    highlightIngredients: ['Air-flown Norwegian Salmon', 'Australian Wagyu MB 5+', 'Wild Tiger Prawns', 'Giant River Prawns', 'Hokkaido Scallops', 'Tri-Color Quinoa', 'Buckwheat Soba', 'Forbidden Black Rice', 'Hass Avocado', 'Baby Asparagus'],
    minTier3DishesPerDay: 2,
    description: 'Artisanal gourmet experience featuring air-flown salmon, Wagyu MB 5+, scallops, and organic ancient grains. Tier-3 ingredients are strictly isolated to Premium.',
    badgeColor: '#d97706'
  }
};
