/**
 * Populate Overnight Reports (Feb 19, 2026 11pm run)
 * Adds all 7 research reports to the overnight review system
 */

import { overnightReviewStore } from './overnightReviewStore';

export function populateOvernightReports() {
  const baseTimestamp = new Date('2026-02-20T00:07:00+10:00').getTime(); // Feb 20, 2026, 12:07 AM AEST

  // TASK 1: Trending Baby Sleep Topics Research
  overnightReviewStore.logWork({
    completedAt: baseTimestamp,
    taskName: 'Trending Baby Sleep Topics Research',
    summary: 'Researched current trends in baby/toddler sleep across Instagram, TikTok, Reddit, and Google. Identified 6 major trending topics (all-nighter trend, shift-splitting, butter myth debunked, etc.), compiled popular hashtags with engagement levels, and provided 8 content ideas + 7 underserved gaps HLS could fill.',
    linkLabel: 'Read full trending topics report',
    linkPath: '/Users/williams/.openclaw/workspace/reports/overnight-feb19-trending-topics.md',
    status: 'needs-review',
    statusDetail: 'Review content ideas and gaps to fill',
    category: 'analysis',
  });

  // TASK 2: GoHighLevel Workflow Audit
  overnightReviewStore.logWork({
    completedAt: baseTimestamp + 60000, // 1 minute later
    taskName: 'GoHighLevel Workflow Audit',
    summary: 'BLOCKED: GHL API token is invalid (401 error). Cannot audit workflows until you provide a valid token. Report includes instructions for getting a new token from GHL account and what the audit will deliver once unblocked.',
    linkLabel: 'Read GHL audit report (instructions)',
    linkPath: '/Users/williams/.openclaw/workspace/reports/overnight-feb19-ghl-workflow-audit.md',
    status: 'needs-decision',
    statusDetail: 'Need valid GHL API token to proceed',
    category: 'automation',
  });

  // TASK 3: Weekly Activity Summary from GoHighLevel
  overnightReviewStore.logWork({
    completedAt: baseTimestamp + 120000, // 2 minutes later
    taskName: 'Weekly Activity Summary from GoHighLevel',
    summary: 'BLOCKED: GHL API token invalid. Cannot pull weekly activity (new leads, bookings, pipeline status, revenue) until token is fixed. Report includes template of what this summary will look like once unblocked.',
    linkLabel: 'Read weekly summary report (template)',
    linkPath: '/Users/williams/.openclaw/workspace/reports/overnight-feb19-weekly-activity-summary.md',
    status: 'needs-decision',
    statusDetail: 'Same GHL token issue',
    category: 'analysis',
  });

  // TASK 4: Latest Infant Sleep Research
  overnightReviewStore.logWork({
    completedAt: baseTimestamp + 180000, // 3 minutes later
    taskName: 'Latest Infant Sleep Research',
    summary: 'Analyzed 7 peer-reviewed studies from the last 6 months. Key findings: sleep shapes long-term development (not just today), bi-directional relationship between parenting stress & baby sleep (validates HLS approach), 4-month regression is neurodevelopment (not a problem), and more. Includes practical "How You Could Use It" applications for each study.',
    linkLabel: 'Read latest research report',
    linkPath: '/Users/williams/.openclaw/workspace/reports/overnight-feb19-latest-sleep-research.md',
    status: 'needs-review',
    statusDetail: 'High-value content & positioning insights',
    category: 'analysis',
  });

  // TASK 5: Competitor Content Research
  overnightReviewStore.logWork({
    completedAt: baseTimestamp + 240000, // 4 minutes later
    taskName: 'Competitor Content Research',
    summary: 'Deep-dived 10 major baby sleep Instagram accounts (Taking Cara Babies 3M followers, Peaceful Sleeper 464K, Cozy Baby Sleep 237K, etc.). Identified what content performs best (video demos, validation posts, myth-busting, testimonials), their unique positioning, and where HLS can stand out (parental wellbeing as PRIMARY, sister-founded relatability, flexible two-method approach).',
    linkLabel: 'Read competitor research report',
    linkPath: '/Users/williams/.openclaw/workspace/reports/overnight-feb19-competitor-research.md',
    status: 'needs-review',
    statusDetail: 'Strategic positioning & content recommendations',
    category: 'analysis',
  });

  // TASK 6: Woolworths Grocery Integration Research
  overnightReviewStore.logWork({
    completedAt: baseTimestamp + 300000, // 5 minutes later
    taskName: 'Woolworths Grocery Integration Research',
    summary: 'Researched browser automation capabilities + existing Woolworths MCP servers. YES, I can automate grocery cart building from meal plans. Found pre-built MCP server (elijah-g/Woolworths-mcp) that handles product search, cart management via browser automation. Recommended hybrid approach: install MCP server → integrate with meal planning → auto-build weekly carts for Jade to review/submit. Expected time savings: 40-55 min/week.',
    linkLabel: 'Read Woolworths integration report',
    linkPath: '/Users/williams/.openclaw/workspace/reports/overnight-feb19-woolworths-integration.md',
    status: 'needs-decision',
    statusDetail: 'Approve approach + install MCP server',
    category: 'automation',
  });

  // TASK 7: What Else Can I Do For You?
  overnightReviewStore.logWork({
    completedAt: baseTimestamp + 360000, // 6 minutes later
    taskName: 'What Else Can I Do For You?',
    summary: 'Generated TOP 10 recommendations based on everything I know about your business + personal life. Ranked by impact: (1) Automated Instagram content pipeline, (2) Lead follow-up system, (3) Harvey routine tracker, (4) Testimonial automation, (5) John dashboard, (6) Email optimization, (7) Meal planning intelligence, (8) Competitor monitoring, (9) Financial dashboard, (10) Daily morning briefing. Includes time savings, ROI estimates, and implementation roadmap.',
    linkLabel: 'Read "What Else Can I Do?" report',
    linkPath: '/Users/williams/.openclaw/workspace/reports/overnight-feb19-what-else-can-you-do.md',
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
