'use client';

import { useState } from 'react';
import GoHighLevelMetrics from './GoHighLevelMetrics';
import StripeRevenue from './StripeRevenue';

type MetricsView = 'ghl' | 'stripe' | 'combined';

export default function CombinedMetrics() {
  const [view, setView] = useState<MetricsView>('combined');

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2 pb-4 border-b border-jade-light">
        <button
          onClick={() => setView('combined')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            view === 'combined'
              ? 'bg-jade-purple text-white'
              : 'bg-jade-cream text-jade-purple hover:bg-jade-light'
          }`}
        >
          Combined View
        </button>
        <button
          onClick={() => setView('ghl')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            view === 'ghl'
              ? 'bg-jade-purple text-white'
              : 'bg-jade-cream text-jade-purple hover:bg-jade-light'
          }`}
        >
          GoHighLevel Metrics
        </button>
        <button
          onClick={() => setView('stripe')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            view === 'stripe'
              ? 'bg-jade-purple text-white'
              : 'bg-jade-cream text-jade-purple hover:bg-jade-light'
          }`}
        >
          Stripe Revenue
        </button>
      </div>

      {/* Content */}
      {(view === 'combined' || view === 'ghl') && (
        <div>
          <GoHighLevelMetrics />
        </div>
      )}

      {(view === 'combined' || view === 'stripe') && (
        <div>
          <StripeRevenue />
        </div>
      )}

      {view === 'combined' && (
        <section className="bg-white rounded-lg shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold text-jade-purple mb-6">Metrics Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="font-semibold text-blue-600 mb-4">GoHighLevel Focus</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Contact management and subscriber growth</li>
                <li>✓ Sales pipeline and opportunity tracking</li>
                <li>✓ Conversion metrics and deal values</li>
                <li>✓ Business development insights</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="font-semibold text-green-600 mb-4">Stripe Focus</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Actual payment processing data</li>
                <li>✓ Subscription revenue tracking</li>
                <li>✓ Monthly recurring revenue (MRR)</li>
                <li>✓ Customer payment history</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-jade-cream rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Insight:</strong> Use GoHighLevel metrics to track sales opportunities and conversion rates, while Stripe shows the actual realized revenue from payments and subscriptions. Together, they provide a complete picture of your business health.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
