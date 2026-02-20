import { NextResponse } from 'next/server';

const GHL_API_TOKEN = process.env.OHIGHLEVEL_API_TOKEN;
const GHL_API_BASE = 'https://services.leadconnectorhq.com';

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
        'Version': '2021-07-28',
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

    // Fetch contacts (query parameter format for location)
    const LOCATION_ID = 'gHWqirw4PyO8dZlHIYfP';
    const contactsData = await fetchGHLData(`/contacts?locationId=${LOCATION_ID}`);
    
    if (!contactsData) {
      return NextResponse.json(
        { error: 'Failed to fetch GHL contacts data' },
        { status: 500 }
      );
    }

    const contacts = contactsData.contacts || [];
    // Note: opportunities endpoint not available in this API version, using contact status as proxy
    const opportunities = [];

    // Analyze funnel stages from contacts (since opportunities endpoint not available)
    const leadCount = contacts.length;
    
    // Engaged: contacts with interaction or specific engagement tags
    const engagedCount = contacts.filter((c: any) => {
      const hasEngagementTag = c.tags?.some((t: string) => 
        t.toLowerCase().includes('engaged') || 
        t.toLowerCase().includes('lead') ||
        t.toLowerCase().includes('guide')
      );
      return hasEngagementTag || (c.dateUpdated && new Date(c.dateUpdated) > new Date(Date.now() - 30*24*60*60*1000));
    }).length;
    
    // Customers: contacts with specific customer tags or high-value tags
    const customerCount = contacts.filter((c: any) => 
      c.tags?.some((t: string) => 
        t.toLowerCase().includes('customer') || 
        t.toLowerCase().includes('paid') ||
        t.toLowerCase().includes('purchase') ||
        t.toLowerCase().includes('guide - purchased')
      )
    ).length;
    
    const pipelineCount = engagedCount - customerCount;

    const conversionRates = {
      leadToEngaged: leadCount > 0 ? (engagedCount / leadCount) * 100 : 0,
      engagedToCustomer: engagedCount > 0 ? (customerCount / engagedCount) * 100 : 0,
      overallConversion: leadCount > 0 ? (customerCount / leadCount) * 100 : 0,
    };

    // Calculate revenue metrics (estimated based on typical guide prices $37/guide)
    const AVERAGE_GUIDE_PRICE = 37;
    const totalRevenue = customerCount * AVERAGE_GUIDE_PRICE;
    const avgCustomerValue = customerCount > 0 ? totalRevenue / customerCount : 0;
    const pipelineValue = (engagedCount - customerCount) * AVERAGE_GUIDE_PRICE;

    // Segment analysis by tags/source
    const byGuide: Record<string, any> = {};
    contacts.forEach((c: any) => {
      // Extract guide name from tags like "guide - 5-18 months", "guide - newborn", etc.
      const guideTag = c.tags?.find((t: string) => t.toLowerCase().includes('guide'));
      const guide = guideTag || c.source || 'Unspecified';
      
      if (!byGuide[guide]) {
        byGuide[guide] = { count: 0, engaged: 0, customers: 0 };
      }
      byGuide[guide].count += 1;
      
      if (engagedCount > 0 && contacts.slice(0, engagedCount).includes(c)) {
        byGuide[guide].engaged += 1;
      }
      if (customerCount > 0 && contacts.slice(0, customerCount).includes(c)) {
        byGuide[guide].customers += 1;
      }
    });

    const byStatus: Record<string, any> = {
      'Free Leads': { count: leadCount - engagedCount, value: 0 },
      'Engaged': { count: engagedCount - customerCount, value: pipelineValue },
      'Customers': { count: customerCount, value: totalRevenue },
    };

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
