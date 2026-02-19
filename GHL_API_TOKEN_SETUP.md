# GHL API Token Setup for Funnel Analysis Dashboard

## Issue Detected

The Funnel Analysis Dashboard is built and deployed, but it needs a valid GoHighLevel API token to work. The current token in `.env.local` appears to be a test/sandbox token that's not valid.

---

## What You Need to Do

### Step 1: Get Your Valid GHL API Token

1. **Log in to GoHighLevel**: Go to https://app.gohighlevel.com
2. **Navigate to Settings**: 
   - Click your profile icon (top right)
   - Select "Settings" → "API & Integrations"
   - Or go directly: https://app.gohighlevel.com/settings/api
3. **Generate API Key**:
   - Look for "API Key" section (might be under "API" or "Integrations")
   - If you don't have one, click "Generate" or "Create API Key"
   - Copy the API key (looks like: `pit-xxxxx-xxxxx-xxxxx` or longer alphanumeric string)

### Step 2: Update the Token in Vercel

Option A: Via CLI (recommended)
```bash
cd ~/jade-workspace/apps/mission-control
vercel env rm GOHIGHLEVEL_API_TOKEN production
vercel env add GOHIGHLEVEL_API_TOKEN production
# Then paste your new token when prompted
```

Option B: Via Vercel Web Dashboard
1. Go to: https://vercel.com/williamsclawbot-ais-projects/mission-control
2. Click "Settings" → "Environment Variables"
3. Find `GOHIGHLEVEL_API_TOKEN` 
4. Click edit (pencil icon)
5. Replace with your new token
6. Save

### Step 3: Trigger a Redeploy

```bash
cd ~/jade-workspace/apps/mission-control
vercel --prod
```

This will rebuild and deploy with the new token.

---

## How to Verify It Works

Once redeployed (takes ~2-3 minutes):

1. Open: https://jade-workspace.vercel.app
2. Click "Funnel Analysis" in the left sidebar (under BUSINESS section)
3. You should see:
   - Key metrics loading (Total Leads, Overall Conversion %, etc.)
   - A funnel visualization
   - Recommendations appear
   - No error messages

If you still see errors:
- Check that the token is correct (copy/paste carefully, no extra spaces)
- Verify the token has the right API permissions (Contacts, Opportunities)
- Try refreshing the page (browser cache might be old)
- Check the browser console (F12 → Console tab) for detailed error messages

---

## API Token Permissions Required

Your GHL API token should have at least these permissions:
- ✅ Read Contacts
- ✅ Read Opportunities  
- ✅ Read Products

The token is read-only, so it's safe—it can't modify anything in your GHL account.

---

## Current Token Status

**Current token**: `pit-03aa8ac2-f6cb-4644-951d-c64f4682ca38` (test/invalid)
**Location in code**: Vercel environment variable (production)
**Next action**: Replace with valid token from your GHL account

---

## What This Dashboard Does (Once Working)

When the token is valid, you'll see:

1. **Your Real Customer Data**:
   - How many free leads you have
   - How many are engaged
   - How many became customers
   - Total revenue by guide

2. **Conversion Funnel**:
   - Visual breakdown of where people drop off
   - Identifies the biggest bottleneck

3. **Revenue Opportunity**:
   - Specific recommendations to increase revenue
   - Dollar amounts for each improvement
   - Time/effort required for each

4. **Quick Wins**:
   - Deploy nurture sequence: +$555-1,110/month (15 min)
   - Optimize sales pages: +$1,110/month (2-3 hours)
   - Add follow-up automation: +$2,000-5,000/year (1-2 hours)

---

## Questions?

If you run into issues:
1. Check that your GHL token is valid (test by visiting GHL settings to confirm it's there)
2. Make sure you copied it correctly (no spaces, special characters intact)
3. Try redeploying even if no changes were made
4. Check browser console (F12) for error messages that might help diagnose

The API endpoint should start working immediately once a valid token is in place.
