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
// SEED RECIPES - Week of 3 March 2026
// Added for Olive Brief: Meal Prep - 25 Feb 2026
// ======================

const seedRecipesForWeekOf3March = [
  {
    name: "Coconut Chicken Curry",
    category: "Dinner",
    ingredients: [
      { id: "1", name: "Mild curry powder", qty: 1.5, unit: "tbsp" },
      { id: "2", name: "Coconut cream", qty: 400, unit: "ml" },
      { id: "3", name: "Garlic cloves", qty: 6, unit: "" },
      { id: "4", name: "Brown onion", qty: 1, unit: "" },
      { id: "5", name: "Fresh ginger", qty: 1, unit: "cm" },
      { id: "6", name: "Fresh coriander", qty: 1, unit: "handful" },
      { id: "7", name: "Olive oil", qty: 1, unit: "tbsp" },
      { id: "8", name: "Chicken thighs", qty: 1000, unit: "g" },
      { id: "9", name: "TM vegetable stock concentrate", qty: 20, unit: "g" },
      { id: "10", name: "Carrots", qty: 2, unit: "medium" },
      { id: "11", name: "Celery", qty: 1, unit: "cup" },
      { id: "12", name: "Tomatoes", qty: 2, unit: "" },
      { id: "13", name: "Snow peas", qty: 1, unit: "handful" },
      { id: "14", name: "Rice (to serve)", qty: 1, unit: "batch" },
    ],
    macros: { calories: 420, protein: 32, fats: 18, carbs: 28 },
    instructions: "TM6 Method:\n1. Place garlic, onion, ginger, coriander and oil into TM bowl → Chop 3 sec / Speed 5\n2. Scrape down and sauté → 5 min / Varoma / Speed 1 / MC off\n3. Add chicken, curry powder, stock and coconut cream → Cook 12 min / 100°C / Reverse / Speed 1\n4. Add carrots, celery and tomatoes → Cook 4 min / 100°C / Reverse / Speed 1\n5. Add snow peas → Cook 2 min / 100°C / Reverse / Speed 1\n6. Serve on rice",
    notes: "Source: ThermoFun. Toddler-friendly mild curry. Batch freezes well. Harvey portion: ~½ adult serve."
  },
  {
    name: "Beef & Vegetable Rissoles",
    category: "Dinner",
    ingredients: [
      { id: "1", name: "Beef mince", qty: 500, unit: "g" },
      { id: "2", name: "Brown onion", qty: 1, unit: "medium" },
      { id: "3", name: "Garlic cloves", qty: 2, unit: "" },
      { id: "4", name: "Zucchini", qty: 1, unit: "medium" },
      { id: "5", name: "Carrot", qty: 1, unit: "medium" },
      { id: "6", name: "Egg", qty: 1, unit: "" },
      { id: "7", name: "Tomato sauce (ketchup)", qty: 2, unit: "tbsp" },
      { id: "8", name: "Worcestershire sauce", qty: 2, unit: "tbsp" },
      { id: "9", name: "Mixed dried herbs", qty: 1, unit: "tsp" },
      { id: "10", name: "Salt and pepper", qty: 1, unit: "to taste" },
      { id: "11", name: "Gluten-free flour (for coating)", qty: 0.5, unit: "cup" },
      { id: "12", name: "Oil for frying", qty: 1, unit: "" },
    ],
    macros: { calories: 380, protein: 28, fats: 22, carbs: 14 },
    instructions: "TM6 Method:\n1. Place onion, garlic, zucchini and carrot in TM bowl → Chop 5 sec / Speed 5\n2. Add beef mince, egg, tomato sauce, Worcestershire, herbs, salt and pepper → Mix 10 sec / Reverse / Speed 4\n3. Scrape down, mix again → 5 sec / Reverse / Speed 4\n4. Shape mixture into 10 patties (approx 2 tbsp each)\n5. Coat each rissole in gluten-free flour\n6. Pan fry 3-4 minutes each side until golden and cooked through",
    notes: "Source: Thermobliss. Hidden veggies! Makes 10 rissoles. Batch freezes cooked or uncooked. Serve with mash and veg or as burgers. Harvey: 1 small rissole, cut into pieces."
  },
  {
    name: "Creamy Garlic Chicken",
    category: "Dinner",
    ingredients: [
      { id: "1", name: "Chicken thighs or breast", qty: 700, unit: "g" },
      { id: "2", name: "Garlic cloves", qty: 4, unit: "" },
      { id: "3", name: "Onion powder", qty: 1, unit: "tsp" },
      { id: "4", name: "Cream (or light coconut milk)", qty: 200, unit: "ml" },
      { id: "5", name: "Chicken stock concentrate", qty: 100, unit: "g" },
      { id: "6", name: "Sweet paprika", qty: 1, unit: "tsp" },
      { id: "7", name: "Dried parsley", qty: 1, unit: "tsp" },
      { id: "8", name: "Dried oregano", qty: 1, unit: "tsp" },
      { id: "9", name: "Cornflour", qty: 1, unit: "tbsp" },
      { id: "10", name: "Water (for slurry)", qty: 2, unit: "tbsp" },
      { id: "11", name: "Salt and pepper", qty: 1, unit: "to taste" },
      { id: "12", name: "Olive oil", qty: 1, unit: "tbsp" },
      { id: "13", name: "Rice or vegetables to serve", qty: 1, unit: "batch" },
    ],
    macros: { calories: 368, protein: 34, fats: 20, carbs: 8 },
    instructions: "TM6 Method:\n1. Place garlic in TM bowl → Chop 3 sec / Speed 7\n2. Add olive oil → Sauté 2 min / 100°C / Speed 1\n3. Add chicken, paprika, onion powder, herbs, salt and pepper → Cook 8 min / 100°C / Reverse / Speed 1\n4. Add cream and stock → Cook 5 min / 90°C / Reverse / Speed 1\n5. Mix cornflour with water, add to bowl → Cook 2 min / 90°C / Reverse / Speed 1 to thicken\n6. Check seasoning, serve with rice and vegetables",
    notes: "Source: Skinnymixers (THMIV). 20 minute meal. Toddler-friendly creamy sauce. Omit chilli. Harvey: ~½ adult serve, diced or shredded."
  },
  {
    name: "Chicken Sausages with Mash & Broccolini",
    category: "Dinner",
    ingredients: [
      { id: "1", name: "Woolworths chicken sausages", qty: 1, unit: "pack (approx 6)" },
      { id: "2", name: "Spud Lite potatoes", qty: 800, unit: "g" },
      { id: "3", name: "Broccolini", qty: 1, unit: "bunch" },
      { id: "4", name: "Butter", qty: 30, unit: "g" },
      { id: "5", name: "Milk", qty: 100, unit: "ml" },
      { id: "6", name: "Salt and pepper", qty: 1, unit: "to taste" },
      { id: "7", name: "Olive oil", qty: 1, unit: "tbsp" },
    ],
    macros: { calories: 450, protein: 25, fats: 18, carbs: 38 },
    instructions: "Method:\n1. Peel and chop potatoes, boil in salted water until tender (15-20 min)\n2. While potatoes cook, pan-fry chicken sausages in olive oil over medium heat for 10-12 min, turning occasionally\n3. Steam or microwave broccolini for 3-4 min until tender-crisp\n4. Drain potatoes, add butter and milk, mash until smooth\n5. Season mash with salt and pepper\n6. Serve sausages on mash with broccolini on the side",
    notes: "Simple weeknight dinner. John-friendly easy prep. Harvey: cut sausages into small pieces, mash can be finger food or spoon-fed."
  },
  {
    name: "Takeaway Night",
    category: "Dinner",
    ingredients: [
      { id: "1", name: "Whatever you're craving!", qty: 1, unit: "order" },
    ],
    macros: { calories: 0, protein: 0, fats: 0, carbs: 0 },
    instructions: "Order your favourite takeaway and enjoy a night off cooking!",
    notes: "No cooking required. Harvey: choose toddler-friendly options from menu."
  },
  {
    name: "Steak & Veggies",
    category: "Dinner",
    ingredients: [
      { id: "1", name: "Beef steak (scotch fillet or rump)", qty: 500, unit: "g" },
      { id: "2", name: "Sweet potato", qty: 600, unit: "g" },
      { id: "3", name: "Green beans", qty: 300, unit: "g" },
      { id: "4", name: "Cherry tomatoes", qty: 250, unit: "g" },
      { id: "5", name: "Olive oil", qty: 2, unit: "tbsp" },
      { id: "6", name: "Garlic butter", qty: 30, unit: "g" },
      { id: "7", name: "Salt and pepper", qty: 1, unit: "to taste" },
    ],
    macros: { calories: 420, protein: 38, fats: 20, carbs: 22 },
    instructions: "Method:\n1. Preheat oven to 200°C. Chop sweet potato into chunks, toss with olive oil, salt and pepper\n2. Roast sweet potato for 25-30 min until golden\n3. Season steak with salt and pepper. Cook in hot pan 3-4 min each side for medium (adjust for preference)\n4. Rest steak for 5 min under foil\n5. Steam green beans for 4-5 min until tender\n6. Slice steak against the grain, serve with roasted sweet potato, beans and cherry tomatoes",
    notes: "Classic easy dinner. John-friendly. Resting steak is key for juiciness. Harvey: cut steak into very small pieces, soft roasted sweet potato perfect for little hands."
  }
];

// Auto-seed on client-side only
if (typeof window !== 'undefined') {
  // Check if recipes already exist
  const existingRecipes = recipeDatabase.getAllRecipes();
  const existingNames = new Set(existingRecipes.map(r => r.name));
  
  seedRecipesForWeekOf3March.forEach(recipe => {
    if (!existingNames.has(recipe.name)) {
      recipeDatabase.addRecipe(recipe);
    }
  });
}
