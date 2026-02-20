# HLS Email Journey Map
**Date:** 2026-02-21  
**Version:** 1.0  
**Status:** Production Ready

---

## Overview

This document maps the complete customer email journey from initial lead capture through conversion, with branching logic, timing, and success metrics.

---

## Journey Stages & Email Count

| Stage | Email Count | Duration | Goal |
|-------|-------------|----------|------|
| **Stage 1: Free Lead Nurture** | 5 emails | Days 0-7 | Build trust, deliver value, introduce HLS philosophy |
| **Stage 2: Engaged Sequence** | 4 emails | Weeks 2-4 | Deepen relationship, differentiate, prepare for decision |
| **Stage 3: Decision Sequence** | 3 emails | When ready | Drive conversion to paid guides/consults |
| **TOTAL** | **12 emails** | 4-6 weeks | Free Lead → Paying Customer |

---

## Stage 1: Free Lead Nurture (Days 0-7)

**Trigger:** Lead downloads free guide OR opts in via landing page  
**Goal:** Welcome, build trust, deliver immediate value, introduce HLS philosophy

### Email Flow

```
Day 0 (immediate) → Email 1: Welcome to the sleep conversation
    ↓
Day 2 → Email 2: What your baby's cry actually means
    ↓
Day 4 → Email 3: Quick reset method (when nothing else works)
    ↓
Day 6 → Email 4: Why YOUR sleep matters as much as baby's
    ↓
Day 7 → Email 5: [Free guide recap] Next step: Sleep audit
```

### Email Details

#### **Email 1: Welcome to the sleep conversation** (Day 0)
- **Type:** Welcome + Philosophy Introduction
- **Voice:** Warm, validating, non-judgmental
- **Key Message:** "You're not broken. Sleep challenges are communication, not failure."
- **CTA:** Soft (download guide if not yet accessed, confirm receipt)
- **Tag Applied:** `Free-Lead-Day0`

#### **Email 2: What your baby's cry actually means** (Day 2)
- **Type:** Value Delivery + Vulnerability
- **Voice:** Personal story from Jade
- **Key Message:** Responsive parenting philosophy, decoding baby cues
- **CTA:** Soft (read more, share with partner)
- **Tag Applied:** `Opened-Email2` (if opened)

#### **Email 3: Quick reset method (when nothing else works)** (Day 4)
- **Type:** Utility + Social Proof
- **Voice:** Practical, confidence-building
- **Key Message:** Actionable method parents can use tonight
- **CTA:** Soft (try this tonight, report back)
- **Tag Applied:** `Engaged-Email3` (if clicked)

#### **Email 4: Why YOUR sleep matters as much as baby's** (Day 6)
- **Type:** Parental Wellbeing Focus
- **Voice:** Validating, empowering
- **Key Message:** Sleep-deprived parents can't be present parents
- **CTA:** Soft (parental self-care checklist)
- **Tag Applied:** `High-Engagement` (if opened + clicked)

#### **Email 5: [Free guide recap] Next step: Sleep audit** (Day 7)
- **Type:** Transition to Engagement
- **Voice:** Summarizing, inviting next step
- **Key Message:** Recap value delivered, invite to deeper engagement
- **CTA:** Medium (free sleep audit, quiz, or next guide)
- **Tag Applied:** `Ready-Engaged-Sequence` (if clicked)

---

## Branching Logic: Stage 1 → Stage 2

**Decision Point:** Day 7

### **Path A: High Engagement** → Stage 2 Engaged Sequence
**Criteria:**
- Opened 3+ emails in Stage 1
- Clicked at least 1 link
- OR completed sleep audit/quiz

**Action:** Move to Stage 2 (Engaged Sequence)

### **Path B: Low Engagement** → Nurture Loop
**Criteria:**
- Opened <2 emails
- No clicks

**Action:** 
- Wait 7 days
- Send re-engagement email ("We miss you")
- If still no engagement after 14 days → move to quarterly nurture

### **Path C: Purchased** → Customer Onboarding
**Criteria:**
- Made purchase during Stage 1

**Action:**
- Remove from nurture sequence
- Move to customer onboarding flow

---

## Stage 2: Engaged Sequence (Weeks 2-4)

**Trigger:** High engagement in Stage 1 OR clicked CTA in Email 5  
**Goal:** Differentiate HLS from competitors, deepen trust, address objections

### Email Flow

```
Week 2 (Day 14) → Email 1: Flexible sleep methods (not rigid)
    ↓
Week 3 (Day 21) → Email 2: Partner alignment: Getting spouse on board
    ↓
Week 3.5 (Day 24) → Email 3: Real story: How we handle regression
    ↓
Week 4 (Day 28) → Email 4: [Age-specific] What to expect next
```

### Email Details

#### **Email 1: Flexible sleep methods (not rigid)** (Day 14)
- **Type:** Differentiation
- **Voice:** Confident, non-dogmatic
- **Key Message:** HLS is responsive, not rigid (unlike competitors)
- **CTA:** Soft (philosophy comparison chart)
- **Tag Applied:** `Differentiation-Aware`

#### **Email 2: Partner alignment: Getting spouse on board** (Day 21)
- **Type:** UNIQUE Value Proposition
- **Voice:** Empathetic, inclusive
- **Key Message:** Sleep challenges strain relationships; alignment is key
- **CTA:** Medium (partner alignment guide download)
- **Tag Applied:** `Partner-Focused` (if clicked)
- **UNIQUE:** No competitor addresses this directly

#### **Email 3: Real story: How we handle regression** (Day 24)
- **Type:** Vulnerability + Authenticity
- **Voice:** First-person from Jade, honest
- **Key Message:** Even experts struggle; it's about the process, not perfection
- **CTA:** Soft (community invitation or comment)
- **Tag Applied:** `High-Trust` (if opened)

#### **Email 4: [Age-specific] What to expect next** (Day 28)
- **Type:** Segmentation Opportunity
- **Voice:** Informative, anticipatory
- **Key Message:** Tailored to child's age (4mo vs 8mo vs 2yr)
- **CTA:** Medium (guide relevant to age)
- **Tag Applied:** `Age-Segmented-4mo`, `Age-Segmented-8mo`, or `Age-Segmented-2yr`

---

## Segmentation Logic: Age-Based Branching

**Implementation:** Email 4 triggers segmentation

| Child Age | Email Variant | Recommended Guide | Tag |
|-----------|---------------|-------------------|-----|
| 0-6 months | "The 4-month regression (and what's really happening)" | Newborn Sleep Guide | `Age-0-6mo` |
| 6-12 months | "8-month resistance: Independence emerging" | 5-18 Month Sleep Guide | `Age-6-12mo` |
| 12-24 months | "Toddler boundaries: Sleep edition" | Toddler Sleep Guide | `Age-12-24mo` |
| 2+ years | "Bedtime battles & partner alignment" | Toddler Bundle | `Age-2plus` |

---

## Branching Logic: Stage 2 → Stage 3

**Decision Point:** Day 28

### **Path A: Ready to Buy** → Stage 3 Decision Sequence
**Criteria:**
- Opened all 4 emails in Stage 2
- Clicked 2+ CTAs
- OR completed age-specific quiz/audit

**Action:** Move to Stage 3 (Decision Sequence)

### **Path B: Still Engaged, Not Ready** → Extended Nurture
**Criteria:**
- Opened 2-3 emails
- Clicked 1 CTA

**Action:**
- Wait 7 days
- Send value-add email (case study, new research)
- Reassess after 14 days

### **Path C: Low Engagement** → Nurture Loop
**Criteria:**
- Opened <2 emails

**Action:**
- Move to quarterly nurture
- Re-engagement campaign in 30 days

---

## Stage 3: Decision Sequence (Conversion)

**Trigger:** High engagement in Stage 2 OR manual qualification (e.g., booked discovery call)  
**Goal:** Convert to paying customer

### Email Flow

```
Day 0 (when triggered) → Email 1: Your personalized sleep plan awaits
    ↓
Day 3 → Email 2: [Social proof] What other parents discovered
    ↓
Day 6 → Email 3: Limited: Guide bundle offer
```

### Email Details

#### **Email 1: Your personalized sleep plan awaits** (Trigger Day 0)
- **Type:** Direct Offer
- **Voice:** Confident, inviting
- **Key Message:** "You're ready for your tailored solution"
- **CTA:** Strong (book consult OR purchase guide)
- **Tag Applied:** `Decision-Sequence-Started`

#### **Email 2: [Social proof] What other parents discovered** (Day 3)
- **Type:** Social Proof + Testimonials
- **Voice:** Results-focused, validating
- **Key Message:** "Parents like you got results"
- **CTA:** Strong (see results + purchase)
- **Tag Applied:** `Social-Proof-Viewed` (if clicked)

#### **Email 3: Limited: Guide bundle offer** (Day 6)
- **Type:** Urgency + Offer
- **Voice:** Friendly urgency (not aggressive)
- **Key Message:** Bundle discount expires in 48h
- **CTA:** Strong (purchase bundle now)
- **Tag Applied:** `Offer-Sent`

---

## Conversion Outcomes

### **Outcome A: Purchased** → Customer Onboarding
**Action:**
- Remove from Decision Sequence
- Tag: `Customer-Paid-[Product]`
- Move to post-purchase onboarding + upsell sequences

### **Outcome B: Did Not Purchase** → Long-Term Nurture
**Action:**
- Tag: `Decision-No-Purchase`
- Wait 30 days
- Move to quarterly value-add emails
- Re-engagement campaign quarterly

### **Outcome C: Booked Call (No Purchase Yet)** → Sales Follow-Up
**Action:**
- Tag: `Consult-Booked`
- Manual follow-up by Jade
- Automated post-call sequence if no purchase

---

## Visual Journey Flowchart

```
FREE LEAD (Day 0)
    ↓
[STAGE 1: Free Lead Nurture (Days 0-7)]
    ↓
Email 1 (Day 0) → Email 2 (Day 2) → Email 3 (Day 4) → Email 4 (Day 6) → Email 5 (Day 7)
    ↓
DECISION POINT (Day 7)
    ├─→ High Engagement (3+ opens, 1+ click) → STAGE 2
    ├─→ Low Engagement (< 2 opens) → Nurture Loop
    └─→ Purchased → Customer Onboarding
    ↓
[STAGE 2: Engaged Sequence (Weeks 2-4)]
    ↓
Email 1 (Day 14) → Email 2 (Day 21) → Email 3 (Day 24) → Email 4 (Day 28)
    ↓
AGE SEGMENTATION (Day 28)
    ├─→ 0-6mo → Newborn Guide Offer
    ├─→ 6-12mo → 5-18mo Guide Offer
    ├─→ 12-24mo → Toddler Guide Offer
    └─→ 2+ years → Toddler Bundle Offer
    ↓
DECISION POINT (Day 28)
    ├─→ Ready to Buy (4 opens, 2+ clicks) → STAGE 3
    ├─→ Engaged Not Ready (2-3 opens, 1 click) → Extended Nurture
    └─→ Low Engagement (< 2 opens) → Quarterly Nurture
    ↓
[STAGE 3: Decision Sequence (Conversion)]
    ↓
Email 1 (Trigger Day 0) → Email 2 (Day 3) → Email 3 (Day 6)
    ↓
CONVERSION OUTCOMES
    ├─→ Purchased → Customer Onboarding
    ├─→ Booked Call → Sales Follow-Up
    └─→ No Purchase → Long-Term Nurture (Quarterly)
```

---

## Success Metrics by Stage

### Stage 1: Free Lead Nurture (Days 0-7)

| Metric | Target | Excellent | Notes |
|--------|--------|-----------|-------|
| **Email 1 Open Rate** | 50% | 60%+ | Welcome emails typically higher open rate |
| **Email 2-5 Open Rate** | 30% | 40%+ | Consistency indicates engagement |
| **Link Click Rate** | 15% | 25%+ | At least 1 click in 5 emails |
| **Progression to Stage 2** | 30% | 40%+ | High engagement criteria met |
| **Unsubscribe Rate** | <2% | <1% | Low = good fit, good messaging |
| **Spam Complaint Rate** | <0.1% | <0.05% | Critical for deliverability |

**Key Success Indicator:** 30%+ of free leads progress to Stage 2 (Engaged Sequence)

---

### Stage 2: Engaged Sequence (Weeks 2-4)

| Metric | Target | Excellent | Notes |
|--------|--------|-----------|-------|
| **Open Rate** | 35% | 45%+ | Engaged audience should stay warm |
| **Link Click Rate** | 20% | 30%+ | Higher intent than Stage 1 |
| **Email 2 (Partner) Click** | 25% | 35%+ | Unique differentiator; strong signal |
| **Age Segmentation Click** | 30% | 40%+ | High relevance = high engagement |
| **Progression to Stage 3** | 20% | 30%+ | Of those who entered Stage 2 |
| **Unsubscribe Rate** | <1.5% | <0.8% | Very low = audience fit confirmed |

**Key Success Indicator:** 20%+ of engaged leads progress to Stage 3 (Decision Sequence)

---

### Stage 3: Decision Sequence (Conversion)

| Metric | Target | Excellent | Notes |
|--------|--------|-----------|-------|
| **Open Rate** | 40% | 50%+ | Highly qualified audience |
| **Link Click Rate (Email 1)** | 30% | 40%+ | Direct offer; high intent |
| **Link Click Rate (Email 2)** | 25% | 35%+ | Social proof validation |
| **Link Click Rate (Email 3)** | 35% | 45%+ | Urgency + offer; last chance |
| **Conversion Rate (Purchase)** | 10% | 15%+ | Of those who entered Stage 3 |
| **Conversion Rate (Booked Call)** | 5% | 10%+ | Alternative conversion path |
| **Total Conversion** | 15% | 25%+ | Purchase OR booked call |

**Key Success Indicator:** 15%+ of decision-sequence leads convert to customers

---

## Overall Funnel Metrics

### End-to-End Conversion (Free Lead → Paying Customer)

```
100 Free Leads (Day 0)
    ↓
30 progress to Stage 2 (30% conversion)
    ↓
6 progress to Stage 3 (20% of Stage 2 = 6% overall)
    ↓
1-2 become paying customers (15% of Stage 3 = 1-2% overall)
```

**Target Overall Conversion Rate:** 1-2% (Free Lead → Customer)  
**Excellent Overall Conversion Rate:** 2-3%

**Revenue Per Lead Calculation:**
- Average guide price: $27-$47
- Average consult price: $150-$250
- Blended average: ~$60
- At 1.5% conversion: $0.90 revenue per free lead
- At 3% conversion: $1.80 revenue per free lead

---

## Decision Points & Branching Rules

### When to Segment

| Decision Point | Timing | Criteria | Action |
|----------------|--------|----------|--------|
| **Stage 1 → Stage 2** | Day 7 | 3+ opens, 1+ click | Move to Engaged Sequence |
| **Stage 1 → Nurture** | Day 7 | <2 opens, 0 clicks | Re-engagement in 7 days |
| **Stage 2 → Stage 3** | Day 28 | 4 opens, 2+ clicks | Move to Decision Sequence |
| **Stage 2 → Extended Nurture** | Day 28 | 2-3 opens, 1 click | Value email in 7 days |
| **Stage 2 → Age Segment** | Day 28 | Completed Email 4 | Tag by age, tailor offer |
| **Stage 3 → Customer** | Any time | Purchase made | Customer Onboarding |
| **Stage 3 → Long-Term** | Day 6 (after Email 3) | No purchase | Quarterly nurture |

---

## Tagging Strategy

### Lead Stage Tags
- `Free-Lead-Day0` (applied immediately)
- `Stage1-In-Progress` (Days 0-7)
- `Stage2-Engaged` (Weeks 2-4)
- `Stage3-Decision` (Conversion sequence)
- `Customer-Paid-[Product]` (post-purchase)
- `Nurture-Quarterly` (long-term inactive)

### Engagement Tags
- `Opened-Email[X]` (tracks which emails opened)
- `Clicked-Email[X]` (tracks which links clicked)
- `High-Engagement` (3+ opens in Stage 1)
- `High-Trust` (opened vulnerability email)
- `Partner-Focused` (clicked partner alignment)

### Age Segmentation Tags
- `Age-0-6mo`
- `Age-6-12mo`
- `Age-12-24mo`
- `Age-2plus`

### Conversion Tags
- `Decision-Sequence-Started`
- `Social-Proof-Viewed`
- `Offer-Sent`
- `Consult-Booked`
- `Decision-No-Purchase`

---

## Re-Engagement Campaigns

### Low Engagement Re-Activation (After Stage 1)

**Trigger:** <2 opens in Stage 1, Day 14  
**Email:** "We miss you (and we get it)"

**Content:**
- Acknowledge fatigue, overwhelm
- No pressure, just checking in
- 1 quick resource (video, checklist)
- Soft CTA: "Still want these emails?"

**Outcome:**
- If opened → Move to Stage 2
- If not opened after 14 more days → Quarterly nurture

### Quarterly Nurture (Long-Term Inactive)

**Frequency:** Every 90 days  
**Content:** High-value, no-ask emails

**Examples:**
- New research on baby sleep
- Seasonal tips (daylight savings, travel)
- Community spotlight (parent story)
- Founder update from Jade

**Goal:** Stay top-of-mind without burning out audience

---

## A/B Testing Roadmap

### Priority Tests (First 30 Days)

1. **Email 1 Subject Line**
   - A: "Welcome to Healthy Little Sleepers"
   - B: "You're not broken (and neither is your baby)"
   - Hypothesis: Vulnerability drives higher open rate

2. **Email 3 CTA**
   - A: "Try this quick reset method tonight"
   - B: "Download the quick reset guide"
   - Hypothesis: Action-oriented beats download

3. **Email 5 Timing**
   - A: Day 7 (as planned)
   - B: Day 5 (faster transition)
   - Hypothesis: Faster transition increases Stage 2 entry

4. **Email 2 (Partner) Send Time**
   - A: 9am (parent's morning)
   - B: 8pm (couple's evening)
   - Hypothesis: Evening = higher partner discussion rate

---

## Implementation Checklist

- [ ] Create all 12 email drafts in GHL
- [ ] Set up automation workflows (3 sequences)
- [ ] Configure tags (lead stage, engagement, age, conversion)
- [ ] Build branching logic (decision points)
- [ ] Set up A/B tests (subject lines, send times)
- [ ] Configure success metrics tracking (open, click, conversion)
- [ ] Test full journey with test contacts
- [ ] Create re-engagement campaigns (low engagement, quarterly)
- [ ] Document customer onboarding flow (post-purchase)
- [ ] Train Jade on manual intervention points (consult follow-up)

---

## Next Steps

1. **Build Email Templates** (see `02-email-templates.md`)
2. **Write Sample Emails** (see `03-sample-emails.md`)
3. **Set Up GHL Automation** (see `04-ghl-automation-plan.md`)
4. **Define Voice Guidelines** (see `05-differentiation-strategy.md`)

---

**Document Owner:** HLS Email Strategy  
**Last Updated:** 2026-02-21  
**Next Review:** After first 100 leads through full journey
