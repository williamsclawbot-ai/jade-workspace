/**
 * API Route: Generate content via Claude
 * POST /api/content/generate
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateContentScript, generateWeeklyContent } from '@/lib/contentGenerator';
import { ContentItem } from '@/lib/contentStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, idea, existingExamples } = body;

    if (type === 'single') {
      // Generate for a single idea
      if (!idea) {
        return NextResponse.json(
          { error: 'Missing idea' },
          { status: 400 }
        );
      }

      const generated = await generateContentScript({
        idea,
        existingExamples,
      });

      if (!generated) {
        return NextResponse.json(
          { error: 'Generation failed' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: generated,
      });
    } else if (type === 'weekly') {
      // Generate 7 pieces for the week
      const pieces = await generateWeeklyContent();

      return NextResponse.json({
        success: true,
        count: pieces.length,
        data: pieces,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Generation API error:', error);
    return NextResponse.json(
      { error: 'Generation failed', details: String(error) },
      { status: 500 }
    );
  }
}
