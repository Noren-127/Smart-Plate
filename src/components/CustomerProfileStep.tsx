import React, { useState } from 'react';
import { UserProfile, Goal, ActivityLevel, DietPreference } from '../types';
import { calculateTargetCalories, getMacrosFromDiet, rebalanceCarbs, calculateBMI, calculateBMR, calculateTDEE } from '../engine/nutrition';
import { isProfileComplete } from '../store/storage';
import { Sparkles, ShieldCheck, ArrowRight, Activity, Flame, Scale, HeartPulse, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CustomerProfileStepProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  onNext: () => void;
  showBiometrics?: boolean;
  showMacroTargets?: boolean;
}

export const CustomerProfileStep: React.FC<CustomerProfileStepProps> = ({
  profile,
  onChange,
  onNext,
  showBiometrics = true,
  showMacroTargets = true
}) => {
  const [validationError, setValidationError] = useState<string>('');

  const bmiData = calculateBMI(profile.weightKg || 0, profile.heightCm || 0);
  const bmrValue = calculateBMR(profile.gender, profile.weightKg || 0, profile.heightCm || 0, profile.age || 0);
  const tdeeValue = calculateTDEE(profile.gender, profile.weightKg || 0, profile.heightCm || 0, profile.age || 0, profile.activityLevel);

  // Recalculate baseline recommendations whenever biometrics or goals change
  const handleRecalculateBiometrics = (
    height: number,
    weight: number,
    age: number,
    gender: 'male' | 'female',
    activity: ActivityLevel,
    goal: Goal,
    diet: DietPreference
  ) => {
    setValidationError('');
    const recommendedKcal = (height > 0 && weight > 0 && age > 0)
      ? calculateTargetCalories(gender, weight, height, age, activity, goal)
      : (profile.calorieTarget || 2000);
    const macros = getMacrosFromDiet(recommendedKcal, diet);

    onChange({
      ...profile,
      heightCm: height,
      weightKg: weight,
      age,
      gender,
      activityLevel: activity,
      goal,
      calorieTarget: recommendedKcal,
      proteinGrams: macros.proteinGrams,
      carbGrams: macros.carbGrams,
      fatGrams: macros.fatGrams,
      dietPreference: diet
    });
  };

  // When user manually adjusts Protein or Fat, automatically rebalance Carbs to preserve kcal
  const handleProteinChange = (newProtein: number) => {
    const p = Math.max(20, Math.min(300, newProtein));
    const newCarbs = rebalanceCarbs(profile.calorieTarget || 2000, p, profile.fatGrams);
    onChange({
      ...profile,
      proteinGrams: p,
      carbGrams: newCarbs
    });
  };

  const handleFatChange = (newFat: number) => {
    const f = Math.max(10, Math.min(180, newFat));
    const newCarbs = rebalanceCarbs(profile.calorieTarget || 2000, profile.proteinGrams, f);
    onChange({
      ...profile,
      fatGrams: f,
      carbGrams: newCarbs
    });
  };

  const handleCaloriesChange = (newKcal: number) => {
    const k = Math.max(1200, Math.min(4500, newKcal));
    const macros = getMacrosFromDiet(k, profile.dietPreference);
    onChange({
      ...profile,
      calorieTarget: k,
      proteinGrams: macros.proteinGrams,
      carbGrams: macros.carbGrams,
      fatGrams: macros.fatGrams
    });
  };

  const handleSaveAndProceed = () => {
    if (!profile.name || !profile.name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!profile.heightCm || profile.heightCm < 100 || profile.heightCm > 250) {
      setValidationError('Please enter a valid height in cm (e.g. 175).');
      return;
    }
    if (!profile.weightKg || profile.weightKg < 30 || profile.weightKg > 250) {
      setValidationError('Please enter a valid weight in kg (e.g. 70).');
      return;
    }
    if (!profile.age || profile.age < 12 || profile.age > 120) {
      setValidationError('Please enter a valid age in years (e.g. 28).');
      return;
    }
    if (!profile.calorieTarget || profile.calorieTarget < 1000) {
      setValidationError('Please enter or calculate your daily calorie target.');
      return;
    }
    setValidationError('');
    onNext();
  };

  // Calculate actual sum of macros
  const calculatedSumKcal = (profile.proteinGrams * 4) + (profile.carbGrams * 4) + (profile.fatGrams * 9);
  const isConsistent = Math.abs(calculatedSumKcal - (profile.calorieTarget || 0)) <= 15;
  const isConfigured = profile.heightCm > 0 && profile.weightKg > 0 && profile.age > 0;

  return (
    <div className="profile-step-container">
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '0.25rem' }}>Customer Profile & Nutrition Targets</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
            Fill in your physical biometrics to generate personalized Mifflin-St Jeor macro calories.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', background: '#ecfdf5', color: '#15803d', padding: '0.3rem 0.75rem', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} />
            Mifflin-St Jeor Precision Engine
          </span>
        </div>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          color: '#991b1b',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <AlertCircle size={18} color="#dc2626" />
          <span>{validationError}</span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: showBiometrics && showMacroTargets ? 'repeat(auto-fit, minmax(360px, 1fr))' : '1fr',
        gap: '1.5rem',
        alignItems: 'stretch'
      }}>
        {/* Left Column: Biometrics & Lifestyle */}
        {showBiometrics && (
          <div className="card profile-panel biometrics-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.35rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', color: '#0f172a' }}>
                  <Scale size={20} color="var(--primary)" />
                  1. Biometrics & Lifestyle
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isConfigured ? '#15803d' : '#d97706', background: isConfigured ? '#dcfce7' : '#fef3c7', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                  {isConfigured ? '✓ Configured' : 'Input Required'}
                </span>
              </div>

              <div className="grid-2" style={{ gap: '0.85rem', marginBottom: '0.85rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    Full Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ko Min Thant"
                    value={profile.name || ''}
                    onChange={(e) => {
                      setValidationError('');
                      onChange({ ...profile, name: e.target.value });
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>Gender</label>
                  <select
                    className="form-select"
                    value={profile.gender}
                    onChange={(e) =>
                      handleRecalculateBiometrics(
                        profile.heightCm,
                        profile.weightKg,
                        profile.age,
                        e.target.value as 'male' | 'female',
                        profile.activityLevel,
                        profile.goal,
                        profile.dietPreference
                      )
                    }
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid-3" style={{ gap: '0.65rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    Height (cm) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 175"
                    value={profile.heightCm || ''}
                    onChange={(e) =>
                      handleRecalculateBiometrics(
                        e.target.value === '' ? 0 : Number(e.target.value),
                        profile.weightKg,
                        profile.age,
                        profile.gender,
                        profile.activityLevel,
                        profile.goal,
                        profile.dietPreference
                      )
                    }
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    Weight (kg) <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 70"
                    value={profile.weightKg || ''}
                    onChange={(e) =>
                      handleRecalculateBiometrics(
                        profile.heightCm,
                        e.target.value === '' ? 0 : Number(e.target.value),
                        profile.age,
                        profile.gender,
                        profile.activityLevel,
                        profile.goal,
                        profile.dietPreference
                      )
                    }
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                    Age <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 28"
                    value={profile.age || ''}
                    onChange={(e) =>
                      handleRecalculateBiometrics(
                        profile.heightCm,
                        profile.weightKg,
                        e.target.value === '' ? 0 : Number(e.target.value),
                        profile.gender,
                        profile.activityLevel,
                        profile.goal,
                        profile.dietPreference
                      )
                    }
                  />
                </div>
              </div>

              {/* Live Health Indices Badge Bar (BMI, BMR, TDEE) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                background: '#f8fafc',
                padding: '0.65rem',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'block' }}>BMI Score</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isConfigured ? bmiData.color : '#94a3b8' }}>
                    {isConfigured ? bmiData.bmi : '--'} <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem', borderRadius: '4px', background: isConfigured ? `${bmiData.color}22` : '#f1f5f9', color: isConfigured ? bmiData.color : '#64748b', display: 'inline-block' }}>{isConfigured ? bmiData.category : 'Awaiting Data'}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Basal BMR</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isConfigured ? '#0f172a' : '#94a3b8' }}>
                    {isConfigured ? `${bmrValue} kcal` : '-- kcal'}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'block' }}>Active TDEE</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isConfigured ? 'var(--primary)' : '#94a3b8' }}>
                    {isConfigured ? `${tdeeValue} kcal` : '-- kcal'}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>Activity Level</label>
                <select
                  className="form-select"
                  value={profile.activityLevel}
                  onChange={(e) =>
                    handleRecalculateBiometrics(
                      profile.heightCm,
                      profile.weightKg,
                      profile.age,
                      profile.gender,
                      e.target.value as ActivityLevel,
                      profile.goal,
                      profile.dietPreference
                    )
                  }
                >
                  <option value="sedentary">Sedentary (Desk job, minimal exercise - 1.2x)</option>
                  <option value="light">Light Activity (1-3 days light workout/walk - 1.375x)</option>
                  <option value="moderate">Moderate Activity (3-5 days workout / gym - 1.55x)</option>
                  <option value="active">Active (6-7 days sports / high training - 1.725x)</option>
                  <option value="very_active">Very Active (Physical job + athlete training - 1.9x)</option>
                </select>
              </div>

              <div className="grid-2" style={{ gap: '0.85rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>Primary Goal</label>
                  <select
                    className="form-select"
                    value={profile.goal}
                    onChange={(e) =>
                      handleRecalculateBiometrics(
                        profile.heightCm,
                        profile.weightKg,
                        profile.age,
                        profile.gender,
                        profile.activityLevel,
                        e.target.value as Goal,
                        profile.dietPreference
                      )
                    }
                  >
                    <option value="lose">Fat Loss (Deficit -500 kcal)</option>
                    <option value="maintain">Maintain Weight (TDEE balance)</option>
                    <option value="gain">Muscle Gain (Surplus +400 kcal)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem', marginBottom: '0.3rem' }}>Dietary Preference</label>
                  <select
                    className="form-select"
                    value={profile.dietPreference}
                    onChange={(e) =>
                      handleRecalculateBiometrics(
                        profile.heightCm,
                        profile.weightKg,
                        profile.age,
                        profile.gender,
                        profile.activityLevel,
                        profile.goal,
                        e.target.value as DietPreference
                      )
                    }
                  >
                    <option value="balanced">Balanced Myanmar (30% P / 40% C / 30% F)</option>
                    <option value="high_protein">High-Protein Athlete (35% P / 35% C / 30% F)</option>
                    <option value="keto">Keto Low-Carb (25% P / 5% C / 70% F)</option>
                    <option value="low_carb">Low-Carb Clean (35% P / 20% C / 45% F)</option>
                    <option value="halal">Halal Verified (No Pork)</option>
                    <option value="buddhist_veg">Buddhist Vegetarian (Tofu & Eggs)</option>
                    <option value="seafood_heavy">Seafood Heavy (Salmon & Prawns)</option>
                    <option value="pescatarian">Pescatarian (Fish & Seafood)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Nutrition Targets & Macro Consistency */}
        {showMacroTargets && (
          <div className="card profile-panel macro-panel" style={{ background: '#fffaf3', border: '1px solid #fed7aa', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.35rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', color: '#0f172a' }}>
                  <Flame size={20} color="#ea580c" />
                  2. Calorie & Macro Target Consistency
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                  kcal = 4P + 4C + 9F
                </span>
              </div>

              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '1rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Daily Caloric Target</span>
                    <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1.1 }}>
                      {profile.calorieTarget.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>kcal / day</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '0.2rem' }}>Manual Adjust</label>
                    <input
                      type="number"
                      style={{ width: '105px', textAlign: 'right', fontWeight: 700, padding: '0.35rem 0.5rem', fontSize: '0.9rem' }}
                      className="form-input"
                      value={profile.calorieTarget}
                      step={50}
                      onChange={(e) => handleCaloriesChange(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Macro Distribution Visual Progress Bar */}
                <div style={{ marginBottom: '0.65rem' }}>
                  <div style={{ height: '8px', width: '100%', borderRadius: '4px', overflow: 'hidden', display: 'flex', background: '#e2e8f0' }}>
                    <div style={{ width: `${Math.round((profile.proteinGrams * 4 / profile.calorieTarget) * 100)}%`, background: '#dc2626' }} title="Protein" />
                    <div style={{ width: `${Math.round((profile.carbGrams * 4 / profile.calorieTarget) * 100)}%`, background: '#0284c7' }} title="Carbohydrates" />
                    <div style={{ width: `${Math.round((profile.fatGrams * 9 / profile.calorieTarget) * 100)}%`, background: '#d97706' }} title="Fats" />
                  </div>
                </div>

                {/* Consistency Equation Indicator */}
                <div style={{
                  background: isConsistent ? '#ecfdf5' : '#fef2f2',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: `1px solid ${isConsistent ? '#a7f3d0' : '#fecaca'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isConsistent ? '#047857' : '#b91c1c', fontWeight: 700 }}>
                    <ShieldCheck size={15} />
                    <span>Exact Macro Balance:</span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                    {profile.calorieTarget} kcal = {profile.proteinGrams}g P + {profile.carbGrams}g C + {profile.fatGrams}g F
                  </div>
                </div>
              </div>

              {/* Macro Breakdown Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 700, color: '#991b1b' }}>Protein Target ({profile.proteinGrams}g = {profile.proteinGrams * 4} kcal)</span>
                    <span style={{ fontWeight: 700, color: '#dc2626' }}>{Math.round((profile.proteinGrams * 4 / profile.calorieTarget) * 100)}% of kcal</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="250"
                    value={profile.proteinGrams}
                    onChange={(e) => handleProteinChange(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#dc2626' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 700, color: '#0369a1' }}>Carbohydrates Target ({profile.carbGrams}g = {profile.carbGrams * 4} kcal)</span>
                    <span style={{ fontWeight: 700, color: '#0284c7' }}>{Math.round((profile.carbGrams * 4 / profile.calorieTarget) * 100)}% of kcal</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="400"
                    value={profile.carbGrams}
                    disabled
                    style={{ width: '100%', accentColor: '#0284c7', opacity: 0.8 }}
                    title="Carbohydrates auto-balance to guarantee calorie consistency"
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>* Auto-balances dynamically to preserve caloric consistency</span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 700, color: '#854d0e' }}>Fats Target ({profile.fatGrams}g = {profile.fatGrams * 9} kcal)</span>
                    <span style={{ fontWeight: 700, color: '#d97706' }}>{Math.round((profile.fatGrams * 9 / profile.calorieTarget) * 100)}% of kcal</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="150"
                    value={profile.fatGrams}
                    onChange={(e) => handleFatChange(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#d97706' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: RELIGIOUS RESTRICTIONS, ALLERGIES & CUSTOM INGREDIENT EXCLUSIONS */}
      <div className="card" style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '1.5rem', marginTop: '1.5rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.4rem', borderRadius: '8px' }}>
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#0f172a' }}>
                3. Religious Restrictions, Allergies & Disliked Ingredients
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.3rem 0.7rem',
              borderRadius: '8px',
              background: ((profile.religiousRestrictions?.length || 0) + (profile.allergies?.length || 0) + (profile.excludedIngredients?.length || 0)) > 0 ? '#fef2f2' : '#f1f5f9',
              color: ((profile.religiousRestrictions?.length || 0) + (profile.allergies?.length || 0) + (profile.excludedIngredients?.length || 0)) > 0 ? '#b91c1c' : '#64748b',
              border: `1px solid ${((profile.religiousRestrictions?.length || 0) + (profile.allergies?.length || 0) + (profile.excludedIngredients?.length || 0)) > 0 ? '#fca5a5' : '#e2e8f0'}`
            }}>
              {((profile.religiousRestrictions?.length || 0) + (profile.allergies?.length || 0) + (profile.excludedIngredients?.length || 0))} Active Exclusions
            </span>
          </div>
        </div>

        <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.25rem' }}>
          {/* 1. Religious & Faith-Based Restrictions */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Religious & Faith Guidelines
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { id: 'halal_no_pork', label: 'Halal (Strict No Pork, Bacon, Ham, Lard)', desc: 'Zero pork products and derivatives' },
                { id: 'hindu_no_beef', label: 'Hindu (Strict No Beef, Wagyu, Sirloin)', desc: 'Zero beef products across all meal slots' },
                { id: 'buddhist_vegetarian', label: 'Buddhist Sabbath (No Meat/Fish - Tofu & Plants)', desc: 'Pure vegetarian meal combinations' },
                { id: 'kosher_no_shellfish', label: 'Kosher (No Shellfish / Crustaceans)', desc: 'Excludes prawns, squid, crab, and scallops' }
              ].map(rel => {
                const isChecked = (profile.religiousRestrictions || []).includes(rel.id);
                return (
                  <label
                    key={rel.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      background: isChecked ? '#eff6ff' : '#ffffff',
                      border: `1.5px solid ${isChecked ? '#3b82f6' : '#e2e8f0'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        const current = profile.religiousRestrictions || [];
                        const updated = isChecked
                          ? current.filter(x => x !== rel.id)
                          : [...current, rel.id];
                        onChange({ ...profile, religiousRestrictions: updated });
                      }}
                      style={{ marginTop: '0.2rem', accentColor: '#2563eb' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isChecked ? '#1d4ed8' : '#0f172a' }}>
                        {rel.label}
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#64748b' }}>{rel.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. Common Food Allergens & Intolerances */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              Food Allergens & Intolerances
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
              {[
                { id: 'peanuts', label: 'Peanuts & Nuts', hint: 'Groundnut, cashews, almonds' },
                { id: 'shellfish', label: 'Shellfish & Prawns', hint: 'Prawns, squid, crab' },
                { id: 'dairy', label: 'Dairy & Lactose', hint: 'Milk, cheese, butter' },
                { id: 'gluten', label: 'Gluten & Wheat', hint: 'Wheat noodles, bread' },
                { id: 'eggs', label: 'Eggs & Quail Eggs', hint: 'Farm fresh chicken/quail eggs' },
                { id: 'fish', label: 'Fish & Seafood', hint: 'Seabass, salmon, pomfret' },
                { id: 'alliums_garlic_onion', label: 'Garlic & Onion', hint: 'Strict allium-free monk diet' }
              ].map(allergy => {
                const isChecked = (profile.allergies || []).includes(allergy.id);
                return (
                  <button
                    type="button"
                    key={allergy.id}
                    onClick={() => {
                      const current = profile.allergies || [];
                      const updated = isChecked
                        ? current.filter(x => x !== allergy.id)
                        : [...current, allergy.id];
                      onChange({ ...profile, allergies: updated });
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '0.55rem 0.65rem',
                      borderRadius: '8px',
                      background: isChecked ? '#fee2e2' : '#ffffff',
                      border: `1.5px solid ${isChecked ? '#ef4444' : '#e2e8f0'}`,
                      color: isChecked ? '#991b1b' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{allergy.label}</div>
                    <div style={{ fontSize: '0.7rem', color: isChecked ? '#b91c1c' : '#64748b' }}>{allergy.hint}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. Custom Disliked / Excluded Ingredients Box */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>
              Custom Disliked / Avoided Foods (e.g. Cilantro, Mushroom, Duck, Bell Pepper, Ginger...)
            </label>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Type any ingredient and press Enter or click Add
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              id="custom-exclude-input"
              placeholder="e.g. Mushroom, Duck, Cilantro, Bitter gourd..."
              className="form-input"
              style={{ fontSize: '0.85rem' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) {
                    const current = profile.excludedIngredients || [];
                    if (!current.some(c => c.toLowerCase() === val.toLowerCase())) {
                      onChange({ ...profile, excludedIngredients: [...current, val] });
                    }
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap' }}
              onClick={() => {
                const el = document.getElementById('custom-exclude-input') as HTMLInputElement;
                if (el && el.value.trim()) {
                  const val = el.value.trim();
                  const current = profile.excludedIngredients || [];
                  if (!current.some(c => c.toLowerCase() === val.toLowerCase())) {
                    onChange({ ...profile, excludedIngredients: [...current, val] });
                  }
                  el.value = '';
                }
              }}
            >
              + Add Exclusion
            </button>
          </div>

          {/* Render Active Custom Exclusion Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', minHeight: '30px' }}>
            {(profile.excludedIngredients || []).length === 0 ? (
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                No custom ingredients excluded.
              </span>
            ) : (
              (profile.excludedIngredients || []).map((item, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#fee2e2',
                    color: '#991b1b',
                    border: '1px solid #fca5a5',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '16px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>🚫 {item}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (profile.excludedIngredients || []).filter((_, i) => i !== idx);
                      onChange({ ...profile, excludedIngredients: updated });
                    }}
                    style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', padding: 0, fontSize: '0.9rem', lineHeight: 1 }}
                    title={`Remove ${item}`}
                  >
                    &times;
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Bottom Action */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={handleSaveAndProceed} style={{ padding: '0.7rem 1.6rem', fontSize: '0.95rem' }}>
            <span>Save Profile & Proceed to Meal Planner</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
