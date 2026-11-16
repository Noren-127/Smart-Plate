import React, { useState, useMemo, useEffect } from 'react';
import { YGN_INGREDIENT_PRICES } from '../data/ingredients';
import { DishTier, MealType, Dish, UserProfile } from '../types';
import { getAllDishes, saveCustomDishes, loadCustomDishes } from '../store/storage';
import { Utensils, Search, DollarSign, Filter, Layers, MapPin, Tag, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Sparkles, Trash2, UtensilsCrossed } from 'lucide-react';
import { ChefDishFormulatorModal } from './ChefDishFormulatorModal';

interface DishesCatalogViewProps {
  userProfile?: UserProfile;
  initialTierFilter?: DishTier | 'all';
}

export const DishesCatalogView: React.FC<DishesCatalogViewProps> = ({ userProfile, initialTierFilter = 'all' }) => {
  const isChef = userProfile?.role === 'chef';
  const [selectedTab, setSelectedTab] = useState<'dishes' | 'ingredients'>('dishes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTier, setFilterTier] = useState<DishTier | 'all'>(initialTierFilter);
  const [filterMealType, setFilterMealType] = useState<MealType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | 'protein' | 'carb' | 'vegetable'>('all');

  useEffect(() => {
    if (initialTierFilter) {
      setFilterTier(initialTierFilter);
      setSelectedTab('dishes');
      setDishPage(1);
    }
  }, [initialTierFilter]);
  
  // Pagination State
  const [dishPage, setDishPage] = useState<number>(1);
  const [ingPage, setIngPage] = useState<number>(1);
  const pageSize = 15;

  // Dishes state loaded from storage (base + custom)
  const [allDishes, setAllDishes] = useState<Dish[]>(() => getAllDishes());
  const [showAddDish, setShowAddDish] = useState(false);

  const handleDeleteCustomDish = (dishId: string) => {
    if (window.confirm('Delete this custom chef dish?')) {
      const custom = loadCustomDishes().filter(d => d.id !== dishId);
      saveCustomDishes(custom);
      setAllDishes(getAllDishes());
    }
  };

  const filteredDishes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allDishes.filter(dish => {
      const matchesSearch = !q || dish.name.toLowerCase().includes(q) ||
        (dish.burmeseName && dish.burmeseName.includes(q)) ||
        dish.primaryProtein.toLowerCase().includes(q) ||
        dish.cookingStyle.toLowerCase().includes(q);
      const matchesTier = filterTier === 'all' || dish.tier === filterTier;
      const matchesType = filterMealType === 'all' || dish.mealType === filterMealType;
      return matchesSearch && matchesTier && matchesType;
    });
  }, [allDishes, searchQuery, filterTier, filterMealType]);

  const filteredIngredients = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return YGN_INGREDIENT_PRICES.filter(ing => {
      const matchesSearch = !q || ing.name.toLowerCase().includes(q) ||
        (ing.burmeseName && ing.burmeseName.includes(q)) ||
        ing.marketSource.toLowerCase().includes(q);
      const matchesTier = filterTier === 'all' || ing.tier === filterTier;
      const matchesCat = filterCategory === 'all' || ing.category === filterCategory;
      return matchesSearch && matchesTier && matchesCat;
    });
  }, [searchQuery, filterTier, filterCategory]);

  const totalDishPages = Math.ceil(filteredDishes.length / pageSize) || 1;
  const paginatedDishes = useMemo(() => {
    const start = (dishPage - 1) * pageSize;
    return filteredDishes.slice(start, start + pageSize);
  }, [filteredDishes, dishPage, pageSize]);

  const totalIngPages = Math.ceil(filteredIngredients.length / pageSize) || 1;
  const paginatedIngredients = useMemo(() => {
    const start = (ingPage - 1) * pageSize;
    return filteredIngredients.slice(start, start + pageSize);
  }, [filteredIngredients, ingPage, pageSize]);

  return (
    <div className="dishes-catalog-view">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Yangon Dishes Database & Live Market Prices</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Enterprise repository with {allDishes.length.toLocaleString()} dishes and {YGN_INGREDIENT_PRICES.length} wholesale market ingredients across Myanmar quality tiers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: '#e2e8f0', padding: '0.25rem', borderRadius: '8px' }}>
          <button
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: selectedTab === 'dishes' ? '#ffffff' : 'transparent',
              color: selectedTab === 'dishes' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              setSelectedTab('dishes');
              setSearchQuery('');
              setDishPage(1);
            }}
          >
            Dishes Database ({allDishes.length.toLocaleString()})
          </button>
          <button
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: selectedTab === 'ingredients' ? '#ffffff' : 'transparent',
              color: selectedTab === 'ingredients' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
            onClick={() => {
              setSelectedTab('ingredients');
              setSearchQuery('');
              setIngPage(1);
            }}
          >
            Ingredient Price Index ({YGN_INGREDIENT_PRICES.length})
          </button>
        </div>
      </div>

      {/* DISHES TAB */}
      {selectedTab === 'dishes' ? (
        <>
          {/* Filters Bar */}
          <div className="card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search dishes by name, Burmese, protein, style..."
                  className="form-input"
                  style={{ paddingLeft: '36px', fontSize: '0.88rem' }}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setDishPage(1);
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                  value={filterMealType}
                  onChange={(e) => {
                    setFilterMealType(e.target.value as any);
                    setDishPage(1);
                  }}
                >
                  <option value="all">All Meal Slots</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>

                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                  value={filterTier}
                  onChange={(e) => {
                    setFilterTier(e.target.value === 'all' ? 'all' : Number(e.target.value) as DishTier);
                    setDishPage(1);
                  }}
                >
                  <option value="all">All Quality Tiers</option>
                  <option value="1">Tier 1: Basic Staples (4.5k–5.5k MMK)</option>
                  <option value="2">Tier 2: Standard Quality (9k–11.5k MMK)</option>
                  <option value="3">Tier 3: Gourmet Luxury (15.5k–18.5k MMK)</option>
                </select>

                {/* Chef-Only Dish Creation Action */}
                {isChef && (
                  <button
                    className="btn-gold"
                    style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    onClick={() => setShowAddDish(true)}
                  >
                    <UtensilsCrossed size={16} />
                    <span>Formulate New Dish</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Chef Ingredient-Driven Dish Formulator Modal */}
          {isChef && (
            <ChefDishFormulatorModal
              isOpen={showAddDish}
              onClose={() => setShowAddDish(false)}
              onDishCreated={() => setAllDishes(getAllDishes())}
            />
          )}

          {/* Dishes 3-Column Card Grid (Matching Precision Layout) */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.88rem', color: '#64748b' }}>
                Showing <strong>{((dishPage - 1) * pageSize) + 1}–{Math.min(dishPage * pageSize, filteredDishes.length)}</strong> of <strong>{filteredDishes.length.toLocaleString()}</strong> dishes
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem',
              alignItems: 'stretch'
            }}>
              {paginatedDishes.map((dish) => {
                const isCustom = dish.id.startsWith('custom-') || dish.tags?.includes('Chef Custom');
                return (
                  <div
                    key={dish.id}
                    className="card dish-catalog-card"
                    style={{
                      background: '#ffffff',
                      border: isCustom ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      minHeight: '380px',
                      boxSizing: 'border-box',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                    }}
                  >
                    <div>
                      {/* Top Header Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                        <span style={{
                          background: isCustom ? '#dcfce7' : dish.tier === 3 ? '#fef3c7' : dish.tier === 2 ? '#e0f2fe' : '#dcfce7',
                          color: isCustom ? '#15803d' : dish.tier === 3 ? '#b45309' : dish.tier === 2 ? '#0369a1' : '#15803d',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.22rem 0.6rem',
                          borderRadius: '20px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}>
                          {isCustom ? `TIER ${dish.tier} CHEF CREATED` : `TIER ${dish.tier} ${dish.tier === 3 ? 'GOURMET' : dish.tier === 2 ? 'STANDARD' : 'BASIC'}`}
                        </span>

                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {dish.mealType}
                        </span>
                      </div>

                      {/* Dish Name */}
                      <h3 style={{
                        fontSize: '1.05rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: '0 0 0.15rem',
                        lineHeight: 1.35,
                        minHeight: '2.8rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {dish.name}
                      </h3>

                      {/* Burmese Subtitle */}
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.5rem', minHeight: '1.3rem', fontWeight: 500 }}>
                        {dish.burmeseName || '\u00A0'}
                      </div>

                      {/* Description */}
                      <p style={{
                        fontSize: '0.8rem',
                        color: '#475569',
                        margin: '0 0 0.65rem',
                        lineHeight: 1.45,
                        minHeight: '2.8rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {dish.description || `${dish.cookingStyle} with fresh Yangon market ingredients.`}
                      </p>

                      {/* Ingredients Box */}
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '0.55rem 0.75rem',
                        fontSize: '0.76rem',
                        color: '#334155',
                        marginBottom: '0.85rem',
                        minHeight: '52px',
                        lineHeight: 1.45
                      }}>
                        <strong>Ingredients:</strong> {Array.isArray(dish.ingredients) && dish.ingredients.length > 0
                          ? dish.ingredients.join(', ')
                          : `${dish.primaryProtein}, ${dish.primaryCarb}, ${dish.primaryVeg}, Sesame & shallot oil`}
                      </div>
                    </div>

                    {/* Bottom Row */}
                    <div style={{ marginTop: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '1.08rem', fontWeight: 800, color: '#0f172a' }}>
                          {dish.ingredientCostMMK.toLocaleString()} <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>MMK</span>
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#16a34a' }}>
                          {dish.calories} kcal
                        </div>
                      </div>

                      {/* Macro Pills & Delete Button in Free Space */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                            {dish.proteinG}g P
                          </span>
                          <span style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                            {dish.carbG}g C
                          </span>
                          <span style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                            {dish.fatG}g F
                          </span>
                        </div>

                        {/* Delete button in free space */}
                        {isChef && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomDish(dish.id)}
                            style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              border: '1px solid #fca5a5',
                              padding: '0.22rem 0.55rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              transition: 'all 0.15s ease'
                            }}
                            title="Delete dish from catalog"
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Page {dishPage} of {totalDishPages}
              </span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                  disabled={dishPage <= 1}
                  onClick={() => setDishPage(1)}
                >
                  <ChevronsLeft size={14} />
                </button>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                  disabled={dishPage <= 1}
                  onClick={() => setDishPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem', fontWeight: 700, background: '#f1f5f9', borderRadius: '6px' }}>
                  {dishPage}
                </span>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                  disabled={dishPage >= totalDishPages}
                  onClick={() => setDishPage(p => Math.min(totalDishPages, p + 1))}
                >
                  Next <ChevronRight size={14} />
                </button>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                  disabled={dishPage >= totalDishPages}
                  onClick={() => setDishPage(totalDishPages)}
                >
                  <ChevronsRight size={14} />
                </button>
              </div>
            </div>
        </>
      ) : (
        /* INGREDIENTS TAB */
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search 300 ingredients by name, market, category..."
                className="form-input"
                style={{ paddingLeft: '30px', fontSize: '0.85rem' }}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIngPage(1);
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value as any);
                  setIngPage(1);
                }}
              >
                <option value="all">All Categories</option>
                <option value="protein">Proteins</option>
                <option value="carb">Carbohydrates</option>
                <option value="vegetable">Vegetables</option>
              </select>

              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                value={filterTier}
                onChange={(e) => {
                  setFilterTier(e.target.value === 'all' ? 'all' : Number(e.target.value) as DishTier);
                  setIngPage(1);
                }}
              >
                <option value="all">All Tiers</option>
                <option value="1">Tier 1: Staples</option>
                <option value="2">Tier 2: Quality</option>
                <option value="3">Tier 3: Gourmet</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Ingredient Name</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Unit / Serving</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Market Price (MMK)</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Cost / Gram</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Quality Tier</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Yangon Market Source</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Last Sourced</th>
                </tr>
              </thead>
              <tbody>
                {paginatedIngredients.map((ing) => (
                  <tr key={ing.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem 0.5rem' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{ing.name}</div>
                      {ing.burmeseName && <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{ing.burmeseName}</div>}
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', textTransform: 'capitalize' }}>
                      <span style={{ background: '#f1f5f9', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {ing.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#334155' }}>{ing.unit}</td>
                    <td style={{ padding: '0.65rem 0.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {(ing.currentPriceMMK || 0).toLocaleString()} MMK
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#64748b' }}>
                      {ing.pricePerGramMMK ? `${ing.pricePerGramMMK} MMK/g` : '-'}
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem' }}>
                      <span className={`tier-badge badge-tier${ing.tier}`}>
                        Tier {ing.tier} {ing.tier === 3 ? '★ Gourmet' : ing.tier === 2 ? 'Quality' : 'Staple'}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={12} color="#94a3b8" />
                        <span>{ing.marketSource}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', color: '#94a3b8', fontSize: '0.78rem' }}>
                      {ing.lastUpdated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Showing {((ingPage - 1) * pageSize) + 1}–{Math.min(ingPage * pageSize, filteredIngredients.length)} of {filteredIngredients.length} ingredients (Page {ingPage} of {totalIngPages})
            </span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                className="btn-secondary"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                disabled={ingPage <= 1}
                onClick={() => setIngPage(1)}
              >
                <ChevronsLeft size={14} />
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                disabled={ingPage <= 1}
                onClick={() => setIngPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem', fontWeight: 700, background: '#f1f5f9', borderRadius: '6px' }}>
                {ingPage}
              </span>
              <button
                className="btn-secondary"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                disabled={ingPage >= totalIngPages}
                onClick={() => setIngPage(p => Math.min(totalIngPages, p + 1))}
              >
                Next <ChevronRight size={14} />
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                disabled={ingPage >= totalIngPages}
                onClick={() => setIngPage(totalIngPages)}
              >
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
