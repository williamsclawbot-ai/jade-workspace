# HLS GHL Automation Setup Guide
**Date:** 2026-02-21  
**Version:** 1.0  
**Status:** Ready to Execute

---

## Overview

This document provides step-by-step instructions for setting up the complete HLS email automation in GoHighLevel (GHL), including triggers, workflows, conditions, tagging, and tracking.

---

## Automation Architecture

### Overview: 3 Main Workflows

```
WORKFLOW 1: Stage 1 - Free Lead Nurture (Days 0-7)
    ↓
WORKFLOW 2: Stage 2 - Engaged Sequence (Weeks 2-4)
    ↓
WORKFLOW 3: Stage 3 - Decision Sequence (Conversion)
```

**Additional Workflows:**
- Re-Engagement Campaign (Low Engagement Recovery)
- Quarterly Nurture (Long-Term Inactive)
- Customer Onboarding (Post-Purchase)

---

## Workflow 1: Stage 1 - Free Lead Nurture

### Trigger: Lead Downloads Free Guide

**Trigger Setup in GHL:**
1. Go to **Automation > Workflows > Create Workflow**
2. Name: `HLS - Stage 1 - Free Lead Nurture`
3. Trigger Type: **Form Submission** OR **Tag Applied**
   - Option A: Form "Free Guide Download" submitted
   - Option B: Tag "Free-Lead-Day0" applied
4. Trigger Timing: **Immediate**

---

### Workflow Steps (Days 0-7)

```
START: Lead Downloads Free Guide
    ↓
[DAY 0] Apply Tag: "Free-Lead-Day0"
    ↓
[DAY 0 - Immediate] Send Email 1: "Welcome to the sleep conversation"
    ↓
[Wait 2 Days]
    ↓
[DAY 2] Send Email 2: "What your baby's cry actually means"
    ↓
[Wait 2 Days]
    ↓
[DAY 4] Send Email 3: "Quick reset method (when nothing else works)"
    ↓
[Wait 2 Days]
    ↓
[DAY 6] Send Email 4: "Why YOUR sleep matters as much as baby's"
    ↓
[Wait 1 Day]
    ↓
[DAY 7] Send Email 5: "[Free guide recap] Next step: Sleep audit"
    ↓
[Wait 1 Hour]
    ↓
[DAY 7] DECISION POINT: Check Engagement
    ├─→ High Engagement (3+ opens, 1+ click) → Move to Workflow 2
    ├─→ Low Engagement (<2 opens, 0 clicks) → Move to Re-Engagement Workflow
    └─→ Purchased → Move to Customer Onboarding
```

---

### Email 1: Welcome to the sleep conversation

**GHL Setup:**
1. **Action:** Send Email
2. **Email Template:** `Stage1-Email1-Welcome`
3. **Subject Line:** "Welcome to Healthy Little Sleepers"
   - A/B Test: Enable (3 variations)
   - Variation A: "Welcome to Healthy Little Sleepers"
   - Variation B: "You're not broken (and neither is your baby)"
   - Variation C: "Let's talk about sleep (the real way)"
4. **Send Time:** Immediate (upon form submission)
5. **Sender:** Jade (jade@healthylittlesleepers.com)
6. **Preview Text:** "Thank you for downloading the guide. Here's what's next."

**Tracking Setup:**
- **Email Link Tracking:** Enable
- **Tag on Open:** `Opened-Email1`
- **Tag on Click:** `Clicked-Email1`

**Conditional Logic:**
- None (all leads get Email 1)

---

### Email 2: What your baby's cry actually means

**GHL Setup:**
1. **Wait Action:** Wait 2 Days (48 hours from Email 1 send)
2. **Action:** Send Email
3. **Email Template:** `Stage1-Email2-Baby-Cues`
4. **Subject Line:** "What your baby is really telling you"
   - A/B Test: Enable
   - Variation A: "What your baby is really telling you"
   - Variation B: "This is what your baby's cry actually means"
   - Variation C: "You're not imagining it (your baby IS communicating)"
5. **Send Time:** 9:00 AM (contact's timezone if available)
6. **Sender:** Jade

**Tracking Setup:**
- **Tag on Open:** `Opened-Email2`
- **Tag on Click:** `Clicked-Email2`

**Conditional Logic:**
- **Condition:** Has NOT unsubscribed
- **Condition:** Has NOT purchased

---

### Email 3: Quick reset method (when nothing else works)

**GHL Setup:**
1. **Wait Action:** Wait 2 Days (48 hours from Email 2 send)
2. **Action:** Send Email
3. **Email Template:** `Stage1-Email3-Quick-Reset`
4. **Subject Line:** "Quick reset method (for when nothing else works)"
   - A/B Test: Enable
   - Variation A: "Quick reset method (for when nothing else works)"
   - Variation B: "The one method that saved me at 3am"
   - Variation C: "What to do when nothing else works"
5. **Send Time:** 7:00 AM (parent's morning, before chaos)
6. **Sender:** Jade

**Tracking Setup:**
- **Tag on Open:** `Opened-Email3`
- **Tag on Click:** `Clicked-Email3`, `Engaged-Email3`

**Conditional Logic:**
- **Condition:** Has NOT unsubscribed
- **Condition:** Has NOT purchased

**Special Note:** This email has highest utility; expect highest click rate.

---

### Email 4: Why YOUR sleep matters as much as baby's

**GHL Setup:**
1. **Wait Action:** Wait 2 Days (48 hours from Email 3 send)
2. **Action:** Send Email
3. **Email Template:** `Stage1-Email4-Parental-Wellbeing`
4. **Subject Line:** "Why your sleep matters too"
   - A/B Test: Enable
   - Variation A: "Why your sleep matters too"
   - Variation B: "Sleep-deprived parents can't be present parents"
   - Variation C: "You can't pour from an empty cup"
5. **Send Time:** 8:00 PM (parent's wind-down time)
6. **Sender:** Jade

**Tracking Setup:**
- **Tag on Open:** `Opened-Email4`
- **Tag on Click:** `Clicked-Email4`, `High-Engagement`

**Conditional Logic:**
- **Condition:** Has NOT unsubscribed
- **Condition:** Has NOT purchased

---

### Email 5: [Free guide recap] Next step: Sleep audit

**GHL Setup:**
1. **Wait Action:** Wait 1 Day (24 hours from Email 4 send)
2. **Action:** Send Email
3. **Email Template:** `Stage1-Email5-Next-Step`
4. **Subject Line:** "What's next for your family's sleep"
   - A/B Test: Enable
   - Variation A: "What's next for your family's sleep"
   - Variation B: "Ready for the next step?"
   - Variation C: "Your sleep audit is waiting"
5. **Send Time:** 10:00 AM (decision-making time)
6. **Sender:** Jade

**Tracking Setup:**
- **Tag on Open:** `Opened-Email5`
- **Tag on Click:** `Clicked-Email5`, `Ready-Engaged-Sequence`

**Conditional Logic:**
- **Condition:** Has NOT unsubscribed
- **Condition:** Has NOT purchased

---

### Decision Point: Stage 1 → Stage 2

**GHL Setup:**
1. **Wait Action:** Wait 1 Hour (after Email 5 send)
2. **Action:** If/Else Condition
3. **Condition Branch Setup:**

#### **Branch A: High Engagement → Move to Stage 2**

**Condition:**
- Has tag `Opened-Email1` OR `Opened-Email2` OR `Opened-Email3` (3+ opens)
- AND
- Has tag `Clicked-Email3` OR `Clicked-Email4` OR `Clicked-Email5` (1+ click)

**Actions:**
- Apply Tag: `Stage2-Engaged`
- Remove Tag: `Stage1-In-Progress`
- Add to Workflow: `HLS - Stage 2 - Engaged Sequence`
- Send Internal Notification: "Contact [Name] progressed to Stage 2"

#### **Branch B: Low Engagement → Re-Engagement**

**Condition:**
- Does NOT have 3+ "Opened" tags
- OR
- Has 0 "Clicked" tags

**Actions:**
- Apply Tag: `Stage1-Low-Engagement`
- Wait 7 Days
- Add to Workflow: `HLS - Re-Engagement Campaign`

#### **Branch C: Purchased → Customer Onboarding**

**Condition:**
- Has tag `Customer-Paid-[Product]` (any product)

**Actions:**
- Remove from Workflow: `HLS - Stage 1`
- Apply Tag: `Customer-Active`
- Add to Workflow: `HLS - Customer Onboarding`

---

## Workflow 2: Stage 2 - Engaged Sequence

### Trigger: High Engagement in Stage 1

**Trigger Setup in GHL:**
1. **Automation > Workflows > Create Workflow**
2. Name: `HLS - Stage 2 - Engaged Sequence`
3. Trigger Type: **Tag Applied**
   - Tag: `Stage2-Engaged`
4. Trigger Timing: **Immediate**

---

### Workflow Steps (Weeks 2-4)

```
START: Tag "Stage2-Engaged" Applied
    ↓
[DAY 14] Send Email 1: "Flexible sleep methods (not rigid)"
    ↓
[Wait 7 Days]
    ↓
[DAY 21] Send Email 2: "Partner alignment: Getting spouse on board"
    ↓
[Wait 3 Days]
    ↓
[DAY 24] Send Email 3: "Real story: How we handle regression"
    ↓
[Wait 4 Days]
    ↓
[DAY 28] Send Email 4: "[Age-specific] What to expect next"
    ↓
[Wait 1 Hour]
    ↓
[DAY 28] AGE SEGMENTATION: Apply age-based tags
    ↓
[DAY 28] DECISION POINT: Check Engagement
    ├─→ High Engagement (4 opens, 2+ clicks) → Move to Workflow 3
    ├─→ Engaged Not Ready (2-3 opens, 1 click) → Extended Nurture
    └─→ Low Engagement (<2 opens) → Quarterly Nurture
```

---

### Email 1: Flexible sleep methods (not rigid)

**GHL Setup:**
1. **Action:** Send Email
2. **Email Template:** `Stage2-Email1-Flexible-Methods`
3. **Subject Line:** "Why rigid sleep methods don't work (and what does)"
4. **Send Time:** 9:00 AM (Day 14 from Stage 1 start)
5. **Sender:** Jade

**Tracking Setup:**
- **Tag on Open:** `Opened-Stage2-Email1`, `Differentiation-Aware`
- **Tag on Click:** `Clicked-Stage2-Email1`

---

### Email 2: Partner alignment: Getting spouse on board

**GHL Setup:**
1. **Wait Action:** Wait 7 Days
2. **Action:** Send Email
3. **Email Template:** `Stage2-Email2-Partner-Alignment`
4. **Subject Line:** "When your partner doesn't get it"
   - A/B Test: Enable
   - Variation A: "When your partner doesn't get it"
   - Variation B: "How to get your spouse on board with sleep training"
   - Variation C: "The conversation you need to have with your partner"
5. **Send Time:** 8:00 PM (couple's evening time)
6. **Sender:** Jade

**Tracking Setup:**
- **Tag on Open:** `Opened-Stage2-Email2`
- **Tag on Click:** `Clicked-Stage2-Email2`, `Partner-Focused`

**Special Note:** UNIQUE to HLS; track click rate closely (differentiator metric).

---

### Email 3: Real story: How we handle regression

**GHL Setup:**
1. **Wait Action:** Wait 3 Days
2. **Action:** Send Email
3. **Email Template:** `Stage2-Email3-Vulnerability-Story`
4. **Subject Line:** "I'll never forget the night I let my son cry for 20 minutes"
5. **Send Time:** 8:00 PM (evening, reflective time)
6. **Sender:** Jade

**Tracking Setup:**
- **Tag on Open:** `Opened-Stage2-Email3`, `High-Trust`
- **Tag on Click:** `Clicked-Stage2-Email3`

---

### Email 4: [Age-specific] What to expect next

**GHL Setup:**
1. **Wait Action:** Wait 4 Days
2. **Action:** If/Else Condition (Age Segmentation)
3. **Branch Setup:**

#### **Branch A: 0-6 Months**
- **Condition:** Contact custom field `child_age` = 0-6 months OR has tag `Age-0-6mo`
- **Email Template:** `Stage2-Email4-Newborn`
- **Subject Line:** "What's coming next for your newborn's sleep"
- **Tag on Open:** `Age-Segmented-0-6mo`

#### **Branch B: 6-12 Months**
- **Condition:** Contact custom field `child_age` = 6-12 months OR has tag `Age-6-12mo`
- **Email Template:** `Stage2-Email4-6-12mo`
- **Subject Line:** "8-month sleep resistance: What to expect"
- **Tag on Open:** `Age-Segmented-6-12mo`

#### **Branch C: 12-24 Months**
- **Condition:** Contact custom field `child_age` = 12-24 months OR has tag `Age-12-24mo`
- **Email Template:** `Stage2-Email4-Toddler`
- **Subject Line:** "Toddler sleep: What's normal (and what's not)"
- **Tag on Open:** `Age-Segmented-12-24mo`

#### **Branch D: 2+ Years**
- **Condition:** Contact custom field `child_age` = 2+ years OR has tag `Age-2plus`
- **Email Template:** `Stage2-Email4-2yr-Plus`
- **Subject Line:** "Bedtime battles: The toddler edition"
- **Tag on Open:** `Age-Segmented-2plus`

**Tracking Setup (All Branches):**
- **Tag on Click:** `Clicked-Stage2-Email4`, `Age-Specific-Interested`

---

### Decision Point: Stage 2 → Stage 3

**GHL Setup:**
1. **Wait Action:** Wait 1 Hour (after Email 4 send)
2. **Action:** If/Else Condition

#### **Branch A: High Engagement → Move to Stage 3**

**Condition:**
- Has 4 "Opened-Stage2" tags (opened all 4 emails)
- AND
- Has 2+ "Clicked-Stage2" tags (clicked 2+ links)

**Actions:**
- Apply Tag: `Stage3-Decision`
- Remove Tag: `Stage2-Engaged`
- Add to Workflow: `HLS - Stage 3 - Decision Sequence`

#### **Branch B: Engaged Not Ready → Extended Nurture**

**Condition:**
- Has 2-3 "Opened-Stage2" tags
- AND
- Has 1 "Clicked-Stage2" tag

**Actions:**
- Apply Tag: `Stage2-Extended-Nurture`
- Wait 7 Days
- Send Email: `Stage2-Extended-Value` (case study or new research)
- Wait 14 Days
- Re-check engagement (if still low → Quarterly Nurture)

#### **Branch C: Low Engagement → Quarterly Nurture**

**Condition:**
- Has <2 "Opened-Stage2" tags

**Actions:**
- Apply Tag: `Nurture-Quarterly`
- Remove from Workflow: `HLS - Stage 2`
- Add to Workflow: `HLS - Quarterly Nurture`

---

## Workflow 3: Stage 3 - Decision Sequence

### Trigger: High Engagement in Stage 2

**Trigger Setup in GHL:**
1. **Automation > Workflows > Create Workflow**
2. Name: `HLS - Stage 3 - Decision Sequence`
3. Trigger Type: **Tag Applied**
   - Tag: `Stage3-Decision`
4. Trigger Timing: **Immediate**

---

### Workflow Steps (Conversion)

```
START: Tag "Stage3-Decision" Applied
    ↓
[DAY 0 - Immediate] Send Email 1: "Your personalized sleep plan awaits"
    ↓
[Wait 3 Days]
    ↓
[DAY 3] Send Email 2: "[Social proof] What other parents discovered"
    ↓
[Wait 3 Days]
    ↓
[DAY 6] Send Email 3: "Limited: Guide bundle offer"
    ↓
[Wait 1 Hour]
    ↓
[DAY 6] CONVERSION CHECK:
    ├─→ Purchased → Customer Onboarding
    ├─→ Booked Call → Sales Follow-Up
    └─→ No Action → Long-Term Nurture (Wait 30 Days)
```

---

### Email 1: Your personalized sleep plan awaits

**GHL Setup:**
1. **Action:** Send Email (Immediate upon trigger)
2. **Email Template:** `Stage3-Email1-Personalized-Plan`
3. **Subject Line:** "Your personalized sleep plan is ready"
   - A/B Test: Enable
   - Variation A: "Your personalized sleep plan is ready"
   - Variation B: "You're ready for this next step"
   - Variation C: "Let's create your sleep plan together"
4. **Send Time:** 9:00 AM (decision-making time)
5. **Sender:** Jade

**Tracking Setup:**
- **Tag on Open:** `Opened-Stage3-Email1`, `Decision-Sequence-Started`
- **Tag on Click:** `Clicked-Stage3-Email1`

**CTA Tracking:**
- Link to product page: `?utm_campaign=stage3&utm_content=email1`

---

### Email 2: [Social proof] What other parents discovered

**GHL Setup:**
1. **Wait Action:** Wait 3 Days
2. **Action:** Send Email
3. **Email Template:** `Stage3-Email2-Social-Proof`
4. **Subject Line:** "What other parents discovered (and you can too)"
5. **Send Time:** 10:00 AM
6. **Sender:** Jade

**Tracking Setup:**
- **Tag on Open:** `Opened-Stage3-Email2`
- **Tag on Click:** `Clicked-Stage3-Email2`, `Social-Proof-Viewed`

**Conditional Logic:**
- **Condition:** Has NOT purchased (if purchased, remove from workflow)

---

### Email 3: Limited: Guide bundle offer

**GHL Setup:**
1. **Wait Action:** Wait 3 Days
2. **Action:** Send Email
3. **Email Template:** `Stage3-Email3-Bundle-Offer`
4. **Subject Line:** "48 hours left: Bundle offer expires soon"
   - A/B Test: Enable
   - Variation A: "48 hours left: Bundle offer expires soon"
   - Variation B: "Last chance: $20 off expires tonight"
   - Variation C: "This offer ends in 48 hours"
5. **Send Time:** 9:00 AM (urgency + decision-making time)
6. **Sender:** Jade

**Tracking Setup:**
- **Tag on Open:** `Opened-Stage3-Email3`
- **Tag on Click:** `Clicked-Stage3-Email3`, `Offer-Sent`

**Conditional Logic:**
- **Condition:** Has NOT purchased

---

### Conversion Check: Post-Email 3

**GHL Setup:**
1. **Wait Action:** Wait 1 Hour (after Email 3 send)
2. **Action:** If/Else Condition

#### **Branch A: Purchased → Customer Onboarding**

**Condition:**
- Has tag `Customer-Paid-[Product]` (purchase detected via Stripe/payment integration)

**Actions:**
- Remove from Workflow: `HLS - Stage 3`
- Apply Tag: `Customer-Active`
- Add to Workflow: `HLS - Customer Onboarding`
- Send Internal Notification: "Contact [Name] purchased [Product]"

#### **Branch B: Booked Call → Sales Follow-Up**

**Condition:**
- Has tag `Consult-Booked` (booking detected via calendar integration)

**Actions:**
- Apply Tag: `Consult-Scheduled`
- Add to Workflow: `HLS - Post-Consult Follow-Up`
- Send Internal Notification: "Contact [Name] booked consult"

#### **Branch C: No Action → Long-Term Nurture**

**Condition:**
- Has NOT purchased
- Has NOT booked call

**Actions:**
- Apply Tag: `Decision-No-Purchase`
- Wait 30 Days
- Add to Workflow: `HLS - Quarterly Nurture`

---

## Tagging Strategy (Complete List)

### Lead Stage Tags
| Tag | When Applied | Purpose |
|-----|--------------|---------|
| `Free-Lead-Day0` | Form submission | Initial lead capture |
| `Stage1-In-Progress` | Day 0 | Tracking Stage 1 progression |
| `Stage2-Engaged` | Day 7 (if high engagement) | Moved to Stage 2 |
| `Stage3-Decision` | Day 28 (if ready to buy) | Moved to Stage 3 |
| `Customer-Paid-[Product]` | Purchase detected | Customer conversion |
| `Nurture-Quarterly` | Low engagement | Long-term inactive |

### Engagement Tags
| Tag | When Applied | Purpose |
|-----|--------------|---------|
| `Opened-Email[X]` | Email opened | Track open behavior |
| `Clicked-Email[X]` | Link clicked | Track click behavior |
| `High-Engagement` | 3+ opens in Stage 1 | Flag high-intent leads |
| `High-Trust` | Opened vulnerability email | Deep engagement signal |
| `Partner-Focused` | Clicked partner alignment email | Unique differentiator interest |

### Age Segmentation Tags
| Tag | When Applied | Purpose |
|-----|--------------|---------|
| `Age-0-6mo` | Email 4 segmentation | Newborn-specific content |
| `Age-6-12mo` | Email 4 segmentation | 6-12mo specific content |
| `Age-12-24mo` | Email 4 segmentation | Toddler-specific content |
| `Age-2plus` | Email 4 segmentation | 2+ year specific content |

### Conversion Tags
| Tag | When Applied | Purpose |
|-----|--------------|---------|
| `Decision-Sequence-Started` | Stage 3 Email 1 sent | Track conversion journey |
| `Social-Proof-Viewed` | Clicked Email 2 testimonials | Interest signal |
| `Offer-Sent` | Email 3 sent | Final offer presented |
| `Consult-Booked` | Calendar booking | Alternative conversion |
| `Decision-No-Purchase` | End of Stage 3, no conversion | Re-targeting segment |

---

## Integration Setup

### Stripe Integration (Payment Tracking)

**Setup:**
1. **Integrations > Stripe > Connect Account**
2. **Automation Trigger:** Payment Received
3. **Actions:**
   - Apply Tag: `Customer-Paid-[Product Name]`
   - Remove from: All nurture workflows
   - Add to: Customer Onboarding workflow
   - Send Email: Purchase confirmation + onboarding

**Products to Track:**
- Newborn Sleep Guide ($27)
- 5-18 Month Sleep Guide ($37)
- Toddler Sleep Guide ($37)
- Bundle Offer ($47)
- Consultation ($150+)

---

### Calendar Integration (Booking Tracking)

**Setup:**
1. **Integrations > Calendar > Connect Google/Outlook**
2. **Automation Trigger:** Event Booked
3. **Actions:**
   - Apply Tag: `Consult-Booked`
   - Remove from: Decision Sequence workflow
   - Add to: Post-Consult Follow-Up workflow
   - Send Email: Booking confirmation + prep instructions

---

### Form Integration (Lead Capture)

**Setup:**
1. **Forms > Free Guide Download Form**
2. **Form Submission Actions:**
   - Apply Tag: `Free-Lead-Day0`
   - Add to Workflow: `HLS - Stage 1 - Free Lead Nurture`
   - Send Email: Guide delivery + welcome

---

## Tracking & Metrics Setup

### GHL Dashboard Setup

**Create Custom Dashboard: "HLS Email Performance"**

**Metrics to Track:**

#### Stage 1 Metrics
- **Leads Entered:** Count of `Free-Lead-Day0` tags applied
- **Email 1 Open Rate:** (Opened-Email1 / Total Sent)
- **Email 3 Click Rate:** (Clicked-Email3 / Opened-Email3)
- **Progression to Stage 2:** Count of `Stage2-Engaged` tags applied
- **Conversion Rate (Stage 1 → 2):** (Stage2-Engaged / Free-Lead-Day0)

#### Stage 2 Metrics
- **Leads Entered:** Count of `Stage2-Engaged` tags applied
- **Partner Email Click Rate:** (Clicked-Stage2-Email2 / Opened-Stage2-Email2)
- **Progression to Stage 3:** Count of `Stage3-Decision` tags applied
- **Conversion Rate (Stage 2 → 3):** (Stage3-Decision / Stage2-Engaged)

#### Stage 3 Metrics
- **Leads Entered:** Count of `Stage3-Decision` tags applied
- **Email 1 Click Rate:** (Clicked-Stage3-Email1 / Opened-Stage3-Email1)
- **Purchases:** Count of `Customer-Paid-*` tags applied
- **Consults Booked:** Count of `Consult-Booked` tags applied
- **Conversion Rate (Stage 3 → Customer):** (Purchases + Consults / Stage3-Decision)

#### Overall Funnel
- **Overall Conversion Rate:** (Customers / Free Leads) %
- **Revenue Per Lead:** (Total Revenue / Free Leads)
- **Average Time to Purchase:** Days from `Free-Lead-Day0` to `Customer-Paid`

---

### A/B Test Tracking

**Setup A/B Tests in GHL:**

1. **Subject Line Tests:**
   - Go to Email > A/B Testing
   - Set up 50/50 or 33/33/33 split
   - Winner = Highest Open Rate after 500 sends

2. **Send Time Tests:**
   - Test 9am vs. 8pm for Stage 2 Email 2 (Partner)
   - Winner = Highest Click Rate

3. **CTA Tests:**
   - Test button text ("Get Access" vs. "Start Now")
   - Winner = Highest Click-Through Rate

---

## Re-Engagement Campaign Workflow

**Trigger:** Tag `Stage1-Low-Engagement` applied

**Workflow:**
```
START: Tag Applied
    ↓
[Wait 7 Days]
    ↓
Send Email: "We miss you (and we get it)"
    ↓
[Wait 14 Days]
    ↓
Check Engagement:
    ├─→ Opened email → Move to Stage 2
    └─→ Did NOT open → Move to Quarterly Nurture
```

**Email Content:**
- Subject: "We miss you (but we get it)"
- Body: Acknowledge overwhelm, no pressure, 1 quick resource
- CTA: "Still want these emails? Let us know"

---

## Quarterly Nurture Workflow

**Trigger:** Tag `Nurture-Quarterly` applied

**Workflow:**
```
START: Tag Applied
    ↓
[Wait 90 Days]
    ↓
Send Email: High-value, no-ask (research/seasonal tips)
    ↓
[Wait 90 Days]
    ↓
Send Email: Community spotlight or founder update
    ↓
[Repeat Every 90 Days]
```

**Email Examples:**
- New research on baby sleep
- Daylight savings sleep tips
- Seasonal travel tips
- Jade's personal update

**Goal:** Stay top-of-mind without burning out audience.

---

## Customer Onboarding Workflow

**Trigger:** Tag `Customer-Paid-[Product]` applied

**Workflow:**
```
START: Purchase Detected
    ↓
[Immediate] Send Email: Welcome + Guide Delivery
    ↓
[Day 3] Send Email: "How to use your guide"
    ↓
[Day 7] Send Email: Check-in + support offer
    ↓
[Day 14] Send Email: Upsell (complementary product)
    ↓
[Day 30] Send Email: Review request + testimonial invite
```

---

## Implementation Checklist

### Pre-Launch (Week 1)

- [ ] Import all 12 email templates into GHL
- [ ] Set up Workflow 1 (Stage 1) with all 5 emails
- [ ] Set up Workflow 2 (Stage 2) with all 4 emails
- [ ] Set up Workflow 3 (Stage 3) with all 3 emails
- [ ] Configure all tags (lead stage, engagement, age, conversion)
- [ ] Set up branching logic (decision points)
- [ ] Integrate Stripe (payment tracking)
- [ ] Integrate Calendar (booking tracking)
- [ ] Set up A/B tests (subject lines, send times)

### Testing (Week 2)

- [ ] Create 10 test contacts with different scenarios:
  - High engagement → Stage 2
  - Low engagement → Re-engagement
  - Purchase → Customer Onboarding
  - Age segmentation (4mo, 8mo, 2yr)
- [ ] Run test contacts through full journey (accelerate wait times)
- [ ] Verify all emails send correctly
- [ ] Verify all tags apply correctly
- [ ] Verify all branching logic works
- [ ] Test unsubscribe flow
- [ ] Check spam score (aim for <5)

### Launch (Week 3)

- [ ] Launch Stage 1 workflow (connect to live form)
- [ ] Monitor first 50 leads closely
- [ ] Check open rates daily (first 7 days)
- [ ] Check click rates daily (first 7 days)
- [ ] Verify tags applying correctly
- [ ] Adjust send times if needed

### Optimization (Ongoing)

- [ ] Review dashboard weekly
- [ ] Analyze A/B test results (after 500 sends)
- [ ] Adjust subject lines based on open rates
- [ ] Adjust send times based on engagement
- [ ] Review conversion rates monthly
- [ ] Update email copy quarterly (based on feedback)

---

## Troubleshooting Guide

### Issue: Low Open Rates (<25%)

**Possible Causes:**
- Poor subject lines
- Wrong send time
- Email deliverability issues

**Solutions:**
- Test new subject lines (more curiosity/validation)
- Test different send times (morning vs. evening)
- Check spam score, clean email list

---

### Issue: Low Click Rates (<10%)

**Possible Causes:**
- Weak CTA
- Poor email content/value
- Audience not aligned

**Solutions:**
- Strengthen CTA language
- Add more utility/social proof to email
- Review audience segmentation

---

### Issue: Low Progression to Stage 2 (<20%)

**Possible Causes:**
- Stage 1 emails not engaging enough
- Wait times too long
- Audience not qualified

**Solutions:**
- Shorten wait times (test 1-day intervals)
- Increase utility in Stage 1 emails
- Review lead source quality

---

### Issue: Low Conversion Rate (<5% in Stage 3)

**Possible Causes:**
- Price too high
- Offer not compelling
- Audience not ready

**Solutions:**
- Test lower price point or discount
- Add more social proof/testimonials
- Extend Stage 2 (more nurture before offer)

---

## Next Steps

1. **Begin Implementation:** Follow Pre-Launch checklist
2. **Test Thoroughly:** Use test contacts to validate all workflows
3. **Launch Gradually:** Start with Stage 1, add Stage 2/3 after validation
4. **Monitor & Optimize:** Review metrics weekly, adjust based on data
5. **Document Learnings:** Update this guide with real-world findings

---

**Document Owner:** HLS Email Strategy  
**Last Updated:** 2026-02-21  
**Ready for:** Immediate implementation in GHL
