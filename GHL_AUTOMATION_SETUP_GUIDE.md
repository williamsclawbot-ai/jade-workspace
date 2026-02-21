# GHL Automation Setup Guide - Hello Little Sleepers Email Sequences
## Step-by-Step Instructions for GoHighLevel Implementation

**Created:** Feb 22, 2026 2:00 AM  
**Purpose:** Complete guide to set up HLS email sequences in GoHighLevel

---

## 🎯 Overview

This guide walks through setting up **4 automated email sequences** in GoHighLevel:

1. **Free Lead Nurture Sequence** (5 emails, Days 0-11)
2. **Engaged Sequence** (4 emails, Days 14-26)
3. **Decision Sequence** (3 emails, Days 30-36)
4. **Customer Post-Purchase Sequence** (4 emails, Days 0-14 after purchase)

Plus re-engagement workflows for dormant leads.

---

## 📋 Pre-Setup Checklist

Before building automations, ensure you have:

- [ ] GHL account with email sending enabled
- [ ] Domain verified and email authentication set up (SPF, DKIM, DMARC)
- [ ] HLS logo uploaded to GHL media library
- [ ] Brand colors configured in GHL settings
- [ ] Custom fields created (see below)
- [ ] Tags taxonomy created (see below)
- [ ] Email templates imported (from Sample Emails doc)
- [ ] Stripe/payment integration connected (for purchase tracking)

### Custom Fields to Create in GHL

Go to Settings → Custom Fields → Contacts

| Field Name | Field Type | Purpose |
|------------|------------|---------|
| `child_age_months` | Number | Track child's age for segmentation |
| `child_dob` | Date | Calculate age automatically |
| `lead_source` | Dropdown | Track where lead came from (Free Guide, Instagram, etc.) |
| `sleep_challenge` | Dropdown | Primary sleep issue (Regression, Bedtime Battles, etc.) |
| `partner_name` | Text | Personalization for partner emails |
| `guide_purchased` | Dropdown | Which guide(s) they bought |
| `email_engagement_score` | Number | Track engagement level (auto-calculated) |

### Tags to Create in GHL

Go to Settings → Tags

**Stage Tags:**
- `Free Lead - Welcomed`
- `Engaged - Active`
- `Decision Stage - High Intent`
- `Customer - Active`
- `Dormant - Needs Reengagement`

**Behavior Tags:**
- `Opened Email 1` through `Opened Email 12`
- `Clicked - Quick Reset`
- `Clicked - Partner Alignment`
- `Clicked - Guide Offer`
- `Clicked - Bundle Offer`

**Segment Tags:**
- `Age: 0-3mo` through `Age: 24mo+`
- `Challenge: Regression`
- `Challenge: Bedtime Battles`
- `Challenge: Partner Misalignment`
- `Challenge: Parent Sleep Deprivation`

**Product Tags:**
- `Purchased - 5-18mo Guide`
- `Purchased - Toddler Guide`
- `Purchased - Bundle`

---

## 🔧 SEQUENCE 1: Free Lead Nurture (Days 0-11)

### Trigger Setup

**Primary Trigger:** Contact submits Free Guide opt-in form

**How to Set Up:**
1. Go to Automation → Workflows → Create Workflow
2. Name: "HLS - Free Lead Nurture Sequence"
3. Trigger: "Form Submitted"
4. Select form: "[Your Free Guide Opt-In Form Name]"
5. Add filter: Tag does NOT contain "Customer" (don't re-nurture existing customers)

### Workflow Steps

#### Step 1: Welcome Email (Immediate - Day 0)

**Action:** Send Email  
**Email Template:** "Welcome to Hello Little Sleepers"  
**Subject:** "Welcome to Hello Little Sleepers 💙 (Your free guide is here)"  
**Send Timing:** Immediately after form submission  
**Delay After:** None

**Email Content Summary:**
- Welcome from Jade + Jess
- Link to free guide (PDF delivery)
- Set expectations (weekly emails)
- HLS philosophy intro
- Social links

**Automation Actions:**
1. Send email
2. Apply tag: `Free Lead - Welcomed`
3. Set custom field: `lead_source` = "Free Guide"
4. If custom field `child_age_months` is blank → trigger "Age Collection" workflow (optional)

---

#### Step 2: Wait 2 Days

**Action:** Wait/Delay  
**Duration:** 2 days  
**Time of Day:** 9:00 AM (contact's timezone if available, else AEST)

---

#### Step 3: "What Your Baby's Cry Means" Email (Day 2)

**Action:** Send Email  
**Email Template:** "What Your Baby's Cry Actually Means"  
**Subject A/B Test:**
- A: "What your baby is trying to tell you (it's not what you think)"
- B: "I used to think all cries were the same. I was wrong."
- Send winning variant to 80% based on 2-hour open rate test

**Automation Actions:**
1. Send email
2. If email is opened → Apply tag `Opened Email 2`
3. If link clicked → Apply tag `Engaged - Active` + increase `email_engagement_score` by 1
4. If NOT opened within 24h → Add to re-send workflow (optional)

---

#### Step 4: Wait 3 Days

**Action:** Wait/Delay  
**Duration:** 3 days  
**Time of Day:** 1:00 PM AEST (nap time)

---

#### Step 5: "Quick Reset Method" Email (Day 5)

**Action:** Send Email  
**Email Template:** "Quick Reset Method (When Nothing Else Works)"  
**Subject A/B Test:**
- A: "When sleep falls apart: The Quick Reset Method"
- B: "Your emergency sleep reset (save this email)"

**Automation Actions:**
1. Send email
2. If email opened → Apply tag `Opened Email 3`
3. If "Quick Reset" link clicked → Apply tag `Clicked - Quick Reset` + `High Intent - Guide Interest`
4. If clicked → Increase `email_engagement_score` by 2 (high intent action)

---

#### Step 6: Wait 3 Days

**Action:** Wait/Delay  
**Duration:** 3 days  
**Time of Day:** 9:00 AM AEST

---

#### Step 7: "Why YOUR Sleep Matters" Email (Day 8)

**Action:** Send Email  
**Email Template:** "Why YOUR Sleep Matters as Much as Baby's"  
**Subject A/B Test:**
- A: "The truth no one tells you about baby sleep"
- B: "Your sleep matters. Here's why I finally believed it."

**Automation Actions:**
1. Send email
2. If opened → Apply tag `Opened Email 4`
3. If link clicked → Apply tag `Engaged - Wellbeing Resonated`
4. Update `email_engagement_score`

---

#### Step 8: Wait 3 Days

**Action:** Wait/Delay  
**Duration:** 3 days  
**Time of Day:** 1:00 PM AEST

---

#### Step 9: "Next Step: Sleep Audit" Email (Day 11)

**Action:** Send Email  
**Email Template:** "Next Step: Your Sleep Audit"  
**Subject A/B Test:**
- A: "You've read the guide. What's next?"
- B: "From information to action: Your sleep audit"

**Automation Actions:**
1. Send email
2. If opened → Apply tag `Opened Email 5`
3. If booking/guide link clicked → Apply tag `Decision Stage - Audit Interested` + move to Decision Sequence
4. Update `email_engagement_score`

---

#### Step 10: Decision Point (Day 11)

**Action:** IF/ELSE Condition

**Condition:**  
IF `email_engagement_score` ≥ 2 (opened 2+ emails OR clicked any link)  
THEN → Move to Engaged Sequence  
ELSE → Wait 3 days, send re-engagement email

**IF TRUE (Engaged Path):**
1. Apply tag `Engaged - Active`
2. Remove tag `Free Lead - Welcomed`
3. Trigger Workflow: "HLS - Engaged Sequence"
4. Exit this workflow

**IF FALSE (Low Engagement Path):**
1. Wait 3 days
2. Send re-engagement email: "We miss you"
3. If still no engagement after 7 more days → Apply tag `Dormant - Needs Reengagement`
4. Move to Dormant Nurture workflow (monthly emails)
5. Exit this workflow

---

### Free Lead Nurture Flowchart

```
[Form Submitted: Free Guide]
         ↓
   [Tag: Free Lead]
         ↓
[Email 1: Welcome] (Immediate)
         ↓
    [Wait 2 days]
         ↓
[Email 2: Cry Meanings] (Day 2)
         ↓
    [Wait 3 days]
         ↓
[Email 3: Quick Reset] (Day 5)
         ↓
    [Wait 3 days]
         ↓
[Email 4: Parent Sleep] (Day 8)
         ↓
    [Wait 3 days]
         ↓
[Email 5: Sleep Audit] (Day 11)
         ↓
   [Decision Point]
    /          \
Engaged?      Not Engaged?
   ↓               ↓
Move to      Re-engagement
Engaged         Email
Sequence         ↓
              Dormant
              Nurture
```

---

## 🚀 SEQUENCE 2: Engaged Sequence (Days 14-26)

### Trigger Setup

**Primary Trigger:** Contact tagged `Engaged - Active` OR moved from Free Lead Nurture

**How to Set Up:**
1. Automation → Workflows → Create Workflow
2. Name: "HLS - Engaged Sequence"
3. Trigger: "Tag Added"
4. Tag: `Engaged - Active`
5. Add filter: Tag does NOT contain "Customer"

### Workflow Steps

#### Step 1: "Flexible Sleep Methods" Email (Day 14)

**Action:** Send Email  
**Email Template:** "Flexible Sleep Methods (Not Rigid)"  
**Subject A/B Test:**
- A: "Why one-size-fits-all sleep advice fails"
- B: "Gentle Fade or Quick Reset? Here's how to choose."
- C: "The sleep method no one talks about (flexibility)"

**Send Timing:** Immediately when workflow triggers  
**Time of Day:** 9:00 AM AEST (Tue/Wed preferred)

**Automation Actions:**
1. Send email
2. If opened → Apply tag `Opened Email 6`
3. If link clicked → Apply tag `Engaged - Method Curious`
4. Update `email_engagement_score`

---

#### Step 2: Wait 4 Days

**Action:** Wait/Delay  
**Duration:** 4 days  
**Time of Day:** 8:00 PM AEST (weekend, partner time)

---

#### Step 3: "Partner Alignment" Email (Day 18)

**Action:** Send Email  
**Email Template:** "Partner Alignment: Getting Your Spouse on Board"  
**Subject A/B Test:**
- A: "When your partner doesn't get it (sleep edition)"
- B: "The conversation that changed our sleep approach"

**Automation Actions:**
1. Send email
2. If opened → Apply tag `Opened Email 7`
3. If link clicked → Apply tag `High Intent - Partner Issue` + `Clicked - Partner Alignment`
4. If clicked guide link → Apply tag `Decision Stage - High Intent` + move to Decision Sequence
5. Update `email_engagement_score` by +2 (high conversion topic)

---

#### Step 4: Wait 4 Days

**Action:** Wait/Delay  
**Duration:** 4 days  
**Time of Day:** 1:00 PM AEST (midweek)

---

#### Step 5: "Real Story: Regressions" Email (Day 22)

**Action:** Send Email  
**Email Template:** "Real Story: How We Handle Regressions"  
**Subject A/B Test:**
- A: "The 4-month regression almost broke me (here's what I learned)"
- B: "Sleep regressions: What they actually mean"

**Automation Actions:**
1. Send email
2. If opened → Apply tag `Opened Email 8`
3. If link clicked → Apply tag `Engaged - Regression Struggle`
4. Update `email_engagement_score`

---

#### Step 6: Wait 4 Days

**Action:** Wait/Delay  
**Duration:** 4 days  
**Time of Day:** 9:00 AM AEST (weekend)

---

#### Step 7: "[Age-Specific] What to Expect Next" Email (Day 26)

**Action:** Send Email  
**Email Template:** Conditional based on `child_age_months` custom field

**IF `child_age_months` = 4-6:**  
Template: "What's Coming for Your 4-6 Month Old"  
**IF `child_age_months` = 7-12:**  
Template: "What's Coming for Your 8-Month-Old"  
**IF `child_age_months` = 13-24:**  
Template: "What's Coming for Your Toddler"  
**ELSE (age unknown):**  
Template: "What to Expect in the Next 4 Weeks" (generic)

**Automation Actions:**
1. Send email
2. If opened → Apply tag `Opened Email 9`
3. If guide link clicked → Apply tag `Decision Stage - [Age] Guide Interest` + move to Decision Sequence
4. Update `email_engagement_score`

---

#### Step 8: Decision Point (Day 26)

**Action:** IF/ELSE Condition

**Condition:**  
IF tag contains `Decision Stage` OR `email_engagement_score` ≥ 5  
THEN → Move to Decision Sequence  
ELSE → Continue Nurture (bi-weekly valuable emails)

**IF TRUE (High Intent Path):**
1. Trigger Workflow: "HLS - Decision Sequence"
2. Exit this workflow

**IF FALSE (Continue Nurture Path):**
1. Move to "HLS - Ongoing Nurture" workflow (bi-weekly emails, softer CTAs)
2. Exit this workflow

---

### Engaged Sequence Flowchart

```
[Tag Added: Engaged - Active]
         ↓
[Email 1: Flexible Methods] (Day 14)
         ↓
    [Wait 4 days]
         ↓
[Email 2: Partner Alignment] (Day 18)
         ↓
    [Wait 4 days]
         ↓
[Email 3: Regressions Story] (Day 22)
         ↓
    [Wait 4 days]
         ↓
[Email 4: Age-Specific Preview] (Day 26)
         ↓
   [Decision Point]
    /          \
High Intent?   Continue?
   ↓               ↓
Move to        Ongoing
Decision       Nurture
Sequence      (Bi-weekly)
```

---

## 💰 SEQUENCE 3: Decision Sequence (Days 30-36)

### Trigger Setup

**Primary Trigger:** Contact tagged `Decision Stage - High Intent` OR clicked offer link in previous sequences

**How to Set Up:**
1. Automation → Workflows → Create Workflow
2. Name: "HLS - Decision Sequence (Conversion)"
3. Trigger: "Tag Added"
4. Tag: Any tag containing "Decision Stage" OR "High Intent"
5. Add filter: Tag does NOT contain "Customer"

### Workflow Steps

#### Step 1: "Your Personalized Sleep Plan Awaits" Email (Day 30)

**Action:** Send Email  
**Email Template:** "Your Personalized Sleep Plan Awaits"  
**Subject A/B Test:**
- A: "Let's build your sleep plan together"
- B: "From exhausted to rested: Your next step"
- C: "Ready? Here's how we'll support you."

**Send Timing:** Immediately when workflow triggers  
**Time of Day:** 9:00 AM AEST (Wed/Thu preferred - midweek decision time)

**Automation Actions:**
1. Send email
2. If opened → Apply tag `Opened Email 10` + `Offer Sent - [Product]`
3. If guide link clicked → Apply tag `Clicked - Guide Offer` + increase `email_engagement_score` by 3
4. Track clicks to specific product pages (5-18mo guide vs Toddler guide vs Bundle)

---

#### Step 2: Wait 3 Days

**Action:** Wait/Delay  
**Duration:** 3 days  
**Time of Day:** 8:00 PM AEST (weekend - decision time)

---

#### Step 3: "What Other Parents Discovered" Email (Day 33)

**Action:** Send Email  
**Email Template:** "What Other Parents Discovered (Social Proof)"  
**Subject A/B Test:**
- A: "What happened when Sarah tried the Gentle Fade method"
- B: "Real results from real parents (no filters)"

**Automation Actions:**
1. Send email
2. If opened → Apply tag `Opened Email 11` + `Social Proof Viewed`
3. If guide link clicked → Increase `email_engagement_score` by 3 (very high intent)
4. Track which testimonials drive most clicks (add UTM parameters per testimonial link)

---

#### Step 4: Wait 3 Days

**Action:** Wait/Delay  
**Duration:** 3 days  
**Time of Day:** 9:00 AM AEST (Tue/Wed - urgency email)

---

#### Step 5: "Limited: Guide Bundle Offer" Email (Day 36)

**Action:** Send Email  
**Email Template:** "Limited: Guide Bundle Offer"  
**Subject A/B Test:**
- A: "Bundle offer: Save $XX on all guides (48 hours)"
- B: "Your family sleep plan (one-time offer)"

**Automation Actions:**
1. Send email
2. If opened → Apply tag `Opened Email 12` + `Bundle Offer Sent`
3. If bundle link clicked → Apply tag `Clicked - Bundle Offer` + increase `email_engagement_score` by 4
4. Set expiration: Tag contact with `Offer Expires: [Date+48h]`

---

#### Step 6: Wait 48 Hours (Urgency Window)

**Action:** Wait/Delay  
**Duration:** 48 hours (2 days)

---

#### Step 7: Decision Point (Day 38)

**Action:** IF/ELSE Condition

**Condition:**  
IF tag contains `Purchased` OR `Customer`  
THEN → Move to Customer Post-Purchase Sequence  
ELSE → Move to Dormant Nurture

**IF TRUE (Purchased):**
1. Remove tags: All decision/intent tags
2. Apply tag: `Customer - Active`
3. Trigger Workflow: "HLS - Customer Post-Purchase Nurture"
4. Send internal Slack/email notification to Jade (optional)
5. Exit this workflow

**IF FALSE (Did Not Purchase):**
1. Apply tag: `Dormant - Needs Reengagement`
2. Move to "HLS - Dormant Nurture" workflow (monthly value emails, seasonal offers)
3. Exit this workflow

---

### Decision Sequence Flowchart

```
[Tag Added: Decision Stage / High Intent]
         ↓
[Email 1: Sleep Plan Offer] (Day 30)
         ↓
    [Wait 3 days]
         ↓
[Email 2: Social Proof] (Day 33)
         ↓
    [Wait 3 days]
         ↓
[Email 3: Bundle Offer + Urgency] (Day 36)
         ↓
   [Wait 48 hours]
         ↓
   [Decision Point]
    /          \
Purchased?    Not Purchased?
   ↓               ↓
Customer      Dormant
Post-Purchase  Nurture
Sequence      (Monthly)
```

---

## 🎉 SEQUENCE 4: Customer Post-Purchase Nurture (Days 0-14 After Purchase)

### Trigger Setup

**Primary Trigger:** Stripe payment successful OR GoHighLevel order completed

**How to Set Up:**
1. Automation → Workflows → Create Workflow
2. Name: "HLS - Customer Post-Purchase Nurture"
3. Trigger: "Order Created" (GHL) OR "Payment Received" (Stripe webhook)
4. Add filter: Product name contains "Sleep Guide" OR "Bundle"

### Workflow Steps

#### Step 1: Welcome to HLS Family Email (Immediate)

**Action:** Send Email  
**Email Template:** "Welcome to the HLS Family"  
**Subject:** "Your [Product Name] is ready! Here's what to do first."

**Send Timing:** Immediately after purchase  

**Email Content:**
- Thank you for purchase
- Access details (login link, PDF download, etc.)
- What to do first (where to start in guide)
- Expectation setting (timeline for results)
- Support availability (how to reach us)

**Automation Actions:**
1. Send email
2. Apply tag: `Customer - Active` + `Purchased - [Product Name]`
3. Set custom field: `guide_purchased` = [Product Name]
4. Remove all "Decision Stage" and "Free Lead" tags
5. Grant access to product (if using member area)

---

#### Step 2: Wait 2 Days

**Action:** Wait/Delay  
**Duration:** 2 days  
**Time of Day:** 9:00 AM AEST

---

#### Step 3: "How to Use Your Guide" Email (Day 2)

**Action:** Send Email  
**Email Template:** "How to Use Your Guide (Step-by-Step)"  
**Subject:** "Getting started with your [Product Name]"

**Email Content:**
- Where to start in guide (page/section)
- Step-by-step first night instructions
- Common mistakes to avoid
- Quick wins to try tonight
- Reminder of support availability

**Automation Actions:**
1. Send email
2. If opened → Apply tag `Customer - Engaged`
3. Track link clicks to specific guide sections

---

#### Step 4: Wait 5 Days

**Action:** Wait/Delay  
**Duration:** 5 days  
**Time of Day:** 1:00 PM AEST

---

#### Step 5: "Week 1 Check-In" Email (Day 7)

**Action:** Send Email  
**Email Template:** "Week 1 Check-In: How's It Going?"  
**Subject:** "One week in: How are things going?"

**Email Content:**
- "How's it going?" (encourage reply)
- Troubleshooting common Week 1 issues
- Reminder: Support available (reply to email, book call if applicable)
- What to expect in Week 2
- Encouragement + validation

**Automation Actions:**
1. Send email
2. If reply received → Tag `Customer - Active Engagement` (manual tag or automation if GHL supports reply detection)
3. If no engagement → Add to "Customer Re-engagement" workflow

---

#### Step 6: Wait 7 Days

**Action:** Wait/Delay  
**Duration:** 7 days  
**Time of Day:** 9:00 AM AEST

---

#### Step 7: "Share Your Progress" Email (Day 14)

**Action:** Send Email  
**Email Template:** "Share Your Progress (Testimonial Request)"  
**Subject:** "How's sleep going now? We'd love to hear."

**Email Content:**
- Request for testimonial/story
- Share on social media (tag HLS)
- Refer a friend (incentive if applicable - discount code for their next purchase)
- Ongoing support reminder

**Automation Actions:**
1. Send email
2. If testimonial link clicked → Apply tag `Customer - Testimonial Submitted`
3. If referral link clicked → Apply tag `Customer - Referral Active` + generate unique referral code
4. Track social shares (if trackable)

---

#### Step 8: Ongoing Customer Nurture

**Action:** Move to "HLS - Customer Ongoing Nurture" workflow

**Ongoing Customer Nurture:**
- Monthly check-ins
- New product launches
- Seasonal offers (bundle upgrades, new guides)
- Referral reminders
- Community invitations (if applicable - Facebook group, etc.)

---

### Customer Post-Purchase Flowchart

```
[Purchase Completed: Stripe/GHL]
         ↓
  [Tag: Customer - Active]
         ↓
[Email 1: Welcome + Access] (Immediate)
         ↓
    [Wait 2 days]
         ↓
[Email 2: How to Use Guide] (Day 2)
         ↓
    [Wait 5 days]
         ↓
[Email 3: Week 1 Check-In] (Day 7)
         ↓
    [Wait 7 days]
         ↓
[Email 4: Testimonial Request] (Day 14)
         ↓
  [Ongoing Customer Nurture]
  (Monthly emails + launches)
```

---

## 🔄 RE-ENGAGEMENT & DORMANT WORKFLOWS

### Re-Engagement Workflow (for non-openers)

**Trigger:** Contact has NOT opened last 2 emails in any sequence

**How to Set Up:**
1. Automation → Workflows → Create Workflow
2. Name: "HLS - Re-Engagement (Non-Openers)"
3. Trigger: Custom (set up condition-based trigger)
4. Condition: `email_engagement_score` = 0 AND days since last email open > 14

**Workflow Steps:**

1. **Email 1: "We Miss You"** (Day 0)
   - Subject: "We miss you - what can we help with?"
   - Content: Friendly check-in, offer help, link to best resources
   - CTA: Reply and tell us what you need

2. **Wait 7 Days**

3. **Email 2: "What Can We Help With?"** (Day 7)
   - Subject: "What's your biggest sleep challenge right now?"
   - Content: Survey/question, invitation to engage
   - CTA: Reply with your challenge

4. **Wait 7 Days**

5. **Email 3: "Last Chance: [Valuable Resource]"** (Day 14)
   - Subject: "Before you go: one last thing"
   - Content: High-value resource (best blog post, checklist, guide excerpt)
   - CTA: Download resource OR unsubscribe (give permission to leave)

6. **Decision Point:**
   - IF engaged (opened or clicked) → Move back to appropriate sequence
   - IF still no engagement → Move to Dormant Nurture (quarterly emails)

---

### Dormant Nurture Workflow (quarterly emails)

**Trigger:** Contact tagged `Dormant - Needs Reengagement`

**How to Set Up:**
1. Automation → Workflows → Create Workflow
2. Name: "HLS - Dormant Nurture (Quarterly)"
3. Trigger: "Tag Added"
4. Tag: `Dormant - Needs Reengagement`

**Workflow Steps:**

1. **Quarterly Email 1** (Immediately)
   - Seasonal topic (daylight savings, holidays, back to school)
   - High-value content
   - Very soft CTA

2. **Wait 90 Days**

3. **Quarterly Email 2** (3 months later)
   - Different seasonal topic
   - New product launch if applicable
   - Offer if relevant

4. **Wait 90 Days**

5. **Quarterly Email 3** (6 months later)
   - "Still want to hear from us?" check-in
   - Best of HLS content
   - Permission to unsubscribe

6. **Repeat** (or unsubscribe if no engagement)

---

## 📊 TRACKING & REPORTING SETUP

### GHL Dashboard Setup

**Create Custom Dashboard: "HLS Email Performance"**

**Widgets to Add:**

1. **Sequence Performance Table**
   - Rows: Each sequence (Free Lead, Engaged, Decision, Customer)
   - Columns: Total sent, Open rate, Click rate, Conversion rate, Revenue attributed
   - Filter: Last 30 days, Last 90 days, All time

2. **Email-by-Email Performance**
   - List all email templates
   - Metrics: Sends, Opens, Clicks, Conversions
   - Sort by performance

3. **Funnel Visualization**
   - Free Leads → Engaged → Decision → Customer
   - Conversion rate at each stage
   - Drop-off points

4. **Revenue Attribution**
   - Total revenue from email sequences
   - Revenue per sequence
   - Revenue per email
   - Average order value from email converts

5. **Engagement Score Distribution**
   - How many contacts at each engagement score level
   - Identify high-intent leads

6. **Tag Performance**
   - Which tags correlate with highest conversion
   - Which challenges drive most purchases

### Key Metrics to Monitor Weekly

| Metric | Where to Find | Success Target | Action if Below Target |
|--------|---------------|----------------|----------------------|
| Free Lead → Engaged Rate | Sequence dashboard | >20% | Test subject lines, improve Email 2-3 content |
| Engaged → Decision Rate | Sequence dashboard | >30% | Strengthen CTAs in Engaged emails |
| Decision → Customer Rate | Sequence dashboard | >15% | Add urgency, improve social proof |
| Overall Email → Customer Rate | Funnel viz | >5% | Review entire journey, identify drop-offs |
| Average Open Rate | Email performance | >40% | Improve subject lines, sender name, send timing |
| Average Click Rate | Email performance | >10% | Strengthen CTAs, improve email design |
| Unsubscribe Rate | GHL analytics | <0.5% | Review email frequency, content relevance |
| Email-Attributed Revenue | Revenue widget | Track monthly | Scale what works, pause what doesn't |

---

## 🎯 SEGMENTATION STRATEGIES

### By Child Age

**Why:** Different ages = different sleep challenges = different offers

**How to Set Up:**
1. Use custom field `child_age_months`
2. Create conditional branches in workflows based on age
3. Send age-specific content

**Age Segments:**
- **0-3 months:** Newborn sleep guide, emphasis on survival mode
- **4-6 months:** 4-month regression, wake window adjustments, 5-18mo guide
- **7-12 months:** Separation anxiety, nap transitions, 5-18mo guide
- **13-18 months:** Toddler transitions, 5-18mo guide OR toddler guide
- **18+ months:** Toddler guide, boundary setting, partner alignment

**Email Customization:**
- Email 4 in Engaged Sequence: Age-specific preview email
- Decision Sequence: Recommend age-appropriate guide
- Subject lines: Personalize with age when relevant

---

### By Engagement Level

**Why:** High-engagement leads need different messaging than low-engagement

**How to Set Up:**
1. Use `email_engagement_score` custom field
2. Auto-calculate based on opens/clicks
3. Segment workflows

**Engagement Tiers:**
- **High (Score 5+):** Move to Decision Sequence faster, stronger CTAs
- **Medium (Score 2-4):** Continue Engaged Sequence, nurture with value
- **Low (Score 0-1):** Re-engagement workflow, softer approach

**Email Customization:**
- High engagement: More offers, faster to Decision
- Medium engagement: Balance value + offers
- Low engagement: Value-only emails, re-engagement tactics

---

### By Sleep Challenge

**Why:** Different pain points = different messaging angles

**How to Set Up:**
1. Use custom field `sleep_challenge` (collect via survey or inferred from clicks)
2. Tag contacts based on which emails they engage with most
3. Send challenge-specific content

**Challenge Segments:**
- **Regression:** Emphasize "this is temporary," developmental framing, Quick Reset method
- **Bedtime Battles:** Partner alignment, boundaries, toddler-specific content
- **Partner Misalignment:** Partner alignment emails, relationship-focused messaging
- **Parent Sleep Deprivation:** Parental wellbeing angle, "sleep isn't selfish"

**Email Customization:**
- Subject lines: Match challenge language
- Body content: Lead with their specific pain point
- CTA: Recommend guide that solves their challenge

---

## ⚙️ AUTOMATION RULES & CONDITIONS

### Rule 1: Don't Email Customers with Lead Nurture

**Setup:**
- Add filter to ALL lead nurture workflows: Tag does NOT contain "Customer"
- Prevents annoying customers with conversion emails

### Rule 2: Pause Sequences on Purchase

**Setup:**
- When tag `Customer - Active` is added → Remove from ALL active sequences
- Move to Customer Post-Purchase sequence only

### Rule 3: Re-Engagement for Non-Openers

**Setup:**
- If contact doesn't open Email 2 in Free Lead Nurture within 48h → Trigger re-send with different subject line
- Max 1 re-send attempt per email

### Rule 4: Engagement Score Auto-Calculation

**Setup:**
- Email opened: +1 to `email_engagement_score`
- Link clicked: +1 additional
- Offer link clicked: +2 additional
- Purchase: Reset score to 0 (customer now)

### Rule 5: Unsubscribe = Remove from All Sequences

**Setup:**
- On unsubscribe → Remove all tags, stop all workflows
- Optional: Add to "Unsubscribed" segment for exclusion

### Rule 6: Time-Based Sending

**Setup:**
- Use GHL's "Send at specific time" feature
- Preferred times:
  - Mon-Wed: 9:00 AM (educational emails)
  - Thu-Fri: 1:00 PM (practical emails)
  - Sat-Sun: 8:00 PM (offer/decision emails)
- Avoid: 5-7 PM (dinner time), 11 PM-7 AM (sleep time)

### Rule 7: Mobile Optimization Check

**Setup:**
- All email templates must pass mobile preview test
- Minimum font size: 14px
- CTA buttons: Minimum 44px height (tap-friendly)
- Images: Max 600px width

---

## 🛠️ TROUBLESHOOTING GUIDE

### Issue: Low Open Rates (<30%)

**Possible Causes:**
- Spammy subject lines
- Sender name not recognized
- Poor sender reputation (deliverability issue)
- Sending at wrong time

**Solutions:**
1. A/B test subject lines (avoid ALL CAPS, excessive punctuation)
2. Use "Jade from Hello Little Sleepers" as sender name (personal + brand)
3. Check email authentication (SPF, DKIM, DMARC)
4. Test different send times
5. Re-engage list (clean out non-openers)

---

### Issue: High Unsubscribe Rate (>1%)

**Possible Causes:**
- Sending too frequently
- Content not relevant
- Overly sales-y
- Expectations not set properly

**Solutions:**
1. Reduce email frequency
2. Improve segmentation (send age-relevant content)
3. Balance value emails with offer emails (80/20 rule)
4. Set expectations in Welcome email ("We send one email per week")
5. Survey unsubscribers (exit survey)

---

### Issue: Low Click Rates (<5%)

**Possible Causes:**
- Weak CTAs
- No clear action
- Content not engaging
- Links not prominent

**Solutions:**
1. Strengthen CTA copy (action-oriented, benefit-driven)
2. Use button-style CTAs (not just text links)
3. Place CTA in multiple locations (mid-email + end)
4. Make links stand out visually
5. Test different CTA placements

---

### Issue: Decision Sequence Not Converting (<10%)

**Possible Causes:**
- Price objection
- Lack of trust/social proof
- Timing not right
- Offer not compelling

**Solutions:**
1. Add more social proof (testimonials, case studies)
2. Address objections directly in emails
3. Add urgency (limited time offer, bonuses)
4. Test different price points or bundle options
5. Offer payment plans if applicable
6. Add money-back guarantee

---

### Issue: Emails Going to Spam

**Possible Causes:**
- Email authentication not set up
- Spammy content/subject lines
- High complaint rate
- Poor sender reputation

**Solutions:**
1. Verify SPF, DKIM, DMARC records
2. Avoid spam trigger words (FREE, BUY NOW, LIMITED TIME)
3. Include physical address in footer (CAN-SPAM compliance)
4. Make unsubscribe link prominent
5. Use GHL's deliverability features
6. Warm up new domain/sender (start with small sends, increase gradually)

---

## ✅ POST-SETUP CHECKLIST

After building all sequences, complete this checklist:

### Testing Phase

- [ ] Send test emails to yourself for all templates
- [ ] Check mobile preview (iOS + Android)
- [ ] Verify all links work
- [ ] Confirm tracking codes fire correctly
- [ ] Test automation triggers (submit test form, add test tags)
- [ ] Verify sequences fire in correct order with correct delays
- [ ] Check that tags apply correctly
- [ ] Test IF/ELSE conditions work as expected
- [ ] Confirm Stripe/GHL purchase triggers Customer sequence

### Quality Assurance

- [ ] Proofread all email copy (grammar, spelling, links)
- [ ] Verify personalization tokens work ({{contact.first_name}})
- [ ] Check that age segmentation displays correct content
- [ ] Confirm unsubscribe link present and functional in all emails
- [ ] Test on multiple email clients (Gmail, Apple Mail, Outlook)
- [ ] Verify email authentication (SPF, DKIM, DMARC green)

### Dashboard & Reporting

- [ ] Set up HLS Email Performance dashboard
- [ ] Create weekly reporting schedule
- [ ] Set up alerts for key metrics (open rate drop, unsub spike)
- [ ] Connect Stripe revenue to GHL for attribution
- [ ] Bookmark dashboard for easy access

### Launch Prep

- [ ] Activate Free Lead Nurture sequence
- [ ] Import existing leads into appropriate sequences based on age/engagement
- [ ] Schedule announcement to existing list (optional: "We've improved our emails!")
- [ ] Set calendar reminder for Week 1 performance review
- [ ] Document any custom setup steps for future reference

---

## 📅 ONGOING MAINTENANCE SCHEDULE

### Weekly (Every Monday)

- [ ] Review email performance dashboard
- [ ] Check for deliverability issues
- [ ] Respond to any email replies from leads/customers
- [ ] Review A/B test results, declare winners
- [ ] Archive or update underperforming emails

### Monthly (First of Month)

- [ ] Full funnel review (Free Lead → Customer conversion rates)
- [ ] Update email copy based on performance insights
- [ ] Test new subject lines
- [ ] Review customer feedback/testimonials, add to emails
- [ ] Check engagement score distribution, adjust thresholds if needed

### Quarterly (Every 3 Months)

- [ ] Deep dive into email-attributed revenue
- [ ] Survey customers about email experience
- [ ] Update email templates with new branding if needed
- [ ] Review and refresh Dormant Nurture emails
- [ ] Test new sequences or offers

### Annually

- [ ] Complete email strategy overhaul review
- [ ] Update all email copy for tone/brand alignment
- [ ] Rebuild underperforming sequences
- [ ] Audit all automations for accuracy
- [ ] Clean email list (remove hard bounces, chronic non-openers)

---

**END OF GHL AUTOMATION SETUP GUIDE**

Total Sequences: 4 (Free Lead, Engaged, Decision, Customer)  
Total Emails: 16 core emails + re-engagement + dormant nurture  
Total Workflows: 7 (4 main sequences + re-engagement + dormant + customer ongoing)

Next Step: Build Email Differentiation Strategy document
