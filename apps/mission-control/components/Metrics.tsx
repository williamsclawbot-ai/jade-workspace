'use client';

import { useState } from 'react';
import { TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react';

interface MetricData {
  date: string;
  subscribers: number;
  revenue: number;
  completedTasks: number;
}

export default function Metrics() {
  const [metrics] = useState<MetricData[]>([
    { date: 'Mon', subscribers: 1200, revenue: 14500, completedTasks: 8 },
    { date: 'Tue', subscribers: 1210, revenue: 14800, completedTasks: 12 },
    { date: 'Wed', subscribers: 1225, revenue: 15200, completedTasks: 10 },
    { date: 'Thu', subscribers: 1240, revenue: 15600, completedTasks: 15 },
    { date: 'Fri', subscribers: 1250, revenue: 15840, completedTasks: 14 },
    { date: 'Sat', subscribers: 1255, revenue: 16100, completedTasks: 6 },
    { date: 'Sun', subscribers: 1260, revenue: 16250, completedTasks: 3 },
  ]);

  const maxMetric = (key: keyof Omit<MetricData, 'date'>) => {
    return Math.max(...metrics.map(m => m[key] as number));
  };

  const normalizeValue = (value: number, max: number) => {
    return (value / max) * 100;
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Weekly Growth</p>
              <p className="text-3xl font-bold text-blue-600">+60</p>
              <p className="text-xs text-gray-500 mt-2">New subscribers</p>
            </div>
            <Users size={32} className="text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Revenue This Week</p>
              <p className="text-3xl font-bold text-green-600">$1.75k</p>
              <p className="text-xs text-gray-500 mt-2">+12% vs last week</p>
            </div>
            <DollarSign size={32} className="text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Tasks Completed</p>
              <p className="text-3xl font-bold text-purple-600">78</p>
              <p className="text-xs text-gray-500 mt-2">This week</p>
            </div>
            <CheckCircle size={32} className="text-purple-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-jade-purple">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Productivity</p>
              <p className="text-3xl font-bold text-jade-purple">94%</p>
              <p className="text-xs text-gray-500 mt-2">On track</p>
            </div>
            <TrendingUp size={32} className="text-jade-light" />
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <section>
        <h2 className="text-2xl font-bold text-jade-purple mb-6">Weekly Metrics</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-8">
            {/* Subscribers Chart */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Subscribers Trend</h3>
              <div className="flex items-end justify-between h-40 gap-2">
                {metrics.map((m) => (
                  <div key={m.date} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                      style={{
                        height: `${normalizeValue(m.subscribers, maxMetric('subscribers'))}%`,
                      }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2">{m.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Revenue Trend</h3>
              <div className="flex items-end justify-between h-40 gap-2">
                {metrics.map((m) => (
                  <div key={m.date} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-green-500 rounded-t-lg transition-all hover:bg-green-600"
                      style={{
                        height: `${normalizeValue(m.revenue, maxMetric('revenue'))}%`,
                      }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2">${(m.revenue / 1000).toFixed(1)}k</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Chart */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Completed Tasks</h3>
              <div className="flex items-end justify-between h-40 gap-2">
                {metrics.map((m) => (
                  <div key={m.date} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-purple-500 rounded-t-lg transition-all hover:bg-purple-600"
                      style={{
                        height: `${normalizeValue(m.completedTasks, maxMetric('completedTasks'))}%`,
                      }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2">{m.completedTasks}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Table */}
      <section>
        <h2 className="text-2xl font-bold text-jade-purple mb-6">Performance Details</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-jade-cream border-b border-jade-light">
                <th className="px-6 py-4 text-left text-sm font-semibold text-jade-purple">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-jade-purple">Subscribers</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-jade-purple">Revenue</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-jade-purple">Tasks</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-jade-purple">Growth</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, idx) => {
                const prevSubs = idx > 0 ? metrics[idx - 1].subscribers : m.subscribers;
                const growth = ((m.subscribers - prevSubs) / prevSubs * 100).toFixed(2);
                return (
                  <tr key={m.date} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.date}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700">{m.subscribers.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700">${m.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-700">{m.completedTasks}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span className={`font-semibold ${growth > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        {growth > 0 ? '+' : ''}{growth}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
