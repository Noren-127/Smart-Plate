import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  CustomerMealPlan,
  MealHistoryItem,
  ChefProgram,
  PackageTier,
  DishTier,
  OrderRecord
} from './types';
import {
  loadUserProfile,
  saveUserProfile,
  loadMealPlans,
  saveMealPlans,
  loadMealHistory,
  saveMealHistory,
  loadChefPrograms,
  saveChefPrograms,
  loadOrders,
  saveOrders,
  INITIAL_CUSTOMER_USER,
  INITIAL_CHEF_USER,
  isProfileComplete
} from './store/storage';
import { generateMealPlan, swapDayMeal } from './engine/planner';
import { Navbar } from './components/Navbar';
import { Stepper } from './components/Stepper';
import { CustomerProfileStep } from './components/CustomerProfileStep';
import { PlanSelectionStep } from './components/PlanSelectionStep';
import { PackageTierStep } from './components/PackageTierStep';
import { MealPlanDisplay } from './components/MealPlanDisplay';
import { MealHistoryView } from './components/MealHistoryView';
import { ChefStudio } from './components/ChefStudio';
import { DishesCatalogView } from './components/DishesCatalogView';
import { MongoDatabaseViewer } from './components/MongoDatabaseViewer';
import { OrderCheckoutModal } from './components/OrderCheckoutModal';
import { AuthScreen } from './components/AuthScreen';
import { HomePage } from './components/HomePage';

const syncMealPlanToMongo = (plan: CustomerMealPlan) => {
  return fetch('http://localhost:3001/api/meal-plans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(plan) })
    .then(response => { if (!response.ok) throw new Error(`Meal plan sync failed (${response.status})`); return response.json(); })
    .catch(error => { console.error('Meal plan MongoDB sync failed:', error); return null; });
};

export function App() {
  // Navigation & Role State
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile);
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('nutrichef_auth')));
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'customer_plan' | 'history' | 'profile' | 'chef_studio' | 'dishes_catalog'>('customer_plan');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState<number>(1);
  const [catalogTierFilter, setCatalogTierFilter] = useState<DishTier | 'all'>('all');

  // Plan Configuration State
  const [planType, setPlanType] = useState<'custom' | 'chef_program'>('custom');
  const [durationDays, setDurationDays] = useState<7 | 10 | 30>(7);
  const [selectedTier, setSelectedTier] = useState<PackageTier>('standard');
  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Data Store State
  const [mealPlans, setMealPlans] = useState<CustomerMealPlan[]>(loadMealPlans);
  const [activePlan, setActivePlan] = useState<CustomerMealPlan | null>(() => {
    try {
      const cached = localStorage.getItem('nutrichef_current_schedule');
      if (cached) return JSON.parse(cached) as CustomerMealPlan;
    } catch (error) {
      console.warn('Unable to restore cached meal schedule', error);
    }
    return loadMealPlans()[0] || null;
  });
  const [mealHistory, setMealHistory] = useState<MealHistoryItem[]>(loadMealHistory);
  const [chefPrograms, setChefPrograms] = useState<ChefProgram[]>(loadChefPrograms);

  useEffect(() => {
    if (!userProfile.id) return;
    // Migrate any plans created before MongoDB sync was enabled.
    mealPlans.filter(plan => plan.customerId === userProfile.id).forEach(syncMealPlanToMongo);
    fetch('http://localhost:3001/api/meal-plans')
      .then(response => response.ok ? response.json() : [])
      .then((remotePlans: CustomerMealPlan[]) => {
        if (!remotePlans.length) return;
        const merged = [...remotePlans, ...mealPlans.filter(local => !remotePlans.some(remote => remote.id === local.id))];
        setMealPlans(merged);
        setActivePlan(current => current || merged[0]);
        saveMealPlans(merged);
      }).catch(() => undefined);
  }, [userProfile.id]);

  // Restore chef programs from MongoDB so published programs survive refreshes.
  useEffect(() => {
    fetch('http://localhost:3001/api/chef-programs')
      .then(response => response.ok ? response.json() : [])
      .then((remotePrograms: ChefProgram[]) => {
        if (!remotePrograms.length) return;
        setChefPrograms(current => {
          const merged = [
            ...remotePrograms,
            ...current.filter(local => !remotePrograms.some(remote => remote.id === local.id))
          ];
          saveChefPrograms(merged);
          return merged;
        });
      })
      .catch(() => undefined);
  }, []);

  // One-time cleanup of legacy duplicate schedules/history created during development.
  useEffect(() => {
    if (localStorage.getItem('nutrichef_legacy_cleanup_v2') === 'done') return;
    localStorage.removeItem('nutrichef_meal_plans');
    localStorage.removeItem('nutrichef_meal_history');
    localStorage.removeItem('nutrichef_current_schedule');
    setMealPlans([]);
    setMealHistory([]);
    setActivePlan(null);
    localStorage.setItem('nutrichef_legacy_cleanup_v2', 'done');
  }, []);

  // Repair older chef schedules that were saved with the custom-plan date rule.
  useEffect(() => {
    const repaired = mealPlans.map(plan => {
      if (plan.planType !== 'chef_program' || !plan.chefProgramId) return plan;
      const program = chefPrograms.find(item => item.id === plan.chefProgramId);
      if (!program) return plan;
      const end = new Date(`${program.startDate}T00:00:00`);
      end.setDate(end.getDate() + plan.durationDays - 1);
      const endDate = end.toISOString().slice(0, 10);
      if (plan.startDate === program.startDate && plan.endDate === endDate && plan.chefProgramName === program.programName) return plan;
      return { ...plan, chefProgramName: program.programName, startDate: program.startDate, endDate };
    });
    if (repaired.some((plan, index) => plan !== mealPlans[index])) {
      setMealPlans(repaired);
      saveMealPlans(repaired);
    }
  }, [chefPrograms]);

  // Listen for MongoDB direct synchronization events
  useEffect(() => {
    const handleMongoSync = () => {
      setUserProfile(loadUserProfile());
      setMealPlans(loadMealPlans());
      setMealHistory(loadMealHistory());
      setChefPrograms(loadChefPrograms());
    };
    window.addEventListener('nutrichef_mongo_synced', handleMongoSync);
    return () => window.removeEventListener('nutrichef_mongo_synced', handleMongoSync);
  }, []);

  const [isMongoModalOpen, setIsMongoModalOpen] = useState<boolean>(false);

  // Direct Checkout State for Chef Recommendations
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [checkoutProgram, setCheckoutProgram] = useState<ChefProgram | undefined>(undefined);

  // Save profile changes
  const handleProfileChange = (updated: UserProfile) => {
    setUserProfile(updated);
    saveUserProfile(updated);
    fetch(`http://localhost:3001/api/users/${encodeURIComponent(updated.id)}/profile`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated)
    }).catch(() => undefined);
  };

  // Sign Out / Switch Account
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setShowAuth(false);
    localStorage.removeItem('nutrichef_auth');
  };

  // Program selection from Step 2
  const handleSelectProgram = (prog: ChefProgram) => {
    setSelectedProgramId(prog.id);
    setSelectedTier(prog.packageTier);
    setDurationDays(prog.durationDays);
    setPlanType('chef_program');
  };

  // Direct instant order trigger for Chef Recommendation
  const handleDirectChefOrder = (prog: ChefProgram) => {
    handleSelectProgram(prog);
    setCheckoutProgram(prog);
    setIsCheckoutModalOpen(true);
  };

  // Step 4: Run Solver & Generate Plan
  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const targetProgram = planType === 'chef_program' ? chefPrograms.find(p => p.id === selectedProgramId) : undefined;
      const planDuration = targetProgram?.durationDays || durationDays;

      // For Custom Plan: start tomorrow
      // For Chef Program: start on chef's published startDate
      const start = targetProgram?.startDate ? new Date(`${targetProgram.startDate}T00:00:00`) : new Date();
      if (!targetProgram?.startDate) {
        start.setDate(start.getDate() + 1); // Custom Plan starts tomorrow!
      }
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + planDuration - 1);

      const generated = generateMealPlan({
        customerId: userProfile.id,
        durationDays: planDuration,
        targetCalories: userProfile.calorieTarget,
        targetProteinG: userProfile.proteinGrams,
        targetCarbG: userProfile.carbGrams,
        targetFatG: userProfile.fatGrams,
        packageTier: targetProgram?.packageTier || selectedTier,
        dietPreference: userProfile.dietPreference,
        allergies: userProfile.allergies,
        religiousRestrictions: userProfile.religiousRestrictions,
        excludedIngredients: userProfile.excludedIngredients,
        mealHistory,
        planType,
        chefProgramId: targetProgram?.id
      });

      const isDeliveryAllowed = targetProgram ? (targetProgram.deliveryAllowed ?? false) : true;
      const isReleased = targetProgram ? (targetProgram.mealsReleased ?? false) : true;

      const scheduledPlan: CustomerMealPlan = {
        ...generated,
        displayName: targetProgram?.programName || `NutriChef Personalized Plan (${planDuration} Days)`,
        chefProgramName: targetProgram?.programName,
        deliveryAllowed: isDeliveryAllowed,
        mealPlanReleased: isReleased,
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10)
      };

      setActivePlan(scheduledPlan);

      setIsGenerating(false);
      setCurrentStep(3);
      setMaxAccessibleStep(3);
    }, 600);
  };

  // Single Meal Swap
  const handleSwapMeal = (dayNumber: number, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    if (!activePlan) return;

    const dayIndex = activePlan.days.findIndex(d => d.dayNumber === dayNumber);
    if (dayIndex === -1) return;

    const currentDay = activePlan.days[dayIndex];
    const updatedDay = swapDayMeal(
      currentDay,
      mealType,
      activePlan.packageTier,
      activePlan.targetCalories,
      mealHistory,
      {
        diet: userProfile.dietPreference,
        allergies: userProfile.allergies,
        religiousRestrictions: userProfile.religiousRestrictions,
        excludedIngredients: userProfile.excludedIngredients
      }
    );

    const newDays = [...activePlan.days];
    newDays[dayIndex] = updatedDay;

    const updatedPlan: CustomerMealPlan = {
      ...activePlan,
      days: newDays,
      totalPlanCostMMK: newDays.reduce((acc, d) => acc + d.totalCostMMK, 0),
      averageDailyCostMMK: Math.round(newDays.reduce((acc, d) => acc + d.totalCostMMK, 0) / newDays.length)
    };

    setActivePlan(updatedPlan);
    const updatedPlans = mealPlans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
    setMealPlans(updatedPlans);
    saveMealPlans(updatedPlans);
  };

  // Save Plan & Append to History
  const handleSaveToHistory = (plan: CustomerMealPlan) => {
    // Persist generated plans as well as confirmed orders so Custom Plans do
    // not exist only in browser storage when the user leaves this screen.
    syncMealPlanToMongo(plan);
    const newHistoryItems: MealHistoryItem[] = [];

    plan.days.forEach(day => {
      const dateLabel = `Day ${day.dayNumber}`;
      newHistoryItems.push(
        {
          id: `hist-${plan.id}-${day.dayNumber}-b`,
          customerId: plan.customerId,
          dishId: day.breakfast.id,
          dishName: day.breakfast.name,
          mealType: 'breakfast',
          date: dateLabel,
          primaryProtein: day.breakfast.primaryProtein,
          primaryCarb: day.breakfast.primaryCarb,
          primaryVeg: day.breakfast.primaryVeg,
          cookingStyle: day.breakfast.cookingStyle,
          tier: day.breakfast.tier
        },
        {
          id: `hist-${plan.id}-${day.dayNumber}-l`,
          customerId: plan.customerId,
          dishId: day.lunch.id,
          dishName: day.lunch.name,
          mealType: 'lunch',
          date: dateLabel,
          primaryProtein: day.lunch.primaryProtein,
          primaryCarb: day.lunch.primaryCarb,
          primaryVeg: day.lunch.primaryVeg,
          cookingStyle: day.lunch.cookingStyle,
          tier: day.lunch.tier
        },
        {
          id: `hist-${plan.id}-${day.dayNumber}-d`,
          customerId: plan.customerId,
          dishId: day.dinner.id,
          dishName: day.dinner.name,
          mealType: 'dinner',
          date: dateLabel,
          primaryProtein: day.dinner.primaryProtein,
          primaryCarb: day.dinner.primaryCarb,
          primaryVeg: day.dinner.primaryVeg,
          cookingStyle: day.dinner.cookingStyle,
          tier: day.dinner.tier
        }
      );
    });

    const updatedHistory = [...newHistoryItems, ...mealHistory];
    setMealHistory(updatedHistory);
    saveMealHistory(updatedHistory);

    // If joining chef program, increment enrolled count
    if (plan.chefProgramId) {
      const updatedPrograms = chefPrograms.map(prog =>
        prog.id === plan.chefProgramId
          ? { ...prog, enrolledCustomers: Math.min(prog.maxCustomers, prog.enrolledCustomers + 1) }
          : prog
      );
      setChefPrograms(updatedPrograms);
      saveChefPrograms(updatedPrograms);
    }
  };

  // Direct Order Checkout Confirmation
  const handleModalOrderConfirm = (orderData: any) => {
    // Ensure the customer exists in the local users collection before associating the order.
    saveUserProfile(userProfile);
    // Generate the plan if not already active
    // A checkout program is explicit; never infer one from a stale selection.
    // This keeps custom-plan orders persisted as planType: "custom".
    // The selected plan type is the source of truth. Never let a stale chef
    // selection change a Custom Plan into a chef_program during checkout.
    const targetProgram = planType === 'chef_program' ? checkoutProgram : undefined;
    const generated = generateMealPlan({
      customerId: userProfile.id,
      durationDays: targetProgram?.durationDays || durationDays,
      targetCalories: userProfile.calorieTarget,
      targetProteinG: userProfile.proteinGrams,
      targetCarbG: userProfile.carbGrams,
      targetFatG: userProfile.fatGrams,
      packageTier: targetProgram?.packageTier || selectedTier,
      dietPreference: userProfile.dietPreference,
      allergies: userProfile.allergies,
      religiousRestrictions: userProfile.religiousRestrictions,
      excludedIngredients: userProfile.excludedIngredients,
      mealHistory,
      planType: targetProgram ? 'chef_program' : 'custom',
      chefProgramId: targetProgram?.id
    });

    // Chef programs use the chef's published start date; custom plans begin tomorrow.
    const start = targetProgram?.startDate ? new Date(`${targetProgram.startDate}T00:00:00`) : new Date();
    if (!targetProgram?.startDate) start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + generated.durationDays - 1);
    const scheduledPlan = {
      ...generated,
      // Persist the selected flow explicitly; this prevents a custom plan
      // from being mistaken for a chef program during reload.
      planType: targetProgram ? 'chef_program' as const : 'custom' as const,
      displayName: targetProgram?.programName || `NutriChef Personalized Plan (${generated.durationDays} Days)`,
      chefProgramName: targetProgram?.programName,
      deliveryAllowed: targetProgram ? (targetProgram.deliveryAllowed ?? false) : true,
      mealPlanReleased: targetProgram ? (targetProgram.mealsReleased ?? false) : true,
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10)
    };
    setActivePlan(scheduledPlan);
    const updatedPlans = [scheduledPlan, ...mealPlans];
    setMealPlans(updatedPlans);
    saveMealPlans(updatedPlans);
    // Persist every confirmed plan, including Custom Plans, and surface a
    // failed database write instead of silently relying on localStorage.
    syncMealPlanToMongo(scheduledPlan).then(result => {
      if (!result) window.alert('The meal plan could not be saved to MongoDB. Please try again.');
    });
    localStorage.setItem('nutrichef_current_schedule', JSON.stringify(scheduledPlan));

    const newOrder: OrderRecord = {
      id: `ord-ygn-${Date.now().toString().slice(-6)}`,
      orderNumber: orderData.orderNumber || `NC-YGN-${Date.now().toString().slice(-6)}`,
      customerId: userProfile.id,
      customerName: userProfile.name,
      planId: scheduledPlan.id,
      chefProgramId: targetProgram?.id,
      planDisplayName: scheduledPlan.displayName || scheduledPlan.chefProgramName || `NutriChef Personalized Plan (${scheduledPlan.durationDays} Days)`,
      packageTier: scheduledPlan.packageTier,
      durationDays: scheduledPlan.durationDays,
      dailyCalories: userProfile.calorieTarget,
      dailyProteinG: userProfile.proteinGrams,
      totalAmountMMK: targetProgram ? targetProgram.finalPriceMMK : scheduledPlan.totalPlanCostMMK,
      deliveryTownship: orderData.deliveryTownship || 'Bahan Township',
      deliveryAddress: orderData.deliveryAddress || 'Yangon',
      deliverySlot: orderData.deliverySlot || 'morning',
      contactPhone: orderData.contactPhone || '09-798-123456',
      paymentMethod: orderData.paymentMethod || 'kpay',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'confirmed',
      createdAt: new Date().toISOString(),
      startDate: scheduledPlan.startDate || new Date().toISOString().slice(0, 10),
      notes: orderData.notes
    };
    const currentOrders = loadOrders();
    saveOrders([newOrder as any, ...currentOrders]);

    // If joining a chef program, increment enrolledCustomers count in chef programs!
    if (targetProgram?.id) {
      const updatedPrograms = chefPrograms.map(prog =>
        prog.id === targetProgram.id
          ? { ...prog, enrolledCustomers: Math.min(prog.maxCustomers, prog.enrolledCustomers + 1) }
          : prog
      );
      setChefPrograms(updatedPrograms);
      saveChefPrograms(updatedPrograms);
    }

    setIsCheckoutModalOpen(false);
    setActiveTab('history');
    setCurrentStep(3);
    setMaxAccessibleStep(3);
  };

  // Chef creates program
  const handleCreateProgram = (program: ChefProgram) => {
    const updated = [program, ...chefPrograms];
    setChefPrograms(updated);
    saveChefPrograms(updated);
    fetch('http://localhost:3001/api/chef-programs', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(program)
    }).catch(error => console.error('Chef program MongoDB sync failed:', error));
  };

  // Reset History Logs Only (Safely preserving Custom Dishes, Accounts, Chef Programs & Profiles)
  const handleResetData = () => {
    if (window.confirm('Clear meal history logs? Your custom dishes, chef programs, accounts, and profile settings will be safely preserved.')) {
      setMealHistory([]);
      saveMealHistory([]);
    }
  };

  const handlePreviewTierDishes = (tier: PackageTier | 'basic' | 'standard' | 'premium') => {
    const tierMap: Record<string, DishTier> = {
      basic: 1,
      standard: 2,
      premium: 3
    };
    setCatalogTierFilter(tierMap[tier] || 'all');
    setActiveTab('dishes_catalog');
  };

  const currentChefProg = chefPrograms.find(p => p.id === (activePlan?.chefProgramId || selectedProgramId));
  // Active-plan locking is always scoped to the signed-in customer. Local
  // storage can contain plans from other accounts, but those must never block
  // a newly signed-in user from creating their own plan.
  const activeSchedule = mealPlans.find(p =>
    p.customerId === userProfile.id &&
    p.endDate &&
    !p.cancelledAt &&
    new Date(`${p.endDate}T23:59:59`) >= new Date()
  );

  if (!isAuthenticated && !showAuth) {
    return (
      <HomePage
        onLogin={() => setShowAuth(true)}
        onProceed={() => setShowAuth(true)}
      />
    );
  }
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onAuthenticated={(profile) => {
          setUserProfile(profile);
          saveUserProfile(profile);
          setIsAuthenticated(true);
          setShowAuth(false);
          if (profile.role === 'chef') {
            setActiveTab('chef_studio');
          } else if (!isProfileComplete(profile)) {
            setActiveTab('profile');
          } else {
            setActiveTab('customer_plan');
          }
        }}
        onBackToHome={() => setShowAuth(false)}
      />
    );
  }

  return (
    <div className="app-container">
      <Navbar
        userProfile={userProfile}
        onSignOut={handleSignOut}
        onOpenMongoViewer={() => setIsMongoModalOpen(true)}
        onResetData={handleResetData}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'chef_studio' && userProfile.role !== 'chef') {
            alert('Chef Studio is restricted to verified Chef accounts. Please sign in with a Chef account.');
            return;
          }
          if (userProfile.role === 'customer' && !isProfileComplete(userProfile) && tab !== 'profile') {
            alert('⚠️ Please enter and save your Profile details (Full Name, Height, Weight, Age) before accessing the Meal Planner or other sections.');
            setActiveTab('profile');
            return;
          }
          if (tab === 'dishes_catalog') {
            setCatalogTierFilter('all');
          }
          setActiveTab(tab);
        }}
      />

      <main className="main-content">
        {/* Profile Tab: Dedicated Biometrics & Nutrition Targets Setup */}
        {activeTab === 'profile' && userProfile.role === 'customer' && (
          <CustomerProfileStep
            profile={userProfile}
            onChange={handleProfileChange}
            onNext={() => {
              setActiveTab('customer_plan');
              setCurrentStep(1);
            }}
            showBiometrics={true}
            showMacroTargets={true}
          />
        )}

        {/* TAB 1: Customer Meal Planner Flow (Starts at Plan Type & Days) */}
        {activeTab === 'customer_plan' && (
          <div>
            {/* Quick Profile Summary Bar */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                  👤 {userProfile.name || 'Customer'}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Target: <strong>{userProfile.calorieTarget} kcal/day</strong> ({userProfile.proteinGrams}g P • {userProfile.carbGrams}g C • {userProfile.fatGrams}g F)
                </span>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', fontWeight: 600 }}
                onClick={() => setActiveTab('profile')}
              >
                ✏️ Edit Profile & Targets
              </button>
            </div>

            <Stepper
              currentStep={currentStep}
              onSelectStep={(s) => setCurrentStep(s)}
              maxAccessibleStep={maxAccessibleStep}
            />

            {/* Step 1: Plan Type & Duration Days (Starts Here!) */}
            {currentStep === 1 && (
              <PlanSelectionStep
                planType={planType}
                durationDays={durationDays}
                selectedProgramId={selectedProgramId}
                chefPrograms={chefPrograms}
                onSelectPlanType={(t) => {
                  setPlanType(t);
                  // A custom plan must never inherit a previously selected chef
                  // program when checkout is opened later.
                  if (t === 'custom') setCheckoutProgram(undefined);
                }}
                onSelectDuration={(d) => setDurationDays(d)}
                onSelectProgram={handleSelectProgram}
                onDirectConfirmChefOrder={handleDirectChefOrder}
                onPreviewTierDishes={handlePreviewTierDishes}
                onNext={() => {
                  setCurrentStep(2);
                  setMaxAccessibleStep(Math.max(maxAccessibleStep, 2));
                }}
                onPrev={() => setActiveTab('profile')}
                isScheduleActive={Boolean(activeSchedule)}
                activeScheduleName={activeSchedule?.displayName || activeSchedule?.chefProgramName}
                activeScheduleEnd={activeSchedule?.endDate}
                onViewActiveHistory={() => setActiveTab('history')}
              />
            )}

            {/* Step 2: Meal Quality & Delivery Packaging Tier */}
            {currentStep === 2 && (
              <PackageTierStep
                selectedTier={selectedTier}
                onSelectTier={(t) => setSelectedTier(t)}
                userProfile={userProfile}
                planType={planType}
                selectedProgram={currentChefProg}
                onGeneratePlan={handleGeneratePlan}
                onConfirmOrderNow={() => {
                  // Only chef-program checkout carries a program. Custom plans
                  // must be persisted with planType: "custom".
                  setCheckoutProgram(planType === 'chef_program' ? currentChefProg : undefined);
                  setIsCheckoutModalOpen(true);
                }}
                onPreviewTierDishes={handlePreviewTierDishes}
                isGenerating={isGenerating}
                onPrev={() => setCurrentStep(1)}
              />
            )}

            {/* Step 3: Personalized Generated Schedule & Review */}
            {currentStep === 3 && activePlan && (
              <MealPlanDisplay
                mealPlan={activePlan}
                chefProgram={currentChefProg}
                userProfile={userProfile}
                onSwapMeal={handleSwapMeal}
                onSaveToHistory={handleSaveToHistory}
                onRegenerate={handleGeneratePlan}
                onBackToConfig={() => setCurrentStep(2)}
              />
            )}
          </div>
        )}

        {/* TAB 2: Meal History */}
        {activeTab === 'history' && (
          <MealHistoryView
            history={mealHistory.filter(item => item.customerId === userProfile.id)}
            plans={[...mealPlans.filter(plan => plan.customerId === userProfile.id), ...(activePlan && activePlan.customerId === userProfile.id && activePlan.startDate && !mealPlans.some(p => p.id === activePlan.id) ? [activePlan] : [])]}
            chefPrograms={chefPrograms}
            onRemovePlan={(id) => {
              const targetPlan = mealPlans.find(p => p.id === id);
              if (targetPlan?.chefProgramId) {
                const updatedPrograms = chefPrograms.map(prog =>
                  prog.id === targetPlan.chefProgramId
                    ? { ...prog, enrolledCustomers: Math.max(0, prog.enrolledCustomers - 1) }
                    : prog
                );
                setChefPrograms(updatedPrograms);
                saveChefPrograms(updatedPrograms);
              }
              const updated = mealPlans.map(p => p.id === id ? { ...p, cancelledAt: new Date().toISOString() } : p);
              setMealPlans(updated);
              saveMealPlans(updated);
              const cancelledPlan = updated.find(p => p.id === id);
              if (cancelledPlan) syncMealPlanToMongo(cancelledPlan);

              // Clear active cached schedule from localStorage
              try {
                const currentStr = localStorage.getItem('nutrichef_current_schedule');
                if (currentStr) {
                  const currentObj = JSON.parse(currentStr);
                  if (currentObj.id === id) {
                    localStorage.removeItem('nutrichef_current_schedule');
                  }
                }
              } catch {
                localStorage.removeItem('nutrichef_current_schedule');
              }

              if (activePlan?.id === id) {
                setActivePlan(null);
              }

              // Synchronize order cancellation in orders collection so it persists across refreshes
              const currentOrders = loadOrders();
              const updatedOrders = currentOrders.map(o =>
                (o.planId === id || o.id === id) ? { ...o, orderStatus: 'cancelled' as const } : o
              );
              saveOrders(updatedOrders);
            }}
            onClearHistory={() => {
              setMealHistory([]);
              saveMealHistory([]);
            }}
            onSeedSampleHistory={() => {
              const seeded = loadMealHistory();
              setMealHistory(seeded);
              saveMealHistory(seeded);
            }}
          />
        )}

        {/* TAB 3: Chef Studio */}
        {activeTab === 'chef_studio' && (
          <ChefStudio
            programs={chefPrograms}
            onCreateProgram={handleCreateProgram}
            onReleaseProgram={(programId) => {
              const updated = chefPrograms.map(p =>
                p.id === programId ? { ...p, mealsReleased: true, deliveryAllowed: true } : p
              );
              setChefPrograms(updated);
              saveChefPrograms(updated);

              // Update any member meal plans associated with this chef program
              const updatedPlans = mealPlans.map(plan => {
                if (plan.chefProgramId === programId) {
                  return { ...plan, deliveryAllowed: true, mealPlanReleased: true };
                }
                return plan;
              });
              setMealPlans(updatedPlans);
              saveMealPlans(updatedPlans);

              if (activePlan?.chefProgramId === programId) {
                const updatedActive = { ...activePlan, deliveryAllowed: true, mealPlanReleased: true };
                setActivePlan(updatedActive);
                localStorage.setItem('nutrichef_current_schedule', JSON.stringify(updatedActive));
              }
            }}
            onDeleteProgram={(programId) => {
              const updated = chefPrograms.filter(p => p.id !== programId);
              setChefPrograms(updated);
              saveChefPrograms(updated);
            }}
          />
        )}

        {/* TAB 4: Dishes Catalog & Live Prices */}
        {activeTab === 'dishes_catalog' && (
          <DishesCatalogView
            userProfile={userProfile}
            initialTierFilter={catalogTierFilter}
          />
        )}
      </main>

      {/* Direct Order Checkout Modal for Chef Programs and Custom Plans */}
      <OrderCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        program={checkoutProgram || currentChefProg}
        mealPlan={activePlan}
        userProfile={userProfile}
        onConfirmOrder={handleModalOrderConfirm}
        onViewActiveSchedule={() => { setIsCheckoutModalOpen(false); setActiveTab('history'); }}
        isScheduleActive={Boolean(activeSchedule)}
        activeScheduleName={activeSchedule?.displayName || activeSchedule?.chefProgramName}
        activeScheduleEnd={activeSchedule?.endDate}
      />

      {/* MongoDB Collections Inspector Modal */}
      <MongoDatabaseViewer
        isOpen={isMongoModalOpen}
        onClose={() => setIsMongoModalOpen(false)}
      />

      <footer className="footer">
        <div>
          <strong>SmartPlate</strong> — Intelligent Precision Nutrition & Meal Planning Architecture
        </div>
        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.25rem' }}>
          Customer Nutrition Target &rarr; Tier Budget (Basic / Standard / Premium) &rarr; Variety Penalty Engine &rarr; MongoDB Storage
        </div>
      </footer>
    </div>
  );
}
export default App;
