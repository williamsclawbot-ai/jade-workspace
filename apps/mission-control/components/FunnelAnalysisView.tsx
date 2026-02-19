'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  value: number;
}

interface Recommendation {
  priority: string;
  action: string;
  impact: string;
  effort: string;
}

interface FunnelData {
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
  recommendations: Recommendation[];
  lastUpdated: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function FunnelAnalysisView() {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFunnelData = async () => {
      try {
        const response = await fetch('/api/ghl/funnel-analysis');
        if (!response.ok) throw new Error('Failed to fetch funnel data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFunnelData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle size={20} />
          <span>Error loading funnel data: {error || 'Unknown error'}</span>
        </div>
      </div>
    );
  }

  const guideData = Object.entries(data.segments.byGuide).map(([guide, metrics]: [string, any]) => ({
    name: guide || 'Unknown Guide',
    customers: metrics.count,
    revenue: metrics.revenue,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer Conversion Funnel</h2>
        <p className="text-sm text-gray-500">Last updated: {new Date(data.lastUpdated).toLocaleString()}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total Leads"
          value={data.totalLeads.toString()}
          subtext="Free subscribers"
          icon={<TrendingUp className="text-blue-500" />}
        />
        <MetricCard
          label="Overall Conversion"
          value={`${data.conversionRates.overallConversion.toFixed(1)}%`}
          subtext={`${data.stages[2].count} customers`}
          icon={<CheckCircle className="text-green-500" />}
        />
        <MetricCard
          label="Total Revenue"
          value={`$${(data.revenueMetrics.totalRevenue / 1000).toFixed(1)}k`}
          subtext={`Avg: $${data.revenueMetrics.avgCustomerValue.toFixed(0)}/customer`}
          icon={<TrendingUp className="text-green-500" />}
        />
        <MetricCard
          label="Engaged Users"
          value={data.stages[1].count.toString()}
          subtext={`${data.conversionRates.leadToEngaged.toFixed(1)}% of leads`}
          icon={<CheckCircle className="text-yellow-500" />}
        />
      </div>

      {/* Funnel Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
        <div className="space-y-4">
          {data.stages.map((stage, index) => (
            <div key={stage.name}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {stage.count} users ({stage.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className={`h-full rounded-full flex items-center justify-center text-white text-xs font-bold transition-all`}
                  style={{
                    width: `${Math.max(stage.percentage, 5)}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                >
                  {stage.percentage > 10 && `${stage.percentage.toFixed(0)}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Rates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ConversionRateCard
          title="Lead → Engaged"
          rate={data.conversionRates.leadToEngaged}
          benchmark="Industry: 15-25%"
        />
        <ConversionRateCard
          title="Engaged → Customer"
          rate={data.conversionRates.engagedToCustomer}
          benchmark="Industry: 5-15%"
        />
        <ConversionRateCard
          title="Overall Conversion"
          rate={data.conversionRates.overallConversion}
          benchmark="Industry: 1-5%"
        />
      </div>

      {/* Guide Performance */}
      {guideData.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Guide Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={guideData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="customers" fill="#3b82f6" name="Customers" />
              <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Recommendations</h3>
        <div className="space-y-3">
          {data.recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'CRITICAL'
                  ? 'bg-red-50 border-red-400'
                  : rec.priority === 'HIGH'
                  ? 'bg-yellow-50 border-yellow-400'
                  : 'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex gap-3">
                {rec.priority === 'CRITICAL' && <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />}
                {rec.priority === 'HIGH' && <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />}
                {rec.priority !== 'CRITICAL' && rec.priority !== 'HIGH' && <Clock className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />}
                <div className="flex-1 space-y-2">
                  <div>
                    <span className={`text-xs font-bold uppercase ${
                      rec.priority === 'CRITICAL'
                        ? 'text-red-700'
                        : rec.priority === 'HIGH'
                        ? 'text-yellow-700'
                        : 'text-blue-700'
                    }`}>
                      {rec.priority} Priority
                    </span>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{rec.action}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-600">Impact:</span>
                      <p className="text-gray-900 font-semibold">{rec.impact}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Effort:</span>
                      <p className="text-gray-900 font-semibold">{rec.effort}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Money Left on Table */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-3">💰 Revenue Opportunity</h3>
        <p className="text-sm text-green-800 mb-4">
          Based on your current funnel and recommendations, you could unlock:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded p-4 border border-green-200">
            <p className="text-xs text-green-700 uppercase font-bold">If You Deploy Nurture Sequence</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              +${Math.round(data.totalLeads * 0.15 * 37).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">First month estimated</p>
          </div>
          <div className="bg-white rounded p-4 border border-green-200">
            <p className="text-xs text-green-700 uppercase font-bold">If You Optimize Sales Pages</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              +${Math.round(data.totalLeads * 0.05 * 37).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Monthly recurring</p>
          </div>
          <div className="bg-white rounded p-4 border border-green-200">
            <p className="text-xs text-green-700 uppercase font-bold">If You Do Both</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              +${Math.round((data.totalLeads * 0.15 + data.totalLeads * 0.05) * 37).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">First month + $5.5k/mo recurring</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, subtext, icon }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtext}</p>
        </div>
        <div className="flex-shrink-0">{icon}</div>
      </div>
    </div>
  );
}

function ConversionRateCard({ title, rate, benchmark }: any) {
  const isAboveAverage = 
    (title.includes('Lead') && rate > 20) ||
    (title.includes('Engaged') && rate > 10) ||
    (title.includes('Overall') && rate > 3);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${isAboveAverage ? 'text-green-600' : 'text-amber-600'}`}>
        {rate.toFixed(1)}%
      </p>
      <p className="text-xs text-gray-500 mt-2">{benchmark}</p>
    </div>
  );
}
