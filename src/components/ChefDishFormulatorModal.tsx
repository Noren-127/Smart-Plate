import React, { useState, useMemo } from 'react';
import { Dish, DishTier, MealType, IngredientPrice } from '../types';
import { YGN_INGREDIENT_PRICES } from '../data/ingredients';
import { addCustomDish } from '../store/storage';
import { ChefHat, Plus, Trash2, X, Check, Search, Scale, Sparkles, AlertCircle, Info, Layers, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RecipeIngredientRow {
  ingredientId: string;
  name: string;
  burmeseName?: string;
  category: 'protein' | 'carb' | 'vegetable' | 'seasoning_oil';
  tier: DishTier;
  pricePerGramMMK: number;
  grams: number;
  proteinPer100g: number;
  carbPer100g: number;
  fatPer100g: number;
}

// Comprehensive nutritional estimates per 100g for diverse Myanmar & international ingredients
function getIngredientNutrition(name: string, cat: string, tier: DishTier) {
  const n = name.toLowerCase();
  // Seafood
  if (n.includes('salmon')) return { p: 20, c: 0, f: 13 };
  if (n.includes('tuna')) return { p: 28, c: 0, f: 1 };
  if (n.includes('seabass') || n.includes('barramundi') || n.includes('ka-ka-dit')) return { p: 22, c: 0.5, f: 2.5 };
  if (n.includes('pomfret') || n.includes('butterfish')) return { p: 19, c: 0, f: 4.5 };
  if (n.includes('snapper')) return { p: 22, c: 0, f: 1.5 };
  if (n.includes('mackerel') || n.includes('thalauk')) return { p: 20, c: 0, f: 10 };
  if (n.includes('tilapia') || n.includes('rohu') || n.includes('myit-chin') || n.includes('catfish')) return { p: 19, c: 0, f: 2.5 };
  if (n.includes('scallop')) return { p: 17, c: 3, f: 0.8 };
  if (n.includes('prawn') || n.includes('shrimp')) return { p: 24, c: 0.5, f: 1 };
  if (n.includes('lobster')) return { p: 21, c: 1, f: 0.9 };
  if (n.includes('crab')) return { p: 19, c: 0, f: 1.2 };
  if (n.includes('squid') || n.includes('calamari')) return { p: 18, c: 3, f: 1.4 };

  // Poultry & Meats
  if (n.includes('wagyu')) return { p: 22, c: 0, f: 22 };
  if (n.includes('beef') || n.includes('sirloin') || n.includes('tenderloin') || n.includes('ribeye')) return { p: 26, c: 0, f: tier === 3 ? 12 : 7 };
  if (n.includes('lamb')) return { p: 25, c: 0, f: 16 };
  if (n.includes('duck')) return { p: 24, c: 0, f: 6 };
  if (n.includes('chicken breast') || n.includes('chicken')) return { p: 31, c: 0, f: 3.5 };
  if (n.includes('pork tenderloin') || n.includes('pork')) return { p: 26, c: 0, f: 5 };

  // Plant Proteins & Dairy/Eggs
  if (n.includes('quail egg')) return { p: 13, c: 0.5, f: 11 };
  if (n.includes('egg')) return { p: 13, c: 1, f: 10 };
  if (n.includes('tofu') || n.includes('to-hpu')) return { p: 14, c: 6, f: 5 };
  if (n.includes('tempeh')) return { p: 19, c: 9, f: 11 };
  if (n.includes('edamame')) return { p: 11, c: 10, f: 5 };
  if (n.includes('pea') || n.includes('dal') || n.includes('bean') || n.includes('pe-byouk')) return { p: 9, c: 20, f: 1.2 };

  // Carbs & Grains
  if (n.includes('quinoa')) return { p: 4.4, c: 21.3, f: 1.9 };
  if (n.includes('soba') || n.includes('buckwheat')) return { p: 5.1, c: 21.4, f: 0.1 };
  if (n.includes('black rice') || n.includes('wild rice')) return { p: 3.5, c: 24, f: 0.8 };
  if (n.includes('brown rice') || n.includes('red rice') || n.includes('mountain rice')) return { p: 2.7, c: 28, f: 0.4 };
  if (n.includes('rice noodle') || n.includes('mote-htin')) return { p: 2, c: 26, f: 0.2 };
  if (n.includes('rice')) return { p: 2.7, c: 28, f: 0.3 };
  if (n.includes('sweet potato')) return { p: 1.6, c: 20, f: 0.1 };
  if (n.includes('potato') || n.includes('cassava')) return { p: 2, c: 18, f: 0.1 };
  if (n.includes('oat')) return { p: 13, c: 68, f: 7 };
  if (n.includes('barley') || n.includes('couscous')) return { p: 3.5, c: 28, f: 0.5 };
  if (n.includes('corn')) return { p: 3.3, c: 19, f: 1.4 };

  // Vegetables, Greens & Fungi
  if (n.includes('avocado')) return { p: 2, c: 9, f: 15 };
  if (n.includes('broccoli') || n.includes('cauliflower')) return { p: 2.8, c: 7, f: 0.4 };
  if (n.includes('asparagus')) return { p: 2.2, c: 3.9, f: 0.2 };
  if (n.includes('kale') || n.includes('spinach') || n.includes('arugula') || n.includes('lettuce')) return { p: 2.9, c: 4, f: 0.4 };
  if (n.includes('glory') || n.includes('gazun') || n.includes('cabbage') || n.includes('greens') || n.includes('bok choy') || n.includes('watercress') || n.includes('roselle')) return { p: 2.5, c: 4, f: 0.3 };
  if (n.includes('mushroom') || n.includes('shiitake') || n.includes('enoki') || n.includes('portobello')) return { p: 3.1, c: 3.3, f: 0.3 };
  if (n.includes('tomato') || n.includes('carrot') || n.includes('pumpkin') || n.includes('pepper') || n.includes('squid') || n.includes('bamboo') || n.includes('eggplant') || n.includes('okra')) return { p: 1.5, c: 6, f: 0.2 };

  // Fats, Oils, Nuts & Seeds
  if (n.includes('oil') || n.includes('ghee')) return { p: 0, c: 0, f: 100 };
  if (n.includes('peanut') || n.includes('cashew') || n.includes('walnut')) return { p: 18, c: 16, f: 49 };
  if (n.includes('chia') || n.includes('flax') || n.includes('sesame')) return { p: 17, c: 28, f: 38 };
  if (n.includes('garlic') || n.includes('ginger')) return { p: 6, c: 33, f: 0.5 };

  if (cat === 'protein') return { p: 22, c: 1, f: 4 };
  if (cat === 'carb') return { p: 3, c: 25, f: 0.5 };
  if (cat === 'vegetable') return { p: 2, c: 4, f: 0.3 };
  return { p: 2, c: 5, f: 1 };
}

interface ChefDishFormulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDishCreated?: (newDish: Dish) => void;
}

export const ChefDishFormulatorModal: React.FC<ChefDishFormulatorModalProps> = ({
  isOpen,
  onClose,
  onDishCreated
}) => {
  const [dishName, setDishName] = useState('');
  const [burmeseName, setBurmeseName] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [cookingStyle, setCookingStyle] = useState('Pan-Seared & Steamed');
  const [description, setDescription] = useState('');

  // Search & add ingredients
  const [ingSearch, setIngSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<'all' | 'protein' | 'carb' | 'vegetable'>('all');
  const [selectedTierFilter, setSelectedTierFilter] = useState<DishTier | 'all'>('all');

  // Selected recipe ingredients
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientRow[]>([
    {
      ingredientId: 'ing-t2-01',
      name: 'Inle Lake Seabass / Barramundi (Ka-Ka-Dit)',
      burmeseName: 'အင်းလေး ကကတစ်ငါးလွှာ',
      category: 'protein',
      tier: 2,
      pricePerGramMMK: 29.4,
      grams: 180,
      proteinPer100g: 22,
      carbPer100g: 0.5,
      fatPer100g: 2.5
    },
    {
      ingredientId: 'ing-t2-12',
      name: 'Organic Shan Highland Brown Rice',
      burmeseName: 'ရှမ်းတောင်ပေါ် ဆန်လုံးညို',
      category: 'carb',
      tier: 2,
      pricePerGramMMK: 8.5,
      grams: 90,
      proteinPer100g: 2.7,
      carbPer100g: 28,
      fatPer100g: 0.4
    },
    {
      ingredientId: 'ing-t2-18',
      name: 'Highland Fresh Steamed Broccoli Crowns',
      burmeseName: 'ရှမ်းပြည်နယ်ထွက် ပန်းဂေါ်ဖီစိမ်း (ဘရိုကိုလီ)',
      category: 'vegetable',
      tier: 2,
      pricePerGramMMK: 7.3,
      grams: 100,
      proteinPer100g: 2.8,
      carbPer100g: 7,
      fatPer100g: 0.4
    }
  ]);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // 1. Calculate Live Ingredient Cost MMK
  const totalIngredientCostMMK = useMemo(() => {
    const rawCost = recipeIngredients.reduce((sum, item) => sum + (item.grams * item.pricePerGramMMK), 0);
    // Add baseline 500 MMK cooking / seasonings / prep overhead
    return Math.round(rawCost + (recipeIngredients.length > 0 ? 500 : 0));
  }, [recipeIngredients]);

  // 2. Calculate Quality Tier based on Ingredient Quality & Quantity
  const calculatedTierInfo = useMemo(() => {
    if (recipeIngredients.length === 0) return { tier: 1 as DishTier, label: 'Tier 1: Basic Staples', badgeColor: '#15803d', badgeBg: '#dcfce7', reason: 'No ingredients selected' };

    const hasTier3 = recipeIngredients.some(item => item.tier === 3);
    const hasTier2 = recipeIngredients.some(item => item.tier === 2);
    const tier3Count = recipeIngredients.filter(item => item.tier === 3).length;

    // Quality determination logic
    if (hasTier3 || totalIngredientCostMMK >= 13500) {
      return {
        tier: 3 as DishTier,
        label: 'Tier 3: Gourmet Luxury',
        badgeColor: '#b45309',
        badgeBg: '#fef3c7',
        reason: hasTier3
          ? `Contains ${tier3Count} Tier-3 Gourmet ingredient(s) with luxury sourcing (Cost: ${totalIngredientCostMMK.toLocaleString()} MMK).`
          : `High-density premium ingredient formulation exceeding 13,500 MMK benchmark.`
      };
    } else if (hasTier2 || totalIngredientCostMMK >= 7500) {
      return {
        tier: 2 as DishTier,
        label: 'Tier 2: Standard Quality',
        badgeColor: '#1d4ed8',
        badgeBg: '#dbeafe',
        reason: `Features fresh regional Myanmar ingredients (Cost: ${totalIngredientCostMMK.toLocaleString()} MMK).`
      };
    } else {
      return {
        tier: 1 as DishTier,
        label: 'Tier 1: Basic Staples',
        badgeColor: '#15803d',
        badgeBg: '#dcfce7',
        reason: `Economical wet market ingredients (Cost: ${totalIngredientCostMMK.toLocaleString()} MMK).`
      };
    }
  }, [recipeIngredients, totalIngredientCostMMK]);

  // 3. Calculate Live Macronutrients
  const calculatedMacros = useMemo(() => {
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    recipeIngredients.forEach(item => {
      protein += (item.grams * item.proteinPer100g) / 100;
      carbs += (item.grams * item.carbPer100g) / 100;
      fat += (item.grams * item.fatPer100g) / 100;
    });

    const roundP = Math.round(protein);
    const roundC = Math.round(carbs);
    const roundF = Math.round(fat);
    const totalKcal = Math.round(roundP * 4 + roundC * 4 + roundF * 9);

    return {
      proteinG: roundP,
      carbG: roundC,
      fatG: roundF,
      calories: totalKcal
    };
  }, [recipeIngredients]);

  // Primary Components Auto-Detection
  const primaryComponents = useMemo(() => {
    const proteins = recipeIngredients.filter(i => i.category === 'protein').sort((a, b) => b.grams - a.grams);
    const carbs = recipeIngredients.filter(i => i.category === 'carb').sort((a, b) => b.grams - a.grams);
    const vegs = recipeIngredients.filter(i => i.category === 'vegetable').sort((a, b) => b.grams - a.grams);

    return {
      primaryProtein: proteins[0]?.name.split('(')[0].trim() || 'Chicken',
      primaryCarb: carbs[0]?.name.split('(')[0].trim() || 'Rice',
      primaryVeg: vegs[0]?.name.split('(')[0].trim() || 'Greens'
    };
  }, [recipeIngredients]);

  // Filter available ingredients for adding from the complete pool
  const availableIngredients = useMemo(() => {
    const q = ingSearch.toLowerCase().trim();
    return YGN_INGREDIENT_PRICES.filter(ing => {
      const matchCat = selectedCatFilter === 'all' || ing.category === selectedCatFilter;
      const matchTier = selectedTierFilter === 'all' || ing.tier === selectedTierFilter;
      const matchText = !q ||
        ing.name.toLowerCase().includes(q) ||
        (ing.burmeseName && ing.burmeseName.includes(q)) ||
        (ing.marketSource && ing.marketSource.toLowerCase().includes(q));
      return matchCat && matchTier && matchText;
    });
  }, [ingSearch, selectedCatFilter, selectedTierFilter]);

  const handleAddIngredient = (ing: IngredientPrice) => {
    if (recipeIngredients.some(item => item.ingredientId === ing.id)) {
      // Increase gram weight
      setRecipeIngredients(recipeIngredients.map(item =>
        item.ingredientId === ing.id ? { ...item, grams: item.grams + 50 } : item
      ));
      return;
    }

    const nut = getIngredientNutrition(ing.name, ing.category, ing.tier);
    const defaultGrams = ing.category === 'protein' ? 160 : ing.category === 'carb' ? 90 : ing.category === 'vegetable' ? 100 : 15;

    const newRow: RecipeIngredientRow = {
      ingredientId: ing.id,
      name: ing.name,
      burmeseName: ing.burmeseName,
      category: ing.category,
      tier: ing.tier,
      pricePerGramMMK: ing.pricePerGramMMK || (ing.currentPriceMMK / 500),
      grams: defaultGrams,
      proteinPer100g: nut.p,
      carbPer100g: nut.c,
      fatPer100g: nut.f
    };

    setRecipeIngredients([...recipeIngredients, newRow]);
  };

  const handleUpdateGrams = (id: string, newGrams: number) => {
    const val = Math.max(0, newGrams);
    setRecipeIngredients(recipeIngredients.map(item =>
      item.ingredientId === id ? { ...item, grams: val } : item
    ));
  };

  const handleRemoveIngredient = (id: string) => {
    setRecipeIngredients(recipeIngredients.filter(item => item.ingredientId !== id));
  };

  const handlePublishDish = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!dishName.trim()) {
      setFormError('Please enter the English dish name.');
      return;
    }

    if (recipeIngredients.length === 0) {
      setFormError('Please add at least 1 ingredient to formulate the dish.');
      return;
    }

    const hasProtein = recipeIngredients.some(i => i.category === 'protein' && i.grams > 0);
    if (!hasProtein) {
      setFormError('NutriChef precision dishes must contain at least one primary protein source.');
      return;
    }

    const ingStringList = recipeIngredients.map(i => `${i.name.split('(')[0].trim()} ${i.grams}g`);

    const newDish: Dish = {
      id: `custom-dish-${Date.now()}`,
      name: dishName.trim(),
      burmeseName: burmeseName.trim() || undefined,
      mealType,
      tier: calculatedTierInfo.tier,
      calories: calculatedMacros.calories,
      proteinG: calculatedMacros.proteinG,
      carbG: calculatedMacros.carbG,
      fatG: calculatedMacros.fatG,
      ingredientCostMMK: totalIngredientCostMMK,
      primaryProtein: primaryComponents.primaryProtein,
      primaryCarb: primaryComponents.primaryCarb,
      primaryVeg: primaryComponents.primaryVeg,
      cookingStyle,
      description: description.trim() || `Fresh ${cookingStyle.toLowerCase()} ${primaryComponents.primaryProtein.toLowerCase()} with ${primaryComponents.primaryVeg.toLowerCase()} and ${primaryComponents.primaryCarb.toLowerCase()}, formulated from quality ingredients.`,
      ingredients: ingStringList,
      tags: ['Chef Custom', calculatedTierInfo.label, 'Ingredient Calculated', 'High Protein']
    };

    // Save persistently to LocalStorage and MongoDB mirror
    addCustomDish(newDish);
    if (onDishCreated) onDishCreated(newDish);

    confetti({ particleCount: 50, spread: 60 });
    setFormSuccess(`Dish "${newDish.name}" successfully created with calculated ${calculatedTierInfo.label} (${totalIngredientCostMMK.toLocaleString()} MMK)!`);

    setTimeout(() => {
      onClose();
      setFormSuccess('');
    }, 1400);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1200,
      padding: '1.25rem',
      overflowY: 'auto'
    }}>
      <div className="card" style={{ maxWidth: '980px', width: '100%', maxHeight: '92vh', overflowY: 'auto', background: '#ffffff', border: '1px solid #cbd5e1', padding: '1.75rem', borderRadius: '18px', boxSizing: 'border-box' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: '#fef3c7', padding: '0.45rem', borderRadius: '8px', color: '#b45309' }}>
                <ChefHat size={22} />
              </div>
              <h2 style={{ fontSize: '1.35rem', margin: 0, color: '#0f172a' }}>Chef Recipe Formulation Studio</h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              Formulate chef recipes by selecting raw ingredients and precise gram weights. <strong>Price</strong> and <strong>Quality Tier</strong> are scientifically calculated from ingredient market quality and quantities.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}
          >
            &times;
          </button>
        </div>

        {formSuccess && (
          <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <Check size={18} />
            <span>{formSuccess}</span>
          </div>
        )}

        {formError && (
          <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <AlertCircle size={18} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handlePublishDish}>
          {/* Dish Basic Details */}
          <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Dish Name (English) *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Herb-Crusted Inle Seabass with Shan Brown Rice"
                value={dishName}
                onChange={e => setDishName(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Burmese Name (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. အင်းလေး ကကတစ်ငါးကင်နှင့် ရှမ်းဆန်လုံးညို"
                value={burmeseName}
                onChange={e => setBurmeseName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-3" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Meal Slot</label>
              <select
                className="form-select"
                value={mealType}
                onChange={e => setMealType(e.target.value as MealType)}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Cooking Technique</label>
              <select
                className="form-select"
                value={cookingStyle}
                onChange={e => setCookingStyle(e.target.value)}
              >
                <option value="Grilled">Grilled / Pan-Seared</option>
                <option value="Steamed">Herb-Steamed</option>
                <option value="Stir-fried">Wok Stir-fried (Light Oil)</option>
                <option value="Soup">Clear Herbal Broth / Soup</option>
                <option value="Slow Simmered">Slow-Simmered Light Curry</option>
                <option value="Raw/Salad">Fresh Tossed Salad / A Thoke</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Chef Notes / Description</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. High-protein lean cut seasoned with lemongrass"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* DYNAMIC METRIC SUMMARY CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            
            {/* 1. CALCULATED QUALITY TIER */}
            <div style={{ background: calculatedTierInfo.badgeBg, border: `1.5px solid ${calculatedTierInfo.badgeColor}`, borderRadius: '12px', padding: '0.9rem 1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: calculatedTierInfo.badgeColor, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={14} /> Calculated Quality Tier
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: calculatedTierInfo.badgeColor, marginTop: '0.25rem' }}>
                {calculatedTierInfo.label}
              </div>
              <p style={{ fontSize: '0.74rem', color: '#475569', margin: '4px 0 0 0', lineHeight: 1.3 }}>
                {calculatedTierInfo.reason}
              </p>
            </div>

            {/* 2. CALCULATED INGREDIENT COST MMK */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '0.9rem 1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Scale size={14} /> Calculated Cost (MMK)
              </span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                {totalIngredientCostMMK.toLocaleString()} MMK
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Σ(Ingredient weights × wholesale rate) + prep
              </span>
            </div>

            {/* 3. CALCULATED MACRONUTRIENTS & ENERGY */}
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '0.9rem 1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Flame size={14} /> Energy & Macros
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d', marginTop: '0.2rem' }}>
                {calculatedMacros.calories} kcal
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.76rem', fontWeight: 700, marginTop: '0.25rem' }}>
                <span style={{ color: '#dc2626' }}>{calculatedMacros.proteinG}g P</span>
                <span style={{ color: '#0284c7' }}>{calculatedMacros.carbG}g C</span>
                <span style={{ color: '#d97706' }}>{calculatedMacros.fatG}g F</span>
              </div>
            </div>
          </div>

          {/* INGREDIENT RECIPE BUILDER TABLE */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Layers size={16} color="#16a34a" />
                Recipe Formulation Components ({recipeIngredients.length} ingredients)
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Adjust weights (g) to recalculate cost, tier & macros dynamically
              </span>
            </div>

            {recipeIngredients.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                No ingredients added yet. Pick ingredients from the inventory catalog below.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #cbd5e1', color: '#64748b' }}>
                      <th style={{ padding: '0.5rem' }}>Ingredient</th>
                      <th style={{ padding: '0.5rem' }}>Category & Tier</th>
                      <th style={{ padding: '0.5rem', width: '110px' }}>Weight (g)</th>
                      <th style={{ padding: '0.5rem' }}>Unit Rate</th>
                      <th style={{ padding: '0.5rem' }}>Calculated Cost</th>
                      <th style={{ padding: '0.5rem' }}>Macro Contribution</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipeIngredients.map(item => {
                      const itemCost = Math.round(item.grams * item.pricePerGramMMK);
                      const itemP = ((item.grams * item.proteinPer100g) / 100).toFixed(1);
                      const itemC = ((item.grams * item.carbPer100g) / 100).toFixed(1);
                      const itemF = ((item.grams * item.fatPer100g) / 100).toFixed(1);

                      return (
                        <tr key={item.ingredientId} style={{ borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                          <td style={{ padding: '0.6rem 0.5rem' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                            {item.burmeseName && <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.burmeseName}</div>}
                          </td>
                          <td style={{ padding: '0.6rem 0.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                              <span style={{ background: '#e2e8f0', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, textTransform: 'capitalize' }}>
                                {item.category}
                              </span>
                              <span className={`tier-badge badge-tier${item.tier}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                                Tier {item.tier}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '0.6rem 0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <input
                                type="number"
                                min="1"
                                max="1000"
                                step="5"
                                className="form-input"
                                style={{ width: '70px', padding: '0.25rem 0.4rem', fontSize: '0.82rem', fontWeight: 700 }}
                                value={item.grams}
                                onChange={e => handleUpdateGrams(item.ingredientId, Number(e.target.value))}
                              />
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>g</span>
                            </div>
                          </td>
                          <td style={{ padding: '0.6rem 0.5rem', color: '#64748b' }}>
                            {item.pricePerGramMMK.toFixed(1)} MMK/g
                          </td>
                          <td style={{ padding: '0.6rem 0.5rem', fontWeight: 800, color: '#0f172a' }}>
                            {itemCost.toLocaleString()} MMK
                          </td>
                          <td style={{ padding: '0.6rem 0.5rem', fontSize: '0.75rem' }}>
                            <span style={{ color: '#dc2626' }}>{itemP}g P</span> • <span style={{ color: '#0284c7' }}>{itemC}g C</span> • <span style={{ color: '#d97706' }}>{itemF}g F</span>
                          </td>
                          <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredient(item.ingredientId)}
                              style={{ background: '#fee2e2', border: 'none', color: '#dc2626', padding: '0.3rem', borderRadius: '6px', cursor: 'pointer' }}
                              title="Remove ingredient"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* INVENTORY CATALOG PICKER */}
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                  Pick Ingredients from Yangon Live Index
                </span>
                <span style={{ fontSize: '0.75rem', color: '#16a34a', background: '#dcfce7', padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: 700 }}>
                  {availableIngredients.length} Available
                </span>
              </div>

              {/* Category & Tier Filter Chips */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {/* Category filter */}
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {(['all', 'protein', 'carb', 'vegetable'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCatFilter(cat)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: selectedCatFilter === cat ? '#16a34a' : '#f1f5f9',
                        color: selectedCatFilter === cat ? '#ffffff' : '#475569',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {cat === 'all' ? 'All Types' : cat === 'protein' ? 'Proteins' : cat === 'carb' ? 'Carbs' : 'Greens'}
                    </button>
                  ))}
                </div>

                {/* Tier filter */}
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {(['all', 1, 2, 3] as const).map(tier => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedTierFilter(tier)}
                      style={{
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: selectedTierFilter === tier ? (tier === 1 ? '#15803d' : tier === 2 ? '#1d4ed8' : tier === 3 ? '#b45309' : '#0f172a') : '#f1f5f9',
                        color: selectedTierFilter === tier ? '#ffffff' : '#475569',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {tier === 'all' ? 'All Tiers' : `Tier ${tier}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search salmon, seabass, quinoa, wagyu, eggs, broccoli, morning glory, duck, prawns..."
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '0.82rem' }}
                value={ingSearch}
                onChange={e => setIngSearch(e.target.value)}
              />
            </div>

            {/* Quick-Add Grid with Smooth Scrolling */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {availableIngredients.map(ing => {
                const isSelected = recipeIngredients.some(item => item.ingredientId === ing.id);
                const nut = getIngredientNutrition(ing.name, ing.category, ing.tier);
                return (
                  <div
                    key={ing.id}
                    onClick={() => handleAddIngredient(ing)}
                    style={{
                      background: isSelected ? '#f0fdf4' : '#f8fafc',
                      border: `1px solid ${isSelected ? '#86efac' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      padding: '0.55rem 0.7rem',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.79rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ing.name.split('(')[0]}
                      </div>
                      {ing.burmeseName && (
                        <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ing.burmeseName}
                        </div>
                      )}
                      <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', gap: '0.35rem', marginTop: '0.2rem', alignItems: 'center' }}>
                        <span className={`tier-badge badge-tier${ing.tier}`} style={{ fontSize: '0.65rem', padding: '0.05rem 0.25rem' }}>
                          T{ing.tier}
                        </span>
                        <span>{(ing.pricePerGramMMK || (ing.currentPriceMMK / 500)).toFixed(1)} MMK/g</span>
                        <span style={{ color: '#94a3b8' }}>• {nut.p}g P / 100g</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      style={{
                        background: isSelected ? '#16a34a' : '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: isSelected ? '#ffffff' : '#0f172a',
                        borderRadius: '6px',
                        padding: '0.25rem 0.45rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        flexShrink: 0
                      }}
                    >
                      <Plus size={12} />
                      {isSelected ? '+50g' : 'Add'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.4rem', fontSize: '0.92rem' }}
            >
              <Check size={17} />
              <span>Publish Formulated Dish to MongoDB</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
