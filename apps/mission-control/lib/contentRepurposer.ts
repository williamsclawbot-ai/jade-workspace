/**
 * Content Repurposer
 * Takes one piece of content and adapts it for multiple platforms
 * Maintains HLS voice while optimizing for each platform's norms
 */

export interface ContentVariation {
  platform: 'instagram' | 'tiktok' | 'email' | 'newsletter';
  content: string;
  characterCount: number;
  hashtags?: string[];
  cta?: string; // Call-to-action
}

export interface RepurposeRequest {
  originalContent: string;
  contentType: 'guide_excerpt' | 'reel_script' | 'article' | 'story' | 'research';
  targetPlatforms?: ('instagram' | 'tiktok' | 'email' | 'newsletter')[];
  tone?: 'educational' | 'story' | 'motivational' | 'practical';
}

export interface RepurposeResponse {
  original: string;
  variations: ContentVariation[];
  generatedAt: string;
}

/**
 * Platform-specific adaptation rules
 */
const platformRules = {
  instagram: {
    maxChars: 2200,
    format: 'caption',
    hashtagCount: 5,
    tone: 'engaging + relatable',
    tips: [
      'Line breaks for readability',
      'Hook in first 2 lines',
      'Emoji use (3-5)',
      'CTA at end',
      '5-8 hashtags for discovery'
    ]
  },
  tiktok: {
    maxChars: 1000,
    format: 'short-form script',
    tone: 'punchy + conversational',
    tips: [
      'Hook in first 3 seconds (text: first line)',
      'Shorter sentences',
      'Pattern interrupts (YES, BUT...)',
      'Relatable emotion',
      'Clear CTA (link in bio / DM for guide)',
      'Natural, fast-paced delivery'
    ]
  },
  email: {
    maxChars: 3000,
    format: 'email body (after greeting)',
    tone: 'warm + direct',
    tips: [
      'Short paragraphs (2-3 sentences max)',
      'One main idea per email',
      'Personal story or relatable moment',
      'Specific, actionable advice',
      'Soft CTA (not pushy)'
    ]
  },
  newsletter: {
    maxChars: 1500,
    format: 'newsletter section',
    tone: 'educational + conversational',
    tips: [
      'Subheading format: "Question or benefit"',
      'Scannable (bullets or short para)',
      'Research/science tie-in if relevant',
      'Real family example',
      'Takeaway: what to DO differently'
    ]
  }
};

/**
 * Generate platform-specific variations from source content
 * Uses Claude API for intelligent repurposing
 */
export async function repurposeContent(
  request: RepurposeRequest
): Promise<RepurposeResponse> {
  const platforms = request.targetPlatforms || ['instagram', 'tiktok', 'email', 'newsletter'];

  // Build Claude prompt
  const systemPrompt = `You are a content strategist for Hello Little Sleepers, a parenting sleep education brand.
Your job: take source content and adapt it for different platforms while maintaining HLS voice.

HLS Voice Guidelines:
- Warm, non-judgmental, centers BOTH baby AND parent
- Founder authenticity (real stories, not clinical)
- Key phrases: "Sleep isn't selfish", "Change is possible", "You're not alone"
- Acknowledge emotional weight while offering practical solutions
- Parental wellbeing is primary

Platform Adaptation Rules:
${JSON.stringify(platformRules, null, 2)}

CRITICAL: 
1. Maintain core message from original content
2. Follow platform character limits strictly
3. Use natural, conversational language (not corporate)
4. Each variation should feel native to that platform
5. Include 1 relevant HLS brand phrase in each variation`;

  const userPrompt = `Source content (${request.contentType}):
"${request.originalContent}"

Create variations for: ${platforms.join(', ')}

For each platform, provide ONLY the final content (no explanations, no meta).
Format each as:
[PLATFORM_NAME]
{content here}

Include hashtags/CTAs where appropriate per platform rules.`;

  try {
    // Call Claude via OpenAI-compatible endpoint (Vercel AI SDK would be cleaner but using fetch for simplicity)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.content[0].text;

    // Parse response by platform
    const variations: ContentVariation[] = [];

    for (const platform of platforms) {
      const regex = new RegExp(`\\[${platform.toUpperCase()}\\]\\s*([\\s\\S]*?)(?=\\[|$)`, 'i');
      const match = responseText.match(regex);

      if (match && match[1]) {
        const content = match[1].trim();
        const hashtags = extractHashtags(content, platform);

        variations.push({
          platform: platform as ContentVariation['platform'],
          content,
          characterCount: content.length,
          hashtags,
          cta: extractCTA(content)
        });
      }
    }

    return {
      original: request.originalContent,
      variations,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Content repurposer error:', error);
    throw new Error(`Failed to repurpose content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract hashtags from content (for Instagram/TikTok)
 */
function extractHashtags(content: string, platform: string): string[] {
  if (platform === 'instagram' || platform === 'tiktok') {
    const hashtagRegex = /#\w+/g;
    const found = content.match(hashtagRegex) || [];
    return found.slice(0, 8); // Limit to 8
  }
  return [];
}

/**
 * Extract CTA from content
 */
function extractCTA(content: string): string {
  const ctaPatterns = [
    /(?:DM|message) (?:us|me) for .+/i,
    /(?:link in bio|check out).+/i,
    /(?:share your story|tell us).+/i,
    /(?:Get|Download|Learn more).+/i
  ];

  for (const pattern of ctaPatterns) {
    const match = content.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return undefined;
}
