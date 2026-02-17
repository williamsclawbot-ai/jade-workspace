/**
 * Content Generator - Uses Claude 3.5 Sonnet to generate HLS content
 * Matches Jade's voice and style from existing scripts
 */

import { ContentItem } from './contentStore';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export interface GenerationRequest {
  idea: ContentItem;
  existingExamples?: ContentItem[];
}

export interface GeneratedContent {
  hook: string;
  setting: string;
  script: string;
  onScreenText: string;
  caption: string;
}

/**
 * Generate full content script based on idea
 */
export async function generateContentScript(request: GenerationRequest): Promise<GeneratedContent | null> {
  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    return null;
  }

  const { idea, existingExamples = [] } = request;

  // Build style examples from existing scripts
  const styleExamples = existingExamples
    .slice(0, 3)
    .map((item) => `
Example: ${item.title} (${item.type})
Hook: ${item.onScreenText?.split('[')[0] || 'N/A'}
Script: ${item.script?.substring(0, 200)}...
Caption: ${item.caption?.substring(0, 150)}...
`)
    .join('\n');

  const prompt = `You are Jade, a sleep consultant for Hello Little Sleepers. You create warm, evidence-based content about infant and toddler sleep.

Your voice: Emotionally grounded, practical, no fear-based language. You validate parents' struggles while offering actionable advice. You're honest about what works and what doesn't.

The user idea for content:
Title: ${idea.title}
Type: ${idea.type}
Description: ${idea.description}
Day: ${idea.day}

Your existing content style (match this tone and structure):
${styleExamples}

Generate a complete content piece with these exact fields:

**HOOK** (opening line that grabs attention, 1-2 sentences)

**SETTING** (where/how this should be filmed or presented)

**SCRIPT** (full script, conversational tone, 200-400 words depending on type)

**ON SCREEN TEXT** (visual cues for video, with timings if applicable)

**CAPTION** (social media caption, warm and actionable, include emojis where appropriate)

Make it specific to the idea provided. Keep it practical and evidence-based. No fear-based language.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return null;
    }

    const data = (await response.json()) as any;
    const text = data.content[0].text;

    // Parse response
    const hookMatch = text.match(/\*\*HOOK\*\*\s*([\s\S]*?)(?=\*\*SETTING\*\*)/);
    const settingMatch = text.match(/\*\*SETTING\*\*\s*([\s\S]*?)(?=\*\*SCRIPT\*\*)/);
    const scriptMatch = text.match(/\*\*SCRIPT\*\*\s*([\s\S]*?)(?=\*\*ON SCREEN TEXT\*\*)/);
    const onScreenMatch = text.match(/\*\*ON SCREEN TEXT\*\*\s*([\s\S]*?)(?=\*\*CAPTION\*\*)/);
    const captionMatch = text.match(/\*\*CAPTION\*\*\s*([\s\S]*?)$/);

    return {
      hook: (hookMatch ? hookMatch[1] : '').trim(),
      setting: (settingMatch ? settingMatch[1] : '').trim(),
      script: (scriptMatch ? scriptMatch[1] : '').trim(),
      onScreenText: (onScreenMatch ? onScreenMatch[1] : '').trim(),
      caption: (captionMatch ? captionMatch[1] : '').trim(),
    };
  } catch (error) {
    console.error('Content generation error:', error);
    return null;
  }
}

/**
 * Generate 7 auto content pieces for the week
 */
export async function generateWeeklyContent(): Promise<ContentItem[]> {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const types: Array<'Reel' | 'Carousel' | 'Static'> = ['Reel', 'Carousel', 'Static', 'Reel', 'Carousel', 'Static', 'Reel'];

  const topics = [
    {
      title: 'Sleep Regression Expectations',
      description: 'What to expect during developmental regressions and how to handle them with grace'
    },
    {
      title: 'Nap Transitions: The Real Talk',
      description: 'When and how to drop naps without losing your mind'
    },
    {
      title: 'Sleep Environment Checklist',
      description: 'Everything you need in the room (and what you definitely don\'t)'
    },
    {
      title: 'Bedtime Routine That Actually Works',
      description: 'Simple, consistent routine that signals sleep time to your kid\'s brain'
    },
    {
      title: 'Night Wakings: When to Respond',
      description: 'How to know if your baby needs you or is learning to self-settle'
    },
    {
      title: 'Teething & Sleep: What\'s Real',
      description: 'Separating actual teething pain from "everything is teething"'
    },
    {
      title: 'Partner Alignment on Sleep',
      description: 'Getting your partner on the same page without resentment'
    },
  ];

  const generatedPieces: ContentItem[] = [];

  for (let i = 0; i < 7; i++) {
    const day = days[i];
    const type = types[i];
    const topic = topics[i];

    const idea: ContentItem = {
      id: `auto_${Date.now()}_${i}`,
      day,
      title: topic.title,
      type,
      description: topic.description,
      status: 'Due for Review',
      script: '',
      caption: '',
      onScreenText: '',
      setting: '',
      aiGenerated: true,
      generatedAt: new Date().toISOString(),
    };

    const generated = await generateContentScript({ idea });

    if (generated) {
      generatedPieces.push({
        ...idea,
        script: generated.script,
        caption: generated.caption,
        onScreenText: generated.onScreenText,
        setting: generated.setting,
        duration: type === 'Reel' ? '45-60 seconds' : type === 'Carousel' ? '5-7 slides' : 'Single image',
      });
    }

    // Small delay between API calls
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return generatedPieces;
}
