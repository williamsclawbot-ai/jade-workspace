/**
 * Bulk Meal Assignment Helper
 * Quick utilities for assigning recipes to multiple days/meal slots
 */

import { weeklyMealPlanStorage, WeeklyMealPlan } from './weeklyMealPlanStorage';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const jadesMealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Dessert'];

/**
 * Assign a recipe to a specific meal type across all days of the week
 * Returns the updated week object for immediate state update
 * Example: const updated = assignRecipeToAllDays(weekId, 'Breakfast', 'PB & J Overnight Weet-Bix (GF)')
 */
export function assignRecipeToAllDays(
  weekId: string,
  mealType: string,
  recipeName: string
): WeeklyMealPlan | null {
  days.forEach(day => {
    weeklyMealPlanStorage.addMealToWeek(weekId, day, mealType, recipeName);
  });
  return weeklyMealPlanStorage.getWeekById(weekId);
}

/**
 * Assign a recipe to specific days only
 * Returns the updated week object for immediate state update
 * Example: const updated = assignRecipeToSpecificDays(weekId, ['Monday', 'Wednesday', 'Friday'], 'Breakfast', 'Eggs & Toast')
 */
export function assignRecipeToSpecificDays(
  weekId: string,
  targetDays: string[],
  mealType: string,
  recipeName: string
): WeeklyMealPlan | null {
  targetDays.forEach(day => {
    if (days.includes(day)) {
      weeklyMealPlanStorage.addMealToWeek(weekId, day, mealType, recipeName);
    }
  });
  return weeklyMealPlanStorage.getWeekById(weekId);
}

/**
 * Clear a meal type across all days
 * Returns the updated week object for immediate state update
 * Example: const updated = clearMealTypeAllDays(weekId, 'Breakfast')
 */
export function clearMealTypeAllDays(weekId: string, mealType: string): WeeklyMealPlan | null {
  days.forEach(day => {
    weeklyMealPlanStorage.removeMealFromDay(weekId, day, mealType);
  });
  return weeklyMealPlanStorage.getWeekById(weekId);
}
