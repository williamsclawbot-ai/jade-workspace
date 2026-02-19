/**
 * Harvey's Meal Options with Ingredient Data
 * Allows auto-population of shopping list when meals are assigned
 */

export interface HarveyMealData {
  name: string;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  notes?: string;
}

export const harveysMealDatabase: Record<string, HarveyMealData> = {
  // ===== CARB/PROTEIN =====
  'ABC Muffins': {
    name: 'ABC Muffins',
    ingredients: [
      { name: 'ABC Muffins', quantity: '1', unit: 'muffin' },
    ],
    notes: 'Store-bought',
  },
  'Banana Muffins': {
    name: 'Banana Muffins',
    ingredients: [
      { name: 'Banana Muffins', quantity: '1', unit: 'muffin' },
    ],
    notes: 'Store-bought',
  },
  'Muesli Bar': {
    name: 'Muesli Bar',
    ingredients: [
      { name: 'Muesli Bar', quantity: '1', unit: 'bar' },
    ],
  },
  'Carmans Oat Bar': {
    name: 'Carmans Oat Bar',
    ingredients: [
      { name: 'Carmans Oat Bar', quantity: '1', unit: 'bar' },
    ],
  },
  'Rice Bubble Bars (homemade)': {
    name: 'Rice Bubble Bars (homemade)',
    ingredients: [
      { name: 'Rice Bubbles cereal', quantity: '3', unit: 'cups' },
      { name: 'Butter', quantity: '100', unit: 'g' },
      { name: 'Marshmallows', quantity: '300', unit: 'g' },
    ],
    notes: 'Makes ~12 bars',
  },
  'Ham & Cheese Scroll': {
    name: 'Ham & Cheese Scroll',
    ingredients: [
      { name: 'Ham & Cheese Scroll', quantity: '1', unit: 'scroll' },
    ],
    notes: 'Store-bought',
  },
  'Pizza Scroll': {
    name: 'Pizza Scroll',
    ingredients: [
      { name: 'Pizza Scroll', quantity: '1', unit: 'scroll' },
    ],
    notes: 'Store-bought',
  },
  'Cheese & Vegemite (+backup)': {
    name: 'Cheese & Vegemite (+backup)',
    ingredients: [
      { name: 'Bread', quantity: '2', unit: 'slices' },
      { name: 'Cheese', quantity: '1', unit: 'slice' },
      { name: 'Vegemite', quantity: '0.5', unit: 'tsp' },
    ],
  },
  'Ham & Cheese Sandwich': {
    name: 'Ham & Cheese Sandwich',
    ingredients: [
      { name: 'Bread', quantity: '2', unit: 'slices' },
      { name: 'Ham', quantity: '50', unit: 'g' },
      { name: 'Cheese', quantity: '1', unit: 'slice' },
    ],
  },
  'Nut Butter & Honey (+backup)': {
    name: 'Nut Butter & Honey (+backup)',
    ingredients: [
      { name: 'Bread', quantity: '2', unit: 'slices' },
      { name: 'Nut Butter', quantity: '2', unit: 'tbsp' },
      { name: 'Honey', quantity: '1', unit: 'tsp' },
    ],
  },
  'Pasta & Boiled Egg (+backup)': {
    name: 'Pasta & Boiled Egg (+backup)',
    ingredients: [
      { name: 'Pasta', quantity: '100', unit: 'g' },
      { name: 'Egg', quantity: '1', unit: 'whole' },
      { name: 'Butter', quantity: '10', unit: 'g' },
    ],
  },
  'Avo & Cream Cheese (+backup)': {
    name: 'Avo & Cream Cheese (+backup)',
    ingredients: [
      { name: 'Bread', quantity: '2', unit: 'slices' },
      { name: 'Avocado', quantity: '0.5', unit: 'whole' },
      { name: 'Cream Cheese', quantity: '2', unit: 'tbsp' },
    ],
  },
  'Sweet Potato & Chicken': {
    name: 'Sweet Potato & Chicken',
    ingredients: [
      { name: 'Sweet Potato', quantity: '150', unit: 'g' },
      { name: 'Chicken', quantity: '100', unit: 'g' },
    ],
  },
  'Choc Chip Muffins': {
    name: 'Choc Chip Muffins',
    ingredients: [
      { name: 'Choc Chip Muffins', quantity: '1', unit: 'muffin' },
    ],
    notes: 'Store-bought',
  },
  'Weekly New Muffin': {
    name: 'Weekly New Muffin',
    ingredients: [
      { name: 'Muffin (new variety)', quantity: '1', unit: 'muffin' },
    ],
    notes: 'Rotation item',
  },
  'Weekly New Bar': {
    name: 'Weekly New Bar',
    ingredients: [
      { name: 'Snack Bar (new variety)', quantity: '1', unit: 'bar' },
    ],
    notes: 'Rotation item',
  },

  // ===== FRUIT =====
  'Apple (introduce)': {
    name: 'Apple (introduce)',
    ingredients: [
      { name: 'Apple', quantity: '1', unit: 'whole' },
    ],
  },
  'Pear': {
    name: 'Pear',
    ingredients: [
      { name: 'Pear', quantity: '1', unit: 'whole' },
    ],
  },
  'Oranges': {
    name: 'Oranges',
    ingredients: [
      { name: 'Orange', quantity: '1', unit: 'whole' },
    ],
  },
  'Banana': {
    name: 'Banana',
    ingredients: [
      { name: 'Banana', quantity: '1', unit: 'whole' },
    ],
  },
  'Grapes': {
    name: 'Grapes',
    ingredients: [
      { name: 'Grapes', quantity: '100', unit: 'g' },
    ],
  },
  'Strawberries': {
    name: 'Strawberries',
    ingredients: [
      { name: 'Strawberries', quantity: '150', unit: 'g' },
    ],
  },
  'Raspberries': {
    name: 'Raspberries',
    ingredients: [
      { name: 'Raspberries', quantity: '100', unit: 'g' },
    ],
  },
  'Blueberries': {
    name: 'Blueberries',
    ingredients: [
      { name: 'Blueberries', quantity: '100', unit: 'g' },
    ],
  },
  'Kiwi Fruit': {
    name: 'Kiwi Fruit',
    ingredients: [
      { name: 'Kiwi Fruit', quantity: '1', unit: 'whole' },
    ],
  },
  'Plum': {
    name: 'Plum',
    ingredients: [
      { name: 'Plum', quantity: '1', unit: 'whole' },
    ],
  },
  'Nectarine': {
    name: 'Nectarine',
    ingredients: [
      { name: 'Nectarine', quantity: '1', unit: 'whole' },
    ],
  },

  // ===== VEGETABLES =====
  'Mixed Frozen Veg ⭐ LOVES': {
    name: 'Mixed Frozen Veg ⭐ LOVES',
    ingredients: [
      { name: 'Mixed Frozen Vegetables', quantity: '100', unit: 'g' },
    ],
  },
  'Cucumber (keep trying)': {
    name: 'Cucumber (keep trying)',
    ingredients: [
      { name: 'Cucumber', quantity: '50', unit: 'g' },
    ],
  },
  'Tomato (keep trying)': {
    name: 'Tomato (keep trying)',
    ingredients: [
      { name: 'Tomato', quantity: '1', unit: 'whole' },
    ],
  },
  'Capsicum': {
    name: 'Capsicum',
    ingredients: [
      { name: 'Capsicum', quantity: '0.5', unit: 'whole' },
    ],
  },
  'Broccoli (new)': {
    name: 'Broccoli (new)',
    ingredients: [
      { name: 'Broccoli', quantity: '100', unit: 'g' },
    ],
  },
  'Green Beans (new)': {
    name: 'Green Beans (new)',
    ingredients: [
      { name: 'Green Beans', quantity: '100', unit: 'g' },
    ],
  },
  'Roasted Sweet Potato (new)': {
    name: 'Roasted Sweet Potato (new)',
    ingredients: [
      { name: 'Sweet Potato', quantity: '100', unit: 'g' },
    ],
  },

  // ===== CRUNCH =====
  'Star Crackers': {
    name: 'Star Crackers',
    ingredients: [
      { name: 'Star Crackers', quantity: '20', unit: 'g' },
    ],
  },
  'Rice Cakes': {
    name: 'Rice Cakes',
    ingredients: [
      { name: 'Rice Cakes', quantity: '2', unit: 'whole' },
    ],
  },
  'Pikelets/Pancakes': {
    name: 'Pikelets/Pancakes',
    ingredients: [
      { name: 'Pikelets', quantity: '2', unit: 'whole' },
    ],
  },
  'Veggie Chips': {
    name: 'Veggie Chips',
    ingredients: [
      { name: 'Veggie Chips', quantity: '20', unit: 'g' },
    ],
  },
  'Soft Pretzels': {
    name: 'Soft Pretzels',
    ingredients: [
      { name: 'Soft Pretzels', quantity: '1', unit: 'whole' },
    ],
  },
  'Cheese Crackers': {
    name: 'Cheese Crackers',
    ingredients: [
      { name: 'Cheese Crackers', quantity: '20', unit: 'g' },
    ],
  },
  'Breadsticks/Grissini': {
    name: 'Breadsticks/Grissini',
    ingredients: [
      { name: 'Breadsticks', quantity: '3', unit: 'whole' },
    ],
  },

  // ===== AFTERNOON SNACKS =====
  'Smoothie (banana, berries, yogurt, milk)': {
    name: 'Smoothie (banana, berries, yogurt, milk)',
    ingredients: [
      { name: 'Banana', quantity: '0.5', unit: 'whole' },
      { name: 'Mixed berries', quantity: '100', unit: 'g' },
      { name: 'Yogurt', quantity: '100', unit: 'g' },
      { name: 'Milk', quantity: '100', unit: 'ml' },
    ],
  },
  'Yogurt + Fruit': {
    name: 'Yogurt + Fruit',
    ingredients: [
      { name: 'Yogurt', quantity: '150', unit: 'g' },
      { name: 'Fruit (fresh or berries)', quantity: '100', unit: 'g' },
    ],
  },
  'Crackers + Cheese': {
    name: 'Crackers + Cheese',
    ingredients: [
      { name: 'Crackers', quantity: '15', unit: 'g' },
      { name: 'Cheese', quantity: '30', unit: 'g' },
    ],
  },
  'Toast + Nut Butter': {
    name: 'Toast + Nut Butter',
    ingredients: [
      { name: 'Bread', quantity: '1', unit: 'slice' },
      { name: 'Nut Butter', quantity: '1', unit: 'tbsp' },
    ],
  },
  'Fruit Salad': {
    name: 'Fruit Salad',
    ingredients: [
      { name: 'Mixed fruit', quantity: '200', unit: 'g' },
    ],
  },
  'Rice Cakes + Honey': {
    name: 'Rice Cakes + Honey',
    ingredients: [
      { name: 'Rice Cakes', quantity: '2', unit: 'whole' },
      { name: 'Honey', quantity: '1', unit: 'tbsp' },
    ],
  },

  // ===== EVERYDAY =====
  'Yogurt (every lunch)': {
    name: 'Yogurt (every lunch)',
    ingredients: [
      { name: 'Yogurt', quantity: '200', unit: 'g' },
    ],
  },
};

/**
 * Get ingredients for a Harvey meal
 */
export function getHarveysMealIngredients(mealName: string): HarveyMealData | null {
  return harveysMealDatabase[mealName] || null;
}

/**
 * Flatten ingredients from multiple meals (for shopping list)
 */
export function flattenHarveysMeals(mealNames: string[]): Array<{
  name: string;
  quantity: string;
  unit: string;
  mealSources: string[]; // Which meals this ingredient comes from
}> {
  const ingredientMap: Record<string, { quantity: number; unit: string; mealSources: string[] }> = {};

  mealNames.forEach(mealName => {
    const mealData = getHarveysMealIngredients(mealName);
    if (!mealData) return;

    mealData.ingredients.forEach(ing => {
      const key = `${ing.name}|${ing.unit}`.toLowerCase();
      if (!ingredientMap[key]) {
        ingredientMap[key] = {
          quantity: parseFloat(ing.quantity) || 1,
          unit: ing.unit,
          mealSources: [mealName],
        };
      } else {
        ingredientMap[key].quantity += parseFloat(ing.quantity) || 1;
        ingredientMap[key].mealSources.push(mealName);
      }
    });
  });

  return Object.entries(ingredientMap).map(([key, data]) => {
    const [name] = key.split('|');
    return {
      name,
      quantity: data.quantity.toString(),
      unit: data.unit,
      mealSources: [...new Set(data.mealSources)], // Deduplicate
    };
  });
}
