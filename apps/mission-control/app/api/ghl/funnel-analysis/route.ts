import { NextResponse } from 'next/server';

const GHL_API_TOKEN = process.env.OHIGHLEVEL_API_TOKEN;
const GHL_API_BASE = 'https://api.gohighlevel.com/v1';

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  value: number;
}

interface FunnelAnalysis {
  totalLeads: number;
  stages: FunnelStage[];
  conversionRates: {
    leadToEngaged: number;
    engagedToCustomer: number;
    overallConversion: number;
  };
  revenueMetrics: {
    totalRevenue: number;
    avgCustomerValue: number;
    costPerAcquisition: number;
    lifetime: number;
  };
  segments: {
    byGuide: Record<string, any>;
    byStatus: Record<string, any>;
  };
  recommendations: {
    priority: string;
    action: string;
    impact: string;
    effort: string;
  }[];
  lastUpdated: string;
}

async function fetchGHLData(endpoint: string, params?: Record<string, string>) {
  let url = `${GHL_API_BASE}${endpoint}`;
  
  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }

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
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    console.log('[Funnel Analysis] DEBUG: GHL_API_TOKEN =', GHL_API_TOKEN ? 'SET' : 'NOT SET', 'from env:', process.env.OHIGHLEVEL_API_TOKEN ? 'SET' : 'NOT SET');
    if (!GHL_API_TOKEN) {
      return NextResponse.json(
        { error: 'GHL API token not configured' },
        { status: 500 }
      );
    }

    // Fetch contacts and opportunities
    const contactsData = await fetchGHLData('/contacts');
    const opportunitiesData = await fetchGHLData('/opportunities');
    
    if (!contactsData || !opportunitiesData) {
      return NextResponse.json(
        { error: 'Failed to fetch GHL data' },
        { status: 500 }
      );
    }

    const contacts = contactsData.contacts || [];
    const opportunities = opportunitiesData.opportunities || [];

    // Analyze funnel stages
    const leadCount = contacts.length;
    const engagedCount = contacts.filter((c: any) => c.tags?.includes('Engaged with guides') || c.lastInteractionDate).length;
    const customerCount = opportunities.filter((o: any) => o.status === 'Won').length;
    const pipelineCount = opportunities.filter((o: any) => o.status === 'Open').length;

    const conversionRates = {
      leadToEngaged: leadCount > 0 ? (engagedCount / leadCount) * 100 : 0,
      engagedToCustomer: engagedCount > 0 ? (customerCount / engagedCount) * 100 : 0,
      overallConversion: leadCount > 0 ? (customerCount / leadCount) * 100 : 0,
    };

    // Calculate revenue metrics
    const totalRevenue = opportunities
      .filter((o: any) => o.status === 'Won')
      .reduce((sum: number, o: any) => sum + (o.value || 0), 0);
    
    const avgCustomerValue = customerCount > 0 ? totalRevenue / customerCount : 0;
    const pipelineValue = opportunities
      .filter((o: any) => o.status === 'Open')
      .reduce((sum: number, o: any) => sum + (o.value || 0), 0);

    // Segment analysis
    const byGuide: Record<string, any> = {};
    opportunities.forEach((o: any) => {
      const guide = o.product || 'Unspecified';
      if (!byGuide[guide]) {
        byGuide[guide] = { count: 0, revenue: 0 };
      }
      if (o.status === 'Won') {
        byGuide[guide].count += 1;
        byGuide[guide].revenue += o.value || 0;
      }
    });

    const byStatus: Record<string, any> = {};
    opportunities.forEach((o: any) => {
      const status = o.status || 'Unknown';
      if (!byStatus[status]) {
        byStatus[status] = { count: 0, value: 0 };
      }
      byStatus[status].count += 1;
      byStatus[status].value += o.value || 0;
    });

    // Generate recommendations
    const recommendations = generateRecommendations(
      conversionRates,
      byGuide,
      byStatus,
      leadCount,
      customerCount,
      pipelineValue
    );

    // Build funnel stages
    const stages: FunnelStage[] = [
      {
        name: 'Free Leads',
        count: leadCount,
        percentage: 100,
        value: 0,
      },
      {
        name: 'Engaged',
        count: engagedCount,
        percentage: conversionRates.leadToEngaged,
        value: 0,
      },
      {
        name: 'Customers',
        count: customerCount,
        percentage: conversionRates.overallConversion,
        value: totalRevenue,
      },
    ];

    const analysis: FunnelAnalysis = {
      totalLeads: leadCount,
      stages,
      conversionRates,
      revenueMetrics: {
        totalRevenue,
        avgCustomerValue,
        costPerAcquisition: 0, // Would need marketing spend data
        lifetime: avgCustomerValue, // Placeholder
      },
      segments: {
        byGuide,
        byStatus,
      },
      recommendations,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Funnel analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze funnel' },
      { status: 500 }
    );
  }
}

function generateRecommendations(
  conversionRates: any,
  byGuide: Record<string, any>,
  byStatus: Record<string, any>,
  leadCount: number,
  customerCount: number,
  pipelineValue: number
) {
  const recommendations = [];

  // If lead-to-engaged conversion is low
  if (conversionRates.leadToEngaged < 30) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Deploy nurture email sequence to free leads',
      impact: `Potential +${Math.round(leadCount * 0.15)} engaged users, +$${Math.round(leadCount * 0.15 * 37)} revenue`,
      effort: '15 minutes setup in GoHighLevel',
    });
  }

  // If engaged-to-customer conversion is low
  if (conversionRates.engagedToCustomer < 10) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Review and optimize sales pages for each guide',
      impact: `Potential +${Math.round(leadCount * 0.05)} customers, +$${Math.round(leadCount * 0.05 * 37)} revenue`,
      effort: '2-3 hours design/copy iteration',
    });
  }

  // If overall conversion is very low
  if (conversionRates.overallConversion < 2) {
    recommendations.push({
      priority: 'CRITICAL',
      action: 'Build and deploy sales landing pages for each guide',
      impact: `Potential +$${Math.round(leadCount * 0.05 * 37)}/month ongoing`,
      effort: '4-6 hours to build templates',
    });
  }

  // Guide-specific insights
  const guides = Object.entries(byGuide);
  const topGuide = guides.sort((a: any, b: any) => b[1].count - a[1].count)[0];
  if (topGuide && guides.length > 1) {
    recommendations.push({
      priority: 'MEDIUM',
      action: `Analyze why "${topGuide[0]}" outsells others, replicate success`,
      impact: `Potential +${Math.round(guides.length * topGuide[1].count)} additional guide sales`,
      effort: '1 hour analysis',
    });
  }

  // Pipeline opportunity
  if (pipelineValue > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Set up automated follow-up for stalled deals in pipeline',
      impact: `Potential +$${Math.round(pipelineValue * 0.25)}-$${Math.round(pipelineValue * 0.5)}`,
      effort: '30 minutes GHL automation',
    });
  }

  // Pricing/upsell opportunity
  if (customerCount > 20) {
    recommendations.push({
      priority: 'LOW',
      action: 'Set up cross-sell sequence for guide bundle',
      impact: `Potential +$${Math.round(customerCount * 47)} from upsells`,
      effort: '2 hours setup + email copy',
    });
  }

  return recommendations.slice(0, 5); // Top 5 recommendations
}
