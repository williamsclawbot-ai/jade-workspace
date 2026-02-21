import { repurposeContent, RepurposeRequest, RepurposeResponse } from '../../../../lib/contentRepurposer';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/content/repurpose
 * Repurpose content for multiple platforms
 * 
 * Body:
 * {
 *   originalContent: string,
 *   contentType: 'guide_excerpt' | 'reel_script' | 'article' | 'story' | 'research',
 *   targetPlatforms?: ['instagram', 'tiktok', 'email', 'newsletter'],
 *   tone?: 'educational' | 'story' | 'motivational' | 'practical'
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.originalContent || !body.contentType) {
      return NextResponse.json(
        { error: 'Missing required fields: originalContent, contentType' },
        { status: 400 }
      );
    }

    const repurposeRequest: RepurposeRequest = {
      originalContent: body.originalContent,
      contentType: body.contentType,
      targetPlatforms: body.targetPlatforms || ['instagram', 'tiktok', 'email', 'newsletter'],
      tone: body.tone
    };

    const result: RepurposeResponse = await repurposeContent(repurposeRequest);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Repurpose API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to repurpose content' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/content/repurpose
 * Returns platform rules and content type definitions
 */
export async function GET() {
  const rules = {
    contentTypes: ['guide_excerpt', 'reel_script', 'article', 'story', 'research'],
    tones: ['educational', 'story', 'motivational', 'practical'],
    platforms: {
      instagram: {
        maxChars: 2200,
        format: 'caption',
        tips: ['Line breaks for readability', 'Hook in first 2 lines', 'Emoji use (3-5)', 'CTA at end']
      },
      tiktok: {
        maxChars: 1000,
        format: 'short-form script',
        tips: ['Hook in first 3 seconds', 'Shorter sentences', 'Pattern interrupts', 'Clear CTA']
      },
      email: {
        maxChars: 3000,
        format: 'email body',
        tips: ['Short paragraphs', 'One main idea', 'Personal story', 'Soft CTA']
      },
      newsletter: {
        maxChars: 1500,
        format: 'newsletter section',
        tips: ['Subheading format', 'Scannable bullets', 'Research tie-in', 'Actionable takeaway']
      }
    }
  };

  return NextResponse.json(rules, { status: 200 });
}
