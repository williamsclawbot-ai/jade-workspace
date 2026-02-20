/**
 * API Route: Proactive Weekly Content Generation (Feb 20, 2026)
 * POST /api/content/proactive-weekly
 *
 * Generates 7 full content pieces with:
 * - Competitor-informed topics
 * - Multiple hook angles (3-5 per topic)
 * - Segment-specific messaging variations
 * - Full scripts via Claude
 * - Newsletter integration
 *
 * This replaces the generic weekly generation with market-aware, strategic content.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateContentScript } from '@/lib/contentGenerator';
import { ContentItem } from '@/lib/contentStore';
import {
  generateProactiveWeeklyTopics,
  ProactiveContentTopic,
  HLS_BRAND_PILLARS,
  CUSTOMER_SEGMENTS,
} from '@/lib/proactiveContentStrategy';

interface GeneratedProactiveContent extends ContentItem {
  pillar: string;
  hookVariations: Array<{
    angle: string;
    text: string;
    segment: string;
  }>;
  competitivePosition?: string;
  newsletterData?: {
    subject: string;
    angle: string;
  };
  metadata: {
    strategy: string;
    generatedAt: string;
    generatorVersion: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { generateFullScripts = true, segments = null } = body;

    // Step 1: Get proactive topic framework
    const topics = generateProactiveWeeklyTopics();

    // Step 2: Filter by segment if specified
    let topicsToGenerate = topics;
    if (segments && Array.isArray(segments)) {
      topicsToGenerate = topics.filter((t) => segments.includes(t.primarySegment));
    }

    // Step 3: Generate full scripts for each topic using Claude
    const generatedContent: GeneratedProactiveContent[] = [];

    for (const topic of topicsToGenerate) {
      try {
        let scriptContent = {
          hook: '',
          script: '',
          caption: '',
          onScreenText: '',
          setting: '',
        };

        if (generateFullScripts) {
          // Use the best hook from the variations to inform script generation
          const selectedHook = topic.hooks[0]; // Use primary hook

          const prompt = `You are Jade from Hello Little Sleepers. Create content based on this strategy brief:

TOPIC: ${topic.title}
PILLAR: ${topic.pillar}
TARGET SEGMENT: ${topic.primarySegment}
CONTENT TYPE: ${topic.type}

Hook (use this as inspiration): "${selectedHook.text}"

Description: ${topic.description}

Brand Context:
- ${HLS_BRAND_PILLARS[0].name}: ${HLS_BRAND_PILLARS[0].description}
- Key phrase: "Sleep isn't selfish - it's essential"
- Tone: Warm, evidence-based, validating, authentic

Segment Context (${topic.primarySegment}):
${CUSTOMER_SEGMENTS.find((s) => s.name === topic.primarySegment)?.description || 'General audience'}

Generate complete content with:

**HOOK** (1-2 sentences grabbing attention, use the hook angle provided above)

**SETTING** (where/how to film, brief)

**SCRIPT** (200-350 words, conversational, practical, warm)

**ON SCREEN TEXT** (visual cues for video)

**CAPTION** (Instagram caption with CTA, include relevant emojis)

Make it specific to the segment. Use data when relevant. No fear-based language.`;

          const generated = await generateContentScript({
            idea: {
              id: topic.id,
              day: topic.day,
              title: topic.title,
              type: topic.type,
              description: topic.description,
              status: 'Due for Review',
              script: '',
              caption: '',
              onScreenText: '',
              setting: '',
            },
            existingExamples: [],
          });

          if (generated) {
            scriptContent = generated;
          }
        }

        const contentItem: GeneratedProactiveContent = {
          id: topic.id,
          day: topic.day,
          title: topic.title,
          type: topic.type,
          description: topic.description,
          status: 'Due for Review',
          script: scriptContent.script,
          caption: scriptContent.caption,
          onScreenText: scriptContent.onScreenText,
          setting: scriptContent.setting,
          duration: topic.type === 'Reel' ? '45-60 seconds' : topic.type === 'Carousel' ? '5-7 slides' : 'Single image',
          aiGenerated: true,
          generatedAt: new Date().toISOString(),
          pillar: topic.pillar,
          hookVariations: topic.hooks.map((h) => ({
            angle: h.angle,
            text: h.text,
            segment: h.primarySegment,
          })),
          competitivePosition: topic.competitivePosition,
          newsletterData: topic.newsletter,
          metadata: {
            strategy: 'Competitor-informed + segment-targeted',
            generatedAt: new Date().toISOString(),
            generatorVersion: 'proactive-v1-feb20',
          },
        };

        generatedContent.push(contentItem);

        // Small delay between API calls to Claude
        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (topicError) {
        console.error(`Error generating content for topic ${topic.id}:`, topicError);
        // Continue with other topics even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      count: generatedContent.length,
      data: generatedContent,
      metadata: {
        framework: {
          pillars: HLS_BRAND_PILLARS.length,
          segments: CUSTOMER_SEGMENTS.length,
          allTopicsGenerated: generatedContent.length,
          generatedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Proactive content generation error:', error);
    return NextResponse.json(
      { error: 'Proactive generation failed', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET: Retrieve the proactive content strategy framework
 * Useful for dashboard display of the strategy
 */
export async function GET(request: NextRequest) {
  try {
    const topics = generateProactiveWeeklyTopics();

    return NextResponse.json({
      success: true,
      data: {
        framework: {
          pillars: HLS_BRAND_PILLARS,
          segments: CUSTOMER_SEGMENTS,
        },
        weeklyTopics: topics,
        metadata: {
          totalTopics: topics.length,
          totalPillars: HLS_BRAND_PILLARS.length,
          totalSegments: CUSTOMER_SEGMENTS.length,
          generatedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Strategy framework error:', error);
    return NextResponse.json({ error: 'Failed to retrieve strategy' }, { status: 500 });
  }
}
