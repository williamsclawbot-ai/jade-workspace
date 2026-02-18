/**
 * Helper to add meals to Jade's meal plan
 * Called from chat when user sends meal photo
 */

import { jadesMealsStorage } from './jadesMealsStorage';
import { shoppingListStore } from './shoppingListStore';

export function addMealToJade(
  day: string,
  mealType: string,
  mealName: string,
  macros: { calories?: number; protein?: number; fats?: number; carbs?: number },
  ingredients: Array<{ name: string; qty: string; unit: string }>
) {
  try {
    // 1. Add meal to Jade's meals storage
    const meal = jadesMealsStorage.addMeal(day, mealType, mealName, macros, ingredients);
    
    // 2. Extract ingredients to shopping list
    const shoppingItems = ingredients.map((ing) => ({
      ingredient: ing.name,
      quantity: ing.qty,
      source: 'jade' as const,
      sourceMetadata: {
        mealName,
        day,
        mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      },
    }));
    
    shoppingListStore.addBulk(shoppingItems);

    return {
      success: true,
      meal,
      ingredientsAdded: ingredients.length,
      message: `✅ Added "${mealName}" to Jade's ${day} ${mealType}! ${ingredients.length} ingredients added to Shopping List.`,
    };
  } catch (error) {
    console.error('Error adding meal:', error);
    return {
      success: false,
      message: `❌ Error adding meal: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export function clearAllMeals() {
  try {
    jadesMealsStorage.clearAll();
    return { success: true, message: '✅ All meals cleared!' };
  } catch (error) {
    return { success: false, message: `❌ Error clearing meals: ${error}` };
  }
}
