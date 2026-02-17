# Nurture Sequence Specification

## Overview
Automated email sequence for new Hello Little Sleepers subscribers. Converts free subscribers to paid guide customers through trust-building, value delivery, and strategic pitch.

**Expected Flow**: Welcome → Value → Problem/Solution → Soft Pitch → Remove Objections → CTA

---

## Sequence Design

### Email 1: Welcome + Brand Story (Send immediately)
**Timing**: On signup  
**Subject**: Welcome to Hello Little Sleepers ✨  
**Purpose**: Build connection, set expectations, establish Jade's credibility

**Copy Template**:
```
Hi {First Name},

Welcome to Hello Little Sleepers. I'm so glad you're here.

I'm Jade, and my journey into sleep support started in the most honest place: sheer desperation. When Harvey was born, everything felt overwhelming—sleep deprivation, guilt, conflicting advice, fear-based rhetoric online. I found myself searching for someone who just... got it. Someone who could explain WHY sleep matters without using shame or punishment.

I didn't find that person, so I became one.

After years of working with families, studying infant sleep science, and learning what actually works with gentle, emotional connection, I created Hello Little Sleepers. Because every family deserves clarity without fear.

What you'll get from us:
• Research-backed guidance (not dogma)
• Real strategies that respect your family's values
• Email support—we're here when you need us
• Content that actually applies to YOUR child's age

Over the next week, I'm sending you some free resources to get you started. I hope they help.

You've got this.

Warmly,
Jade
```

**Click tracking**: Link to favorite piece of free content on website

---

### Email 2: Free Value + Sample Content (Send Day 2)
**Timing**: 2 days after signup  
**Subject**: Sleep needs by age (free guide inside)  
**Purpose**: Deliver immediate value, establish expertise, build trust

**Copy Template**:
```
Hi {First Name},

This one's a freebie—no purchase needed.

One of the most common questions I get is: "How much sleep does my {Age} month old actually need?" Parents are often shocked by the answer. (Spoiler: it's usually more than they think.)

Here's what I've learned: when you understand your baby's biological sleep needs, everything clicks. The schedule makes sense. The rough nights feel more normal. You stop blaming yourself.

Download the free guide below. It breaks down:
• Age-by-age sleep requirements (newborn to 3 years)
• Why wake windows matter
• Red flags that something's off

→ [Download: Sleep Needs by Age Guide]

Quick question: How old is your little one right now? Reply to this email and let me know—I'll send you age-specific content next.

Talk soon,
Jade
```

**Click tracking**: Guide download, reply tracking

---

### Email 3: Problem/Solution (Send Day 5)
**Timing**: 5 days after signup  
**Subject**: Why your sleep routine isn't working (and how to fix it)  
**Purpose**: Identify pain point, position guides as solution

**Copy Template**:
```
Hi {First Name},

I want to talk about something you're probably experiencing right now: a sleep routine that feels like you're *supposed* to have it figured out, but you don't.

You've tried:
• The rigid schedule (felt too strict)
• The no-schedule approach (felt too chaotic)
• The app that tells you when baby should sleep (but YOUR baby disagrees)
• Advice from well-meaning family (that felt judgmental)

Here's what I see most: Parents have the pieces, but not the blueprint.

You know sleep matters. You know your baby's personality. You have *instincts*. But connecting those dots? That's where it falls apart.

That's why I built the guides.

Each guide walks you through:
1. **Understanding** — Why your child sleeps the way they do
2. **Planning** — Creating a rhythm that fits YOUR family
3. **Adjusting** — What to do when things change (and they will)

No judgment. No fear. Just clarity.

The 5-18 Month Guide is our most popular—parents say it's like having a sleep consultant in their pocket.

Interested in seeing what's inside?

→ [Learn about the 5-18 Month Guide]

Jade
```

**Click tracking**: Guide landing page view

---

### Email 4: Soft Pitch + Social Proof (Send Day 8)
**Timing**: 8 days after signup  
**Subject**: Parents are saying the guides changed everything  
**Purpose**: Introduce product offer, build confidence with testimonials

**Copy Template**:
```
Hi {First Name},

I want to share something people are telling us.

Last month, a mum said: "I feel like I finally understand my baby. The guide made everything make sense."

A dad told me: "We went from waking up 8 times a night to 2. Not because of some magic trick—because we finally understood what was actually happening."

Another parent: "This is the most compassionate sleep resource I've found. It respects that I love my child *and* need sleep."

These aren't paid testimonials. They're real people who got clarity from our guides.

**Here's what you're getting:**

**The 5-18 Month Sleep Guide** ($37)
• Age-specific sleep science
• Week-by-week implementation
• Troubleshooting for common challenges
• Email support from me

OR start with something smaller:

**Quick Start Bundle** ($19)
• Sleep needs by age
• Wake window guide
• 3-day introduction plan

→ [See What's Inside]

You don't have to decide today. But when you're ready, we're here.

The guides work because they respect your values and your family's needs. No fear. No judgment.

Just clarity.

Jade
```

**Click tracking**: Product page views, add-to-cart, pricing page

---

### Email 5: Remove Objections + Final CTA (Send Day 12)
**Timing**: 12 days after signup  
**Subject**: Your questions about the guides (answered)  
**Purpose**: Address objections, drive conversion, offer support

**Copy Template**:
```
Hi {First Name},

Before you grab a guide, I want to answer the questions I hear most:

**"Will this work for MY child?"**
Every child is different—that's the whole point. The guides are frameworks, not scripts. You adapt them to your baby, your values, your family. We're not trying to make robots. We're trying to help you understand.

**"What if I buy it and hate it?"**
30-day money-back guarantee. No questions asked. But that almost never happens—people usually message me excited, not asking for refunds.

**"Is this judgment-free?"**
Yes. We use zero fear-based language. No "cry it out" unless that's your choice. No shame about feeding, contact naps, or cosleeping. We meet families where they are.

**"What if I have questions?"**
Email support is included. You can reach out anytime.

**"Can I implement this right away?"**
Most people start within 2-3 days of purchasing. The guides are written to be put into action immediately.

Still not sure? That's okay.

Here's what I'd suggest: Download the free resources we sent earlier. See if you vibe with how we explain things. If you do, the guides expand on that foundation.

If you have questions before buying, reply to this email. I read every one.

Ready? Grab the guide that fits your child's age:

→ [Buy the 5-18 Month Guide ($37)]
→ [Get the Quick Start Bundle ($19)]
→ [See All Guides]

You've got this. Your instincts are good—you just needed a clearer picture. That's what we're here for.

Jade

P.S. — New guides launch every month. If you grab one now, you'll get exclusive early access to upcoming age ranges.
```

**Click tracking**: Product page, purchase conversion, reply engagement

---

## Implementation Guide (GHL Setup)

### Step 1: Create the Workflow
1. Go to **GHL Dashboard** → **Automations** → **Create New Workflow**
2. Name it: `Hello Little Sleepers - New Subscriber Nurture`
3. Set trigger: **Tag Applied** → select/create tag "New Subscriber"

### Step 2: Add Emails in Sequence
For each email above:
1. **Step** → **Send Email**
2. Paste copy from template into email body
3. Set delay:
   - Email 1: 0 hours (immediate)
   - Email 2: 48 hours
   - Email 3: 120 hours (5 days)
   - Email 4: 192 hours (8 days)
   - Email 5: 288 hours (12 days)

### Step 3: Add Segmentation
After Email 2, add a **Branch** for engagement:
- **If contact opens Email 2**: Continue sequence
- **If contact does NOT open Email 2 in 24h**: Send reminder version (simplified copy)
- **If contact clicks product link**: Jump to Email 4 (skip Email 3)

### Step 4: Track Conversions
Add final step: **Tag Applied** on purchase
- Condition: **Contact Status** = "Customer"
- Action: Apply tag `Converted from Nurture Sequence`

### Step 5: Monitor & Optimize
In GHL Reports:
- Track **Email Open Rate** (target: 40%+)
- Track **Click-Through Rate** (target: 15%+)
- Track **Conversion Rate** (target: 5%+)

---

## Metrics to Watch

| Metric | Target | Why it matters |
|--------|--------|---|
| Open Rate | 40%+ | Subjects resonating with audience |
| Click-Through | 15%+ | Copy driving action |
| Conversion Rate | 5%+ | Nurture quality |
| Time to Purchase | 7-14 days avg | Sequence timing effectiveness |
| Unsubscribe Rate | <2% | Copy respect boundaries |
| Reply Rate | 5%+ | Audience engagement |

---

## A/B Testing Ideas (Phase 2)

1. **Subject Line Tests**
   - Emotional vs. practical subject lines
   - First name inclusion
   - Question vs. statement format

2. **Copy Tone Tests**
   - Story-focused vs. benefit-focused
   - Personal vs. professional
   - Long-form vs. concise

3. **Timing Tests**
   - 2-day delay vs. 3-day
   - 8-day Email 4 vs. 6-day
   - Weekday sends vs. weekend

---

## Implementation Checklist

- [ ] All 5 emails written and approved
- [ ] GHL workflow created
- [ ] Tags created: "New Subscriber", "Converted from Nurture Sequence"
- [ ] Links added to each email (product pages, guides, support)
- [ ] Unsubscribe footer added to all emails
- [ ] Test email sent (to yourself) and reviewed
- [ ] Workflow published
- [ ] Reports dashboard set up in GHL
- [ ] Reminder to check conversion metrics on Day 15

---

## Notes for Jade

This sequence is designed for YOUR voice and YOUR brand values. Every email assumes the reader is intelligent, needs grace, and wants clarity—not judgment. 

The timing spreads over 12 days to avoid overwhelming new subscribers while keeping momentum. But you can adjust:
- Want it faster? Shift emails to Day 1, 3, 5, 7, 10
- Want it slower? Spread to Days 2, 5, 8, 12, 15

The social proof in Email 4 should be real testimonials from actual customers. I've included template language, but swap in actual quotes when available.

Open rates and click-through rates will tell you what's working. If Email 2 doesn't get clicks, we know the topic/positioning needs adjustment.

Let me know how the first 100 subscribers respond. We'll optimize from there.

—Felicia
