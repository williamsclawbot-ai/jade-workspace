/**
 * Auto-revision system for content with feedback
 * Runs daily (e.g., 11pm) to:
 * 1. Find all items with status "Feedback Given"
 * 2. Call Claude API to revise based on feedback
 * 3. Update status to "Due for Review" 
 * 4. Record revision timestamp
 */

import ContentStore, { ContentItem } from './contentStore';

export interface RevisionResult {
  id: string;
  success: boolean;
  error?: string;
  revisionDate: string;
}

export async function autoReviseContentWithFeedback(): Promise<RevisionResult[]> {
  const results: RevisionResult[] = [];
  const now = new Date().toISOString();

  try {
    // Get all items with "Feedback Given" status
    const allItems = ContentStore.getAll();
    const itemsAwaitingRevision = allItems.filter(item => item.status === 'Feedback Given' && item.feedback);

    if (itemsAwaitingRevision.length === 0) {
      console.log('No items awaiting revision');
      return results;
    }

    console.log(`Found ${itemsAwaitingRevision.length} items to revise`);

    // Process each item
    for (const item of itemsAwaitingRevision) {
      try {
        // Call content generation API with revision instruction
        const response = await fetch('/api/content/revise', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: item.id,
            originalScript: item.script,
            originalCaption: item.caption,
            feedback: item.feedback,
            type: item.type,
          }),
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.revised) {
          // Update item with revised content and new status
          ContentStore.update(item.id, {
            script: data.revised.script || item.script,
            caption: data.revised.caption || item.caption,
            onScreenText: data.revised.onScreenText || item.onScreenText,
            status: 'Due for Review',
            revisionDate: now,
            lastUpdated: now,
            waitingOn: 'felicia', // Felicia needs to review again
          });

          results.push({
            id: item.id,
            success: true,
            revisionDate: now,
          });

          console.log(`✅ Revised: ${item.title}`);
        } else {
          throw new Error(data.error || 'Revision failed');
        }
      } catch (error) {
        console.error(`Error revising ${item.id}:`, error);
        results.push({
          id: item.id,
          success: false,
          error: String(error),
          revisionDate: now,
        });
      }
    }
  } catch (error) {
    console.error('Auto-revision system error:', error);
  }

  return results;
}

/**
 * Get human-readable feedback timeline for a content item
 */
export function getFeedbackTimeline(item: ContentItem) {
  return {
    createdAt: item.createdAt,
    feedbackGiven: item.feedbackDate,
    feedbackNotes: item.feedback,
    revisionCompleted: item.revisionDate,
    waitingOn: item.waitingOn || 'you',
    message: item.revisionDate 
      ? `Feedback received on ${new Date(item.feedbackDate || '').toLocaleDateString()}. Revision completed on ${new Date(item.revisionDate).toLocaleDateString()}`
      : item.feedbackDate
      ? `Feedback received on ${new Date(item.feedbackDate).toLocaleDateString()}. Awaiting revision...`
      : null
  };
}
