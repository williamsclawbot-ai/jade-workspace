# Newsletter API Fix - CRITICAL

## Problem Diagnosed (Feb 20, 2026 2am)

The newsletter generation API is broken because of **TWO issues**:

### Issue #1: ANTHROPIC_API_KEY Missing from Vercel ⚠️
**Status**: CRITICAL - This is why production is failing

The API route expects `process.env.ANTHROPIC_API_KEY` but it's **NOT SET in Vercel**.

**Vercel environment variables currently set:**
- ✅ META_AD_ACCOUNT_ID
- ✅ META_ACCESS_TOKEN  
- ✅ STRIPE_RESTRICTED_KEY
- ✅ OHIGHLEVEL_API_TOKEN (typo: missing "G")
- ❌ **ANTHROPIC_API_KEY** ← MISSING!

### Issue #2: .env.local API Key is Invalid ⚠️
**Status**: SECONDARY - This won't affect production but will break local development

The `ANTHROPIC_API_KEY` in `.env.local` returns authentication error when tested:
```
sk-ant-api03-[REDACTED]
```

API response: `{"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"}}`

This key is either:
- Revoked/deleted
- Never valid (test data)
- Expired

---

## The Fix (Requires Jade's Action)

### Step 1: Get a Valid Anthropic API Key
1. Go to https://console.anthropic.com/settings/keys
2. Log in with your Anthropic account
3. Create a new API key (or copy an existing valid one)
4. **IMPORTANT**: Copy the full key immediately (you can only see it once)

### Step 2: Add to Vercel (PRODUCTION FIX)
```bash
cd /Users/williams/.openclaw/workspace/jade-workspace
vercel env add ANTHROPIC_API_KEY
```
- When prompted, paste your API key
- Select: Production, Preview, Development (all three)
- Confirm

### Step 3: Update .env.local (LOCAL FIX)
Edit `/Users/williams/.openclaw/workspace/jade-workspace/apps/mission-control/.env.local`:
```bash
ANTHROPIC_API_KEY=sk-ant-api03-YOUR-NEW-VALID-KEY-HERE
```

### Step 4: Redeploy
```bash
cd /Users/williams/.openclaw/workspace/jade-workspace
git add .
git commit -m "Update environment config for newsletter API"
git push
```
Vercel will auto-deploy. Wait ~1 minute.

### Step 5: Test
1. Go to https://jade-workspace.vercel.app
2. Click "Newsletter" in sidebar
3. Pick a topic for a week
4. Click "📝 Generate Draft"
5. Should work within 3-5 seconds!

---

## Why This Happened

**Root cause**: Environment variables in `.env.local` are ONLY used in local development. They don't get deployed to Vercel.

When you deploy to Vercel, you must **explicitly add environment variables** using the Vercel dashboard or CLI.

The newsletter API code is correct. It's purely a configuration issue.

---

## Code Review Summary

✅ **API route code**: CORRECT  
✅ **Component code**: CORRECT  
✅ **Request/response flow**: CORRECT  
✅ **Error handling**: CORRECT  

❌ **Environment config**: MISSING KEY IN PRODUCTION  
❌ **Local .env.local key**: INVALID/REVOKED  

---

## Alternative: Use OpenAI Instead (If No Anthropic Account)

If you don't have an Anthropic account or prefer OpenAI, I can rewrite the API to use OpenAI GPT-4 instead:

1. Get OpenAI API key from https://platform.openai.com/api-keys
2. Add `OPENAI_API_KEY` to Vercel
3. I'll update the code to use OpenAI instead of Claude

Let me know which you prefer!

---

*Diagnosed: Feb 20, 2026 2:00 AM Brisbane*  
*Status: AWAITING JADE'S API KEY*
