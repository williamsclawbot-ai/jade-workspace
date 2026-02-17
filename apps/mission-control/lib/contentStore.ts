/**
 * Content Store - Single source of truth for all content data
 * Handles persistence, syncing across all tabs
 */

export interface ContentItem {
  id: string;
  day: string;
  title: string;
  type: 'Reel' | 'Carousel' | 'Static' | 'Newsletter' | 'Email';
  description: string;
  status: 'Awaiting Script' | 'Due for Review' | 'Feedback Given' | 'Ready to Film' | 'Filmed' | 'Scheduled' | 'Posted' | 'In Progress' | 'Ready to Schedule';
  script?: string;
  caption?: string;
  duration?: string;
  setting?: string;
  postTime?: string;
  reviewStatus?: 'needs-review' | 'approved' | 'changes-requested' | 'pending';
  reviewDueDate?: string;
  onScreenText?: string;
  feedback?: string; // Jade's notes/feedback
  aiGenerated?: boolean;
  generatedAt?: string; // timestamp
  lastUpdated?: string; // timestamp
}

const STORAGE_KEY = 'jade_content_items';

// Default content data with FULL SCRIPTS
const DEFAULT_CONTENT: ContentItem[] = [
  {
    id: '1',
    day: 'Monday',
    title: 'Toddler Pillow',
    type: 'Reel',
    description: 'Quick tip on choosing the right pillow for toddlers',
    status: 'Due for Review',
    duration: '45 seconds',
    setting: 'Home - nursery room',
    onScreenText: '[0-2 sec] "Does your toddler refuse to use a pillow?" [3-8 sec] Show pillow with X, transition to safe setup [8-20 sec] Show comparison: Under 2 vs 2-3 vs Over 3 [20-40 sec] Show lovey/stuffed animal alternative [40-45 sec] "Safe sleep beats cute every time"',
    script: 'Hook: "Does your toddler refuse to use a pillow?"\n\nContent: "Here\'s the thing - toddlers under 2 shouldn\'t have pillows at all. It\'s a safety thing. But I know what you\'re thinking - my kid\'s thrashing around and looks super uncomfortable.\n\nHere\'s the safe sleep setup:\n- Under 2 years: NO pillows, NO blankets, just a fitted sheet\n- 2-3 years: You can introduce a pillow NOW, but keep it FLAT and FIRM\n- Over 3: Regular pillow, but keep it simple\n\nWhat helps comfort instead? A lovey or stuffed animal they can snuggle. That gives them something without the risk.\n\nThe hardest part? Letting go of that picture-perfect nursery look. But safe sleep beats cute every time."\n\nCTA: "What\'s your toddler sleep hack? Drop it below - I read every comment!"',
    caption: 'The pillow question! 🛏️ Here\'s what you need to know about toddler sleep safety and what actually works. Under 2? NO pillows. 2-3? FLAT and FIRM. Over 3? Regular pillow is fine. Stop stressing about the Pinterest-perfect nursery - your baby just needs to be safe and comfy! 🤍',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-18'
  },
  {
    id: '2',
    day: 'Tuesday',
    title: 'Educational Carousel',
    type: 'Carousel',
    description: '5 sleep myths debunked with science',
    status: 'Due for Review',
    duration: '5 slides',
    setting: 'Graphic design / infographic',
    onScreenText: 'Slide 1: Bold title over sleep imagery | Slide 2-6: Myth on left, fact on right, icon for each | Slide 7: CTA with DM prompt',
    script: 'Slide 1 (Hook): "5 Sleep Myths That Are Keeping You Stuck"\n\nSlide 2 (Myth 1): "MORE TIRED = BETTER SLEEP"\nFact: An overtired baby actually sleeps WORSE. They get wired, cranky, and fight sleep harder.\nTruth: Watch for tired cues and bedtime earlier, not later.\n\nSlide 3 (Myth 2): "SKIP NAPS SO THEY SLEEP AT NIGHT"\nFact: Naps help regulate cortisol (stress hormone). Skip naps = more stress = worse nighttime sleep.\nTruth: Naps are NOT negotiable. They\'re foundational.\n\nSlide 4 (Myth 3): "FEED MORE AT NIGHT = LONGER SLEEP"\nFact: A full bottle doesn\'t mean a full night. Sleep drive is about circadian rhythm, not calories.\nTruth: Daytime calories matter MORE than nighttime feeds.\n\nSlide 5 (Myth 4): "LATER BEDTIME = SLEEPING IN"\nFact: Kids\' bodies have natural wake times. Push bedtime later = just a grumpy kid waking at 5am.\nTruth: Earlier bedtime often = earlier rise time naturally.\n\nSlide 6 (Myth 5): "SOME BABIES JUST DON\'T SLEEP"\nFact: All babies have sleep potential. If they\'re not sleeping, something\'s off (schedule, environment, routine).\nTruth: Sleep is a skill that can be learned and improved.\n\nSlide 7 (CTA): "Which myth have you been believing? DM me your biggest sleep question and let\'s figure it out together."',
    caption: 'Myth vs Reality: Let\'s talk about what actually helps baby sleep! These 5 myths keep parents stuck in sleep-deprived cycles... 🧵\n\n❌ Myth: More tired = better sleep (WRONG - overtired babies fight sleep harder)\n✅ Fact: Watch tired cues and move bedtime EARLIER\n\n❌ Myth: Skip naps so they sleep at night (WRONG - naps regulate cortisol)\n✅ Fact: Naps are foundational to good sleep\n\n❌ Myth: Feed more at night for longer sleep (WRONG - it\'s about circadian rhythm, not calories)\n✅ Fact: Daytime calories matter more than night feeds\n\n❌ Myth: Later bedtime = sleeping in (WRONG - just means earlier wake times)\n✅ Fact: Earlier bedtime leads to better sleep all around\n\n❌ Myth: Some babies just don\'t sleep (WRONG - sleep is learnable)\n✅ Fact: If they\'re not sleeping, something\'s fixable\n\nWhich myth have you been caught in? Which one surprised you? 🤍',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-19'
  },
  {
    id: '3',
    day: 'Wednesday',
    title: 'Harvey Turning 2',
    type: 'Static',
    description: 'Personal milestone celebrating Harvey\'s 2nd birthday',
    status: 'Ready to Film',
    setting: 'Home - with Harvey',
    postTime: '5:00 PM',
    onScreenText: 'Main image: Cute photo of Harvey celebrating\nText overlay with key milestones and quotes from caption\nDesign: Warm, personal, celebratory',
    script: 'Harvey is TWO and I honestly can\'t believe it.\n\nTwo years ago, I was sleep-deprived, questioning everything, wondering if I was doing it right. I was terrified I was messing him up. Every cry felt like a failure. Every sleepless night felt personal.\n\nHere\'s what changed:\n\n1. I stopped fighting his natural rhythms. Instead of forcing a schedule, we worked WITH his body\'s signals. Once I started watching for tired cues instead of clock-watching, everything shifted.\n\n2. I learned that consistent bedtime routines aren\'t prison - they\'re FREEDOM. Same bedtime, same wind-down, same songs. It sounds boring, but it became the most peaceful part of our day.\n\n3. I realized that gentle sleep doesn\'t mean no boundaries. He needs the boundaries. Kids THRIVE with them. We\'re firm and loving at the same time.\n\n4. The biggest shift? Letting go of guilt. Every baby is different. Every parent is different. There\'s no one right way - just YOUR way. And your way is enough.\n\nFrom a newborn who woke every 2 hours to a toddler who sleeps 11-12 hours solid at night? That\'s not luck. That\'s consistency, patience, and understanding that sleep is a skill.\n\nTo the parents in the thick of it right now with a newborn or struggling toddler: YOU\'VE GOT THIS. It doesn\'t feel like it now, but two years goes fast.\n\nCheers to you, Harvey. And cheers to the parents doing their best. That\'s enough. You\'re enough. 🤍',
    caption: 'Harvey is TWO! 🎂\n\nIt\'s been quite the sleep journey from this tiny newborn to this spirited 2-year-old. Here\'s what we learned about toddler sleep:\n\n1️⃣ Work WITH natural rhythms, not against them\n2️⃣ Consistent routines = freedom, not prison\n3️⃣ Boundaries are loving, not harsh\n4️⃣ Let go of guilt - your way IS the right way\n\nFrom waking every 2 hours to sleeping 11-12 hours solid. That\'s not luck - that\'s consistency and understanding sleep as a skill.\n\nTo the parents in the thick of it: You\'ve got this. Two years goes fast. 🤍',
    reviewStatus: 'approved',
    reviewDueDate: '2026-02-18'
  },
  {
    id: '4',
    day: 'Thursday',
    title: 'Myth-Busting Reel',
    type: 'Reel',
    description: 'Challenging the "cry it out" misconception',
    status: 'In Progress',
    duration: '50 seconds',
    setting: 'Home - bedroom / nursery',
    onScreenText: '[0-3 sec] Hook text with concerned parent imagery [3-10 sec] Show "Ignore method" with X [10-15 sec] Show "Responsive method" with checkmark [15-30 sec] Show timeline comparison [30-40 sec] Show the "middle ground" [40-50 sec] CTA text asking for biggest fear',
    script: 'Hook (0-3 sec): "Your pediatrician said let them cry? Here\'s what she probably meant..."\n\nContent (3-35 sec): "Okay, so \'cry it out\' is SO misunderstood. People think I\'m anti-cry-it-out. I\'m not. I\'m anti-UNINFORMED-cry-it-out.\n\nHere\'s the thing: Some crying while learning sleep is NORMAL. But there\'s a HUGE difference between:\n\n❌ Ignoring your baby for hours while they\'re screaming in distress\n✅ Teaching them to fall asleep independently while you\'re present and responsive\n\nThe science says: Graduated extinction (checking in, reassuring, but not picking up) can work. Cold turkey extinction? That\'s rough and not necessary.\n\nYou don\'t have to choose between:\n- Rocking them to sleep forever OR\n- Abandoning them to cry\n\nThere\'s a middle ground. There\'s ALWAYS a middle ground.\n\nYou can be gentle AND help them learn. Those aren\'t opposites."\n\nCTA (35-50 sec): "What\'s been holding you back from sleep training? And don\'t say \'I don\'t believe in it\' - belief isn\'t the issue. Method is. What specifically scares you about it?"',
    caption: 'There\'s a middle ground between chaos and "cry it out." Let\'s talk about it. 🤍\n\nThe cry it out controversy is SO misunderstood. It\'s not about:\n❌ Ignoring your baby for hours\n\nIt\'s about:\n✅ Teaching independent sleep while staying responsive\n✅ Checking in, reassuring, but not picking up immediately\n✅ Working WITH their nervous system, not against it\n\nYou don\'t have to choose between:\n- Rocking to sleep forever OR\n- Cold turkey extinction\n\nYou can be gentle AND set boundaries. You can be responsive AND help them learn.\n\nThe real talk? Method matters WAY more than belief. Let\'s talk about YOUR fears.\n\nWhat scares you most about sleep independence? Reply and let\'s address it. No judgment. Just solutions. 🤍',
    reviewStatus: 'changes-requested',
    reviewDueDate: '2026-02-20'
  },
  {
    id: '5',
    day: 'Friday',
    title: 'Sleep Guidelines',
    type: 'Static',
    description: 'Age-specific sleep needs and schedules by month',
    status: 'In Progress',
    setting: 'Detailed reference design / infographic',
    postTime: '10:00 AM',
    onScreenText: 'Age group headers with clear visual separation | Sleep amounts in large numbers | Daily schedule breakdown with visual timeline | Color-coded by age group | Key takeaway highlighted at bottom',
    script: 'HOW MUCH SLEEP DOES YOUR BABY ACTUALLY NEED?\n\n0-3 MONTHS (Newborn Phase)\nTotal sleep needed: 16-17 hours\nNighttime: Fragmented (2-3 hour stretches)\nDaytime: 3-5 naps, irregular\nWhat\'s normal: Feeding every 2-3 hours around the clock\nYour job: Survive and respond. That\'s it.\n\n4-6 MONTHS (Early Infancy)\nTotal sleep needed: 15-16 hours\nNighttime: 5-6 hour stretches becoming possible\nDaytime: 3 naps, starting to consolidate\nWhat\'s normal: First real sleep patterns emerging\nYour job: Support longer stretches, introduce gentle routine\n\n7-12 MONTHS (Second Half of First Year)\nTotal sleep needed: 14-15 hours\nNighttime: 6-8 hour stretches, can do 10-12 with support\nDaytime: 2 naps consolidating to 2-3 hours total\nWhat\'s normal: Sleep regressions around 8-9 months\nYour job: Maintain consistent routine, expect setbacks\n\n1-2 YEARS (Toddler Phase)\nTotal sleep needed: 13-14 hours\nNighttime: 10-12 hours possible\nDaytime: 1-2 naps, transitioning to 1 nap around 18 months\nWhat\'s normal: Lots of opinions, boundary testing, resistance\nYour job: Keep boundaries firm but loving\n\n2-3 YEARS (Big Toddler)\nTotal sleep needed: 12-13 hours\nNighttime: 10-11 hours (can do 12 with early bedtime)\nDaytime: 1 nap (1-2 hours) or quiet time\nWhat\'s normal: Nap resistance, later bedtimes, more independence\nYour job: Protect the nap, keep bedtime early anyway\n\nTHE MOST IMPORTANT THING TO REMEMBER:\nThese are GUIDELINES, not rules. Your baby might need more or less. Watch YOUR BABY\'s mood, energy, behavior. That tells you more than any chart.\n\nSave this post. Share it with confused family members. Refer back when someone tells you \'that\'s too much sleep\' or \'they need less.\'\n\nOvertired babies sleep WORSE. Period.',
    caption: 'HOW MUCH SLEEP DOES YOUR BABY ACTUALLY NEED? 📌 SAVE THIS.\n\n0-3 MONTHS: 16-17 hours (fragmented, all night feedings)\n4-6 MONTHS: 15-16 hours (patterns emerging)\n7-12 MONTHS: 14-15 hours (consolidation happening)\n1-2 YEARS: 13-14 hours (real schedule developing)\n2-3 YEARS: 12-13 hours (nap + nighttime)\n\nTHE CATCH: These are guidelines, not gospel. Your baby might need more or less. Watch THEIR mood and energy - that tells you more than any chart.\n\nBiggest myth? "Your baby needs less sleep." Nope. Overtired babies sleep WORSE. More tired ≠ longer sleep.\n\nWhen someone tells you "that\'s too much sleep," show them this post. 🤍 Save it. Refer to it. Share with confused family members.',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-21'
  },
  {
    id: '6',
    day: 'Saturday',
    title: 'Sample Schedule Static',
    type: 'Static',
    description: 'Real example: What a realistic 6-month-old schedule looks like',
    status: 'Ready to Schedule',
    setting: 'Daily routine visual / infographic',
    postTime: '6:00 PM',
    onScreenText: 'Large visual timeline from 6am to 7pm | Color-coded sections: Wake time (green), Nap time (blue), Feed time (pink), Bedtime routine (purple) | Each block labeled with time and activity | Key times highlighted in bold | Wake windows marked clearly',
    script: 'WHAT A REALISTIC 6-MONTH-OLD SCHEDULE LOOKS LIKE\n\n6:00 AM - Wake up & first feed\nBaby wakes naturally (some parents wake them to establish a start time)\n\n6:30-7:00 AM - Wake window, playtime\nSome floor time, tummy time, interaction\n\n7:00-8:30 AM - NAP #1 (90 minutes)\nMost babies have best morning nap of the day\n\n8:30 AM - Wake & second feed\n\n9:00-10:30 AM - Wake window, activity\nOutside time? Errands? Playtime at home?\nKeep it light - morning is not the best time for huge stimulation\n\n10:30-12:00 PM - NAP #2 (90 minutes)\n\n12:00 PM - Wake & third feed\n\n12:30-2:00 PM - Wake window\nThis is often a good time for outings, walks, or active play\n\n2:00-3:30 PM - NAP #3 (90 minutes)\nThis nap often shifts/shortens as baby gets older\n\n3:30 PM - Wake & fourth feed\n\n4:00-5:30 PM - Wake window\nLow-key time. Save energy for bedtime.\n\n5:30-6:00 PM - Dinner / family time (or just watching)\n\n6:00-7:00 PM - BEDTIME ROUTINE\n6:00 - Bath time\n6:20 - Pajamas, feeding\n6:40 - Songs, cuddles\n6:50 - Lights down, into crib\n\n7:00 PM - BEDTIME\nSleep time: 7pm-6am (11 hours) + naps (4.5 hours) = 15.5 hours\n\nNIGHT NOTES:\n- Most 6-month-olds can do 1 night feed at this point\n- First stretch is usually longest (5-7 hours)\n- Early morning wakings? Usually means bedtime is too late, not too early\n- This sample assumes baby is healthy and feeding well\n\nIMPORTANT REMINDERS:\n- Every baby is different. This is a TEMPLATE, not a prescription.\n- Flexibility within structure is key. Some days will shift.\n- Wake windows matter more than clock times.\n- If something feels wrong, trust your gut.',
    caption: 'THIS IS WHAT A REALISTIC 6-MONTH-OLD SCHEDULE LOOKS LIKE ✨\n\n6:00 AM - Wake & feed\n7:00-8:30 AM - NAP #1 (90 min)\n10:30-12:00 PM - NAP #2 (90 min) \n2:00-3:30 PM - NAP #3 (90 min)\n6:00-7:00 PM - Bedtime routine\n7:00 PM - Lights out 💤\n\nTotal: 11 hours nighttime + 4.5 hours naps = 15.5 hours\n\nThe real talk? This is a TEMPLATE. Every baby is different. What matters:\n✅ Wake windows (not clock times)\n✅ Consistency in rhythm\n✅ Flexible structure (life happens)\n✅ Bedtime routine every night\n\nEarly morning wakings? Usually means bedtime is too LATE, not too early.\n\nNot every nap needs to be 90 min. Some days are shorter. Life is flexible - your schedule doesn\'t have to be rigid to be effective.\n\nSave this for reference. Share with your partner or family members. 🤍',
    reviewStatus: 'approved',
    reviewDueDate: '2026-02-20'
  },
  {
    id: '7',
    day: 'Sunday',
    title: 'Community Ask',
    type: 'Reel',
    description: 'Community connection - ask followers about their biggest sleep struggles',
    status: 'Ready to Film',
    duration: '45 seconds',
    setting: 'Home - casual setting',
    postTime: '7:30 PM',
    onScreenText: '[0-3 sec] "Real talk - what\'s ACTUALLY harder for you?" [3-15 sec] Show bedtime scene vs night wakings scene [15-30 sec] Show stressed parent vs behavior problem parent [30-45 sec] Show newborn exhaustion vs first year frustration | Bottom text: Which one is YOU?',
    script: 'Option 1 (First 15 sec): "Real talk - what\'s ACTUALLY harder for you?\n\nBedtime battles?\nOr night wakings?\n\nI get asked both, but the solution is SO different depending on which one\'s killing you."\n\nOption 2 (15-30 sec): "Between schedule stress...\n\nWhere you\'re watching the clock and worried they\'re not napping ENOUGH...\n\nAnd actual behavior problems where they\'re overtired and fighting everything...\n\nWhich one keeps you up at night?"\n\nOption 3 (30-45 sec): "First month with a newborn - just trying to survive?\n\nOr first year - you think it should be easier by now and you\'re frustrated it\'s not?\n\nBoth are valid. I just want to know where you\'re at so I can help."\n\nCTA: "Comment below. Not all sleep struggles are the same, and I\'m here for whatever yours is. 🤍"',
    caption: 'Real talk: What\'s YOUR biggest sleep challenge right now? 🤔\n\nOption A: Bedtime battles vs night wakings?\nThey\'re SO different problems with SO different solutions.\n\nOption B: Schedule anxiety vs actual behavior issues?\nWatching the clock is different than an overtired toddler.\n\nOption C: First month survival mode vs first year frustration?\nBoth are real. Both are hard.\n\nI want to know where YOU\'RE at so I can actually help instead of giving generic advice.\n\nDrop it below. Tell me which one keeps you up at night. And then let\'s solve it. 🤍',
    reviewStatus: 'changes-requested',
    reviewDueDate: '2026-02-22'
  },
];

class ContentStore {
  /**
   * Get all content items
   */
  static getAll(): ContentItem[] {
    if (typeof window === 'undefined') return DEFAULT_CONTENT;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
      return DEFAULT_CONTENT;
    }
    
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_CONTENT;
    }
  }

  /**
   * Get single content item by ID
   */
  static getById(id: string): ContentItem | null {
    const all = this.getAll();
    return all.find(item => item.id === id) || null;
  }

  /**
   * Update a content item (saves immediately)
   */
  static update(id: string, updates: Partial<ContentItem>): ContentItem | null {
    const all = this.getAll();
    const index = all.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updated = { ...all[index], ...updates };
    all[index] = updated;
    
    // SAVE TO LOCALSTORAGE IMMEDIATELY
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(all),
      oldValue: JSON.stringify(all)
    }));
    
    return updated;
  }

  /**
   * Create new content item
   */
  static create(item: Omit<ContentItem, 'id'>): ContentItem {
    const all = this.getAll();
    const newItem: ContentItem = {
      ...item,
      id: `content_${Date.now()}`
    };
    
    all.push(newItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(all)
    }));
    
    return newItem;
  }

  /**
   * Delete content item
   */
  static delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(item => item.id !== id);
    
    if (filtered.length === all.length) return false;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(filtered)
    }));
    
    return true;
  }

  /**
   * Clear all (for testing)
   */
  static reset(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
  }
}

export default ContentStore;
