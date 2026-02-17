'use client';

import { useState, useEffect } from 'react';
import { GitBranch, Plus, CheckCircle2, Clock, Pause } from 'lucide-react';

interface Decision {
  id: string;
  title: string;
  question: string;
  status: 'open' | 'decided' | 'postponed';
  dateAdded: string;
  dueDate?: string;
}

const DEFAULT_DECISIONS: Decision[] = [
  {
    id: '1',
    title: 'Daycare Prep Guide',
    question: 'Is this still worth creating or has the window passed for this year?',
    status: 'open',
    dateAdded: '2026-02-17',
    dueDate: '2026-02-25',
  },
  {
    id: '2',
    title: 'Guide Launch Strategy',
    question: 'Do I launch guides one at a time as they\'re ready, or wait until the full bundle is complete?',
    status: 'open',
    dateAdded: '2026-02-17',
    dueDate: '2026-02-28',
  },
  {
    id: '3',
    title: 'Technical approach for Meta Ads, GoHighLevel, and Stripe integrations',
    question: 'Decide: What access is needed for each integration? Who sets up what? Document approach.',
    status: 'open',
    dateAdded: '2026-02-17',
    dueDate: '2026-03-05',
  },
];

export default function Decisions() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newDecision, setNewDecision] = useState({ title: '', question: '', dueDate: '' });

  // Load decisions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('decisionsData');
    if (saved) {
      try {
        setDecisions(JSON.parse(saved));
      } catch (e) {
        setDecisions(DEFAULT_DECISIONS);
      }
    } else {
      setDecisions(DEFAULT_DECISIONS);
    }
  }, []);

  // Save decisions to localStorage whenever they change
  useEffect(() => {
    if (decisions.length > 0) {
      localStorage.setItem('decisionsData', JSON.stringify(decisions));
    }
  }, [decisions]);

  const openCount = decisions.filter(d => d.status === 'open').length;
  const decidedCount = decisions.filter(d => d.status === 'decided').length;
  const postponedCount = decisions.filter(d => d.status === 'postponed').length;

  const toggleStatus = (id: string) => {
    setDecisions(decisions.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === 'open' ? 'decided' : d.status === 'decided' ? 'postponed' : 'open';
        return { ...d, status: nextStatus as 'open' | 'decided' | 'postponed' };
      }
      return d;
    }));
  };

  const addDecision = () => {
    if (newDecision.title.trim() && newDecision.question.trim()) {
      setDecisions([
        ...decisions,
        {
          id: Date.now().toString(),
          title: newDecision.title,
          question: newDecision.question,
          status: 'open',
          dateAdded: new Date().toISOString().split('T')[0],
          dueDate: newDecision.dueDate || undefined,
        },
      ]);
      setNewDecision({ title: '', question: '', dueDate: '' });
      setShowForm(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'decided':
        return <CheckCircle2 size={20} className="text-green-600" />;
      case 'postponed':
        return <Pause size={20} className="text-amber-600" />;
      case 'open':
      default:
        return <Clock size={20} className="text-blue-600" />;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'decided':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'postponed':
        return 'bg-amber-50 border-amber-200 hover:bg-amber-100';
      case 'open':
      default:
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'decided':
        return 'text-green-700';
      case 'postponed':
        return 'text-amber-700';
      case 'open':
      default:
        return 'text-blue-700';
    }
  };

  const groupedDecisions = {
    open: decisions.filter(d => d.status === 'open'),
    decided: decisions.filter(d => d.status === 'decided'),
    postponed: decisions.filter(d => d.status === 'postponed'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <GitBranch size={32} />
              <h1 className="text-3xl font-bold">Decisions</h1>
            </div>
            <p className="text-jade-cream opacity-90">
              Track decisions you need to make. Revisit when ready.
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{openCount}</p>
            <p className="text-jade-cream opacity-90">Open decisions</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center space-x-3">
            <Clock size={28} className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Open</p>
              <p className="text-2xl font-bold text-blue-600">{openCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center space-x-3">
            <CheckCircle2 size={28} className="text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Decided</p>
              <p className="text-2xl font-bold text-green-600">{decidedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500">
          <div className="flex items-center space-x-3">
            <Pause size={28} className="text-amber-600" />
            <div>
              <p className="text-sm text-gray-600">Postponed</p>
              <p className="text-2xl font-bold text-amber-600">{postponedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Decision Button */}
      <div>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-jade-purple text-white rounded-lg font-semibold hover:bg-jade-purple/90 transition-colors shadow-md"
          >
            <Plus size={20} />
            <span>Add Decision</span>
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-jade-light">
            <h3 className="text-lg font-semibold text-jade-purple mb-4">New Decision</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Decision Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Product Launch Timeline"
                  value={newDecision.title}
                  onChange={(e) => setNewDecision({ ...newDecision, title: e.target.value })}
                  className="w-full px-4 py-2 border border-jade-light rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-purple"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question / Context
                </label>
                <textarea
                  placeholder="What do you need to decide?"
                  value={newDecision.question}
                  onChange={(e) => setNewDecision({ ...newDecision, question: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-jade-light rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-purple resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={newDecision.dueDate}
                  onChange={(e) => setNewDecision({ ...newDecision, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-jade-light rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-purple"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={addDecision}
                  className="flex-1 px-4 py-2 bg-jade-purple text-white rounded-lg font-medium hover:bg-jade-purple/90 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setNewDecision({ title: '', question: '', dueDate: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decisions List */}
      <div className="space-y-6">
        {/* Open Decisions */}
        {groupedDecisions.open.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-jade-purple mb-3 flex items-center space-x-2">
              <Clock size={20} className="text-blue-600" />
              <span>Awaiting Decision ({groupedDecisions.open.length})</span>
            </h2>
            <div className="space-y-3">
              {groupedDecisions.open.map((decision) => (
                <div
                  key={decision.id}
                  className={`rounded-lg border-2 p-5 transition-all cursor-pointer ${getStatusBgColor(decision.status)}`}
                  onClick={() => toggleStatus(decision.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{getStatusIcon(decision.status)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {decision.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{decision.question}</p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusTextColor(decision.status)} bg-white`}>
                            {decision.status === 'open' ? '⏳ Open' : decision.status === 'decided' ? '✓ Decided' : '⏸ Postponed'}
                          </span>
                          {decision.dueDate && (
                            <span className="text-xs text-gray-500 px-2.5 py-1 bg-white rounded-full">
                              Due: {formatDate(decision.dueDate)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">Added {formatDate(decision.dateAdded)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decided Decisions */}
        {groupedDecisions.decided.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-jade-purple mb-3 flex items-center space-x-2">
              <CheckCircle2 size={20} className="text-green-600" />
              <span>Decided ({groupedDecisions.decided.length})</span>
            </h2>
            <div className="space-y-3">
              {groupedDecisions.decided.map((decision) => (
                <div
                  key={decision.id}
                  className={`rounded-lg border-2 p-5 transition-all cursor-pointer opacity-75 ${getStatusBgColor(decision.status)}`}
                  onClick={() => toggleStatus(decision.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{getStatusIcon(decision.status)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {decision.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{decision.question}</p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusTextColor(decision.status)} bg-white`}>
                            {decision.status === 'open' ? '⏳ Open' : decision.status === 'decided' ? '✓ Decided' : '⏸ Postponed'}
                          </span>
                          {decision.dueDate && (
                            <span className="text-xs text-gray-500 px-2.5 py-1 bg-white rounded-full">
                              Due: {formatDate(decision.dueDate)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">Added {formatDate(decision.dateAdded)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Postponed Decisions */}
        {groupedDecisions.postponed.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-jade-purple mb-3 flex items-center space-x-2">
              <Pause size={20} className="text-amber-600" />
              <span>Postponed ({groupedDecisions.postponed.length})</span>
            </h2>
            <div className="space-y-3">
              {groupedDecisions.postponed.map((decision) => (
                <div
                  key={decision.id}
                  className={`rounded-lg border-2 p-5 transition-all cursor-pointer opacity-75 ${getStatusBgColor(decision.status)}`}
                  onClick={() => toggleStatus(decision.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{getStatusIcon(decision.status)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {decision.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{decision.question}</p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusTextColor(decision.status)} bg-white`}>
                            {decision.status === 'open' ? '⏳ Open' : decision.status === 'decided' ? '✓ Decided' : '⏸ Postponed'}
                          </span>
                          {decision.dueDate && (
                            <span className="text-xs text-gray-500 px-2.5 py-1 bg-white rounded-full">
                              Due: {formatDate(decision.dueDate)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">Added {formatDate(decision.dateAdded)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {decisions.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <GitBranch size={48} className="text-jade-light mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Decisions Yet</h3>
            <p className="text-gray-500">
              Add your first decision to start tracking what needs your attention.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
