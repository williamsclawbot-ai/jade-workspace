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
  feedbackDate?: string; // timestamp when feedback was given
  revisionDate?: string; // timestamp when revision was completed
  aiGenerated?: boolean;
  generatedAt?: string; // timestamp
  lastUpdated?: string; // timestamp
  createdAt?: string; // timestamp when content was created
  approvedAt?: string; // timestamp when approved
  filmedAt?: string; // timestamp when filmed
  scheduledAt?: string; // timestamp when scheduled
  postedAt?: string; // timestamp when posted
  waitingOn?: 'you' | 'felicia'; // who needs to take next action
}

const STORAGE_KEY = 'jade_content_items';
const VERSION_KEY = 'jade_content_version';
const CURRENT_VERSION = '2026-02-18-7pieces'; // Version bump forces reset

// Default content data with FULL SCRIPTS - 7 NEW PIECES FOR FEB 17-23
const DEFAULT_CONTENT: ContentItem[] = [
  {
    id: '1',
    day: 'Monday',
    title: 'The 4-Month Regression Isn\'t a Step Backwards',
    type: 'Reel',
    description: 'Understanding the 4-month regression as a developmental leap, not a failure',
    status: 'Due for Review',
    duration: '40-50 seconds',
    setting: 'Home - sitting in cozy spot (bed, couch, or window seat)',
    postTime: '6:00 PM AEST',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-17',
    createdAt: '2026-02-17T10:00:00Z',
    waitingOn: 'felicia',
    script: `HOOK (0-3 sec): Look directly at camera with warm, understanding expression\n"Your baby was sleeping fine, and now... chaos. If your baby\'s around 4 months and suddenly sleep is HARD, I want you to know something: This isn\'t a step backwards. This is actually a LEAP."\n\nSETTING (3-8 sec): Leaning in, conversational\n"Four months is when something huge happens in your baby\'s brain. Their circadian rhythm develops. Their sleep architecture changes. Their awareness of the world shifts.\n\nWhich means their sleep is going to look different now. It\'s not that YOU broke it. It\'s that THEY changed."\n\nSCRIPT/EXPLANATION (8-25 sec): Speaking with gentle authority\n"Before 4 months: Your baby\'s sleep is pretty straightforward. Their nervous system is immature, so they kind of just... crash when they\'re tired.\n\nAfter 4 months: Suddenly they\'re AWARE. Aware of their environment, aware that you\'re not there, aware that sleep is a transition.\n\nAnd this is when sleep gets harder for like 2-4 weeks. Maybe longer.\n\nNight wakings increase. Naps get chaotic. They fight sleep. You feel like you\'ve lost the plot.\n\nBut here\'s the thing: This IS progress, even though it doesn\'t feel like it."\n\nON-SCREEN TEXT: "The 4-Month Regression" | "Your baby\'s brain is developing fast" | "This is progress, not a step back" | "It\'s temporary - 2-4 weeks usually"\n\nCAPTION: "The 4-Month Sleep Regression: It\'s Not What You Think 💙\n\nSo your baby was sleeping pretty well, and suddenly... total chaos. Welcome to the 4-month regression.\n\nHere\'s what\'s actually happening: Your baby\'s circadian rhythm is developing. Their sleep architecture is maturing. They\'re becoming AWARE.\n\nWhich means sleep is harder right now. And that\'s actually a sign of development, not a sign you\'ve messed up.\n\nBefore 4 months: Sleep is simple (their nervous system is immature)\nAfter 4 months: Sleep is complex (they\'re aware now)\n\nThe regression usually lasts 2-4 weeks. Maybe a bit longer. And it FEELS like forever when you\'re in it.\n\nBut here\'s the truth: This is your window to help them learn to sleep THROUGH these new developmental stages.\n\nYou can\'t stop the regression. But you CAN help them through it with consistency, connection, and patience.\n\nIf your 4-month-old has suddenly become a terrible sleeper: You haven\'t failed. Your baby is just developing. And you\'re about to teach them something amazing. 🤍"\n\nDETAILS: Week of Feb 17, 4-month regression education, developmental milestone timing',
    onScreenText: '[0-3 sec] "This isn\'t a step backwards" | [3-8 sec] "It\'s actually a LEAP" | [8-25 sec] "Your baby\'s brain is developing" | [25-35 sec] "This is progress" | [35-50 sec] "You haven\'t failed - they\'re just growing"'
  },
  {
    id: '2',
    day: 'Tuesday',
    title: '5 Signs You\'re More Exhausted Than You\'re Admitting',
    type: 'Carousel',
    description: 'Identifying hidden signs of parental exhaustion that go beyond "tired"',
    status: 'Due for Review',
    duration: '7 slides',
    setting: 'Graphic design / carousel with personal scenarios',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-18',
    createdAt: '2026-02-17T10:30:00Z',
    waitingOn: 'felicia',
    script: `SLIDE 1 (HOOK): "5 Signs You\'re More Exhausted Than You\'re Admitting"\nBig, warm text\n"You keep saying you\'re fine, but your body is screaming."\n\nSLIDE 2 (SIGN 1): "You\'re Snapping at Your Partner Over Small Things"\nDescription: "You asked them to load the dishwasher. They loaded it wrong. Suddenly you\'re furious.\nIs it really about the dishwasher? No. It\'s that you\'re running on fumes and have no patience left."\nScript: "Exhausted parents lose emotional regulation. Small things become HUGE. Your partner isn\'t annoying - you\'re just beyond depleted."\n\nSLIDE 3 (SIGN 2): "You\'re Forgetting Basic Things"\nDescription: "You walked into a room and forgot why. You forgot to eat lunch. You put the milk in the cupboard instead of the fridge."\nScript: "Sleep deprivation kills cognitive function. If your brain feels fuzzy constantly, that\'s not normal tired - that\'s exhaustion talking. Your body needs REST, not just sleep."\n\nSLIDE 4 (SIGN 3): "Everything Feels Hopeless"\nDescription: "The baby is crying and you feel like this will NEVER get better. Sleep feels impossible. Parenting feels impossible."\nScript: "Catastrophic thinking is a sign of severe sleep deprivation. When you\'re this exhausted, your brain literally can\'t access hope. That\'s not depression - that\'s just YOUR NERVOUS SYSTEM in survival mode."\n\nSLIDE 5 (SIGN 4): "You\'re Moving on Autopilot"\nDescription: "You can\'t remember if you fed the baby or fed yourself. You\'re just... functioning. Not living, just surviving."\nScript: "When exhaustion is THIS deep, you stop being present. You stop enjoying anything. You\'re just checking boxes. That\'s a sign your body is in crisis mode."\n\nSLIDE 6 (SIGN 5): "You\'re Getting Sick Constantly"\nDescription: "You catch every cold. Your immune system is tanking. You feel foggy and run down."\nScript: "Sleep deprivation DESTROYS immune function. If you\'re constantly fighting illness, that\'s your body sending a signal: YOU NEED REST."\n\nSLIDE 7 (CTA): "If 3+ of these hit home, your body\'s asking for help. This isn\'t weakness. It\'s a signal."\nText: "Sleep support isn\'t indulgent. It\'s necessary. DM me if you\'re in the thick of it. You don\'t have to white-knuckle through this alone. 💙`,
    caption: 'Are You More Exhausted Than You\'re Admitting? 🤍\n\nYou keep saying "I\'m fine" but your body is screaming something different.\n\nHere are 5 signs your exhaustion is deeper than you realize:\n\n1️⃣ You\'re snapping at your partner over tiny things\nIsn\'t about them. It\'s about having zero emotional bandwidth left.\n\n2️⃣ You\'re forgetting basic things\nWalking into rooms, forgetting meals, brain fog = sleep deprivation destroying cognitive function.\n\n3️⃣ Everything feels hopeless\nCatastrophic thinking is your nervous system in crisis mode, not reality.\n\n4️⃣ You\'re on autopilot\nJust functioning, not living. Just checking boxes. Exhaustion this deep feels like survival mode.\n\n5️⃣ You\'re getting sick constantly\nSleep deprivation destroys immunity. Your body\'s sending a signal: HELP.\n\nIf 3+ of these hit home, this isn\'t weakness talking. It\'s your body asking for support.\n\nSleep help isn\'t indulgent. It\'s necessary. It\'s medicine. 💙\n\nWhat\'s one sign you\'re seeing? Drop it - you\'re not alone in this.',
    onScreenText: 'Slide 1: Bold hook | Slides 2-6: Sign title + brief description with icon | Slide 7: CTA with warmth'
  },
  {
    id: '3',
    day: 'Wednesday',
    title: 'The \'Gentle Fade\' Method Explained in 60 Seconds',
    type: 'Reel',
    description: 'Quick explainer on the Gentle Fade method for sleep independence',
    status: 'Due for Review',
    duration: '55-60 seconds',
    setting: 'Home - nursery/bedroom',
    postTime: '2:00 PM AEST',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-19',
    createdAt: '2026-02-18T09:00:00Z',
    waitingOn: 'felicia',
    script: `HOOK (0-3 sec): Direct, clear\n"The Gentle Fade isn\'t popular, but it WORKS. Here\'s how in 60 seconds."\n\nSETTING (3-8 sec): Clear explanation\n"The Gentle Fade means you stay with your baby while they learn to sleep independently. But you gradually reduce your role.\n\nNot leaving them. Just... stepping back slowly."\n\nSCRIPT - THE METHOD (8-35 sec): Speaking step-by-step\n"Week 1: Sit on the bed, hand on their body\nWeek 2: Sit on the bed, hand nearby (not touching)\nWeek 3: Sit on a chair next to the cot\nWeek 4: Chair further away\nWeek 5: Leave when they\'re drowsy\n\nIt\'s slow. It takes time. But your baby ALWAYS knows you\'re there.\n\nWhich means their nervous system stays calm. They\'re learning to sleep independently. But they\'re learning it with YOUR presence and safety.\n\nIt\'s not abandonment. It\'s not co-dependence. It\'s GENTLE."\n\nON-SCREEN TEXT: "The Gentle Fade Method" | "Stay close, but step back slowly" | "Week 1-2: Hands on" | "Week 3-4: Sit nearby" | "Week 5: Step away" | "Nervous system stays calm" | "They learn independence WITH your presence"\n\nCAPTION: "The Gentle Fade Method for Sleep Independence 💙\n\nSo you\'ve heard of cry-it-out and co-sleeping. But there\'s a middle ground that works beautifully: The Gentle Fade.\n\nHere\'s how it works:\n\n📍 Week 1: Lie on the bed, hand on their body\n📍 Week 2: Lie on the bed, hand nearby (no contact)\n📍 Week 3: Sit on a chair right next to the cot\n📍 Week 4: Chair moves further away\n📍 Week 5: Leave when they\'re drowsy\n📍 Week 6+: They sleep independently\n\nWhy it works: Your baby\'s nervous system stays CALM because you\'re always there. They\'re learning to sleep independently, but they\'re doing it with your presence and reassurance.\n\nNot abandonment. Not co-dependence. Just... GENTLE.\n\nIt takes longer than cry-it-out (usually 4-8 weeks). But you\'re teaching them that:\n- You\'re reliable\n- Sleep is safe\n- They can do hard things\n- You\'re still there\n\nIf you want independence without crying, this is your method. 🤍"\n\nDETAILS: Explains each week of Gentle Fade method with rationale',
    onScreenText: '[0-3 sec] "The Gentle Fade Method" | [3-8 sec] "Stay with them, step back slowly" | [8-35 sec] Weekly progression | [35-55 sec] Why it works | [55-60 sec] "Their nervous system stays calm"'
  },
  {
    id: '4',
    day: 'Thursday',
    title: 'The Sleep Regression Survival Kit',
    type: 'Static',
    description: 'Practical toolkit and strategies for surviving sleep regressions',
    status: 'Due for Review',
    setting: 'Graphic design / checklist format',
    postTime: '7:00 PM AEST',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-20',
    createdAt: '2026-02-18T14:00:00Z',
    waitingOn: 'felicia',
    script: `THE SLEEP REGRESSION SURVIVAL KIT 🧰\n\nYour baby was sleeping. Now they\'re not. Welcome to a regression.\n\nHere\'s what to do when everything falls apart:\n\n---\n\nTHE MINDSET SHIFT\n✅ This is temporary (2-4 weeks usually)\n✅ Your baby hasn\'t forgotten how to sleep\n✅ Their brain is developing (this is GOOD)\n✅ You haven\'t failed\n✅ Consistency matters more than method right now\n\n❌ Stop trying new things\n❌ Stop second-guessing\n❌ Stop comparing to other babies\n❌ Stop assuming it\'ll never end\n\n---\n\nTHE PRACTICAL KIT\n\n1. PROTECT BEDTIME (Most Important)\nEarlier is often better during regressions\nConsistency is MORE important now\nDon\'t fight it - lean into routine\n\n2. LOWER EXPECTATIONS\nNaps might go chaotic (that\'s okay)\nNight wakings might increase (normal)\nThey might sleep LESS overall (temporary)\nDon\'t use this as justification to abandon routine\n\n3. INCREASE CONNECTION\nMore daytime cuddles\nMore responsive nights\nMore presence during the day\nThis is temporary - give them what they need\n\n4. PROTECT YOUR SANITY\nTake turns with your partner\nAsk for help (seriously)\nLower household expectations\nSleep when baby sleeps (yes, really)\nYou can\'t pour from empty cup\n\n5. KNOW THE REGRESSIONS\n4 months: Circadian rhythm develops\n8-10 months: Separation anxiety, crawling\n12-14 months: Language explosion, mobility\n18-24 months: Independence, molars\n2.5-3 years: Imagination, nightmares\n\n---\n\nWHEN TO GET HELP\n🚩 Regression lasts more than 6 weeks\n🚩 You\'re at breaking point\n🚩 Partner relationship suffering\n🚩 You\'re not coping emotionally\n🚩 Baby seems in pain/uncomfortable\n\nGetting help isn\'t failure. It\'s survival.\n\n---\n\nTHE TRUTH\nRegressions suck. They\'re temporary. They pass.\n\nAnd on the other side? Your baby will sleep even better than before because their brain literally developed.\n\nYou\'ve got this. 🤍`,
    caption: 'The Sleep Regression Survival Kit 🧰\n\nYour baby slept fine last week. This week? Chaos.\n\nWelcome to a sleep regression. Here\'s your survival guide:\n\n🧠 MINDSET SHIFTS\n✅ This is temporary (2-4 weeks)\n✅ Their brain is literally developing\n✅ You haven\'t failed\n✅ Consistency matters MORE right now\n\n🛠️ YOUR SURVIVAL KIT\n\n1️⃣ PROTECT BEDTIME\nConsistency > everything else right now\nEarlier bedtime often helps\nDon\'t abandon routine\n\n2️⃣ LOWER EXPECTATIONS\nNaps go chaotic (temporary)\nWakings increase (normal)\nThey might sleep LESS (it passes)\n\n3️⃣ INCREASE CONNECTION\nMore daytime cuddles\nMore responsive nights\nYour presence is medicine right now\n\n4️⃣ PROTECT YOUR SANITY\nTake turns with partner\nLower house expectations\nSleep when baby sleeps\nAsk for help (seriously)\n\n5️⃣ KNOW THE TIMELINE\n4m: Circadian rhythm | 8m: Separation | 12m: Language\n18m: Independence | 2.5y: Nightmares\n\n🚩 WHEN TO GET HELP\nRegression >6 weeks | You\'re breaking | Relationship suffering | Baby seems in pain\n\nGetting support isn\'t weakness. It\'s survival. 💙',
    onScreenText: 'Title with bold callouts | Section headings with icons | Checkboxes for actionable items | Timeline visual for regressions | Warmth and hope throughout'
  },
  {
    id: '5',
    day: 'Friday',
    title: 'Co-Sleeping and Independent Settling Can Coexist',
    type: 'Carousel',
    description: 'How families can blend co-sleeping with independent sleep skills',
    status: 'Due for Review',
    duration: '8 slides',
    setting: 'Graphic design / lifestyle carousel',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-21',
    createdAt: '2026-02-19T10:00:00Z',
    waitingOn: 'felicia',
    script: `SLIDE 1 (HOOK): "Can You Co-Sleep AND Have Independent Sleep?"\nText: "Everyone says you have to choose. They\'re wrong."\n\nSLIDE 2 (THE MYTH): "You\'ll Create a \'Bad Habit\'"\nMyth: Co-sleeping will ruin their independence\nReality: Sleep location ≠ sleep skill\nScript: "A child can co-sleep when you want connection AND fall asleep independently when you need space. These aren\'t opposites. They\'re both possible."\n\nSLIDE 3 (THE BLEND): "What Co-Sleeping + Independent Sleep Looks Like"\nExample: "- Some nights in your bed (when YOU need closeness or baby is sick)\n- Some nights in their own space (when you need rest/space)\n- Can settle independently in both locations\n- Knows sleep happens in multiple places\nScript: "Flexibility is a skill. Your baby can learn it."\n\nSLIDE 4 (THE HOW): "Teaching Sleep Skills While Co-Sleeping"\n- Still: Have a consistent bedtime\n- Still: Teach them to fall asleep (not just nurse/rock)\n- Still: Set boundaries about mid-night waking patterns\n- Still: Teach independent settling (even if together)\nScript: "Co-sleeping doesn\'t mean doing nothing. You\'re still teaching, still setting boundaries, just doing it WITH your body present."\n\nSLIDE 5 (THE TRANSITIONS): "Moving Between Spaces Smoothly"\nStart: Baby sleeps with you while learning to settle independently\nMiddle: Some nights together, some nights separate\nEnd: They can sleep independently in multiple locations\nScript: "This doesn\'t happen overnight. 2-3 months minimum. But it works beautifully."\n\nSLIDE 6 (THE TRUTH): "Why This Matters"\n✅ You get connection when you need it\n✅ They learn independence\n✅ Both nervous systems get rest\n✅ Flexibility for real life (travel, illness)\n✅ No guilt, no judgment\nScript: "You don\'t have to choose between your need and theirs. You can have both."\n\nSLIDE 7 (THE HONESTY): "What Co-Sleeping Needs to Look Like (Safely)"\n- Firm mattress, no pillows\n- Age-appropriate sleep safety\n- Both parents on board\n- Clear boundaries about nighttime parenting\n- Exit plan when ready (not never)\nScript: "Safe co-sleeping IS possible. And safe co-sleeping with independence IS possible. One doesn\'t cancel out the other."\n\nSLIDE 8 (CTA): "Both/And, Not Either/Or 💙"\nText: "Your baby can be snuggled AND independent. You can be present AND rested. Stop choosing. Do both."\nScript: "DM if you\'re trying to blend these worlds. You\'re not alone."',
    caption: 'Co-Sleeping + Independent Sleep = Both Possible 💙\n\nEveryone tells you:\n"Co-sleep, and they\'ll never sleep alone"\n"Let them be independent, no co-sleeping"\n\nThey\'re both wrong.\n\n🤍 THE TRUTH\n\nYour baby CAN:\n✅ Co-sleep with you some nights\n✅ Sleep independently in their own space other nights\n✅ Fall asleep without your help in both locations\n✅ Learn that sleep happens everywhere\n\nYou\'re not ruining them with flexibility. You\'re teaching them ADAPTABILITY.\n\n🛏️ WHAT THIS ACTUALLY LOOKS LIKE\n\nSome nights: In your bed, learning to settle independently\nSome nights: In their own space, falling asleep alone\nAlways: Consistent bedtime + routine\nAlways: Teaching them the skill, not just the location\n\nThey can snuggle AND be independent.\nYou can be present AND rested.\n\nStop choosing. You can have both. 🤍\n\n🌙 THE HOW\n\n1️⃣ Co-sleep while teaching settling skills (don\'t just rock them to sleep)\n2️⃣ Keep consistent routine regardless of location\n3️⃣ Set boundaries about nighttime needs (they don\'t need you every time they stir)\n4️⃣ Gradually introduce independent sleep nights\n5️⃣ Let them learn both spaces are safe\n\n⏰ TIMELINE\n2-3 months minimum for smooth transition\nEvery baby\'s different\nFlexibility is a skill they can learn\n\nThe both/and approach? It works beautifully. 💙',
    onScreenText: 'Slide 1: Bold hook | Slides 2-7: Topic + explanation | Slide 8: Warm CTA with both/and philosophy'
  },
  {
    id: '6',
    day: 'Saturday',
    title: 'Stop Blaming Yourself for Your Baby\'s Wake-ups',
    type: 'Reel',
    description: 'Permission to stop self-blame for normal baby sleep patterns',
    status: 'Due for Review',
    duration: '45-50 seconds',
    setting: 'Home - intimate, relatable setting',
    postTime: '10:00 AM AEST',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-22',
    createdAt: '2026-02-20T08:00:00Z',
    waitingOn: 'felicia',
    script: `HOOK (0-3 sec): Looking at camera with understanding, slightly vulnerable\n"Your baby woke up three times last night. And your first thought was: \'What did I do wrong?\'"\n\nSETTING (3-10 sec): Sitting down, relaxing body language\n"Here\'s what I need you to hear: Most baby wake-ups aren\'t your fault.\n\nI know you think they are. I know you\'re blaming yourself. I know you\'re convinced you\'re doing something wrong.\n\nBut statistically? You\'re probably not."\n\nSCRIPT (10-30 sec): Speaking clearly with authority\n"Newborns wake up because they\'re hungry (not your fault - they need feeding)\nFour-month-olds wake because their brain is developing (not your fault - it\'s a regression)\nTeething babies wake because their gums hurt (not your fault - it\'s teething)\nSeparation anxiety = waking (not your fault - it\'s developmental)\n\nYes, SOME sleep issues are fixable with better routine or boundaries.\nBUT most middle-of-the-night waking is COMPLETELY NORMAL and has nothing to do with your parenting."\n\nON-SCREEN TEXT: "Your baby woke up 3 times" | "Your first thought: Did I do something wrong?" | "Stop blaming yourself" | "Most wake-ups are normal development" | "Not your fault"\n\nCAPTION: "Stop Blaming Yourself for Your Baby\'s Wake-ups 💙\n\nYour baby woke up multiple times last night.\n\nAnd your brain immediately went: \'What did I do wrong?\'\n\nHere\'s what I need you to know: Most of it isn\'t your fault.\n\n😴 NORMAL WAKE-UPS (NOT YOUR FAULT)\n\n✅ Newborn hunger wake-ups\n✅ 4-month regression wake-ups (developmental)\n✅ Teething wake-ups (physical discomfort)\n✅ Separation anxiety wake-ups (developmental milestone)\n✅ Growth spurt wake-ups (body needs fuel)\n✅ Developmental leaps (brain learning fast)\n\nThese aren\'t signs you\'ve failed. They\'re signs your baby is ALIVE and DEVELOPING.\n\n⚠️ SOMETIMES FIXABLE\n\nOvercrowded nap schedule → adjust\nNo bedtime routine → add one\nToo-late bedtime → move it earlier\nOverstimulation → lower activity\n\nSo yes, some wake-ups CAN be helped with better structure.\n\nBUT the majority? That\'s just babies. That\'s development. That\'s normal.\n\n💙 PERMISSION SLIP\n\nYou\'re not failing.\nYour baby waking doesn\'t mean you did something wrong.\nYou\'re not doing it bad.\nYou\'re just parenting a tiny human who wakes up.\n\nThat\'s allowed. That\'s normal. That\'s okay.\n\nStop blaming yourself for biology. 🤍",
    details: 'Permission-giving reel about normal baby sleep patterns and reducing parental blame'
  },
  {
    id: '7',
    day: 'Sunday',
    title: 'This Week I Want You to Know...',
    type: 'Static',
    description: 'Weekly message of encouragement and perspective for exhausted parents',
    status: 'Due for Review',
    setting: 'Warm, intimate design with Jade speaking directly',
    postTime: '6:00 PM AEST',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-23',
    createdAt: '2026-02-21T12:00:00Z',
    waitingOn: 'felicia',
    script: `THIS WEEK I WANT YOU TO KNOW... 💙\n\n---\n\nYour exhaustion is real.\n\nI\'m not going to tell you \'it gets better\' or \'hang in there\' like those aren\'t true. They are.\n\nBut right now, in this moment, your exhaustion is REAL. And I want to validate that.\n\nYou\'re not weak. You\'re not failing. You\'re just tired. And tired is valid.\n\n---\n\nYour way is enough.\n\nYou\'re probably comparing yourself to someone else. Someone whose baby sleeps better. Someone who seems less stressed. Someone who has it figured out.\n\nHere\'s the thing: They don\'t. They\'re just showing you the highlight reel.\n\nYour way of parenting — your rhythms, your boundaries, your methods — is ENOUGH. Different isn\'t better. It\'s just different.\n\n---\n\nIt\'s okay to ask for help.\n\nNot because you\'ve failed. Not because you\'re weak.\n\nBut because:\n- Sleep support is medicine, not indulgence\n- You deserve to feel like yourself\n- Your kid deserves a present parent\n- Both of those require REST\n\nAsking for help isn\'t admitting defeat. It\'s admitting you\'re human.\n\n---\n\nThis season is temporary.\n\nThe newborn haze? Ends.\nThe regression? Passes (usually 2-4 weeks).\nThe relentless wake-ups? They get less relentless.\nThe exhaustion? You eventually get your nervous system back.\n\nI\'m not saying ignore the hard. I\'m saying: it shifts. Not today, maybe not this month. But it shifts.\n\n---\n\nYou\'re doing better than you think.\n\nI know you feel like you\'re failing. You probably feel like everyone else has it figured out and you\'re the only one struggling.\n\nYou\'re not.\n\nYou\'re showing up. You\'re trying. You\'re asking questions (or you wouldn\'t be here).\n\nThat IS good parenting. Even on the days when it doesn\'t feel like it.\n\n---\n\nGo easy on yourself this week.\n\nMaybe that looks like:\n- Lowering one expectation\n- Asking your partner for something specific\n- Letting the dishes wait\n- Taking 10 minutes for yourself\n- Being kinder to yourself than you\'d be to a friend\n\nYou\'re doing the hardest job there is.\n\nThe least you can do is be gentle with yourself about it.\n\n💙 You\'ve got this. And I\'m here if you need me.',
    caption: 'This Week I Want You to Know... 💙\n\n📌 Your exhaustion is real\nNot weakness. Real. Valid. Acknowledged.\n\n📌 Your way is enough\nStop comparing. Your method isn\'t wrong - it\'s just yours.\n\n📌 It\'s okay to ask for help\nHelp = medicine, not failure. You deserve rest. Your kid deserves a present parent.\n\n📌 This season is temporary\nRegressions pass. Exhaustion shifts. It\'s not today - but it\'s coming.\n\n📌 You\'re doing better than you think\nYou\'re here. You\'re asking. You\'re trying. That\'s good parenting.\n\n📌 Go easy on yourself\nYou\'re doing the hardest job there is. Show yourself the same grace you show your kid.\n\nYou\'ve got this. 🤍'
  }
];


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
    script: `HOW MUCH SLEEP DOES YOUR BABY ACTUALLY NEED?\n\n0-3 MONTHS (Newborn Phase)\nTotal sleep needed: 16-17 hours\nNighttime: Fragmented (2-3 hour stretches)\nDaytime: 3-5 naps, irregular\nWhat\'s normal: Feeding every 2-3 hours around the clock\nYour job: Survive and respond. That\'s it.\n\n4-6 MONTHS (Early Infancy)\nTotal sleep needed: 15-16 hours\nNighttime: 5-6 hour stretches becoming possible\nDaytime: 3 naps, starting to consolidate\nWhat\'s normal: First real sleep patterns emerging\nYour job: Support longer stretches, introduce gentle routine\n\n7-12 MONTHS (Second Half of First Year)\nTotal sleep needed: 14-15 hours\nNighttime: 6-8 hour stretches, can do 10-12 with support\nDaytime: 2 naps consolidating to 2-3 hours total\nWhat\'s normal: Sleep regressions around 8-9 months\nYour job: Maintain consistent routine, expect setbacks\n\n1-2 YEARS (Toddler Phase)\nTotal sleep needed: 13-14 hours\nNighttime: 10-12 hours possible\nDaytime: 1-2 naps, transitioning to 1 nap around 18 months\nWhat\'s normal: Lots of opinions, boundary testing, resistance\nYour job: Keep boundaries firm but loving\n\n2-3 YEARS (Big Toddler)\nTotal sleep needed: 12-13 hours\nNighttime: 10-11 hours (can do 12 with early bedtime)\nDaytime: 1 nap (1-2 hours) or quiet time\nWhat\'s normal: Nap resistance, later bedtimes, more independence\nYour job: Protect the nap, keep bedtime early anyway\n\nTHE MOST IMPORTANT THING TO REMEMBER:\nThese are GUIDELINES, not rules. Your baby might need more or less. Watch YOUR BABY\'s mood, energy, behavior. That tells you more than any chart.\n\nSave this post. Share it with confused family members. Refer back when someone tells you \'that\'s too much sleep\' or \'they need less.\'\n\nOvertired babies sleep WORSE. Period.',
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
    script: `WHAT A REALISTIC 6-MONTH-OLD SCHEDULE LOOKS LIKE\n\n6:00 AM - Wake up & first feed\nBaby wakes naturally (some parents wake them to establish a start time)\n\n6:30-7:00 AM - Wake window, playtime\nSome floor time, tummy time, interaction\n\n7:00-8:30 AM - NAP #1 (90 minutes)\nMost babies have best morning nap of the day\n\n8:30 AM - Wake & second feed\n\n9:00-10:30 AM - Wake window, activity\nOutside time? Errands? Playtime at home?\nKeep it light - morning is not the best time for huge stimulation\n\n10:30-12:00 PM - NAP #2 (90 minutes)\n\n12:00 PM - Wake & third feed\n\n12:30-2:00 PM - Wake window\nThis is often a good time for outings, walks, or active play\n\n2:00-3:30 PM - NAP #3 (90 minutes)\nThis nap often shifts/shortens as baby gets older\n\n3:30 PM - Wake & fourth feed\n\n4:00-5:30 PM - Wake window\nLow-key time. Save energy for bedtime.\n\n5:30-6:00 PM - Dinner / family time (or just watching)\n\n6:00-7:00 PM - BEDTIME ROUTINE\n6:00 - Bath time\n6:20 - Pajamas, feeding\n6:40 - Songs, cuddles\n6:50 - Lights down, into crib\n\n7:00 PM - BEDTIME\nSleep time: 7pm-6am (11 hours) + naps (4.5 hours) = 15.5 hours\n\nNIGHT NOTES:\n- Most 6-month-olds can do 1 night feed at this point\n- First stretch is usually longest (5-7 hours)\n- Early morning wakings? Usually means bedtime is too late, not too early\n- This sample assumes baby is healthy and feeding well\n\nIMPORTANT REMINDERS:\n- Every baby is different. This is a TEMPLATE, not a prescription.\n- Flexibility within structure is key. Some days will shift.\n- Wake windows matter more than clock times.\n- If something feels wrong, trust your gut.',
    caption: 'THIS IS WHAT A REALISTIC 6-MONTH-OLD SCHEDULE LOOKS LIKE ✨\n\n6:00 AM - Wake & feed\n7:00-8:30 AM - NAP #1 (90 min)\n10:30-12:00 PM - NAP #2 (90 min) \n2:00-3:30 PM - NAP #3 (90 min)\n6:00-7:00 PM - Bedtime routine\n7:00 PM - Lights out 💤\n\nTotal: 11 hours nighttime + 4.5 hours naps = 15.5 hours\n\nThe real talk? This is a TEMPLATE. Every baby is different. What matters:\n✅ Wake windows (not clock times)\n✅ Consistency in rhythm\n✅ Flexible structure (life happens)\n✅ Bedtime routine every night\n\nEarly morning wakings? Usually means bedtime is too LATE, not too early.\n\nNot every nap needs to be 90 min. Some days are shorter. Life is flexible - your schedule doesn\'t have to be rigid to be effective.\n\nSave this for reference. Share with your partner or family members. 🤍`,
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
    script: `Option 1 (First 15 sec): "Real talk - what\'s ACTUALLY harder for you?\n\nBedtime battles?\nOr night wakings?\n\nI get asked both, but the solution is SO different depending on which one\'s killing you."\n\nOption 2 (15-30 sec): "Between schedule stress...\n\nWhere you\'re watching the clock and worried they\'re not napping ENOUGH...\n\nAnd actual behavior problems where they\'re overtired and fighting everything...\n\nWhich one keeps you up at night?"\n\nOption 3 (30-45 sec): "First month with a newborn - just trying to survive?\n\nOr first year - you think it should be easier by now and you\'re frustrated it\'s not?\n\nBoth are valid. I just want to know where you\'re at so I can help."\n\nCTA: "Comment below. Not all sleep struggles are the same, and I\'m here for whatever yours is. 🤍"',
    caption: 'Real talk: What\'s YOUR biggest sleep challenge right now? 🤔\n\nOption A: Bedtime battles vs night wakings?\nThey\'re SO different problems with SO different solutions.\n\nOption B: Schedule anxiety vs actual behavior issues?\nWatching the clock is different than an overtired toddler.\n\nOption C: First month survival mode vs first year frustration?\nBoth are real. Both are hard.\n\nI want to know where YOU\'RE at so I can actually help instead of giving generic advice.\n\nDrop it below. Tell me which one keeps you up at night. And then let\'s solve it. 🤍`,
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
    
    // Check version and reset if needed
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      // Version mismatch - force reset to new content
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return DEFAULT_CONTENT;
    }
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return DEFAULT_CONTENT;
    }
    
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
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
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  }
}

export default ContentStore;
