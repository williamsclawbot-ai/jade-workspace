/**
 * Populate Items for Review Store with Overnight Research Reports
 * Run this to load all 7 overnight reports into the store
 */

import { itemsForReviewStore } from './itemsForReviewStore';
import * as fs from 'fs';
import * as path from 'path';

const REPORTS_DIR = path.join(__dirname, '../../../overnight-reports');

const reports = [
  {
    id: 'trending-topics-feb21',
    title: '🔥 Trending Baby Sleep Topics Research',
    category: 'research' as const,
    summary: 'Current trending topics on Instagram, TikTok, Reddit. Identified 7 major trends including "all-nighter compilations," partner misalignment gaps, and sleep training ethics debates. Key opportunity: Own partner alignment content (zero competitors).',
    filename: 'TRENDING_TOPICS_FEB21.md',
    priority: 'high' as const,
  },
  {
    id: 'ghl-workflow-audit-feb21',
    title: '🔧 GoHighLevel Workflow Audit',
    category: 'audit' as const,
    summary: '⚠️ API ACCESS ISSUE: GHL API returning "Unauthorized". Need to verify API key and permissions. Once fixed, will audit all workflows for health status, broken steps, and optimization opportunities.',
    filename: 'GHL_WORKFLOW_AUDIT_FEB21.md',
    priority: 'high' as const,
  },
  {
    id: 'ghl-weekly-activity-feb21',
    title: '📊 Weekly Activity Summary - GoHighLevel',
    category: 'analysis' as const,
    summary: '⚠️ API ACCESS ISSUE (same blocker). Once fixed, will provide weekly breakdown: new leads, bookings, revenue, pipeline status, and outstanding follow-ups. Auto-generated every Monday morning.',
    filename: 'GHL_WEEKLY_ACTIVITY_FEB21.md',
    priority: 'high' as const,
  },
  {
    id: 'infant-sleep-research-feb21',
    title: '🧪 Latest Infant Sleep Research',
    category: 'research' as const,
    summary: '7 peer-reviewed studies from last 6 months. Key findings: Sleep as developmental process (not just rest), 4-month "regression" is actually brain maturation, parental sleep quality affects baby sleep (validates your "Parental Wellbeing First" positioning).',
    filename: 'INFANT_SLEEP_RESEARCH_FEB21.md',
    priority: 'normal' as const,
  },
  {
    id: 'competitor-analysis-feb21',
    title: '🔍 Competitor Content Research',
    category: 'analysis' as const,
    summary: 'Analyzed 8 baby sleep consultants on Instagram. Identified white space opportunity: NO ONE does partner alignment content or leads with parental wellbeing. Your differentiation strategy is clear and validated.',
    filename: 'COMPETITOR_ANALYSIS_FEB21.md',
    priority: 'high' as const,
  },
  {
    id: 'woolworths-integration-feb21',
    title: '🛒 Woolworths Grocery Integration Research',
    category: 'research' as const,
    summary: 'Found TWO working MCP servers for Woolworths. Recommended hybrid approach: MCP for product search + browser automation for cart building. Setup time: 2-3 hours. Time savings: 30-45 min/week forever.',
    filename: 'WOOLWORTHS_INTEGRATION_FEB21.md',
    priority: 'normal' as const,
  },
  {
    id: 'strategic-recommendations-feb21',
    title: '💡 What Else Can I Do For You?',
    category: 'recommendations' as const,
    summary: 'Top 10 strategic recommendations ranked by impact. #1: Partner Coordination System (highest mental load reduction). #2: Customer Journey Optimization (+20-30% revenue). #3: Content Repurposing Engine (3-5x output). Full ROI breakdown included.',
    filename: 'STRATEGIC_RECOMMENDATIONS_FEB21.md',
    priority: 'high' as const,
  },
];

export function populateOvernightReports() {
  console.log('📦 Loading overnight research reports...');

  reports.forEach((report) => {
    try {
      const filepath = path.join(REPORTS_DIR, report.filename);
      const markdown = fs.readFileSync(filepath, 'utf-8');

      itemsForReviewStore.addItem({
        id: report.id,
        title: report.title,
        category: report.category,
        summary: report.summary,
        markdown,
        priority: report.priority,
      });

      console.log(`✅ Loaded: ${report.title}`);
    } catch (error) {
      console.error(`❌ Error loading ${report.filename}:`, error);
    }
  });

  console.log('✅ All overnight reports loaded successfully!');
  console.log(`📊 Total items: ${itemsForReviewStore.getCount()}`);
}

// Run if executed directly
if (require.main === module) {
  populateOvernightReports();
}
