/**
 * Jade's Meals Storage System
 * Persistent localStorage-based meal plan management
 */

export interface JadeMeal {
  id: string;
  day: string; // Monday, Tuesday, etc.
  mealType: string; // breakfast, lunch, snack, dinner, dessert
  mealName: string;
  calories?: number;
  protein?: number;
  fats?: number;
  carbs?: number;
  ingredients?: Array<{ name: string; qty: string; unit: string }>;
  addedAt: number;
}

export interface JadesMealsData {
  meals: Record<string, JadeMeal>; // key: "Monday-Breakfast"
  lastUpdated: number;
}

const STORAGE_KEY = 'jades-meals-storage-v1';

class JadesMealsStorage {
  /**
   * Get all meals
   */
  getAllMeals(): JadeMeal[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const data: JadesMealsData = JSON.parse(stored);
      return Object.values(data.meals);
    } catch (e) {
      console.error('Error reading meals storage:', e);
      return [];
    }
  }

  /**
   * Get meals for a specific day
   */
  getMealsForDay(day: string): Record<string, JadeMeal | null> {
    const allMeals = this.getAllMeals();
    const dayMeals: Record<string, JadeMeal | null> = {
      breakfast: null,
      lunch: null,
      snack: null,
      dinner: null,
      dessert: null,
    };

    allMeals.forEach((meal) => {
      if (meal.day.toLowerCase() === day.toLowerCase()) {
        dayMeals[meal.mealType.toLowerCase()] = meal;
      }
    });

    return dayMeals;
  }

  /**
   * Add or update a meal
   */
  addMeal(day: string, mealType: string, mealName: string, macros?: { calories?: number; protein?: number; fats?: number; carbs?: number }, ingredients?: Array<{ name: string; qty: string; unit: string }>): JadeMeal {
    if (typeof window === 'undefined') throw new Error('Storage only works in browser');

    const key = `${day}-${mealType}`;
    const meal: JadeMeal = {
      id: key,
      day,
      mealType,
      mealName,
      calories: macros?.calories,
      protein: macros?.protein,
      fats: macros?.fats,
      carbs: macros?.carbs,
      ingredients,
      addedAt: Date.now(),
    };

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let data: JadesMealsData = stored 
        ? JSON.parse(stored) 
        : { meals: {}, lastUpdated: Date.now() };

      data.meals[key] = meal;
      data.lastUpdated = Date.now();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
      // Trigger storage event for real-time sync
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', {
          key: STORAGE_KEY,
          newValue: JSON.stringify(data),
        }));
      }

      return meal;
    } catch (e) {
      console.error('Error saving meal:', e);
      throw e;
    }
  }

  /**
   * Remove a meal
   */
  removeMeal(day: string, mealType: string): void {
    if (typeof window === 'undefined') return;

    const key = `${day}-${mealType}`;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const data: JadesMealsData = JSON.parse(stored);
      delete data.meals[key];
      data.lastUpdated = Date.now();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', {
          key: STORAGE_KEY,
          newValue: JSON.stringify(data),
        }));
      }
    } catch (e) {
      console.error('Error removing meal:', e);
    }
  }

  /**
   * Clear all meals
   */
  clearAll(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(STORAGE_KEY);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', {
          key: STORAGE_KEY,
          newValue: null,
        }));
      }
    } catch (e) {
      console.error('Error clearing meals:', e);
    }
  }

  /**
   * Get meal database with recipes
   */
  getMealDatabase(): Record<string, { calories: number; protein: number; fats: number; carbs: number; ingredients: Array<{ name: string; qty: string; unit: string }> }> {
    return {
      'Chicken Enchilada (GF)': {
        calories: 543,
        protein: 42,
        fats: 21,
        carbs: 44,
        ingredients: [
          { name: 'Avocado', qty: '30', unit: 'g' },
          { name: 'Chicken Breast (Weighed Raw)', qty: '100', unit: 'g' },
          { name: 'Light Mozzarella Cheese (Coles) OR Bega 50% light Shredded Cheese (Woolworths)', qty: '35', unit: 'g' },
          { name: 'Mild Salsa - Old El Paso', qty: '35', unit: 'g' },
          { name: 'Refried Beans - Old El Paso', qty: '60', unit: 'g' },
          { name: 'Sour Cream Light', qty: '30', unit: 'g' },
          { name: 'Taco Spice Mix (Old El Paso) - Gluten free', qty: '5', unit: 'g' },
          { name: 'White Wraps (50g) - Free From Gluten (Woolworths Only)', qty: '1', unit: 'wrap' },
        ],
      },
    };
  }
}

export const jadesMealsStorage = new JadesMealsStorage();
