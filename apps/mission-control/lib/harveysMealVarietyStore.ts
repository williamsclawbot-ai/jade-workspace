/**
 * Harvey's Meal Variety Store
 * Tracks which meals Harvey has had + when
 */

export interface MealHistory {
  [mealName: string]: number[]; // Array of timestamps
}

const STORAGE_KEY = 'harveys-meal-variety-v1';

class HarveysMealVarietyStoreClass {
  private history: MealHistory = {};

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading Harvey meal variety:', e);
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history));
      // Trigger storage event for real-time sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(this.history),
      }));
    } catch (e) {
      console.error('Error saving Harvey meal variety:', e);
    }
  }

  /**
   * Record that Harvey had a meal at the current time
   */
  recordMeal(mealName: string): void {
    if (!this.history[mealName]) {
      this.history[mealName] = [];
    }
    this.history[mealName].push(Date.now());
    this.save();
  }

  /**
   * Get the last time Harvey had a specific meal
   */
  getLastHad(mealName: string): number | null {
    const timestamps = this.history[mealName];
    if (!timestamps || timestamps.length === 0) return null;
    return Math.max(...timestamps);
  }

  /**
   * Get days since Harvey last had a meal
   */
  getDaysSinceLastHad(mealName: string): number | null {
    const lastHad = this.getLastHad(mealName);
    if (!lastHad) return null;
    const daysSince = (Date.now() - lastHad) / (1000 * 60 * 60 * 24);
    return Math.floor(daysSince);
  }

  /**
   * Get a human-readable string for when Harvey last had a meal
   */
  getLastHadString(mealName: string): string {
    const days = this.getDaysSinceLastHad(mealName);
    if (days === null) return 'Never had';
    if (days === 0) return 'Had today';
    if (days === 1) return 'Had yesterday';
    if (days < 7) return `Had ${days} days ago`;
    if (days < 14) return `Had ${Math.floor(days / 7)} week ago`;
    return `Had ${Math.floor(days / 7)} weeks ago`;
  }

  /**
   * Get meals that haven't been had in a while (good for rotation suggestions)
   */
  getMealsNotHadRecently(allMealNames: string[], dayThreshold: number = 14): string[] {
    return allMealNames.filter(meal => {
      const days = this.getDaysSinceLastHad(meal);
      return days === null || days >= dayThreshold;
    });
  }

  /**
   * Get all meal history
   */
  getAll(): MealHistory {
    return { ...this.history };
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = {};
    this.save();
  }
}

export const harveysMealVarietyStore = new HarveysMealVarietyStoreClass();
