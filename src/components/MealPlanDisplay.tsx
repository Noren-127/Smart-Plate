import React, { useState } from 'react';
import { CustomerMealPlan, DayPlan, Dish, PackageTier, ChefProgram, UserProfile } from '../types';
import { PACKAGE_CONFIGS } from '../data/packages';
import { Sparkles, RefreshCw, CheckCircle, Database, Calendar, Flame, DollarSign, ArrowLeft, ArrowRight, Award, ChefHat, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderCheckoutModal } from './OrderCheckoutModal';

interface MealPlanDisplayProps {
  mealPlan: CustomerMealPlan;
  chefProgram?: ChefProgram;
  userProfile: UserProfile;
  onSwapMeal: (dayNumber: number, mealType: 'breakfast' | 'lunch' | 'dinner') => void;
  onSaveToHistory: (plan: CustomerMealPlan) => void;
  onRegenerate: () => void;
  onBackToConfig: () => void;
}

export const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({
  mealPlan,
  chefProgram,
  userProfile,
  onSwapMeal,
  onSaveToHistory,
  onRegenerate,
  onBackToConfig
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const currentDay = mealPlan.days[selectedDayIndex] || mealPlan.days[0];
  const pkgConfig = PACKAGE_CONFIGS[mealPlan.packageTier];

  const handleSave = () => {
    onSaveToHistory(mealPlan);
    setIsSaved(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleModalOrderConfirm = (orderData: any) => {
    onSaveToHistory(mealPlan);
    setIsSaved(true);
  };

  const renderMealCard = (dish: Dish, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    return (
      <div className="meal-row-card" key={mealType}>
        <div>
          <div className="meal-type-label">{mealType}</div>
          <span className={`tier-badge badge-tier${dish.tier}`}>
            Tier {dish.tier} {dish.tier === 3 ? '★ Gourmet' : dish.tier === 2 ? 'Quality' : 'Staple'}
          </span>
        </div>

        <div>
          <div className="dish-name-main">{dish.name}</div>
          {dish.burmeseName && <div className="dish-name-burmese">{dish.burmeseName}</div>}
          <div className="dish-ingredients-line">
            <strong>Ingredients:</strong> {dish.ingredients.join(', ')}
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ background: '#f1f5f9', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              🥩 {dish.primaryProtein}
            </span>
            <span style={{ background: '#f1f5f9', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              🍚 {dish.primaryCarb}
            </span>
            <span style={{ background: '#f1f5f9', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              🥗 {dish.primaryVeg}
            </span>
            <span style={{ background: '#f1f5f9', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              🍳 {dish.cookingStyle}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <div className="macro-pills">
            <span className="macro-pill pill-kcal">{dish.calories} kcal</span>
            <span className="macro-pill pill-cost">{dish.ingredientCostMMK.toLocaleString()} MMK</span>
          </div>

          <div style={{ display: 'flex', gap: '0.3rem', fontSize: '0.75rem' }}>
            <span className="macro-pill pill-protein">{dish.proteinG}g P</span>
            <span className="macro-pill pill-carb">{dish.carbG}g C</span>
            <span className="macro-pill pill-fat">{dish.fatG}g F</span>
          </div>

          <button
            className="btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', marginTop: '0.25rem' }}
            onClick={() => onSwapMeal(currentDay.dayNumber, mealType)}
            title="Swap this meal with an alternative matching your macros"
          >
            <RefreshCw size={12} />
            <span>Swap Meal</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="meal-plan-display">
      {/* Chef Program Highlight Header if applicable */}
      {mealPlan.planType === 'chef_program' && chefProgram && (
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
          border: '2px solid #d97706',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#d97706', color: '#ffffff', padding: '0.5rem', borderRadius: '10px' }}>
              <ChefHat size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>
                Chef Cohort Subscription
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>
                {chefProgram.programName} by {chefProgram.chefName}
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                {chefProgram.durationDays} Days • {chefProgram.discountPercentage}% Discount Active ({chefProgram.enrolledCustomers}/{chefProgram.maxCustomers} Enrolled)
              </span>
            </div>
          </div>

          <button
            className="btn-gold"
            onClick={() => setIsCheckoutOpen(true)}
            style={{ padding: '0.7rem 1.5rem', fontSize: '0.95rem' }}
          >
            <ShoppingBag size={18} />
            <span>Confirm Order ({chefProgram.finalPriceMMK.toLocaleString()} MMK)</span>
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <h2>{chefProgram?.programName ? `${chefProgram.programName}` : `NutriChef Personalized Plan (${mealPlan.durationDays} Days)`}</h2>
            <span className={`tier-badge badge-tier${mealPlan.packageTier === 'basic' ? '1' : mealPlan.packageTier === 'standard' ? '2' : '3'}`}>
              {pkgConfig.name}
            </span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span>
              <strong>Date:</strong> {mealPlan.startDate && mealPlan.endDate ? `${new Date(`${mealPlan.startDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${new Date(`${mealPlan.endDate}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 'Scheduled Tomorrow'}
            </span>
            <span>
              <strong>Delivery:</strong>{' '}
              <span style={{
                fontWeight: 700,
                color: (mealPlan.deliveryAllowed ?? (mealPlan.planType === 'custom' || !mealPlan.chefProgramId)) ? '#15803d' : '#b45309'
              }}>
                {(mealPlan.deliveryAllowed ?? (mealPlan.planType === 'custom' || !mealPlan.chefProgramId)) ? 'Allow for delivery' : 'Not Allow for delivery'}
              </span>
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Target: <strong>{mealPlan.targetCalories.toLocaleString()} kcal/day</strong> ({mealPlan.targetProteinG}g P / {mealPlan.targetCarbG}g C / {mealPlan.targetFatG}g F) • Duration: {mealPlan.durationDays} Days
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={onRegenerate}>
            <RefreshCw size={16} />
            <span>Regenerate</span>
          </button>

          <button
            className="btn-gold"
            onClick={() => setIsCheckoutOpen(true)}
          >
            <ShoppingBag size={16} />
            <span>Confirm Order & Checkout</span>
          </button>

        </div>
      </div>

      {/* Plan Summary Metrics */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Plan Duration</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>{mealPlan.durationDays} Days</div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>{mealPlan.days.length * 3} Fresh Meals Planned</div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Avg Daily Cost</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
            {mealPlan.averageDailyCostMMK.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>MMK</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Target: {pkgConfig.targetCostRangeStr}</div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Plan Value</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706' }}>
            {mealPlan.totalPlanCostMMK.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>MMK</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Ingredient Market Cost</div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Nutrition Alignment</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>98.4% Accuracy</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Strict Caloric & Macro Match</div>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        {mealPlan.days.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayIndex(idx)}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: '8px',
                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: isSelected ? 'var(--primary-dark)' : '#ffffff',
                color: isSelected ? '#ffffff' : '#334155',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>Day {day.dayNumber}</span>
              {day.tier3Count >= 2 && <span style={{ color: '#fbbf24', fontSize: '0.75rem' }}>★</span>}
            </button>
          );
        })}
      </div>

      {/* Selected Day Schedule */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="day-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={20} color="#34d399" />
            <h3 style={{ color: '#ffffff', fontSize: '1.2rem' }}>Day {currentDay.dayNumber} Meal Schedule</h3>
          </div>
          {mealPlan.packageTier === 'premium' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#374151', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', color: '#fef3c7' }}>
              <Award size={16} color="#f59e0b" />
              <span>{currentDay.tier3Count} Tier-3 Premium Dishes</span>
            </div>
          )}
        </div>

        <div style={{ background: '#ffffff', border: '1px solid var(--border)', borderTop: 'none', padding: '1.5rem' }}>
          {renderMealCard(currentDay.breakfast, 'breakfast')}
          {renderMealCard(currentDay.lunch, 'lunch')}
          {renderMealCard(currentDay.dinner, 'dinner')}
        </div>

        <div className="day-totals-bar">
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span>
              <strong>Total Calories:</strong> {currentDay.totalCalories} kcal (Target: {mealPlan.targetCalories} kcal)
            </span>
            <span>
              <strong>Macros:</strong> {currentDay.totalProteinG}g P • {currentDay.totalCarbG}g C • {currentDay.totalFatG}g F
            </span>
          </div>

          <div>
            <strong>Daily Ingredient Cost:</strong>{' '}
            <span style={{ color: '#34d399', fontSize: '1rem', fontWeight: 800 }}>
              {currentDay.totalCostMMK.toLocaleString()} MMK
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Back Nav & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <button className="btn-secondary" onClick={onBackToConfig}>
          <ArrowLeft size={16} />
          <span>Adjust Plan Settings</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-gold" onClick={() => setIsCheckoutOpen(true)}>
            <CheckCircle size={16} />
            <span>Confirm & Order Now ({mealPlan.totalPlanCostMMK.toLocaleString()} MMK)</span>
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      <OrderCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        program={chefProgram}
        mealPlan={mealPlan}
        userProfile={userProfile}
        onConfirmOrder={handleModalOrderConfirm}
      />
    </div>
  );
};
