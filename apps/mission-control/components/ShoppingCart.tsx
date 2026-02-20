'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart as ShoppingCartIcon, Loader, Check, AlertCircle, Eye, Zap } from 'lucide-react';

interface WorkflowStatus {
  status: 'starting' | 'waiting_for_login' | 'searching' | 'adding_to_cart' | 'complete' | 'error';
  logs: string[];
  ingredients: string[];
  cartItems: any[];
  cartTotal: number;
}

export default function ShoppingCart() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  // Poll for workflow status when active
  useEffect(() => {
    if (!sessionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/woolworths/build-cart?sessionId=${sessionId}`);
        const data = await response.json();

        if (data.success) {
          setWorkflowStatus(data);

          // Stop polling when complete or error
          if (data.status === 'complete' || data.status === 'error') {
            setIsBuilding(false);
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error('Failed to poll workflow status:', error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [sessionId]);

  const handleBuildCart = async () => {
    setIsBuilding(true);
    setWorkflowStatus(null);
    setSessionId(null);

    try {
      const response = await fetch('/api/woolworths/build-cart', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setSessionId(data.sessionId);
        setWorkflowStatus({
          status: 'starting',
          logs: [data.message],
          ingredients: [],
          cartItems: [],
          cartTotal: 0,
        });
      } else {
        setWorkflowStatus({
          status: 'error',
          logs: [data.error || 'Failed to start workflow'],
          ingredients: [],
          cartItems: [],
          cartTotal: 0,
        });
        setIsBuilding(false);
      }
    } catch (error: any) {
      setWorkflowStatus({
        status: 'error',
        logs: [error.message || 'Failed to start workflow'],
        ingredients: [],
        cartItems: [],
        cartTotal: 0,
      });
      setIsBuilding(false);
    }
  };

  const getStatusMessage = () => {
    if (!workflowStatus) return 'Ready to build your cart';

    switch (workflowStatus.status) {
      case 'starting':
        return '🚀 Starting workflow...';
      case 'waiting_for_login':
        return '🔐 Browser opened - Please log into Woolworths now!';
      case 'searching':
        return '🔍 Searching for ingredients...';
      case 'adding_to_cart':
        return '🛒 Adding items to your cart...';
      case 'complete':
        return '✅ Cart built successfully!';
      case 'error':
        return '❌ An error occurred';
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    if (!workflowStatus) return 'gray';

    switch (workflowStatus.status) {
      case 'starting':
      case 'waiting_for_login':
      case 'searching':
      case 'adding_to_cart':
        return 'blue';
      case 'complete':
        return 'green';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  const statusColor = getStatusColor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-jade-cream via-white to-jade-light p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <ShoppingCartIcon className="w-8 h-8 text-jade-purple" />
          <h1 className="text-4xl font-bold text-jade-purple">Shopping Cart Manager</h1>
        </div>
        <p className="text-gray-600">
          Transform your meal plan into a ready-to-checkout Woolworths cart automatically
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div
            className={`rounded-xl p-6 border-2 ${
              statusColor === 'green'
                ? 'border-green-200 bg-green-50'
                : statusColor === 'red'
                  ? 'border-red-200 bg-red-50'
                  : statusColor === 'blue'
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 flex items-center space-x-2">
                  {isBuilding && <Loader className="w-5 h-5 animate-spin" />}
                  {workflowStatus?.status === 'complete' && <Check className="w-5 h-5 text-green-600" />}
                  {workflowStatus?.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  <span>{getStatusMessage()}</span>
                </h3>
                <p className="text-sm text-gray-600">
                  {!isBuilding && !workflowStatus && 'Click the button below to start building your Woolworths cart'}
                  {workflowStatus?.status === 'waiting_for_login' &&
                    'A browser window has opened. Please log into your Woolworths account. The workflow will continue automatically after login.'}
                  {workflowStatus?.status === 'searching' &&
                    `Searching Woolworths for ingredients from your meal plan...`}
                  {workflowStatus?.status === 'adding_to_cart' &&
                    'Adding items to your Woolworths cart...'}
                  {workflowStatus?.status === 'complete' &&
                    `${workflowStatus.cartItems.length} items added to your cart (Total: $${workflowStatus.cartTotal.toFixed(2)})`}
                </p>
              </div>
            </div>
          </div>

          {/* Build Cart Button */}
          {!isBuilding && workflowStatus?.status !== 'complete' && (
            <div className="bg-white rounded-xl p-6 border border-jade-light">
              <h3 className="text-lg font-semibold text-jade-purple mb-4">🛒 Build Your Shopping Cart</h3>
              
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">How it works</h4>
                  <ol className="text-sm text-blue-900 space-y-2">
                    <li><strong>1.</strong> Click "Build Cart" below</li>
                    <li><strong>2.</strong> Browser opens → Log into Woolworths</li>
                    <li><strong>3.</strong> Workflow automatically builds your cart!</li>
                  </ol>
                </div>

                <button
                  onClick={handleBuildCart}
                  disabled={isBuilding}
                  className="w-full px-6 py-4 bg-jade-purple text-white font-bold text-lg rounded-lg hover:bg-jade-dark transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-5 h-5" />
                  <span>Build Cart Automatically</span>
                </button>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <p className="text-xs text-amber-900">
                    <strong>💡 What happens next:</strong>
                  </p>
                  <ul className="text-xs text-amber-900 mt-2 space-y-1">
                    <li>✅ Reads meals from your Meals tab</li>
                    <li>✅ Extracts ingredients automatically</li>
                    <li>✅ Finds each item on Woolworths with pricing</li>
                    <li>✅ Adds them all to your cart</li>
                    <li>✅ Opens your cart when done</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Success Actions */}
          {workflowStatus?.status === 'complete' && (
            <div className="bg-white rounded-xl p-6 border border-jade-light space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Cart Ready!</h3>
              </div>
              
              <p className="text-gray-700">
                Your Woolworths cart has been built with {workflowStatus.cartItems.length} items.
                Total: <strong>${workflowStatus.cartTotal.toFixed(2)}</strong>
              </p>

              <button
                onClick={() => window.open('https://www.woolworths.com.au/shop/cart', '_blank')}
                className="w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
              >
                🔗 View & Checkout on Woolworths
              </button>

              <button
                onClick={handleBuildCart}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                🔄 Build Cart Again
              </button>
            </div>
          )}

          {/* Workflow Logs */}
          {workflowStatus && workflowStatus.logs.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-jade-light">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-jade-purple">📋 Workflow Log</h3>
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="text-jade-purple hover:text-jade-dark flex items-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{showLogs ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              {showLogs && (
                <div className="max-h-64 overflow-y-auto bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs">
                  {workflowStatus.logs.map((log, idx) => (
                    <div key={idx} className="mb-1">{log}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <div className="bg-jade-cream rounded-xl p-4">
            <h4 className="font-semibold text-jade-purple text-sm mb-3">💡 Quick Tips</h4>
            <ul className="text-xs text-gray-700 space-y-2">
              <li>✅ Make sure you have meals in your Meals tab</li>
              <li>✅ Browser will open automatically for login</li>
              <li>✅ Workflow runs in the background</li>
              <li>✅ You can adjust quantities on Woolworths after</li>
              <li>✅ Cart stays active for checkout</li>
            </ul>
          </div>

          {/* Progress Indicator */}
          {isBuilding && (
            <div className="bg-white rounded-xl p-6 border border-jade-light">
              <h3 className="font-semibold text-jade-purple mb-4">🔄 Progress</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      workflowStatus?.status ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-sm">Workflow started</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      workflowStatus?.status === 'waiting_for_login' ||
                      workflowStatus?.status === 'searching' ||
                      workflowStatus?.status === 'adding_to_cart' ||
                      workflowStatus?.status === 'complete'
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-sm">Browser opened</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      workflowStatus?.status === 'searching' ||
                      workflowStatus?.status === 'adding_to_cart' ||
                      workflowStatus?.status === 'complete'
                        ? 'bg-green-500'
                        : workflowStatus?.status === 'waiting_for_login'
                          ? 'bg-yellow-500 animate-pulse'
                          : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-sm">
                    {workflowStatus?.status === 'waiting_for_login' ? 'Waiting for login...' : 'Logged in'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      workflowStatus?.status === 'adding_to_cart' || workflowStatus?.status === 'complete'
                        ? 'bg-green-500'
                        : workflowStatus?.status === 'searching'
                          ? 'bg-yellow-500 animate-pulse'
                          : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-sm">
                    {workflowStatus?.status === 'searching' ? 'Searching...' : 'Search complete'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      workflowStatus?.status === 'complete'
                        ? 'bg-green-500'
                        : workflowStatus?.status === 'adding_to_cart'
                          ? 'bg-yellow-500 animate-pulse'
                          : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-sm">
                    {workflowStatus?.status === 'adding_to_cart'
                      ? 'Adding to cart...'
                      : workflowStatus?.status === 'complete'
                        ? 'Cart built!'
                        : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
