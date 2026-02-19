/**
 * Harvey's Meals Restore Helper
 * Restores test data if meals disappear
 */

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function restoreHarveysMealsFromScreenshot(): Record<string, Record<string, string[]>> {
  const restored: Record<string, Record<string, string[]>> = {};
  
  days.forEach(day => {
    restored[day] = {
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: [],
    };
  });

  // Populate from screenshot
  restored['Monday'].lunch = ['Apple (introduce)'];
  restored['Tuesday'].lunch = ['Cucumber (keep trying)'];
  restored['Wednesday'].lunch = ['Grapes', 'Blueberries'];

  return restored;
}

export function saveHarveysMealsToStorage(meals: Record<string, Record<string, string[]>>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('harveysAssignedMeals', JSON.stringify(meals));
  console.log('✅ Harvey\'s meals saved to storage');
  // Also dispatch event to notify other components
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'harveysAssignedMeals',
    newValue: JSON.stringify(meals),
  }));
}

export function initializeOrRestoreHarveysMeals(): Record<string, Record<string, string[]>> {
  if (typeof window === 'undefined') {
    return restoreHarveysMealsFromScreenshot();
  }

  const saved = localStorage.getItem('harveysAssignedMeals');
  if (saved) {
    try {
      console.log('✅ Found saved Harvey\'s meals in storage');
      return JSON.parse(saved);
    } catch (e) {
      console.error('❌ Error parsing saved meals:', e);
    }
  }

  console.log('⚠️ No saved meals found - restoring from backup');
  const restored = restoreHarveysMealsFromScreenshot();
  saveHarveysMealsToStorage(restored);
  return restored;
}
