'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, TrendingUp, DollarSign, CreditCard, PieChart } from 'lucide-react';

interface RecentCharge {
  id: string;
  amount: number;
  currency: string;
  date: string;
  customerName: string;
  status: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
}

interface StripeData {
  totalRevenue: number;
  monthlyRevenue: number;
  previousMonthRevenue: number;
  growth: number;
  recentCharges: RecentCharge[];
  subscriptionRevenue: number;
  activeSubscriptions: number;
  monthlyBreakdown: MonthlyData[];
  lastUpdated: string;
}

export default function StripeRevenue() {
  const [data, setData] = useState<StripeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/revenue');

      if (!response.ok) {
        throw new Error('Failed to fetch Stripe revenue data');
      }

      const stripeData = await response.json();
      setData(stripeData);
      setLastFetch(new Date());
    } catch (err) {
      console.error('Error fetching Stripe data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch Stripe data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-jade-purple border-t-jade-cream mx-auto mb-4"></div>
          <p className="text-jade-purple">Loading Stripe revenue data...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle className="text-red-600 mr-4 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Stripe Data</h3>
            <p className="text-red-700 text-sm">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const getTrendColor = (trend: number): string => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const maxMonthlyRevenue = Math.max(...data.monthlyBreakdown.map((m) => m.revenue));

  return (
    <div className="space-y-8 pb-8">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-jade-purple mb-2">Stripe Revenue</h1>
          <p className="text-gray-600 text-sm">
            Real-time payment and revenue data from Stripe
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-dark transition-colors disabled:opacity-50"
          title="Refresh revenue data"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">${data.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">All time</p>
            </div>
            <DollarSign size={32} className="text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Monthly Revenue</p>
              <p className="text-3xl font-bold text-blue-600">${data.monthlyRevenue.toLocaleString()}</p>
              <p className={`text-xs font-semibold mt-2 ${getTrendColor(data.growth)}`}>
                {data.growth > 0 ? '+' : ''}{data.growth}% vs last month
              </p>
            </div>
            <TrendingUp size={32} className="text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Monthly Recurring Revenue</p>
              <p className="text-3xl font-bold text-purple-600">${data.subscriptionRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Subscription base</p>
            </div>
            <CreditCard size={32} className="text-purple-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Active Subscriptions</p>
              <p className="text-3xl font-bold text-orange-600">{data.activeSubscriptions}</p>
              <p className="text-xs text-gray-500 mt-2">Recurring payments</p>
            </div>
            <PieChart size={32} className="text-orange-400" />
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <section>
        <h2 className="text-2xl font-bold text-jade-purple mb-6">Monthly Revenue Trend (Last 6 Months)</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-end justify-between h-48 gap-2">
            {data.monthlyBreakdown.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full h-full flex items-end justify-center">
                  <div
                    className="w-full bg-gradient-to-t from-jade-purple to-jade-light rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                    style={{
                      height: `${(month.revenue / maxMonthlyRevenue) * 100}%`,
                      minHeight: '4px',
                    }}
                    title={`${month.month}: $${month.revenue.toLocaleString()}`}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-4">{month.month}</p>
                <p className="text-xs font-semibold text-gray-800 group-hover:text-jade-purple">
                  ${(month.revenue / 1000).toFixed(1)}k
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Charges Table */}
      <section>
        <h2 className="text-2xl font-bold text-jade-purple mb-6">Recent Payments</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-jade-cream border-b border-jade-light">
                <th className="px-6 py-4 text-left text-sm font-semibold text-jade-purple">
                  Customer
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-jade-purple">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-jade-purple">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-jade-purple">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-jade-purple">
                  ID
                </th>
              </tr>
            </thead>
            <tbody>
              {data.recentCharges.map((charge) => (
                <tr key={charge.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{charge.customerName}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    {charge.currency} ${charge.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(charge.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        charge.status === 'succeeded'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {charge.status.charAt(0).toUpperCase() + charge.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                    {charge.id.substring(0, 15)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Last Updated */}
      <div className="text-right text-xs text-gray-500">
        Last updated: {lastFetch ? lastFetch.toLocaleTimeString() : 'Never'}
        {lastFetch && ` (${Math.round((Date.now() - lastFetch.getTime()) / 1000)} seconds ago)`}
      </div>
    </div>
  );
}
