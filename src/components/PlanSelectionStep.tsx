import React from 'react';
import { ChefProgram } from '../types';
import { Sparkles, ChefHat, Calendar, Users, Percent, ArrowRight, ArrowLeft, CheckCircle, Zap, AlertCircle, Lock } from 'lucide-react';

interface PlanSelectionStepProps {
  planType: 'custom' | 'chef_program';
  durationDays: 7 | 10 | 30;
  selectedProgramId?: string;
  chefPrograms: ChefProgram[];
  onSelectPlanType: (type: 'custom' | 'chef_program') => void;
  onSelectDuration: (days: 7 | 10 | 30) => void;
  onSelectProgram: (program: ChefProgram) => void;
  onDirectConfirmChefOrder?: (program: ChefProgram) => void;
  onPreviewTierDishes?: (tier: 'basic' | 'standard' | 'premium') => void;
  onNext: () => void;
  onPrev: () => void;
  isScheduleActive?: boolean;
  activeScheduleName?: string;
  activeScheduleEnd?: string;
  onViewActiveHistory?: () => void;
}

export const PlanSelectionStep: React.FC<PlanSelectionStepProps> = ({
  planType,
  durationDays,
  selectedProgramId,
  chefPrograms,
  onSelectPlanType,
  onSelectDuration,
  onSelectProgram,
  onDirectConfirmChefOrder,
  onPreviewTierDishes,
  onNext,
  onPrev,
  isScheduleActive = false,
  activeScheduleName,
  activeScheduleEnd,
  onViewActiveHistory
}) => {
  const selectedProg = chefPrograms.find(p => p.id === selectedProgramId);

  return (
    <div className="plan-selection-step">
      {/* ACTIVE SUBSCRIPTION LOCK BANNER */}
      {isScheduleActive && (
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '2px solid #f59e0b',
          borderRadius: '14px',
          padding: '1.1rem 1.35rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ background: '#f59e0b', color: '#ffffff', padding: '0.55rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={22} />
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#92400e', fontSize: '1.05rem', fontWeight: 800 }}>
                Active Meal Subscription in Progress
              </h4>
              <p style={{ margin: '3px 0 0', fontSize: '0.86rem', color: '#78350f', lineHeight: 1.4 }}>
                You currently have an active ongoing meal plan: <strong>{activeScheduleName || 'NutriChef Meal Plan'}</strong> (Active until <strong>{activeScheduleEnd}</strong>).
                <br />
                <span style={{ fontSize: '0.82rem', color: '#b45309' }}>
                  To prevent conflicting delivery schedules, new plan orders are locked while an active plan is in progress.
                </span>
              </p>
            </div>
          </div>

          {onViewActiveHistory && (
            <button
              type="button"
              className="btn-primary"
              onClick={onViewActiveHistory}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1.1rem', whiteSpace: 'nowrap' }}
            >
              View Active Plan in History
            </button>
          )}
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Choose How You Want Your Meals</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Select a flexible personal custom schedule or join a limited-seat chef subscription program with exclusive member discounts.
        </p>
      </div>

      {/* Switcher Cards: Custom Plan vs Join Chef Program */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Card: Custom Plan */}
        <div
          className={`card ${planType === 'custom' ? 'tier-card selected' : ''}`}
          style={{ cursor: 'pointer', border: planType === 'custom' ? '2px solid var(--primary)' : '1px solid var(--border)' }}
          onClick={() => onSelectPlanType('custom')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: '#dcfce7', padding: '0.4rem', borderRadius: '8px', color: '#15803d' }}>
                <Sparkles size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>Custom Plan</h3>
            </div>
            <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 600 }}>
              Full Flexibility
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem', minHeight: '40px' }}>
            AI-generated personalized daily meal plan tailored precisely to your macro targets and budget with single-meal swap flexibility.
          </p>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>Select Schedule Duration</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {[7, 10, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlanType('custom');
                    onSelectDuration(days as 7 | 10 | 30);
                  }}
                  style={{
                    padding: '0.6rem 0.5rem',
                    borderRadius: '8px',
                    border: durationDays === days && planType === 'custom' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: durationDays === days && planType === 'custom' ? '#dcfce7' : '#ffffff',
                    fontWeight: 700,
                    color: durationDays === days && planType === 'custom' ? '#15803d' : '#334155',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  {days === 30 ? '1 Month (30d)' : `${days} Days`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card: Join Chef Program */}
        <div
          className={`card ${planType === 'chef_program' ? 'tier-card selected' : ''}`}
          style={{ cursor: 'pointer', border: planType === 'chef_program' ? '2px solid #d97706' : '1px solid var(--border)' }}
          onClick={() => onSelectPlanType('chef_program')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: '#fef3c7', padding: '0.4rem', borderRadius: '8px', color: '#b45309' }}>
                <ChefHat size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>Join Chef Program</h3>
            </div>
            <span style={{ fontSize: '0.8rem', background: '#fee2e2', color: '#b91c1c', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
              Up to 20% Discount
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem', minHeight: '40px' }}>
            Join curated meal cohorts designed by Yangon master chefs. Fixed batch cooking creates economies of scale with limited client seats.
          </p>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Programs Available:</span>
            <span style={{ fontWeight: 700, color: '#d97706' }}>{chefPrograms.length} Live Cohorts</span>
          </div>
        </div>
      </div>

      {/* Program Selection list when planType is 'chef_program' */}
      {planType === 'chef_program' && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#0f172a' }}>Chef Recommendation Programs</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                6 calibrated cohorts across 3 quality tiers. Select a program or click Instant Checkout.
              </p>
            </div>
            <span style={{ fontSize: '0.82rem', background: '#ecfdf5', color: '#15803d', padding: '0.3rem 0.75rem', borderRadius: '12px', fontWeight: 700 }}>
              ✓ 6 Active Chef Cohorts
            </span>
          </div>

          {/* 3 Side-by-Side Tier Columns: 2 Basic (Left), 2 Standard (Middle), 2 Premium (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {[
              {
                tierKey: 'basic',
                title: 'Basic Tier Cohorts',
                dailyTarget: '15,000 MMK / day',
                badgeClass: 'badge-tier1',
                headerBg: '#f0fdf4',
                borderColor: '#86efac',
                programs: chefPrograms.filter(p => p.packageTier === 'basic')
              },
              {
                tierKey: 'standard',
                title: 'Standard Tier Cohorts',
                dailyTarget: '30,000 MMK / day',
                badgeClass: 'badge-tier2',
                headerBg: '#eff6ff',
                borderColor: '#93c5fd',
                programs: chefPrograms.filter(p => p.packageTier === 'standard')
              },
              {
                tierKey: 'premium',
                title: 'Premium Tier Cohorts',
                dailyTarget: '50,000 MMK / day',
                badgeClass: 'badge-tier3',
                headerBg: '#fffbeb',
                borderColor: '#fde68a',
                programs: chefPrograms.filter(p => p.packageTier === 'premium')
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
                {/* Column Tier Header */}
                <div style={{
                  background: col.headerBg,
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#0f172a', fontWeight: 800 }}>{col.title}</h4>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{col.dailyTarget}</span>
                  </div>
                  <span className={`tier-badge ${col.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                    {col.tierKey.toUpperCase()}
                  </span>
                </div>

                {/* 2 Programs per Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  {col.programs.map((program) => {
                    const isSelected = selectedProgramId === program.id;
                    const slotsLeft = Math.max(0, program.maxCustomers - program.enrolledCustomers);
                    const isSoldOut = slotsLeft === 0;

                    return (
                      <div
                        key={program.id}
                        className={`card ${isSelected ? 'tier-card selected' : ''}`}
                        style={{
                          cursor: isSoldOut || isScheduleActive ? 'not-allowed' : 'pointer',
                          background: isSoldOut ? '#fafafa' : '#ffffff',
                          border: isSelected ? '2px solid #d97706' : isSoldOut ? '1px dashed #cbd5e1' : '1px solid #e2e8f0',
                          borderRadius: '14px',
                          padding: '1.15rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          height: '100%',
                          minHeight: '420px',
                          boxSizing: 'border-box',
                          boxShadow: isSelected ? '0 8px 20px -4px rgba(217, 119, 6, 0.15)' : 'none',
                          opacity: isSoldOut ? 0.75 : 1,
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => {
                          if (!isSoldOut && !isScheduleActive) onSelectProgram(program);
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                              {program.durationDays} Days ({program.durationDays * 3} Meals)
                            </span>
                            {isSoldOut ? (
                              <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '6px' }}>
                                SOLD OUT
                              </span>
                            ) : (
                              <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.72rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '6px' }}>
                                {program.discountPercentage}% OFF
                              </span>
                            )}
                          </div>

                          <h4 style={{
                            fontSize: '1.02rem',
                            margin: '0 0 0.2rem',
                            color: '#0f172a',
                            fontWeight: 800,
                            minHeight: '2.6rem',
                            display: 'flex',
                            alignItems: 'center',
                            lineHeight: 1.3
                          }}>
                            {program.programName}
                          </h4>

                          <p style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 600, margin: '0 0 0.4rem', minHeight: '1.2rem' }}>
                            Curated by {program.chefName} • Starts {program.startDate}
                          </p>

                          <p style={{
                            fontSize: '0.8rem',
                            color: '#475569',
                            margin: '0 0 0.75rem',
                            lineHeight: 1.4,
                            minHeight: '3.2rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {program.description}
                          </p>

                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem', minHeight: '28px' }}>
                            {program.tags.map((t, idx) => (
                              <span key={idx} style={{ background: '#f1f5f9', fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', color: '#475569' }}>
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: 'auto' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                            <div>
                              <span style={{ fontSize: '0.72rem', textDecoration: 'line-through', color: '#94a3b8', display: 'block' }}>
                                {program.originalPriceMMK.toLocaleString()} MMK
                              </span>
                              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                                {program.finalPriceMMK.toLocaleString()} <span style={{ fontSize: '0.72rem' }}>MMK</span>
                              </div>
                            </div>
                            <span style={{
                              fontSize: '0.75rem',
                              color: isSoldOut ? '#dc2626' : slotsLeft <= 5 ? '#d97706' : '#16a34a',
                              fontWeight: 800,
                              background: isSoldOut ? '#fee2e2' : '#f8fafc',
                              padding: '0.2rem 0.4rem',
                              borderRadius: '6px'
                            }}>
                              {isSoldOut ? '0 Seats (Full)' : `${slotsLeft} / ${program.maxCustomers} seats left`}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              disabled={isScheduleActive}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onPreviewTierDishes) {
                                  onPreviewTierDishes(program.packageTier);
                                }
                              }}
                              className="btn-secondary"
                              style={{
                                flex: 1,
                                padding: '0.45rem',
                                fontSize: '0.78rem',
                                borderColor: '#cbd5e1',
                                background: '#ffffff',
                                color: '#334155',
                                opacity: isScheduleActive ? 0.6 : 1,
                                cursor: isScheduleActive ? 'not-allowed' : 'pointer',
                                fontWeight: 700
                              }}
                            >
                              Preview Meals
                            </button>

                            {onDirectConfirmChefOrder && !isSoldOut && (
                              <button
                                type="button"
                                disabled={isScheduleActive}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDirectConfirmChefOrder(program);
                                }}
                                className="btn-gold"
                                style={{
                                  padding: '0.45rem 0.8rem',
                                  fontSize: '0.78rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  opacity: isScheduleActive ? 0.6 : 1,
                                  cursor: isScheduleActive ? 'not-allowed' : 'pointer'
                                }}
                              >
                                <Zap size={13} />
                                <span>Instant Join</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation & Confirmation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button className="btn-secondary" onClick={onPrev}>
          <ArrowLeft size={16} />
          <span>Back to Profile</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {isScheduleActive && (
            <span style={{ fontSize: '0.82rem', color: '#b45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Lock size={15} /> Ordering locked while active plan is running
            </span>
          )}

          {planType === 'chef_program' && selectedProg && (
            <button
              className="btn-gold"
              disabled={isScheduleActive}
              style={{ opacity: isScheduleActive ? 0.5 : 1, cursor: isScheduleActive ? 'not-allowed' : 'pointer' }}
              onClick={() => {
                if (!isScheduleActive && onDirectConfirmChefOrder) {
                  onDirectConfirmChefOrder(selectedProg);
                }
              }}
            >
              <CheckCircle size={16} />
              <span>Confirm Order ({selectedProg.finalPriceMMK.toLocaleString()} MMK)</span>
            </button>
          )}

          <button
            className="btn-primary"
            disabled={isScheduleActive}
            style={{ opacity: isScheduleActive ? 0.5 : 1, cursor: isScheduleActive ? 'not-allowed' : 'pointer' }}
            onClick={() => {
              if (!isScheduleActive) onNext();
            }}
          >
            <span>{planType === 'chef_program' ? 'View & Customize Program Schedule' : 'Proceed to Meal Quality Tier'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
