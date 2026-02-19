/**
 * Add Meal & Shopping Audit to Overnight Review
 * This function is called on app init if needed
 */

import { overnightReviewStore } from './overnightReviewStore';

export function addMealAuditIfNeeded() {
  const items = overnightReviewStore.getItemsByDate();
  
  // Check if meal audit already exists
  const allItems = Object.values(items).flat();
  const exists = allItems.some(item => item.taskName.includes('Meal & Shopping'));
  
  if (!exists) {
    overnightReviewStore.logWork({
      completedAt: new Date('2026-02-20T06:15:00+10:00').getTime(),
      taskName: 'Meal & Shopping Cart Tab Audit',
      summary: 'Deep-dive system analysis of meal planning + shopping system. Key findings: (1) Recipe entry bottleneck blocks scaling—currently requires code edits. (2) Week-based architecture is solid. (3) Top 3 fixes: Paste-and-parse recipe input (2-3h), Copy-week feature (1h), Staples auto-restock system (2h). Full implementation roadmap with creative ideas + scaling strategy in MEAL_SHOPPING_AUDIT.md',
      linkLabel: 'View full audit report',
      linkPath: '/MEAL_SHOPPING_AUDIT.md',
      status: 'done',
      category: 'analysis',
    });
    console.log('✅ Meal & Shopping Audit added to Overnight Review');
  }
}
