# Task 6: Woolworths Grocery Integration Research
**Generated:** February 20, 2026 — 11:30 PM

## 🔍 Research Summary

I researched three potential approaches for integrating Woolworths online shopping into your workflow:
1. OpenClaw's browser automation capabilities
2. Coles & Woolworths MCP server
3. Best recommended approach

---

## 1. OpenClaw Browser Automation Capabilities

### ✅ What OpenClaw CAN Do:

#### **Web Browsing & Navigation**
- Open and navigate websites (including Woolworths online)
- Execute JavaScript and interact with dynamic pages
- Take screenshots and snapshots of web pages

#### **Login & Authentication**
- Automatically fill in login forms (username + password)
- Handle form submissions
- Preserve logged-in sessions using browser profiles
- Use Chrome extension mode to maintain your existing logged-in session

#### **Form Filling & Data Entry**
- Automatically fill out forms
- Enter data into fields (search boxes, quantity selectors)
- Click buttons and navigate through multi-step processes

#### **Data Extraction**
- Extract product names, prices, availability
- Scrape web content and convert to structured data
- Copy/paste and repetitive browser actions

#### **Cart Management**
- Search for products
- Add items to cart
- Update quantities
- Remove items

### ❌ What OpenClaw CANNOT/SHOULD NOT Do:

- **Place orders or checkout** (intentional safety boundary — you don't want accidental orders!)
- **Bypass CAPTCHAs** reliably (some sites have anti-bot protections)
- **Access closed APIs** without proper authentication

---

## 2. Coles & Woolworths MCP Server

### What It Is:
A **Model Context Protocol (MCP) server** that integrates with Coles and Woolworths APIs to fetch real-time product information and prices.

**Source:** [GitHub - hung-ngm/coles-woolworths-mcp-server](https://github.com/hung-ngm/coles-woolworths-mcp-server)

### What It Does:
- ✅ Search for products by name or keyword
- ✅ Compare prices between Coles and Woolworths
- ✅ Fetch real-time product information (price, brand, size, availability)
- ✅ No login required (uses public product search APIs)

### What It CANNOT Do:
- ❌ Add items to your personal cart
- ❌ Access your account or past orders
- ❌ Place orders or checkout

### How It Would Work:
1. Install the MCP server as an OpenClaw skill
2. Use it to search for products and compare prices
3. Build a shopping list based on search results
4. **Separately**, you'd manually log into Woolworths and add items to cart

### Installation:
```bash
# Clone the repo
git clone https://github.com/hung-ngm/coles-woolworths-mcp-server.git

# Install dependencies
pip install -r requirements.txt

# Configure OpenClaw to use the MCP server
# Add to ~/.openclaw/config.json
```

---

## 3. Best Approach Recommendation

### 🎯 **Hybrid Approach: MCP Server + Browser Automation**

Here's how I recommend setting this up for Jade:

#### **Phase 1: Product Search & List Building (MCP Server)**
Use the Coles & Woolworths MCP server to:
- Search for products by name
- Compare prices between stores
- Get product information (brand, size, availability)
- Build a structured shopping list with product IDs and prices

**Why MCP first?** It's faster, more reliable, and doesn't require login. Perfect for research and list-building.

---

#### **Phase 2: Cart Building (Browser Automation)**
Use OpenClaw's browser automation to:
- Log into Woolworths.com.au (using saved credentials)
- Search for each product from the list
- Add items to cart with correct quantities
- Handle any out-of-stock substitutions
- Stop BEFORE checkout

**Why browser automation?** It can interact with your actual account and cart. Perfect for execution.

---

#### **Phase 3: Review & Submit (Manual by Jade)**
- Jade reviews the cart
- Makes any adjustments (swap items, change quantities)
- Approves the order
- Manually clicks "Checkout" and completes payment

**Why manual?** Safety + control. You never want automated checkout. Ever.

---

## 🛠️ Implementation Plan

### Step 1: Install Coles & Woolworths MCP Server
```bash
cd ~/.openclaw/workspace/skills
git clone https://github.com/hung-ngm/coles-woolworths-mcp-server.git woolworths-mcp
cd woolworths-mcp
pip install -r requirements.txt
```

### Step 2: Create Weekly Grocery Workflow Skill
Create a new skill: `~/.openclaw/workspace/skills/grocery-cart-builder/SKILL.md`

**Workflow:**
1. Jade provides her meal plan for the week
2. I extract ingredients needed
3. I use MCP server to search Woolworths for each ingredient
4. I build a shopping list with product IDs, prices, and quantities
5. I use browser automation to log into Woolworths and add items to cart
6. I notify Jade: "Your cart is ready for review at [Woolworths.com.au]"
7. Jade reviews, adjusts, and manually checks out

### Step 3: Set Up Browser Profile for Woolworths
Save Jade's Woolworths login credentials securely:
```bash
# Store encrypted credentials
openclaw config set woolworths.email "jade@example.com"
openclaw config set woolworths.password "secure_password"
```

### Step 4: Create Automation Script
**Trigger:** "Build my grocery cart for this week"

**Process:**
1. Load meal plan from file or Discord message
2. Extract ingredients
3. Search MCP server for products
4. Build structured shopping list
5. Open browser → Woolworths.com.au
6. Log in (using saved credentials)
7. Search and add each item to cart
8. Take screenshot of cart
9. Send to Jade: "Your cart is ready! Review here: [link]"

---

## ⚠️ Important Safety Constraints

### 🔒 Never Automate:
- ❌ Checkout or payment
- ❌ Order submission
- ❌ Changing delivery address
- ❌ Applying payment methods

### ✅ Always Require Manual:
- Review of cart contents
- Approval before checkout
- Payment confirmation
- Order submission

---

## 💡 Additional Features We Could Add

### 1. **Staples List Management**
- Maintain a list of items you buy every week (milk, bread, eggs, etc.)
- Automatically add them to cart without needing to specify each time

### 2. **Price Tracking**
- Track price history for your most-bought items
- Alert you when prices drop
- Suggest switching to cheaper alternatives

### 3. **Meal-to-Cart Automation**
- Jade picks meals for the week from your meal database
- I automatically extract ingredients
- Search, build list, and add to cart
- One command: "Build cart for [meal1, meal2, meal3]"

### 4. **Smart Substitutions**
- If an item is out of stock, suggest alternatives
- Remember your preferences for next time

### 5. **Budget Tracking**
- Track your weekly grocery spend
- Alert you if cart total exceeds budget
- Suggest cheaper alternatives

---

## 📊 Expected Workflow (Week-to-Week)

### Monday Night (Meal Planning)
Jade: "Plan meals for this week"  
Me: [Suggests 7 meals based on preferences, season, etc.]  
Jade: "Approve"

### Tuesday Morning (Grocery Cart)
Me: [Automatically extracts ingredients, searches Woolworths, builds cart]  
Me: "Your cart is ready! Total: $127. Review here: [link]"

### Tuesday Afternoon (Review & Submit)
Jade: [Reviews cart, makes adjustments, checks out manually]

### Result:
- ⏱️ **Time saved:** 30-45 minutes per week
- 💰 **Money saved:** Price comparison ensures best deals
- 🧠 **Mental load reduced:** No more "what's for dinner?" panic

---

## 🎯 Next Steps

### Immediate (This Week):
1. **Decide:** Do you want this feature?
2. **Test:** I'll do a test run with a sample meal plan
3. **Iterate:** Based on your feedback, refine the workflow

### Short-Term (Next 2 Weeks):
1. Install Coles & Woolworths MCP server
2. Set up browser automation for Woolworths login
3. Create grocery cart builder skill
4. Test with one week's meal plan

### Long-Term (Next Month):
1. Integrate with meal planning system
2. Add staples list management
3. Build price tracking + budget alerts
4. Optimize substitution logic

---

## 💬 My Recommendation

**Yes, this is 100% doable** using the hybrid approach (MCP server + browser automation).

**Expected ROI:**
- **Time saved:** 30-45 min/week = 26-39 hours/year
- **Mental load:** Massive reduction in decision fatigue
- **Money saved:** Price comparison + tracking = $500-1000/year

**Effort to build:** 4-6 hours (one weekend sprint)

**Your call, Jade.** If you want this, I'll build it this weekend and have it ready for testing next week.

---

*End of Task 6 Report*
