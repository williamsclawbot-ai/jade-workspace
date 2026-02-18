/**
 * Helper to process meal photos and add to shopping list
 * Used by Felicia when processing meal photos from user chat
 */

import { shoppingListStore } from './shoppingListStore';
import { jadesMealStore } from './jadesMealStore';

export interface ExtractedMeal {
  name: string;
  ingredients: string[]; // List of ingredient names
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
}

export interface MealAddRequest {
  meal: ExtractedMeal;
  person: 'jade' | 'harvey';
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

/**
 * Add a meal to the meal plan and its ingredients to shopping list
 */
export function addMealAndIngredients(request: MealAddRequest) {
  const { meal, person, day, mealType } = request;

  // 1. Add meal to the appropriate meal plan
  if (person === 'jade') {
    jadesMealStore.addMeal(
      day.charAt(0).toUpperCase() + day.slice(1), // Capitalize day
      mealType.charAt(0).toUpperCase() + mealType.slice(1), // Capitalize meal type
      meal.name,
      {
        calories: meal.macros?.calories,
        protein: meal.macros?.protein,
        fats: meal.macros?.fat,
        carbs: meal.macros?.carbs,
        ingredients: meal.ingredients.map(ing => ({
          name: ing,
          qty: '1',
          unit: 'unit',
        })),
      }
    );
  } else {
    // TODO: Add Harvey's meal to appropriate store
    // For now, just log that we need to handle Harvey separately
    console.log('Harvey meal handling - to be implemented');
  }

  // 2. Add ingredients to shopping list
  const ingredientsList = meal.ingredients.map(ingredient => ({
    ingredient,
    quantity: '1', // Default quantity, user can adjust
    source: person as 'jade' | 'harvey',
    sourceMetadata: {
      mealName: meal.name,
      day,
      mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    },
  }));

  shoppingListStore.addBulk(ingredientsList);

  return {
    success: true,
    mealAdded: meal.name,
    ingredientsAdded: meal.ingredients.length,
    person,
    day,
    mealType,
  };
}

/**
 * Format meal addition confirmation for user
 */
export function formatMealAddConfirmation(result: ReturnType<typeof addMealAndIngredients>) {
  return `
✅ **Meal added!**
- Meal: ${result.mealAdded}
- Person: ${result.person === 'jade' ? "Jade's" : "Harvey's"} meals
- Day: ${result.day}
- Time: ${result.mealType}
- Ingredients: ${result.ingredientsAdded} items added to Shopping List

📋 Go to **HOME → Shopping List** to review and add to Woolworths cart!
`;
}

/**
 * Example of how Felicia would use this in chat:
 * 
 * User: "Add this double cheeseburger to Jade's Monday dinner"
 * [User sends photo of burger]
 * 
 * Felicia:
 * 1. Extracts meal from photo using vision:
 *    - Name: "Double Cheeseburger"
 *    - Ingredients: ["Ground beef", "Cheddar cheese", "Lettuce", "Tomato", "Burger buns", ...]
 *    - Macros: {protein: 45, carbs: 35, fat: 28, calories: 580}
 * 
 * 2. Calls addMealAndIngredients():
 *    addMealAndIngredients({
 *      meal: {name: "Double Cheeseburger", ingredients: [...], macros: {...}},
 *      person: 'jade',
 *      day: 'monday',
 *      mealType: 'dinner'
 *    })
 * 
 * 3. Returns confirmation to user
 */
