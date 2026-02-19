/**
 * Bulk Meal Assignment Helper
 * Quick utilities for assigning recipes to multiple days/meal slots
 */

import { weeklyMealPlanStorage, WeeklyMealPlan } from './weeklyMealPlanStorage';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const jadesMealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Dessert'];

/**
 * Assign a recipe to a specific meal type across all days of the week
 * Example: assignRecipeToAllDays(weekId, 'Breakfast', 'Weetbix with Milk & Fruit')
 */
export function assignRecipeToAllDays(
  weekId: string,
  mealType: string,
  recipeName: string
): void {
  days.forEach(day => {
    weeklyMealPlanStorage.addMealToWeek(weekId, day, mealType, recipeName);
  });
}

/**
 * Assign a recipe to specific days only
 * Example: assignRecipeToSpecificDays(weekId, ['Monday', 'Wednesday', 'Friday'], 'Breakfast', 'Eggs & Toast')
 */
export function assignRecipeToSpecificDays(
  weekId: string,
  targetDays: string[],
  mealType: string,
  recipeName: string
): void {
  targetDays.forEach(day => {
    if (days.includes(day)) {
      weeklyMealPlanStorage.addMealToWeek(weekId, day, mealType, recipeName);
    }
  });
}

/**
 * Clear a meal type across all days
 * Example: clearMealTypeAllDays(weekId, 'Breakfast')
 */
export function clearMealTypeAllDays(weekId: string, mealType: string): void {
  days.forEach(day => {
    weeklyMealPlanStorage.removeMealFromDay(weekId, day, mealType);
  });
}
