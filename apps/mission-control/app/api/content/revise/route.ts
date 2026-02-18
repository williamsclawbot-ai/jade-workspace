import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = 'claude-3-5-sonnet-20241022';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, originalScript, originalCaption, feedback, type } = body;

    if (!originalScript || !feedback) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Call Claude to revise based on feedback
    const response = await fetch('https://api.anthropic.com/v1/messages/create', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `You are a content creator for a parenting/sleep coaching brand. The original content has feedback that needs to be incorporated.

TYPE: ${type}

ORIGINAL SCRIPT:
${originalScript}

ORIGINAL CAPTION:
${originalCaption}

FEEDBACK FROM JADE:
${feedback}

Please revise the script and caption to incorporate the feedback. Make the content more engaging, accurate, and aligned with Jade's direction. Return the revised content in this exact JSON format:

{
  "script": "revised script here",
  "caption": "revised caption here",
  "onScreenText": "any on-screen text updates"
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { success: false, error: error.message || 'API error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.content[0];

    if (content.type === 'text') {
      try {
        const revised = JSON.parse(content.text);
        return NextResponse.json({
          success: true,
          revised,
        });
      } catch {
        // If not valid JSON, return as text
        return NextResponse.json({
          success: true,
          revised: {
            script: content.text,
            caption: originalCaption,
            onScreenText: '',
          },
        });
      }
    }

    return NextResponse.json(
      { success: false, error: 'Unexpected response format' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Content revision error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
