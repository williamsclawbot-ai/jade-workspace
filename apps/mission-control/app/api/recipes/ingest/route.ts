import { NextRequest, NextResponse } from 'next/server';

/**
 * Discord Recipe Ingestion API
 * Accepts webhook payloads from Discord bot for recipe submissions
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the incoming webhook
    const { message, user, attachments, embeds } = body;
    
    if (!message && !attachments?.length && !embeds?.length) {
      return NextResponse.json(
        { success: false, error: 'No recipe data provided' },
        { status: 400 }
      );
    }

    // Extract recipe information
    const recipeData = await extractRecipeFromPayload(body);
    
    if (!recipeData.name) {
      return NextResponse.json(
        { success: false, error: 'Could not extract recipe name' },
        { status: 400 }
      );
    }

    // Store recipe (in a real implementation, this would save to database)
    const result = await storeRecipe(recipeData);

    return NextResponse.json({
      success: true,
      message: `Recipe "${recipeData.name}" added successfully!`,
      recipe: result,
    });

  } catch (error) {
    console.error('Recipe ingestion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process recipe' },
      { status: 500 }
    );
  }
}

/**
 * Extract recipe data from Discord webhook payload
 */
async function extractRecipeFromPayload(payload: any) {
  const { message, attachments = [], embeds = [] } = payload;
  
  let recipeName = '';
  let ingredients: string[] = [];
  let instructions = '';
  let macros = { calories: 0, protein: 0, fats: 0, carbs: 0 };
  let category = 'Dinner';
  let photoUrl = '';
  let sourceUrl = '';

  // Parse message text
  if (message) {
    const lines = message.split('\n');
    
    // First line often contains the recipe name
    const firstLine = lines[0].trim();
    if (firstLine.toLowerCase().startsWith('recipe:')) {
      recipeName = firstLine.replace(/^recipe:\s*/i, '').trim();
    } else if (firstLine.toLowerCase().startsWith('add recipe:')) {
      recipeName = firstLine.replace(/^add recipe:\s*/i, '').trim();
    } else {
      recipeName = firstLine;
    }

    // Look for ingredients section
    const ingredientsIndex = lines.findIndex((l: string) => 
      l.toLowerCase().includes('ingredients:') || 
      l.toLowerCase().includes('what you need')
    );
    if (ingredientsIndex >= 0) {
      ingredients = lines
        .slice(ingredientsIndex + 1)
        .filter((l: string) => l.trim().startsWith('-') || l.trim().startsWith('•'))
        .map((l: string) => l.replace(/^[\-•]\s*/, '').trim());
    }

    // Look for instructions
    const instructionsIndex = lines.findIndex((l: string) => 
      l.toLowerCase().includes('instructions:') || 
      l.toLowerCase().includes('directions:') ||
      l.toLowerCase().includes('method:')
    );
    if (instructionsIndex >= 0) {
      instructions = lines.slice(instructionsIndex + 1).join('\n').trim();
    }

    // Extract macros if present
    const macroPatterns = {
      calories: /(\d+)\s*(?:cal|calories|kcal)/i,
      protein: /(\d+)g?\s*(?:protein|p)/i,
      fats: /(\d+)g?\s*(?:fat|fats|f)/i,
      carbs: /(\d+)g?\s*(?:carbs|carbohydrates|c)/i,
    };

    const fullText = message.toLowerCase();
    const calMatch = fullText.match(macroPatterns.calories);
    const proteinMatch = fullText.match(macroPatterns.protein);
    const fatsMatch = fullText.match(macroPatterns.fats);
    const carbsMatch = fullText.match(macroPatterns.carbs);

    macros = {
      calories: calMatch ? parseInt(calMatch[1]) : 0,
      protein: proteinMatch ? parseInt(proteinMatch[1]) : 0,
      fats: fatsMatch ? parseInt(fatsMatch[1]) : 0,
      carbs: carbsMatch ? parseInt(carbsMatch[1]) : 0,
    };

    // Detect category
    const categoryKeywords: Record<string, string[]> = {
      'Breakfast': ['breakfast', 'morning', 'cereal', 'pancake', 'waffle', 'egg'],
      'Lunch': ['lunch', 'sandwich', 'salad', 'wrap'],
      'Dinner': ['dinner', 'supper', 'main', 'entree'],
      'Snack': ['snack', 'treat', 'bite'],
      'Dessert': ['dessert', 'sweet', 'cake', 'cookie', 'ice cream'],
    };

    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(k => fullText.includes(k))) {
        category = cat;
        break;
      }
    }

    // Extract URL if present
    const urlMatch = message.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      sourceUrl = urlMatch[1];
    }
  }

  // Handle photo attachments
  if (attachments.length > 0) {
    const imageAttachment = attachments.find((a: any) => 
      a.content_type?.startsWith('image/')
    );
    if (imageAttachment) {
      photoUrl = imageAttachment.url;
      // In production, this would trigger vision API to extract recipe from image
    }
  }

  // Handle embeds (links shared in Discord)
  if (embeds.length > 0) {
    const linkEmbed = embeds[0];
    if (linkEmbed.url && !sourceUrl) {
      sourceUrl = linkEmbed.url;
    }
    if (linkEmbed.title && !recipeName) {
      recipeName = linkEmbed.title;
    }
    if (linkEmbed.description && !instructions) {
      instructions = linkEmbed.description;
    }
  }

  return {
    name: recipeName,
    category,
    ingredients: ingredients.length > 0 ? ingredients : ['Ingredients to be added'],
    macros,
    instructions: instructions || 'Instructions to be added',
    photoUrl,
    sourceUrl,
    submittedBy: payload.user?.username || 'unknown',
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Store recipe in database
 */
async function storeRecipe(recipeData: any) {
  // In production, this would save to your database
  // For now, we'll return the structured data
  
  const formattedIngredients = recipeData.ingredients.map((ing: string, idx: number) => ({
    id: `ing-${idx}`,
    name: ing,
    qty: '1',
    unit: 'unit',
  }));

  const recipe = {
    id: `recipe-${Date.now()}`,
    name: recipeData.name,
    category: recipeData.category,
    ingredients: formattedIngredients,
    macros: recipeData.macros,
    instructions: recipeData.instructions,
    notes: recipeData.sourceUrl ? `Source: ${recipeData.sourceUrl}` : '',
    photoUrl: recipeData.photoUrl,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // Dispatch event for client-side storage
  if (typeof globalThis !== 'undefined') {
    // This would be handled by the client-side recipeDatabase
    console.log('Recipe to be stored:', recipe);
  }

  return recipe;
}

/**
 * GET endpoint for testing webhook
 */
export async function GET() {
  return NextResponse.json({
    status: 'Discord Recipe Ingestion API is running',
    usage: 'Send POST request with Discord webhook payload',
    example: {
      message: 'Recipe: Chicken Stir Fry\\nIngredients:\\n- Chicken breast\\n- Vegetables\\nMacros: 400 cal, 30g protein',
      user: { username: 'jade' },
      attachments: [],
    },
  });
}
