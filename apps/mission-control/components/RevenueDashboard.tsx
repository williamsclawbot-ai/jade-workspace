'use client';

import { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CreditCard,
  Award,
  PieChart,
  Activity
} from 'lucide-react';

interface RevenueByProduct {
  name: string;
  revenue: number;
  count: number;
  percentage: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
}

interface PipelineStage {
  name: string;
  count: number;
  value: number;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  date: string;
  customerName: string;
  description: string;
  status: string;
}

interface TopCustomer {
  name: string;
  totalSpent: number;
  transactionCount: number;
}

interface DashboardData {
  monthlyRevenue: number;
  previousMonthRevenue: number;
  revenueGoal: number;
  goalProgress: number;
  growth: number;
  totalRevenue: number;
  avgTransactionValue: number;
  revenueByProduct: RevenueByProduct[];
  monthlyBreakdown: MonthlyData[];
  totalContacts: number;
  openOpportunities: number;
  wonDeals: number;
  wonDealsValue: number;
  conversionRate: number;
  pipelineStages: PipelineStage[];
  recentTransactions: Transaction[];
  repeatCustomers: number;
  newCustomersThisMonth: number;
  topCustomers: TopCustomer[];
  lastUpdated: string;
}

export default function RevenueDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dashboard/revenue');

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const dashboardData = await response.json();
      setData(dashboardData);
      setLastFetch(new Date());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
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

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUpRight size={16} className="text-green-500" />;
    if (trend < 0) return <ArrowDownRight size={16} className="text-red-500" />;
    return <Minus size={16} className="text-gray-500" />;
  };

  const getTrendColor = (trend: number): string => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-jade-purple border-t-jade-cream mx-auto mb-4"></div>
          <p className="text-jade-purple">Loading Revenue Dashboard...</p>
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
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Dashboard</h3>
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

  const maxMonthlyRevenue = Math.max(...data.monthlyBreakdown.map((m) => m.revenue));

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-jade-purple mb-2">Revenue Dashboard</h1>
          <p className="text-gray-600 text-sm">
            Tracking progress toward $10K/month goal • Real-time Stripe & GHL data
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-dark transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* $10K Goal Progress Card */}
      <section className="bg-gradient-to-r from-jade-purple to-purple-700 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Target size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Monthly Revenue Goal</h2>
              <p className="text-white/80">Target: {formatCurrency(data.revenueGoal)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{formatCurrency(data.monthlyRevenue)}</p>
            <p className={`text-sm font-medium flex items-center justify-end space-x-1 ${
              data.growth >= 0 ? 'text-green-300' : 'text-red-300'
            }`}>
              {getTrendIcon(data.growth)}
              <span>{data.growth > 0 ? '+' : ''}{data.growth}% vs last month</span>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Progress toward $10K goal</span>
            <span className="font-bold">{data.goalProgress.toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-300 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(data.goalProgress, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-white/70">
            {data.revenueGoal - data.monthlyRevenue > 0 
              ? `${formatCurrency(data.revenueGoal - data.monthlyRevenue)} more to reach goal`
              : '🎉 Goal achieved!'
            }
          </p>
        </div>
      </section>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <span className={`text-sm font-medium flex items-center ${getTrendColor(data.growth)}`}>
              {getTrendIcon(data.growth)}
              {data.growth > 0 ? '+' : ''}{data.growth}%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">This Month Revenue</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.monthlyRevenue)}</p>
          <p className="text-xs text-gray-500 mt-1">vs {formatCurrency(data.previousMonthRevenue)} last month</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CreditCard size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total Revenue (All Time)</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalRevenue)}</p>
          <p className="text-xs text-gray-500 mt-1">Since tracking began</p>
        </div>

        {/* Avg Transaction */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Activity size={24} className="text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Avg Transaction Value</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.avgTransactionValue)}</p>
          <p className="text-xs text-gray-500 mt-1">Per successful charge</p>
        </div>

        {/* Won Deals */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Award size={24} className="text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {data.conversionRate.toFixed(1)}% conv.
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Won Deals</p>
          <p className="text-2xl font-bold text-gray-900">{data.wonDeals}</p>
          <p className="text-xs text-gray-500 mt-1">{formatCurrency(data.wonDealsValue)} total value</p>
        </div>
      </div>

      {/* Funnel Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalContacts.toLocaleString()}</p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Target size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Open Opportunities</p>
              <p className="text-2xl font-bold text-gray-900">{data.openOpportunities.toLocaleString()}</p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500 rounded-full" 
              style={{ width: `${Math.min((data.openOpportunities / data.totalContacts) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <ShoppingBag size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Repeat Customers</p>
              <p className="text-2xl font-bold text-gray-900">{data.repeatCustomers}</p>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${Math.min((data.repeatCustomers / (data.wonDeals || 1)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-jade-purple mb-6 flex items-center">
            <TrendingUp size={20} className="mr-2" />
            Monthly Revenue Trend
          </h2>
          <div className="flex items-end justify-between h-48 gap-3">
            {data.monthlyBreakdown.map((month) => (
              <div key={month.month} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full h-full flex items-end justify-center">
                  <div
                    className="w-full bg-gradient-to-t from-jade-purple to-jade-light rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                    style={{
                      height: `${maxMonthlyRevenue > 0 ? (month.revenue / maxMonthlyRevenue) * 100 : 0}%`,
                      minHeight: '4px',
                    }}
                    title={`${month.month}: ${formatCurrency(month.revenue)}`}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-3">{month.month}</p>
                <p className="text-xs font-semibold text-gray-800 group-hover:text-jade-purple">
                  ${(month.revenue / 1000).toFixed(1)}k
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue by Product */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-jade-purple mb-6 flex items-center">
            <PieChart size={20} className="mr-2" />
            Revenue by Product
          </h2>
          <div className="space-y-4">
            {data.revenueByProduct.map((product, idx) => (
              <div key={product.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{product.name}</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</span>
                    <span className="text-gray-500 text-xs ml-2">({product.count} sales)</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${product.percentage}%`,
                      backgroundColor: ['#563f57', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][idx % 5]
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{product.percentage}% of total revenue</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Pipeline & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Stages */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-jade-purple mb-6">Pipeline Funnel</h2>
          <div className="space-y-4">
            {data.pipelineStages.map((stage, idx) => (
              <div key={stage.name} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium text-gray-600">{stage.name}</div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div 
                      className="h-full rounded-lg flex items-center px-3 transition-all"
                      style={{ 
                        width: `${Math.max((stage.count / Math.max(...data.pipelineStages.map(s => s.count))) * 100, 10)}%`,
                        backgroundColor: ['#e5e7eb', '#fef3c7', '#dbeafe', '#d1fae5', '#fee2e2'][idx]
                      }}
                    >
                      <span className="text-sm font-semibold text-gray-800">{stage.count}</span>
                    </div>
                  </div>
                </div>
                {stage.value > 0 && (
                  <div className="text-sm font-medium text-gray-700">
                    {formatCurrency(stage.value)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Top Customers */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-jade-purple mb-6">Top Customers</h2>
          <div className="space-y-3">
            {data.topCustomers.map((customer, idx) => (
              <div key={customer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-jade-purple text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.transactionCount} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</p>
                  <p className="text-xs text-gray-500">lifetime value</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recent Transactions */}
      <section className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-jade-purple">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{transaction.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString('en-AU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {transaction.status}
                    </span>
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
        {lastFetch && ` (${Math.round((Date.now() - lastFetch.getTime()) / 1000)}s ago)`}
      </div>
    </div>
  );
}
