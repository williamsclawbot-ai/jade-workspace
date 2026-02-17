import { NextResponse } from 'next/server';

interface CampaignMetrics {
  name: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cost_per_conversion: number;
  ctr: number;
  status: 'good' | 'warning' | 'problem';
}

interface CampaignsResponse {
  campaigns: CampaignMetrics[];
  lastUpdated: string;
  error?: string;
}

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;

// Determine status based on metrics
function determineStatus(campaign: any): 'good' | 'warning' | 'problem' {
  // Red flag: very high cost per conversion (> $100)
  if (campaign.cost_per_conversion > 100) {
    return 'problem';
  }

  // Red flag: very low CTR (< 0.5%) with high spend
  if (campaign.ctr < 0.5 && campaign.spend > 500) {
    return 'problem';
  }

  // Yellow flag: moderate issues
  if (campaign.cost_per_conversion > 50 || (campaign.ctr < 1 && campaign.spend > 300)) {
    return 'warning';
  }

  // Green if CTR > 2% or reasonable cost per conversion
  if (campaign.ctr > 2 || campaign.cost_per_conversion < 30) {
    return 'good';
  }

  return 'warning';
}

export async function GET(): Promise<NextResponse<CampaignsResponse>> {
  try {
    // Check for required environment variables
    if (!META_ACCESS_TOKEN) {
      return NextResponse.json(
        {
          campaigns: [],
          lastUpdated: new Date().toISOString(),
          error: 'Meta Access Token not configured. Add META_ACCESS_TOKEN to .env.local',
        },
        { status: 500 }
      );
    }

    if (!META_AD_ACCOUNT_ID) {
      return NextResponse.json(
        {
          campaigns: [],
          lastUpdated: new Date().toISOString(),
          error: 'Need Ad Account ID to fetch campaigns. Ask John for the ad account ID from Meta Business Manager (it looks like "123456789").',
        },
        { status: 500 }
      );
    }

    // Fetch campaigns from Meta API
    const campaignsUrl = `https://graph.instagram.com/v18.0/act_${META_AD_ACCOUNT_ID}/campaigns?fields=id,name,status&access_token=${META_ACCESS_TOKEN}`;

    const campaignsResponse = await fetch(campaignsUrl);

    if (!campaignsResponse.ok) {
      const errorText = await campaignsResponse.text();
      console.error('Meta API error:', errorText);

      return NextResponse.json(
        {
          campaigns: [],
          lastUpdated: new Date().toISOString(),
          error: `Failed to fetch campaigns: ${campaignsResponse.status}. Check if ad account ID is correct.`,
        },
        { status: 500 }
      );
    }

    const campaignsData = await campaignsResponse.json();

    if (!campaignsData.data || campaignsData.data.length === 0) {
      return NextResponse.json({
        campaigns: [],
        lastUpdated: new Date().toISOString(),
      });
    }

    // Fetch insights for each campaign
    const campaigns: CampaignMetrics[] = await Promise.all(
      campaignsData.data.map(async (campaign: any) => {
        try {
          const insightsUrl = `https://graph.instagram.com/v18.0/${campaign.id}/insights?fields=spend,impressions,clicks,conversions,cost_per_conversion,ctr&access_token=${META_ACCESS_TOKEN}`;

          const insightsResponse = await fetch(insightsUrl);

          if (!insightsResponse.ok) {
            // Return campaign with default values if insights fail
            return {
              name: campaign.name,
              spend: 0,
              impressions: 0,
              clicks: 0,
              conversions: 0,
              cost_per_conversion: 0,
              ctr: 0,
              status: 'warning' as const,
            };
          }

          const insightsData = await insightsResponse.json();

          if (!insightsData.data || insightsData.data.length === 0) {
            // No insights available for this campaign
            return {
              name: campaign.name,
              spend: 0,
              impressions: 0,
              clicks: 0,
              conversions: 0,
              cost_per_conversion: 0,
              ctr: 0,
              status: 'warning' as const,
            };
          }

          const metrics = insightsData.data[0];

          const campaignMetrics: CampaignMetrics = {
            name: campaign.name,
            spend: parseFloat(metrics.spend) || 0,
            impressions: parseInt(metrics.impressions) || 0,
            clicks: parseInt(metrics.clicks) || 0,
            conversions: parseInt(metrics.conversions) || 0,
            cost_per_conversion: parseFloat(metrics.cost_per_conversion) || 0,
            ctr: parseFloat(metrics.ctr) || 0,
            status: 'good',
          };

          campaignMetrics.status = determineStatus(campaignMetrics);

          return campaignMetrics;
        } catch (err) {
          console.error(`Error fetching insights for campaign ${campaign.id}:`, err);
          // Return campaign with error status
          return {
            name: campaign.name,
            spend: 0,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            cost_per_conversion: 0,
            ctr: 0,
            status: 'warning' as const,
          };
        }
      })
    );

    // Filter out campaigns with no data and sort by spend
    const validCampaigns = campaigns
      .filter((c) => c.spend > 0 || c.impressions > 0)
      .sort((a, b) => b.spend - a.spend);

    return NextResponse.json({
      campaigns: validCampaigns,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in Meta campaigns API:', error);

    return NextResponse.json(
      {
        campaigns: [],
        lastUpdated: new Date().toISOString(),
        error: 'Failed to fetch Meta campaigns data. Please try again.',
      },
      { status: 500 }
    );
  }
}
