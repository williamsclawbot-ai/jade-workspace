import { NextResponse } from 'next/server';

const STRIPE_RESTRICTED_KEY = process.env.STRIPE_RESTRICTED_KEY;
const STRIPE_API_URL = 'https://api.stripe.com/v1';

interface StripeRevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  previousMonthRevenue: number;
  growth: number;
  recentCharges: Array<{
    id: string;
    amount: number;
    currency: string;
    date: string;
    customerName: string;
    status: string;
  }>;
  subscriptionRevenue: number;
  activeSubscriptions: number;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
  }>;
  lastUpdated: string;
}

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

export async function GET() {
  try {
    if (!STRIPE_RESTRICTED_KEY) {
      return NextResponse.json(
        { error: 'Stripe API key not configured' },
        { status: 500 }
      );
    }

    // Fetch all charges
    const chargesResponse = await stripeApiCall<any>('/charges', {
      limit: 100,
    });

    // Fetch all subscriptions
    const subscriptionsResponse = await stripeApiCall<any>('/subscriptions', {
      limit: 100,
    });

    // Fetch customers for names
    const customersResponse = await stripeApiCall<any>('/customers', {
      limit: 100,
    });

    // Create customer name map for quick lookup
    const customerMap = new Map();
    customersResponse.data.forEach((customer: any) => {
      customerMap.set(customer.id, customer.name || customer.email || 'Unknown');
    });

    // Calculate total revenue from charges
    let totalRevenue = 0;
    const chargesData: StripeRevenueData['recentCharges'] = [];

    chargesResponse.data.forEach((charge: any) => {
      totalRevenue += charge.amount / 100; // Convert cents to dollars

      if (chargesData.length < 10) {
        chargesData.push({
          id: charge.id,
          amount: charge.amount / 100,
          currency: charge.currency.toUpperCase(),
          date: new Date(charge.created * 1000).toISOString(),
          customerName: customerMap.get(charge.customer) || 'Unknown',
          status: charge.status,
        });
      }
    });

    // Calculate subscription revenue
    let subscriptionRevenue = 0;
    let activeSubscriptions = 0;

    subscriptionsResponse.data.forEach((subscription: any) => {
      if (subscription.status === 'active') {
        activeSubscriptions++;
        // Calculate monthly subscription value
        if (subscription.items.data.length > 0) {
          subscription.items.data.forEach((item: any) => {
            if (item.price.recurring) {
              if (item.price.recurring.interval === 'month') {
                subscriptionRevenue += (item.price.unit_amount || 0) / 100;
              } else if (item.price.recurring.interval === 'year') {
                subscriptionRevenue += (item.price.unit_amount || 0) / 100 / 12;
              }
            }
          });
        }
      }
    });

    // Calculate monthly revenue breakdown for last 6 months
    const today = new Date();
    const monthlyBreakdown: StripeRevenueData['monthlyBreakdown'] = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStart = Math.floor(monthDate.getTime() / 1000);
      const monthEnd =
        i === 0
          ? Math.floor(today.getTime() / 1000)
          : Math.floor(
              new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getTime() / 1000
            );

      const monthCharges = await stripeApiCall<any>('/charges', {
        created: `${monthStart}..${monthEnd}`,
        limit: 100,
      });

      let monthRevenue = 0;
      monthCharges.data.forEach((charge: any) => {
        monthRevenue += charge.amount / 100;
      });

      monthlyBreakdown.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        revenue: Math.round(monthRevenue * 100) / 100,
      });
    }

    // Calculate current and previous month revenue
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currentMonthEnd = today;
    const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const prevMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const currentMonthCharges = await stripeApiCall<any>('/charges', {
      created: `${Math.floor(currentMonthStart.getTime() / 1000)}..${Math.floor(currentMonthEnd.getTime() / 1000)}`,
      limit: 100,
    });

    const prevMonthCharges = await stripeApiCall<any>('/charges', {
      created: `${Math.floor(prevMonthStart.getTime() / 1000)}..${Math.floor(prevMonthEnd.getTime() / 1000)}`,
      limit: 100,
    });

    let monthlyRevenue = 0;
    let previousMonthRevenue = 0;

    currentMonthCharges.data.forEach((charge: any) => {
      monthlyRevenue += charge.amount / 100;
    });

    prevMonthCharges.data.forEach((charge: any) => {
      previousMonthRevenue += charge.amount / 100;
    });

    // Calculate growth percentage
    const growth =
      previousMonthRevenue > 0
        ? Math.round(((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 1000) / 10
        : 0;

    const data: StripeRevenueData = {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      previousMonthRevenue: Math.round(previousMonthRevenue * 100) / 100,
      growth,
      recentCharges: chargesData,
      subscriptionRevenue: Math.round(subscriptionRevenue * 100) / 100,
      activeSubscriptions,
      monthlyBreakdown,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Stripe data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch Stripe revenue data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
