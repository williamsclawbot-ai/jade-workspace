/**
 * Work Logging Helpers
 * Easy functions to log work and add to awaiting review
 * Use these in automation, cron jobs, or whenever you complete tasks
 */

import { awaitingReviewStore } from './awaitingReviewStore';
import { overnightReviewStore } from './overnightReviewStore';

/**
 * Log a completed task and optionally add to awaiting review
 * @param taskName - What was the task? (e.g., "Bug fix: Harvey's week isolation")
 * @param summary - Concise summary of what was done (1-3 sentences)
 * @param options - Additional options
 */
export function logOvernightWork(
  taskName: string,
  summary: string,
  options?: {
    category?: 'bug-fix' | 'content' | 'automation' | 'analysis' | 'build' | 'feature' | 'other';
    status?: 'done' | 'needs-review' | 'needs-decision';
    statusDetail?: string;
    linkPath?: string; // Where to find full details
    linkLabel?: string;
    addToAwaitingReview?: boolean; // Auto-add to Awaiting Review if needs attention
  }
): string {
  const itemId = `overnight-${Date.now()}`;
  
  overnightReviewStore.logWork({
    id: itemId,
    taskName,
    summary,
    category: options?.category || 'other',
    status: options?.status || 'done',
    statusDetail: options?.statusDetail,
    linkPath: options?.linkPath,
    linkLabel: options?.linkLabel,
  });

  // Auto-add to awaiting review if it needs attention
  if (options?.addToAwaitingReview && options?.status !== 'done') {
    awaitingReviewStore.addItem({
      itemName: taskName,
      topic: options?.category?.replace('-', ' ').toUpperCase() || 'WORK',
      description: summary,
      linkLabel: options?.linkLabel || 'View overnight work',
      linkPath: options?.linkPath || '#overnight-review',
      status: options?.status === 'needs-review' ? 'ready-for-review' : 'pending-decision',
      priority: 'normal',
    });
  }

  return itemId;
}

/**
 * Add an item to awaiting review (without logging to overnight)
 * Use when something is ready for review but wasn't logged as overnight work
 */
export function addToAwaitingReview(
  itemName: string,
  topic: string, // e.g., "Content", "Feature", "Decision"
  options?: {
    description?: string;
    status?: 'ready-for-review' | 'feedback-given' | 'pending-decision';
    linkPath?: string;
    linkLabel?: string;
    priority?: 'high' | 'normal' | 'low';
    dueDate?: string; // ISO date
  }
): string {
  const item = awaitingReviewStore.addItem({
    itemName,
    topic,
    description: options?.description,
    status: options?.status || 'ready-for-review',
    linkPath: options?.linkPath,
    linkLabel: options?.linkLabel,
    priority: options?.priority || 'normal',
    dueDate: options?.dueDate,
  });
  return item.id;
}

/**
 * Quick helper: log work as DONE (no review needed)
 */
export function logDoneWork(
  taskName: string,
  summary: string,
  category?: 'bug-fix' | 'content' | 'automation' | 'analysis' | 'build' | 'feature' | 'other'
): string {
  return logOvernightWork(taskName, summary, {
    category,
    status: 'done',
  });
}

/**
 * Quick helper: log work that needs REVIEW
 */
export function logReviewWork(
  taskName: string,
  summary: string,
  linkPath?: string,
  category?: 'bug-fix' | 'content' | 'automation' | 'analysis' | 'build' | 'feature' | 'other'
): string {
  return logOvernightWork(taskName, summary, {
    category,
    status: 'needs-review',
    linkPath,
    addToAwaitingReview: true,
  });
}

/**
 * Quick helper: log work that needs a DECISION
 */
export function logDecisionWork(
  taskName: string,
  summary: string,
  options?: string, // e.g., "Option A: ..., Option B: ..., Option C: ..."
  linkPath?: string,
  category?: 'feature' | 'analysis' | 'automation' | 'other'
): string {
  return logOvernightWork(taskName, summary, {
    category,
    status: 'needs-decision',
    statusDetail: options,
    linkPath,
    addToAwaitingReview: true,
  });
}

/**
 * Example usage in a cron job or background task:
 * 
 * // After completing a bug fix
 * logDoneWork(
 *   'Fix: Meals week isolation',
 *   'Harvey\'s meals now properly isolated per week using displayedWeek.weekId',
 *   'bug-fix'
 * );
 *
 * // After creating content that needs review
 * logReviewWork(
 *   'Newsletter draft for week of Feb 17',
 *   'Generated full newsletter with subject line, preview, and body copy. Ready for tone review.',
 *   '#newsletter',
 *   'content'
 * );
 *
 * // After analysis where you need her to choose
 * logDecisionWork(
 *   'Email sequence strategy',
 *   'Built three email sequences for new leads. Each has different tone and timing.',
 *   'A: Friendly 7-day, B: Educational 10-day, C: Urgent 3-day',
 *   '#campaigns',
 *   'feature'
 * );
 */
