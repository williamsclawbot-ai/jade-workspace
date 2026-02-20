/**
 * Proactive Content Strategy Engine - Feb 20, 2026
 * Generates content topics with competitor insights, multiple hook angles, and segment-specific messaging
 * 
 * Strategy: Analyze competitor gaps + HLS brand strengths + market demand
 * Output: 7 full weekly content pieces with 3-5 hook variations each
 */

export interface ContentPillar {
  name: string;
  description: string;
  helpfulFor: string[];
  examples: string[];
}

export interface CustomerSegment {
  name: string;
  description: string;
  painPoints: string[];
  messageAngle: string;
}

export interface ContentHookVariation {
  angle: string;
  text: string;
  primarySegment: string;
}

export interface ProactiveContentTopic {
  id: string;
  day: string;
  pillar: string;
  title: string;
  primarySegment: string;
  description: string;
  type: 'Reel' | 'Carousel' | 'Static';
  hooks: ContentHookVariation[];
  cta: string;
  newsletter?: {
    subject: string;
    angle: string;
  };
  competitivePosition?: string;
}

/**
 * HLS BRAND POSITIONING
 * What makes us different from competitors (Baby Sleep Code, Calm Babies, etc.)
 */
export const HLS_BRAND_PILLARS: ContentPillar[] = [
  {
    name: 'Parental Wellbeing First',
    description: 'Sleep is not a selfish need - it\'s essential for family health',
    helpfulFor: ['Working mothers', 'Postpartum mood', 'Exhausted parents'],
    examples: [
      'Why your sleep matters as much as your baby\'s',
      'Guilt-free sleep: validating your own needs',
      'Rest is not selfish - it\'s survival',
    ],
  },
  {
    name: 'Responsive Not Rigid',
    description: 'Gentle Fade + Quick Reset: flexibility that works for YOUR family',
    helpfulFor: ['Attachment-focused parents', 'Flexible families', 'Resistant sleepers'],
    examples: [
      'Meeting your baby where they are',
      'Two approaches: pick what fits your values',
      'Progress over perfection',
    ],
  },
  {
    name: 'Communication Not Crying',
    description: 'Crying is data. Understanding what your baby is telling you.',
    helpfulFor: ['New parents', 'Anxious parents', 'Empathy-centered families'],
    examples: [
      'What your baby\'s cry is actually saying',
      'Reading cues: the foundation of sleep training',
      'Connection through communication',
    ],
  },
  {
    name: 'Founder Authenticity',
    description: 'Real parents who\'ve done this with our own kids. No theory-only advice.',
    helpfulFor: ['Parents seeking relatability', 'Trust builders', 'Story lovers'],
    examples: [
      'How we handled Ivy\'s sleep regressions',
      'The method that worked for our family',
      'Real stories from real families',
    ],
  },
];

/**
 * CUSTOMER SEGMENTS - From research (13+ personas)
 * Different messaging for different struggles
 */
export const CUSTOMER_SEGMENTS: CustomerSegment[] = [
  {
    name: 'Working Mothers',
    description: 'Career + motherhood, exhausted, need efficiency',
    painPoints: [
      'Limited time with baby (guilt)',
      'Extreme sleep deprivation',
      'Partner misalignment (one parent working, one at home)',
    ],
    messageAngle:
      'Your career matters. Your sleep matters. You can have both. Here\'s the practical plan.',
  },
  {
    name: 'Gentle/Attachment Parents',
    description: 'Values-aligned, want responsive methods, wary of CIO',
    painPoints: [
      'Fear of damaging attachment',
      'Ethical concerns with conventional training',
      'Need for gentle alternatives',
    ],
    messageAngle:
      'Responsive sleep is possible. You don\'t have to choose between attachment and rest.',
  },
  {
    name: 'Solo/Single Parents',
    description: 'All responsibility alone, need survival-mode honesty',
    painPoints: [
      'No breaks or backup',
      'Absolute desperation for sleep',
      'No one to tag in at 3am',
    ],
    messageAngle: 'You\'re not alone. Here\'s what actually works when you\'re parenting solo.',
  },
  {
    name: 'Postpartum Struggling',
    description: 'Early days, PPA/PPD risk, vulnerable',
    painPoints: [
      'Postpartum mood concerns',
      'Sleep deprivation + recovery',
      'Feeling broken/inadequate',
    ],
    messageAngle: 'Your mental health is priority one. This is not a willpower problem.',
  },
  {
    name: 'Shift Workers',
    description: 'Irregular schedules, baby sleep doesn\'t fit traditional routines',
    painPoints: [
      'Impossible bedtime routines',
      'Partner sleep conflict',
      'Standard advice doesn\'t apply',
    ],
    messageAngle:
      'Your schedule is different - and that\'s okay. Here\'s how to make sleep work with it.',
  },
];

/**
 * COMPETITOR ANALYSIS INSIGHTS (Feb 20, 2026)
 * What gaps HLS can own
 */
const COMPETITOR_GAPS = [
  'Parental mental health as PRIMARY benefit (not secondary)',
  'Solo parent-specific advice',
  'Shift worker sleep solutions',
  'Postpartum mood + sleep connection',
  'Partner alignment guides (how to get spouse on board)',
  'Real stories from founder (Jade + Jess authenticity)',
  'Flexible methods (not one-size-fits-all)',
];

/**
 * GENERATED WEEKLY CONTENT - Data-driven topics based on customer demand + competitor gaps
 * This runs nightly to generate 7 pieces with multiple hook angles
 */
export function generateProactiveWeeklyTopics(): ProactiveContentTopic[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const topics: ProactiveContentTopic[] = [
    {
      day: days[0],
      id: 'topic_001_mon',
      pillar: 'Parental Wellbeing First',
      title: 'Why Your Sleep Matters as Much as Baby\'s',
      primarySegment: 'Working Mothers',
      description:
        'Reframe sleep as essential, not selfish. Show the neuroscience of parental sleep deprivation and why it matters for family health.',
      type: 'Reel',
      competitivePosition: 'ONLY HLS positions parental sleep as PRIMARY benefit',
      hooks: [
        {
          angle: 'Guilt-flip',
          text: 'The scariest thing I learned after Harvey was born? Your sleep deprivation affects your baby MORE than their sleep training ever will.',
          primarySegment: 'Working Mothers',
        },
        {
          angle: 'Data-driven',
          text: 'Sleep-deprived parents have 3x higher rates of postpartum anxiety. This isn\'t about being weak - it\'s neurobiology.',
          primarySegment: 'Postpartum Struggling',
        },
        {
          angle: 'Authenticity',
          text: 'Jess here. I couldn\'t solve my daughter\'s sleep until I fixed MY sleep first. Here\'s why that matters...',
          primarySegment: 'Solo/Single Parents',
        },
        {
          angle: 'Permission slip',
          text: 'You\'re allowed to prioritize your rest. Here\'s exactly why. (Spoiler: it\'s not selfish.)',
          primarySegment: 'Gentle/Attachment Parents',
        },
      ],
      cta: 'Save this. Share with a friend who needs to hear it.',
      newsletter: {
        subject: 'Sleep isn\'t selfish - it\'s essential (for your family)',
        angle: 'Validate + educate on why parental wellbeing is non-negotiable',
      },
    },

    {
      day: days[1],
      id: 'topic_002_tue',
      pillar: 'Communication Not Crying',
      title: 'What Your Baby\'s Cry Actually Means',
      primarySegment: 'New parents (Postpartum)',
      description:
        'Decode baby communication. What different cries mean and how to respond without guilt. Frame crying as data.',
      type: 'Carousel',
      competitivePosition: 'HLS focuses on communication/interpretation vs. generic "let them cry"',
      hooks: [
        {
          angle: 'Mystery solver',
          text: 'We used to think all baby cries were the same. Science says they\'re not. Here\'s what YOUR baby is actually telling you...',
          primarySegment: 'Postpartum Struggling',
        },
        {
          angle: 'Empowerment',
          text: 'Once you understand what your baby\'s cries mean, sleep training goes from scary to manageable.',
          primarySegment: 'Anxious parents',
        },
        {
          angle: 'Founder relatability',
          text: 'With Harvey, I couldn\'t tell the difference between "I\'m tired" and "I need you." This changed everything.',
          primarySegment: 'Working Mothers',
        },
      ],
      cta: 'Screenshot and save this for 3am when you\'re not sure what to do.',
      newsletter: {
        subject: 'Your baby\'s cries are language. Here\'s the translation guide.',
        angle: 'Educational + empowering (shift from fear to understanding)',
      },
    },

    {
      day: days[2],
      id: 'topic_003_wed',
      pillar: 'Responsive Not Rigid',
      title: 'Flexible Sleep Methods (Not One-Size-Fits-All)',
      primarySegment: 'Gentle/Attachment Parents',
      description:
        'Position Gentle Fade + Quick Reset as flexible options. Validate that different families need different approaches.',
      type: 'Static',
      competitivePosition: 'UNCLAIMED: Flexible methods + deep partner alignment content',
      hooks: [
        {
          angle: 'Values alignment',
          text: 'You don\'t have to choose between attachment and sleep. Here are two methods that honor both.',
          primarySegment: 'Gentle/Attachment Parents',
        },
        {
          angle: 'Flexibility messaging',
          text: 'Your family is unique. So should your sleep plan be. Here\'s how we customize both methods.',
          primarySegment: 'Shift Workers',
        },
        {
          angle: 'Comparison',
          text: 'Gentle Fade vs. Quick Reset: which one actually fits YOUR life? (Spoiler: it depends.)',
          primarySegment: 'Working Mothers',
        },
        {
          angle: 'Permission slip',
          text: 'Stop copying someone else\'s sleep plan. Build YOUR plan here.',
          primarySegment: 'Solo/Single Parents',
        },
        {
          angle: 'Partner unity',
          text: 'When you and your partner disagree on sleep: pick a method TOGETHER, then both commit.',
          primarySegment: 'Working Mothers',
        },
      ],
      cta: 'Which method feels right for your family? Comment below.',
      newsletter: {
        subject: 'Flexible Sleep Methods: It\'s Not One-Size-Fits-All',
        angle: 'Comparison + empowerment (you choose what works for YOUR values)',
      },
    },

    {
      day: days[3],
      id: 'topic_004_thu',
      pillar: 'Founder Authenticity',
      title: 'How We Handle Sleep Regressions (Real Stories)',
      primarySegment: 'Working Mothers',
      description:
        'Jade or Jess shares a real regression story. Normalizes regressions as progressions, not failures.',
      type: 'Reel',
      competitivePosition: 'HLS founder story + authenticity (competitors are clinical)',
      hooks: [
        {
          angle: 'Founder vulnerability',
          text: 'When Harvey hit the 18-month regression, I thought I\'d done everything wrong. Here\'s what actually happened...',
          primarySegment: 'Working Mothers',
        },
        {
          angle: 'Normalization',
          text: 'Sleep regressions aren\'t failures - they\'re progress markers. Your baby\'s brain is leveling up.',
          primarySegment: 'Anxious parents',
        },
        {
          angle: 'Practical + warm',
          text: 'Jess here. When my daughter regressed, I used THIS one thing. Changed everything.',
          primarySegment: 'Solo/Single Parents',
        },
      ],
      cta: 'Share your regression story - you\'re not alone.',
      newsletter: {
        subject: 'Sleep Regressions Are Progress (Here\'s Our Real Story)',
        angle: 'Normalize + empower + educate',
      },
    },

    {
      day: days[4],
      id: 'topic_005_fri',
      pillar: 'Parental Wellbeing First',
      title: 'Partner Alignment: How to Get Your Spouse on Board',
      primarySegment: 'Working Mothers',
      description:
        'Deep dive on partner communication. How to align on sleep without resentment. UNCLAIMED COMPETITIVE GAP.',
      type: 'Carousel',
      competitivePosition: 'ZERO competitors focus on partner alignment as deeply',
      hooks: [
        {
          angle: 'Real conflict',
          text: 'Your partner doesn\'t "get" sleep training. Here\'s how to get them on the same page. (Without the fight.)',
          primarySegment: 'Working Mothers',
        },
        {
          angle: 'Both perspectives',
          text: 'When one parent is the sleep expert and one isn\'t: here\'s how to bridge that gap.',
          primarySegment: 'Working Mothers',
        },
        {
          angle: 'Resentment prevention',
          text: 'The #1 reason couples fight about sleep isn\'t disagreement - it\'s unspoken expectations.',
          primarySegment: 'Postpartum Struggling',
        },
        {
          angle: 'Shift-worker specific',
          text: 'When your partner works nights and you\'re solo at bedtime: here\'s how to align anyway.',
          primarySegment: 'Shift Workers',
        },
      ],
      cta: 'Tag someone who needs this conversation.',
      newsletter: {
        subject: 'Partner Misalignment on Sleep? Here\'s How We Fixed It',
        angle: 'Practical communication tools + validation of the struggle',
      },
    },

    {
      day: days[5],
      id: 'topic_006_sat',
      pillar: 'Communication Not Crying',
      title: 'Regression Red Flags vs. Normal Variation',
      primarySegment: 'Postpartum Struggling',
      description:
        'How to tell the difference between normal sleep variation and actual regression. Reduces anxiety.',
      type: 'Static',
      competitivePosition: 'Detailed age-specific regression breakdowns (gap in market)',
      hooks: [
        {
          angle: 'Anxiety relief',
          text: 'Is it a regression or just a bad week? Here\'s exactly how to tell.',
          primarySegment: 'Anxious parents',
        },
        {
          angle: 'Pattern recognition',
          text: 'Sleep regressions follow developmental patterns. Once you know the pattern, you stop panicking.',
          primarySegment: 'Postpartum Struggling',
        },
        {
          angle: 'Data-driven',
          text: 'Here\'s what developmental researchers know about regressions (and what parents usually miss).',
          primarySegment: 'Education-hungry parents',
        },
      ],
      cta: 'Save this for your baby\'s next regression. You\'ll feel SO much calmer.',
      newsletter: {
        subject: 'Is It a Regression? Here\'s How to Tell (+ What to Do)',
        angle: 'Educational + reassuring (reduce anxiety)',
      },
    },

    {
      day: days[6],
      id: 'topic_007_sun',
      pillar: 'Responsive Not Rigid',
      title: 'Quick Reset Method for Disrupted Sleep',
      primarySegment: 'Shift Workers',
      description:
        'How to recover sleep after disruptions (travel, illness, schedule changes). Flexibility in action.',
      type: 'Reel',
      competitivePosition: 'Fast recovery methods for real-life families (not ivory tower advice)',
      hooks: [
        {
          angle: 'Real disruption',
          text: 'Your routine got blown up. Holiday? Travel? Illness? Here\'s how to get back on track in 3-7 days.',
          primarySegment: 'Shift Workers',
        },
        {
          angle: 'Quick wins',
          text: 'You don\'t need to start over. Quick Reset is 3 tools that work FAST.',
          primarySegment: 'Working Mothers',
        },
        {
          angle: 'Flexibility',
          text: 'Real families have disruptions. Here\'s how we handle them without guilt.',
          primarySegment: 'Solo/Single Parents',
        },
        {
          angle: 'Permission',
          text: 'Things fell apart. That doesn\'t mean you failed. This is how we rebuild.',
          primarySegment: 'Anxious parents',
        },
      ],
      cta: 'Share this with someone juggling multiple schedules.',
      newsletter: {
        subject: 'Sleep Disruption? Quick Reset Protocol Inside',
        angle: 'Practical tools + validation of real-life chaos',
      },
    },
  ];

  return topics;
}

/**
 * Generate segment-specific variations of the same topic
 * Example: "Partner Alignment" can be written for Working Moms, Solo Parents, Shift Workers differently
 */
export function generateSegmentVariations(baseTopic: ProactiveContentTopic): Map<string, string> {
  const variations = new Map<string, string>();

  for (const segment of CUSTOMER_SEGMENTS) {
    const relevantHooks = baseTopic.hooks.filter((h) => h.primarySegment === segment.name);
    const bestHook = relevantHooks.length > 0 ? relevantHooks[0] : baseTopic.hooks[0];

    const variation = `${baseTopic.title}
    
${segment.messageAngle}

Hook: ${bestHook.text}

This variation speaks directly to the pain point: ${segment.painPoints.join(', ')}`;

    variations.set(segment.name, variation);
  }

  return variations;
}

/**
 * Content Calendar Integration
 * Map topics to strategic dates for maximum relevance
 */
export const STRATEGIC_CALENDAR_DATES = {
  'Daylight Saving Time Spring': 'September 25-30', // AU spring DST
  'Daylight Saving Time Fall': 'April 1-5', // AU autumn DST
  'Back to School': 'Late January',
  'Holiday Disruption Content': 'December 15 - January 15',
  'New Year Reset': 'January 1-15',
  'Postpartum Peak': 'Year-round (seasonal theme)',
  'Summer Holidays': 'July 1-31',
  'Christmas Chaos': 'December',
};

/**
 * Export all strategy data for dashboard/logging
 */
export function getFullStrategyFramework() {
  return {
    pillars: HLS_BRAND_PILLARS,
    segments: CUSTOMER_SEGMENTS,
    competitorGaps: COMPETITOR_GAPS,
    weeklyTopics: generateProactiveWeeklyTopics(),
  };
}
