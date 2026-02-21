#!/usr/bin/env node

/**
 * Add New Recipes Script
 * Run this in the browser console or via Node to add recipes to localStorage
 */

const recipes = [
  {
    name: 'Cheezel Crumbed Chicken & Veggies (GF)',
    category: 'Dinner',
    ingredients: [
      { id: 'ing-new-1', name: 'Broccoli', qty: '80', unit: 'g' },
      { id: 'ing-new-2', name: 'Butter (Light)', qty: '8', unit: 'g' },
      { id: 'ing-new-3', name: 'Carrot', qty: '80', unit: 'g' },
      { id: 'ing-new-4', name: 'Cheezels', qty: '1', unit: 'pack' },
      { id: 'ing-new-5', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
      { id: 'ing-new-6', name: 'Egg White', qty: '60', unit: 'g' },
      { id: 'ing-new-7', name: 'Low Carb Potato - Carisma/Spud Lite', qty: '225', unit: 'g' }
    ],
    macros: { calories: 491, protein: 49, fats: 12, carbs: 42 },
    notes: 'GF option'
  },
  {
    name: 'Cantonese Chicken (GF)',
    category: 'Dinner',
    ingredients: [
      { id: 'ing-new-8', name: 'Broccoli', qty: '100', unit: 'g' },
      { id: 'ing-new-9', name: 'Cantonese Beef Stir Fry Sauce - Passage to Asia', qty: '70', unit: 'g' },
      { id: 'ing-new-10', name: 'Chicken Breast (Weighed Raw)', qty: '120', unit: 'g' },
      { id: 'ing-new-11', name: 'Fresh Garlic', qty: '0.05', unit: 'clove' },
      { id: 'ing-new-12', name: 'Onion', qty: '30', unit: 'g' },
      { id: 'ing-new-13', name: 'Rice Raw', qty: '35', unit: 'g' },
      { id: 'ing-new-14', name: 'Zucchini', qty: '80', unit: 'g' }
    ],
    macros: { calories: 403, protein: 34, fats: 3, carbs: 60 },
    notes: 'GF option, cook rice per package instructions'
  },
  {
    name: 'Chicken Gyros (GF)',
    category: 'Dinner',
    ingredients: [
      { id: 'ing-new-15', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
      { id: 'ing-new-16', name: 'Garlic & Herb All Natural Seasoning - Mingle', qty: '20', unit: 'g' },
      { id: 'ing-new-17', name: 'Lettuce', qty: '20', unit: 'g' },
      { id: 'ing-new-18', name: 'Low Carb Potato - Carisma/Spud Lite', qty: '200', unit: 'g' },
      { id: 'ing-new-19', name: 'Onion', qty: '15', unit: 'g' },
      { id: 'ing-new-20', name: 'Oregano', qty: '1', unit: 'g' },
      { id: 'ing-new-21', name: 'Tomato', qty: '50', unit: 'g' },
      { id: 'ing-new-22', name: 'Tzatziki - Willow Farm', qty: '20', unit: 'g' },
      { id: 'ing-new-23', name: 'White Wraps (50g) - Free From Gluten (Woolworths Only)', qty: '1', unit: 'pack' }
    ],
    macros: { calories: 510, protein: 44, fats: 8, carbs: 64 },
    notes: 'GF option'
  },
  {
    name: 'Rice Cakes with Honey and Banana',
    category: 'Snack',
    ingredients: [
      { id: 'ing-new-24', name: 'Banana', qty: '100', unit: 'g' },
      { id: 'ing-new-25', name: 'Honey', qty: '5', unit: 'g' },
      { id: 'ing-new-26', name: 'Rice Cakes - Sunrise', qty: '2', unit: 'cakes' }
    ],
    macros: { calories: 153, protein: 2, fats: 1, carbs: 34 },
    notes: 'Mid meal, top rice cake with sliced banana and drizzle with honey'
  },
  {
    name: 'Caramelized Pineapple Burger (GF)',
    category: 'Dinner',
    ingredients: [
      { id: 'ing-new-27', name: '50% Less Fat Cheese Slice - Bega', qty: '1', unit: 'slice' },
      { id: 'ing-new-28', name: 'Brioche Bun Gluten free (80g) - Woolworths Brand', qty: '1', unit: 'bun' },
      { id: 'ing-new-29', name: 'Extra Lean Beef Mince (5 Star) (Weighed Raw)', qty: '100', unit: 'g' },
      { id: 'ing-new-30', name: 'Lettuce', qty: '30', unit: 'g' },
      { id: 'ing-new-31', name: 'Natural Brown Sweetener - Natvia', qty: '10', unit: 'g' },
      { id: 'ing-new-32', name: 'Onion', qty: '20', unit: 'g' },
      { id: 'ing-new-33', name: 'Pineapple Canned - Golden Circle', qty: '50', unit: 'g' }
    ],
    macros: { calories: 424, protein: 33, fats: 11, carbs: 45 },
    notes: 'GF option, marinate pineapple ring in sweetener & caramelize in non-stick pan on medium-low heat'
  },
  {
    name: 'Rice Cakes with Peanut Butter and Banana',
    category: 'Snack',
    ingredients: [
      { id: 'ing-new-34', name: 'Banana', qty: '50', unit: 'g' },
      { id: 'ing-new-35', name: 'Peanut Butter - Bega', qty: '15', unit: 'g' },
      { id: 'ing-new-36', name: 'Rice Cakes - Sunrise', qty: '2', unit: 'cakes' }
    ],
    macros: { calories: 186, protein: 5, fats: 8, carbs: 22 },
    notes: 'Mid meal, cut banana into thin slices, spread peanut butter over rice cakes'
  },
  {
    name: 'Snacks Mix',
    category: 'Snack',
    ingredients: [
      { id: 'ing-new-37', name: 'Harvest Pea Snaps (Original Salted) (18g) - Calbee', qty: '1', unit: 'pack' },
      { id: 'ing-new-38', name: 'Kiwifruit', qty: '100', unit: 'g' },
      { id: 'ing-new-39', name: 'Medium Coffee on Skim Milk', qty: '1', unit: 'serve' }
    ],
    macros: { calories: 264, protein: 16, fats: 4, carbs: 37 },
    notes: 'Quick snack combo'
  }
];

// Browser console version
function addRecipesToBrowser() {
  const STORAGE_KEY = 'jade-recipe-database-v1';
  
  try {
    // Get existing recipes
    const stored = localStorage.getItem(STORAGE_KEY);
    let existing = stored ? JSON.parse(stored) : {};
    
    // Add new recipes
    recipes.forEach(recipe => {
      const id = `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();
      
      existing[id] = {
        ...recipe,
        id,
        createdAt: now,
        updatedAt: now
      };
    });
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    
    console.log('✅ Added 7 recipes successfully!');
    console.log(`Total recipes in system: ${Object.keys(existing).length}`);
    console.log('Recipes added:');
    recipes.forEach(r => console.log(`  • ${r.name}`));
    console.log('\nRefresh the page to see the recipes in Mission Control.');
    
  } catch (error) {
    console.error('Error adding recipes:', error);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { recipes, addRecipesToBrowser };
}
