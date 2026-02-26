# Revenue Dashboard

## Overview
The Revenue Dashboard provides a comprehensive view of Hello Little Sleepers' business performance, tracking progress toward the $10K/month revenue goal with real-time data from Stripe and GoHighLevel.

## Access
Navigate to **Business → Revenue Dashboard** in the Mission Control sidebar.

## Features

### 1. $10K Goal Progress
- **Visual progress bar** showing percentage toward monthly goal
- **Current month revenue** vs target
- **Remaining amount** needed to hit goal
- **Month-over-month growth** percentage

### 2. Key Performance Indicators (KPIs)
| Metric | Description | Source |
|--------|-------------|--------|
| This Month Revenue | Current month's total revenue | Stripe |
| Total Revenue | All-time revenue since tracking | Stripe |
| Avg Transaction Value | Average per successful charge | Stripe |
| Won Deals | Closed opportunities count | GHL |

### 3. Funnel Metrics
- **Total Contacts**: 287 (from GHL)
- **Open Opportunities**: Active deals in pipeline
- **Repeat Customers**: Customers with multiple purchases
- **Conversion Rate**: Contacts → Won deals percentage

### 4. Revenue Breakdown

#### By Product
- Q&A Calls ($75 each)
- Hello Little Fix ($225)
- Sleep Guides ($39.95)
- Bundles and other products

#### Monthly Trend
6-month revenue history with visual bar chart

### 5. Pipeline Visualization
Shows leads moving through stages:
- New Lead → Engaged → Proposal Sent → Won/Lost

### 6. Customer Insights
- **Top 5 customers** by lifetime value
- **Recent transactions** (last 10)
- **New vs repeat customers**

## Data Sources

### Stripe (Payments)
- Real charge data
- Customer information
- Transaction history
- Revenue calculations

### GoHighLevel (CRM)
- Contact database
- Opportunity pipeline
- Won/lost deals
- Conversion tracking

## Refresh
- Data auto-refreshes every 5 minutes
- Click **Refresh** button for immediate update
- Last updated timestamp shown at bottom

## Goal Tracking
The $10,000 monthly goal is hardcoded in the API. To adjust:
1. Edit `/app/api/dashboard/revenue/route.ts`
2. Change `const REVENUE_GOAL = 10000;`

## Troubleshooting

### "Error Loading Dashboard"
- Check that `.env.local` has valid API keys
- Verify Stripe key has read access to charges
- Verify GHL token has contacts/opportunities scope

### Data shows demo values
- This happens when APIs fail or keys are missing
- Dashboard will still function with placeholder data
- Check server logs for API error details

## Future Enhancements
- [ ] Export to PDF/CSV
- [ ] Custom date range selection
- [ ] Year-over-year comparison
- [ ] Revenue forecasting
- [ ] Cohort analysis
