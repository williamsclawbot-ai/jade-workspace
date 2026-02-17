/**
 * Default Cleaning Schedule for Jade
 * Designed for a busy mum with a toddler, leveraging Wednesday "Mimi window"
 * for larger tasks when Harvey is at Mimi's house
 */

export interface CleaningTask {
  id: string;
  day: string;
  task: string;
  description: string;
  timeEstimate: string;
  assignee: 'jade' | 'john' | 'both';
  completed: boolean;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  notes?: string;
}

export const defaultCleaningSchedule: Omit<CleaningTask, 'id' | 'completed'>[] = [
  // MONDAY - Quick task (15-20 min)
  {
    day: 'Monday',
    task: '🧹 Quick tidy & trash',
    description: 'Empty trash/recycling bins, quick 10-min toy tidy before bed',
    timeEstimate: '15-20 min',
    assignee: 'jade',
    frequency: 'weekly',
    notes: 'Reset after weekend mess. Good for nap time.',
  },

  // TUESDAY - Quick task (15-20 min)
  {
    day: 'Tuesday',
    task: '🧻 Bathrooms - Quick reset',
    description: 'Wipe down toilet, sink, mirrors. Quick bathroom clean.',
    timeEstimate: '20-25 min',
    assignee: 'jade',
    frequency: 'weekly',
    notes: 'Harvey is at Mimi\'s morning—use this window for bathroom if needed',
  },

  // WEDNESDAY - BIG day (2-3 hours when Harvey is at Mimi's)
  {
    day: 'Wednesday',
    task: '🏠 POWER CLEANING DAY - Mop & vacuum',
    description: 'Mop all floors, vacuum living areas, deep clean high-traffic zones. This is your big window!',
    timeEstimate: '1.5-2 hours',
    assignee: 'jade',
    frequency: 'weekly',
    notes: 'HARVEY AT MIMI\'S HOUSE - Use full block of time (morning/early afternoon) for major cleaning',
  },

  {
    day: 'Wednesday',
    task: '🧼 POWER DAY - Kitchen deep clean',
    description: 'Clean fridge inside, wipe down appliances, clean microwave, mop kitchen floor',
    timeEstimate: '45 min - 1 hour',
    assignee: 'jade',
    frequency: 'weekly',
    notes: 'Part of Wednesday power day. Can be done after mop/vacuum.',
  },

  {
    day: 'Wednesday',
    task: '🛏️ POWER DAY - Bedrooms & sheets',
    description: 'Change bed sheets, dust surfaces, tidy toys/clothes, vacuum bedroom',
    timeEstimate: '45 min - 1 hour',
    assignee: 'jade',
    frequency: 'weekly',
    notes: 'Part of Wednesday power day. Can spread across morning if needed.',
  },

  // THURSDAY - Quick task (15-20 min)
  {
    day: 'Thursday',
    task: '🧺 Laundry & towel fold',
    description: 'Fold towels, fold clean laundry, sort any washing. Quick refresh.',
    timeEstimate: '20-30 min',
    assignee: 'jade',
    frequency: 'weekly',
    notes: 'Mid-week reset. Tackle during nap time.',
  },

  // FRIDAY - Reset/catch-up day
  {
    day: 'Friday',
    task: '✨ Quick reset & catch-up',
    description: 'Quick vacuuming of main living areas, toy tidy, dust surfaces if time',
    timeEstimate: '20-30 min',
    assignee: 'jade',
    frequency: 'weekly',
    notes: 'Flexible day—catch up on anything missed or do light maintenance before weekend',
  },

  // SATURDAY - Shared task / optional
  {
    day: 'Saturday',
    task: '👨 John\'s weekend contribution (optional)',
    description: 'Decide together: bathrooms deep clean OR laundry focus OR outdoor areas',
    timeEstimate: '30-45 min',
    assignee: 'john',
    frequency: 'weekly',
    notes: 'Family task—distribute based on what\'s most needed that week',
  },

  // SUNDAY - Meal prep / planning
  {
    day: 'Sunday',
    task: '🍳 Meal prep & planning',
    description: 'Meal plan for week, any prep cooking, organize pantry/fridge for week ahead',
    timeEstimate: '30-45 min',
    assignee: 'both',
    frequency: 'weekly',
    notes: 'Not strictly "cleaning" but keeps kitchen functional & organized',
  },

  // BONUS: Biweekly/Monthly deep tasks (add these as separate items)
  {
    day: 'Wednesday',
    task: '🧹 MONTHLY - Windows & baseboards',
    description: 'Wipe window sills, clean baseboards, light dusting of high surfaces',
    timeEstimate: '45 min',
    assignee: 'jade',
    frequency: 'monthly',
    notes: 'Do on a Wednesday power day. Not every week—rotate into the schedule monthly.',
  },

  {
    day: 'Wednesday',
    task: '🛁 MONTHLY - Deep bathroom clean',
    description: 'Scrub tub/shower, grout cleaning, organize under-sink storage',
    timeEstimate: '1 hour',
    assignee: 'jade',
    frequency: 'monthly',
    notes: 'Do every 3-4 weeks on Wednesday when you have time',
  },
];

/**
 * Key principles baked into this schedule:
 * 
 * 1. WEDNESDAY IS POWER DAY
 *    - Harvey at Mimi's = uninterrupted 2-3 hour block
 *    - Do all the big, messy, noisy tasks (mop, vacuum, deep clean)
 *    - Break into 2-3 focused chunks if energy dips
 * 
 * 2. OTHER DAYS ARE "MAINTENANCE"
 *    - 15-30 min quick wins
 *    - Fit into nap windows, early morning, or bedtime routine
 *    - Keep mess from spiraling between big cleans
 * 
 * 3. REALISTIC FOR TODDLER CHAOS
 *    - Some days will get interrupted—that's OK
 *    - "Good enough" > perfect
 *    - If you miss a day, just do it the next opportunity
 *    - Don't aim for "pristine home"—aim for "functional & safe"
 * 
 * 4. BUILT-IN FLEXIBILITY
 *    - Friday is a catch-up day (no pressure)
 *    - Saturday/Sunday tasks are optional or shared
 *    - Monthly deep tasks can shift around
 *    - Add/remove tasks based on your reality
 * 
 * 5. MEASURABLE TIME ESTIMATES
 *    - Most are 15-45 min (doable during nap or early morning)
 *    - Wednesday tasks total ~3 hours (but broken into chunks)
 *    - Lets you plan realistically around Harvey's schedule
 */
