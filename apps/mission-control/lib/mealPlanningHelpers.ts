/**
 * Meal Planning Helpers
 * Functions for Felicia to call from conversation
 * These manage the meal plan, ingredients, and shopping list for a specific week
 */

import { recipeDatabase } from './recipeDatabase';
import { weeklyMealPlanStorage, ShoppingItem, Ingredient } from './weeklyMealPlanStorage';

/**
 * Add a meal to a specific day in the week
 * Extracts ingredients and adds to shopping list automatically
 */
export function addMealToDay(weekId: string, day: string, mealType: string, recipeName: string) {
  try {
    // 1. Validate recipe exists
    const recipe = recipeDatabase.getRecipeByName(recipeName);
    if (!recipe) {
      return {
        success: false,
        message: `❌ Recipe "${recipeName}" not found. Check the name or add it to the database first.`,
      };
    }

    // 2. Add to week's meal plan
    weeklyMealPlanStorage.addMealToWeek(weekId, day, mealType, recipeName);

    // 3. Extract ingredients and add to shopping list
    extractAndAddIngredientsToShopping(weekId, recipe.ingredients, recipeName, day, mealType);

    return {
      success: true,
      message: `✅ Added "${recipeName}" to ${day}'s ${mealType}! ${recipe.ingredients.length} ingredients added to shopping list.`,
      recipe,
    };
  } catch (error) {
    console.error('Error adding meal:', error);
    return {
      success: false,
      message: `❌ Error adding meal: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Add the same meal to multiple days
 * Example: "Add weet-bix breakfast to Monday-Friday"
 */
export function addMealToMultipleDays(
  weekId: string,
  days: string[],
  mealType: string,
  recipeName: string
) {
  try {
    const recipe = recipeDatabase.getRecipeByName(recipeName);
    if (!recipe) {
      return {
        success: false,
        message: `❌ Recipe "${recipeName}" not found.`,
      };
    }

    days.forEach(day => {
      weeklyMealPlanStorage.addMealToWeek(weekId, day, mealType, recipeName);
      extractAndAddIngredientsToShopping(weekId, recipe.ingredients, recipeName, day, mealType);
    });

    return {
      success: true,
      message: `✅ Added "${recipeName}" to ${mealType} for ${days.join(', ')}! Ingredients added to shopping list.`,
      daysAdded: days.length,
    };
  } catch (error) {
    console.error('Error adding meals to multiple days:', error);
    return {
      success: false,
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Remove a meal from a day
 * Adjusts shopping list automatically
 */
export function removeMealFromDay(weekId: string, day: string, mealType: string) {
  try {
    const plan = weeklyMealPlanStorage.getWeekById(weekId);
    if (!plan) {
      return { success: false, message: `❌ Week ${weekId} not found.` };
    }

    const recipeName = plan.jades.meals[day]?.[mealType.toLowerCase() as keyof typeof plan.jades.meals[string]];
    if (!recipeName) {
      return { success: false, message: `❌ No meal found for ${day} ${mealType}.` };
    }

    // 1. Remove from plan
    weeklyMealPlanStorage.removeMealFromDay(weekId, day, mealType);

    // 2. Adjust shopping list
    removeIngredientsFromShopping(weekId, recipeName, day, mealType);

    return {
      success: true,
      message: `✅ Removed "${recipeName}" from ${day}'s ${mealType}. Ingredients adjusted in shopping list.`,
    };
  } catch (error) {
    console.error('Error removing meal:', error);
    return {
      success: false,
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Override a meal for a specific day
 * Used when user edits ingredients/macros for one day only
 * Creates a variant recipe name to track the change
 */
export function overrideMealForDay(
  weekId: string,
  day: string,
  mealType: string,
  ingredientOverrides?: Array<{ ingredientId: string; qty: string | number; unit: string }>,
  macroOverrides?: { calories?: number; protein?: number; fats?: number; carbs?: number }
) {
  try {
    const plan = weeklyMealPlanStorage.getWeekById(weekId);
    if (!plan) {
      return { success: false, message: `❌ Week ${weekId} not found.` };
    }

    const recipeName = plan.jades.meals[day]?.[mealType.toLowerCase() as keyof typeof plan.jades.meals[string]];
    if (!recipeName) {
      return { success: false, message: `❌ No meal found for ${day} ${mealType}.` };
    }

    // Create variant name
    const variantName = `${recipeName} (${day} - Modified)`;

    // Store override
    weeklyMealPlanStorage.overrideMealForDay(weekId, day, mealType, {
      recipeName,
      variantName,
      ingredientOverrides,
      macroOverrides,
    });

    // Update shopping list with new quantities
    if (ingredientOverrides) {
      removeIngredientsFromShopping(weekId, recipeName, day, mealType);
      extractAndAddIngredientsToShopping(weekId, ingredientOverrides as any, variantName, day, mealType);
    }

    return {
      success: true,
      message: `✅ Updated "${recipeName}" for ${day} ${mealType}. Changes affect this day only. (Saved as "${variantName}")`,
    };
  } catch (error) {
    console.error('Error overriding meal:', error);
    return {
      success: false,
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Extract ingredients from a recipe and add to week's shopping list
 * Combines quantities if ingredient already exists
 */
function extractAndAddIngredientsToShopping(
  weekId: string,
  ingredients: Ingredient[],
  recipeName: string,
  day: string,
  mealType: string
) {
  const plan = weeklyMealPlanStorage.getWeekById(weekId);
  if (!plan) return;

  const existingList = plan.shoppingList;

  ingredients.forEach(ingredient => {
    const existingItem = existingList.find(
      item => item.ingredient.toLowerCase() === ingredient.name.toLowerCase()
    );

    if (existingItem) {
      // Combine quantities (simple addition for numbers)
      const currentQty = parseFloat(String(existingItem.quantity || 0)) || 0;
      const newQty = parseFloat(String(ingredient.qty)) || 0;
      const combined = currentQty + newQty;

      weeklyMealPlanStorage.updateShoppingItemInWeek(weekId, existingItem.id, {
        quantity: combined.toString(),
        unit: ingredient.unit, // Use newer unit
      });
    } else {
      // Add new item
      weeklyMealPlanStorage.addShoppingItemToWeek(weekId, {
        ingredient: ingredient.name,
        quantity: ingredient.qty,
        unit: ingredient.unit,
        source: 'jade',
        sourceMetadata: {
          mealName: recipeName,
          day,
          mealType,
        },
      });
    }
  });
}

/**
 * Remove ingredients from shopping list when a meal is removed
 * Only removes if ingredient is not used by other meals on that day
 */
function removeIngredientsFromShopping(
  weekId: string,
  recipeName: string,
  day: string,
  mealType: string
) {
  const plan = weeklyMealPlanStorage.getWeekById(weekId);
  if (!plan) return;

  const recipe = recipeDatabase.getRecipeByName(recipeName);
  if (!recipe) return;

  const itemsToRemove = plan.shoppingList.filter(
    item =>
      item.sourceMetadata?.mealName === recipeName &&
      item.sourceMetadata?.day === day &&
      item.sourceMetadata?.mealType === mealType
  );

  itemsToRemove.forEach(item => {
    weeklyMealPlanStorage.removeShoppingItemFromWeek(weekId, item.id);
  });
}

/**
 * Get all meals for a week
 */
export function getWeekMeals(weekId: string): any {
  const plan = weeklyMealPlanStorage.getWeekById(weekId);
  if (!plan) return null;

  return {
    weekId: plan.weekId,
    weekStartDate: plan.weekStartDate,
    weekEndDate: plan.weekEndDate,
    jades: plan.jades.meals,
    harveysAssignedMeals: plan.harveys.meals,
  };
}

/**
 * Get shopping list for a week
 */
export function getWeekShoppingList(weekId: string) {
  return weeklyMealPlanStorage.getShoppingListForWeek(weekId);
}

/**
 * Calculate macros for a day
 */
export function calculateDayMacros(
  weekId: string,
  day: string
): { calories: number; protein: number; fats: number; carbs: number } {
  const plan = weeklyMealPlanStorage.getWeekById(weekId);
  if (!plan) return { calories: 0, protein: 0, fats: 0, carbs: 0 };

  const dayMeals = plan.jades.meals[day] || {};
  const dayOverrides = plan.jades.dayOverrides[day] || {};

  let totals = { calories: 0, protein: 0, fats: 0, carbs: 0 };

  console.log(`📊 Calculating macros for ${day}:`, dayMeals);

  // Sum recipes
  Object.entries(dayMeals).forEach(([mealType, recipeName]) => {
    if (!recipeName) return;

    console.log(`  Looking up recipe: "${recipeName}"`);
    const recipe = recipeDatabase.getRecipeByName(recipeName);
    if (recipe) {
      console.log(`  ✅ Found recipe, macros:`, recipe.macros);
      totals.calories += recipe.macros.calories;
      totals.protein += recipe.macros.protein;
      totals.fats += recipe.macros.fats;
      totals.carbs += recipe.macros.carbs;
    } else {
      console.log(`  ❌ Recipe NOT found`);
    }
  });

  // Apply overrides
  Object.entries(dayOverrides).forEach(([mealType, override]) => {
    if (override.macroOverrides) {
      totals.calories += override.macroOverrides.calories ?? 0;
      totals.protein += override.macroOverrides.protein ?? 0;
      totals.fats += override.macroOverrides.fats ?? 0;
      totals.carbs += override.macroOverrides.carbs ?? 0;
    }
  });

  return totals;
}

/**
 * Get recipe details for display in modal
 */
export function getRecipeDetails(recipeName: string) {
  return recipeDatabase.getRecipeByName(recipeName);
}

/**
 * Create or update a recipe in the database
 */
export function saveRecipe(
  name: string,
  ingredients: Ingredient[],
  macros: { calories: number; protein: number; fats: number; carbs: number },
  instructions?: string,
  notes?: string,
  category?: string
) {
  try {
    // Check if recipe exists
    const existing = recipeDatabase.getRecipeByName(name);

    if (existing) {
      recipeDatabase.updateRecipe(existing.id, {
        name,
        ingredients,
        macros,
        instructions,
        notes,
        category,
      });
      return {
        success: true,
        message: `✅ Updated recipe "${name}"`,
      };
    } else {
      recipeDatabase.addRecipe({
        name,
        ingredients,
        macros,
        instructions,
        notes,
        category,
      });
      return {
        success: true,
        message: `✅ Added new recipe "${name}"`,
      };
    }
  } catch (error) {
    console.error('Error saving recipe:', error);
    return {
      success: false,
      message: `❌ Error saving recipe: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
