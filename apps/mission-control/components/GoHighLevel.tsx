'use client';

import { useState, useEffect } from 'react';
import { Settings, CheckCircle, AlertCircle, Users, ShoppingCart, Zap } from 'lucide-react';

interface GHLProduct {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'archived';
  price: number;
  category: string;
  description: string;
  linkedGuide?: string;
  automations?: string[];
}

interface GHLMetric {
  label: string;
  value: number | string;
  icon: string;
  trend?: string;
}

export default function GoHighLevel() {
  const [products, setProducts] = useState<GHLProduct[]>([
    {
      id: 'product-5-18',
      name: '5-18 Month Sleep Guide',
      status: 'draft',
      price: 47,
      category: 'Guide',
      description: 'Comprehensive sleep guide for babies 5-18 months old',
      linkedGuide: 'sleep-5-18',
      automations: ['Send welcome email', 'Add to email sequence', 'Tag customer as guide-owner'],
    },
    {
      id: 'product-bundle',
      name: 'Sleep Guide Bundle',
      status: 'draft',
      price: 99,
      category: 'Bundle',
      description: 'All sleep guides together (Newborn + 5-18 Month + Toddler)',
      automations: ['Send bundle welcome sequence', 'Unlock all guides', 'Premium support access'],
    },
  ]);

  const [metrics, setMetrics] = useState<GHLMetric[]>([
    {
      label: 'Total Contacts',
      value: '1,250',
      icon: '👥',
      trend: '+42 this month',
    },
    {
      label: 'Active Subscribers',
      value: '890',
      icon: '📧',
      trend: '71% engagement',
    },
    {
      label: 'Monthly Revenue',
      value: '$15,840',
      icon: '💰',
      trend: '+$2,145 growth',
    },
    {
      label: 'Pipeline Value',
      value: '$45,000',
      icon: '📈',
      trend: '27% conversion',
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jade_ghl_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('jade_ghl_products', JSON.stringify(products));
  }, [products]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'draft':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeProducts = products.filter(p => p.status === 'active');
  const draftProducts = products.filter(p => p.status === 'draft');

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="border-b border-jade-light pb-6">
        <h1 className="text-3xl font-bold text-jade-purple mb-2">GoHighLevel Integration</h1>
        <p className="text-gray-600">Manage products, automations, and customer data</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-jade-purple">
            <div className="flex justify-between items-start mb-3">
              <p className="text-gray-600 text-sm">{metric.label}</p>
              <span className="text-2xl">{metric.icon}</span>
            </div>
            <p className="text-2xl font-bold text-jade-purple">{metric.value}</p>
            {metric.trend && (
              <p className="text-xs text-gray-500 mt-2">{metric.trend}</p>
            )}
          </div>
        ))}
      </div>

      {/* Active Products */}
      {activeProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-jade-purple mb-4 flex items-center space-x-2">
            <CheckCircle size={24} className="text-green-500" />
            <span>Active Products ({activeProducts.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeProducts.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-jade-purple">{product.name}</h3>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Price</p>
                      <p className="text-2xl font-bold text-jade-purple">${product.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Category</p>
                      <p className="text-lg font-semibold text-gray-800">{product.category}</p>
                    </div>
                  </div>
                </div>

                {product.linkedGuide && (
                  <div className="bg-blue-50 border-l-2 border-blue-500 p-3 rounded mb-4">
                    <p className="text-xs text-blue-700 font-semibold">Linked to</p>
                    <p className="text-sm text-blue-900">{product.linkedGuide}</p>
                  </div>
                )}

                {product.automations && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Automations</p>
                    <ul className="space-y-1">
                      {product.automations.map((auto, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-jade-purple">✓</span>
                          <span>{auto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button className="w-full bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-semibold">
                  Manage in GHL
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Draft Products */}
      {draftProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-jade-purple mb-4 flex items-center space-x-2">
            <AlertCircle size={24} className="text-blue-500" />
            <span>Draft Products ({draftProducts.length}) — Ready to Publish</span>
          </h2>
          <div className="space-y-4">
            {draftProducts.map(product => (
              <div
                key={product.id}
                className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedProduct(selectedProduct === product.id ? null : product.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-blue-900">{product.name}</h3>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>

                <p className="text-blue-800 text-sm mb-3">{product.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-blue-700 font-semibold">Price</p>
                    <p className="text-xl font-bold text-blue-900">${product.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 font-semibold">Category</p>
                    <p className="text-sm font-semibold text-blue-900">{product.category}</p>
                  </div>
                </div>

                {selectedProduct === product.id && (
                  <div className="border-t border-blue-200 pt-4 mt-4">
                    <p className="text-sm text-center text-blue-700">👇 Details below</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Expanded Product Details */}
      {selectedProduct && products.find(p => p.id === selectedProduct) && (
        <div className="bg-white rounded-lg shadow-xl p-8 border-l-4 border-jade-purple">
          <button
            onClick={() => setSelectedProduct(null)}
            className="float-right text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>

          {products.find(p => p.id === selectedProduct) && (
            <div>
              <h2 className="text-2xl font-bold text-jade-purple mb-6">
                {products.find(p => p.id === selectedProduct)?.name}
              </h2>

              {/* Setup Checklist */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-jade-purple mb-4 flex items-center space-x-2">
                  <Zap size={20} />
                  <span>GHL Setup Checklist</span>
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-5 h-5 text-jade-purple" />
                    <span className="text-gray-800">Create product in GHL dashboard</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-5 h-5 text-jade-purple" />
                    <span className="text-gray-800">Add pricing and product description</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-5 h-5 text-jade-purple" />
                    <span className="text-gray-800">Upload product files/guides</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-5 h-5 text-jade-purple" />
                    <span className="text-gray-800">Set up purchase workflow (email, access)</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-5 h-5 text-jade-purple" />
                    <span className="text-gray-800">Create automation sequences</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-5 h-5 text-jade-purple" />
                    <span className="text-gray-800">Set up email delivery</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-5 h-5 text-jade-purple" />
                    <span className="text-gray-800">Test purchase flow</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="w-5 h-5 text-jade-purple" />
                    <span className="text-gray-800">Publish & make active</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button className="bg-jade-purple text-jade-cream px-6 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors font-semibold">
                  Open in GHL
                </button>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  Publish Product
                </button>
                <button className="bg-white text-jade-purple border-2 border-jade-purple px-6 py-2 rounded-lg hover:bg-jade-cream transition-colors font-semibold">
                  Edit Details
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GHL Integration Guide */}
      <section className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-6">
        <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center space-x-2">
          <Settings size={20} />
          <span>GHL Workflow for Product Launches</span>
        </h3>
        <ol className="space-y-3 text-purple-800">
          <li className="flex items-start space-x-3">
            <span className="font-bold text-purple-600">1.</span>
            <div>
              <p className="font-semibold">Create Product in GHL</p>
              <p className="text-sm text-purple-700">Name, price, description, and product files</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="font-bold text-purple-600">2.</span>
            <div>
              <p className="font-semibold">Set Up Sales Funnel</p>
              <p className="text-sm text-purple-700">Purchase page, upsells, checkout flow</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="font-bold text-purple-600">3.</span>
            <div>
              <p className="font-semibold">Create Automation Sequences</p>
              <p className="text-sm text-purple-700">Welcome email, delivery confirmation, follow-ups</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="font-bold text-purple-600">4.</span>
            <div>
              <p className="font-semibold">Link Meta Ads</p>
              <p className="text-sm text-purple-700">Track conversions, optimize spending</p>
            </div>
          </li>
          <li className="flex items-start space-x-3">
            <span className="font-bold text-purple-600">5.</span>
            <div>
              <p className="font-semibold">Launch & Monitor</p>
              <p className="text-sm text-purple-700">Track sales, ROI, customer feedback</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  );
}
