/**
 * Harvey's Meals Restore Helper
 * Restores test data if meals disappear
 */

export function restoreHarveysMealsFromScreenshot(): Record<string, Record<string, string[]>> {
  return {
    Monday: {
      breakfast: [],
      lunch: ['Apple (introduce)'],
      snack: [],
      dinner: [],
    },
    Tuesday: {
      breakfast: [],
      lunch: ['Cucumber (keep trying)'],
      snack: [],
      dinner: [],
    },
    Wednesday: {
      breakfast: [],
      lunch: ['Grapes', 'Blueberries'],
      snack: [],
      dinner: [],
    },
    Thursday: {
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: [],
    },
    Friday: {
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: [],
    },
    Saturday: {
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: [],
    },
    Sunday: {
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: [],
    },
  };
}

export function saveHarveysMealsToStorage(meals: Record<string, Record<string, string[]>>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('harveysAssignedMeals', JSON.stringify(meals));
  console.log('✅ Harvey\'s meals restored to storage:', meals);
}
