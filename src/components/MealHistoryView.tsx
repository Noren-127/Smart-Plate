import React, { useState } from 'react';
import { MealHistoryItem, CustomerMealPlan, ChefProgram } from '../types';
import { History, ShieldCheck, PieChart, Sparkles, Trash2, Utensils, Calendar, ChevronLeft, ChevronRight, CheckCircle, Clock, Truck, AlertCircle } from 'lucide-react';

interface MealHistoryViewProps {
  history: MealHistoryItem[];
  onClearHistory: () => void;
  onSeedSampleHistory: () => void;
  plans: CustomerMealPlan[];
  onRemovePlan: (id: string) => void;
  chefPrograms?: ChefProgram[];
}

export function formatPlanDate(dateStr?: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  const d = new Date(`${dateStr}T00:00:00`);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatPlanRange(startDate?: string, endDate?: string, durationDays: number = 7): string {
  if (startDate && endDate) {
    return `${formatPlanDate(startDate)} – ${formatPlanDate(endDate)}`;
  }
  if (startDate) {
    const parts = startDate.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const end = new Date(d);
    end.setDate(end.getDate() + durationDays - 1);
    return `${formatPlanDate(startDate)} – ${formatPlanDate(end.toISOString().slice(0, 10))}`;
  }
  // Custom Plan default: starts tomorrow
  const start = new Date();
  start.setDate(start.getDate() + 1);
  const end = new Date(start);
  end.setDate(end.getDate() + durationDays - 1);
  return `${formatPlanDate(start.toISOString().slice(0, 10))} – ${formatPlanDate(end.toISOString().slice(0, 10))}`;
}

export const MealHistoryView: React.FC<MealHistoryViewProps> = ({
  history,
  onClearHistory,
  onSeedSampleHistory,
  plans: allPlans,
  onRemovePlan,
  chefPrograms = []
}) => {
  const [activeTab, setActiveTab] = useState<'schedules' | 'log' | 'analytics'>('schedules');
  const [selectedDays, setSelectedDays] = useState<Record<string, number>>({});
  const [scheduleFilter, setScheduleFilter] = useState<'active' | 'all'>('active');

  const visiblePlans = scheduleFilter === 'active'
    ? allPlans.filter(p => !p.cancelledAt)
    : allPlans;

  // Compute variety and macro distribution
  const proteinCounts: Record<string, number> = {};
  const carbCounts: Record<string, number> = {};
  const styleCounts: Record<string, number> = {};

  history.forEach(item => {
    proteinCounts[item.primaryProtein] = (proteinCounts[item.primaryProtein] || 0) + 1;
    carbCounts[item.primaryCarb] = (carbCounts[item.primaryCarb] || 0) + 1;
    styleCounts[item.cookingStyle] = (styleCounts[item.cookingStyle] || 0) + 1;
  });

  const totalMealsLogged = history.length;

  return (
    <div className="meal-history-view">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#dcfce7', padding: '0.4rem', borderRadius: '8px', color: '#15803d' }}>
              <History size={24} />
            </div>
            <h2>Meal History & Current Meal Schedule</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Inspect your active meal schedule, delivery permissions, historical meals, and nutrition variety trends.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#e2e8f0', padding: '0.25rem', borderRadius: '10px' }}>
          <button
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'schedules' ? '#ffffff' : 'transparent',
              color: activeTab === 'schedules' ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
            onClick={() => setActiveTab('schedules')}
          >
            <Calendar size={15} />
            Current Meal Schedule ({allPlans.filter(p => !p.cancelledAt).length})
          </button>
        </div>
      </div>

      {/* TAB 1: Current Meal Schedule */}
      {activeTab === 'schedules' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Showing {visiblePlans.length} confirmed {visiblePlans.length === 1 ? 'schedule' : 'schedules'}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={`btn-secondary ${scheduleFilter === 'active' ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: scheduleFilter === 'active' ? '#ecfdf5' : undefined, color: scheduleFilter === 'active' ? '#15803d' : undefined }}
                onClick={() => setScheduleFilter('active')}
              >
                Active Only
              </button>
              <button
                className={`btn-secondary ${scheduleFilter === 'all' ? 'active' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: scheduleFilter === 'all' ? '#f1f5f9' : undefined }}
                onClick={() => setScheduleFilter('all')}
              >
                All Schedules
              </button>
            </div>
          </div>

          {visiblePlans.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
              <Calendar size={44} style={{ margin: '0 auto 0.75rem', opacity: 0.4, color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '0.35rem' }}>No confirmed meal schedule yet</h3>
              <p style={{ fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto' }}>
                Complete a custom meal plan order or join a chef program cohort to activate your scheduled Yangon deliveries.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {visiblePlans.map(plan => {
                const isCustom = plan.planType === 'custom' || !plan.chefProgramId;
                const programObj = plan.chefProgramId ? chefPrograms.find(p => p.id === plan.chefProgramId) : null;
                
                // Delivery status calculation:
                // Custom Plan: always "Allow for delivery"
                // Chef Program: "Not Allow for delivery" by default, until chef approves "Allow for delivery"
                const isDeliveryAllowed = isCustom
                  ? true
                  : Boolean(plan.deliveryAllowed || programObj?.deliveryAllowed || plan.mealPlanReleased || programObj?.mealsReleased);

                const planTitle = isCustom
                  ? `NutriChef Personalized Plan (${plan.durationDays} Days)`
                  : (plan.chefProgramName || programObj?.programName || `Chef Healthy Meal Program (${plan.durationDays} Days)`);

                const dateRangeStr = formatPlanRange(plan.startDate, plan.endDate, plan.durationDays);
                const dayIdx = selectedDays[plan.id] || 0;
                const currentDay = plan.days[dayIdx] || plan.days[0];

                return (
                  <div
                    key={plan.id}
                    className="card"
                    style={{
                      border: plan.cancelledAt ? '1px solid #cbd5e1' : '2px solid #86efac',
                      boxShadow: plan.cancelledAt ? 'none' : '0 4px 20px -2px rgba(22, 163, 74, 0.08)'
                    }}
                  >
                    {/* Header with Plan Name, Date Range, Delivery Status */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderBottom: '1px solid #e2e8f0',
                      paddingBottom: '1.25rem',
                      marginBottom: '1.25rem'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            background: plan.cancelledAt ? '#f1f5f9' : '#dcfce7',
                            color: plan.cancelledAt ? '#64748b' : '#15803d'
                          }}>
                            {plan.cancelledAt ? 'CANCELLED / FINISHED' : 'ACTIVE MEAL SCHEDULE'}
                          </span>
                          <span className={`tier-badge badge-tier${plan.packageTier === 'basic' ? '1' : plan.packageTier === 'standard' ? '2' : '3'}`}>
                            {plan.packageTier.toUpperCase()} TIER
                          </span>
                        </div>

                        {/* Plan / Program Name */}
                        <h3 style={{ margin: '0.2rem 0 0.5rem', fontSize: '1.3rem', color: '#0f172a', fontWeight: 800 }}>
                          {planTitle}
                        </h3>

                        {/* Date Range & Delivery Status */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.92rem' }}>
                          <div>
                            <strong style={{ color: '#475569' }}>Date:</strong>{' '}
                            <span style={{ color: '#0f172a', fontWeight: 700 }}>{dateRangeStr}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <strong style={{ color: '#475569' }}>Delivery:</strong>{' '}
                            <span style={{
                              fontWeight: 800,
                              color: isDeliveryAllowed ? '#15803d' : '#b45309',
                              background: isDeliveryAllowed ? '#dcfce7' : '#fef3c7',
                              border: `1px solid ${isDeliveryAllowed ? '#86efac' : '#fde68a'}`,
                              padding: '0.25rem 0.75rem',
                              borderRadius: '6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.85rem'
                            }}>
                              <Truck size={14} />
                              <span>{isDeliveryAllowed ? 'Allow for delivery' : 'Not Allow for delivery'}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Total Plan Value</span>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                            {plan.totalPlanCostMMK.toLocaleString()} MMK
                          </span>
                        </div>

                        {!plan.cancelledAt && (
                          <button
                            className="btn-secondary"
                            style={{ color: '#dc2626', borderColor: '#fecaca', padding: '0.35rem 0.75rem', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to cancel the meal schedule for "${planTitle}"?`)) {
                                onRemovePlan(plan.id);
                              }
                            }}
                          >
                            <Trash2 size={13} />
                            <span>Cancel Schedule</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Day Navigator */}
                    {currentDay && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', color: '#ffffff', padding: '0.65rem 1rem', borderRadius: '10px', marginBottom: '0.75rem' }}>
                          <button
                            disabled={dayIdx === 0}
                            onClick={() => setSelectedDays({ ...selectedDays, [plan.id]: Math.max(0, dayIdx - 1) })}
                            style={{ background: 'none', border: 'none', color: '#ffffff', opacity: dayIdx === 0 ? 0.3 : 1, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <div style={{ textAlign: 'center' }}>
                            <strong>Day {currentDay.dayNumber} of {plan.days.length}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
                              {currentDay.totalCalories} kcal • {currentDay.totalProteinG}g P • {currentDay.totalCostMMK.toLocaleString()} MMK
                            </span>
                          </div>
                          <button
                            disabled={dayIdx === plan.days.length - 1}
                            onClick={() => setSelectedDays({ ...selectedDays, [plan.id]: Math.min(plan.days.length - 1, dayIdx + 1) })}
                            style={{ background: 'none', border: 'none', color: '#ffffff', opacity: dayIdx === plan.days.length - 1 ? 0.3 : 1, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <ChevronRight size={20} />
                          </button>
                        </div>

                        {/* 3 Meals for this day */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                          {[
                            { slot: 'Breakfast', dish: currentDay.breakfast },
                            { slot: 'Lunch', dish: currentDay.lunch },
                            { slot: 'Dinner', dish: currentDay.dinner }
                          ].map(({ slot, dish }) => (
                            <div key={slot} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{slot}</span>
                                <span className={`tier-badge badge-tier${dish.tier}`}>T{dish.tier}</span>
                              </div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.2rem' }}>{dish.name}</div>
                              {dish.burmeseName && <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>{dish.burmeseName}</div>}
                              <div style={{ fontSize: '0.75rem', color: '#475569', borderTop: '1px solid #e2e8f0', paddingTop: '0.35rem', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{dish.calories} kcal</span>
                                <span style={{ fontWeight: 600 }}>{dish.proteinG}g P</span>
                                <span style={{ color: 'var(--primary)' }}>{dish.ingredientCostMMK.toLocaleString()} MMK</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Historical Meal Log */}
      {activeTab === 'log' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.88rem', color: '#64748b' }}>
              Logged Consumption Records ({history.length} meals)
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={onSeedSampleHistory}>
                <Sparkles size={14} />
                <span>Seed Sample History</span>
              </button>
              <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: '#dc2626' }} onClick={onClearHistory}>
                <Trash2 size={14} />
                <span>Clear Log</span>
              </button>
            </div>
          </div>

          <div className="card" style={{ padding: '1rem' }}>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8' }}>
                <Utensils size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                <p>No historical meals recorded yet. Generate and save a meal plan to build your history log!</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Date / Label</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Slot</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Dish Name</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Tier</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Primary Protein</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Carb Source</th>
                      <th style={{ padding: '0.75rem 0.5rem' }}>Veggie / Cooking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>{item.date}</td>
                        <td style={{ padding: '0.65rem 0.5rem', textTransform: 'capitalize', color: '#64748b' }}>{item.mealType}</td>
                        <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{item.dishName}</td>
                        <td style={{ padding: '0.65rem 0.5rem' }}>
                          <span className={`tier-badge badge-tier${item.tier}`}>Tier {item.tier}</span>
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem', color: '#991b1b', fontWeight: 600 }}>{item.primaryProtein}</td>
                        <td style={{ padding: '0.65rem 0.5rem', color: '#0369a1' }}>{item.primaryCarb}</td>
                        <td style={{ padding: '0.65rem 0.5rem', color: '#047857' }}>{item.cookingStyle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Variety & Macro Analytics */}
      {activeTab === 'analytics' && (
        <div>
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            {/* Protein Distribution */}
            <div className="card">
              <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🥩 Protein Source Frequency
              </h4>
              {Object.keys(proteinCounts).length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No meal history logged yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(proteinCounts).map(([protein, count]) => (
                    <div key={protein}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                        <span>{protein}</span>
                        <span style={{ fontWeight: 700 }}>{count} times ({Math.round((count / totalMealsLogged) * 100)}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (count / totalMealsLogged) * 100)}%`, height: '100%', background: '#ef4444' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Carbohydrate Distribution */}
            <div className="card">
              <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🍚 Carbohydrate Diversity
              </h4>
              {Object.keys(carbCounts).length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No meal history logged yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(carbCounts).map(([carb, count]) => (
                    <div key={carb}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                        <span>{carb}</span>
                        <span style={{ fontWeight: 700 }}>{count} times ({Math.round((count / totalMealsLogged) * 100)}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (count / totalMealsLogged) * 100)}%`, height: '100%', background: '#3b82f6' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cooking Style Distribution */}
            <div className="card">
              <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                🍳 Culinary Cooking Styles
              </h4>
              {Object.keys(styleCounts).length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No meal history logged yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(styleCounts).map(([style, count]) => (
                    <div key={style}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                        <span>{style}</span>
                        <span style={{ fontWeight: 700 }}>{count} times ({Math.round((count / totalMealsLogged) * 100)}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (count / totalMealsLogged) * 100)}%`, height: '100%', background: '#10b981' }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
