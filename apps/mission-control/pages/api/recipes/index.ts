/**
 * API Route: Recipe CRUD Operations
 * GET /api/recipes - List all recipes
 * POST /api/recipes - Add new recipe
 * PUT /api/recipes/[id] - Update recipe
 * DELETE /api/recipes/[id] - Delete recipe
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { recipeDatabase, Recipe } from '../../../lib/recipeDatabase';

interface RecipeResponse {
  success: boolean;
  data?: Recipe | Recipe[];
  error?: string;
  details?: string;
}

/**
 * GET handler - list all recipes
 */
function handleGet(res: NextApiResponse<RecipeResponse>): void {
  try {
    const recipes = recipeDatabase.getAllRecipes();
    res.status(200).json({
      success: true,
      data: recipes,
    });
  } catch (err) {
    console.error('Error getting recipes:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

/**
 * POST handler - add new recipe
 */
function handlePost(req: NextApiRequest, res: NextApiResponse<RecipeResponse>): void {
  try {
    const { name, category, ingredients, macros, instructions, notes } = req.body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: name',
      });
    }

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: ingredients (must be non-empty array)',
      });
    }

    if (!macros || typeof macros !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: macros',
      });
    }

    // Validate macros fields
    const { calories, protein, fats, carbs } = macros;
    if (typeof calories !== 'number' || typeof protein !== 'number' || typeof fats !== 'number' || typeof carbs !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid macros: must contain calories, protein, fats, carbs as numbers',
      });
    }

    // Check if recipe already exists by name
    const existing = recipeDatabase.getRecipeByName(name);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `Recipe "${name}" already exists`,
        details: `ID: ${existing.id}`,
      });
    }

    // Add recipe
    const newRecipe = recipeDatabase.addRecipe({
      name: name.trim(),
      category: category?.trim() || undefined,
      ingredients: ingredients.map((ing: any, idx: number) => ({
        id: ing.id || `ing-${idx + 1}`,
        name: ing.name,
        qty: ing.qty,
        unit: ing.unit,
      })),
      macros: {
        calories: Math.round(calories),
        protein: Math.round(protein * 10) / 10,
        fats: Math.round(fats * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
      },
      instructions: instructions?.trim() || undefined,
      notes: notes?.trim() || undefined,
    });

    console.log(`✅ Added recipe: ${newRecipe.name} (${newRecipe.id})`);

    res.status(201).json({
      success: true,
      data: newRecipe,
    });
  } catch (err) {
    console.error('Error adding recipe:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

/**
 * Main handler
 */
export default function handler(req: NextApiRequest, res: NextApiResponse<RecipeResponse>) {
  // Set CORS headers for Discord webhook access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  switch (req.method) {
    case 'GET':
      return handleGet(res);
    case 'POST':
      return handlePost(req, res);
    default:
      return res.status(405).json({
        success: false,
        error: 'Method not allowed',
      });
  }
}
