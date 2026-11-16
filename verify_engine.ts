import { generateMealPlan } from './src/engine/planner.ts';

console.log('=== VERIFYING STRICT ZERO REPETITION FOR 5 CONSECUTIVE DAYS ===\n');

(['basic', 'standard', 'premium'] as const).forEach(tier => {
  console.log(`================================================================`);
  console.log(`Testing Tier: ${tier.toUpperCase()} (10-Day Plan)`);
  console.log(`================================================================`);

  const plan = generateMealPlan({
    customerId: `cust-5day-${tier}`,
    durationDays: 10,
    targetCalories: 2000,
    targetProteinG: 150,
    targetCarbG: 163,
    targetFatG: 83,
    packageTier: tier,
    mealHistory: []
  });

  const allMeals: { day: number; slot: string; id: string; name: string }[] = [];
  plan.days.forEach(d => {
    allMeals.push({ day: d.dayNumber, slot: 'B', id: d.breakfast.id, name: d.breakfast.name });
    allMeals.push({ day: d.dayNumber, slot: 'L', id: d.lunch.id, name: d.lunch.name });
    allMeals.push({ day: d.dayNumber, slot: 'D', id: d.dinner.id, name: d.dinner.name });
  });

  let violations = 0;

  for (let i = 0; i < allMeals.length; i++) {
    const current = allMeals[i];
    // Look back up to 15 meals (5 days)
    const windowStart = Math.max(0, i - 15);
    for (let j = windowStart; j < i; j++) {
      const prev = allMeals[j];
      const isSameId = current.id === prev.id;
      const isSameName = current.name.trim().toLowerCase() === prev.name.trim().toLowerCase();
      if (isSameId || isSameName) {
        console.log(`❌ VIOLATION: [${current.name}] on Day ${current.day} (${current.slot}) repeats Day ${prev.day} (${prev.slot}) - ${i - j} meals ago!`);
        violations++;
      }
    }
  }

  plan.days.slice(0, 5).forEach(d => {
    console.log(`Day ${d.dayNumber} [${d.totalCostMMK} MMK]: B:[${d.breakfast.name}] | L:[${d.lunch.name}] | D:[${d.dinner.name}]`);
  });

  if (violations === 0) {
    console.log(`✅ PERFECT: 0 repetitions across all 5-day windows in ${tier.toUpperCase()}!\n`);
  } else {
    console.log(`❌ Failed with ${violations} violations in ${tier.toUpperCase()}!\n`);
  }
});
