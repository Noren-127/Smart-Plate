import React, { useState } from 'react';
import { ChefProgram, PackageTier, Goal, Dish } from '../types';
import { PACKAGE_CONFIGS } from '../data/packages';
import { ChefHat, Plus, Users, Calendar, Tag, DollarSign, Check, Percent, Sparkles, UtensilsCrossed, Trash2 } from 'lucide-react';
import { ChefDishFormulatorModal } from './ChefDishFormulatorModal';
import confetti from 'canvas-confetti';

interface ChefStudioProps {
  programs: ChefProgram[];
  onCreateProgram: (program: ChefProgram) => void;
  onReleaseProgram: (programId: string) => void;
  onDeleteProgram: (programId: string) => void;
}

export const ChefStudio: React.FC<ChefStudioProps> = ({
  programs,
  onCreateProgram,
  onReleaseProgram,
  onDeleteProgram
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDishModal, setShowDishModal] = useState<boolean>(false);
  const [programName, setProgramName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [durationDays, setDurationDays] = useState<7 | 10 | 30>(10);
  const [packageTier, setPackageTier] = useState<PackageTier>('standard');
  const [originalPriceMMK, setOriginalPriceMMK] = useState<number>(300000);
  const [discountPercentage, setDiscountPercentage] = useState<number>(15);
  const [maxCustomers, setMaxCustomers] = useState<number>(25);
  const [startDate, setStartDate] = useState<string>('2026-09-01');
  const [targetGoal, setTargetGoal] = useState<Goal>('maintain');
  const [deliveryAllowed, setDeliveryAllowed] = useState(false);

  const getTierDailyRate = (tier: PackageTier) => {
    return tier === 'basic' ? 15000 : tier === 'standard' ? 30000 : 50000;
  };

  const finalPriceMMK = Math.round(originalPriceMMK * (1 - discountPercentage / 100));

  const handleOpenCreateModal = () => {
    setPackageTier('standard');
    setDurationDays(10);
    setOriginalPriceMMK(30000 * 10);
    setDiscountPercentage(15);
    setProgramName('');
    setDescription('');
    setShowModal(true);
  };

  const handleTierChange = (tier: PackageTier) => {
    setPackageTier(tier);
    // Suggest appropriate default base price strictly based on tier rate
    const dailyAvg = getTierDailyRate(tier);
    setOriginalPriceMMK(dailyAvg * durationDays);
  };

  const handleDurationChange = (days: 7 | 10 | 30) => {
    setDurationDays(days);
    const dailyAvg = getTierDailyRate(packageTier);
    setOriginalPriceMMK(dailyAvg * days);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programName) return;

    const newProg: ChefProgram = {
      id: `prog-${Date.now()}`,
      chefId: 'chef-kyaw',
      chefName: 'Chef Kyaw Zeya',
      programName,
      description: description || 'Specialized chef curated high-nutrition cohort.',
      durationDays,
      packageTier,
      originalPriceMMK,
      discountPercentage,
      finalPriceMMK,
      maxCustomers,
      enrolledCustomers: 0,
      startDate,
      targetGoal,
      deliveryAllowed,
      dailyAvgCalories: 2000,
      tags: [packageTier.toUpperCase(), `${durationDays} Days`, `${discountPercentage}% Off`],
      sampleDishes: packageTier === 'premium'
        ? ['Norwegian Salmon Quinoa', 'Wild Tiger Prawn Soba', 'Avocado Egg Rice Bowl']
        : packageTier === 'standard'
        ? ['Inle Seabass Brown Rice', 'Lean Beef Tenderloin', 'Highland Broccoli Medley']
        : ['Lemongrass Chicken Jasmine Rice', 'Shan Tofu Omelette', 'Steamed Morning Glory Broth']
    };

    onCreateProgram(newProg);
    setShowModal(false);
    setProgramName('');
    setDescription('');
    confetti({ particleCount: 60, spread: 60 });
  };

  return (
    <div className="chef-studio">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#fef3c7', padding: '0.4rem', borderRadius: '8px', color: '#b45309' }}>
              <ChefHat size={24} />
            </div>
            <h2>Chef Studio & Subscription Programs</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Formulate precision recipes from raw wholesale ingredients, and publish subscription cohorts with member discounts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.1rem' }}
            onClick={() => setShowDishModal(true)}
          >
            <UtensilsCrossed size={17} />
            <span>Formulate New Dish</span>
          </button>

          <button className="btn-gold" onClick={handleOpenCreateModal}>
            <Plus size={18} />
            <span>Create New Program</span>
          </button>
        </div>
      </div>

      {/* 3 Tier Columns Roster Grid: 2 Basic (Left), 2 Standard (Middle), 2 Premium (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {[
          {
            tierKey: 'basic',
            title: 'Basic Tier Cohorts (15,000 MMK/day)',
            badgeClass: 'badge-tier1',
            headerBg: '#f0fdf4',
            borderColor: '#86efac',
            items: programs.filter(p => p.packageTier === 'basic')
          },
          {
            tierKey: 'standard',
            title: 'Standard Tier Cohorts (30,000 MMK/day)',
            badgeClass: 'badge-tier2',
            headerBg: '#eff6ff',
            borderColor: '#93c5fd',
            items: programs.filter(p => p.packageTier === 'standard')
          },
          {
            tierKey: 'premium',
            title: 'Premium Tier Cohorts (50,000 MMK/day)',
            badgeClass: 'badge-tier3',
            headerBg: '#fffbeb',
            borderColor: '#fde68a',
            items: programs.filter(p => p.packageTier === 'premium')
          }
        ].map(col => (
          <div
            key={col.tierKey}
            style={{
              background: '#f8fafc',
              borderRadius: '14px',
              border: `1px solid ${col.borderColor}`,
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {/* Column Header */}
            <div style={{
              background: col.headerBg,
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 800 }}>{col.title}</h4>
              <span className={`tier-badge ${col.badgeClass}`}>
                {col.tierKey.toUpperCase()}
              </span>
            </div>

            {/* Program Cards in Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {col.items.map((prog) => {
                const slotsLeft = prog.maxCustomers - prog.enrolledCustomers;
                const fillRate = Math.round((prog.enrolledCustomers / prog.maxCustomers) * 100);

                return (
                  <div
                    key={prog.id}
                    className="card program-card"
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      minHeight: '530px',
                      boxSizing: 'border-box',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                          {prog.durationDays} Days Duration
                        </span>
                        <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '6px' }}>
                          {prog.discountPercentage}% DISCOUNT
                        </span>
                      </div>

                      <h3 style={{
                        fontSize: '1.05rem',
                        margin: '0 0 0.2rem',
                        color: '#0f172a',
                        fontWeight: 800,
                        minHeight: '2.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1.3
                      }}>
                        {prog.programName}
                      </h3>

                      <p style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 600, margin: '0 0 0.4rem', minHeight: '1.2rem' }}>
                        Lead Chef: {prog.chefName}
                      </p>

                      <p style={{
                        fontSize: '0.8rem',
                        color: '#334155',
                        margin: '0 0 0.75rem',
                        lineHeight: 1.4,
                        minHeight: '3.2rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {prog.description}
                      </p>

                      <div style={{
                        background: '#f8fafc',
                        padding: '0.65rem',
                        borderRadius: '8px',
                        marginBottom: '0.75rem',
                        border: '1px solid #e2e8f0',
                        minHeight: '96px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start'
                      }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
                          Sample Menu Highlights:
                        </span>
                        <ul style={{ paddingLeft: '1.1rem', fontSize: '0.74rem', color: '#334155', margin: 0, lineHeight: 1.4 }}>
                          {prog.sampleDishes.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Actions & Capacity Section (Aligned at Bottom) */}
                    <div style={{ marginTop: 'auto' }}>
                      {/* Action Buttons: Approve / Release AND Delete Package */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <button
                          className="btn-secondary"
                          onClick={() => onReleaseProgram(prog.id)}
                          style={{
                            flex: 1,
                            color: prog.mealsReleased || prog.deliveryAllowed ? '#15803d' : '#b45309',
                            background: prog.mealsReleased || prog.deliveryAllowed ? '#dcfce7' : '#fef3c7',
                            borderColor: prog.mealsReleased || prog.deliveryAllowed ? '#86efac' : '#fde68a',
                            fontWeight: 700,
                            padding: '0.5rem 0.6rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            fontSize: '0.78rem'
                          }}
                        >
                          {prog.mealsReleased || prog.deliveryAllowed ? '✓ Approved (Delivery ON)' : 'Approve Delivery'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the subscription package "${prog.programName}"?`)) {
                              onDeleteProgram(prog.id);
                            }
                          }}
                          style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.3rem',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}
                          title="Delete this subscription package"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>

                      <div style={{ marginBottom: '0.65rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '0.25rem' }}>
                          <span style={{ color: '#64748b' }}>Cohort Capacity</span>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{prog.enrolledCustomers} / {prog.maxCustomers} Enrolled ({fillRate}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${fillRate}%`, height: '100%', background: fillRate > 80 ? '#dc2626' : '#16a34a' }} />
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', textDecoration: 'line-through', color: '#94a3b8', display: 'block' }}>
                            {prog.originalPriceMMK.toLocaleString()} MMK
                          </span>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                            {prog.finalPriceMMK.toLocaleString()} <span style={{ fontSize: '0.72rem' }}>MMK</span>
                          </div>
                        </div>

                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                          Starts: {prog.startDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Create Program Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChefHat size={22} color="#d97706" />
                <h3 style={{ fontSize: '1.25rem' }}>Create Chef Subscription Program</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Program Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inle Fishermen High-Protein Fuel"
                  className="form-input"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Culinary Highlights</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="Describe the diet type and key ingredients..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Package Quality Tier</label>
                  <select
                    className="form-select"
                    value={packageTier}
                    onChange={(e) => handleTierChange(e.target.value as PackageTier)}
                  >
                    <option value="basic">Tier 1: Basic Staples (15,000 MMK/day)</option>
                    <option value="standard">Tier 2: Standard Quality (30,000 MMK/day)</option>
                    <option value="premium">Tier 3: Gourmet Luxury (50,000 MMK/day)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Program Duration</label>
                  <select
                    className="form-select"
                    value={durationDays}
                    onChange={(e) => handleDurationChange(Number(e.target.value) as 7 | 10 | 30)}
                  >
                    <option value={7}>7 Days</option>
                    <option value={10}>10 Days</option>
                    <option value={30}>1 Month (30 Days)</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Tier Benchmark Indicator */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.6rem 0.85rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#1e40af', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>Tier Rate:</strong> {getTierDailyRate(packageTier).toLocaleString()} MMK/day × {durationDays} Days</span>
                <span style={{ fontWeight: 800 }}>Standard Base: {(getTierDailyRate(packageTier) * durationDays).toLocaleString()} MMK</span>
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Base Price (MMK)</label>
                  <input
                    type="number"
                    step={1000}
                    className="form-input"
                    value={originalPriceMMK}
                    onChange={(e) => setOriginalPriceMMK(Number(e.target.value))}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    className="form-input"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={deliveryAllowed} onChange={(e) => setDeliveryAllowed(e.target.checked)} />
                  <span>Allow delivery for this program cohort immediately</span>
                </label>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Final Customer Price:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {finalPriceMMK.toLocaleString()} MMK
                </span>
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Max Customer Seats</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    className="form-input"
                    value={maxCustomers}
                    onChange={(e) => setMaxCustomers(Number(e.target.value))}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-gold">
                  <Sparkles size={16} />
                  <span>Publish Program</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chef Ingredient-Driven Dish Formulator Modal */}
      <ChefDishFormulatorModal
        isOpen={showDishModal}
        onClose={() => setShowDishModal(false)}
      />
    </div>
  );
};
