/**
 * API Route: Extract Recipe from Image
 * POST /api/recipes/extract-from-image
 *
 * Accepts image URL, uses Claude vision to extract recipe details
 * Returns parsed recipe with ingredients and estimated macros
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { estimateMacrosFromIngredients } from '@/lib/macro-estimator';

interface RecipeResponse {
  name: string;
  category?: string;
  ingredients: Array<{
    id: string;
    name: string;
    qty: string | number;
    unit: string;
  }>;
  macros: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
  };
  instructions?: string;
  notes?: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

/**
 * Parse recipe ingredients string into structured format
 * Handles: "150g chicken breast", "2 cups flour", "1 tbsp honey"
 */
function parseIngredientsFromText(ingredientsText: string): Array<{ id: string; name: string; qty: string | number; unit: string }> {
  const lines = ingredientsText.split('\n').filter(line => line.trim());
  const ingredients = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Try to parse: quantity unit? ingredient
    const match = line.match(/^[\s•\-*]*([\d.]+)?\s*([a-z]*)\s+(.+)$/i);

    if (match) {
      const [, qtyStr, unitStr, ingredientName] = match;
      const quantity = qtyStr ? parseFloat(qtyStr) : 1;
      const unit = unitStr.trim() || 'g';

      ingredients.push({
        id: `ing-${i + 1}`,
        name: ingredientName.trim(),
        qty: quantity,
        unit,
      });
    } else if (line.trim()) {
      // No quantity, just ingredient name
      ingredients.push({
        id: `ing-${i + 1}`,
        name: line.trim(),
        qty: 1,
        unit: 'serving',
      });
    }
  }

  return ingredients;
}

/**
 * Use Claude vision to extract recipe from image
 * Note: This requires Claude's vision capabilities
 */
async function extractRecipeFromImageWithClaude(imageUrl: string): Promise<{
  name: string;
  ingredients: string;
  instructions?: string;
} | null> {
  // Check if we're in an environment where we can make API calls
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    console.warn('ANTHROPIC_API_KEY not set, cannot extract recipe from image');
    return null;
  }

  try {
    // Use Anthropic's Vision API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'url',
                  url: imageUrl,
                },
              },
              {
                type: 'text',
                text: `Please analyze this recipe image and extract:
1. Recipe name
2. List of ingredients with quantities and units (e.g., "150g chicken breast")
3. Brief cooking instructions (if visible)

Format your response as JSON with keys: name, ingredients (array of strings), instructions (optional)
Only extract actual recipes - if the image doesn't contain a recipe, respond with {"error": "Not a recipe"}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = (await response.json()) as any;

    // Extract text from response
    const textContent = data.content.find((block: any) => block.type === 'text');
    if (!textContent) {
      return null;
    }

    // Try to parse JSON from the response
    let recipeData;
    try {
      // Extract JSON from the text (Claude might include explanatory text)
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recipeData = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // If not valid JSON, try to manually parse the text
      console.warn('Could not parse JSON response, attempting manual parse');
      recipeData = {
        name: 'Recipe',
        ingredients: textContent.text.split('\n').filter((line: string) => line.trim()),
      };
    }

    if (recipeData.error) {
      return null; // Not a recipe
    }

    return {
      name: recipeData.name || 'Recipe',
      ingredients: Array.isArray(recipeData.ingredients)
        ? recipeData.ingredients.join('\n')
        : recipeData.ingredients || '',
      instructions: recipeData.instructions,
    };
  } catch (err) {
    console.error('Error calling Claude vision API:', err);
    return null;
  }
}

/**
 * POST handler
 */
async function handler(req: NextApiRequest, res: NextApiResponse<RecipeResponse | ErrorResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageUrl } = req.body;

  if (!imageUrl || typeof imageUrl !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid imageUrl parameter' });
  }

  try {
    // Extract recipe data from image using Claude vision
    const extracted = await extractRecipeFromImageWithClaude(imageUrl);

    if (!extracted) {
      return res.status(400).json({
        error: 'Could not extract recipe from image',
        details: 'Image does not appear to contain a recognizable recipe',
      });
    }

    // Parse ingredients
    const ingredients = parseIngredientsFromText(extracted.ingredients);

    if (ingredients.length === 0) {
      return res.status(400).json({
        error: 'No ingredients found in image',
        details: 'Could not parse any ingredient quantities or names',
      });
    }

    // Estimate macros from ingredients
    const ingredientStrings = ingredients.map(ing => `${ing.qty}${ing.unit} ${ing.name}`);
    const macros = estimateMacrosFromIngredients(ingredientStrings);

    // Build response
    const recipe: RecipeResponse = {
      name: extracted.name,
      category: undefined, // Could be inferred from recipe name/instructions
      ingredients,
      macros: {
        calories: macros.calories,
        protein: macros.protein,
        fats: macros.fat,
        carbs: macros.carbs,
      },
      instructions: extracted.instructions,
      notes: 'Extracted from Discord image',
    };

    return res.status(200).json(recipe);
  } catch (err) {
    console.error('Error in extract-from-image API:', err);
    return res.status(500).json({
      error: 'Internal server error',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

export default handler;
