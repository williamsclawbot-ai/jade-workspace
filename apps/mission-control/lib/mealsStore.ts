/**
 * Meals Store - Manages Harvey's meals and family meals
 */

export interface Meal {
  id: string;
  day: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  harveyMeal?: string;
  familyMeal?: string;
  notes?: string;
  date?: string; // ISO date string
}

const STORAGE_KEY = 'jade_meals';

const DEFAULT_MEALS: Meal[] = [
  {
    id: '1',
    day: 'Monday',
    type: 'breakfast',
    harveyMeal: 'Banana, toast, milk',
    familyMeal: 'Eggs on toast',
  },
  {
    id: '2',
    day: 'Monday',
    type: 'lunch',
    harveyMeal: 'Pasta, veggies, cheese',
    familyMeal: 'Chicken pasta',
  },
  {
    id: '3',
    day: 'Monday',
    type: 'dinner',
    harveyMeal: 'Chicken nuggets, rice, peas',
    familyMeal: 'Baked chicken, roasted vegetables',
  },
  {
    id: '4',
    day: 'Monday',
    type: 'snack',
    harveyMeal: 'Yogurt, berries',
    familyMeal: 'Fruit salad',
  },
];

class MealsStore {
  private meals: Meal[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') {
      this.meals = DEFAULT_MEALS;
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    this.meals = stored ? JSON.parse(stored) : DEFAULT_MEALS;
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.meals));
  }

  getMeals(): Meal[] {
    return this.meals;
  }

  getMealsForDay(day: string): Meal[] {
    return this.meals.filter((m) => m.day === day);
  }

  getTodayMeals(): Meal[] {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return this.getMealsForDay(today);
  }

  addMeal(meal: Omit<Meal, 'id'>): Meal {
    const newMeal: Meal = {
      ...meal,
      id: Date.now().toString(),
    };
    this.meals.push(newMeal);
    this.save();
    return newMeal;
  }

  updateMeal(id: string, updates: Partial<Meal>): Meal | null {
    const meal = this.meals.find((m) => m.id === id);
    if (!meal) return null;
    Object.assign(meal, updates);
    this.save();
    return meal;
  }

  deleteMeal(id: string): boolean {
    const index = this.meals.findIndex((m) => m.id === id);
    if (index === -1) return false;
    this.meals.splice(index, 1);
    this.save();
    return true;
  }

  getUrgentForToday(): Meal[] {
    return this.getTodayMeals();
  }
}

export const mealsStore = new MealsStore();
