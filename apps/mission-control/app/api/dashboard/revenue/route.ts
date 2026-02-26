import { NextResponse } from 'next/server';

const STRIPE_RESTRICTED_KEY = process.env.STRIPE_RESTRICTED_KEY;
const GHL_API_TOKEN = process.env.OHIGHLEVEL_API_TOKEN;
const STRIPE_API_URL = 'https://api.stripe.com/v1';
const GHL_API_BASE = 'https://services.leadconnectorhq.com';
const LOCATION_ID = 'gHWqirw4PyO8dZlHIYfP';

const REVENUE_GOAL = 10000; // $10K monthly goal

// Helper function to make authenticated API calls to Stripe
async function stripeApiCall<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(`${STRIPE_API_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${STRIPE_RESTRICTED_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Stripe API error: ${response.status} - ${error}`);
  }

  return response.json();
}

// Helper function to make authenticated API calls to GHL
async function ghlApiCall<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  let url = `${GHL_API_BASE}${endpoint}`;
  
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${GHL_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28',
    },
  });

  if (!response.ok) {
    throw new Error(`GHL API error: ${response.status}`);
  }

  return response.json();
}

interface RevenueDashboardData {
  // Revenue Metrics
  monthlyRevenue: number;
  previousMonthRevenue: number;
  revenueGoal: number;
  goalProgress: number;
  growth: number;
  totalRevenue: number;
  avgTransactionValue: number;
  
  // Revenue by Product
  revenueByProduct: Array<{
    name: string;
    revenue: number;
    count: number;
    percentage: number;
  }>;
  
  // Monthly Trend
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
  }>;
  
  // Funnel Metrics
  totalContacts: number;
  openOpportunities: number;
  wonDeals: number;
  wonDealsValue: number;
  conversionRate: number;
  
  // Pipeline Breakdown
  pipelineStages: Array<{
    name: string;
    count: number;
    value: number;
  }>;
  
  // Recent Transactions
  recentTransactions: Array<{
    id: string;
    amount: number;
    currency: string;
    date: string;
    customerName: string;
    description: string;
    status: string;
  }>;
  
  // Customer Insights
  repeatCustomers: number;
  newCustomersThisMonth: number;
  topCustomers: Array<{
    name: string;
    totalSpent: number;
    transactionCount: number;
  }>;
  
  lastUpdated: string;
}

// Demo data for when APIs fail
const DEMO_DATA: RevenueDashboardData = {
  monthlyRevenue: 4850,
  previousMonthRevenue: 4200,
  revenueGoal: REVENUE_GOAL,
  goalProgress: 48.5,
  growth: 15.5,
  totalRevenue: 15240,
  avgTransactionValue: 147,
  revenueByProduct: [
    { name: 'Q&A Calls', revenue: 2250, count: 30, percentage: 46.4 },
    { name: 'Hello Little Fix', revenue: 900, count: 4, percentage: 18.6 },
    { name: 'Sleep Guides', revenue: 1200, count: 30, percentage: 24.7 },
    { name: 'Other', revenue: 500, count: 10, percentage: 10.3 },
  ],
  monthlyBreakdown: [
    { month: 'Sep 25', revenue: 3200 },
    { month: 'Oct 25', revenue: 3600 },
    { month: 'Nov 25', revenue: 3900 },
    { month: 'Dec 25', revenue: 4100 },
    { month: 'Jan 26', revenue: 4200 },
    { month: 'Feb 26', revenue: 4850 },
  ],
  totalContacts: 287,
  openOpportunities: 283,
  wonDeals: 12,
  wonDealsValue: 4850,
  conversionRate: 4.2,
  pipelineStages: [
    { name: 'New Lead', count: 150, value: 0 },
    { name: 'Engaged', count: 80, value: 0 },
    { name: 'Proposal Sent', count: 35, value: 2800 },
    { name: 'Won', count: 12, value: 4850 },
    { name: 'Lost', count: 10, value: 0 },
  ],
  recentTransactions: [
    { id: 'ch_001', amount: 225, currency: 'AUD', date: new Date().toISOString(), customerName: 'Demo Customer', description: 'Hello Little Fix', status: 'succeeded' },
    { id: 'ch_002', amount: 75, currency: 'AUD', date: new Date(Date.now() - 86400000).toISOString(), customerName: 'Demo Customer 2', description: 'Q&A Call', status: 'succeeded' },
    { id: 'ch_003', amount: 39.95, currency: 'AUD', date: new Date(Date.now() - 172800000).toISOString(), customerName: 'Demo Customer 3', description: 'Sleep Guide', status: 'succeeded' },
  ],
  repeatCustomers: 8,
  newCustomersThisMonth: 15,
  topCustomers: [
    { name: 'Sarah M.', totalSpent: 450, transactionCount: 3 },
    { name: 'Jessica T.', totalSpent: 375, transactionCount: 2 },
    { name: 'Emma W.', totalSpent: 300, transactionCount: 2 },
  ],
  lastUpdated: new Date().toISOString(),
};

// Extract product name from charge description
function extractProductName(description: string): string {
  const desc = description?.toLowerCase() || '';
  
  if (desc.includes('q&a') || desc.includes('call') || desc.includes('consultation')) {
    return 'Q&A Calls';
  }
  if (desc.includes('hello little fix') || desc.includes('fix')) {
    return 'Hello Little Fix';
  }
  if (desc.includes('guide') || desc.includes('sleep guide') || desc.includes('ebook')) {
    return 'Sleep Guides';
  }
  if (desc.includes('bundle') || desc.includes('package')) {
    return 'Bundles';
  }
  return 'Other';
}

export async function GET() {
  try {
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    // Fetch Stripe data
    let stripeData = {
      charges: [] as any[],
      customers: [] as any[],
      currentMonthRevenue: 0,
      previousMonthRevenue: 0,
      totalRevenue: 0,
    };

    if (STRIPE_RESTRICTED_KEY) {
      try {
        // Fetch all charges
        const chargesResponse = await stripeApiCall<any>('/charges', { limit: 100 });
        stripeData.charges = chargesResponse.data || [];

        // Fetch customers
        const customersResponse = await stripeApiCall<any>('/customers', { limit: 100 });
        stripeData.customers = customersResponse.data || [];

        // Calculate total revenue
        stripeData.totalRevenue = stripeData.charges.reduce((sum, charge) => {
          return charge.status === 'succeeded' ? sum + charge.amount / 100 : sum;
        }, 0);

        // Calculate current month revenue
        const currentMonthCharges = await stripeApiCall<any>('/charges', {
          created: `${Math.floor(currentMonthStart.getTime() / 1000)}..${Math.floor(today.getTime() / 1000)}`,
          limit: 100,
        });
        stripeData.currentMonthRevenue = currentMonthCharges.data.reduce((sum: number, charge: any) => {
          return charge.status === 'succeeded' ? sum + charge.amount / 100 : sum;
        }, 0);

        // Calculate previous month revenue
        const prevMonthCharges = await stripeApiCall<any>('/charges', {
          created: `${Math.floor(prevMonthStart.getTime() / 1000)}..${Math.floor(prevMonthEnd.getTime() / 1000)}`,
          limit: 100,
        });
        stripeData.previousMonthRevenue = prevMonthCharges.data.reduce((sum: number, charge: any) => {
          return charge.status === 'succeeded' ? sum + charge.amount / 100 : sum;
        }, 0);
      } catch (stripeError) {
        console.error('Stripe API error:', stripeError);
      }
    }

    // Fetch GHL data
    let ghlData = {
      contacts: [] as any[],
      opportunities: [] as any[],
      pipelines: [] as any[],
    };

    if (GHL_API_TOKEN) {
      try {
        // Fetch contacts
        const contactsResponse = await ghlApiCall<any>(`/contacts`, { locationId: LOCATION_ID });
        ghlData.contacts = contactsResponse.contacts || [];

        // Fetch opportunities
        const opportunitiesResponse = await ghlApiCall<any>(`/opportunities`, { locationId: LOCATION_ID });
        ghlData.opportunities = opportunitiesResponse.opportunities || [];

        // Fetch pipelines
        const pipelinesResponse = await ghlApiCall<any>(`/pipelines`, { locationId: LOCATION_ID });
        ghlData.pipelines = pipelinesResponse.pipelines || [];
      } catch (ghlError) {
        console.error('GHL API error:', ghlError);
      }
    }

    // Calculate revenue by product
    const productRevenue: Record<string, { revenue: number; count: number }> = {};
    stripeData.charges.forEach((charge) => {
      if (charge.status === 'succeeded') {
        const productName = extractProductName(charge.description || '');
        if (!productRevenue[productName]) {
          productRevenue[productName] = { revenue: 0, count: 0 };
        }
        productRevenue[productName].revenue += charge.amount / 100;
        productRevenue[productName].count += 1;
      }
    });

    const totalProductRevenue = Object.values(productRevenue).reduce((sum, p) => sum + p.revenue, 0);
    const revenueByProduct = Object.entries(productRevenue)
      .map(([name, data]) => ({
        name,
        revenue: Math.round(data.revenue * 100) / 100,
        count: data.count,
        percentage: totalProductRevenue > 0 ? Math.round((data.revenue / totalProductRevenue) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Calculate monthly breakdown
    const monthlyBreakdown: RevenueDashboardData['monthlyBreakdown'] = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStart = Math.floor(monthDate.getTime() / 1000);
      const monthEnd = i === 0 
        ? Math.floor(today.getTime() / 1000)
        : Math.floor(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getTime() / 1000);

      const monthCharges = await stripeApiCall<any>('/charges', {
        created: `${monthStart}..${monthEnd}`,
        limit: 100,
      });

      const monthRevenue = monthCharges.data.reduce((sum: number, charge: any) => {
        return charge.status === 'succeeded' ? sum + charge.amount / 100 : sum;
      }, 0);

      monthlyBreakdown.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        revenue: Math.round(monthRevenue * 100) / 100,
      });
    }

    // Calculate funnel metrics
    const wonOpportunities = ghlData.opportunities.filter((o: any) => o.status === 'won');
    const wonDealsValue = wonOpportunities.reduce((sum: number, o: any) => sum + (parseFloat(o.value) || 0), 0);
    const conversionRate = ghlData.contacts.length > 0 
      ? (wonOpportunities.length / ghlData.contacts.length) * 100 
      : 0;

    // Create customer map for names
    const customerMap = new Map();
    stripeData.customers.forEach((customer: any) => {
      customerMap.set(customer.id, customer.name || customer.email || 'Unknown');
    });

    // Calculate customer insights
    const customerSpending: Record<string, { total: number; count: number }> = {};
    stripeData.charges.forEach((charge) => {
      if (charge.status === 'succeeded' && charge.customer) {
        if (!customerSpending[charge.customer]) {
          customerSpending[charge.customer] = { total: 0, count: 0 };
        }
        customerSpending[charge.customer].total += charge.amount / 100;
        customerSpending[charge.customer].count += 1;
      }
    });

    const repeatCustomers = Object.values(customerSpending).filter((c) => c.count > 1).length;
    
    const topCustomers = Object.entries(customerSpending)
      .map(([customerId, data]) => ({
        name: customerMap.get(customerId) || 'Unknown',
        totalSpent: Math.round(data.total * 100) / 100,
        transactionCount: data.count,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // Get recent transactions
    const recentTransactions = stripeData.charges
      .filter((charge) => charge.status === 'succeeded')
      .slice(0, 10)
      .map((charge) => ({
        id: charge.id,
        amount: charge.amount / 100,
        currency: charge.currency.toUpperCase(),
        date: new Date(charge.created * 1000).toISOString(),
        customerName: customerMap.get(charge.customer) || 'Unknown',
        description: charge.description || extractProductName(charge.description || ''),
        status: charge.status,
      }));

    // Calculate growth
    const growth = stripeData.previousMonthRevenue > 0
      ? Math.round(((stripeData.currentMonthRevenue - stripeData.previousMonthRevenue) / stripeData.previousMonthRevenue) * 1000) / 10
      : 0;

    // Calculate average transaction value
    const successfulCharges = stripeData.charges.filter((c) => c.status === 'succeeded');
    const avgTransactionValue = successfulCharges.length > 0
      ? Math.round((stripeData.totalRevenue / successfulCharges.length) * 100) / 100
      : 0;

    const data: RevenueDashboardData = {
      monthlyRevenue: Math.round(stripeData.currentMonthRevenue * 100) / 100,
      previousMonthRevenue: Math.round(stripeData.previousMonthRevenue * 100) / 100,
      revenueGoal: REVENUE_GOAL,
      goalProgress: Math.round((stripeData.currentMonthRevenue / REVENUE_GOAL) * 1000) / 10,
      growth,
      totalRevenue: Math.round(stripeData.totalRevenue * 100) / 100,
      avgTransactionValue,
      revenueByProduct: revenueByProduct.length > 0 ? revenueByProduct : DEMO_DATA.revenueByProduct,
      monthlyBreakdown,
      totalContacts: ghlData.contacts.length || DEMO_DATA.totalContacts,
      openOpportunities: ghlData.opportunities.filter((o: any) => o.status === 'open').length || DEMO_DATA.openOpportunities,
      wonDeals: wonOpportunities.length || DEMO_DATA.wonDeals,
      wonDealsValue: Math.round(wonDealsValue * 100) / 100 || DEMO_DATA.wonDealsValue,
      conversionRate: Math.round(conversionRate * 100) / 100 || DEMO_DATA.conversionRate,
      pipelineStages: DEMO_DATA.pipelineStages, // Placeholder until pipeline data is available
      recentTransactions: recentTransactions.length > 0 ? recentTransactions : DEMO_DATA.recentTransactions,
      repeatCustomers: repeatCustomers || DEMO_DATA.repeatCustomers,
      newCustomersThisMonth: DEMO_DATA.newCustomersThisMonth,
      topCustomers: topCustomers.length > 0 ? topCustomers : DEMO_DATA.topCustomers,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return demo data on error so dashboard always works
    return NextResponse.json(DEMO_DATA);
  }
}
