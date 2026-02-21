/**
 * Recipe Database
 * Clean, simple persistent storage for recipes using localStorage
 */

export interface Ingredient {
  id: string;
  name: string;
  qty: string | number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  category?: string;
  ingredients: Ingredient[];
  macros: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
  };
  instructions?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'jade-recipe-database-v1';

class RecipeDatabase {
  private recipes: Map<string, Recipe> = new Map();

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        this.recipes = new Map(Object.entries(data));
      }
    } catch (e) {
      console.error('Error loading recipes:', e);
    }
  }

  private save() {
    if (typeof window === 'undefined') return;
    try {
      const data = Object.fromEntries(this.recipes);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: JSON.stringify(data) }));
    } catch (e) {
      console.error('Error saving recipes:', e);
    }
  }

  reload() {
    this.recipes.clear();
    this.load();
  }

  getAllRecipes(): Recipe[] {
    return Array.from(this.recipes.values());
  }

  getRecipeByName(name: string): Recipe | null {
    return Array.from(this.recipes.values()).find(r => r.name === name) || null;
  }

  getRecipeById(id: string): Recipe | null {
    return this.recipes.get(id) || null;
  }

  addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Recipe {
    const id = `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const newRecipe: Recipe = { ...recipe, id, createdAt: now, updatedAt: now };
    this.recipes.set(id, newRecipe);
    this.save();
    return newRecipe;
  }

  updateRecipe(id: string, updates: Partial<Recipe>): Recipe {
    const recipe = this.recipes.get(id);
    if (!recipe) throw new Error(`Recipe ${id} not found`);
    const updated: Recipe = { ...recipe, ...updates, id: recipe.id, createdAt: recipe.createdAt, updatedAt: Date.now() };
    this.recipes.set(id, updated);
    this.save();
    return updated;
  }

  deleteRecipe(id: string): void {
    this.recipes.delete(id);
    this.save();
  }

  searchRecipes(query: string): Recipe[] {
    const lower = query.toLowerCase();
    return Array.from(this.recipes.values()).filter(
      r => r.name.toLowerCase().includes(lower) || 
           r.notes?.toLowerCase().includes(lower) ||
           r.ingredients.some(ing => ing.name.toLowerCase().includes(lower))
    );
  }
}

export const recipeDatabase = new RecipeDatabase();

// ======================
// INITIALIZATION: Add recipes to localStorage if they don't exist
// ======================
if (typeof window !== 'undefined') {
  const NEW_RECIPES = [
    {
      name: 'Snacks',
      category: 'Snack',
      ingredients: [
        { id: '1', name: 'Harvest Pea Snaps (Original Salted) (18g) - Calbee', qty: '1', unit: 'pack' },
        { id: '2', name: 'Kiwifruit', qty: '100', unit: 'g' },
        { id: '3', name: 'Medium Coffee on Skim Milk', qty: '1', unit: 'serve' },
      ],
      macros: { calories: 264, protein: 16, fats: 4, carbs: 37 },
    },
    {
      name: 'Rice Cakes with Peanut Butter and Banana (Mid Meal)',
      category: 'Snack',
      ingredients: [
        { id: '1', name: 'Banana', qty: '50', unit: 'g' },
        { id: '2', name: 'Peanut Butter - Bega', qty: '15', unit: 'g' },
        { id: '3', name: 'Rice Cakes - Sunrise', qty: '2', unit: 'cakes' },
      ],
      macros: { calories: 186, protein: 5, fats: 8, carbs: 22 },
    },
    {
      name: 'Caramelized Pineapple Burger (GF)',
      category: 'Dinner',
      ingredients: [
        { id: '1', name: '50% Less Fat Cheese Slice - Bega', qty: '1', unit: 'slice' },
        { id: '2', name: 'Brioche Bun Gluten free - Woolworths', qty: '1', unit: 'bun' },
        { id: '3', name: 'Extra Lean Beef Mince (5 Star)', qty: '100', unit: 'g' },
        { id: '4', name: 'Lettuce', qty: '30', unit: 'g' },
        { id: '5', name: 'Natural Brown Sweetener - Natvia', qty: '10', unit: 'g' },
        { id: '6', name: 'Onion', qty: '20', unit: 'g' },
        { id: '7', name: 'Pineapple Canned - Golden Circle', qty: '50', unit: 'g' },
      ],
      macros: { calories: 424, protein: 33, fats: 11, carbs: 45 },
    },
    {
      name: 'Rice Cakes with Honey and Banana (Mid Meal)',
      category: 'Snack',
      ingredients: [
        { id: '1', name: 'Banana', qty: '100', unit: 'g' },
        { id: '2', name: 'Honey', qty: '5', unit: 'g' },
        { id: '3', name: 'Rice Cakes - Sunrise', qty: '2', unit: 'cakes' },
      ],
      macros: { calories: 153, protein: 2, fats: 1, carbs: 34 },
    },
    {
      name: 'Chicken Gyros (GF)',
      category: 'Dinner',
      ingredients: [
        { id: '1', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
        { id: '2', name: 'Garlic & Herb Seasoning - Mingle', qty: '20', unit: 'g' },
        { id: '3', name: 'Lettuce', qty: '20', unit: 'g' },
        { id: '4', name: 'Low Carb Potato - Carisma/Spud Lite', qty: '200', unit: 'g' },
        { id: '5', name: 'Onion', qty: '15', unit: 'g' },
        { id: '6', name: 'Oregano', qty: '1', unit: 'g' },
        { id: '7', name: 'Tomato', qty: '50', unit: 'g' },
        { id: '8', name: 'Tzatziki - Willow Farm', qty: '20', unit: 'g' },
        { id: '9', name: 'White Wraps Gluten Free - Woolworths', qty: '1', unit: 'wrap' },
      ],
      macros: { calories: 510, protein: 44, fats: 8, carbs: 64 },
    },
    {
      name: 'Cantonese Chicken (GF)',
      category: 'Dinner',
      ingredients: [
        { id: '1', name: 'Broccoli', qty: '100', unit: 'g' },
        { id: '2', name: 'Cantonese Beef Stir Fry Sauce - Passage to Asia', qty: '70', unit: 'g' },
        { id: '3', name: 'Chicken Breast (Weighed Raw)', qty: '120', unit: 'g' },
        { id: '4', name: 'Fresh Garlic', qty: '0.05', unit: 'clove' },
        { id: '5', name: 'Onion', qty: '30', unit: 'g' },
        { id: '6', name: 'Rice Raw', qty: '35', unit: 'g' },
        { id: '7', name: 'Zucchini', qty: '80', unit: 'g' },
      ],
      macros: { calories: 403, protein: 34, fats: 3, carbs: 60 },
    },
    {
      name: 'Cheezel Crumbed Chicken & Veggies (GF)',
      category: 'Dinner',
      ingredients: [
        { id: '1', name: 'Broccoli', qty: '80', unit: 'g' },
        { id: '2', name: 'Butter (Light)', qty: '8', unit: 'g' },
        { id: '3', name: 'Carrot', qty: '80', unit: 'g' },
        { id: '4', name: 'Cheezels', qty: '1', unit: 'pack' },
        { id: '5', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
        { id: '6', name: 'Egg White', qty: '60', unit: 'g' },
        { id: '7', name: 'Low Carb Potato - Carisma/Spud Lite', qty: '225', unit: 'g' },
      ],
      macros: { calories: 491, protein: 49, fats: 12, carbs: 42 },
    },
  ];

  // Check if recipes need to be added
  const stored = localStorage.getItem(STORAGE_KEY);
  const data = stored ? JSON.parse(stored) : {};
  const existingNames = new Set(Object.values(data as any).map((r: any) => r.name));
  
  let addedCount = 0;
  NEW_RECIPES.forEach(recipe => {
    if (!existingNames.has(recipe.name)) {
      const id = `recipe-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;
      data[id] = {
        ...recipe,
        id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      addedCount++;
    }
  });

  if (addedCount > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    recipeDatabase.reload();
    console.log(`✅ Recipe initialization: Added ${addedCount} recipes. Total: ${Object.keys(data).length}`);
  }
}
