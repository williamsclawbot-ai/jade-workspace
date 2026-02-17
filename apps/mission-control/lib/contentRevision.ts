/**
 * Content Revision - Handle feedback and revise content
 */

import { generateContentScript } from './contentGenerator';
import { sendDiscordNotification } from './discordNotify';
import { ContentItem } from './contentStore';

export async function reviseContentWithFeedback(item: ContentItem): Promise<ContentItem | null> {
  if (!item.feedback) {
    console.log(`No feedback for ${item.title}`);
    return null;
  }

  const revisionPrompt = `
You are revising content based on user feedback.

Original content:
Title: ${item.title}
Script: ${item.script}
Caption: ${item.caption}

User feedback: "${item.feedback}"

Please revise the content to address the feedback while keeping the same structure and tone. 
Return the revised content in the same format as before.
`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: revisionPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Claude revision failed');
      return null;
    }

    const data = (await response.json()) as any;
    const revisedText = data.content[0].text;

    // Parse revised content (simplified - assumes same format)
    const hookMatch = revisedText.match(/Hook[:\s]*([\s\S]*?)(?=Setting|SETTING|$)/i);
    const settingMatch = revisedText.match(/Setting[:\s]*([\s\S]*?)(?=Script|SCRIPT|$)/i);
    const scriptMatch = revisedText.match(/Script[:\s]*([\s\S]*?)(?=Caption|CAPTION|$)/i);
    const captionMatch = revisedText.match(/Caption[:\s]*([\s\S]*?)$/i);

    const revised: ContentItem = {
      ...item,
      script: (scriptMatch ? scriptMatch[1] : item.script).trim(),
      caption: (captionMatch ? captionMatch[1] : item.caption).trim(),
      onScreenText: item.onScreenText, // Keep original unless specifically revised
      setting: (settingMatch ? settingMatch[1] : item.setting).trim(),
      status: 'Due for Review',
      feedback: '', // Clear feedback after revision
      lastUpdated: new Date().toISOString(),
    };

    // Send Discord notification
    await sendDiscordNotification({
      type: 'revised',
      title: item.title,
    });

    return revised;
  } catch (error) {
    console.error('Revision error:', error);
    return null;
  }
}

/**
 * Process all items with Feedback Given status
 * Called nightly to revise content
 */
export async function processAllFeedback(allItems: ContentItem[]): Promise<ContentItem[]> {
  const feedbackItems = allItems.filter((item) => item.status === 'Feedback Given');

  if (feedbackItems.length === 0) {
    return [];
  }

  const revised: ContentItem[] = [];

  for (const item of feedbackItems) {
    const result = await reviseContentWithFeedback(item);
    if (result) {
      revised.push(result);
    }

    // Small delay between revisions
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return revised;
}
