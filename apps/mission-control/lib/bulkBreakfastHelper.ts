/**
 * Bulk Breakfast Assignment Helper
 * Quick utility to assign Cacao Pistachio Yogurt Bowl to all breakfasts for a week
 */

import { weeklyMealPlanStorage } from './weeklyMealPlanStorage';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const recipeName = 'Cacao Pistachio Yogurt Bowl';

/**
 * Assign Cacao Pistachio Yogurt Bowl to breakfast for all days in the week
 * Call this from browser console or within the app
 */
export function assignBreakfastAllDays(weekId: string): boolean {
  try {
    days.forEach(day => {
      weeklyMealPlanStorage.addMealToWeek(weekId, day, 'Breakfast', recipeName);
    });
    
    console.log(`✅ Successfully assigned "${recipeName}" to all ${days.length} breakfasts!`);
    return true;
  } catch (error) {
    console.error(`❌ Error assigning breakfast:`, error);
    return false;
  }
}

/**
 * Get the script to paste into browser console
 * Returns the code that can be executed directly in the console
 */
export function getConsoleScript(): string {
  return `
// Bulk assign Cacao Pistachio Yogurt Bowl to all breakfasts
(function() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const recipeName = 'Cacao Pistachio Yogurt Bowl';
  const mealType = 'Breakfast';
  
  // Get current week from localStorage
  const plans = JSON.parse(localStorage.getItem('weekly-meal-plans-v1') || '{}');
  
  if (Object.keys(plans).length === 0) {
    console.log('❌ No meal plans found. Open the app first!');
    return;
  }
  
  // Get the first (current) week
  const weekId = Object.keys(plans)[0];
  const plan = plans[weekId];
  
  if (!plan) {
    console.log('❌ Could not find current week');
    return;
  }
  
  console.log('📝 Assigning breakfast to:', days);
  
  // Assign recipe to all days
  days.forEach(day => {
    if (!plan.jades.meals) plan.jades.meals = {};
    if (!plan.jades.meals[day]) plan.jades.meals[day] = {};
    plan.jades.meals[day].breakfast = recipeName;
  });
  
  // Save back to localStorage
  localStorage.setItem('weekly-meal-plans-v1', JSON.stringify(plans));
  
  // Trigger storage event to sync UI
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'weekly-meal-plans-v1',
    newValue: JSON.stringify(plans),
  }));
  
  console.log('✅ Successfully assigned "${recipeName}" to all breakfasts!');
  console.log('💡 Refresh the page to see changes, or the UI should update automatically');
})();
`;
}
