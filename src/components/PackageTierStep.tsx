import React from 'react';
import { PackageTier, UserProfile, ChefProgram } from '../types';
import { PACKAGE_CONFIGS } from '../data/packages';
import { Sparkles, ArrowRight, ArrowLeft, Check, AlertCircle, Cpu, ChefHat, CheckCircle } from 'lucide-react';

interface PackageTierStepProps {
  selectedTier: PackageTier;
  onSelectTier: (tier: PackageTier) => void;
  userProfile: UserProfile;
  planType?: 'custom' | 'chef_program';
  selectedProgram?: ChefProgram;
  onGeneratePlan: () => void;
  onConfirmOrderNow?: () => void;
  onPreviewTierDishes?: (tier: PackageTier) => void;
  isGenerating: boolean;
  onPrev: () => void;
}

export const PackageTierStep: React.FC<PackageTierStepProps> = ({
  selectedTier,
  onSelectTier,
  userProfile,
  planType = 'custom',
  selectedProgram,
  onGeneratePlan,
  onConfirmOrderNow,
  onPreviewTierDishes,
  isGenerating,
  onPrev
}) => {
  const tiers: PackageTier[] = ['basic', 'standard', 'premium'];

  return (
    <div className="package-tier-step">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Choose Meal Quality & Daily Ingredient Budget</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          <strong>Core Concept:</strong> Exactly the same nutrition target ({userProfile.calorieTarget} kcal / {userProfile.proteinGrams}g Protein), with different ingredient premium grades and culinary variety.
        </p>
      </div>

      {/* Chef Program Announcement if enrolled via Chef Recommendation */}
      {planType === 'chef_program' && selectedProgram && (
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
                Chef Recommendation Selected
              </div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>
                {selectedProgram.programName} by {selectedProgram.chefName}
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>
                {selectedProgram.durationDays} Days • {selectedProgram.packageTier.toUpperCase()} Quality • {selectedProgram.discountPercentage}% Member Discount Applied
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#94a3b8' }}>
                {selectedProgram.originalPriceMMK.toLocaleString()} MMK
              </span>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#b45309' }}>
                {selectedProgram.finalPriceMMK.toLocaleString()} MMK
              </div>
            </div>

            {onConfirmOrderNow && (
              <button
                className="btn-gold"
                onClick={onConfirmOrderNow}
                style={{ padding: '0.65rem 1.25rem' }}
              >
                <CheckCircle size={16} />
                <span>Confirm Order Now</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {tiers.map((tierKey) => {
          const config = PACKAGE_CONFIGS[tierKey];
          const isSelected = selectedTier === tierKey;

          return (
            <div
              key={tierKey}
              className={`tier-card tier-${tierKey} ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectTier(tierKey)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`tier-badge badge-tier${tierKey === 'basic' ? '1' : tierKey === 'standard' ? '2' : '3'}`}>
                  {config.name}
                </span>
                {isSelected && (
                  <div style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </div>

              <div className="tier-price-box">
                <div className="tier-price-amount">{config.targetCostRangeStr}</div>
                <div className="tier-price-unit">Target ingredient cost per day</div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', minHeight: '48px' }}>
                {config.description}
              </p>

              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
                  Featured Ingredients:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {config.highlightIngredients.map((ing, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        color: '#334155'
                      }}
                    >
                      {ing}
                    </span>
                  ))}
                </div>

                {onPreviewTierDishes && (
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{
                      width: '100%',
                      marginTop: '0.85rem',
                      padding: '0.45rem 0.8rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      borderColor: '#cbd5e1',
                      background: '#ffffff',
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewTierDishes(tierKey);
                    }}
                  >
                    Preview Meals
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {false && (<>
      {/* Algorithm Pipeline Preview Box */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0f172a', fontWeight: 700, fontSize: '0.95rem' }}>
          <Cpu size={18} color="var(--primary)" />
          <span>NutriChef Multi-Stage Decision Pipeline:</span>
        </div>
        <div className="grid-4" style={{ fontSize: '0.82rem', gap: '0.75rem' }}>
          <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: '#15803d', marginBottom: '0.2rem' }}>1. Check Nutrition Target</div>
            <div style={{ color: '#64748b' }}>Strict $\pm 5\%$ tolerance for {userProfile.calorieTarget} kcal & {userProfile.proteinGrams}g Protein.</div>
          </div>
          <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '0.2rem' }}>2. Check Package Budget</div>
            <div style={{ color: '#64748b' }}>Enforce {PACKAGE_CONFIGS[selectedTier].targetCostRangeStr} & Tier-3 rules.</div>
          </div>
          <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: '#d97706', marginBottom: '0.2rem' }}>3. Check Meal History</div>
            <div style={{ color: '#64748b' }}>Zero repetition across 5-day rolling lookback windows.</div>
          </div>
          <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, color: '#7c3aed', marginBottom: '0.2rem' }}>4. MongoDB Plan Record</div>
            <div style={{ color: '#64748b' }}>Save generated schedule and update customer meal logs.</div>
          </div>
        </div>
      </div>
      </>)}

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-secondary" onClick={onPrev}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          className="btn-gold"
          style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem' }}
          onClick={onGeneratePlan}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Sparkles size={20} className="animate-spin" />
              <span>Running Solver & Checking History...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>{planType === 'chef_program' ? 'Generate & Preview Chef Program Plan' : 'Generate My Plan'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
