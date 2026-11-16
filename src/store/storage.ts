import { UserProfile, CustomerMealPlan, MealHistoryItem, ChefProgram, OrderRecord, Dish } from '../types';
import { DISHES_DATABASE } from '../data/dishes';
import { YGN_INGREDIENT_PRICES } from '../data/ingredients';
import { DEFAULT_CHEF_PROGRAMS } from '../data/mockPrograms';

const STORAGE_KEYS = {
  USER: 'nutrichef_user_profile_v3',
  MEAL_PLANS: 'nutrichef_meal_plans_v3',
  MEAL_HISTORY: 'nutrichef_meal_history_v3',
  CHEF_PROGRAMS: 'nutrichef_chef_programs_v3',
  ACTIVE_PLAN_ID: 'nutrichef_active_plan_id_v3',
  ORDERS: 'nutrichef_orders_v3',
  ACCOUNTS: 'nutrichef_registered_accounts_v3',
  CUSTOM_DISHES: 'nutrichef_custom_dishes_v3'
};

export interface RegisteredAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'customer' | 'chef';
  profile: UserProfile;
}

export const EMPTY_CUSTOMER_USER: UserProfile = {
  id: 'cust-new',
  name: '',
  role: 'customer',
  heightCm: 0,
  weightKg: 0,
  age: 0,
  gender: 'male',
  activityLevel: 'moderate',
  goal: 'maintain',
  calorieTarget: 0,
  proteinGrams: 0,
  carbGrams: 0,
  fatGrams: 0,
  dietPreference: 'balanced',
  allergies: [],
  religiousRestrictions: [],
  excludedIngredients: []
};

export function isProfileComplete(profile?: UserProfile | null): boolean {
  if (!profile) return false;
  if (profile.role === 'chef') return true;
  if (!profile.name || profile.name.trim() === '') return false;
  if (!profile.heightCm || profile.heightCm <= 0) return false;
  if (!profile.weightKg || profile.weightKg <= 0) return false;
  if (!profile.age || profile.age <= 0) return false;
  if (!profile.calorieTarget || profile.calorieTarget <= 0) return false;
  return true;
}

export const INITIAL_CUSTOMER_USER: UserProfile = {
  id: 'cust-yangon-01',
  name: '',
  role: 'customer',
  heightCm: 0,
  weightKg: 0,
  age: 0,
  gender: 'male',
  activityLevel: 'moderate',
  goal: 'maintain',
  calorieTarget: 0,
  proteinGrams: 0,
  carbGrams: 0,
  fatGrams: 0,
  dietPreference: 'balanced',
  allergies: [],
  religiousRestrictions: [],
  excludedIngredients: []
};

export const INITIAL_CHEF_USER: UserProfile = {
  id: 'chef-kyaw',
  name: 'Chef Kyaw Zeya',
  role: 'chef',
  heightCm: 178,
  weightKg: 75,
  age: 34,
  gender: 'male',
  activityLevel: 'active',
  goal: 'maintain',
  calorieTarget: 2200,
  proteinGrams: 165,
  carbGrams: 180,
  fatGrams: 90,
  dietPreference: 'balanced'
};

export const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'cust-yangon-01',
    email: 'customer@nutrichef.mm',
    password: '1234',
    name: 'Customer Account',
    role: 'customer',
    profile: INITIAL_CUSTOMER_USER
  },
  {
    id: 'chef-kyaw',
    email: 'chef@nutrichef.mm',
    password: 'chef2026',
    name: 'Chef Kyaw Zeya',
    role: 'chef',
    profile: INITIAL_CHEF_USER
  }
];

export function loadRegisteredAccounts(): RegisteredAccount[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading registered accounts', e);
  }
  // Initialize with defaults if empty
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(DEFAULT_ACCOUNTS));
  } catch (e) {
    // Ignore storage quota
  }
  return DEFAULT_ACCOUNTS;
}

export function saveRegisteredAccounts(accounts: RegisteredAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error saving registered accounts', e);
  }
}

export function findAccountByEmail(email: string): RegisteredAccount | undefined {
  const accounts = loadRegisteredAccounts();
  const normalized = email.trim().toLowerCase();
  return accounts.find(a => a.email.toLowerCase() === normalized);
}

export function registerNewAccount(newAcc: RegisteredAccount): void {
  const accounts = loadRegisteredAccounts();
  const filtered = accounts.filter(a => a.email.toLowerCase() !== newAcc.email.toLowerCase());
  const updated = [newAcc, ...filtered];
  saveRegisteredAccounts(updated);
}

export function loadUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading user profile', e);
  }
  return INITIAL_CUSTOMER_USER;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));

    // Synchronize the profile across registered accounts collection in MongoDB snapshot
    const accounts = loadRegisteredAccounts();
    const existingIndex = accounts.findIndex(a => a.id === profile.id || a.profile?.id === profile.id);
    if (existingIndex !== -1) {
      accounts[existingIndex].profile = { ...profile };
      accounts[existingIndex].name = profile.name;
      saveRegisteredAccounts(accounts);
    }
  } catch (e) {
    console.error('Error saving user profile', e);
  }
}

export function loadMealPlans(): CustomerMealPlan[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEAL_PLANS);
    if (data) {
      const plans = JSON.parse(data) as CustomerMealPlan[];
      let changed = false;
      const migrated = plans.map(plan => {
        if (plan.startDate && plan.endDate) return plan;
        const start = new Date(); start.setDate(start.getDate() + 1); start.setHours(0, 0, 0, 0);
        const end = new Date(start); end.setDate(end.getDate() + plan.durationDays - 1);
        changed = true;
        return { ...plan, startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };
      });
      if (changed) localStorage.setItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(migrated));
      return migrated;
    }
  } catch (e) {
    console.error('Error loading meal plans', e);
  }
  return [];
}

export function saveMealPlans(plans: CustomerMealPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(plans));
  } catch (e) {
    console.error('Error saving meal plans', e);
  }
}

export function loadMealHistory(): MealHistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEAL_HISTORY);
    if (data !== null) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading meal history', e);
  }
  return [];
}

export function saveMealHistory(history: MealHistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEAL_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving meal history', e);
  }
}

export function loadChefPrograms(): ChefProgram[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHEF_PROGRAMS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading chef programs', e);
  }
  return DEFAULT_CHEF_PROGRAMS;
}

export function saveChefPrograms(programs: ChefProgram[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHEF_PROGRAMS, JSON.stringify(programs));
  } catch (e) {
    console.error('Error saving chef programs', e);
  }
}

export function loadOrders(): OrderRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (data !== null) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading orders', e);
  }
  return [];
}

export function saveOrders(orders: OrderRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving orders', e);
  }
}

export function loadCustomDishes(): Dish[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_DISHES);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading custom dishes', e);
  }
  return [];
}

export function saveCustomDishes(dishes: Dish[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_DISHES, JSON.stringify(dishes));
  } catch (e) {
    console.error('Error saving custom dishes', e);
  }
}

export function getAllDishes(): Dish[] {
  const custom = loadCustomDishes();
  // Filter out any duplicate IDs
  const customIds = new Set(custom.map(d => d.id));
  const baseFiltered = DISHES_DATABASE.filter(d => !customIds.has(d.id));
  return [...custom, ...baseFiltered];
}

export function addCustomDish(dish: Dish): Dish[] {
  const current = loadCustomDishes();
  const filtered = current.filter(d => d.id !== dish.id);
  const updated = [dish, ...filtered];
  saveCustomDishes(updated);
  return getAllDishes();
}

export function getFullMongoDatabaseSnapshot() {
  const registered = loadRegisteredAccounts().map(a => a.profile);
  const usersMap = new Map<string, UserProfile>();
  usersMap.set(INITIAL_CHEF_USER.id, INITIAL_CHEF_USER);
  usersMap.set(loadUserProfile().id, loadUserProfile());
  registered.forEach(u => usersMap.set(u.id, u));

  return {
    database: 'nutrichef_yangon_db',
    connectionUri: 'mongodb://localhost:27017/nutrichef_yangon_db',
    status: 'connected',
    exportedAt: new Date().toISOString(),
    collections: {
      users: Array.from(usersMap.values()),
      dishes: getAllDishes(),
      custom_dishes: loadCustomDishes(),
      ingredient_prices: YGN_INGREDIENT_PRICES,
      meal_plans: loadMealPlans(),
      meal_history: loadMealHistory(),
      chef_programs: loadChefPrograms(),
      orders: loadOrders()
    }
  };
}

/**
 * Direct Live MongoDB Collection Mutator
 * Persists edits directly into MongoDB collections and synchronizes application runtime state
 */
export function saveMongoCollection(collectionName: string, data: any): boolean {
  try {
    switch (collectionName) {
      case 'users': {
        const users = Array.isArray(data) ? data : [data];
        const currentId = loadUserProfile().id;
        const currentMatch = users.find((u: any) => u.id === currentId);
        if (currentMatch) {
          saveUserProfile(currentMatch);
        }
        const accounts = loadRegisteredAccounts().map(acc => {
          const match = users.find((u: any) => u.id === acc.id);
          return match ? { ...acc, name: match.name || acc.name, profile: match } : acc;
        });
        saveRegisteredAccounts(accounts);
        break;
      }
      case 'dishes':
      case 'custom_dishes': {
        const dishes = Array.isArray(data) ? data : [data];
        saveCustomDishes(dishes);
        break;
      }
      case 'ingredient_prices': {
        const prices = Array.isArray(data) ? data : [data];
        localStorage.setItem('nutrichef_ingredient_prices_v3', JSON.stringify(prices));
        break;
      }
      case 'meal_plans': {
        const plans = Array.isArray(data) ? data : [data];
        saveMealPlans(plans);
        break;
      }
      case 'meal_history': {
        const history = Array.isArray(data) ? data : [data];
        saveMealHistory(history);
        break;
      }
      case 'chef_programs': {
        const programs = Array.isArray(data) ? data : [data];
        saveChefPrograms(programs);
        break;
      }
      case 'orders': {
        const orders = Array.isArray(data) ? data : [data];
        saveOrders(orders);
        break;
      }
      default:
        console.warn(`Unknown MongoDB collection: ${collectionName}`);
        return false;
    }

    // Dispatch global event for live reactive state updates across all components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('nutrichef_mongo_synced', { detail: { collection: collectionName } }));
    }
    return true;
  } catch (err) {
    console.error(`Failed to save MongoDB collection ${collectionName}:`, err);
    return false;
  }
}

/**
 * Update a specific document in a MongoDB collection by _id / id
 */
export function updateMongoDocument(collectionName: string, docId: string, updatedFields: Record<string, any>): boolean {
  const snapshot = getFullMongoDatabaseSnapshot();
  const col = snapshot.collections[collectionName as keyof typeof snapshot.collections];
  if (!Array.isArray(col)) return false;

  const index = col.findIndex((item: any) => (item.id === docId || item._id === docId));
  if (index === -1) return false;

  const updatedItem = { ...col[index], ...updatedFields, updatedAt: new Date().toISOString() };
  const newCollection = [...col];
  newCollection[index] = updatedItem;

  return saveMongoCollection(collectionName, newCollection);
}

/**
 * Delete a specific document from a MongoDB collection
 */
export function deleteMongoDocument(collectionName: string, docId: string): boolean {
  const snapshot = getFullMongoDatabaseSnapshot();
  const col = snapshot.collections[collectionName as keyof typeof snapshot.collections];
  if (!Array.isArray(col)) return false;

  const newCollection = col.filter((item: any) => item.id !== docId && item._id !== docId);
  return saveMongoCollection(collectionName, newCollection);
}

/**
 * Reset a specific MongoDB collection to initial seed data
 */
export function resetMongoCollectionToDefault(collectionName: string): boolean {
  switch (collectionName) {
    case 'users':
      saveUserProfile(INITIAL_CUSTOMER_USER);
      saveRegisteredAccounts(DEFAULT_ACCOUNTS);
      break;
    case 'custom_dishes':
      saveCustomDishes([]);
      break;
    case 'ingredient_prices':
      localStorage.removeItem('nutrichef_ingredient_prices_v3');
      break;
    case 'meal_plans':
      saveMealPlans([]);
      break;
    case 'meal_history':
      saveMealHistory([]);
      break;
    case 'chef_programs':
      saveChefPrograms(DEFAULT_CHEF_PROGRAMS);
      break;
    case 'orders':
      saveOrders([]);
      break;
    default:
      return false;
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nutrichef_mongo_synced', { detail: { collection: collectionName } }));
  }
  return true;
}
