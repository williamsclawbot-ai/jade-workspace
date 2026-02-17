/**
 * Woolworths Product Mapping
 * Maps Harvey's meal items to Woolworths products
 * 
 * Structure:
 * {
 *   itemName: string - The item name from Harvey's meals
 *   woolworthsUrl: string - Full Woolworths product URL
 *   woolworthsProductName: string - The exact product name on Woolworths
 *   category: string - Item category (Carb/Protein, Fruit, Vegetable, etc.)
 *   notes: string - Notes (e.g., "Best value", "Alternative options available")
 *   status: "verified" | "flagged" | "pending" - Verification status
 *   price?: string - Optional price (e.g., "$4.50")
 *   quantity?: string - Recommended quantity
 * }
 */

export interface WoolworthsProductMapping {
  itemName: string;
  woolworthsUrl: string;
  woolworthsProductName: string;
  category: string;
  notes: string;
  status: 'verified' | 'flagged' | 'pending';
  price?: string;
  quantity?: string;
}

export const woolworthsMappings: Record<string, WoolworthsProductMapping> = {
  // ============================================
  // 🥣 Carb/Protein Items
  // ============================================
  
  'ABC Muffins': {
    itemName: 'ABC Muffins',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=ABC+Muffins',
    woolworthsProductName: 'ABC Muffins (Assorted)',
    category: 'Carb/Protein',
    notes: 'Search for ABC brand muffins - various flavors available',
    status: 'flagged',
    price: '$5.50-$6.50',
    quantity: '1 pack',
  },

  'ABC Banana Muffin': {
    itemName: 'ABC Banana Muffin',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=ABC+Banana+Muffin',
    woolworthsProductName: 'ABC Banana Muffin',
    category: 'Carb/Protein',
    notes: 'Specific banana flavor from ABC brand',
    status: 'flagged',
    quantity: '1 pack',
  },

  'ABC Choc Muffin': {
    itemName: 'ABC Choc Muffin',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=ABC+Chocolate+Muffin',
    woolworthsProductName: 'ABC Chocolate Muffin',
    category: 'Carb/Protein',
    notes: 'Chocolate flavor from ABC brand',
    status: 'flagged',
    quantity: '1 pack',
  },

  'Pizza Scroll': {
    itemName: 'Pizza Scroll',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/productdetails/101008/woolworths-mini-pizza-scrolls',
    woolworthsProductName: 'Woolworths Mini Pizza Scrolls 6 Pack',
    category: 'Carb/Protein',
    notes: 'Frozen pizza scrolls - 6 pack, best value',
    status: 'verified',
    price: '$3.50',
    quantity: '1 pack (6 scrolls)',
  },

  'Ham & Cheese Scroll': {
    itemName: 'Ham & Cheese Scroll',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=Ham+Cheese+Scroll+frozen',
    woolworthsProductName: 'Frozen Ham & Cheese Scrolls',
    category: 'Carb/Protein',
    notes: 'Search for frozen ham and cheese scrolls',
    status: 'flagged',
    quantity: '1 pack',
  },

  'Cheese & Vegemite (+backup)': {
    itemName: 'Cheese & Vegemite (+backup)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=Vegemite',
    woolworthsProductName: 'Vegemite 235g jar',
    category: 'Carb/Protein',
    notes: 'Purchase Vegemite jar, pair with cheese and bread for sandwich',
    status: 'verified',
    price: '$3.80',
  },

  'Ham & Cheese Sandwich': {
    itemName: 'Ham & Cheese Sandwich',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=sliced+ham+cheese',
    woolworthsProductName: 'Sliced Ham & Cheese Combo',
    category: 'Carb/Protein',
    notes: 'Buy sliced ham and cheese separately - more economical',
    status: 'pending',
  },

  'Nut Butter & Honey (+backup)': {
    itemName: 'Nut Butter & Honey (+backup)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/pantry/spreads-sauces/peanut-almond-butters',
    woolworthsProductName: 'Peanut Butter or Almond Butter',
    category: 'Carb/Protein',
    notes: 'Choose your preferred nut butter - various brands available',
    status: 'flagged',
  },

  'Pasta & Boiled Egg (+backup)': {
    itemName: 'Pasta & Boiled Egg (+backup)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/pantry/pasta-rice-grains/pasta',
    woolworthsProductName: 'Pasta (various types)',
    category: 'Carb/Protein',
    notes: 'Buy eggs separately from fridge section',
    status: 'pending',
  },

  'Avo & Cream Cheese (+backup)': {
    itemName: 'Avo & Cream Cheese (+backup)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/fruit/avocado',
    woolworthsProductName: 'Fresh Avocados',
    category: 'Carb/Protein',
    notes: 'Pair with cream cheese - cream cheese in dairy section',
    status: 'pending',
  },

  'Sweet Potato & Chicken': {
    itemName: 'Sweet Potato & Chicken',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/vegetables/sweet-potato-pumpkin',
    woolworthsProductName: 'Fresh Sweet Potato',
    category: 'Carb/Protein',
    notes: 'Buy fresh sweet potato and chicken breast separately',
    status: 'pending',
  },

  'Choc Chip Muffins': {
    itemName: 'Choc Chip Muffins',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=Chocolate+Chip+Muffins',
    woolworthsProductName: 'Chocolate Chip Muffins',
    category: 'Carb/Protein',
    notes: 'Various brands available - search for chocolate chip muffins',
    status: 'flagged',
  },

  'Muesli Bar': {
    itemName: 'Muesli Bar',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/pantry/breakfast-snacks/breakfast-bars',
    woolworthsProductName: 'Muesli Bars (Various Brands)',
    category: 'Carb/Protein',
    notes: 'Choose from multiple brands - check sugar content',
    status: 'flagged',
  },

  'Carmans Oat Bar': {
    itemName: 'Carmans Oat Bar',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=Carmans+Oat+Bar',
    woolworthsProductName: 'Carmans Oat Bar',
    category: 'Carb/Protein',
    notes: 'Specific brand - may need to search',
    status: 'flagged',
  },

  'Rice Bubble Bars (homemade)': {
    itemName: 'Rice Bubble Bars (homemade)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=Rice+Bubbles',
    woolworthsProductName: 'Kelloggs Rice Bubbles Cereal',
    category: 'Carb/Protein',
    notes: 'Buy Rice Bubbles cereal to make bars at home',
    status: 'pending',
  },

  // ============================================
  // 🍎 Fruit Items
  // ============================================

  'Apple (introduce)': {
    itemName: 'Apple (introduce)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/fruit/apples-pears',
    woolworthsProductName: 'Fresh Apples (Gala or Pink Lady)',
    category: 'Fruit',
    notes: 'Buy loose or pre-packed apples',
    status: 'verified',
    quantity: '5-6 apples',
  },

  'Pear': {
    itemName: 'Pear',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/productdetails/145259/fresh-green-nashi-pear',
    woolworthsProductName: 'Fresh Green Nashi Pear',
    category: 'Fruit',
    notes: 'Verified product - fresh green nashi pears',
    status: 'verified',
    price: '$0.80-$1.20 each',
    quantity: '5-6 pears',
  },

  'Oranges': {
    itemName: 'Oranges',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/fruit/oranges-mandarins',
    woolworthsProductName: 'Fresh Oranges',
    category: 'Fruit',
    notes: 'Various orange varieties available',
    status: 'verified',
    quantity: '5-6 oranges',
  },

  'Banana': {
    itemName: 'Banana',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/fruit/bananas',
    woolworthsProductName: 'Fresh Bananas (Loose)',
    category: 'Fruit',
    notes: 'Best value - buy loose',
    status: 'verified',
    price: '$1.20/kg',
    quantity: '1 bunch (6-8)',
  },

  'Grapes': {
    itemName: 'Grapes',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/fruit/grapes',
    woolworthsProductName: 'Fresh Grapes (Red or Green)',
    category: 'Fruit',
    notes: 'Red or green grapes available',
    status: 'verified',
    quantity: '500g-1kg',
  },

  'Strawberries': {
    itemName: 'Strawberries',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/fruit/strawberries',
    woolworthsProductName: 'Fresh Strawberries',
    category: 'Fruit',
    notes: 'Seasonal availability - frozen alternative available',
    status: 'verified',
    quantity: '500g-1kg',
  },

  'Raspberries': {
    itemName: 'Raspberries',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/fruit/berries',
    woolworthsProductName: 'Fresh Raspberries',
    category: 'Fruit',
    notes: 'Can be pricey - frozen option may be cheaper',
    status: 'verified',
    quantity: '250g-500g',
  },

  'Blueberries': {
    itemName: 'Blueberries',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/fruit/berries',
    woolworthsProductName: 'Fresh Blueberries',
    category: 'Fruit',
    notes: 'Seasonal - frozen available year-round',
    status: 'verified',
    quantity: '250g-500g',
  },

  'Kiwi Fruit': {
    itemName: 'Kiwi Fruit',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/fruit/kiwi-fruit',
    woolworthsProductName: 'Fresh Kiwi Fruit',
    category: 'Fruit',
    notes: 'Green kiwis available year-round',
    status: 'verified',
    quantity: '6-8 kiwis',
  },

  'Plum': {
    itemName: 'Plum',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/fruit/plums',
    woolworthsProductName: 'Fresh Plums',
    category: 'Fruit',
    notes: 'Seasonal fruit',
    status: 'verified',
    quantity: '6-8 plums',
  },

  'Nectarine': {
    itemName: 'Nectarine',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/fruit/nectarines',
    woolworthsProductName: 'Fresh Nectarines',
    category: 'Fruit',
    notes: 'Seasonal summer fruit',
    status: 'verified',
    quantity: '6-8 nectarines',
  },

  // ============================================
  // 🥦 Vegetable Items
  // ============================================

  'Mixed Frozen Veg ⭐ LOVES': {
    itemName: 'Mixed Frozen Veg ⭐ LOVES',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/productdetails/93915/essentials-frozen-mixed-vegetables',
    woolworthsProductName: 'Essentials Frozen Mixed Vegetables 1kg',
    category: 'Vegetable',
    notes: 'Best value frozen mix - Harvey loves this! Mix of carrot, zucchini, potato, green beans, corn',
    status: 'verified',
    price: '$2.80',
    quantity: '1-2 packs',
  },

  'Cucumber (keep trying)': {
    itemName: 'Cucumber (keep trying)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/vegetables/cucumber',
    woolworthsProductName: 'Fresh Cucumber',
    category: 'Vegetable',
    notes: 'Fresh produce - keeps trying this veggie',
    status: 'verified',
    quantity: '2-3 cucumbers',
  },

  'Tomato (keep trying)': {
    itemName: 'Tomato (keep trying)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/vegetables/tomatoes',
    woolworthsProductName: 'Fresh Tomatoes',
    category: 'Vegetable',
    notes: 'Choose firm tomatoes - keeps trying this',
    status: 'verified',
    quantity: '4-5 tomatoes',
  },

  'Capsicum': {
    itemName: 'Capsicum',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/vegetables/capsicum-peppers',
    woolworthsProductName: 'Fresh Capsicum (Various Colors)',
    category: 'Vegetable',
    notes: 'Red, yellow, or green capsicum available',
    status: 'verified',
    quantity: '2-3 capsicums',
  },

  'Broccoli (new)': {
    itemName: 'Broccoli (new)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/vegetables/broccoli-cauliflower',
    woolworthsProductName: 'Fresh Broccoli',
    category: 'Vegetable',
    notes: 'Fresh broccoli florets - introducing new vegetable',
    status: 'verified',
    quantity: '1-2 heads',
  },

  'Green Beans (new)': {
    itemName: 'Green Beans (new)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/vegetables/beans',
    woolworthsProductName: 'Fresh Green Beans',
    category: 'Vegetable',
    notes: 'Fresh green beans - introducing new vegetable',
    status: 'verified',
    quantity: '500g',
  },

  'Roasted Sweet Potato (new)': {
    itemName: 'Roasted Sweet Potato (new)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/vegetables/sweet-potato-pumpkin',
    woolworthsProductName: 'Fresh Sweet Potato',
    category: 'Vegetable',
    notes: 'Fresh sweet potato to roast - introducing new vegetable',
    status: 'verified',
    quantity: '2-3 medium potatoes',
  },

  // ============================================
  // 🍪 Crunch Items
  // ============================================

  'Star Crackers': {
    itemName: 'Star Crackers',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=Star+Crackers',
    woolworthsProductName: 'Star Crackers (Kids Snack)',
    category: 'Crunch',
    notes: 'Popular kids cracker - multiple packs available',
    status: 'flagged',
    quantity: '1-2 boxes',
  },

  'Rice Cakes': {
    itemName: 'Rice Cakes',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/pantry/breakfast-snacks/rice-cakes',
    woolworthsProductName: 'Rice Cakes (Various Brands)',
    category: 'Crunch',
    notes: 'Plain or flavored rice cakes available',
    status: 'verified',
    quantity: '1 pack',
  },

  'Pikelets/Pancakes': {
    itemName: 'Pikelets/Pancakes',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=Pikelets+pancakes',
    woolworthsProductName: 'Pikelets or Frozen Pancakes',
    category: 'Crunch',
    notes: 'Frozen pikelets or pancakes',
    status: 'flagged',
    quantity: '1 pack',
  },

  'Veggie Chips': {
    itemName: 'Veggie Chips',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/pantry/breakfast-snacks/vegetable-chips',
    woolworthsProductName: 'Veggie Chips (Various Brands)',
    category: 'Crunch',
    notes: 'Baked vegetable chips - healthier crunch option',
    status: 'verified',
    quantity: '1 pack',
  },

  'Soft Pretzels': {
    itemName: 'Soft Pretzels',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=Soft+Pretzels',
    woolworthsProductName: 'Soft Pretzels (Frozen)',
    category: 'Crunch',
    notes: 'Frozen soft pretzels',
    status: 'flagged',
    quantity: '1 pack',
  },

  'Cheese Crackers': {
    itemName: 'Cheese Crackers',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/pantry/breakfast-snacks/crackers-biscuits',
    woolworthsProductName: 'Cheese Flavored Crackers',
    category: 'Crunch',
    notes: 'Various cheese cracker brands available',
    status: 'verified',
    quantity: '1 pack',
  },

  'Breadsticks/Grissini': {
    itemName: 'Breadsticks/Grissini',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/bakery/crackers-biscuits-bread/breadsticks',
    woolworthsProductName: 'Breadsticks or Grissini',
    category: 'Crunch',
    notes: 'Italian breadsticks - various brands',
    status: 'verified',
    quantity: '1 pack',
  },

  // ============================================
  // 🥤 Afternoon Snacks / Everyday Items
  // ============================================

  'Smoothie (banana, berries, yogurt, milk)': {
    itemName: 'Smoothie (banana, berries, yogurt, milk)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=Moove+Smoothie',
    woolworthsProductName: 'Moove Smoothie or Similar Ready-Made',
    category: 'Snack',
    notes: 'Buy ingredients or ready-made smoothies',
    status: 'flagged',
    quantity: '1 bottle or ingredients',
  },

  'Yogurt (every lunch)': {
    itemName: 'Yogurt (every lunch)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/dairy-eggs-fridge/yoghurt/plain-natural-yoghurt',
    woolworthsProductName: 'Plain Yogurt (Jalna or Woolworths Brand)',
    category: 'Everyday',
    notes: 'Plain yogurt - essential item used daily',
    status: 'verified',
    price: '$3.50-$5.00',
    quantity: '500g-1kg',
  },

  'Yogurt + Fruit': {
    itemName: 'Yogurt + Fruit',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/dairy-eggs-fridge/yoghurt',
    woolworthsProductName: 'Yogurt (see above) + Fresh Fruit',
    category: 'Snack',
    notes: 'Combination of yogurt and seasonal fruit',
    status: 'verified',
  },

  'Crackers + Cheese': {
    itemName: 'Crackers + Cheese',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/dairy-eggs-fridge/cheese',
    woolworthsProductName: 'Cheese Slices or Block',
    category: 'Snack',
    notes: 'Pair crackers with cheese - cheese in dairy section',
    status: 'verified',
  },

  'Toast + Nut Butter': {
    itemName: 'Toast + Nut Butter',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/pantry/spreads-sauces/peanut-almond-butters',
    woolworthsProductName: 'Peanut Butter or Almond Butter',
    category: 'Snack',
    notes: 'Buy nut butter, use with bread for toast',
    status: 'verified',
  },

  'Fruit Salad': {
    itemName: 'Fruit Salad',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/fruit-veg/fruit',
    woolworthsProductName: 'Fresh Fruits (Various)',
    category: 'Snack',
    notes: 'Mix of fresh fruits cut into salad',
    status: 'verified',
  },

  'Rice Cakes + Honey': {
    itemName: 'Rice Cakes + Honey',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=Honey',
    woolworthsProductName: 'Honey (Various Brands)',
    category: 'Snack',
    notes: 'Buy rice cakes and honey separately',
    status: 'verified',
  },

  // ============================================
  // 🥛 Everyday Essential Items
  // ============================================

  'Milk': {
    itemName: 'Milk',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/dairy-eggs-fridge/milk',
    woolworthsProductName: 'Fresh Milk (2L or 1L)',
    category: 'Everyday',
    notes: 'Full-cream or your preferred milk type',
    status: 'verified',
    price: '$3.50-$5.50',
    quantity: '2L bottle',
  },

  'Chicken Tenders (frozen)': {
    itemName: 'Chicken Tenders (frozen)',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/freezer/frozen-meat-alternatives/frozen-chicken',
    woolworthsProductName: 'Frozen Chicken Tenders',
    category: 'Carb/Protein',
    notes: 'Frozen chicken tenders - quick meal option',
    status: 'verified',
    quantity: '1 pack',
  },

  'Sandwiches/Wraps': {
    itemName: 'Sandwiches/Wraps',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/bakery/bread',
    woolworthsProductName: 'Fresh Bread or Wraps',
    category: 'Carb/Protein',
    notes: 'Buy bread or wraps, assemble with fillings',
    status: 'verified',
    quantity: '1 loaf or pack of wraps',
  },

  // Weekly new items - template entries
  'Weekly New Muffin': {
    itemName: 'Weekly New Muffin',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/search/products?searchTerm=Muffins',
    woolworthsProductName: 'Muffins (Search for new variety)',
    category: 'Carb/Protein',
    notes: 'Rotate new muffin varieties - search on Woolworths',
    status: 'flagged',
    quantity: '1 pack',
  },

  'Weekly New Bar': {
    itemName: 'Weekly New Bar',
    woolworthsUrl: 'https://www.woolworths.com.au/shop/browse/pantry/breakfast-snacks/breakfast-bars',
    woolworthsProductName: 'Breakfast Bars (New Variety)',
    category: 'Carb/Protein',
    notes: 'Rotate new bar varieties - various brands available',
    status: 'flagged',
    quantity: '1 pack',
  },
};

/**
 * Get mapping for an item
 */
export function getWoolworthsMapping(
  itemName: string
): WoolworthsProductMapping | undefined {
  return woolworthsMappings[itemName];
}

/**
 * Check if item has a verified mapping
 */
export function isItemVerified(itemName: string): boolean {
  const mapping = woolworthsMappings[itemName];
  return mapping ? mapping.status === 'verified' : false;
}

/**
 * Check if item is flagged (needs verification)
 */
export function isItemFlagged(itemName: string): boolean {
  const mapping = woolworthsMappings[itemName];
  return mapping ? mapping.status === 'flagged' : false;
}

/**
 * Get all items by category
 */
export function getItemsByCategory(category: string): WoolworthsProductMapping[] {
  return Object.values(woolworthsMappings).filter((m) => m.category === category);
}

/**
 * Get verified mappings
 */
export function getVerifiedMappings(): WoolworthsProductMapping[] {
  return Object.values(woolworthsMappings).filter((m) => m.status === 'verified');
}

/**
 * Get flagged mappings (need verification)
 */
export function getFlaggedMappings(): WoolworthsProductMapping[] {
  return Object.values(woolworthsMappings).filter((m) => m.status === 'flagged');
}

/**
 * Get all unmapped items (not in this database)
 */
export function getUnmappedItems(items: string[]): string[] {
  return items.filter((item) => !woolworthsMappings[item]);
}

/**
 * Add or update a mapping (for new discoveries)
 */
export function addOrUpdateMapping(
  itemName: string,
  mapping: WoolworthsProductMapping
): void {
  woolworthsMappings[itemName] = mapping;
}
