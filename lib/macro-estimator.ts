/**
 * Macro Estimator
 * Calculates estimated macros from ingredients based on USDA & food database values
 * Handles intelligent unit conversions (g, ml, cups, tbsp, tsp, oz, etc.)
 */

// Common ingredient macros (per 100g or standard unit)
// Format: { name: { calories, protein, fat, carbs, unit } }
const INGREDIENT_MACROS: Record<string, { calories: number; protein: number; fat: number; carbs: number; unit: string }> = {
  // Proteins
  'chicken breast': { calories: 165, protein: 31, fat: 3.6, carbs: 0, unit: 'g' },
  'beef': { calories: 250, protein: 26, fat: 15, carbs: 0, unit: 'g' },
  'beef mince': { calories: 217, protein: 23, fat: 13, carbs: 0, unit: 'g' },
  'beef strips': { calories: 250, protein: 26, fat: 15, carbs: 0, unit: 'g' },
  'salmon': { calories: 208, protein: 20, fat: 13, carbs: 0, unit: 'g' },
  'tuna': { calories: 144, protein: 30, fat: 1, carbs: 0, unit: 'g' },
  'eggs': { calories: 155, protein: 13, fat: 11, carbs: 1.1, unit: 'g' },
  'egg': { calories: 155, protein: 13, fat: 11, carbs: 1.1, unit: 'g' },
  'greek yogurt': { calories: 59, protein: 10.2, fat: 0.4, carbs: 3.3, unit: 'g' },
  'yogurt': { calories: 59, protein: 10.2, fat: 0.4, carbs: 3.3, unit: 'g' },
  'peanut butter': { calories: 588, protein: 25.8, fat: 50, carbs: 20, unit: 'g' },
  'milk': { calories: 61, protein: 3.2, fat: 3.3, carbs: 4.8, unit: 'ml' },
  'almond milk': { calories: 30, protein: 1.1, fat: 2.5, carbs: 1.3, unit: 'ml' },
  'cottage cheese': { calories: 98, protein: 11, fat: 5, carbs: 3.5, unit: 'g' },

  // Vegetables
  'carrot': { calories: 41, protein: 0.9, fat: 0.2, carbs: 10, unit: 'g' },
  'lettuce': { calories: 15, protein: 1.2, fat: 0.2, carbs: 2.9, unit: 'g' },
  'tomato': { calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, unit: 'g' },
  'zucchini': { calories: 17, protein: 1.5, fat: 0.4, carbs: 3.1, unit: 'g' },
  'mushroom': { calories: 22, protein: 3.1, fat: 0.3, carbs: 3.3, unit: 'g' },
  'capsicum': { calories: 30, protein: 1.0, fat: 0.3, carbs: 6.0, unit: 'g' },
  'bell pepper': { calories: 30, protein: 1.0, fat: 0.3, carbs: 6.0, unit: 'g' },
  'onion': { calories: 40, protein: 1.1, fat: 0.1, carbs: 9, unit: 'g' },
  'garlic': { calories: 149, protein: 6.4, fat: 0.5, carbs: 33, unit: 'g' },

  // Carbs
  'rice': { calories: 130, protein: 2.7, fat: 0.3, carbs: 28, unit: 'g' },
  'pasta': { calories: 131, protein: 5.0, fat: 1.1, carbs: 25, unit: 'g' },
  'noodles': { calories: 131, protein: 5.0, fat: 1.1, carbs: 25, unit: 'g' },
  'bread': { calories: 265, protein: 9.0, fat: 3.3, carbs: 49, unit: 'g' },
  'banana': { calories: 89, protein: 1.1, fat: 0.3, carbs: 23, unit: 'g' },
  'apple': { calories: 52, protein: 0.3, fat: 0.2, carbs: 14, unit: 'g' },
  'oats': { calories: 389, protein: 17, fat: 6.9, carbs: 66, unit: 'g' },
  'flour': { calories: 364, protein: 10, fat: 1.0, carbs: 76, unit: 'g' },
  'sugar': { calories: 387, protein: 0, fat: 0, carbs: 100, unit: 'g' },

  // Fats
  'olive oil': { calories: 884, protein: 0, fat: 100, carbs: 0, unit: 'g' },
  'butter': { calories: 717, protein: 0.9, fat: 81, carbs: 0.1, unit: 'g' },
  'avocado': { calories: 160, protein: 2.0, fat: 15, carbs: 9, unit: 'g' },
  'cheese': { calories: 402, protein: 25, fat: 33, carbs: 1.3, unit: 'g' },

  // Sauces & Condiments
  'soy sauce': { calories: 53, protein: 8.1, fat: 0.5, carbs: 5.0, unit: 'g' },
  'pesto': { calories: 360, protein: 12, fat: 28, carbs: 13, unit: 'g' },
  'honey': { calories: 304, protein: 0.3, fat: 0, carbs: 82, unit: 'g' },
  'maple syrup': { calories: 260, protein: 0, fat: 0, carbs: 67, unit: 'g' },
  'jam': { calories: 278, protein: 0.4, fat: 0.1, carbs: 70, unit: 'g' },
  'aioli': { calories: 680, protein: 1.0, fat: 75, carbs: 0.6, unit: 'g' },

  // Spices & Seasonings
  'salt': { calories: 0, protein: 0, fat: 0, carbs: 0, unit: 'g' },
  'cinnamon': { calories: 247, protein: 3.9, fat: 3.3, carbs: 81, unit: 'g' },
  'vanilla extract': { calories: 288, protein: 0, fat: 0, carbs: 12, unit: 'g' },

  // Grains & Cereals
  'weet-bix': { calories: 356, protein: 12, fat: 3, carbs: 74, unit: 'g' },
  'granola': { calories: 471, protein: 12, fat: 23, carbs: 60, unit: 'g' },
  'popcorn': { calories: 387, protein: 12.3, fat: 9.2, carbs: 77, unit: 'g' },

  // Nuts & Seeds
  'pistachio': { calories: 560, protein: 20, fat: 45, carbs: 28, unit: 'g' },
  'almonds': { calories: 579, protein: 21, fat: 50, carbs: 22, unit: 'g' },
  'sunflower seeds': { calories: 584, protein: 20, fat: 51, carbs: 20, unit: 'g' },
  'chocolate': { calories: 535, protein: 4.9, fat: 30, carbs: 61, unit: 'g' },
  'dark chocolate': { calories: 546, protein: 4.9, fat: 31, carbs: 61, unit: 'g' },
  'cacao': { calories: 228, protein: 12, fat: 12, carbs: 13, unit: 'g' },
};

// Unit conversion helpers (to grams for consistency)
const UNIT_TO_GRAMS: Record<string, number> = {
  'g': 1,
  'gram': 1,
  'grams': 1,
  'kg': 1000,
  'kilogram': 1000,
  'kilograms': 1000,
  'oz': 28.35,
  'ounce': 28.35,
  'ounces': 28.35,
  'ml': 1, // Approximate for water/milk
  'milliliter': 1,
  'milliliters': 1,
  'l': 1000,
  'liter': 1000,
  'liters': 1000,
  'cup': 240, // Approximate
  'cups': 240,
  'tbsp': 15, // Approximate
  'tablespoon': 15,
  'tablespoons': 15,
  'tsp': 5, // Approximate
  'teaspoon': 5,
  'teaspoons': 5,
};

export interface ParsedIngredient {
  name: string;
  quantity: number; // In grams
  unit: string; // Original unit
  macros: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

export interface MacroEstimate {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

/**
 * Parse an ingredient string like "150g chicken breast" or "2 cups flour"
 * Returns { name, quantity, unit, macros }
 */
export function parseIngredient(ingredientStr: string): ParsedIngredient | null {
  if (!ingredientStr || ingredientStr.trim() === '') return null;

  const trimmed = ingredientStr.trim();

  // Try to match: quantity unit? ingredient_name
  // Examples: "150g chicken breast", "2 cups flour", "1 tbsp honey"
  const match = trimmed.match(/^([\d.]+)\s*([a-z]*)\s+(.+)$/i);

  if (!match) {
    // Maybe just ingredient name without quantity (assume 100g)
    const macro = lookupMacro(trimmed);
    if (macro) {
      return {
        name: trimmed,
        quantity: 100,
        unit: 'g',
        macros: calculateMacros(100, macro),
      };
    }
    return null;
  }

  const [, qtyStr, unitStr, ingredientName] = match;
  const quantity = parseFloat(qtyStr);
  const unit = unitStr.toLowerCase() || 'g';

  // Lookup macro info
  const macro = lookupMacro(ingredientName);
  if (!macro) {
    // Ingredient not found, return null or with estimated values
    return null;
  }

  // Convert to grams
  const conversionFactor = UNIT_TO_GRAMS[unit] || UNIT_TO_GRAMS['g'];
  const gramsQuantity = quantity * conversionFactor;

  return {
    name: ingredientName,
    quantity: gramsQuantity,
    unit,
    macros: calculateMacros(gramsQuantity, macro),
  };
}

/**
 * Lookup ingredient macros by name (fuzzy match)
 */
function lookupMacro(ingredientName: string): { calories: number; protein: number; fat: number; carbs: number; unit: string } | null {
  const lower = ingredientName.toLowerCase().trim();

  // Exact match
  if (INGREDIENT_MACROS[lower]) {
    return INGREDIENT_MACROS[lower];
  }

  // Fuzzy match - find best match containing keyword
  for (const [key, value] of Object.entries(INGREDIENT_MACROS)) {
    if (lower.includes(key) || key.includes(lower)) {
      return value;
    }
  }

  return null;
}

/**
 * Calculate macros for a given quantity of ingredient
 * baseMacro is per 100g unless otherwise specified
 */
function calculateMacros(quantityInGrams: number, baseMacro: { calories: number; protein: number; fat: number; carbs: number; unit: string }): MacroEstimate {
  // Assume baseMacro is per 100g (or 100ml)
  const factor = quantityInGrams / 100;

  return {
    calories: Math.round(baseMacro.calories * factor),
    protein: Math.round(baseMacro.protein * factor * 10) / 10, // 1 decimal
    fat: Math.round(baseMacro.fat * factor * 10) / 10,
    carbs: Math.round(baseMacro.carbs * factor * 10) / 10,
  };
}

/**
 * Estimate total macros from an array of ingredient strings
 */
export function estimateMacrosFromIngredients(ingredientStrings: string[]): MacroEstimate {
  const parsed = ingredientStrings
    .map(ing => parseIngredient(ing))
    .filter((ing): ing is ParsedIngredient => ing !== null);

  if (parsed.length === 0) {
    return { calories: 0, protein: 0, fat: 0, carbs: 0 };
  }

  return {
    calories: Math.round(parsed.reduce((sum, ing) => sum + ing.macros.calories, 0)),
    protein: Math.round(parsed.reduce((sum, ing) => sum + ing.macros.protein, 0) * 10) / 10,
    fat: Math.round(parsed.reduce((sum, ing) => sum + ing.macros.fat, 0) * 10) / 10,
    carbs: Math.round(parsed.reduce((sum, ing) => sum + ing.macros.carbs, 0) * 10) / 10,
  };
}

/**
 * Get a simple estimate based on calorie count
 * If we can't parse ingredients, estimate macros from total calories (rough approximation)
 */
export function estimateMacrosFromCalories(totalCalories: number): MacroEstimate {
  // Rough distribution: balanced (30% protein, 35% carbs, 35% fat)
  // Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
  const proteinCals = totalCalories * 0.3;
  const carbsCals = totalCalories * 0.35;
  const fatCals = totalCalories * 0.35;

  return {
    calories: totalCalories,
    protein: Math.round(proteinCals / 4),
    carbs: Math.round(carbsCals / 4),
    fat: Math.round(fatCals / 9),
  };
}

/**
 * Get supported ingredients (for validation/autocomplete)
 */
export function getSupportedIngredients(): string[] {
  return Object.keys(INGREDIENT_MACROS);
}
