import { NextResponse } from 'next/server';

const GHL_API_TOKEN = process.env.OHIGHLEVEL_API_TOKEN;
const GHL_API_BASE = 'https://api.gohighlevel.com/v1';

interface MetricsResponse {
  subscribers: number;
  monthlyRevenue: number;
  openOpportunities: number;
  conversionRate: number;
  mrr: number;
  avgDealValue: number;
  pipelineValue: number;
  lastUpdated: string;
}

async function fetchGHLData(endpoint: string) {
  const url = `${GHL_API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`GHL API Error: ${response.status} ${response.statusText}`);
      throw new Error(`GHL API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

export async function GET() {
  try {
    if (!GHL_API_TOKEN) {
      return NextResponse.json(
        { error: 'GHL API token not configured' },
        { status: 500 }
      );
    }

    // Fetch contacts for subscriber count (location-specific)
    const LOCATION_ID = 'gHWqirw4PyO8dZlHIYfP';
    const contactsData = await fetchGHLData(`/locations/${LOCATION_ID}/contacts`);
    const subscribers = contactsData.total || contactsData.contacts?.length || 0;

    // Fetch opportunities for revenue and pipeline data (location-specific)
    const opportunitiesData = await fetchGHLData(`/locations/${LOCATION_ID}/opportunities`);
    const opportunities = opportunitiesData.opportunities || [];
    
    // Calculate metrics from opportunities
    let monthlyRevenue = 0;
    let openOpportunities = 0;
    let pipelineValue = 0;
    let closedDeals = 0;

    opportunities.forEach((opp: any) => {
      const value = parseFloat(opp.value || 0);
      pipelineValue += value;

      if (opp.status === 'won') {
        monthlyRevenue += value;
        closedDeals++;
      } else if (opp.status === 'open' || opp.status === 'pending') {
        openOpportunities++;
      }
    });

    // Calculate conversion rate
    const conversionRate = opportunities.length > 0 
      ? (closedDeals / opportunities.length) * 100 
      : 0;

    // Estimate MRR (monthly recurring revenue)
    // Using a simple calculation: assume 30% of revenue is recurring
    const mrr = monthlyRevenue * 0.3;

    // Calculate average deal value
    const avgDealValue = opportunities.length > 0 
      ? pipelineValue / opportunities.length 
      : 0;

    const metrics: MetricsResponse = {
      subscribers,
      monthlyRevenue: Math.round(monthlyRevenue),
      openOpportunities,
      conversionRate: Math.round(conversionRate * 100) / 100,
      mrr: Math.round(mrr),
      avgDealValue: Math.round(avgDealValue * 100) / 100,
      pipelineValue: Math.round(pipelineValue),
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching GHL metrics:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch GHL metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
