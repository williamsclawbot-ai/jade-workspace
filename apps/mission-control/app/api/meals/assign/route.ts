/**
 * API endpoint to assign a recipe to a specific day and meal type
 * POST /api/meals/assign
 * 
 * Body: {
 *   weekId: string (e.g., "2026-w08"),
 *   day: string (e.g., "Tuesday"),
 *   mealType: string (e.g., "dinner"),
 *   recipeName: string (e.g., "Beef Chow Mein (GF,DF)"),
 *   person: "jade" | "harvey"
 * }
 * 
 * Returns: { success: boolean, message: string }
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekId, day, mealType, recipeName, person = 'jade' } = body;

    if (!weekId || !day || !mealType || !recipeName) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: weekId, day, mealType, recipeName' },
        { status: 400 }
      );
    }

    // Validate day
    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validDays.includes(day)) {
      return NextResponse.json(
        { success: false, message: `Invalid day: ${day}` },
        { status: 400 }
      );
    }

    // Validate meal type
    const validMealTypes = ['breakfast', 'lunch', 'snack', 'dinner', 'dessert'];
    if (!validMealTypes.includes(mealType.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: `Invalid meal type: ${mealType}` },
        { status: 400 }
      );
    }

    // Validate person
    if (!['jade', 'harvey'].includes(person)) {
      return NextResponse.json(
        { success: false, message: `Invalid person: ${person}` },
        { status: 400 }
      );
    }

    // Return success message
    // Note: Actual assignment happens on client-side localStorage
    // This endpoint is here for future expansion (e.g., server-side storage)
    return NextResponse.json({
      success: true,
      message: `Recipe "${recipeName}" assigned to ${day} ${mealType} for ${person}`,
      data: { weekId, day, mealType, recipeName, person },
    });

  } catch (error) {
    console.error('Error assigning meal:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to assign meal' },
      { status: 500 }
    );
  }
}
