/**
 * Recipe Database
 * Persistent storage for all of Jade's recipes
 * Each recipe is a reusable template with ingredients and macros
 */

export interface Ingredient {
  id: string;
  name: string;
  qty: string | number; // "2" or "1.5"
  unit: string; // "cups", "g", "tbsp", etc.
}

export interface Recipe {
  id: string;
  name: string; // "PB & J Overnight Weet-Bix"
  category?: string; // "Breakfast", "Lunch", etc.
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
      console.error('Error loading recipe database:', e);
    }
  }

  // Force reload from localStorage (useful when recipes are added externally)
  reload() {
    this.recipes.clear();
    this.load();
  }

  private save() {
    if (typeof window === 'undefined') return;

    try {
      const data = Object.fromEntries(this.recipes);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Trigger storage event for real-time sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(data),
      }));
    } catch (e) {
      console.error('Error saving recipe database:', e);
    }
  }

  getAllRecipes(): Recipe[] {
    return Array.from(this.recipes.values());
  }

  getRecipeByName(name: string): Recipe | null {
    const recipes = Array.from(this.recipes.values());
    return recipes.find(r => r.name === name) || null;
  }

  getRecipeById(id: string): Recipe | null {
    return this.recipes.get(id) || null;
  }

  addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Recipe {
    const id = `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    const newRecipe: Recipe = {
      ...recipe,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.recipes.set(id, newRecipe);
    this.save();
    return newRecipe;
  }

  updateRecipe(id: string, updates: Partial<Recipe>): Recipe {
    const recipe = this.recipes.get(id);
    if (!recipe) throw new Error(`Recipe ${id} not found`);

    const updated: Recipe = {
      ...recipe,
      ...updates,
      id: recipe.id, // Never change ID
      createdAt: recipe.createdAt, // Never change creation date
      updatedAt: Date.now(),
    };

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
      r => r.name.toLowerCase().includes(lower)
    );
  }

  // Initialize with default recipes if database is empty
  initializeDefaults() {
    if (this.recipes.size > 0) return; // Already has recipes

    const defaults: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Chicken Enchilada (GF)',
        category: 'Lunch',
        ingredients: [
          { id: 'ing-1', name: 'Avocado', qty: '30', unit: 'g' },
          { id: 'ing-2', name: 'Chicken Breast (Weighed Raw)', qty: '100', unit: 'g' },
          { id: 'ing-3', name: 'Light Mozzarella Cheese (Coles) OR Bega 50% light Shredded Cheese (Woolworths)', qty: '35', unit: 'g' },
          { id: 'ing-4', name: 'Mild Salsa - Old El Paso', qty: '35', unit: 'g' },
          { id: 'ing-5', name: 'Refried Beans - Old El Paso', qty: '60', unit: 'g' },
          { id: 'ing-6', name: 'Sour Cream Light', qty: '30', unit: 'g' },
          { id: 'ing-7', name: 'Taco Spice Mix (Old El Paso) - Gluten free', qty: '5', unit: 'g' },
          { id: 'ing-8', name: 'White Wraps (50g) - Free From Gluten (Woolworths Only)', qty: '1', unit: 'wrap' },
        ],
        macros: { calories: 543, protein: 42, fats: 21, carbs: 44 },
        instructions: 'Warm tortilla, add beans and chicken, top with cheese and salsa, roll and enjoy.',
        notes: 'Gluten-free friendly',
      },
      {
        name: 'Asian Chicken Tacos (GF)',
        category: 'Lunch',
        ingredients: [
          { id: 'ing-9', name: 'Carrot', qty: '60', unit: 'g' },
          { id: 'ing-10', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
          { id: 'ing-11', name: 'Fried Shallots - Doree', qty: '5', unit: 'g' },
          { id: 'ing-12', name: 'Garlic Aioli - Coles Brand / Woolworths Brand', qty: '15', unit: 'g' },
          { id: 'ing-13', name: 'Honey', qty: '10', unit: 'g' },
          { id: 'ing-14', name: 'Lettuce', qty: '40', unit: 'g' },
          { id: 'ing-15', name: 'Light Soy Sauce - Ayam', qty: '20', unit: 'g' },
          { id: 'ing-16', name: 'Minced Garlic - Woolworths', qty: '10', unit: 'g' },
          { id: 'ing-17', name: 'Onion', qty: '20', unit: 'g' },
          { id: 'ing-18', name: 'Taco Shell (13g) - Old El Paso', qty: '3', unit: 'shells' },
        ],
        macros: { calories: 556, protein: 39, fats: 22, carbs: 42 },
        instructions: 'Stir-fry chicken with garlic, onion, and carrot. Season with soy and honey. Serve in taco shells with lettuce and aioli.',
        notes: 'Gluten-free friendly',
      },
      {
        name: 'Beef San Choy Bao (GF, DF)',
        category: 'Lunch',
        ingredients: [
          { id: 'ing-19', name: 'Capsicum', qty: '30', unit: 'g' },
          { id: 'ing-20', name: 'Carrot', qty: '30', unit: 'g' },
          { id: 'ing-21', name: 'Extra Lean Beef Mince (5 Star) (Weighed Raw)', qty: '100', unit: 'g' },
          { id: 'ing-22', name: 'Green Beans', qty: '30', unit: 'g' },
          { id: 'ing-23', name: 'Lettuce', qty: '100', unit: 'g' },
          { id: 'ing-24', name: 'Onion', qty: '25', unit: 'g' },
          { id: 'ing-25', name: 'San Choy Bow Meal Kit (97g) - Marions Kitchen', qty: '1', unit: 'kit' },
        ],
        macros: { calories: 342, protein: 27, fats: 12, carbs: 32 },
        instructions: 'Brown beef mince, add vegetables and sauce from kit, serve in lettuce leaves.',
        notes: 'Gluten-free and dairy-free friendly',
      },
      {
        name: 'PB & J Overnight Weet-Bix (GF)',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-26', name: 'Weet-bix Gluten free (15g) - Sanitarium', qty: '2', unit: 'biscuits' },
          { id: 'ing-27', name: 'High Protein Almond milk - So Good', qty: '100', unit: 'ml' },
          { id: 'ing-28', name: 'Greek Yogurt Vanilla - Chobani', qty: '100', unit: 'g' },
          { id: 'ing-29', name: 'Peanut Butter - Bega', qty: '15', unit: 'g' },
          { id: 'ing-30', name: 'Jam - Natvia (Woolworths Only)', qty: '20', unit: 'g' },
          { id: 'ing-31', name: 'Protein Powder - WPI (Any)', qty: '15', unit: 'g' },
          { id: 'ing-32', name: 'Maple Syrup', qty: '10', unit: 'g' },
        ],
        macros: { calories: 427, protein: 30, fats: 12, carbs: 46 },
        instructions: '1. In a bowl, combine weet-bix, protein powder, milk and sweetener. Press mixture down firmly into bowl to create base. 2. In another bowl, mix together yogurt and peanut butter until batter is smooth. Spread over weet-bix base and drizzle with jam and maple syrup.',
        notes: 'Gluten-free friendly overnight breakfast',
      },
      {
        name: 'Beef Chow Mein (GF,DF)',
        category: 'Dinner',
        ingredients: [
          { id: 'ing-33', name: 'Extra Lean Beef Strips (Weighed Raw)', qty: '150', unit: 'g' },
          { id: 'ing-34', name: 'Light Soy Sauce - Ayam', qty: '10', unit: 'g' },
          { id: 'ing-35', name: 'San Choy Bow Meal Kit (97g) - Marion\'s Kitchen', qty: '0.5', unit: 'kit' },
          { id: 'ing-36', name: 'Stir Fry Vegetables (generic)', qty: '175', unit: 'g' },
          { id: 'ing-37', name: 'Vermicelli Rice Noodle - Chang\'s', qty: '60', unit: 'g' },
        ],
        macros: { calories: 565, protein: 47, fats: 8, carbs: 71 },
        instructions: '1. Cook the vermicelli noodles according to package directions, drain and set aside. 2. Heat a wok or large pan over medium-high heat. Stir-fry beef strips until cooked through. 3. Add stir fry vegetables and cook until tender-crisp. 4. Add cooked noodles, San Choy Bow sauce, and soy sauce. Toss everything together until well combined. 5. Serve hot.',
        notes: 'Gluten-free and dairy-free friendly. High protein, low fat option.',
      },
      {
        name: 'Asian Chicken Tacos (GF & DF)',
        category: 'Dinner',
        ingredients: [
          { id: 'ing-38', name: 'Carrot', qty: '60', unit: 'g' },
          { id: 'ing-39', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
          { id: 'ing-40', name: 'Fried Shallots - Doree', qty: '5', unit: 'g' },
          { id: 'ing-41', name: 'Honey', qty: '10', unit: 'g' },
          { id: 'ing-42', name: 'Lettuce', qty: '40', unit: 'g' },
          { id: 'ing-43', name: 'Light Soy Sauce - Ayam', qty: '20', unit: 'g' },
          { id: 'ing-44', name: 'Minced Garlic - Woolworths', qty: '10', unit: 'g' },
          { id: 'ing-45', name: 'Onion', qty: '20', unit: 'g' },
          { id: 'ing-46', name: 'Taco Shell (13g) - Old El Paso', qty: '3', unit: 'shells' },
          { id: 'ing-47', name: 'Vegan Aioli - Praise', qty: '15', unit: 'g' },
        ],
        macros: { calories: 531, protein: 38, fats: 19, carbs: 42 },
        instructions: '1. Heat a large pan over medium-high heat. 2. Stir-fry chicken with minced garlic and onion until cooked through. 3. Add carrot and cook until tender-crisp. 4. Season with honey and soy sauce. 5. Warm taco shells and assemble with lettuce, chicken mixture, fried shallots, and vegan aioli. 6. Serve with lemon wedge.',
        notes: 'Gluten-free and dairy-free friendly. Vegan aioli version.',
      },
      {
        name: 'One Container Pesto Chicken Bake',
        category: 'Dinner',
        ingredients: [
          { id: 'ing-48', name: '50% Less Fat Cheese Shredded - Bega/Woolworths/Coles', qty: '25', unit: 'g' },
          { id: 'ing-49', name: 'Basil Pecorino & Pine Nuts Pesto - Providore', qty: '20', unit: 'g' },
          { id: 'ing-50', name: 'Chicken Breast (Weighed Raw)', qty: '100', unit: 'g' },
          { id: 'ing-51', name: 'Chicken Stock (Generic)', qty: '60', unit: 'ml' },
          { id: 'ing-52', name: 'Fresh Garlic', qty: '5', unit: 'g' },
          { id: 'ing-53', name: 'Light Plain Greek Yogurt - Chobani', qty: '30', unit: 'g' },
          { id: 'ing-54', name: 'Mushroom', qty: '50', unit: 'g' },
          { id: 'ing-55', name: 'Rice Raw (Any)', qty: '40', unit: 'g' },
          { id: 'ing-56', name: 'Tomato', qty: '50', unit: 'g' },
        ],
        macros: { calories: 456, protein: 38, fats: 16, carbs: 40 },
        instructions: '1. Preheat oven to 180 degrees celsius. 2. In a baking container, combine rice, chicken stock, and diced vegetables (mushroom, tomato, garlic). 3. Season chicken breast and place on top of rice mixture. 4. Mix pesto with Greek yogurt and spread over chicken. 5. Top with shredded cheese. 6. Bake covered for 25-30 minutes until chicken is cooked through and rice is tender. 7. Serve directly from the container.',
        notes: 'One-container meal. Easy preparation and cleanup.',
      },
      {
        name: 'Cacao Pistachio Yogurt Bowl',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-57', name: 'Cacao Nibs (Generic)', qty: '5', unit: 'g' },
          { id: 'ing-58', name: 'Frozen Raspberries', qty: '40', unit: 'g' },
          { id: 'ing-59', name: 'Honey', qty: '8', unit: 'g' },
          { id: 'ing-60', name: 'Salted Caramel High Protein Yoghurt - YoPro', qty: '150', unit: 'g' },
          { id: 'ing-61', name: 'Pistachios - Woolworths', qty: '10', unit: 'g' },
        ],
        macros: { calories: 218, protein: 21, fats: 9, carbs: 20 },
        instructions: '1. Add YoPro yoghurt to a bowl. 2. Top with frozen raspberries, cacao nibs, and pistachios. 3. Drizzle with honey. 4. Stir together and enjoy immediately, or let sit for 2-3 minutes for a softer texture.',
        notes: 'Quick, high-protein breakfast bowl. Great for busy mornings.',
      },
      {
        name: 'Skim Milk & Popcorn Snack',
        category: 'Snack',
        ingredients: [
          { id: 'ing-62', name: 'Skim Milk', qty: '350', unit: 'ml' },
          { id: 'ing-63', name: 'Popcorn (Lightly Salted & Slightly Sweet) - Cobs', qty: '14', unit: 'g' },
        ],
        macros: { calories: 197, protein: 15, fats: 3, carbs: 27 },
        instructions: '1. Pour 350ml of skim milk into a glass. 2. Serve with 14g of Cobs popcorn on the side. 3. Enjoy together as a light, crunchy snack.',
        notes: 'Perfect afternoon snack. High protein, satisfying combo of milk and popcorn.',
      },
      {
        name: 'Caramello Koala - Cadbury',
        category: 'Dessert',
        ingredients: [
          { id: 'ing-64', name: 'Caramello Koala - Cadbury (15g)', qty: '1', unit: 'whole' },
        ],
        macros: { calories: 75, protein: 1, fats: 3, carbs: 11 },
        instructions: '1. Unwrap the Caramello Koala chocolate. 2. Enjoy as is or break into pieces. 3. Perfect after-meal treat.',
        notes: 'Single chocolate treat. Sweet dessert fix.',
      },
      {
        name: 'Chocolate Carrot Muffins (Toddlers & Beyond)',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-65', name: 'Sunflower seeds', qty: '60', unit: 'g' },
          { id: 'ing-66', name: 'Carrots (peeled, cut into pieces)', qty: '200', unit: 'g' },
          { id: 'ing-67', name: 'Pitted Medjool dates', qty: '100', unit: 'g' },
          { id: 'ing-68', name: 'Eggs', qty: '2', unit: 'whole' },
          { id: 'ing-69', name: 'Milk (of choice)', qty: '60', unit: 'g' },
          { id: 'ing-70', name: 'Raw sugar', qty: '2', unit: 'tbsp' },
          { id: 'ing-71', name: 'Extra virgin olive oil', qty: '120', unit: 'g' },
          { id: 'ing-72', name: 'Wholemeal spelt flour', qty: '170', unit: 'g' },
          { id: 'ing-73', name: 'Raw cacao powder', qty: '20', unit: 'g' },
          { id: 'ing-74', name: 'Baking powder', qty: '2', unit: 'tsp' },
          { id: 'ing-75', name: 'Dark chocolate chips', qty: '70', unit: 'g' },
        ],
        macros: { calories: 213, protein: 4, fats: 16, carbs: 13 },
        instructions: '1. Preheat oven to 180°C. 2. Pulse sunflower seeds, carrots, and dates in food processor until roughly chopped. 3. Mix in eggs, milk, sugar, and olive oil. 4. In a separate bowl, combine wholemeal spelt flour, cacao powder, and baking powder. 5. Fold wet ingredients into dry ingredients until just combined. 6. Stir in dark chocolate chips. 7. Divide batter into muffin cups and bake 20-25 minutes until a skewer comes out clean. 8. Cool in tin for 5 minutes, then transfer to wire rack.',
        notes: 'Healthy muffins made with wholemeal spelt flour, dates for natural sweetness, and carrots. Great for toddlers and the whole family. Recipe from Cookidoo®.',
      },
      {
        name: 'ABC Muffins',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-76', name: 'Carrot (cut into pieces)', qty: '120', unit: 'g' },
          { id: 'ing-77', name: 'Gala apple (cored, cut into pieces)', qty: '150', unit: 'g' },
          { id: 'ing-78', name: 'Ripe banana (cut into pieces)', qty: '120', unit: 'g' },
          { id: 'ing-79', name: 'Self-raising flour', qty: '170', unit: 'g' },
          { id: 'ing-80', name: 'Rolled oats', qty: '50', unit: 'g' },
          { id: 'ing-81', name: 'Eggs', qty: '2', unit: 'whole' },
          { id: 'ing-82', name: 'Pure maple syrup', qty: '100', unit: 'g' },
          { id: 'ing-83', name: 'Greek-style natural yoghurt', qty: '100', unit: 'g' },
          { id: 'ing-84', name: 'Extra virgin olive oil', qty: '50', unit: 'g' },
          { id: 'ing-85', name: 'Natural vanilla extract', qty: '1', unit: 'tsp' },
          { id: 'ing-86', name: 'Granola (or muesli of choice, nut-free)', qty: '100', unit: 'g' },
        ],
        macros: { calories: 204, protein: 5, fats: 10, carbs: 28 },
        instructions: '1. Preheat oven to 180°C and line a muffin tin with paper cases. 2. In a food processor, blend carrot, apple, and banana until roughly chopped. 3. In a large bowl, combine self-raising flour and rolled oats. 4. In another bowl, whisk together eggs, maple syrup, yoghurt, olive oil, and vanilla extract. 5. Fold the fruit mixture into the wet ingredients. 6. Gently fold in the flour and oats until just combined. 7. Divide batter into muffin cases. 8. Top with granola. 9. Bake for 20-25 minutes until golden and a skewer comes out clean. 10. Cool in tin for 5 minutes, then transfer to wire rack.',
        notes: 'ABC Muffins = Apple, Banana, Carrot! Perfect toddler-friendly breakfast. Make-ahead friendly, store in airtight container up to 4 days.',
      },
      {
        name: 'Chocolate Chip Muffins',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-87', name: 'Butter (cut into pieces, plus extra for greasing)', qty: '100', unit: 'g' },
          { id: 'ing-88', name: 'Full cream milk', qty: '250', unit: 'g' },
          { id: 'ing-89', name: 'Eggs', qty: '2', unit: 'whole' },
          { id: 'ing-90', name: 'Natural vanilla extract', qty: '1', unit: 'tbsp' },
          { id: 'ing-91', name: 'Plain flour', qty: '300', unit: 'g' },
          { id: 'ing-92', name: 'Baking powder', qty: '1', unit: 'tbsp' },
          { id: 'ing-93', name: 'Salt', qty: '1', unit: 'pinch' },
          { id: 'ing-94', name: 'Caster sugar', qty: '150', unit: 'g' },
          { id: 'ing-95', name: 'Dark chocolate (cut into 1cm pieces)', qty: '200', unit: 'g' },
        ],
        macros: { calories: 324, protein: 6, fats: 17, carbs: 40 },
        instructions: '1. Preheat oven to 180°C and grease a muffin tin with butter. 2. Melt butter and mix with milk. 3. In a bowl, whisk eggs with vanilla extract. 4. Combine eggs with milk mixture. 5. In another bowl, sift together flour, baking powder, salt, and caster sugar. 6. Fold wet ingredients into dry ingredients until just combined. 7. Gently fold in dark chocolate pieces. 8. Divide batter into muffin cups. 9. Bake for 20-25 minutes until golden and a skewer comes out clean. 10. Cool in tin before turning out.',
        notes: 'Classic Cookidoo chocolate chip muffins. Rich, moist, and indulgent. Perfect for breakfast or special treat. Recipe from Cookidoo®.',
      },
      {
        name: 'Banana Pancakes',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-96', name: 'Milk', qty: '240', unit: 'ml' },
          { id: 'ing-97', name: 'Banana (large)', qty: '1', unit: 'whole' },
          { id: 'ing-98', name: 'Vanilla extract', qty: '2', unit: 'tsp' },
          { id: 'ing-99', name: 'Butter (melted)', qty: '14', unit: 'g' },
          { id: 'ing-100', name: 'Egg', qty: '1', unit: 'whole' },
          { id: 'ing-101', name: 'Cinnamon', qty: '2', unit: 'tsp' },
          { id: 'ing-102', name: 'Self-raising flour', qty: '120', unit: 'g' },
          { id: 'ing-103', name: 'Baking powder (if not using SR flour)', qty: '1.5', unit: 'tsp' },
          { id: 'ing-104', name: 'Salt', qty: '0.25', unit: 'tsp' },
        ],
        macros: { calories: 178, protein: 5, fats: 5, carbs: 28 },
        instructions: '1. In a blender or bowl, mash banana thoroughly. 2. Add milk, vanilla extract, melted butter, and egg. Blend or mix well. 3. In another bowl, combine self-raising flour (or flour + baking powder + salt) and cinnamon. 4. Fold wet ingredients into dry ingredients until just combined. 5. Heat a non-stick frying pan or griddle over medium heat. 6. Lightly butter or spray the pan. 7. Pour ¼ cup batter for each pancake onto the hot pan. 8. Cook for 1-2 minutes until edges look set, then flip. 9. Cook another 1-2 minutes until golden. 10. Serve warm with your choice of toppings (yogurt, berries, maple syrup, etc).',
        notes: 'Quick and easy banana pancakes. Naturally sweetened from the banana. Great for toddlers and the whole family. Can be made with or without baking powder depending on flour type.',
      },
      {
        name: 'Healthy Chocolate Chip Muffins (Toddler-Friendly)',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-105', name: 'Whole-wheat flour', qty: '1.5', unit: 'cups' },
          { id: 'ing-106', name: 'Baking powder', qty: '1', unit: 'tsp' },
          { id: 'ing-107', name: 'Baking soda', qty: '0.5', unit: 'tsp' },
          { id: 'ing-108', name: 'Salt', qty: '0.25', unit: 'tsp' },
          { id: 'ing-109', name: 'Whole milk plain Greek yogurt', qty: '1', unit: 'cup' },
          { id: 'ing-110', name: 'Maple syrup', qty: '0.33', unit: 'cup' },
          { id: 'ing-111', name: 'Unsalted butter (melted & cooled)', qty: '0.25', unit: 'cup' },
          { id: 'ing-112', name: 'Eggs (large)', qty: '2', unit: 'whole' },
          { id: 'ing-113', name: 'Pure vanilla extract', qty: '2', unit: 'tsp' },
          { id: 'ing-114', name: 'Chocolate chips (semi-sweet or dark)', qty: '1', unit: 'cup' },
        ],
        macros: { calories: 131, protein: 5, fats: 5, carbs: 18 },
        instructions: '1. Preheat oven to 375°F. Grease a 12-cup muffin pan with nonstick spray. 2. In a medium bowl, stir together whole-wheat flour, baking powder, baking soda, and salt. 3. In another bowl, stir together Greek yogurt, maple syrup, melted butter, eggs, and vanilla extract. 4. Gently stir the yogurt mixture into the flour mixture until just combined. 5. Fold in chocolate chips. 6. Divide batter among the prepared muffin cups, using about ¼ cup batter per cup. 7. Bake for 14-16 minutes, or until the edges are lightly golden brown and a cake tester inserted into the center comes out cleanly. 8. Remove from oven and transfer muffins to a wire rack to cool fully.',
        notes: 'Toddler-friendly version with whole-wheat flour and Greek yogurt protein. No refined sugar - sweetened with maple syrup. Freezes beautifully up to 3 months. Can dice for younger eaters. Recipe from Yummy Toddler Food.',
      },
      {
        name: 'Easy Cheesy Veggie Muffins',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-115', name: 'Corn kernels (fresh or frozen)', qty: '100', unit: 'g' },
          { id: 'ing-116', name: 'Carrot (grated)', qty: '100', unit: 'g' },
          { id: 'ing-117', name: 'Zucchini (grated & squeezed dry)', qty: '100', unit: 'g' },
          { id: 'ing-118', name: 'Cheddar cheese (shredded)', qty: '75', unit: 'g' },
          { id: 'ing-119', name: 'Eggs', qty: '3', unit: 'whole' },
          { id: 'ing-120', name: 'Plain flour', qty: '150', unit: 'g' },
          { id: 'ing-121', name: 'Baking powder', qty: '2', unit: 'tsp' },
          { id: 'ing-122', name: 'Applesauce (unsweetened)', qty: '75', unit: 'g' },
          { id: 'ing-123', name: 'Milk', qty: '60', unit: 'ml' },
          { id: 'ing-124', name: 'Salt', qty: '0.25', unit: 'tsp' },
        ],
        macros: { calories: 156, protein: 7, fats: 6, carbs: 18 },
        instructions: '1. Preheat oven to 180°C. Grease a 12-cup muffin tin. 2. Using Thermomix: Grate carrot and zucchini (squeeze dry with paper towel to remove excess moisture). 3. In a bowl, combine corn, grated carrot, zucchini, and cheddar cheese. 4. In another bowl, whisk eggs, then add applesauce and milk. 5. In a third bowl, combine flour, baking powder, and salt. 6. Fold wet ingredients into dry ingredients, then gently stir in vegetable mixture. 7. Divide batter among muffin cups (about ¼ cup each). 8. Bake 20-22 minutes until golden and a skewer comes out clean. 9. Cool in tin for 5 minutes, then transfer to wire rack.',
        notes: '3 veggies in one muffin! Savory, cheesy, naturally sweetened with applesauce. Perfect lunch box item. Freezes beautifully. Thermomix great for grating veggies.',
      },
      {
        name: 'Blueberry Muffins',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-125', name: 'Plain flour', qty: '250', unit: 'g' },
          { id: 'ing-126', name: 'Baking powder', qty: '2', unit: 'tsp' },
          { id: 'ing-127', name: 'Salt', qty: '0.25', unit: 'tsp' },
          { id: 'ing-128', name: 'Butter (melted)', qty: '50', unit: 'g' },
          { id: 'ing-129', name: 'Eggs', qty: '2', unit: 'whole' },
          { id: 'ing-130', name: 'Milk', qty: '200', unit: 'ml' },
          { id: 'ing-131', name: 'Honey or maple syrup', qty: '60', unit: 'g' },
          { id: 'ing-132', name: 'Vanilla extract', qty: '1', unit: 'tsp' },
          { id: 'ing-133', name: 'Fresh or frozen blueberries', qty: '150', unit: 'g' },
        ],
        macros: { calories: 198, protein: 4, fats: 7, carbs: 30 },
        instructions: '1. Preheat oven to 190°C. Grease a 12-cup muffin tin. 2. In a bowl, combine flour, baking powder, and salt. 3. In another bowl, whisk together melted butter, eggs, milk, honey/maple syrup, and vanilla extract. 4. Using Thermomix: Can mix wet ingredients together on low speed. 5. Fold wet mixture into dry ingredients until just combined (do not overmix). 6. Gently fold in blueberries. 7. Divide batter among muffin cups. 8. Bake 18-20 minutes until golden and a skewer comes out clean. 9. Cool in tin for 5 minutes, then transfer to wire rack.',
        notes: 'Classic soft muffin. Freezes beautifully - pop straight from freezer into lunchbox and thaw by snack time. Naturally sweet from honey/maple syrup.',
      },
      {
        name: 'Zucchini & Banana Bread Muffins',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-134', name: 'Ripe banana (mashed)', qty: '150', unit: 'g' },
          { id: 'ing-135', name: 'Zucchini (grated & squeezed dry)', qty: '150', unit: 'g' },
          { id: 'ing-136', name: 'Eggs', qty: '2', unit: 'whole' },
          { id: 'ing-137', name: 'Olive oil', qty: '50', unit: 'g' },
          { id: 'ing-138', name: 'Honey or maple syrup', qty: '75', unit: 'g' },
          { id: 'ing-139', name: 'Vanilla extract', qty: '1', unit: 'tsp' },
          { id: 'ing-140', name: 'Plain flour', qty: '220', unit: 'g' },
          { id: 'ing-141', name: 'Baking powder', qty: '2', unit: 'tsp' },
          { id: 'ing-142', name: 'Cinnamon', qty: '1', unit: 'tsp' },
          { id: 'ing-143', name: 'Salt', qty: '0.25', unit: 'tsp' },
        ],
        macros: { calories: 189, protein: 4, fats: 7, carbs: 29 },
        instructions: '1. Preheat oven to 180°C. Grease a 12-cup muffin tin. 2. Using Thermomix: Mash banana, then grate zucchini (squeeze dry with paper towel). 3. In a bowl, combine mashed banana, grated zucchini, eggs, olive oil, honey/maple syrup, and vanilla extract. 4. In another bowl, combine flour, baking powder, cinnamon, and salt. 5. Fold wet ingredients into dry ingredients until just combined. 6. Divide batter among muffin cups (about ¼ cup each). 7. Bake 20-22 minutes until golden and a skewer comes out clean. 8. Cool in tin for 5 minutes, then transfer to wire rack.',
        notes: 'Hidden veggie + natural banana sweetness. Soft, moist texture. Freezes perfectly. Great for lunch box - stays tender even if prepared ahead.',
      },
      {
        name: 'Carrot & Apple Muffins',
        category: 'Breakfast',
        ingredients: [
          { id: 'ing-144', name: 'Carrot (grated)', qty: '150', unit: 'g' },
          { id: 'ing-145', name: 'Apple (grated)', qty: '150', unit: 'g' },
          { id: 'ing-146', name: 'Eggs', qty: '2', unit: 'whole' },
          { id: 'ing-147', name: 'Olive oil', qty: '50', unit: 'g' },
          { id: 'ing-148', name: 'Honey or maple syrup', qty: '60', unit: 'g' },
          { id: 'ing-149', name: 'Vanilla extract', qty: '1', unit: 'tsp' },
          { id: 'ing-150', name: 'Plain flour', qty: '220', unit: 'g' },
          { id: 'ing-151', name: 'Baking powder', qty: '2', unit: 'tsp' },
          { id: 'ing-152', name: 'Cinnamon', qty: '1.5', unit: 'tsp' },
          { id: 'ing-153', name: 'Salt', qty: '0.25', unit: 'tsp' },
        ],
        macros: { calories: 176, protein: 4, fats: 7, carbs: 26 },
        instructions: '1. Preheat oven to 180°C. Grease a 12-cup muffin tin. 2. Using Thermomix: Grate carrot and apple. 3. In a bowl, combine grated carrot, apple, eggs, olive oil, honey/maple syrup, and vanilla extract. 4. In another bowl, combine flour, baking powder, cinnamon, and salt. 5. Fold wet ingredients into dry ingredients until just combined. 6. Divide batter among muffin cups (about ¼ cup each). 7. Bake 20-22 minutes until golden and a skewer comes out clean. 8. Cool in tin for 5 minutes, then transfer to wire rack.',
        notes: 'Like carrot cake but toddler-friendly! Naturally sweet from apple. Warming cinnamon spice. Perfect for lunch box or breakfast.',
      },
      {
        name: 'Snacks',
        category: 'Snack',
        ingredients: [
          { id: 'ing-1', name: 'Harvest Pea Snaps (Original Salted) (18g) - Calbee', qty: '1', unit: 'pack' },
          { id: 'ing-2', name: 'Kiwifruit', qty: '100', unit: 'g' },
          { id: 'ing-3', name: 'Medium Coffee on Skim Milk', qty: '1', unit: 'serve' },
        ],
        macros: { calories: 264, protein: 16, fats: 4, carbs: 37 },
        notes: 'Quick snack combo',
      },
      {
        name: 'Rice Cakes with Peanut Butter and Banana (Mid Meal)',
        category: 'Snack',
        ingredients: [
          { id: 'ing-1', name: 'Banana', qty: '50', unit: 'g' },
          { id: 'ing-2', name: 'Peanut Butter - Bega', qty: '15', unit: 'g' },
          { id: 'ing-3', name: 'Rice Cakes - Sunrise', qty: '2', unit: 'cakes' },
        ],
        macros: { calories: 186, protein: 5, fats: 8, carbs: 22 },
        instructions: '1. Cut banana into thin slices. 2. Spread peanut butter over rice cakes. 3. Add banana slices to rice cakes. 4. Enjoy!',
        notes: 'Mid meal, cut banana into thin slices, spread peanut butter over rice cakes',
      },
      {
        name: 'Caramelized Pineapple Burger (GF)',
        category: 'Dinner',
        ingredients: [
          { id: 'ing-1', name: '50% Less Fat Cheese Slice - Bega', qty: '1', unit: 'slice' },
          { id: 'ing-2', name: 'Brioche Bun Gluten free (80g) - Woolworths Brand', qty: '1', unit: 'bun' },
          { id: 'ing-3', name: 'Extra Lean Beef Mince (5 Star) (Weighed Raw)', qty: '100', unit: 'g' },
          { id: 'ing-4', name: 'Lettuce', qty: '30', unit: 'g' },
          { id: 'ing-5', name: 'Natural Brown Sweetener - Natvia', qty: '10', unit: 'g' },
          { id: 'ing-6', name: 'Onion', qty: '20', unit: 'g' },
          { id: 'ing-7', name: 'Pineapple Canned - Golden Circle', qty: '50', unit: 'g' },
        ],
        macros: { calories: 424, protein: 33, fats: 11, carbs: 45 },
        instructions: '1. Marinate the pineapple ring in sweetener & caramelize in a non-stick pan on medium-low heat. 2. Preheat a pan or grill over medium-high heat.',
        notes: 'GF option, marinate pineapple ring in sweetener & caramelize in non-stick pan',
      },
      {
        name: 'Rice Cakes with Honey and Banana (Mid Meal)',
        category: 'Snack',
        ingredients: [
          { id: 'ing-1', name: 'Banana', qty: '100', unit: 'g' },
          { id: 'ing-2', name: 'Honey', qty: '5', unit: 'g' },
          { id: 'ing-3', name: 'Rice Cakes - Sunrise', qty: '2', unit: 'cakes' },
        ],
        macros: { calories: 153, protein: 2, fats: 1, carbs: 34 },
        instructions: '1. Top rice cake with sliced banana. 2. Drizzle with honey. 3. Enjoy!',
        notes: 'Mid meal, top rice cake with sliced banana and drizzle with honey',
      },
      {
        name: 'Chicken Gyros (GF)',
        category: 'Dinner',
        ingredients: [
          { id: 'ing-1', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
          { id: 'ing-2', name: 'Garlic & Herb All Natural Seasoning - Mingle', qty: '20', unit: 'g' },
          { id: 'ing-3', name: 'Lettuce', qty: '20', unit: 'g' },
          { id: 'ing-4', name: 'Low Carb Potato - Carisma/Spud Lite', qty: '200', unit: 'g' },
          { id: 'ing-5', name: 'Onion', qty: '15', unit: 'g' },
          { id: 'ing-6', name: 'Oregano', qty: '1', unit: 'g' },
          { id: 'ing-7', name: 'Tomato', qty: '50', unit: 'g' },
          { id: 'ing-8', name: 'Tzatziki - Willow Farm', qty: '20', unit: 'g' },
          { id: 'ing-9', name: 'White Wraps (50g) - Free From Gluten (Woolworths Only)', qty: '1', unit: 'wrap' },
        ],
        macros: { calories: 510, protein: 44, fats: 8, carbs: 64 },
        notes: 'GF option',
      },
      {
        name: 'Cantonese Chicken (GF)',
        category: 'Dinner',
        ingredients: [
          { id: 'ing-1', name: 'Broccoli', qty: '100', unit: 'g' },
          { id: 'ing-2', name: 'Cantonese Beef Stir Fry Sauce - Passage to Asia', qty: '70', unit: 'g' },
          { id: 'ing-3', name: 'Chicken Breast (Weighed Raw)', qty: '120', unit: 'g' },
          { id: 'ing-4', name: 'Fresh Garlic', qty: '0.05', unit: 'clove' },
          { id: 'ing-5', name: 'Onion', qty: '30', unit: 'g' },
          { id: 'ing-6', name: 'Rice Raw', qty: '35', unit: 'g' },
          { id: 'ing-7', name: 'Zucchini', qty: '80', unit: 'g' },
        ],
        macros: { calories: 403, protein: 34, fats: 3, carbs: 60 },
        instructions: '1. Cook the rice according to the package instructions.',
        notes: 'GF option, cook rice per package instructions',
      },
      {
        name: 'Cheezel Crumbed Chicken & Veggies (GF)',
        category: 'Dinner',
        ingredients: [
          { id: 'ing-1', name: 'Broccoli', qty: '80', unit: 'g' },
          { id: 'ing-2', name: 'Butter (Light)', qty: '8', unit: 'g' },
          { id: 'ing-3', name: 'Carrot', qty: '80', unit: 'g' },
          { id: 'ing-4', name: 'Cheezels', qty: '1', unit: 'pack' },
          { id: 'ing-5', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
          { id: 'ing-6', name: 'Egg White', qty: '60', unit: 'g' },
          { id: 'ing-7', name: 'Low Carb Potato - Carisma/Spud Lite', qty: '225', unit: 'g' },
        ],
        macros: { calories: 491, protein: 49, fats: 12, carbs: 42 },
        notes: 'GF option',
      },
    ];

    defaults.forEach(recipe => this.addRecipe(recipe));
  }
}

export const recipeDatabase = new RecipeDatabase();

// Initialize with defaults on first load
if (typeof window !== 'undefined') {
  recipeDatabase.initializeDefaults();
  
  // Migration: Ensure new recipes are added even if database already has recipes
  const STORAGE_KEY = 'jade-recipe-database-v1';
  const stored = localStorage.getItem(STORAGE_KEY);
  const existingData = stored ? JSON.parse(stored) : {};
  
  const newRecipesToAdd = [
    {
      name: 'Snacks',
      category: 'Snack',
      ingredients: [
        { id: 'ing-1', name: 'Harvest Pea Snaps (Original Salted) (18g) - Calbee', qty: '1', unit: 'pack' },
        { id: 'ing-2', name: 'Kiwifruit', qty: '100', unit: 'g' },
        { id: 'ing-3', name: 'Medium Coffee on Skim Milk', qty: '1', unit: 'serve' },
      ],
      macros: { calories: 264, protein: 16, fats: 4, carbs: 37 },
    },
    {
      name: 'Rice Cakes with Peanut Butter and Banana (Mid Meal)',
      category: 'Snack',
      ingredients: [
        { id: 'ing-1', name: 'Banana', qty: '50', unit: 'g' },
        { id: 'ing-2', name: 'Peanut Butter - Bega', qty: '15', unit: 'g' },
        { id: 'ing-3', name: 'Rice Cakes - Sunrise', qty: '2', unit: 'cakes' },
      ],
      macros: { calories: 186, protein: 5, fats: 8, carbs: 22 },
    },
    {
      name: 'Caramelized Pineapple Burger (GF)',
      category: 'Dinner',
      ingredients: [
        { id: 'ing-1', name: '50% Less Fat Cheese Slice - Bega', qty: '1', unit: 'slice' },
        { id: 'ing-2', name: 'Brioche Bun Gluten free (80g) - Woolworths Brand', qty: '1', unit: 'bun' },
        { id: 'ing-3', name: 'Extra Lean Beef Mince (5 Star) (Weighed Raw)', qty: '100', unit: 'g' },
        { id: 'ing-4', name: 'Lettuce', qty: '30', unit: 'g' },
        { id: 'ing-5', name: 'Natural Brown Sweetener - Natvia', qty: '10', unit: 'g' },
        { id: 'ing-6', name: 'Onion', qty: '20', unit: 'g' },
        { id: 'ing-7', name: 'Pineapple Canned - Golden Circle', qty: '50', unit: 'g' },
      ],
      macros: { calories: 424, protein: 33, fats: 11, carbs: 45 },
    },
    {
      name: 'Rice Cakes with Honey and Banana (Mid Meal)',
      category: 'Snack',
      ingredients: [
        { id: 'ing-1', name: 'Banana', qty: '100', unit: 'g' },
        { id: 'ing-2', name: 'Honey', qty: '5', unit: 'g' },
        { id: 'ing-3', name: 'Rice Cakes - Sunrise', qty: '2', unit: 'cakes' },
      ],
      macros: { calories: 153, protein: 2, fats: 1, carbs: 34 },
    },
    {
      name: 'Chicken Gyros (GF)',
      category: 'Dinner',
      ingredients: [
        { id: 'ing-1', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
        { id: 'ing-2', name: 'Garlic & Herb All Natural Seasoning - Mingle', qty: '20', unit: 'g' },
        { id: 'ing-3', name: 'Lettuce', qty: '20', unit: 'g' },
        { id: 'ing-4', name: 'Low Carb Potato - Carisma/Spud Lite', qty: '200', unit: 'g' },
        { id: 'ing-5', name: 'Onion', qty: '15', unit: 'g' },
        { id: 'ing-6', name: 'Oregano', qty: '1', unit: 'g' },
        { id: 'ing-7', name: 'Tomato', qty: '50', unit: 'g' },
        { id: 'ing-8', name: 'Tzatziki - Willow Farm', qty: '20', unit: 'g' },
        { id: 'ing-9', name: 'White Wraps (50g) - Free From Gluten (Woolworths Only)', qty: '1', unit: 'wrap' },
      ],
      macros: { calories: 510, protein: 44, fats: 8, carbs: 64 },
    },
    {
      name: 'Cantonese Chicken (GF)',
      category: 'Dinner',
      ingredients: [
        { id: 'ing-1', name: 'Broccoli', qty: '100', unit: 'g' },
        { id: 'ing-2', name: 'Cantonese Beef Stir Fry Sauce - Passage to Asia', qty: '70', unit: 'g' },
        { id: 'ing-3', name: 'Chicken Breast (Weighed Raw)', qty: '120', unit: 'g' },
        { id: 'ing-4', name: 'Fresh Garlic', qty: '0.05', unit: 'clove' },
        { id: 'ing-5', name: 'Onion', qty: '30', unit: 'g' },
        { id: 'ing-6', name: 'Rice Raw', qty: '35', unit: 'g' },
        { id: 'ing-7', name: 'Zucchini', qty: '80', unit: 'g' },
      ],
      macros: { calories: 403, protein: 34, fats: 3, carbs: 60 },
    },
    {
      name: 'Cheezel Crumbed Chicken & Veggies (GF)',
      category: 'Dinner',
      ingredients: [
        { id: 'ing-1', name: 'Broccoli', qty: '80', unit: 'g' },
        { id: 'ing-2', name: 'Butter (Light)', qty: '8', unit: 'g' },
        { id: 'ing-3', name: 'Carrot', qty: '80', unit: 'g' },
        { id: 'ing-4', name: 'Cheezels', qty: '1', unit: 'pack' },
        { id: 'ing-5', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
        { id: 'ing-6', name: 'Egg White', qty: '60', unit: 'g' },
        { id: 'ing-7', name: 'Low Carb Potato - Carisma/Spud Lite', qty: '225', unit: 'g' },
      ],
      macros: { calories: 491, protein: 49, fats: 12, carbs: 42 },
    },
  ];
  
  const existingNames = new Set(Object.values(existingData as any).map((r: any) => r.name));
  let added = 0;
  
  newRecipesToAdd.forEach(recipe => {
    if (!existingNames.has(recipe.name)) {
      const id = `recipe-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;
      const now = Date.now();
      existingData[id] = { ...recipe, id, createdAt: now, updatedAt: now };
      added++;
    }
  });
  
  if (added > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
    recipeDatabase.reload();
    console.log(`✅ Added ${added} new recipes to database`);
  }
  
  // Ensure all required recipes exist (add if missing)
  const requiredRecipes = [
    {
      name: 'PB & J Overnight Weet-Bix (GF)',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-26', name: 'Weet-bix Gluten free (15g) - Sanitarium', qty: '2', unit: 'biscuits' },
        { id: 'ing-27', name: 'High Protein Almond milk - So Good', qty: '100', unit: 'ml' },
        { id: 'ing-28', name: 'Greek Yogurt Vanilla - Chobani', qty: '100', unit: 'g' },
        { id: 'ing-29', name: 'Peanut Butter - Bega', qty: '15', unit: 'g' },
        { id: 'ing-30', name: 'Jam - Natvia (Woolworths Only)', qty: '20', unit: 'g' },
        { id: 'ing-31', name: 'Protein Powder - WPI (Any)', qty: '15', unit: 'g' },
        { id: 'ing-32', name: 'Maple Syrup', qty: '10', unit: 'g' },
      ],
      macros: { calories: 427, protein: 30, fats: 12, carbs: 46 },
      instructions: '1. In a bowl, combine weet-bix, protein powder, milk and sweetener. Press mixture down firmly into bowl to create base. 2. In another bowl, mix together yogurt and peanut butter until batter is smooth. Spread over weet-bix base and drizzle with jam and maple syrup.',
      notes: 'Gluten-free friendly overnight breakfast',
    },
    {
      name: 'Beef Chow Mein (GF,DF)',
      category: 'Dinner',
      ingredients: [
        { id: 'ing-33', name: 'Extra Lean Beef Strips (Weighed Raw)', qty: '150', unit: 'g' },
        { id: 'ing-34', name: 'Light Soy Sauce - Ayam', qty: '10', unit: 'g' },
        { id: 'ing-35', name: 'San Choy Bow Meal Kit (97g) - Marion\'s Kitchen', qty: '0.5', unit: 'kit' },
        { id: 'ing-36', name: 'Stir Fry Vegetables (generic)', qty: '175', unit: 'g' },
        { id: 'ing-37', name: 'Vermicelli Rice Noodle - Chang\'s', qty: '60', unit: 'g' },
      ],
      macros: { calories: 565, protein: 47, fats: 8, carbs: 71 },
      instructions: '1. Cook the vermicelli noodles according to package directions, drain and set aside. 2. Heat a wok or large pan over medium-high heat. Stir-fry beef strips until cooked through. 3. Add stir fry vegetables and cook until tender-crisp. 4. Add cooked noodles, San Choy Bow sauce, and soy sauce. Toss everything together until well combined. 5. Serve hot.',
      notes: 'Gluten-free and dairy-free friendly. High protein, low fat option.',
    },
    {
      name: 'Asian Chicken Tacos (GF & DF)',
      category: 'Dinner',
      ingredients: [
        { id: 'ing-38', name: 'Carrot', qty: '60', unit: 'g' },
        { id: 'ing-39', name: 'Chicken Breast (Weighed Raw)', qty: '150', unit: 'g' },
        { id: 'ing-40', name: 'Fried Shallots - Doree', qty: '5', unit: 'g' },
        { id: 'ing-41', name: 'Honey', qty: '10', unit: 'g' },
        { id: 'ing-42', name: 'Lettuce', qty: '40', unit: 'g' },
        { id: 'ing-43', name: 'Light Soy Sauce - Ayam', qty: '20', unit: 'g' },
        { id: 'ing-44', name: 'Minced Garlic - Woolworths', qty: '10', unit: 'g' },
        { id: 'ing-45', name: 'Onion', qty: '20', unit: 'g' },
        { id: 'ing-46', name: 'Taco Shell (13g) - Old El Paso', qty: '3', unit: 'shells' },
        { id: 'ing-47', name: 'Vegan Aioli - Praise', qty: '15', unit: 'g' },
      ],
      macros: { calories: 531, protein: 38, fats: 19, carbs: 42 },
      instructions: '1. Heat a large pan over medium-high heat. 2. Stir-fry chicken with minced garlic and onion until cooked through. 3. Add carrot and cook until tender-crisp. 4. Season with honey and soy sauce. 5. Warm taco shells and assemble with lettuce, chicken mixture, fried shallots, and vegan aioli. 6. Serve with lemon wedge.',
      notes: 'Gluten-free and dairy-free friendly. Vegan aioli version.',
    },
    {
      name: 'One Container Pesto Chicken Bake',
      category: 'Dinner',
      ingredients: [
        { id: 'ing-48', name: '50% Less Fat Cheese Shredded - Bega/Woolworths/Coles', qty: '25', unit: 'g' },
        { id: 'ing-49', name: 'Basil Pecorino & Pine Nuts Pesto - Providore', qty: '20', unit: 'g' },
        { id: 'ing-50', name: 'Chicken Breast (Weighed Raw)', qty: '100', unit: 'g' },
        { id: 'ing-51', name: 'Chicken Stock (Generic)', qty: '60', unit: 'ml' },
        { id: 'ing-52', name: 'Fresh Garlic', qty: '5', unit: 'g' },
        { id: 'ing-53', name: 'Light Plain Greek Yogurt - Chobani', qty: '30', unit: 'g' },
        { id: 'ing-54', name: 'Mushroom', qty: '50', unit: 'g' },
        { id: 'ing-55', name: 'Rice Raw (Any)', qty: '40', unit: 'g' },
        { id: 'ing-56', name: 'Tomato', qty: '50', unit: 'g' },
      ],
      macros: { calories: 456, protein: 38, fats: 16, carbs: 40 },
      instructions: '1. Preheat oven to 180 degrees celsius. 2. In a baking container, combine rice, chicken stock, and diced vegetables (mushroom, tomato, garlic). 3. Season chicken breast and place on top of rice mixture. 4. Mix pesto with Greek yogurt and spread over chicken. 5. Top with shredded cheese. 6. Bake covered for 25-30 minutes until chicken is cooked through and rice is tender. 7. Serve directly from the container.',
      notes: 'One-container meal. Easy preparation and cleanup.',
    },
    {
      name: 'Cacao Pistachio Yogurt Bowl',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-57', name: 'Cacao Nibs (Generic)', qty: '5', unit: 'g' },
        { id: 'ing-58', name: 'Frozen Raspberries', qty: '40', unit: 'g' },
        { id: 'ing-59', name: 'Honey', qty: '8', unit: 'g' },
        { id: 'ing-60', name: 'Salted Caramel High Protein Yoghurt - YoPro', qty: '150', unit: 'g' },
        { id: 'ing-61', name: 'Pistachios - Woolworths', qty: '10', unit: 'g' },
      ],
      macros: { calories: 218, protein: 21, fats: 9, carbs: 20 },
      instructions: '1. Add YoPro yoghurt to a bowl. 2. Top with frozen raspberries, cacao nibs, and pistachios. 3. Drizzle with honey. 4. Stir together and enjoy immediately, or let sit for 2-3 minutes for a softer texture.',
      notes: 'Quick, high-protein breakfast bowl. Great for busy mornings.',
    },
    {
      name: 'Skim Milk & Popcorn Snack',
      category: 'Snack',
      ingredients: [
        { id: 'ing-62', name: 'Skim Milk', qty: '350', unit: 'ml' },
        { id: 'ing-63', name: 'Popcorn (Lightly Salted & Slightly Sweet) - Cobs', qty: '14', unit: 'g' },
      ],
      macros: { calories: 197, protein: 15, fats: 3, carbs: 27 },
      instructions: '1. Pour 350ml of skim milk into a glass. 2. Serve with 14g of Cobs popcorn on the side. 3. Enjoy together as a light, crunchy snack.',
      notes: 'Perfect afternoon snack. High protein, satisfying combo of milk and popcorn.',
    },
    {
      name: 'Caramello Koala - Cadbury',
      category: 'Dessert',
      ingredients: [
        { id: 'ing-64', name: 'Caramello Koala - Cadbury (15g)', qty: '1', unit: 'whole' },
      ],
      macros: { calories: 75, protein: 1, fats: 3, carbs: 11 },
      instructions: '1. Unwrap the Caramello Koala chocolate. 2. Enjoy as is or break into pieces. 3. Perfect after-meal treat.',
      notes: 'Single chocolate treat. Sweet dessert fix.',
    },
    {
      name: 'Chocolate Carrot Muffins (Toddlers & Beyond)',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-65', name: 'Sunflower seeds', qty: '60', unit: 'g' },
        { id: 'ing-66', name: 'Carrots (peeled, cut into pieces)', qty: '200', unit: 'g' },
        { id: 'ing-67', name: 'Pitted Medjool dates', qty: '100', unit: 'g' },
        { id: 'ing-68', name: 'Eggs', qty: '2', unit: 'whole' },
        { id: 'ing-69', name: 'Milk (of choice)', qty: '60', unit: 'g' },
        { id: 'ing-70', name: 'Raw sugar', qty: '2', unit: 'tbsp' },
        { id: 'ing-71', name: 'Extra virgin olive oil', qty: '120', unit: 'g' },
        { id: 'ing-72', name: 'Wholemeal spelt flour', qty: '170', unit: 'g' },
        { id: 'ing-73', name: 'Raw cacao powder', qty: '20', unit: 'g' },
        { id: 'ing-74', name: 'Baking powder', qty: '2', unit: 'tsp' },
        { id: 'ing-75', name: 'Dark chocolate chips', qty: '70', unit: 'g' },
      ],
      macros: { calories: 213, protein: 4, fats: 16, carbs: 13 },
      instructions: '1. Preheat oven to 180°C. 2. Pulse sunflower seeds, carrots, and dates in food processor until roughly chopped. 3. Mix in eggs, milk, sugar, and olive oil. 4. In a separate bowl, combine wholemeal spelt flour, cacao powder, and baking powder. 5. Fold wet ingredients into dry ingredients until just combined. 6. Stir in dark chocolate chips. 7. Divide batter into muffin cups and bake 20-25 minutes until a skewer comes out clean. 8. Cool in tin for 5 minutes, then transfer to wire rack.',
      notes: 'Healthy muffins made with wholemeal spelt flour, dates for natural sweetness, and carrots. Great for toddlers and the whole family. Recipe from Cookidoo®.',
    },
    {
      name: 'ABC Muffins',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-76', name: 'Carrot (cut into pieces)', qty: '120', unit: 'g' },
        { id: 'ing-77', name: 'Gala apple (cored, cut into pieces)', qty: '150', unit: 'g' },
        { id: 'ing-78', name: 'Ripe banana (cut into pieces)', qty: '120', unit: 'g' },
        { id: 'ing-79', name: 'Self-raising flour', qty: '170', unit: 'g' },
        { id: 'ing-80', name: 'Rolled oats', qty: '50', unit: 'g' },
        { id: 'ing-81', name: 'Eggs', qty: '2', unit: 'whole' },
        { id: 'ing-82', name: 'Pure maple syrup', qty: '100', unit: 'g' },
        { id: 'ing-83', name: 'Greek-style natural yoghurt', qty: '100', unit: 'g' },
        { id: 'ing-84', name: 'Extra virgin olive oil', qty: '50', unit: 'g' },
        { id: 'ing-85', name: 'Natural vanilla extract', qty: '1', unit: 'tsp' },
        { id: 'ing-86', name: 'Granola (or muesli of choice, nut-free)', qty: '100', unit: 'g' },
      ],
      macros: { calories: 204, protein: 5, fats: 10, carbs: 28 },
      instructions: '1. Preheat oven to 180°C and line a muffin tin with paper cases. 2. In a food processor, blend carrot, apple, and banana until roughly chopped. 3. In a large bowl, combine self-raising flour and rolled oats. 4. In another bowl, whisk together eggs, maple syrup, yoghurt, olive oil, and vanilla extract. 5. Fold the fruit mixture into the wet ingredients. 6. Gently fold in the flour and oats until just combined. 7. Divide batter into muffin cases. 8. Top with granola. 9. Bake for 20-25 minutes until golden and a skewer comes out clean. 10. Cool in tin for 5 minutes, then transfer to wire rack.',
      notes: 'ABC Muffins = Apple, Banana, Carrot! Perfect toddler-friendly breakfast. Make-ahead friendly, store in airtight container up to 4 days.',
    },
    {
      name: 'Chocolate Chip Muffins',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-87', name: 'Butter (cut into pieces, plus extra for greasing)', qty: '100', unit: 'g' },
        { id: 'ing-88', name: 'Full cream milk', qty: '250', unit: 'g' },
        { id: 'ing-89', name: 'Eggs', qty: '2', unit: 'whole' },
        { id: 'ing-90', name: 'Natural vanilla extract', qty: '1', unit: 'tbsp' },
        { id: 'ing-91', name: 'Plain flour', qty: '300', unit: 'g' },
        { id: 'ing-92', name: 'Baking powder', qty: '1', unit: 'tbsp' },
        { id: 'ing-93', name: 'Salt', qty: '1', unit: 'pinch' },
        { id: 'ing-94', name: 'Caster sugar', qty: '150', unit: 'g' },
        { id: 'ing-95', name: 'Dark chocolate (cut into 1cm pieces)', qty: '200', unit: 'g' },
      ],
      macros: { calories: 324, protein: 6, fats: 17, carbs: 40 },
      instructions: '1. Preheat oven to 180°C and grease a muffin tin with butter. 2. Melt butter and mix with milk. 3. In a bowl, whisk eggs with vanilla extract. 4. Combine eggs with milk mixture. 5. In another bowl, sift together flour, baking powder, salt, and caster sugar. 6. Fold wet ingredients into dry ingredients until just combined. 7. Gently fold in dark chocolate pieces. 8. Divide batter into muffin cups. 9. Bake for 20-25 minutes until golden and a skewer comes out clean. 10. Cool in tin before turning out.',
      notes: 'Classic Cookidoo chocolate chip muffins. Rich, moist, and indulgent. Perfect for breakfast or special treat. Recipe from Cookidoo®.',
    },
    {
      name: 'Banana Pancakes',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-96', name: 'Milk', qty: '240', unit: 'ml' },
        { id: 'ing-97', name: 'Banana (large)', qty: '1', unit: 'whole' },
        { id: 'ing-98', name: 'Vanilla extract', qty: '2', unit: 'tsp' },
        { id: 'ing-99', name: 'Butter (melted)', qty: '14', unit: 'g' },
        { id: 'ing-100', name: 'Egg', qty: '1', unit: 'whole' },
        { id: 'ing-101', name: 'Cinnamon', qty: '2', unit: 'tsp' },
        { id: 'ing-102', name: 'Self-raising flour', qty: '120', unit: 'g' },
        { id: 'ing-103', name: 'Baking powder (if not using SR flour)', qty: '1.5', unit: 'tsp' },
        { id: 'ing-104', name: 'Salt', qty: '0.25', unit: 'tsp' },
      ],
      macros: { calories: 178, protein: 5, fats: 5, carbs: 28 },
      instructions: '1. In a blender or bowl, mash banana thoroughly. 2. Add milk, vanilla extract, melted butter, and egg. Blend or mix well. 3. In another bowl, combine self-raising flour (or flour + baking powder + salt) and cinnamon. 4. Fold wet ingredients into dry ingredients until just combined. 5. Heat a non-stick frying pan or griddle over medium heat. 6. Lightly butter or spray the pan. 7. Pour ¼ cup batter for each pancake onto the hot pan. 8. Cook for 1-2 minutes until edges look set, then flip. 9. Cook another 1-2 minutes until golden. 10. Serve warm with your choice of toppings (yogurt, berries, maple syrup, etc).',
      notes: 'Quick and easy banana pancakes. Naturally sweetened from the banana. Great for toddlers and the whole family. Can be made with or without baking powder depending on flour type.',
    },
    {
      name: 'Healthy Chocolate Chip Muffins (Toddler-Friendly)',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-105', name: 'Whole-wheat flour', qty: '1.5', unit: 'cups' },
        { id: 'ing-106', name: 'Baking powder', qty: '1', unit: 'tsp' },
        { id: 'ing-107', name: 'Baking soda', qty: '0.5', unit: 'tsp' },
        { id: 'ing-108', name: 'Salt', qty: '0.25', unit: 'tsp' },
        { id: 'ing-109', name: 'Whole milk plain Greek yogurt', qty: '1', unit: 'cup' },
        { id: 'ing-110', name: 'Maple syrup', qty: '0.33', unit: 'cup' },
        { id: 'ing-111', name: 'Unsalted butter (melted & cooled)', qty: '0.25', unit: 'cup' },
        { id: 'ing-112', name: 'Eggs (large)', qty: '2', unit: 'whole' },
        { id: 'ing-113', name: 'Pure vanilla extract', qty: '2', unit: 'tsp' },
        { id: 'ing-114', name: 'Chocolate chips (semi-sweet or dark)', qty: '1', unit: 'cup' },
      ],
      macros: { calories: 131, protein: 5, fats: 5, carbs: 18 },
      instructions: '1. Preheat oven to 375°F. Grease a 12-cup muffin pan with nonstick spray. 2. In a medium bowl, stir together whole-wheat flour, baking powder, baking soda, and salt. 3. In another bowl, stir together Greek yogurt, maple syrup, melted butter, eggs, and vanilla extract. 4. Gently stir the yogurt mixture into the flour mixture until just combined. 5. Fold in chocolate chips. 6. Divide batter among the prepared muffin cups, using about ¼ cup batter per cup. 7. Bake for 14-16 minutes, or until the edges are lightly golden brown and a cake tester inserted into the center comes out cleanly. 8. Remove from oven and transfer muffins to a wire rack to cool fully.',
      notes: 'Toddler-friendly version with whole-wheat flour and Greek yogurt protein. No refined sugar - sweetened with maple syrup. Freezes beautifully up to 3 months. Can dice for younger eaters. Recipe from Yummy Toddler Food.',
    },
    {
      name: 'Easy Cheesy Veggie Muffins',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-115', name: 'Corn kernels (fresh or frozen)', qty: '100', unit: 'g' },
        { id: 'ing-116', name: 'Carrot (grated)', qty: '100', unit: 'g' },
        { id: 'ing-117', name: 'Zucchini (grated & squeezed dry)', qty: '100', unit: 'g' },
        { id: 'ing-118', name: 'Cheddar cheese (shredded)', qty: '75', unit: 'g' },
        { id: 'ing-119', name: 'Eggs', qty: '3', unit: 'whole' },
        { id: 'ing-120', name: 'Plain flour', qty: '150', unit: 'g' },
        { id: 'ing-121', name: 'Baking powder', qty: '2', unit: 'tsp' },
        { id: 'ing-122', name: 'Applesauce (unsweetened)', qty: '75', unit: 'g' },
        { id: 'ing-123', name: 'Milk', qty: '60', unit: 'ml' },
        { id: 'ing-124', name: 'Salt', qty: '0.25', unit: 'tsp' },
      ],
      macros: { calories: 156, protein: 7, fats: 6, carbs: 18 },
      instructions: '1. Preheat oven to 180°C. Grease a 12-cup muffin tin. 2. Using Thermomix: Grate carrot and zucchini (squeeze dry with paper towel to remove excess moisture). 3. In a bowl, combine corn, grated carrot, zucchini, and cheddar cheese. 4. In another bowl, whisk eggs, then add applesauce and milk. 5. In a third bowl, combine flour, baking powder, and salt. 6. Fold wet ingredients into dry ingredients, then gently stir in vegetable mixture. 7. Divide batter among muffin cups (about ¼ cup each). 8. Bake 20-22 minutes until golden and a skewer comes out clean. 9. Cool in tin for 5 minutes, then transfer to wire rack.',
      notes: '3 veggies in one muffin! Savory, cheesy, naturally sweetened with applesauce. Perfect lunch box item. Freezes beautifully. Thermomix great for grating veggies.',
    },
    {
      name: 'Blueberry Muffins',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-125', name: 'Plain flour', qty: '250', unit: 'g' },
        { id: 'ing-126', name: 'Baking powder', qty: '2', unit: 'tsp' },
        { id: 'ing-127', name: 'Salt', qty: '0.25', unit: 'tsp' },
        { id: 'ing-128', name: 'Butter (melted)', qty: '50', unit: 'g' },
        { id: 'ing-129', name: 'Eggs', qty: '2', unit: 'whole' },
        { id: 'ing-130', name: 'Milk', qty: '200', unit: 'ml' },
        { id: 'ing-131', name: 'Honey or maple syrup', qty: '60', unit: 'g' },
        { id: 'ing-132', name: 'Vanilla extract', qty: '1', unit: 'tsp' },
        { id: 'ing-133', name: 'Fresh or frozen blueberries', qty: '150', unit: 'g' },
      ],
      macros: { calories: 198, protein: 4, fats: 7, carbs: 30 },
      instructions: '1. Preheat oven to 190°C. Grease a 12-cup muffin tin. 2. In a bowl, combine flour, baking powder, and salt. 3. In another bowl, whisk together melted butter, eggs, milk, honey/maple syrup, and vanilla extract. 4. Using Thermomix: Can mix wet ingredients together on low speed. 5. Fold wet mixture into dry ingredients until just combined (do not overmix). 6. Gently fold in blueberries. 7. Divide batter among muffin cups. 8. Bake 18-20 minutes until golden and a skewer comes out clean. 9. Cool in tin for 5 minutes, then transfer to wire rack.',
      notes: 'Classic soft muffin. Freezes beautifully - pop straight from freezer into lunchbox and thaw by snack time. Naturally sweet from honey/maple syrup.',
    },
    {
      name: 'Zucchini & Banana Bread Muffins',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-134', name: 'Ripe banana (mashed)', qty: '150', unit: 'g' },
        { id: 'ing-135', name: 'Zucchini (grated & squeezed dry)', qty: '150', unit: 'g' },
        { id: 'ing-136', name: 'Eggs', qty: '2', unit: 'whole' },
        { id: 'ing-137', name: 'Olive oil', qty: '50', unit: 'g' },
        { id: 'ing-138', name: 'Honey or maple syrup', qty: '75', unit: 'g' },
        { id: 'ing-139', name: 'Vanilla extract', qty: '1', unit: 'tsp' },
        { id: 'ing-140', name: 'Plain flour', qty: '220', unit: 'g' },
        { id: 'ing-141', name: 'Baking powder', qty: '2', unit: 'tsp' },
        { id: 'ing-142', name: 'Cinnamon', qty: '1', unit: 'tsp' },
        { id: 'ing-143', name: 'Salt', qty: '0.25', unit: 'tsp' },
      ],
      macros: { calories: 189, protein: 4, fats: 7, carbs: 29 },
      instructions: '1. Preheat oven to 180°C. Grease a 12-cup muffin tin. 2. Using Thermomix: Mash banana, then grate zucchini (squeeze dry with paper towel). 3. In a bowl, combine mashed banana, grated zucchini, eggs, olive oil, honey/maple syrup, and vanilla extract. 4. In another bowl, combine flour, baking powder, cinnamon, and salt. 5. Fold wet ingredients into dry ingredients until just combined. 6. Divide batter among muffin cups (about ¼ cup each). 7. Bake 20-22 minutes until golden and a skewer comes out clean. 8. Cool in tin for 5 minutes, then transfer to wire rack.',
      notes: 'Hidden veggie + natural banana sweetness. Soft, moist texture. Freezes perfectly. Great for lunch box - stays tender even if prepared ahead.',
    },
    {
      name: 'Carrot & Apple Muffins',
      category: 'Breakfast',
      ingredients: [
        { id: 'ing-144', name: 'Carrot (grated)', qty: '150', unit: 'g' },
        { id: 'ing-145', name: 'Apple (grated)', qty: '150', unit: 'g' },
        { id: 'ing-146', name: 'Eggs', qty: '2', unit: 'whole' },
        { id: 'ing-147', name: 'Olive oil', qty: '50', unit: 'g' },
        { id: 'ing-148', name: 'Honey or maple syrup', qty: '60', unit: 'g' },
        { id: 'ing-149', name: 'Vanilla extract', qty: '1', unit: 'tsp' },
        { id: 'ing-150', name: 'Plain flour', qty: '220', unit: 'g' },
        { id: 'ing-151', name: 'Baking powder', qty: '2', unit: 'tsp' },
        { id: 'ing-152', name: 'Cinnamon', qty: '1.5', unit: 'tsp' },
        { id: 'ing-153', name: 'Salt', qty: '0.25', unit: 'tsp' },
      ],
      macros: { calories: 176, protein: 4, fats: 7, carbs: 26 },
      instructions: '1. Preheat oven to 180°C. Grease a 12-cup muffin tin. 2. Using Thermomix: Grate carrot and apple. 3. In a bowl, combine grated carrot, apple, eggs, olive oil, honey/maple syrup, and vanilla extract. 4. In another bowl, combine flour, baking powder, cinnamon, and salt. 5. Fold wet ingredients into dry ingredients until just combined. 6. Divide batter among muffin cups (about ¼ cup each). 7. Bake 20-22 minutes until golden and a skewer comes out clean. 8. Cool in tin for 5 minutes, then transfer to wire rack.',
      notes: 'Like carrot cake but toddler-friendly! Naturally sweet from apple. Warming cinnamon spice. Perfect for lunch box or breakfast.',
    },
  ];
  
  requiredRecipes.forEach(recipe => {
    if (!recipeDatabase.getRecipeByName(recipe.name)) {
      recipeDatabase.addRecipe(recipe);
      console.log(`✅ Added ${recipe.name} to recipe database`);
    }
  });
}
