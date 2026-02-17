'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';

interface Campaign {
  name: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cost_per_conversion: number;
  ctr: number;
  status: 'good' | 'warning' | 'problem';
}

interface CampaignsData {
  campaigns: Campaign[];
  lastUpdated: string;
  error?: string;
}

export default function MetaAds() {
  const [data, setData] = useState<CampaignsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/meta/campaigns');

      if (!response.ok) {
        throw new Error('Failed to fetch Meta campaigns');
      }

      const result = await response.json();
      setData(result);
      setLastFetch(new Date());

      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();

    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchCampaigns, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Get status color and emoji
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'good':
        return { color: 'bg-green-100 border-green-300', emoji: '🟢', label: 'Looking good!' };
      case 'warning':
        return { color: 'bg-yellow-100 border-yellow-300', emoji: '🟡', label: 'Needs attention' };
      case 'problem':
        return { color: 'bg-red-100 border-red-300', emoji: '🔴', label: 'Problem area' };
      default:
        return { color: 'bg-gray-100 border-gray-300', emoji: '⚪', label: 'Unknown' };
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.round(num).toString();
  };

  const formatCurrency = (num: number): string => {
    return '$' + num.toFixed(2);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-jade-purple border-t-jade-cream mx-auto mb-4"></div>
          <p className="text-jade-purple">Loading Meta ads data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-jade-purple mb-2">📊 Meta Ads Performance</h1>
          <p className="text-gray-600 text-sm">Simple overview of how your ads are performing</p>
        </div>
        <button
          onClick={fetchCampaigns}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-dark transition-colors disabled:opacity-50"
          title="Refresh data"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="text-red-600 mr-3 flex-shrink-0 mt-1" size={20} />
            <div>
              <h3 className="text-red-800 font-semibold mb-1">Setup Required</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* No Campaigns */}
      {!error && data && data.campaigns.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-700">No active campaigns with data found yet.</p>
          <p className="text-blue-600 text-sm mt-2">Once campaigns are running, they'll appear here.</p>
        </div>
      )}

      {/* Campaigns Grid */}
      {data && data.campaigns.length > 0 && (
        <div className="space-y-6">
          {data.campaigns.map((campaign, idx) => {
            const status = getStatusInfo(campaign.status);
            const roi = campaign.conversions > 0 && campaign.spend > 0 
              ? ((campaign.conversions * 100 - campaign.spend) / campaign.spend * 100)
              : 0;

            return (
              <div
                key={idx}
                className={`rounded-lg border-2 p-6 ${status.color}`}
              >
                {/* Campaign Name & Status */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{campaign.name}</h2>
                    <p className="text-sm text-gray-600">
                      {status.emoji} <span className="font-semibold">{status.label}</span>
                    </p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {/* Money Spent */}
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 text-xs mb-2">💰 Money Spent</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(campaign.spend)}</p>
                  </div>

                  {/* People Who Saw It */}
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 text-xs mb-2">👁️ People Who Saw It</p>
                    <p className="text-xl font-bold text-gray-900">{formatNumber(campaign.impressions)}</p>
                  </div>

                  {/* People Who Clicked */}
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 text-xs mb-2">👆 People Who Clicked</p>
                    <p className="text-xl font-bold text-gray-900">{formatNumber(campaign.clicks)}</p>
                  </div>

                  {/* Conversions */}
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 text-xs mb-2">✅ Conversions</p>
                    <p className="text-xl font-bold text-gray-900">{campaign.conversions}</p>
                  </div>

                  {/* Cost Per Conversion */}
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 text-xs mb-2">📊 Cost Per Conversion</p>
                    <p className="text-xl font-bold text-gray-900">
                      {campaign.conversions > 0 ? formatCurrency(campaign.cost_per_conversion) : '—'}
                    </p>
                  </div>

                  {/* Click-Through Rate */}
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-600 text-xs mb-2">📈 Click Rate</p>
                    <p className="text-xl font-bold text-gray-900">{campaign.ctr.toFixed(2)}%</p>
                  </div>
                </div>

                {/* Quick Summary */}
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <div className="text-sm text-gray-700">
                    <p>
                      {campaign.status === 'good' && (
                        <>
                          <span className="font-semibold">This campaign is performing well!</span> Good click rate
                          ({campaign.ctr.toFixed(2)}%) and reasonable cost per conversion
                          ({campaign.conversions > 0 ? formatCurrency(campaign.cost_per_conversion) : 'no data yet'}).
                        </>
                      )}
                      {campaign.status === 'warning' && (
                        <>
                          <span className="font-semibold">This campaign needs attention.</span> The cost per
                          conversion ({campaign.conversions > 0 ? formatCurrency(campaign.cost_per_conversion) : 'no data'})
                          or click rate ({campaign.ctr.toFixed(2)}%) could be better. Consider reviewing the ad creative
                          or targeting.
                        </>
                      )}
                      {campaign.status === 'problem' && (
                        <>
                          <span className="font-semibold">This campaign has issues.</span> The cost per conversion is
                          very high ({campaign.conversions > 0 ? formatCurrency(campaign.cost_per_conversion) : 'no data'}
                          ) or very few people are clicking. Review the targeting and creative ASAP.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Last Updated */}
      <div className="text-right text-xs text-gray-500 pt-4 border-t border-gray-200">
        Last updated: {lastFetch ? lastFetch.toLocaleTimeString() : 'Never'}
        {lastFetch && ` (${Math.round((Date.now() - lastFetch.getTime()) / 1000)}s ago)`}
        <br />
        <span className="text-xs text-gray-400">Auto-refreshes every 10 minutes</span>
      </div>
    </div>
  );
}
