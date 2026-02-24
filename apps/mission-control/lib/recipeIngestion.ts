/**
 * Recipe Ingestion Helpers
 * Functions for parsing recipes from various sources
 */

import { Recipe, Ingredient } from './recipeDatabase';

export interface ParsedRecipe {
  name: string;
  category: string;
  ingredients: Ingredient[];
  macros: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
  };
  instructions?: string;
  notes?: string;
  photoUrl?: string;
  sourceUrl?: string;
}

/**
 * Parse a Discord message to extract recipe information
 */
export function parseDiscordMessage(
  content: string,
  attachments: Array<{ url: string; content_type?: string }> = [],
  author?: string
): Partial<ParsedRecipe> {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  
  let name = '';
  let ingredients: string[] = [];
  let instructions = '';
  let macros = { calories: 0, protein: 0, fats: 0, carbs: 0 };
  let category = 'Dinner';

  // Extract recipe name from first line
  const firstLine = lines[0] || '';
  const namePatterns = [
    /^recipe:\s*(.+)/i,
    /^add recipe:\s*(.+)/i,
    /^new recipe:\s*(.+)/i,
    /^"([^"]+)"/,
    /^(.+)(?:\n|$)/,
  ];

  for (const pattern of namePatterns) {
    const match = firstLine.match(pattern);
    if (match) {
      name = match[1].trim();
      break;
    }
  }

  // Find ingredients section
  const ingredientsStart = lines.findIndex(l => 
    /^(ingredients|what you need|you.ll need)/i.test(l)
  );
  const instructionsStart = lines.findIndex(l => 
    /^(instructions|directions|method|steps|how to)/i.test(l)
  );
  const macrosStart = lines.findIndex(l => 
    /^(macros|nutrition|calories)/i.test(l)
  );

  if (ingredientsStart >= 0) {
    const endIdx = instructionsStart > ingredientsStart ? instructionsStart : 
                   macrosStart > ingredientsStart ? macrosStart : lines.length;
    ingredients = lines
      .slice(ingredientsStart + 1, endIdx)
      .filter(l => l.startsWith('-') || l.startsWith('•') || /^\d/.test(l))
      .map(l => l.replace(/^[\-•\d.\s]*/, '').trim());
  }

  if (instructionsStart >= 0) {
    const endIdx = macrosStart > instructionsStart ? macrosStart : lines.length;
    instructions = lines.slice(instructionsStart + 1, endIdx).join('\n');
  }

  if (macrosStart >= 0) {
    const macroText = lines.slice(macrosStart).join(' ').toLowerCase();
    const calMatch = macroText.match(/(\d+)\s*(?:cal|kcal|calories)/);
    const proteinMatch = macroText.match(/(\d+)g?\s*(?:protein|p)/);
    const fatMatch = macroText.match(/(\d+)g?\s*(?:fat|fats)/);
    const carbMatch = macroText.match(/(\d+)g?\s*(?:carbs|carbohydrates|c)/);

    macros = {
      calories: calMatch ? parseInt(calMatch[1]) : 0,
      protein: proteinMatch ? parseInt(proteinMatch[1]) : 0,
      fats: fatMatch ? parseInt(fatMatch[1]) : 0,
      carbs: carbMatch ? parseInt(carbMatch[1]) : 0,
    };
  }

  // Auto-detect category
  category = detectCategory(content + ' ' + name);

  // Get photo URL from first image attachment
  const photoUrl = attachments.find(a => 
    a.content_type?.startsWith('image/')
  )?.url;

  return {
    name,
    category,
    ingredients: ingredients.map((ing, idx) => ({
      id: `ing-${idx}`,
      name: ing,
      qty: '1',
      unit: 'unit',
    })),
    macros,
    instructions,
    photoUrl,
    notes: author ? `Added by ${author}` : undefined,
  };
}

/**
 * Detect recipe category from text
 */
function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  
  const categories: Record<string, string[]> = {
    'Breakfast': ['breakfast', 'morning', 'cereal', 'pancake', 'waffle', 'oatmeal', 'egg', 'toast'],
    'Lunch': ['lunch', 'sandwich', 'salad', 'wrap', 'soup'],
    'Snack': ['snack', 'treat', 'bite', 'bar', 'muffin'],
    'Dessert': ['dessert', 'sweet', 'cake', 'cookie', 'pie', 'pudding', 'ice cream'],
  };

  for (const [cat, keywords] of Object.entries(categories)) {
    if (keywords.some(k => lower.includes(k))) return cat;
  }

  return 'Dinner';
}

/**
 * Extract recipe from a website URL
 * (Would use web scraping or recipe parser API in production)
 */
export async function extractFromLink(url: string): Promise<Partial<ParsedRecipe>> {
  // This is a placeholder - in production you'd use:
  // - A recipe scraping API (like Spoonacular or Edamam)
  // - Custom web scraper with cheerio/puppeteer
  // - Structured data extraction from JSON-LD

  console.log('Extracting recipe from:', url);
  
  return {
    name: 'Recipe from ' + new URL(url).hostname,
    category: 'Dinner',
    ingredients: [],
    macros: { calories: 0, protein: 0, fats: 0, carbs: 0 },
    instructions: 'Instructions to be extracted from source',
    sourceUrl: url,
  };
}

/**
 * Extract recipe from photo using vision API
 * (Would use OpenAI Vision, Google Vision, or similar in production)
 */
export async function extractFromPhoto(photoUrl: string): Promise<Partial<ParsedRecipe>> {
  // This is a placeholder - in production you'd use:
  // - OpenAI GPT-4 Vision
  // - Google Cloud Vision
  // - AWS Rekognition

  console.log('Extracting recipe from photo:', photoUrl);

  return {
    name: 'Recipe from photo',
    category: 'Dinner',
    ingredients: [],
    macros: { calories: 0, protein: 0, fats: 0, carbs: 0 },
    instructions: 'Recipe details to be extracted from photo',
    photoUrl,
  };
}

/**
 * Validate that required recipe fields are present
 */
export function validateRecipe(recipe: Partial<ParsedRecipe>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!recipe.name || recipe.name.trim().length < 2) {
    errors.push('Recipe name is required (min 2 characters)');
  }

  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    errors.push('At least one ingredient is required');
  }

  if (!recipe.macros || recipe.macros.calories === 0) {
    errors.push('Calorie information is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Format recipe for Discord confirmation message
 */
export function formatRecipeConfirmation(recipe: ParsedRecipe): string {
  return `
✅ **Recipe Added: ${recipe.name}**

📁 Category: ${recipe.category}
📝 Ingredients: ${recipe.ingredients.length} items
🔥 Calories: ${recipe.macros.calories} | Protein: ${recipe.macros.protein}g

${recipe.photoUrl ? '📸 Photo attached' : ''}
${recipe.sourceUrl ? `🔗 Source: ${recipe.sourceUrl}` : ''}

View in Jade Workspace → Meal Planning → Recipes
`;
}
