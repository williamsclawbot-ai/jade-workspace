/**
 * Populate Overnight Reports (Feb 19-20, 2026 11pm run)
 * Adds all research reports to the overnight review system
 */

import { overnightReviewStore } from './overnightReviewStore';

export function populateOvernightReports() {
  const baseTimestamp = new Date('2026-02-20T00:07:00+10:00').getTime(); // Feb 20, 2026, 12:07 AM AEST

  // TASK 1: Trending Baby Sleep Topics Research
  overnightReviewStore.logWork({
    completedAt: baseTimestamp,
    taskName: 'Trending Baby Sleep Topics Research',
    summary: 'Researched current trends in baby/toddler sleep across Instagram, TikTok, Reddit, and Google. Identified 7 major trending topics (all-nighter trend, split-shift parenting, screen-free bedtimes, 6-hour sleep celebrations, etc.), compiled popular hashtags with engagement levels, and provided detailed content ideas + 7 underserved gaps HLS could fill.',
    linkLabel: 'Read full trending topics report',
    linkPath: '/overnight-research/task1-trending-topics.md',
    status: 'needs-review',
    statusDetail: 'Review content ideas and gaps to fill',
    category: 'analysis',
  });

  // TASK 2 & 3: GoHighLevel Workflow Audit + Weekly Activity
  overnightReviewStore.logWork({
    completedAt: baseTimestamp + 60000, // 1 minute later
    taskName: 'GoHighLevel Workflow Audit + Weekly Activity',
    summary: 'BLOCKED: GHL API token is invalid (401 error). Cannot audit workflows or pull weekly activity until you provide a valid token. Report includes step-by-step instructions for generating a new token from GHL account with correct scopes, and templates for what both reports will deliver once unblocked.',
    linkLabel: 'Read GHL audit + activity report',
    linkPath: '/overnight-research/task2-3-ghl-audit-weekly-activity.md',
    status: 'needs-decision',
    statusDetail: 'Need valid GHL API token to proceed',
    category: 'automation',
  });

  // TASK 4: Latest Infant Sleep Research
  overnightReviewStore.logWork({
    completedAt: baseTimestamp + 120000, // 2 minutes later
    taskName: 'Latest Infant Sleep Research',
    summary: 'Analyzed 10 peer-reviewed studies from 2025-2026. Key findings: sleep as developmental process (not just rest), sleep training does NOT harm attachment (by age 6, no difference), screen-free bedtimes boost toddler sleep quality, infant sleep EEG at 4 months predicts development at 18 months. Includes practical "How You Could Use It" content angles for each study.',
    linkLabel: 'Read latest research report',
    linkPath: '/overnight-research/task4-sleep-research.md',
    status: 'needs-review',
    statusDetail: 'High-value content & positioning insights',
    category: 'analysis',
  });

  // TASK 5: Competitor Content Research
  overnightReviewStore.logWork({
    completedAt: baseTimestamp + 180000, // 3 minutes later
    taskName: 'Competitor Content Research',
    summary: 'Deep-dived 6 major baby sleep Instagram accounts (Taking Cara Babies 3M followers, Cozy Baby Sleep 237K, Modern Sleep Mama 129K, etc.). Identified what content performs best (relatable memes, quick tips, before/afters, anti-guilt messaging), their positioning gaps, and where HLS can dominate (parental wellbeing as PRIMARY, partner alignment, founder authenticity, solo parent content).',
    linkLabel: 'Read competitor research report',
    linkPath: '/overnight-research/task5-competitor-research.md',
    status: 'needs-review',
    statusDetail: 'Strategic positioning & content recommendations',
    category: 'analysis',
  });

  // TASK 6: Woolworths Grocery Integration Research
  overnightReviewStore.logWork({
    completedAt: baseTimestamp + 240000, // 4 minutes later
    taskName: 'Woolworths Grocery Integration Research',
    summary: 'Researched browser automation capabilities + existing Woolworths MCP servers. YES, fully doable! Found Coles & Woolworths MCP server (hung-ngm/coles-woolworths-mcp-server) that handles product search + price comparison. Recommended hybrid approach: MCP server for search → browser automation for cart building → Jade manually checks out. Expected time savings: 30-45 min/week.',
    linkLabel: 'Read Woolworths integration report',
    linkPath: '/overnight-research/task6-woolworths-integration.md',
    status: 'needs-decision',
    statusDetail: 'Approve approach + install MCP server?',
    category: 'automation',
  });

  // TASK 7: What Else Can I Do For You?
  overnightReviewStore.logWork({
    completedAt: baseTimestamp + 300000, // 5 minutes later
    taskName: 'What Else Can I Do For You?',
    summary: 'Generated TOP 10 strategic recommendations based on everything I know about your business + personal life. Ranked by impact: (1) Automated weekly content generation (5-7h/week saved), (2) Customer journey automation (10-15% conversion increase), (3) Harvey\'s schedule manager, (4) John\'s task coordination, (5) Revenue tracking dashboard, and more. Includes time savings, ROI estimates, and why you haven\'t asked yet.',
    linkLabel: 'Read "What Else Can I Do?" report',
    linkPath: '/overnight-research/task7-what-else-can-i-do.md',
    status: 'needs-decision',
    statusDetail: 'Pick top 3 to implement next',
    category: 'analysis',
  });

  // TASK 8: Meal & Shopping Cart Tab Audit (Feb 20, 2026)
  const feb20Timestamp = new Date('2026-02-20T06:15:00+10:00').getTime();
  overnightReviewStore.logWork({
    completedAt: feb20Timestamp,
    taskName: 'Meal & Shopping Cart Tab Audit',
    summary: 'Deep-dive system analysis of meal planning + shopping workflow. Key findings: recipe entry is #1 bottleneck (requires code edits to add new recipes, blocks scaling). Week-based architecture is solid. Top 3 fixes: (1) Paste-and-parse recipe input (2-3h), (2) Copy-week feature (1h), (3) Staples auto-restock system (2h). Full implementation roadmap with creative ideas + scaling strategy.',
    linkLabel: 'View full audit report',
    linkPath: '/MEAL_SHOPPING_AUDIT.md',
    status: 'done',
    category: 'analysis',
  });

  console.log('✅ All overnight reports added to Overnight Review tab');
  return true;
}
