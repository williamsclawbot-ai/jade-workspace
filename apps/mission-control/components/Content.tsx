'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Lightbulb, Calendar, BarChart3, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import ContentItem6Column from './ContentItem6Column';

interface ContentPost {
  id: number;
  title: string;
  platform: string;
  description: string;
  status: 'Draft' | 'Scheduled' | 'Published';
  created: string;
}

interface ContentTemplate {
  id: number;
  name: string;
  content: string;
  created: string;
}

interface ContentIdea {
  id: number;
  topic: string;
  description: string;
  useCase: string;
  created: string;
}

interface WeeklyPlan {
  week: string;
  status: 'incomplete' | 'complete';
  daysPlanned: number;
  daysTotal: number;
}

type TabType = 'content-flow' | 'ideas' | 'templates' | 'daily' | 'this-week' | 'stats';

interface WeeklyContentItem {
  day: string;
  title: string;
  type: 'Reel' | 'Carousel' | 'Static' | 'Newsletter' | 'Email';
  description: string;
  status: 'Ready to film' | 'Ready to schedule' | 'In progress' | 'Scheduled' | 'Due for Review';
  script?: string;
  caption?: string;
  duration?: string;
  setting?: string;
  onScreenText?: string;
  postTime?: string;
  reviewStatus?: 'needs-review' | 'approved' | 'changes-requested' | 'pending';
  reviewDueDate?: string;
}

// Merged Ideas organized by THEME instead of platform
const CURATED_IDEAS_BY_THEME = {
  'Sleep Science & Myths': [
    { topic: 'Sleep Myths Debunked', description: 'Debunk common sleep myths with science-backed information', useCase: 'Instagram Reels, Blog post, TikTok' },
    { topic: 'Sleep Architecture', description: 'Explain REM vs NREM sleep cycles for babies and toddlers', useCase: 'Blog, Newsletter, Video content' },
    { topic: 'Circadian Rhythm Basics', description: 'How natural light affects baby sleep patterns', useCase: 'Educational carousel, Instagram post' },
  ],
  'Parent Wins & Stories': [
    { topic: 'Success Stories', description: 'Real parent transformations from sleep struggles to success', useCase: 'Before/after reels, testimonial videos' },
    { topic: 'Parent Wins Celebration', description: 'Celebrate small parenting wins to build community', useCase: 'Instagram stories, TikTok duets' },
    { topic: 'Day in the Life', description: 'Show your work, consulting process, and daily routine', useCase: 'TikTok, Behind-the-scenes Reels' },
  ],
  'Quick Tips & Hacks': [
    { topic: 'Wind-Down Routine Tips', description: 'Quick 30-second tips for bedtime routines', useCase: 'Instagram carousel, TikTok, Pinterest' },
    { topic: 'Sleep Hacks', description: '3-5 minute practical strategies parents can use today', useCase: 'Short-form video, Instagram captions' },
    { topic: 'Seasonal Sleep Adjustments', description: 'How to handle DST, heat waves, holidays', useCase: 'Blog guide, Newsletter, Seasonal reels' },
  ],
  'Relatable & Funny': [
    { topic: 'Sleep Deprivation Realness', description: 'Funny, relatable moments of exhausted parenting', useCase: 'TikTok trends, Instagram reels, Funny shorts' },
    { topic: 'Parenting Fails & Humor', description: 'Lighthearted moments that make parents laugh', useCase: 'Short-form video, Trending sounds' },
    { topic: 'Trending Sounds Usage', description: 'Apply trending audio to parenting/sleep content', useCase: 'TikTok, Instagram Reels' },
  ],
  'Expert Content': [
    { topic: 'Age-Specific Strategies', description: 'Different approaches for newborns, 6-month, 2-year sleep', useCase: 'Blog guide, Comprehensive carousel, Newsletter' },
    { topic: 'Sleep Training Methods', description: 'Gentle vs gradual approaches comparison', useCase: 'Long-form blog post, Video guide' },
    { topic: 'Parent Mental Health', description: 'Sleep deprivation impact and self-care strategies', useCase: 'Blog post, Newsletter, Supportive video' },
  ],
  'Resources & Community': [
    { topic: 'Resource Roundups', description: 'Curated sleep tools, books, products you recommend', useCase: 'Newsletter, Blog roundup, Instagram carousel' },
    { topic: 'FAQ Responses', description: 'Answer common questions from your audience', useCase: 'Blog post, TikTok Q&A, Email newsletter' },
    { topic: 'Email Newsletter Hooks', description: 'Curiosity-driven subject lines and opens', useCase: 'Email subject line, Newsletter, Blog intro' },
  ],
};

const THIS_WEEK_CONTENT: WeeklyContentItem[] = [
  {
    day: 'Monday',
    title: 'Toddler Pillow',
    type: 'Reel',
    description: 'Quick tip on choosing the right pillow for toddlers',
    status: 'Ready to film',
    duration: '45 seconds',
    setting: 'Home - nursery room',
    script: 'Hook: "Does your toddler refuse to use a pillow?"\n\nContent: "Here\'s the thing - toddlers under 2 shouldn\'t have pillows at all. It\'s a safety thing. But I know what you\'re thinking - my kid\'s thrashing around and looks super uncomfortable.\n\nHere\'s the safe sleep setup:\n- Under 2 years: NO pillows, NO blankets, just a fitted sheet\n- 2-3 years: You can introduce a pillow NOW, but keep it FLAT and FIRM\n- Over 3: Regular pillow, but keep it simple\n\nWhat helps comfort instead? A lovey or stuffed animal they can snuggle. That gives them something without the risk.\n\nThe hardest part? Letting go of that picture-perfect nursery look. But safe sleep beats cute every time."\n\nCTA: "What\'s your toddler sleep hack? Drop it below - I read every comment!"',
    onScreenText: '[0-2 sec] "Does your toddler refuse to use a pillow?"\n[3-8 sec] Show the pillow with X over it, transition to safe setup\n[8-20 sec] Show comparison: Under 2 vs 2-3 vs Over 3\n[20-40 sec] Show lovey/stuffed animal alternative\n[40-45 sec] "Safe sleep beats cute every time" with CTA text',
    caption: 'The pillow question! 🛏️ Here\'s what you need to know about toddler sleep safety and what actually works. Under 2? NO pillows. 2-3? FLAT and FIRM. Over 3? Regular pillow is fine. Stop stressing about the Pinterest-perfect nursery - your baby just needs to be safe and comfy! 🤍',
    postTime: '7:30 PM',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-18'
  },
  {
    day: 'Tuesday',
    title: 'Educational Carousel',
    type: 'Carousel',
    description: 'Sleep myths debunked - 5 common misconceptions',
    status: 'Ready to schedule',
    duration: '5 slides',
    setting: 'Graphic design / infographic',
    script: 'Slide 1 (Hook): "5 Sleep Myths That Are Keeping You Stuck"\n\nSlide 2 (Myth 1): "MORE TIRED = BETTER SLEEP"\nFact: An overtired baby actually sleeps WORSE. They get wired, cranky, and fight sleep harder.\nTruth: Watch for tired cues and bedtime earlier, not later.\n\nSlide 3 (Myth 2): "SKIP NAPS SO THEY SLEEP AT NIGHT"\nFact: Naps help regulate cortisol (stress hormone). Skip naps = more stress = worse nighttime sleep.\nTruth: Naps are NOT negotiable. They\'re foundational.\n\nSlide 4 (Myth 3): "FEED MORE AT NIGHT = LONGER SLEEP"\nFact: A full bottle doesn\'t mean a full night. Sleep drive is about circadian rhythm, not calories.\nTruth: Daytime calories matter MORE than nighttime feeds.\n\nSlide 5 (Myth 4): "LATER BEDTIME = SLEEPING IN"\nFact: Kids\' bodies have natural wake times. Push bedtime later = just a grumpy kid waking at 5am.\nTruth: Earlier bedtime often = earlier rise time naturally.\n\nSlide 6 (Myth 5): "SOME BABIES JUST DON\'T SLEEP"\nFact: All babies have sleep potential. If they\'re not sleeping, something\'s off (schedule, environment, routine).\nTruth: Sleep is a skill that can be learned and improved.\n\nSlide 7 (CTA): "Which myth have you been believing? DM me your biggest sleep question and let\'s figure it out together."',
    onScreenText: 'Slide 1: Bold title over sleep imagery\nSlide 2-6: Myth on left, fact on right, icon for each\nSlide 7: CTA with direct message prompt',
    caption: 'Myth vs Reality: Let\'s talk about what actually helps baby sleep! These 5 myths keep parents stuck in sleep-deprived cycles... 🧵\n\n❌ Myth: More tired = better sleep (WRONG - overtired babies fight sleep harder)\n✅ Fact: Watch tired cues and move bedtime EARLIER\n\n❌ Myth: Skip naps so they sleep at night (WRONG - naps regulate cortisol)\n✅ Fact: Naps are foundational to good sleep\n\n❌ Myth: Feed more at night for longer sleep (WRONG - calories don\'t equal sleep)\n✅ Fact: Daytime calories matter more than night feeds\n\n❌ Myth: Later bedtime = sleeping in (WRONG - it just means earlier wake times)\n✅ Fact: Earlier bedtime often leads to better sleep all around\n\n❌ Myth: Some babies just don\'t sleep (WRONG - sleep is learnable)\n✅ Fact: If they\'re not sleeping, something\'s fixable\n\nWhich myth have you been caught in? Which one surprised you? 🤍',
    postTime: '8:00 AM',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-19'
  },
  {
    day: 'Wednesday',
    title: 'Harvey Turning 2',
    type: 'Static',
    description: 'Harvey\'s 2nd birthday - personal milestone + sleep tips',
    status: 'Ready to film',
    duration: 'Static image post',
    setting: 'Home - with Harvey',
    script: 'Harvey is TWO and I honestly can\'t believe it.\n\nTwo years ago, I was sleep-deprived, questioning everything, wondering if I was doing it right.\n\nHere\'s what changed:\n\n1. I stopped fighting his natural rhythms. Instead of forcing a schedule, we worked WITH his body\'s signals. Once I started watching for tired cues instead of clock-watching, everything shifted.\n\n2. I learned that consistent bedtime routines aren\'t prison - they\'re FREEDOM. Same bedtime, same wind-down, same songs. It sounds boring, but it became the most peaceful part of our day.\n\n3. I realized that gentle sleep doesn\'t mean no boundaries. He needs the boundaries. Kids THRIVE with them. We\'re firm and loving at the same time.\n\n4. The biggest shift? Letting go of guilt. Every baby is different. Every parent is different. There\'s no one right way - just YOUR way.\n\nFrom a newborn who woke every 2 hours to a toddler who sleeps 11-12 hours solid at night? That\'s not luck. That\'s consistency, patience, and understanding that sleep is a skill.\n\nTo the parents in the thick of it right now with a newborn or struggling toddler: YOU\'VE GOT THIS. It doesn\'t feel like it now, but two years goes fast.\n\nCheers to you, Harvey. And cheers to the parents who are doing their best. That\'s enough. You\'re enough. 🤍',
    onScreenText: 'Main image: Cute photo of Harvey celebrating\nText overlay with key milestones and quotes from caption\nDesign: Warm, personal, celebratory',
    caption: 'Harvey is TWO! 🎂\n\nIt\'s been quite the sleep journey from this tiny newborn to this spirited 2-year-old. Here\'s what we learned about toddler sleep:\n\n1️⃣ Work WITH natural rhythms, not against them\n2️⃣ Consistent routines = freedom, not prison\n3️⃣ Boundaries are loving, not harsh\n4️⃣ Let go of guilt - your way IS the right way\n\nFrom waking every 2 hours to sleeping 11-12 hours solid. That\'s not luck - that\'s consistency and understanding sleep as a skill.\n\nTo the parents in the thick of it: You\'ve got this. Two years goes fast. 🤍',
    postTime: '5:00 PM',
    reviewStatus: 'approved',
    reviewDueDate: '2026-02-18'
  },
  {
    day: 'Thursday',
    title: 'Myth-Busting Reel',
    type: 'Reel',
    description: 'Challenging the "cry it out" misconception',
    status: 'Ready to film',
    duration: '50 seconds',
    setting: 'Home - bedroom / nursery setting',
    script: 'Hook (0-3 sec): "Your pediatrician said let them cry? Here\'s what she probably meant..."\n\nContent (3-35 sec): "Okay, so \'cry it out\' is SO misunderstood. People think I\'m anti-cry-it-out. I\'m not. I\'m anti-UNINFORMED-cry-it-out.\n\nHere\'s the thing: Some crying while learning sleep is NORMAL. But there\'s a HUGE difference between:\n\n❌ Ignoring your baby for hours while they\'re screaming in distress\n✅ Teaching them to fall asleep independently while you\'re present and responsive\n\nThe science says: Graduated extinction (checking in, reassuring, but not picking up) can work. Cold turkey extinction? That\'s rough and not necessary.\n\nYou don\'t have to choose between:\n- Rocking them to sleep forever OR\n- Abandoning them to cry\n\nThere\'s a middle ground. There\'s ALWAYS a middle ground.\n\nYou can be gentle AND help them learn. Those aren\'t opposites."\n\nCTA (35-50 sec): "What\'s been holding you back from sleep training? And don\'t say \'I don\'t believe in it\' - belief isn\'t the issue. Method is. What specifically scares you about it?"',
    onScreenText: '[0-3 sec] Hook text on screen with concerned parent imagery\n[3-10 sec] Show "Ignore method" with X\n[10-15 sec] Show "Responsive method" with checkmark\n[15-30 sec] Show timeline comparison\n[30-40 sec] Show the "middle ground"\n[40-50 sec] CTA text asking for biggest fear',
    caption: 'There\'s a middle ground between chaos and "cry it out." Let\'s talk about it. 🤍\n\nThe cry it out controversy is SO misunderstood. It\'s not about:\n❌ Ignoring your baby for hours\n\nIt\'s about:\n✅ Teaching independent sleep while staying responsive\n✅ Checking in, reassuring, but not picking up immediately\n✅ Working WITH their nervous system, not against it\n\nYou don\'t have to choose between:\n- Rocking to sleep forever OR\n- Cold turkey extinction\n\nYou can be gentle AND set boundaries. You can be responsive AND help them learn.\n\nThe real talk? Method matters WAY more than belief. Let\'s talk about YOUR fears.\n\nWhat scares you most about sleep independence? Reply and let\'s address it. No judgment. Just solutions. 🤍',
    postTime: '7:30 PM',
    reviewStatus: 'changes-requested',
    reviewDueDate: '2026-02-20'
  },
  {
    day: 'Friday',
    title: 'Monthly Sleep Guidelines',
    type: 'Static',
    description: 'Age-specific sleep needs and schedules by month',
    status: 'In progress',
    duration: 'Detailed reference post',
    setting: 'Infographic / reference design',
    script: 'HOW MUCH SLEEP DOES YOUR BABY ACTUALLY NEED?\n\n0-3 MONTHS (Newborn Phase)\nTotal sleep needed: 16-17 hours\nNighttime: Fragmented (2-3 hour stretches)\nDaytime: 3-5 naps, irregular\nWhat\'s normal: Feeding every 2-3 hours around the clock\nYour job: Survive and respond. That\'s it.\n\n4-6 MONTHS (Early Infancy)\nTotal sleep needed: 15-16 hours\nNighttime: 5-6 hour stretches becoming possible\nDaytime: 3 naps, starting to consolidate\nWhat\'s normal: First real sleep patterns emerging\nYour job: Support longer stretches, introduce gentle routine\n\n7-12 MONTHS (Second Half of First Year)\nTotal sleep needed: 14-15 hours\nNighttime: 6-8 hour stretches, can do 10-12 with support\nDaytime: 2 naps consolidating to 2-3 hours total\nWhat\'s normal: Sleep regressions around 8-9 months\nYour job: Maintain consistent routine, expect setbacks\n\n1-2 YEARS (Toddler Phase)\nTotal sleep needed: 13-14 hours\nNighttime: 10-12 hours possible\nDaytime: 1-2 naps, transitioning to 1 nap around 18 months\nWhat\'s normal: Lots of opinions, boundary testing, resistance\nYour job: Keep boundaries firm but loving\n\n2-3 YEARS (Big Toddler)\nTotal sleep needed: 12-13 hours\nNighttime: 10-11 hours (can do 12 with early bedtime)\nDaytime: 1 nap (1-2 hours) or quiet time\nWhat\'s normal: Nap resistance, later bedtimes, more independence\nYour job: Protect the nap, keep bedtime early anyway\n\nTHE MOST IMPORTANT THING TO REMEMBER:\nThese are GUIDELINES, not rules. Your baby might need more or less. Watch YOUR BABY\'s mood, energy, behavior. That tells you more than any chart.\n\nSave this post. Share it with confused family members. Refer back when someone tells you \'that\'s too much sleep\' or \'they need less.\'',
    onScreenText: 'Age group headers with clear visual separation\nSleep amounts in large numbers\nDaily schedule breakdown with visual timeline\nColor-coded by age group\nKey takeaway highlighted at bottom',
    caption: 'HOW MUCH SLEEP DOES YOUR BABY ACTUALLY NEED? 📌 SAVE THIS.\n\n0-3 MONTHS: 16-17 hours (fragmented, all night feedings)\n4-6 MONTHS: 15-16 hours (patterns emerging)\n7-12 MONTHS: 14-15 hours (consolidation happening)\n1-2 YEARS: 13-14 hours (real schedule developing)\n2-3 YEARS: 12-13 hours (nap + nighttime)\n\nTHE CATCH: These are guidelines, not gospel. Your baby might need more or less. Watch THEIR mood and energy - that tells you more than any chart.\n\nBiggest myth? "Your baby needs less sleep." Nope. Overtired babies sleep WORSE. More tired ≠ longer sleep.\n\nWhen someone tells you "that\'s too much sleep," show them this post. 🤍 Save it. Refer to it. Share it with confused family members who keep questioning your nap schedule.',
    postTime: '10:00 AM',
    reviewStatus: 'needs-review',
    reviewDueDate: '2026-02-21'
  },
  {
    day: 'Saturday',
    title: 'Sample Schedule Static',
    type: 'Static',
    description: 'Real example: What a good day looks like (6-month-old)',
    status: 'Ready to schedule',
    duration: 'Sample schedule post',
    setting: 'Daily routine visual / infographic',
    script: 'WHAT A REALISTIC 6-MONTH-OLD SCHEDULE LOOKS LIKE\n\n6:00 AM - Wake up & first feed\nBaby wakes naturally (some parents wake them to establish a start time)\n\n6:30-7:00 AM - Wake window, playtime\nSome floor time, tummy time, interaction\n\n7:00-8:30 AM - NAP #1 (90 minutes)\nMost babies have best morning nap of the day\n\n8:30 AM - Wake & second feed\n\n9:00-10:30 AM - Wake window, activity\nOutside time? Errands? Playtime at home?\nKeep it light - morning is not the best time for huge stimulation\n\n10:30-12:00 PM - NAP #2 (90 minutes)\n\n12:00 PM - Wake & third feed\n\n12:30-2:00 PM - Wake window\nThis is often a good time for outings, walks, or active play\n\n2:00-3:30 PM - NAP #3 (90 minutes)\nThis nap often shifts/shortens as baby gets older\n\n3:30 PM - Wake & fourth feed\n\n4:00-5:30 PM - Wake window\nLow-key time. Save energy for bedtime.\n\n5:30-6:00 PM - Dinner / family time (or just watching)\n\n6:00-7:00 PM - BEDTIME ROUTINE\n6:00 - Bath time\n6:20 - Pajamas, feeding\n6:40 - Songs, cuddles\n6:50 - Lights down, into crib\n\n7:00 PM - BEDTIME\nSleep time: 7pm-6am (11 hours) + naps (4.5 hours) = 15.5 hours\n\nNIGHT NOTES:\n- Most 6-month-olds can do 1 night feed at this point\n- First stretch is usually longest (5-7 hours)\n- Early morning wakings? Usually means bedtime is too late, not too early\n- This sample assumes baby is healthy and feeding well\n\nIMPORTANT REMINDERS:\n- Every baby is different. This is a TEMPLATE, not a prescription.\n- Flexibility within structure is key. Some days will shift.\n- Wake windows matter more than clock times.\n- If something feels wrong, trust your gut.',
    onScreenText: 'Large visual timeline from 6am to 7pm\nColor-coded sections: Wake time (green), Nap time (blue), Feed time (pink), Bedtime routine (purple)\nEach block labeled with time and activity\nKey times highlighted in bold\nWake windows marked clearly',
    caption: 'THIS IS WHAT A REALISTIC 6-MONTH-OLD SCHEDULE LOOKS LIKE ✨\n\n6:00 AM - Wake & feed\n7:00-8:30 AM - NAP #1 (90 min)\n10:30-12:00 PM - NAP #2 (90 min) \n2:00-3:30 PM - NAP #3 (90 min)\n6:00-7:00 PM - Bedtime routine\n7:00 PM - Lights out 💤\n\nTotal: 11 hours nighttime + 4.5 hours naps = 15.5 hours\n\nThe real talk? This is a TEMPLATE. Every baby is different. What matters:\n✅ Wake windows (not clock times)\n✅ Consistency in rhythm\n✅ Flexible structure (life happens)\n✅ Bedtime routine every night\n\nEarly morning wakings? Usually means bedtime is too LATE, not too early.\n\nNot every nap needs to be 90 min. Some days are shorter. Life is flexible - your schedule doesn\'t have to be rigid to be effective.\n\nSave this for reference. Share with your partner or family members. 🤍',
    postTime: '6:00 PM',
    reviewStatus: 'approved',
    reviewDueDate: '2026-02-20'
  },
  {
    day: 'Sunday',
    title: 'Soft Sell: 3 Options',
    type: 'Reel',
    description: 'Community connection - ask followers about their biggest sleep struggle',
    status: 'Ready to film',
    duration: '45 seconds',
    setting: 'Home - casual setting',
    script: 'Option 1 (First 15 sec): "Real talk - what\'s ACTUALLY harder for you?\n\nBedtime battles?\nOr night wakings?\n\nI get asked both, but the solution is SO different depending on which one\'s killing you."\n\nOption 2 (15-30 sec): "Between schedule stress...\n\nWhere you\'re watching the clock and worried they\'re not napping ENOUGH...\n\nAnd actual behavior problems where they\'re overtired and fighting everything...\n\nWhich one keeps you up at night?"\n\nOption 3 (30-45 sec): "First month with a newborn - just trying to survive?\n\nOr first year - you think it should be easier by now and you\'re frustrated it\'s not?\n\nBoth are valid. I just want to know where you\'re at so I can help."\n\nCTA: "Comment below. Not all sleep struggles are the same, and I\'m here for whatever yours is. 🤍"',
    onScreenText: '[0-3 sec] "Real talk - what\'s actually harder for you?"\n[3-15 sec] Show bedtime scene vs night wakings scene\n[15-30 sec] Show stressed parent vs behavior problem parent\n[30-45 sec] Show newborn exhaustion vs first year frustration\nBottom text: Which one is YOU?',
    caption: 'Real talk: What\'s YOUR biggest sleep challenge right now? 🤔\n\nOption A: Bedtime battles vs night wakings?\nThey\'re SO different problems with SO different solutions.\n\nOption B: Schedule anxiety vs actual behavior issues?\nWatching the clock is different than an overtired toddler.\n\nOption C: First month survival mode vs first year frustration?\nBoth are real. Both are hard.\n\nI want to know where YOU\'RE at so I can actually help instead of giving generic advice.\n\nDrop it below. Tell me which one keeps you up at night. And then let\'s solve it. 🤍',
    postTime: '7:30 PM',
    reviewStatus: 'changes-requested',
    reviewDueDate: '2026-02-22'
  }
];

const DEFAULT_TEMPLATES = [
  {
    name: '📸 Instagram Caption',
    content: `[HOOK / QUESTION]
E.g., "Does your toddler fight bedtime every night?"

[RELATABLE SCENARIO]
Most parents think [myth]...
But here's what science says:

[SOLUTION / INSIGHT]
Instead, try:
• Point 1
• Point 2
• Point 3

[CALL TO ACTION]
Have you tried this? Drop a comment 👇
Or DM me about your sleep journey.

[TAG]
#HelloLittleSleepers #GentleSleep #ToddlerParenting`
  },
  {
    name: '🎵 TikTok Script',
    content: `[HOOK - 0-3 SEC]
"This is what nobody tells new parents..."
OR
"Parents always get this wrong..."

[TREND / TRENDING AUDIO]
Use trending sound (check TikTok Sounds page)

[CONTENT - 3-15 SEC]
Show / explain / demonstrate
Cut frequently (every 2-3 sec)
Keep energy UP

[CTA - LAST 3 SEC]
"What's YOUR biggest sleep challenge?"
"Follow for more sleep tips 👇"

[HASHTAGS]
#SleepTips #ToddlerLife #ParentingHacks`
  },
  {
    name: '📧 Email Opening',
    content: `Subject: [PERSONALIZED / CURIOSITY]
E.g., "The sleep mistake I see most (and how to fix it)"

---

Hi [Name],

[OPENING - RELATABLE]
Remember when I told you about [situation]?
I got so many emails about this...

[INSIGHT / STORY]
Here's what I learned from working with families:

[SOLUTION]
Try this instead:
1. Step 1
2. Step 2

[CLOSE]
How's your sleep journey going?
Reply with your biggest challenge.

— Jade
🤍 Hello Little Sleepers`
  }
];

export default function Content() {
  const [activeTab, setActiveTab] = useState<TabType>('content-flow');
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [customIdeas, setCustomIdeas] = useState<ContentIdea[]>([]);
  const [dailyView, setDailyView] = useState<'today' | 'week' | 'upcoming'>('today');
  const [expandedWeeklyItem, setExpandedWeeklyItem] = useState<string | null>(null);
  const [weeklyContent, setWeeklyContent] = useState<WeeklyContentItem[]>([]);

  const [contentTitle, setContentTitle] = useState('');
  const [contentPlatform, setContentPlatform] = useState('');
  const [contentDesc, setContentDesc] = useState('');
  const [customIdea, setCustomIdea] = useState('');
  const [ideaTopic, setIdeaTopic] = useState('');
  const [ideaPlatform, setIdeaPlatform] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');

  // Load from localStorage and weekly content data
  useEffect(() => {
    const saved = localStorage.getItem('jadeContentData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setPosts(data.posts || []);
        setTemplates(data.templates || []);
        setCustomIdeas(data.customIdeas || []);
        
        // Load weekly content if available
        if (data.posts && Array.isArray(data.posts)) {
          setWeeklyContent(data.posts.map((p: any) => ({
            day: p.date || p.day || 'TBA',
            title: p.title,
            type: p.type,
            description: p.description,
            status: p.status === 'due-for-review' ? 'Due for Review' : 
                    p.status === 'ready-to-film' ? 'Ready to film' :
                    p.status === 'ready-to-schedule' ? 'Ready to schedule' : p.status,
            script: p.script,
            caption: p.caption,
            duration: p.duration,
            setting: p.setting,
            onScreenText: p.onScreenText,
            postTime: p.postTime,
            reviewStatus: p.reviewStatus,
            reviewDueDate: p.reviewDueDate,
          })));
        }
      } catch (e) {
        console.log('No saved data');
      }
    }
  }, []);

  // Save to localStorage
  const saveData = (newPosts: ContentPost[], newTemplates: ContentTemplate[], newIdeas: ContentIdea[]) => {
    const data = {
      posts: newPosts,
      templates: newTemplates,
      customIdeas: newIdeas
    };
    localStorage.setItem('jadeContentData', JSON.stringify(data));
  };

  // Content Management
  const handleAddContent = () => {
    if (!contentTitle.trim() || !contentPlatform) {
      alert('Please fill in title and platform');
      return;
    }

    const newPost: ContentPost = {
      id: Date.now(),
      title: contentTitle.trim(),
      platform: contentPlatform,
      description: contentDesc.trim(),
      status: 'Draft',
      created: new Date().toLocaleDateString()
    };

    const updated = [...posts, newPost];
    setPosts(updated);
    saveData(updated, templates, customIdeas);
    setContentTitle('');
    setContentPlatform('');
    setContentDesc('');
  };

  const handleDeletePost = (id: number) => {
    if (confirm('Delete this post?')) {
      const updated = posts.filter(p => p.id !== id);
      setPosts(updated);
      saveData(updated, templates, customIdeas);
    }
  };

  const handleUpdateStatus = (id: number, newStatus: 'Draft' | 'Scheduled' | 'Published') => {
    const updated = posts.map(p =>
      p.id === id ? { ...p, status: newStatus } : p
    );
    setPosts(updated);
    saveData(updated, templates, customIdeas);
  };

  const handleApproveContent = (itemIndex: number) => {
    // Find the content item in weeklyContent
    const contentData = localStorage.getItem('jadeContentData');
    if (contentData) {
      try {
        const data = JSON.parse(contentData);
        if (data.posts && Array.isArray(data.posts)) {
          const updated = data.posts.map((p: any, idx: number) => {
            if (p.id === itemIndex) {
              return {
                ...p,
                status: 'ready-to-film',
                reviewStatus: 'approved',
                approvalDate: new Date().toISOString().split('T')[0]
              };
            }
            return p;
          });
          
          const newData = { ...data, posts: updated };
          localStorage.setItem('jadeContentData', JSON.stringify(newData));
          
          // Reload weekly content
          setWeeklyContent(updated.map((p: any) => ({
            day: p.date || p.day || 'TBA',
            title: p.title,
            type: p.type,
            description: p.description,
            status: p.status === 'due-for-review' ? 'Due for Review' : 
                    p.status === 'ready-to-film' ? 'Ready to film' :
                    p.status === 'ready-to-schedule' ? 'Ready to schedule' : p.status,
            script: p.script,
            caption: p.caption,
            duration: p.duration,
            setting: p.setting,
            onScreenText: p.onScreenText,
            postTime: p.postTime,
            reviewStatus: p.reviewStatus,
            reviewDueDate: p.reviewDueDate,
          })));
        }
      } catch (e) {
        console.log('Error approving content');
      }
    }
  };

  // Ideas Management
  const handleSaveIdea = () => {
    if (!customIdea.trim()) {
      alert('Please write an idea');
      return;
    }

    const newIdea: ContentIdea = {
      id: Date.now(),
      topic: ideaTopic.trim() || 'Quick Idea',
      description: customIdea.trim(),
      useCase: ideaPlatform.trim() || 'Multi-platform',
      created: new Date().toLocaleDateString()
    };

    const updated = [...customIdeas, newIdea];
    setCustomIdeas(updated);
    saveData(posts, templates, updated);
    setCustomIdea('');
    setIdeaTopic('');
    setIdeaPlatform('');
  };

  const handleDeleteIdea = (id: number) => {
    if (confirm('Delete this idea?')) {
      const updated = customIdeas.filter(i => i.id !== id);
      setCustomIdeas(updated);
      saveData(posts, templates, updated);
    }
  };

  // Templates Management
  const handleSaveTemplate = () => {
    if (!templateName.trim() || !templateContent.trim()) {
      alert('Please fill in template name and content');
      return;
    }

    const newTemplate: ContentTemplate = {
      id: Date.now(),
      name: templateName.trim(),
      content: templateContent.trim(),
      created: new Date().toLocaleDateString()
    };

    const updated = [...templates, newTemplate];
    setTemplates(updated);
    saveData(posts, updated, customIdeas);
    setTemplateName('');
    setTemplateContent('');
  };

  const handleDeleteTemplate = (id: number) => {
    if (confirm('Delete this template?')) {
      const updated = templates.filter(t => t.id !== id);
      setTemplates(updated);
      saveData(posts, updated, customIdeas);
    }
  };

  // Calculate stats
  const stats = {
    draft: posts.filter(p => p.status === 'Draft').length,
    scheduled: posts.filter(p => p.status === 'Scheduled').length,
    published: posts.filter(p => p.status === 'Published').length,
    total: posts.length
  };

  const platformStats = posts.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Daily Content data
  const todayContent = {
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    draftCount: posts.filter(p => p.status === 'Draft').length,
  };

  const thisWeekPlan: WeeklyPlan = {
    week: 'This Week',
    status: posts.filter(p => p.status === 'Scheduled').length >= 3 ? 'complete' : 'incomplete',
    daysPlanned: posts.filter(p => p.status === 'Scheduled' || p.status === 'Draft').length,
    daysTotal: 7,
  };

  const getStatusColor = (status: ContentPost['status']) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-700';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'Draft':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-jade-light px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Content Management</h2>
              <p className="text-sm text-gray-600">Unified content planning, drafting & scheduling</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors">
            <Plus size={20} />
            <span>New Content</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-jade-light px-6 py-4 flex items-center space-x-2 overflow-x-auto">
        {[
          { id: 'content-flow', label: '📋 Content Flow' },
          { id: 'this-week', label: '🎬 This Week' },
          { id: 'ideas', label: '💡 Ideas (By Theme)' },
          { id: 'daily', label: '📅 Daily & Weekly' },
          { id: 'templates', label: '📝 Templates' },
          { id: 'stats', label: '📊 Stats' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-jade-purple text-jade-cream'
                : 'bg-jade-cream text-jade-purple hover:bg-jade-light'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Content Flow Tab */}
        {activeTab === 'content-flow' && (
          <div>
            <h3 className="text-lg font-bold text-jade-purple mb-4">Content Progression: Draft → Scheduled → Published</h3>
            
            {/* Quick Add */}
            <div className="bg-jade-cream p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-jade-purple mb-3">Add New Content</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Post title or idea"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple"
                />
                <select
                  value={contentPlatform}
                  onChange={(e) => setContentPlatform(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple"
                >
                  <option value="">-- Select Platform --</option>
                  <option value="Instagram">📸 Instagram</option>
                  <option value="TikTok">🎵 TikTok</option>
                  <option value="Blog">📖 Blog</option>
                  <option value="Email">📧 Email</option>
                  <option value="Newsletter">📰 Newsletter</option>
                </select>
                <button
                  onClick={handleAddContent}
                  className="bg-jade-purple text-jade-cream px-4 py-2 rounded hover:bg-jade-light hover:text-jade-purple transition-colors flex items-center justify-center space-x-2 text-sm font-medium"
                >
                  <Plus size={16} />
                  <span>Add</span>
                </button>
              </div>
              <textarea
                placeholder="What's this post about? (optional)"
                value={contentDesc}
                onChange={(e) => setContentDesc(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple w-full"
                rows={2}
              />
            </div>

            {/* Content by Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Drafted */}
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                <h4 className="font-bold text-yellow-900 mb-3 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Drafted ({stats.draft})</span>
                </h4>
                <div className="space-y-2">
                  {posts.filter(p => p.status === 'Draft').map(post => (
                    <div key={post.id} className="bg-white p-3 rounded border border-yellow-100 text-sm">
                      <div className="font-semibold text-gray-900 mb-1">{post.title}</div>
                      <div className="text-xs text-gray-600 mb-2">{post.platform}</div>
                      <select
                        value={post.status}
                        onChange={(e) => handleUpdateStatus(post.id, e.target.value as any)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-jade-purple mb-2"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Published">Published</option>
                      </select>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {stats.draft === 0 && <p className="text-gray-600 text-sm italic">No drafts yet</p>}
                </div>
              </div>

              {/* Scheduled */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Scheduled ({stats.scheduled})</span>
                </h4>
                <div className="space-y-2">
                  {posts.filter(p => p.status === 'Scheduled').map(post => (
                    <div key={post.id} className="bg-white p-3 rounded border border-blue-100 text-sm">
                      <div className="font-semibold text-gray-900 mb-1">{post.title}</div>
                      <div className="text-xs text-gray-600 mb-2">{post.platform}</div>
                      <select
                        value={post.status}
                        onChange={(e) => handleUpdateStatus(post.id, e.target.value as any)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-jade-purple mb-2"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Published">Published</option>
                      </select>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {stats.scheduled === 0 && <p className="text-gray-600 text-sm italic">No scheduled posts</p>}
                </div>
              </div>

              {/* Published */}
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <h4 className="font-bold text-green-900 mb-3 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Published ({stats.published})</span>
                </h4>
                <div className="space-y-2">
                  {posts.filter(p => p.status === 'Published').map(post => (
                    <div key={post.id} className="bg-white p-3 rounded border border-green-100 text-sm">
                      <div className="font-semibold text-gray-900 mb-1">{post.title}</div>
                      <div className="text-xs text-gray-600 mb-2">{post.platform}</div>
                      <select
                        value={post.status}
                        onChange={(e) => handleUpdateStatus(post.id, e.target.value as any)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-jade-purple mb-2"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Published">Published</option>
                      </select>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {stats.published === 0 && <p className="text-gray-600 text-sm italic">No published posts</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* This Week Tab - NEW CONTENT REVIEW WORKFLOW */}
        {activeTab === 'this-week' && (
          <div>
            <h3 className="text-lg font-bold text-jade-purple mb-6">📅 This Week's Content Review Workflow</h3>
            <p className="text-gray-600 mb-6">Track content from review through filming and scheduling.</p>

            {/* Review Workflow Summary */}
            <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-6 text-white mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-2xl font-bold mb-1">
                    {weeklyContent.filter(c => c.status === 'Due for Review').length}
                  </h4>
                  <p className="text-jade-cream opacity-90">Due for Review</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-1">
                    {weeklyContent.filter(c => c.status === 'Ready to film' || c.status === 'Ready to schedule').length}
                  </h4>
                  <p className="text-jade-cream opacity-90">Approved & Ready</p>
                </div>
              </div>
            </div>

            {/* SECTION 1: DUE FOR REVIEW */}
            {weeklyContent.filter(c => c.status === 'Due for Review').length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🚩</span>
                  <h4 className="text-lg font-bold text-red-900">Due for Review ({weeklyContent.filter(c => c.status === 'Due for Review').length})</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Approve these items before filming/scheduling</p>

                <div className="grid grid-cols-1 gap-4">
                  {weeklyContent.filter(c => c.status === 'Due for Review').map((item, idx) => (
                    <div
                      key={idx}
                      className={`bg-white rounded-lg border-l-4 border-red-500 shadow-md overflow-hidden transition-all`}
                    >
                      {/* Header - Always Visible */}
                      <button
                        onClick={() => setExpandedWeeklyItem(expandedWeeklyItem === `review-${idx}` ? null : `review-${idx}`)}
                        className="w-full p-4 hover:bg-red-50 transition-colors text-left"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-lg">🚩</span>
                              <div className="text-sm px-2 py-1 bg-red-200 text-red-900 rounded-full font-medium">
                                {item.type}
                              </div>
                            </div>
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">{item.description}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <div className="text-jade-purple text-lg font-bold">
                              {expandedWeeklyItem === `review-${idx}` ? '▼' : '▶'}
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {expandedWeeklyItem === `review-${idx}` && (
                        <div className="p-4 bg-red-50 space-y-3 border-t border-red-200">
                          {item.description && (
                            <div className="bg-white p-3 rounded border border-red-200">
                              <h5 className="font-semibold text-red-900 mb-1 text-sm">Description</h5>
                              <p className="text-sm text-gray-700">{item.description}</p>
                            </div>
                          )}

                          {item.script && (
                            <ContentItem6Column 
                              script={item.script}
                              onScreenText={item.onScreenText}
                              caption={item.caption}
                              setting={item.setting}
                              description={item.description}
                              statusColor="red"
                            />
                          )}

                          <div className="flex gap-2 pt-3 border-t border-red-200">
                            <button
                              onClick={() => handleApproveContent(idx)}
                              className="flex-1 bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition text-sm"
                            >
                              ✅ Approve for Filming
                            </button>
                            <button className="flex-1 bg-amber-600 text-white px-4 py-2 rounded font-semibold hover:bg-amber-700 transition text-sm">
                              📝 Request Changes
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: READY TO FILM/SCHEDULE */}
            {weeklyContent.filter(c => c.status === 'Ready to film' || c.status === 'Ready to schedule').length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✅</span>
                  <h4 className="text-lg font-bold text-green-900">Ready to Film/Schedule ({weeklyContent.filter(c => c.status === 'Ready to film' || c.status === 'Ready to schedule').length})</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Approved content ready to go</p>

                <div className="grid grid-cols-1 gap-4">
                  {weeklyContent.filter(c => c.status === 'Ready to film' || c.status === 'Ready to schedule').map((item, idx) => {
                    const isExpanded = expandedWeeklyItem === `ready-${idx}`;
                
                // Status color mapping
                let statusColor = 'bg-orange-100 text-orange-700 border-orange-300';
                let statusDot = 'bg-orange-500';
                
                if (item.status === 'Ready to schedule') {
                  statusColor = 'bg-blue-100 text-blue-700 border-blue-300';
                  statusDot = 'bg-blue-500';
                } else if (item.status === 'In progress') {
                  statusColor = 'bg-yellow-100 text-yellow-700 border-yellow-300';
                  statusDot = 'bg-yellow-500';
                } else if (item.status === 'Scheduled') {
                  statusColor = 'bg-green-100 text-green-700 border-green-300';
                  statusDot = 'bg-green-500';
                }

                return (
                  <div
                    key={`ready-${idx}`}
                    className={`bg-white rounded-lg border-l-4 border-green-500 shadow-md overflow-hidden transition-all`}
                  >
                    {/* Header - Always Visible */}
                    <button
                      onClick={() => setExpandedWeeklyItem(isExpanded ? null : `ready-${idx}`)}
                      className="w-full p-4 hover:bg-green-50 transition-colors text-left border-b border-green-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="text-lg font-bold text-jade-purple">{item.day}</div>
                            <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full font-medium">
                              {item.type}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 ${statusDot} rounded-full`}></div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded border ${statusColor}`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="text-jade-purple text-lg font-bold">
                            {isExpanded ? '▼' : '▶'}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="p-4 bg-jade-cream/20 space-y-4">
                        {/* Duration */}
                        {item.duration && (
                          <div className="bg-white p-3 rounded border border-jade-light">
                            <h5 className="font-semibold text-jade-purple mb-1 text-sm">📹 Duration</h5>
                            <p className="text-sm text-gray-700">{item.duration}</p>
                          </div>
                        )}

                        {/* Setting */}
                        {item.setting && (
                          <div className="bg-white p-3 rounded border border-jade-light">
                            <h5 className="font-semibold text-jade-purple mb-1 text-sm">📍 Setting</h5>
                            <p className="text-sm text-gray-700">{item.setting}</p>
                          </div>
                        )}

                        {/* Post Time */}
                        {item.postTime && (
                          <div className="bg-white p-3 rounded border border-jade-light">
                            <h5 className="font-semibold text-jade-purple mb-1 text-sm">⏰ Post Time</h5>
                            <p className="text-sm text-gray-700">{item.postTime}</p>
                          </div>
                        )}
                        
                        {/* Full Script - 6-Column Display */}
                        {item.script && (
                          <ContentItem6Column 
                            script={item.script}
                            onScreenText={item.onScreenText}
                            caption={item.caption}
                            setting={item.setting}
                            description={item.description}
                            statusColor="purple"
                          />
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3 border-t border-green-200">
                          <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-green-700 transition">
                            {item.status === 'Ready to film' ? '🎥 Start Filming' : '📤 Schedule Now'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
                </div>
              </div>
            )}

            {weeklyContent.filter(c => c.status === 'Due for Review').length === 0 && weeklyContent.filter(c => c.status === 'Ready to film' || c.status === 'Ready to schedule').length === 0 && (
              <div className="bg-blue-50 rounded-lg p-8 text-center border border-blue-200">
                <p className="text-blue-900">No content in the review workflow yet. Start by adding content items!</p>
              </div>
            )}
          </div>
        )}

        {/* Ideas Tab - Organized by Theme */}
        {activeTab === 'ideas' && (
          <div>
            <h3 className="text-lg font-bold text-jade-purple mb-6">Ideas Organized by Theme</h3>
            <p className="text-gray-600 mb-6">Quick visual picking of content ideas. Mix and match themes across all platforms.</p>

            {/* Curated Ideas by Theme */}
            <div className="space-y-4 mb-8">
              {Object.entries(CURATED_IDEAS_BY_THEME).map(([theme, ideas]) => (
                <div key={theme} className="bg-white rounded-lg border border-jade-light p-5">
                  <h4 className="font-bold text-jade-purple mb-3 text-lg">{theme}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ideas.map((idea, idx) => (
                      <div key={idx} className="bg-jade-cream/50 p-4 rounded border border-jade-light hover:shadow-md transition-shadow">
                        <p className="font-semibold text-jade-purple mb-2">{idea.topic}</p>
                        <p className="text-sm text-gray-700 mb-3">{idea.description}</p>
                        <p className="text-xs text-gray-600 italic">💡 {idea.useCase}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Ideas Section */}
            <h3 className="text-lg font-bold text-jade-purple mb-4 mt-8">Add Your Own Ideas</h3>
            <div className="bg-jade-cream p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Topic/Theme"
                  value={ideaTopic}
                  onChange={(e) => setIdeaTopic(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple"
                />
                <input
                  type="text"
                  placeholder="Best use case (e.g., TikTok, Blog)"
                  value={ideaPlatform}
                  onChange={(e) => setIdeaPlatform(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple"
                />
                <button
                  onClick={handleSaveIdea}
                  className="bg-jade-purple text-jade-cream px-4 py-2 rounded hover:bg-jade-light hover:text-jade-purple transition-colors text-sm font-medium"
                >
                  Save Idea
                </button>
              </div>
              <textarea
                placeholder="Describe your idea briefly..."
                value={customIdea}
                onChange={(e) => setCustomIdea(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple w-full"
                rows={3}
              />
            </div>

            {customIdeas.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-jade-purple mb-4">Your Saved Ideas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customIdeas.map(idea => (
                    <div key={idea.id} className="bg-white p-4 rounded border border-jade-light">
                      <p className="font-semibold text-jade-purple mb-2">{idea.topic}</p>
                      <p className="text-sm text-gray-700 mb-3">{idea.description}</p>
                      <p className="text-xs text-gray-600 mb-3">💡 {idea.useCase}</p>
                      <p className="text-xs text-gray-500 mb-3">{idea.created}</p>
                      <button
                        onClick={() => handleDeleteIdea(idea.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Daily & Weekly Tab */}
        {activeTab === 'daily' && (
          <div>
            {/* View Tabs */}
            <div className="flex items-center space-x-2 mb-6">
              {(['today', 'week', 'upcoming'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setDailyView(view)}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
                    dailyView === view
                      ? 'bg-jade-purple text-jade-cream'
                      : 'bg-jade-cream text-jade-purple hover:bg-jade-light'
                  }`}
                >
                  {view === 'today' && "📅 Today's Draft"}
                  {view === 'week' && '📆 This Week'}
                  {view === 'upcoming' && '🔮 Upcoming'}
                </button>
              ))}
            </div>

            {/* Today's Content */}
            {dailyView === 'today' && (
              <div className="space-y-6">
                {/* Today's Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-jade-purple">
                    <p className="text-sm text-gray-600 mb-2">Date</p>
                    <p className="text-lg font-semibold text-jade-purple">{todayContent.date}</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-600 mb-2">Drafts Ready</p>
                    <p className="text-lg font-semibold text-yellow-600">{todayContent.draftCount} posts</p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <p className="text-lg font-semibold text-green-600">Ready to work</p>
                  </div>
                </div>

                {/* Today's Drafts to Work On */}
                <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Today's Content Queue</h3>
                  <p className="text-jade-cream opacity-90">Work through these drafts and move them to scheduled when ready</p>
                </div>

                {posts.filter(p => p.status === 'Draft').length > 0 ? (
                  <div className="space-y-3">
                    {posts.filter(p => p.status === 'Draft').map(post => (
                      <div key={post.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-jade-light">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{post.title}</p>
                            <p className="text-sm text-gray-600">📱 {post.platform}</p>
                            {post.description && <p className="text-sm text-gray-700 mt-2">{post.description}</p>}
                          </div>
                          <button
                            onClick={() => handleUpdateStatus(post.id, 'Scheduled')}
                            className="bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-medium text-sm whitespace-nowrap"
                          >
                            Mark Scheduled
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-jade-cream/50 rounded-lg p-8 text-center">
                    <p className="text-gray-700">No drafts today. Great work! 🎉</p>
                  </div>
                )}
              </div>
            )}

            {/* This Week */}
            {dailyView === 'week' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">This Week's Content Plan</h3>
                  <p className="text-jade-cream opacity-90">Target: Full week planned by end of week</p>
                </div>

                {/* Weekly Progress */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-jade-purple">Progress: {thisWeekPlan.daysPlanned} / {thisWeekPlan.daysTotal} days planned</h3>
                    <span className={`text-sm font-semibold px-3 py-1 rounded ${
                      thisWeekPlan.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {thisWeekPlan.status === 'complete' ? 'Complete' : 'In Progress'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-jade-purple h-3 rounded-full transition-all"
                      style={{ width: `${(thisWeekPlan.daysPlanned / thisWeekPlan.daysTotal) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Weekly Breakdown by Day */}
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-jade-light">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{day}</p>
                          <p className="text-sm text-gray-600">Content items pending for this day</p>
                        </div>
                        <button className="text-jade-purple hover:text-jade-purple/80 font-medium text-sm">
                          Plan Day →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            {dailyView === 'upcoming' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg shadow-lg p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Next Week's Planning</h3>
                  <p className="text-purple-100 opacity-90">Get ahead with planning for next week</p>
                </div>

                {/* Next Week Status */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-jade-purple">Next Week: 0 / 7 days planned</h3>
                    <button className="bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-medium">
                      Start Planning
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all"
                      style={{ width: '0%' }}
                    />
                  </div>
                </div>

                <div className="bg-jade-cream/50 rounded-lg p-6 text-center">
                  <p className="text-gray-700">Next week's planning will appear here once you start adding items.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <h3 className="text-lg font-bold text-jade-purple mb-4">Content Scripts & Templates</h3>

            {DEFAULT_TEMPLATES.map((template, idx) => (
              <div key={idx} className="mb-6">
                <h4 className="font-semibold text-jade-purple mb-3">{template.name}</h4>
                <div className="bg-gray-100 p-4 rounded border border-gray-300 text-sm text-gray-700 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {template.content}
                </div>
              </div>
            ))}

            <h3 className="text-lg font-bold text-jade-purple mb-4 mt-6">Add Your Own Template</h3>
            <div className="bg-jade-cream p-4 rounded space-y-3 mb-6">
              <input
                type="text"
                placeholder="Template name (e.g., 'Myth-Busting Post')"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple w-full"
              />
              <textarea
                placeholder="Paste your template here..."
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-jade-purple w-full font-mono"
                rows={6}
              />
              <button
                onClick={handleSaveTemplate}
                className="bg-jade-purple text-jade-cream px-4 py-2 rounded hover:bg-jade-light hover:text-jade-purple transition-colors text-sm font-medium"
              >
                Save Template
              </button>
            </div>

            {templates.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-jade-purple mb-4">Your Saved Templates</h3>
                <div className="space-y-4">
                  {templates.map(template => (
                    <div key={template.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-gray-800">{template.name}</h5>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-300 text-sm text-gray-700 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {template.content}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Created: {template.created}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <h3 className="text-lg font-bold text-jade-purple mb-4">Content Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-100 to-white p-4 rounded border border-yellow-200 text-center">
                <div className="text-3xl font-bold text-yellow-600">{stats.draft}</div>
                <div className="text-sm text-gray-600 mt-1">Drafts</div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-white p-4 rounded border border-blue-200 text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.scheduled}</div>
                <div className="text-sm text-gray-600 mt-1">Scheduled</div>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-white p-4 rounded border border-green-200 text-center">
                <div className="text-3xl font-bold text-green-600">{stats.published}</div>
                <div className="text-sm text-gray-600 mt-1">Published</div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-white p-4 rounded border border-purple-200 text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
                <div className="text-sm text-gray-600 mt-1">Total Posts</div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-jade-purple mb-4">Content by Platform</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(platformStats).length > 0 ? (
                Object.entries(platformStats).map(([platform, count]) => (
                  <div key={platform} className="bg-gradient-to-br from-jade-light to-white p-4 rounded border border-jade-light text-center">
                    <div className="text-2xl font-bold text-jade-purple">{count}</div>
                    <div className="text-sm text-gray-600 mt-1">{platform}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No content yet. Start adding to see stats!</p>
              )}
            </div>

            <div className="mt-6 bg-yellow-50 p-4 rounded border-l-4 border-jade-light">
              <p className="text-sm text-gray-700">
                <strong>💡 Tip:</strong> Balance content across platforms for maximum reach. Track which platforms get the most engagement and adjust your strategy accordingly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
