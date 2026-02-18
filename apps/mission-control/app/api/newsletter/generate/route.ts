/**
 * API Route: Generate Newsletter Draft
 * POST /api/newsletter/generate
 * 
 * Takes a topic and generates:
 * - Newsletter outline (main points)
 * - Full draft copy (ready to edit)
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Missing topic' },
        { status: 400 }
      );
    }

    // Get OpenAI API key
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not found in environment');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Generate newsletter outline and full copy using OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        max_tokens: 2500,
        messages: [
          {
            role: 'user',
            content: `You are writing a weekly newsletter for Hello Little Sleepers, a gentle parenting & child sleep support business.

Topic: "${topic}"

Generate TWO things:

1. OUTLINE (3-5 key points to cover, bullet format)
2. FULL COPY (200-300 word newsletter body, warm and friendly tone, no fear-based language, practical + supportive)

Format your response EXACTLY like this:

**OUTLINE**
• Point 1
• Point 2
• Point 3

**FULL COPY**
[Your newsletter copy here, warm and engaging, 200-300 words]

Remember: Our voice is emotionally grounded, practical, and validating. We support parents without fear language.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Draft generation failed', details: error },
        { status: response.status }
      );
    }

    const data = (await response.json()) as any;
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response format:', data);
      return NextResponse.json(
        { error: 'Unexpected API response format' },
        { status: 500 }
      );
    }
    const text = data.choices[0].message.content;

    // Parse outline and copy
    const outlineMatch = text.match(/\*\*OUTLINE\*\*([\s\S]*?)(?=\*\*FULL COPY\*\*)/);
    const copyMatch = text.match(/\*\*FULL COPY\*\*([\s\S]*?)$/);

    const outline = (outlineMatch ? outlineMatch[1] : '').trim();
    const fullCopy = (copyMatch ? copyMatch[1] : '').trim();

    return NextResponse.json({
      success: true,
      outline,
      fullCopy,
    });
  } catch (error) {
    console.error('Newsletter generation error:', error);
    return NextResponse.json(
      { error: 'Generation failed', details: String(error) },
      { status: 500 }
    );
  }
}
