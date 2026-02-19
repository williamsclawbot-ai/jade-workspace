/**
 * Weekly Meal Plan Storage
 * Week-based meal planning with isolation between weeks
 * Each week can be in: 'planning', 'locked', or 'archived' status
 */

export interface Ingredient {
  id: string;
  name: string;
  qty: string | number;
  unit: string;
}

export interface DayOverride {
  // When user edits a meal for one day only (e.g., double portion)
  recipeName: string;
  variantName?: string; // e.g., "Asian Tacos (Monday - Double Serving)"
  ingredientOverrides?: Array<{
    ingredientId: string;
    qty: string | number;
    unit: string;
  }>;
  macroOverrides?: {
    calories?: number;
    protein?: number;
    fats?: number;
    carbs?: number;
  };
}

interface DayMealAssignment {
  breakfast?: string; // Recipe name
  lunch?: string;
  snack?: string;
  dinner?: string;
  dessert?: string;
}

export interface ShoppingItem {
  id: string;
  ingredient: string;
  quantity?: string | number;
  unit?: string;
  source: 'jade' | 'harvey';
  sourceMetadata?: {
    mealName?: string;
    day?: string;
    mealType?: string;
  };
  woolworthsUrl?: string;
  woolworthsProductName?: string;
  hasMapping?: boolean;
  isFlagged?: boolean;
  category?: string;
  addedAt: number;
}

export interface WeeklyMealPlan {
  weekId: string; // e.g., "2026-w07"
  weekStartDate: string; // ISO date of Monday
  weekEndDate: string; // ISO date of Sunday
  status: 'planning' | 'locked' | 'archived';

  jades: {
    meals: Record<string, DayMealAssignment>; // "Monday" → { breakfast: "Recipe Name", ... }
    dayOverrides: Record<string, Record<string, DayOverride>>; // "Monday" → "Breakfast" → override
  };

  // Harvey's meals structure stays exactly as it was
  harveys: {
    meals: Record<string, DayMealAssignment>;
    dayOverrides: Record<string, Record<string, DayOverride>>;
  };

  shoppingList: ShoppingItem[];

  createdAt: number;
  lockedAt?: number;
  archivedAt?: number;
}

const STORAGE_KEY = 'weekly-meal-plans-v1';
const CURRENT_WEEK_KEY = 'current-week-id';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['breakfast', 'lunch', 'snack', 'dinner', 'dessert'];

function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

function generateWeekId(date: Date): string {
  const year = date.getFullYear();
  const week = getISOWeekNumber(date);
  return `${year}-w${String(week).padStart(2, '0')}`;
}

function initializeDayMeals(): Record<string, DayMealAssignment> {
  const result: Record<string, DayMealAssignment> = {};
  days.forEach(day => {
    result[day] = {};
  });
  return result;
}

function initializeDayOverrides(): Record<string, Record<string, DayOverride>> {
  const result: Record<string, Record<string, DayOverride>> = {};
  days.forEach(day => {
    result[day] = {};
  });
  return result;
}

class WeeklyMealPlanStorage {
  private plans: Map<string, WeeklyMealPlan> = new Map();

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.plans = new Map(Object.entries(data));
      } else {
        // First load - create current and next week
        this.createCurrentAndNextWeeks();
      }
    } catch (e) {
      console.error('Error loading weekly meal plans:', e);
      this.createCurrentAndNextWeeks();
    }
  }

  private save() {
    if (typeof window === 'undefined') return;

    try {
      const data = Object.fromEntries(this.plans);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(data),
      }));
    } catch (e) {
      console.error('Error saving weekly meal plans:', e);
    }
  }

  private createCurrentAndNextWeeks() {
    const today = new Date();
    const currentWeekId = generateWeekId(today);
    const nextMonday = new Date(getMonday(today));
    nextMonday.setDate(nextMonday.getDate() + 7);
    const nextWeekId = generateWeekId(nextMonday);

    if (!this.plans.has(currentWeekId)) {
      this.createWeek(currentWeekId, getMonday(today));
    }
    if (!this.plans.has(nextWeekId)) {
      this.createWeek(nextWeekId, nextMonday);
    }
  }

  private createWeek(weekId: string, startDate: Date): WeeklyMealPlan {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const plan: WeeklyMealPlan = {
      weekId,
      weekStartDate: formatDateISO(startDate),
      weekEndDate: formatDateISO(endDate),
      status: 'planning',
      jades: {
        meals: initializeDayMeals(),
        dayOverrides: initializeDayOverrides(),
      },
      harveys: {
        meals: initializeDayMeals(),
        dayOverrides: initializeDayOverrides(),
      },
      shoppingList: [],
      createdAt: Date.now(),
    };

    this.plans.set(weekId, plan);
    return plan;
  }

  getCurrentWeek(): WeeklyMealPlan {
    const today = new Date();
    const weekId = generateWeekId(today);
    let plan = this.plans.get(weekId);

    if (!plan) {
      plan = this.createWeek(weekId, getMonday(today));
      this.save();
    }

    return plan;
  }

  getNextWeek(): WeeklyMealPlan {
    const today = new Date();
    const nextMonday = new Date(getMonday(today));
    nextMonday.setDate(nextMonday.getDate() + 7);
    const weekId = generateWeekId(nextMonday);

    let plan = this.plans.get(weekId);

    if (!plan) {
      plan = this.createWeek(weekId, nextMonday);
      this.save();
    }

    return plan;
  }

  getWeekById(weekId: string): WeeklyMealPlan | null {
    return this.plans.get(weekId) || null;
  }

  getAllWeeks(): WeeklyMealPlan[] {
    return Array.from(this.plans.values()).sort(
      (a, b) => new Date(a.weekStartDate).getTime() - new Date(b.weekStartDate).getTime()
    );
  }

  getLockedWeeks(): WeeklyMealPlan[] {
    return this.getAllWeeks().filter(w => w.status === 'locked').reverse(); // Newest first
  }

  getArchivedWeeks(): WeeklyMealPlan[] {
    return this.getAllWeeks().filter(w => w.status === 'archived').reverse();
  }

  addMealToWeek(weekId: string, day: string, mealType: string, recipeName: string): void {
    const plan = this.plans.get(weekId);
    if (!plan) throw new Error(`Week ${weekId} not found`);

    const type = mealType.toLowerCase() as keyof DayMealAssignment;
    plan.jades.meals[day] = { ...plan.jades.meals[day], [type]: recipeName };

    this.save();
  }

  overrideMealForDay(
    weekId: string,
    day: string,
    mealType: string,
    override: DayOverride
  ): void {
    const plan = this.plans.get(weekId);
    if (!plan) throw new Error(`Week ${weekId} not found`);

    const type = mealType.toLowerCase();
    plan.jades.dayOverrides[day] = {
      ...plan.jades.dayOverrides[day],
      [type]: override,
    };

    this.save();
  }

  removeMealFromDay(weekId: string, day: string, mealType: string): void {
    const plan = this.plans.get(weekId);
    if (!plan) throw new Error(`Week ${weekId} not found`);

    const type = mealType.toLowerCase() as keyof DayMealAssignment;
    const updated = { ...plan.jades.meals[day] };
    delete updated[type];
    plan.jades.meals[day] = updated;

    // Also remove override if exists
    delete plan.jades.dayOverrides[day]?.[type];

    this.save();
  }

  lockWeek(weekId: string): void {
    const plan = this.plans.get(weekId);
    if (!plan) throw new Error(`Week ${weekId} not found`);

    plan.status = 'locked';
    plan.lockedAt = Date.now();

    this.save();
  }

  archiveWeek(weekId: string): void {
    const plan = this.plans.get(weekId);
    if (!plan) throw new Error(`Week ${weekId} not found`);

    plan.status = 'archived';
    plan.archivedAt = Date.now();

    this.save();
  }

  updateWeek(weekId: string, updatedPlan: WeeklyMealPlan): void {
    if (!this.plans.has(weekId)) throw new Error(`Week ${weekId} not found`);
    this.plans.set(weekId, updatedPlan);
    this.save();
  }

  getShoppingListForWeek(weekId: string): ShoppingItem[] {
    const plan = this.plans.get(weekId);
    if (!plan) return [];
    return plan.shoppingList;
  }

  updateShoppingListForWeek(weekId: string, items: ShoppingItem[]): void {
    const plan = this.plans.get(weekId);
    if (!plan) throw new Error(`Week ${weekId} not found`);

    plan.shoppingList = items;
    this.save();
  }

  addShoppingItemToWeek(weekId: string, item: Omit<ShoppingItem, 'id' | 'addedAt'>): ShoppingItem {
    const plan = this.plans.get(weekId);
    if (!plan) throw new Error(`Week ${weekId} not found`);

    const newItem: ShoppingItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      addedAt: Date.now(),
    };

    plan.shoppingList.push(newItem);
    this.save();

    return newItem;
  }

  removeShoppingItemFromWeek(weekId: string, itemId: string): void {
    const plan = this.plans.get(weekId);
    if (!plan) throw new Error(`Week ${weekId} not found`);

    plan.shoppingList = plan.shoppingList.filter(item => item.id !== itemId);
    this.save();
  }

  updateShoppingItemInWeek(weekId: string, itemId: string, updates: Partial<ShoppingItem>): void {
    const plan = this.plans.get(weekId);
    if (!plan) throw new Error(`Week ${weekId} not found`);

    const item = plan.shoppingList.find(i => i.id === itemId);
    if (!item) throw new Error(`Item ${itemId} not found in week ${weekId}`);

    Object.assign(item, updates);
    this.save();
  }

  // Auto-transition: promote next week to current on Monday
  promoteNextWeekToThisWeek(): void {
    const today = new Date();
    const currentWeekId = generateWeekId(today);
    const currentWeek = this.plans.get(currentWeekId);

    if (currentWeek && currentWeek.status === 'locked') {
      // Archive the old week
      currentWeek.status = 'archived';
      currentWeek.archivedAt = Date.now();
    }

    // Create new "next week" if it doesn't exist
    const nextMonday = new Date(getMonday(today));
    nextMonday.setDate(nextMonday.getDate() + 7);
    const nextWeekId = generateWeekId(nextMonday);

    if (!this.plans.has(nextWeekId)) {
      this.createWeek(nextWeekId, nextMonday);
    }

    this.save();
  }
}

export const weeklyMealPlanStorage = new WeeklyMealPlanStorage();
