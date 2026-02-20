/**
 * API endpoint for bulk meal assignment across all days
 * POST /api/meals/bulk-assign
 * 
 * Body: {
 *   weekId: string,
 *   mealType: string (e.g., "breakfast"),
 *   recipeName: string,
 *   days?: string[] (optional, defaults to all days if not specified)
 * }
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekId, mealType, recipeName, days } = body;

    if (!weekId || !mealType || !recipeName) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: weekId, mealType, recipeName' },
        { status: 400 }
      );
    }

    const validMealTypes = ['breakfast', 'lunch', 'snack', 'dinner', 'dessert'];
    if (!validMealTypes.includes(mealType.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: `Invalid meal type: ${mealType}` },
        { status: 400 }
      );
    }

    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const targetDays = days || allDays;

    // Validate all target days
    for (const day of targetDays) {
      if (!allDays.includes(day)) {
        return NextResponse.json(
          { success: false, message: `Invalid day: ${day}` },
          { status: 400 }
        );
      }
    }

    // Return success - actual assignment happens on client-side with bulkMealHelper
    return NextResponse.json({
      success: true,
      message: `Recipe "${recipeName}" will be assigned to ${mealType} for ${targetDays.length} days`,
      data: { weekId, mealType, recipeName, days: targetDays },
    });

  } catch (error) {
    console.error('Error with bulk assignment:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process bulk assignment' },
      { status: 500 }
    );
  }
}
