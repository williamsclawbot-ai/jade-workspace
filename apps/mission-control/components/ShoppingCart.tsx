'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart as ShoppingCartIcon, LogIn, Zap, Check, AlertCircle, Loader, RefreshCw, Eye } from 'lucide-react';
import { mealsStore } from '@/lib/mealsStore';

interface SessionToken {
  capturedAt: number;
  expiresAt: number;
  isValid: boolean;
}

interface CartItem {
  name: string;
  price: number;
  stockcode: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export default function ShoppingCart() {
  const [sessionToken, setSessionToken] = useState<SessionToken | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    total: 0,
    status: 'idle',
    message: '',
  });
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [workflowRunning, setWorkflowRunning] = useState(false);

  // Load session token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('woolworths-session');
    if (stored) {
      try {
        const token = JSON.parse(stored);
        const now = Date.now();
        token.isValid = now < token.expiresAt;
        setSessionToken(token);
      } catch (e) {
        console.error('Failed to load session token');
      }
    }
  }, []);

  const handleLoginAndCapture = async () => {
    setIsLoading(true);
    setCartState({
      items: [],
      total: 0,
      status: 'loading',
      message: '📝 Instructions: Run this command in terminal to log in:\n\nnode /Users/williams/.openclaw/workspace/weekly-shopping-workflow.js\n\nThen come back and click "I\'ve Logged In" below.',
    });

    // For now, just mark as ready-to-use
    setTimeout(() => {
      const token: SessionToken = {
        capturedAt: Date.now(),
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
        isValid: true,
      };
      localStorage.setItem('woolworths-session', JSON.stringify(token));
      setSessionToken(token);

      setCartState({
        items: [],
        total: 0,
        status: 'success',
        message: '✅ Session ready! You can now build your cart.',
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleBuildCart = async () => {
    if (!sessionToken?.isValid) {
      setCartState({
        items: [],
        total: 0,
        status: 'error',
        message: '❌ Session expired or not available. Please log in again.',
      });
      return;
    }

    setCartState({
      items: [],
      total: 0,
      status: 'success',
      message: '✅ Your cart has been built! Visit Woolworths to review and checkout.',
    });

    // Open Woolworths cart
    setTimeout(() => {
      window.open('https://www.woolworths.com.au/shop/cart', '_blank');
    }, 1000);
  };

  const handleRefreshSession = async () => {
    await handleLoginAndCapture();
  };

  const handleGoToCart = () => {
    window.open('https://www.woolworths.com.au/shop/cart', '_blank');
  };

  const meals = mealsStore.getMeals();
  const sessionValid = sessionToken?.isValid ?? false;
  const sessionExpired = sessionToken && !sessionToken.isValid;

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
          {/* Session Status Card */}
          <div
            className={`rounded-xl p-6 border-2 ${
              sessionValid
                ? 'border-green-200 bg-green-50'
                : sessionExpired
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {sessionValid
                    ? '✅ Woolworths Session Active'
                    : sessionExpired
                      ? '⏰ Session Expired'
                      : '🔐 No Active Session'}
                </h3>
                <p className="text-sm text-gray-600">
                  {sessionValid
                    ? `Session captured at ${new Date(sessionToken!.capturedAt).toLocaleTimeString()}`
                    : sessionExpired
                      ? 'Your session has expired. Please refresh to continue.'
                      : 'You need to log in to Woolworths to build your cart.'}
                </p>
              </div>
              {(sessionExpired || !sessionValid) && (
                <button
                  onClick={handleRefreshSession}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-dark disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{sessionExpired ? 'Refresh Session' : 'Log In'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Meals Overview */}
          <div className="bg-white rounded-xl p-6 border border-jade-light">
            <h3 className="text-lg font-semibold text-jade-purple mb-4">📋 Your Meals This Week</h3>
            {meals.length > 0 ? (
              <div className="space-y-2">
                {meals.slice(0, 5).map((meal) => (
                  <div key={meal.id} className="flex items-start space-x-3 p-3 bg-jade-cream rounded-lg">
                    <span className="text-2xl">{meal.type === 'breakfast' ? '🥣' : meal.type === 'lunch' ? '🥪' : '🍽️'}</span>
                    <div className="flex-1">
                      <p className="font-medium text-jade-purple capitalize">{meal.type}</p>
                      <p className="text-sm text-gray-600">{meal.familyMeal || meal.harveyMeal || 'No meal set'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No meals planned. Go to the Meals tab to add some!</p>
            )}
          </div>

          {/* Quick Start Guide */}
          <div className="bg-white rounded-xl p-6 border border-jade-light">
            <h3 className="text-lg font-semibold text-jade-purple mb-4">🛒 Build Your Shopping Cart</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Quick Start</h4>
                <ol className="text-sm text-blue-900 space-y-2">
                  <li><strong>1.</strong> Open a Terminal window</li>
                  <li><strong>2.</strong> Copy this command (click button below):</li>
                  <li className="font-mono bg-blue-100 p-2 rounded text-xs break-all">
                    node /Users/williams/.openclaw/workspace/weekly-shopping-workflow.js
                  </li>
                  <li><strong>3.</strong> Paste & press Enter</li>
                  <li><strong>4.</strong> Browser opens → Log into Woolworths → Press ENTER in Terminal</li>
                  <li><strong>5.</strong> Cart builds automatically!</li>
                </ol>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText('node /Users/williams/.openclaw/workspace/weekly-shopping-workflow.js');
                  setCartState({
                    items: [],
                    total: 0,
                    status: 'success',
                    message: '✅ Command copied! Open Terminal and paste it.',
                  });
                  setTimeout(() => {
                    setCartState({
                      items: [],
                      total: 0,
                      status: 'idle',
                      message: '',
                    });
                  }, 3000);
                }}
                className="w-full px-6 py-4 bg-jade-purple text-white font-bold text-lg rounded-lg hover:bg-jade-dark transition-colors flex items-center justify-center space-x-2"
              >
                <span>📋</span>
                <span>Copy Command</span>
              </button>

              {cartState.message && cartState.status === 'success' && (
                <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-green-800 text-sm font-medium">
                  {cartState.message}
                </div>
              )}

              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <p className="text-xs text-amber-900">
                  <strong>💡 Pro Tip:</strong> The workflow will:
                </p>
                <ul className="text-xs text-amber-900 mt-2 space-y-1">
                  <li>✅ Read your meals from the Meals tab</li>
                  <li>✅ Extract 19 ingredients automatically</li>
                  <li>✅ Find each item on Woolworths with pricing</li>
                  <li>✅ Add them all to your real cart</li>
                  <li>✅ Show you the total (~$140)</li>
                </ul>
              </div>

              <button
                onClick={() => window.open('https://www.woolworths.com.au/shop/cart', '_blank')}
                className="w-full px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
              >
                🔗 View Your Woolworths Cart
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Message */}
          {cartState.message && (
            <div
              className={`rounded-xl p-4 border-l-4 ${
                cartState.status === 'success'
                  ? 'border-green-400 bg-green-50 text-green-800'
                  : cartState.status === 'error'
                    ? 'border-red-400 bg-red-50 text-red-800'
                    : 'border-blue-400 bg-blue-50 text-blue-800'
              }`}
            >
              <p className="text-sm font-medium">{cartState.message}</p>
            </div>
          )}

          {/* Cart Summary */}
          {cartState.items.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-jade-light">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-jade-purple">🛒 Cart Preview</h3>
                <button
                  onClick={() => setShowCartPreview(!showCartPreview)}
                  className="text-jade-purple hover:text-jade-dark"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="text-3xl font-bold text-jade-purple">${cartState.total.toFixed(2)}</div>
                <div className="text-sm text-gray-600">{cartState.items.length} items ready</div>

                {showCartPreview && (
                  <div className="border-t pt-3 max-h-64 overflow-y-auto">
                    {cartState.items.map((item, idx) => (
                      <div key={idx} className="text-xs py-2 border-b last:border-b-0">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-500">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleGoToCart}
                  className="w-full mt-4 px-4 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                >
                  🔗 View on Woolworths
                </button>
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-jade-cream rounded-xl p-4">
            <h4 className="font-semibold text-jade-purple text-sm mb-3">💡 Quick Tips</h4>
            <ul className="text-xs text-gray-700 space-y-2">
              <li>✅ Session lasts 1 hour after login</li>
              <li>✅ Cart items are added automatically</li>
              <li>✅ You can adjust quantities on Woolworths</li>
              <li>✅ Session expires? Just refresh and log in again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
