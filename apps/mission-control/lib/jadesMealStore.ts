/**
 * Jade's Meals Store
 * Manages Jade's weekly meal plan with macros
 */

export interface JadeMealEntry {
  name: string;
  calories?: number;
  protein?: number;
  fats?: number;
  carbs?: number;
  ingredients?: Array<{ name: string; qty: string; unit: string }>;
}

export interface JadesMeals {
  [key: string]: string | JadeMealEntry; // Key format: "Monday-Breakfast", value: meal name or object
}

const STORAGE_KEY = 'jades-meals-plan';
const MEAL_DATABASE_KEY = 'meal-database';

const JADE_TARGETS = {
  calories: 1550,
  protein: 120,
  fats: 45,
  carbs: 166,
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Dessert'];

class JadesMealStore {
  getMeals(): JadesMeals {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  getMealDatabase(): Record<string, JadeMealEntry> {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(MEAL_DATABASE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  addMeal(
    day: string, 
    mealType: string, 
    mealName: string, 
    mealDetails?: Omit<JadeMealEntry, 'name'>
  ): void {
    const meals = this.getMeals();
    const key = `${day}-${mealType}`;
    
    // If we have macro details, save to database and store reference
    if (mealDetails) {
      const mealDb = this.getMealDatabase();
      mealDb[mealName] = {
        name: mealName,
        ...mealDetails,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(MEAL_DATABASE_KEY, JSON.stringify(mealDb));
      }
    }

    meals[key] = mealName;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
      // Trigger storage event for real-time sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(meals),
      }));
    }
  }

  removeMeal(day: string, mealType: string): void {
    const meals = this.getMeals();
    const key = `${day}-${mealType}`;
    delete meals[key];
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(meals),
      }));
    }
  }

  getMealForDayAndType(day: string, mealType: string): string | undefined {
    const meals = this.getMeals();
    return meals[`${day}-${mealType}`] as string;
  }

  getMealsForDay(day: string): Record<string, string> {
    const meals = this.getMeals();
    const result: Record<string, string> = {};
    
    mealTypes.forEach(type => {
      const key = `${day}-${type}`;
      if (meals[key]) {
        result[type.toLowerCase()] = meals[key] as string;
      }
    });
    
    return result;
  }

  getAllMeals(): Record<string, Record<string, string>> {
    const meals = this.getMeals();
    const result: Record<string, Record<string, string>> = {};
    
    days.forEach(day => {
      const dayMeals: Record<string, string> = {};
      mealTypes.forEach(type => {
        const key = `${day}-${type}`;
        if (meals[key]) {
          dayMeals[type.toLowerCase()] = meals[key] as string;
        }
      });
      if (Object.keys(dayMeals).length > 0) {
        result[day] = dayMeals;
      }
    });
    
    return result;
  }

  calculateMacrosForDay(day: string): { total: Record<string, number>; meals: Record<string, Record<string, number>> } {
    const dayMeals = this.getMealsForDay(day);
    const mealDb = this.getMealDatabase();
    
    const total = {
      calories: 0,
      protein: 0,
      fats: 0,
      carbs: 0,
    };
    
    const mealMacros: Record<string, Record<string, number>> = {};
    
    Object.entries(dayMeals).forEach(([type, mealName]) => {
      const mealData = mealDb[mealName] as JadeMealEntry;
      if (mealData) {
        mealMacros[type] = {
          calories: mealData.calories || 0,
          protein: mealData.protein || 0,
          fats: mealData.fats || 0,
          carbs: mealData.carbs || 0,
        };
        
        total.calories += mealData.calories || 0;
        total.protein += mealData.protein || 0;
        total.fats += mealData.fats || 0;
        total.carbs += mealData.carbs || 0;
      }
    });
    
    return { total, meals: mealMacros };
  }

  getTargets() {
    return JADE_TARGETS;
  }
}

export const jadesMealStore = new JadesMealStore();
