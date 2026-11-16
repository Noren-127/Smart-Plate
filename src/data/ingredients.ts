import { IngredientPrice } from '../types';
import { generateIngredients } from './generatedCatalog';

export const BASE_YGN_INGREDIENT_PRICES: IngredientPrice[] = [
  // =========================================================================
  // TIER 1: BASIC STAPLES (High affordability, widely sourced in Yangon wet markets)
  // =========================================================================
  {
    id: 'ing-t1-01',
    name: 'Local Chicken Breast (Boneless / Skinless)',
    burmeseName: 'ကြက်ရင်အုံသား (ပြည်တွင်းစစ်စစ်)',
    tier: 1,
    category: 'protein',
    currentPriceMMK: 22000,
    unit: 'viss (1.63 kg)',
    pricePerGramMMK: 13.5,
    marketSource: 'Thiri Mingalar Wholesale Market, Yangon',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 20500 },
      { date: '2026-08-10', priceMMK: 21000 },
      { date: '2026-08-18', priceMMK: 22000 }
    ]
  },
  {
    id: 'ing-t1-02',
    name: 'Farm Fresh Chicken Eggs (CP / Local)',
    burmeseName: 'လတ်ဆတ်သော ကြက်ဥ (အလတ်စား)',
    tier: 1,
    category: 'protein',
    currentPriceMMK: 6000,
    unit: '10 pcs',
    pricePerGramMMK: 12.0,
    marketSource: 'Bogyoke Market & Local Quality Retail',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 5500 },
      { date: '2026-08-18', priceMMK: 6000 }
    ]
  },
  {
    id: 'ing-t1-03',
    name: 'Shan Yellow Chickpea Tofu (To-Hpu)',
    burmeseName: 'ရှမ်းတို့ဟူးစစ်စစ်',
    tier: 1,
    category: 'protein',
    currentPriceMMK: 10000,
    unit: 'viss',
    pricePerGramMMK: 6.1,
    marketSource: 'Nyaung Pin Lay Market, Yangon',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 9500 },
      { date: '2026-08-18', priceMMK: 10000 }
    ]
  },
  {
    id: 'ing-t1-04',
    name: 'Yellow Vatana Peas (Pe-Byouk)',
    burmeseName: 'ပဲပြုတ် / စားတော်ပဲ',
    tier: 1,
    category: 'protein',
    currentPriceMMK: 11000,
    unit: 'viss',
    pricePerGramMMK: 6.7,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 10500 },
      { date: '2026-08-18', priceMMK: 11000 }
    ]
  },
  {
    id: 'ing-t1-05',
    name: 'Fresh Tilapia Fillet (Nga-Pyi-Ma)',
    burmeseName: 'တီလားပီးယားငါး အသားလွှာ',
    tier: 1,
    category: 'protein',
    currentPriceMMK: 18000,
    unit: 'viss',
    pricePerGramMMK: 11.0,
    marketSource: 'San Pya Fish Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 17000 },
      { date: '2026-08-18', priceMMK: 18000 }
    ]
  },
  {
    id: 'ing-t1-06',
    name: 'Traditional White Soy Tofu Blocks',
    burmeseName: 'ပဲပိစပ် တို့ဟူးဖြူ',
    tier: 1,
    category: 'protein',
    currentPriceMMK: 8000,
    unit: '10 blocks',
    pricePerGramMMK: 5.3,
    marketSource: 'Nyaung Pin Lay Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 7500 },
      { date: '2026-08-18', priceMMK: 8000 }
    ]
  },
  {
    id: 'ing-t1-07',
    name: 'Green Moong Dal / Split Mung Beans',
    burmeseName: 'မတ်ပဲခြမ်း / ပဲတီစိမ်း',
    tier: 1,
    category: 'protein',
    currentPriceMMK: 9500,
    unit: 'viss',
    pricePerGramMMK: 5.8,
    marketSource: 'Bayintnaung Wholesale Center',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 9000 },
      { date: '2026-08-18', priceMMK: 9500 }
    ]
  },
  {
    id: 'ing-t1-08',
    name: 'Fresh Ayeyarwady Rohu Fish (Nga-Myit-Chin)',
    burmeseName: 'ငါးမြစ်ချင်းလတ်လတ်ဆတ်ဆတ်',
    tier: 1,
    category: 'protein',
    currentPriceMMK: 24000,
    unit: 'viss',
    pricePerGramMMK: 14.7,
    marketSource: 'San Pya Fish Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 22000 },
      { date: '2026-08-18', priceMMK: 24000 }
    ]
  },
  {
    id: 'ing-t1-09',
    name: 'Minced Local Farm Chicken',
    burmeseName: 'ကြက်သားနုတ်နုတ်စင်း',
    tier: 1,
    category: 'protein',
    currentPriceMMK: 23000,
    unit: 'viss',
    pricePerGramMMK: 14.1,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 21500 },
      { date: '2026-08-18', priceMMK: 23000 }
    ]
  },
  {
    id: 'ing-t1-10',
    name: 'Freshwater Catfish Fillet (Nga-Dan)',
    burmeseName: 'ငါးတန် အသားလွှာ',
    tier: 1,
    category: 'protein',
    currentPriceMMK: 20000,
    unit: 'viss',
    pricePerGramMMK: 12.3,
    marketSource: 'San Pya Fish Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 19000 },
      { date: '2026-08-18', priceMMK: 20000 }
    ]
  },

  // TIER 1 CARBS
  {
    id: 'ing-t1-11',
    name: 'Shwebo Pawsan White Jasmine Rice',
    burmeseName: 'ရွှေဘိုပေါ်ဆန်းမွှေး ဆန်သစ်',
    tier: 1,
    category: 'carb',
    currentPriceMMK: 9000,
    unit: 'pyi (2.1 kg)',
    pricePerGramMMK: 4.2,
    marketSource: 'Bayintnaung Rice Wholesale Center',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 8500 },
      { date: '2026-08-18', priceMMK: 9000 }
    ]
  },
  {
    id: 'ing-t1-12',
    name: 'Ayeyarwady Emata White Rice',
    burmeseName: 'ဧရာဝတီ ဧည့်မထဆန်',
    tier: 1,
    category: 'carb',
    currentPriceMMK: 7500,
    unit: 'pyi (2.1 kg)',
    pricePerGramMMK: 3.5,
    marketSource: 'Bayintnaung Wholesale Center',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 7000 },
      { date: '2026-08-18', priceMMK: 7500 }
    ]
  },
  {
    id: 'ing-t1-13',
    name: 'Steamed Golden Sweet Potato',
    burmeseName: 'ကန်စွန်းဥဝါပေါင်း',
    tier: 1,
    category: 'carb',
    currentPriceMMK: 4500,
    unit: 'viss',
    pricePerGramMMK: 2.7,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 4000 },
      { date: '2026-08-18', priceMMK: 4500 }
    ]
  },
  {
    id: 'ing-t1-14',
    name: 'Fresh Rice Noodles (Mote-Htin / Mont-Phat)',
    burmeseName: 'ဆန်ခေါက်ဆွဲဖတ် / မုန့်ဖတ်',
    tier: 1,
    category: 'carb',
    currentPriceMMK: 3500,
    unit: 'viss',
    pricePerGramMMK: 2.1,
    marketSource: 'Insein Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 3000 },
      { date: '2026-08-18', priceMMK: 3500 }
    ]
  },
  {
    id: 'ing-t1-15',
    name: 'Boiled Cassava Root (Myauk-Oo)',
    burmeseName: 'ပိန်းဥ / မျောက်ဥ',
    tier: 1,
    category: 'carb',
    currentPriceMMK: 4000,
    unit: 'viss',
    pricePerGramMMK: 2.4,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 3500 },
      { date: '2026-08-18', priceMMK: 4000 }
    ]
  },
  {
    id: 'ing-t1-16',
    name: 'Rolled Oats Porridge Flakes',
    burmeseName: 'အုတ်ဂျုံယာဂုစေ့',
    tier: 1,
    category: 'carb',
    currentPriceMMK: 6500,
    unit: '500g pack',
    pricePerGramMMK: 13.0,
    marketSource: 'City Mart & Supermarket Retail',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 6000 },
      { date: '2026-08-18', priceMMK: 6500 }
    ]
  },

  // TIER 1 VEGETABLES
  {
    id: 'ing-t1-17',
    name: 'Fresh Morning Glory (Gazun Ywet)',
    burmeseName: 'ကန်စွန်းရွက်',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 3000,
    unit: 'viss',
    pricePerGramMMK: 1.8,
    marketSource: 'Insein Market, Yangon',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 2500 },
      { date: '2026-08-18', priceMMK: 3000 }
    ]
  },
  {
    id: 'ing-t1-18',
    name: 'Fresh Chayote Squash (Bu-Thee)',
    burmeseName: 'ဘူးသီး / ဂေါ်ရခါးသီး',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 2500,
    unit: 'viss',
    pricePerGramMMK: 1.5,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 2200 },
      { date: '2026-08-18', priceMMK: 2500 }
    ]
  },
  {
    id: 'ing-t1-19',
    name: 'Local Crisp Cabbage (Gaw-Phee)',
    burmeseName: 'ဂေါ်ဖီထုပ်',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 2800,
    unit: 'viss',
    pricePerGramMMK: 1.7,
    marketSource: 'Insein Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 2400 },
      { date: '2026-08-18', priceMMK: 2800 }
    ]
  },
  {
    id: 'ing-t1-20',
    name: 'Fresh Sweet Carrots',
    burmeseName: 'မုန်လာဥနီ',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 4500,
    unit: 'viss',
    pricePerGramMMK: 2.7,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 4000 },
      { date: '2026-08-18', priceMMK: 4500 }
    ]
  },
  {
    id: 'ing-t1-21',
    name: 'Yardlong Green Beans (Pe-Daung-Shey)',
    burmeseName: 'ပဲတောင့်ရှည်',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 3500,
    unit: 'viss',
    pricePerGramMMK: 2.1,
    marketSource: 'Nyaung Pin Lay Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 3000 },
      { date: '2026-08-18', priceMMK: 3500 }
    ]
  },
  {
    id: 'ing-t1-22',
    name: 'Fresh Sweet Country Tomatoes',
    burmeseName: 'ဒေသထွက် ခရမ်းချဉ်သီး',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 4000,
    unit: 'viss',
    pricePerGramMMK: 2.4,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 3500 },
      { date: '2026-08-18', priceMMK: 4000 }
    ]
  },
  {
    id: 'ing-t1-23',
    name: 'Local Fresh Mustard Greens (Mon-Nyin)',
    burmeseName: 'မုန်ညင်းစိမ်း',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 3200,
    unit: 'viss',
    pricePerGramMMK: 1.9,
    marketSource: 'Insein Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 2800 },
      { date: '2026-08-18', priceMMK: 3200 }
    ]
  },
  {
    id: 'ing-t1-24',
    name: 'Watercress (Ye-Kan-Zun)',
    burmeseName: 'ရေကန်စွန်းရွက်',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 2800,
    unit: 'viss',
    pricePerGramMMK: 1.7,
    marketSource: 'Insein Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 2400 },
      { date: '2026-08-18', priceMMK: 2800 }
    ]
  },
  {
    id: 'ing-t1-25',
    name: 'Roselle Sour Leaves (Chin-Baung Ywet)',
    burmeseName: 'ချဉ်ပေါင်ရွက်နုနု',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 2600,
    unit: 'viss',
    pricePerGramMMK: 1.6,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 2200 },
      { date: '2026-08-18', priceMMK: 2600 }
    ]
  },
  {
    id: 'ing-t1-26',
    name: 'Fresh Bamboo Shoots (Hmyin)',
    burmeseName: 'မျှစ်နုနုလတ်ဆတ်ဆတ်',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 3800,
    unit: 'viss',
    pricePerGramMMK: 2.3,
    marketSource: 'Nyaung Pin Lay Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 3400 },
      { date: '2026-08-18', priceMMK: 3800 }
    ]
  },
  {
    id: 'ing-t1-27',
    name: 'Local Purple Eggplant (Khayan-Thee)',
    burmeseName: 'ခရမ်းသီး',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 3200,
    unit: 'viss',
    pricePerGramMMK: 1.9,
    marketSource: 'Insein Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 2900 },
      { date: '2026-08-18', priceMMK: 3200 }
    ]
  },
  {
    id: 'ing-t1-28',
    name: 'Tender Ladyfinger / Okra (Yone-Padi-Thee)',
    burmeseName: 'ရုံးပတီသီး',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 3400,
    unit: 'viss',
    pricePerGramMMK: 2.1,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 3000 },
      { date: '2026-08-18', priceMMK: 3400 }
    ]
  },

  // =========================================================================
  // TIER 2: QUALITY INGREDIENTS (High-grade protein, unrefined carbs & specialty greens)
  // =========================================================================
  {
    id: 'ing-t2-01',
    name: 'Inle Lake Seabass / Barramundi (Ka-Ka-Dit)',
    burmeseName: 'အင်းလေး ကကတစ်ငါးလွှာ',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 48000,
    unit: 'viss (1.63 kg)',
    pricePerGramMMK: 29.4,
    marketSource: 'San Pya Fish Market / Inle Cold Chain',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 45000 },
      { date: '2026-08-10', priceMMK: 47000 },
      { date: '2026-08-18', priceMMK: 48000 }
    ]
  },
  {
    id: 'ing-t2-02',
    name: 'Local Grass-Fed Beef Sirloin Strips',
    burmeseName: 'မြက်စားနွား အမဲသား (ဆာလွိုင်း)',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 56000,
    unit: 'viss (1.63 kg)',
    pricePerGramMMK: 34.3,
    marketSource: 'Bahan Quality Meat Market & City Mart',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 52000 },
      { date: '2026-08-18', priceMMK: 56000 }
    ]
  },
  {
    id: 'ing-t2-03',
    name: 'Trimmed Lean Pork Tenderloin (Skinless/Fat Trimmed)',
    burmeseName: 'ဝက်တင်သား သန့်သန့် (အဆီမပါ)',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 38000,
    unit: 'viss',
    pricePerGramMMK: 23.3,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 36000 },
      { date: '2026-08-18', priceMMK: 38000 }
    ]
  },
  {
    id: 'ing-t2-04',
    name: 'Fresh Bay Squid / Calamari (Pyi-Gyi-Nga)',
    burmeseName: 'ပင်လယ် ပြည်ကြီးငါးလတ်လတ်ဆတ်ဆတ်',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 42000,
    unit: 'viss',
    pricePerGramMMK: 25.7,
    marketSource: 'San Pya Fish Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 40000 },
      { date: '2026-08-18', priceMMK: 42000 }
    ]
  },
  {
    id: 'ing-t2-05',
    name: 'White Pomfret / Butterfish (Nga-Moke)',
    burmeseName: 'ငါးမုတ်ဖြူ လတ်လတ်ဆတ်ဆတ်',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 46000,
    unit: 'viss',
    pricePerGramMMK: 28.2,
    marketSource: 'San Pya Fish Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 44000 },
      { date: '2026-08-18', priceMMK: 46000 }
    ]
  },
  {
    id: 'ing-t2-06',
    name: 'Mandalay Free-Range Duck Breast',
    burmeseName: 'မန္တလေး ဘဲရင်အုံသား',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 36000,
    unit: 'viss',
    pricePerGramMMK: 22.0,
    marketSource: 'City Mart & Ocean Supercenter',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 34000 },
      { date: '2026-08-18', priceMMK: 36000 }
    ]
  },
  {
    id: 'ing-t2-07',
    name: 'Red Snapper Fillet (Nga-Par-Ni)',
    burmeseName: 'ငါးပါးနီ အသားလွှာ',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 45000,
    unit: 'viss',
    pricePerGramMMK: 27.6,
    marketSource: 'San Pya Fish Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 42000 },
      { date: '2026-08-18', priceMMK: 45000 }
    ]
  },
  {
    id: 'ing-t2-08',
    name: 'Indian Ocean Mackerel Fillet (Nga-Thalauk)',
    burmeseName: 'ငါးမက်ကရယ် / ငါးသလောက်ဥ',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 40000,
    unit: 'viss',
    pricePerGramMMK: 24.5,
    marketSource: 'San Pya Fish Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 38000 },
      { date: '2026-08-18', priceMMK: 40000 }
    ]
  },
  {
    id: 'ing-t2-09',
    name: 'Free-Range Quail Eggs',
    burmeseName: 'ငုံးဥလတ်လတ်ဆတ်ဆတ်',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 5000,
    unit: '20 pcs',
    pricePerGramMMK: 25.0,
    marketSource: 'City Mart Supermarket',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 4500 },
      { date: '2026-08-18', priceMMK: 5000 }
    ]
  },
  {
    id: 'ing-t2-10',
    name: 'Organic Edamame Beans (Mukimame)',
    burmeseName: 'အော်ဂဲနစ် ပဲပိစပ်စိမ်း',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 12000,
    unit: '500g pack',
    pricePerGramMMK: 24.0,
    marketSource: 'Marketplace Golden Valley',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 11000 },
      { date: '2026-08-18', priceMMK: 12000 }
    ]
  },
  {
    id: 'ing-t2-11',
    name: 'Artisan Tempeh Slices',
    burmeseName: 'တန်ပေ (အချဉ်ဖောက်ပဲ)',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 14000,
    unit: '400g pack',
    pricePerGramMMK: 35.0,
    marketSource: 'Organic Farmers Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 13000 },
      { date: '2026-08-18', priceMMK: 14000 }
    ]
  },

  // TIER 2 CARBS
  {
    id: 'ing-t2-12',
    name: 'Organic Shan Highland Brown Rice',
    burmeseName: 'ရှမ်းတောင်ပေါ် ဆန်လုံးညို',
    tier: 2,
    category: 'carb',
    currentPriceMMK: 18000,
    unit: 'pyi (2.1 kg)',
    pricePerGramMMK: 8.5,
    marketSource: 'Organic Farmers Market & Bayintnaung',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 16500 },
      { date: '2026-08-18', priceMMK: 18000 }
    ]
  },
  {
    id: 'ing-t2-13',
    name: 'Highland Purple Sweet Potato',
    burmeseName: 'တောင်ကြီး ကန်စွန်းဥခရမ်းရောင်',
    tier: 2,
    category: 'carb',
    currentPriceMMK: 8500,
    unit: 'viss',
    pricePerGramMMK: 5.2,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 7500 },
      { date: '2026-08-18', priceMMK: 8500 }
    ]
  },
  {
    id: 'ing-t2-14',
    name: 'Steamed Pearl Barley Grains',
    burmeseName: 'မုယောစပါးစေ့',
    tier: 2,
    category: 'carb',
    currentPriceMMK: 12000,
    unit: '1 kg pack',
    pricePerGramMMK: 12.0,
    marketSource: 'Marketplace by City Mart',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 11000 },
      { date: '2026-08-18', priceMMK: 12000 }
    ]
  },
  {
    id: 'ing-t2-15',
    name: 'Red Mountain Rice (Taung-Paw-San-Ni)',
    burmeseName: 'တောင်ပေါ်ဆန်နီ သဘာဝ',
    tier: 2,
    category: 'carb',
    currentPriceMMK: 16000,
    unit: 'pyi',
    pricePerGramMMK: 7.6,
    marketSource: 'Bayintnaung Wholesale Center',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 15000 },
      { date: '2026-08-18', priceMMK: 16000 }
    ]
  },
  {
    id: 'ing-t2-16',
    name: 'Shan Sticky Black Rice',
    burmeseName: 'ရှမ်းကောက်ညှင်းနက်',
    tier: 2,
    category: 'carb',
    currentPriceMMK: 17500,
    unit: 'pyi',
    pricePerGramMMK: 8.3,
    marketSource: 'Bayintnaung Wholesale Center',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 16000 },
      { date: '2026-08-18', priceMMK: 17500 }
    ]
  },
  {
    id: 'ing-t2-17',
    name: 'Sweet Corn Kernels (Pyi-Phaung)',
    burmeseName: 'ပြောင်းဖူးစေ့ချိုချို',
    tier: 2,
    category: 'carb',
    currentPriceMMK: 5500,
    unit: 'viss',
    pricePerGramMMK: 3.4,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 5000 },
      { date: '2026-08-18', priceMMK: 5500 }
    ]
  },

  // TIER 2 VEGETABLES
  {
    id: 'ing-t2-18',
    name: 'Highland Fresh Steamed Broccoli Crowns',
    burmeseName: 'ရှမ်းပြည်နယ်ထွက် ပန်းဂေါ်ဖီစိမ်း (ဘရိုကိုလီ)',
    tier: 2,
    category: 'vegetable',
    currentPriceMMK: 12000,
    unit: 'viss',
    pricePerGramMMK: 7.3,
    marketSource: 'Thiri Mingalar Cold Chain',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 11000 },
      { date: '2026-08-18', priceMMK: 12000 }
    ]
  },
  {
    id: 'ing-t2-19',
    name: 'Fresh King Oyster & Shiitake Mushrooms',
    burmeseName: 'ဘုရင်မှို (King Oyster) နှင့် ရှီတာကီမှို',
    tier: 2,
    category: 'vegetable',
    currentPriceMMK: 14000,
    unit: '500g pack',
    pricePerGramMMK: 28.0,
    marketSource: 'City Mart & Marketplace',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 13000 },
      { date: '2026-08-18', priceMMK: 14000 }
    ]
  },
  {
    id: 'ing-t2-20',
    name: 'Crisp Baby Bok Choy / Chinese Kale',
    burmeseName: 'ဘေဘီ မုန်ညင်းဖြူ / ကိုက်လန်ရွက်စိမ်း',
    tier: 2,
    category: 'vegetable',
    currentPriceMMK: 9500,
    unit: 'viss',
    pricePerGramMMK: 5.8,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 8500 },
      { date: '2026-08-18', priceMMK: 9500 }
    ]
  },
  {
    id: 'ing-t2-21',
    name: 'Steamed Sweet Pumpkin (Shwe-Pha-Yone)',
    burmeseName: 'ရွှေဖရုံသီးချိုချို',
    tier: 2,
    category: 'vegetable',
    currentPriceMMK: 4500,
    unit: 'viss',
    pricePerGramMMK: 2.7,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 4000 },
      { date: '2026-08-18', priceMMK: 4500 }
    ]
  },
  {
    id: 'ing-t2-22',
    name: 'Sweet Bell Peppers (Red, Yellow & Green)',
    burmeseName: 'ငရုတ်ပွချို (သုံးရောင်စပ်)',
    tier: 2,
    category: 'vegetable',
    currentPriceMMK: 11000,
    unit: 'viss',
    pricePerGramMMK: 6.7,
    marketSource: 'Thiri Mingalar Cold Chain',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 10000 },
      { date: '2026-08-18', priceMMK: 11000 }
    ]
  },
  {
    id: 'ing-t2-23',
    name: 'Fresh Snow Peas / Sugar Snap Peas',
    burmeseName: 'ပဲသီးချိုချိုနုနု',
    tier: 2,
    category: 'vegetable',
    currentPriceMMK: 10500,
    unit: 'viss',
    pricePerGramMMK: 6.4,
    marketSource: 'Insein Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 9500 },
      { date: '2026-08-18', priceMMK: 10500 }
    ]
  },
  {
    id: 'ing-t2-24',
    name: 'Fresh Enoki & Shimeji Mushrooms',
    burmeseName: 'အပ်မှို နှင့် ရှီမဲဂျီမှို',
    tier: 2,
    category: 'vegetable',
    currentPriceMMK: 8500,
    unit: '300g pack',
    pricePerGramMMK: 28.3,
    marketSource: 'City Mart Supermarket',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 7500 },
      { date: '2026-08-18', priceMMK: 8500 }
    ]
  },
  {
    id: 'ing-t2-25',
    name: 'Highland Cauliflower Florets',
    burmeseName: 'ရှမ်းပြည်နယ်ထွက် ပန်းဂေါ်ဖီဖြူ',
    tier: 2,
    category: 'vegetable',
    currentPriceMMK: 8000,
    unit: 'viss',
    pricePerGramMMK: 4.9,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 7000 },
      { date: '2026-08-18', priceMMK: 8000 }
    ]
  },

  // =========================================================================
  // TIER 3: GOURMET & LUXURY SUPERFOODS (Strictly Premium Package Exclusive)
  // =========================================================================
  {
    id: 'ing-t3-01',
    name: 'Air-Flown Norwegian Fresh Salmon Fillet',
    burmeseName: 'နော်ဝေ ဆယ်လ်မွန်ငါး အအေးခန်းလေကြောင်းပို့',
    tier: 3,
    category: 'protein',
    currentPriceMMK: 85000,
    unit: '500g fillet',
    pricePerGramMMK: 170.0,
    marketSource: 'Marketplace by City Mart / Cold Storage Import',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 80000 },
      { date: '2026-08-10', priceMMK: 82000 },
      { date: '2026-08-18', priceMMK: 85000 }
    ]
  },
  {
    id: 'ing-t3-02',
    name: 'Australian Wagyu Striploin / Sirloin (MB 5+)',
    burmeseName: 'သြစတြေးလျ ဝါဂျူး အမဲသား (MB 5+)',
    tier: 3,
    category: 'protein',
    currentPriceMMK: 95000,
    unit: '300g pack',
    pricePerGramMMK: 316.6,
    marketSource: 'Premium Butchery Yangon (Golden Valley)',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 90000 },
      { date: '2026-08-18', priceMMK: 95000 }
    ]
  },
  {
    id: 'ing-t3-03',
    name: 'Wild Andaman Giant Tiger Prawns (Kya-Pazun)',
    burmeseName: 'ပင်လယ်ကျားပုစွန်ကြီး',
    tier: 3,
    category: 'protein',
    currentPriceMMK: 75000,
    unit: 'viss (1.63 kg)',
    pricePerGramMMK: 46.0,
    marketSource: 'San Pya Cold Chain / Myeik Seafood Export',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 70000 },
      { date: '2026-08-18', priceMMK: 75000 }
    ]
  },
  {
    id: 'ing-t3-04',
    name: 'Jumbo Ayeyarwady Giant River Prawns (Myit-Pazun)',
    burmeseName: 'ဧရာဝတီ မြစ်ပုစွန်တုပ်ကြီး',
    tier: 3,
    category: 'protein',
    currentPriceMMK: 82000,
    unit: 'viss',
    pricePerGramMMK: 50.3,
    marketSource: 'San Pya Fish Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 78000 },
      { date: '2026-08-18', priceMMK: 82000 }
    ]
  },
  {
    id: 'ing-t3-05',
    name: 'Japanese Hokkaido Sea Scallops (Hotate)',
    burmeseName: 'ဂျပန် ဟော့ကိုင်းဒိုး ကမာခရုလွှာ',
    tier: 3,
    category: 'protein',
    currentPriceMMK: 98000,
    unit: '500g box',
    pricePerGramMMK: 196.0,
    marketSource: 'Marketplace Golden Valley',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 92000 },
      { date: '2026-08-18', priceMMK: 98000 }
    ]
  },
  {
    id: 'ing-t3-06',
    name: 'Yellowfin Tuna Sashimi Grade Loin',
    burmeseName: 'ဆာရှိမိ အဆင့် တူနာငါး',
    tier: 3,
    category: 'protein',
    currentPriceMMK: 78000,
    unit: '500g loin',
    pricePerGramMMK: 156.0,
    marketSource: 'Cold Storage Seafood Yangon',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 74000 },
      { date: '2026-08-18', priceMMK: 78000 }
    ]
  },
  {
    id: 'ing-t3-07',
    name: 'Rock Lobster Tails (Andaman Wild Catch)',
    burmeseName: 'ပင်လယ် ပုစွန်ကျောက်အမြီး',
    tier: 3,
    category: 'protein',
    currentPriceMMK: 92000,
    unit: '500g pack',
    pricePerGramMMK: 184.0,
    marketSource: 'Myeik Seafood Direct / Cold Storage',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 88000 },
      { date: '2026-08-18', priceMMK: 92000 }
    ]
  },
  {
    id: 'ing-t3-08',
    name: 'Fresh Mud Crab Meat (Gant-Glar)',
    burmeseName: 'ဂဏန်းမ အသားစစ်စစ်',
    tier: 3,
    category: 'protein',
    currentPriceMMK: 65000,
    unit: '500g meat',
    pricePerGramMMK: 130.0,
    marketSource: 'San Pya Fish Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 60000 },
      { date: '2026-08-18', priceMMK: 65000 }
    ]
  },
  {
    id: 'ing-t3-09',
    name: 'New Zealand Tender Lamb Chops',
    burmeseName: 'နယူးဇီလန် သိုးသားနံရိုးလွှာ',
    tier: 3,
    category: 'protein',
    currentPriceMMK: 88000,
    unit: '500g pack',
    pricePerGramMMK: 176.0,
    marketSource: 'Premium Butchery Yangon',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 84000 },
      { date: '2026-08-18', priceMMK: 88000 }
    ]
  },
  {
    id: 'ing-t3-10',
    name: 'Australian Grain-Fed Beef Tenderloin',
    burmeseName: 'သြစတြေးလျ အမဲတင်သားလွှာ',
    tier: 3,
    category: 'protein',
    currentPriceMMK: 82000,
    unit: '500g cut',
    pricePerGramMMK: 164.0,
    marketSource: 'City Mart Marketplace',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 78000 },
      { date: '2026-08-18', priceMMK: 82000 }
    ]
  },

  // TIER 3 CARBS
  {
    id: 'ing-t3-11',
    name: 'Organic Royal Tri-Color Quinoa',
    burmeseName: 'သုံးရောင်စပ် သဘာဝကွီနိုစေ့',
    tier: 3,
    category: 'carb',
    currentPriceMMK: 45000,
    unit: '1 kg pack',
    pricePerGramMMK: 45.0,
    marketSource: 'Marketplace by City Mart (Imported)',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 42000 },
      { date: '2026-08-18', priceMMK: 45000 }
    ]
  },
  {
    id: 'ing-t3-12',
    name: 'Japanese Organic 100% Buckwheat Soba (Juwari)',
    burmeseName: 'ဂျပန် ဂျူးဝါရီ ဆိုဘာခေါက်ဆွဲ',
    tier: 3,
    category: 'carb',
    currentPriceMMK: 36000,
    unit: '800g pack',
    pricePerGramMMK: 45.0,
    marketSource: 'Marketplace 6.5 Miles',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 33000 },
      { date: '2026-08-18', priceMMK: 36000 }
    ]
  },
  {
    id: 'ing-t3-13',
    name: 'Forbidden Black Rice (Organic Anthocyanin)',
    burmeseName: 'အာဟာရပြည့် သဘာဝဆန်နက်စစ်စစ်',
    tier: 3,
    category: 'carb',
    currentPriceMMK: 28000,
    unit: '1 kg pack',
    pricePerGramMMK: 28.0,
    marketSource: 'Organic Farmers Market Yangon',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 26000 },
      { date: '2026-08-18', priceMMK: 28000 }
    ]
  },
  {
    id: 'ing-t3-14',
    name: 'Organic Wild Rice (North American Catchment)',
    burmeseName: 'သဘာဝ တောဆန်ရိုင်းစစ်စစ်',
    tier: 3,
    category: 'carb',
    currentPriceMMK: 42000,
    unit: '500g pack',
    pricePerGramMMK: 84.0,
    marketSource: 'Marketplace Golden Valley',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 39000 },
      { date: '2026-08-18', priceMMK: 42000 }
    ]
  },
  {
    id: 'ing-t3-15',
    name: 'Organic Whole Grain Couscous',
    burmeseName: 'ကူးစ်ကူးစ် အစေ့အဆန်',
    tier: 3,
    category: 'carb',
    currentPriceMMK: 24000,
    unit: '1 kg box',
    pricePerGramMMK: 24.0,
    marketSource: 'Marketplace by City Mart',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 22000 },
      { date: '2026-08-18', priceMMK: 24000 }
    ]
  },

  // TIER 3 VEGETABLES & GREENS
  {
    id: 'ing-t3-16',
    name: 'Fresh Hass Avocado (Air-Flown Import)',
    burmeseName: 'ဟက်စ် အာဗိုကာဒိုသီး (လေကြောင်းပို့)',
    tier: 3,
    category: 'vegetable',
    currentPriceMMK: 28000,
    unit: 'kg (approx 4-5 pcs)',
    pricePerGramMMK: 28.0,
    marketSource: 'City Mart & Marketplace (Import)',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 26000 },
      { date: '2026-08-18', priceMMK: 28000 }
    ]
  },
  {
    id: 'ing-t3-17',
    name: 'Tender Baby Green Asparagus Spears',
    burmeseName: 'နုနယ်သော ကညွတ်စိမ်း',
    tier: 3,
    category: 'vegetable',
    currentPriceMMK: 26000,
    unit: '500g bunch',
    pricePerGramMMK: 52.0,
    marketSource: 'Shan Highlands & Marketplace',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 24000 },
      { date: '2026-08-18', priceMMK: 26000 }
    ]
  },
  {
    id: 'ing-t3-18',
    name: 'Organic Shan Curly Kale',
    burmeseName: 'ရှမ်းတောင်ပေါ် သဘာဝကေးလ်ရွက်',
    tier: 3,
    category: 'vegetable',
    currentPriceMMK: 18000,
    unit: '500g pack',
    pricePerGramMMK: 36.0,
    marketSource: 'Organic Farmers Market Yangon',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 16000 },
      { date: '2026-08-18', priceMMK: 18000 }
    ]
  },
  {
    id: 'ing-t3-19',
    name: 'Tender Baby Spinach Leaves',
    burmeseName: 'ဘေဘီ ဟင်းနုနွယ်ရွက်နုနု',
    tier: 3,
    category: 'vegetable',
    currentPriceMMK: 16000,
    unit: '500g pack',
    pricePerGramMMK: 32.0,
    marketSource: 'Marketplace Golden Valley',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 14500 },
      { date: '2026-08-18', priceMMK: 16000 }
    ]
  },
  {
    id: 'ing-t3-20',
    name: 'Fresh Portobello Mushrooms',
    burmeseName: 'ပေါ်တိုဘယ်လိုမှိုကြီး',
    tier: 3,
    category: 'vegetable',
    currentPriceMMK: 22000,
    unit: '400g pack',
    pricePerGramMMK: 55.0,
    marketSource: 'Marketplace 6.5 Miles',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 20000 },
      { date: '2026-08-18', priceMMK: 22000 }
    ]
  },
  {
    id: 'ing-t3-21',
    name: 'Crisp Hydroponic Butterhead Lettuce',
    burmeseName: 'ရေပေါ်စိုက် ဘတာဟတ်ဆလပ်ရွက်',
    tier: 3,
    category: 'vegetable',
    currentPriceMMK: 12000,
    unit: '500g pack',
    pricePerGramMMK: 24.0,
    marketSource: 'Organic Farmers Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 11000 },
      { date: '2026-08-18', priceMMK: 12000 }
    ]
  },
  {
    id: 'ing-t3-22',
    name: 'Fresh Rocket Arugula Leaves',
    burmeseName: 'အရူဂူလာ ဆလပ်ရွက်စိမ်း',
    tier: 3,
    category: 'vegetable',
    currentPriceMMK: 15000,
    unit: '300g pack',
    pricePerGramMMK: 50.0,
    marketSource: 'Marketplace by City Mart',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 13500 },
      { date: '2026-08-18', priceMMK: 15000 }
    ]
  },

  // =========================================================================
  // HEALTHY OILS, NUTS, SEEDS & ARTISAN SEASONINGS (For Precise Macronutrient Tuning)
  // =========================================================================
  {
    id: 'ing-fat-01',
    name: 'Cold-Pressed Extra Virgin Olive Oil',
    burmeseName: 'သံလွင်ဆီသန့်',
    tier: 3,
    category: 'protein', // classified under seasonings/oils
    currentPriceMMK: 38000,
    unit: '1 Litre bottle',
    pricePerGramMMK: 38.0,
    marketSource: 'Marketplace Golden Valley',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 35000 },
      { date: '2026-08-18', priceMMK: 38000 }
    ]
  },
  {
    id: 'ing-fat-02',
    name: 'Pure Roasted Sesame Oil (Hnan-Si)',
    burmeseName: 'နှမ်းဆီမွှေးစစ်စစ်',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 24000,
    unit: '1 Litre bottle',
    pricePerGramMMK: 24.0,
    marketSource: 'Bayintnaung Wholesale Center',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 22000 },
      { date: '2026-08-18', priceMMK: 24000 }
    ]
  },
  {
    id: 'ing-fat-03',
    name: 'Organic Virgin Coconut Oil',
    burmeseName: 'အုန်းဆီသန့်စစ်စစ်',
    tier: 2,
    category: 'protein',
    currentPriceMMK: 26000,
    unit: '750ml bottle',
    pricePerGramMMK: 34.6,
    marketSource: 'Organic Farmers Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 24000 },
      { date: '2026-08-18', priceMMK: 26000 }
    ]
  },
  {
    id: 'ing-fat-04',
    name: 'Roasted Crushed Peanuts (Myay-Pe)',
    burmeseName: 'မြေပဲဆံလှော်ထောင်း',
    tier: 1,
    category: 'protein',
    currentPriceMMK: 12000,
    unit: 'viss',
    pricePerGramMMK: 7.3,
    marketSource: 'Bayintnaung Wholesale Center',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 11000 },
      { date: '2026-08-18', priceMMK: 12000 }
    ]
  },
  {
    id: 'ing-fat-05',
    name: 'Roasted Cashew Nuts (Thiri-Hto)',
    burmeseName: 'သီဟိုဠ်စေ့လှော်',
    tier: 3,
    category: 'protein',
    currentPriceMMK: 38000,
    unit: '500g pack',
    pricePerGramMMK: 76.0,
    marketSource: 'City Mart Marketplace',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 35000 },
      { date: '2026-08-18', priceMMK: 38000 }
    ]
  },
  {
    id: 'ing-fat-06',
    name: 'Organic Chia Seeds & Flaxseeds',
    burmeseName: 'ချီယာစေ့ နှင့် နှမ်းကြတ်စေ့',
    tier: 3,
    category: 'protein',
    currentPriceMMK: 28000,
    unit: '500g pack',
    pricePerGramMMK: 56.0,
    marketSource: 'Marketplace Golden Valley',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 26000 },
      { date: '2026-08-18', priceMMK: 28000 }
    ]
  },
  {
    id: 'ing-fat-07',
    name: 'Fresh Crushed Garlic & Ginger Paste',
    burmeseName: 'ကြက်သွန်ဖြူ ဂျင်းထောင်း',
    tier: 1,
    category: 'vegetable',
    currentPriceMMK: 8000,
    unit: 'viss',
    pricePerGramMMK: 4.9,
    marketSource: 'Thiri Mingalar Market',
    lastUpdated: '2026-08-18',
    priceHistory: [
      { date: '2026-08-01', priceMMK: 7500 },
      { date: '2026-08-18', priceMMK: 8000 }
    ]
  }
];

export const YGN_INGREDIENT_PRICES: IngredientPrice[] = generateIngredients(BASE_YGN_INGREDIENT_PRICES, 300);
