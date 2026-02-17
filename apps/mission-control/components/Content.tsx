'use client';

import { useState, useEffect } from 'react';
import { FileText, X, Save, ChevronDown, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import ContentStore, { ContentItem } from '@/lib/contentStore';

export default function Content() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ContentItem | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [viewMode, setViewMode] = useState<'calendar' | 'grid'>('calendar');
  const [addContentModal, setAddContentModal] = useState(false);
  const [newContent, setNewContent] = useState({
    day: 'Monday',
    title: '',
    type: 'Reel' as const,
    description: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  // Load data on mount
  useEffect(() => {
    const data = ContentStore.getAll();
    setItems(data);

    // Listen for storage changes (sync across tabs)
    const handleStorageChange = () => {
      const updated = ContentStore.getAll();
      setItems(updated);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleEdit = (item: ContentItem) => {
    setSelectedItem(item);
    setEditForm({ ...item });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editForm) return;
    ContentStore.update(editForm.id, editForm);
    setItems(ContentStore.getAll());
    setSelectedItem(null);
    setEditForm(null);
    setIsEditing(false);
  };

  const handleFeedback = (item: ContentItem) => {
    setSelectedItem(item);
    setFeedbackText(item.feedback || '');
    setFeedbackModal(true);
  };

  const handleSaveFeedback = () => {
    if (!selectedItem || !feedbackText.trim()) return;
    
    ContentStore.update(selectedItem.id, {
      feedback: feedbackText,
      status: 'Feedback Given'
    });
    
    setItems(ContentStore.getAll());
    setFeedbackModal(false);
    setFeedbackText('');
    setSelectedItem(null);
  };

  const handleCancel = () => {
    setSelectedItem(null);
    setEditForm(null);
    setIsEditing(false);
    setFeedbackModal(false);
    setFeedbackText('');
    setExpandedId(null);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { badge: string; bg: string; dot: string }> = {
      'Awaiting Script': { badge: 'bg-orange-100 text-orange-700', bg: 'bg-orange-50', dot: 'bg-orange-500' },
      'Due for Review': { badge: 'bg-blue-100 text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
      'Feedback Given': { badge: 'bg-yellow-100 text-yellow-700', bg: 'bg-yellow-50', dot: 'bg-yellow-500' },
      'Ready to Film': { badge: 'bg-green-100 text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' },
      'Filmed': { badge: 'bg-purple-100 text-purple-700', bg: 'bg-purple-50', dot: 'bg-purple-500' },
      'Scheduled': { badge: 'bg-indigo-100 text-indigo-700', bg: 'bg-indigo-50', dot: 'bg-indigo-500' },
      'Posted': { badge: 'bg-gray-100 text-gray-700', bg: 'bg-gray-50', dot: 'bg-gray-500' },
    };
    return colors[status] || colors['Awaiting Script'];
  };

  const getReviewIcon = (status?: string) => {
    const icons: Record<string, string> = {
      'needs-review': '⚠️',
      'approved': '✅',
      'changes-requested': '🔄',
      'pending': '⏳',
    };
    return icons[status || 'pending'] || '⏳';
  };

  const handleAddContent = async () => {
    if (!newContent.title.trim() || !newContent.description.trim()) return;
    
    // Create item with Awaiting Script status
    const created = ContentStore.create({
      day: newContent.day,
      title: newContent.title,
      type: newContent.type,
      description: newContent.description,
      status: 'Awaiting Script',
      script: '',
      caption: '',
      onScreenText: '',
      setting: ''
    });
    
    setItems(ContentStore.getAll());
    setAddContentModal(false);
    setNewContent({
      day: 'Monday',
      title: '',
      type: 'Reel',
      description: ''
    });

    // Trigger generation immediately
    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'single',
          idea: created,
          existingExamples: items.slice(0, 3)
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          // Update with generated content
          ContentStore.update(created.id, {
            script: result.data.script,
            caption: result.data.caption,
            onScreenText: result.data.onScreenText,
            setting: result.data.setting,
            status: 'Due for Review'
          });
          setItems(ContentStore.getAll());
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  // Pipeline stats
  const pipelineStats = {
    'Awaiting Script': items.filter(i => i.status === 'Awaiting Script').length,
    'Due for Review': items.filter(i => i.status === 'Due for Review').length,
    'Feedback Given': items.filter(i => i.status === 'Feedback Given').length,
    'Ready to Film': items.filter(i => i.status === 'Ready to Film').length,
    'Filmed': items.filter(i => i.status === 'Filmed').length,
    'Scheduled': items.filter(i => i.status === 'Scheduled').length,
    'Posted': items.filter(i => i.status === 'Posted').length,
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const getItemForDay = (day: string) => items.find(item => item.day === day);

  // Filter all content
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.day.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !filterStatus || item.status === filterStatus;
    const matchesType = !filterType || item.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">📹 Content</h2>
          <p className="text-gray-600">Plan, create, and schedule your weekly content</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAddContentModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            ✨ Add Idea
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'calendar' ? 'bg-jade-purple text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            📅 Calendar
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'grid' ? 'bg-jade-purple text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            📋 Grid
          </button>
        </div>
      </div>

      {/* Pipeline Overview Widget */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={24} className="text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">Content Pipeline</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {Object.entries(pipelineStats).map(([status, count]) => {
            const colors = getStatusColor(status);
            return (
              <div key={status} className={`rounded-lg p-3 text-center ${colors.bg}`}>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-600 font-medium">{status}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* View Mode: Calendar */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} /> This Week
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {days.map(day => {
              const item = getItemForDay(day);
              const colors = item ? getStatusColor(item.status) : getStatusColor('Due for Review');
              
              return (
                <div
                  key={day}
                  onClick={() => item && setSelectedItem(item)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${colors.bg}`}
                >
                  <p className="text-xs font-bold text-gray-600 mb-2 uppercase">{day.slice(0, 3)}</p>
                  {item ? (
                    <>
                      <p className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{item.title}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${colors.badge}`}>
                          {item.status}
                        </span>
                        {item.feedback && (
                          <span className="text-lg">💬</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">No content</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View Mode: Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => {
            const colors = getStatusColor(item.status);

            return (
              <div key={item.id} className={`rounded-lg p-6 border-2 transition-all ${colors.bg}`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-gray-700">{item.day}</span>
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">{item.type}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="p-1 hover:bg-white/50 rounded"
                  >
                    <ChevronDown size={20} className={`transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                    {item.status}
                  </span>
                </div>

                {/* Feedback Display */}
                {item.feedback && (
                  <div className="bg-white p-3 rounded-lg mb-4 border-l-4 border-yellow-400">
                    <p className="text-xs font-bold text-gray-600 mb-1">💬 Your Feedback</p>
                    <p className="text-sm text-gray-700">{item.feedback}</p>
                  </div>
                )}

                {/* Expanded Content */}
                {expandedId === item.id && (
                  <div className="bg-white p-4 rounded-lg mb-4 space-y-3 text-sm max-h-64 overflow-y-auto">
                    {item.script && (
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-1">SCRIPT</p>
                        <p className="text-gray-700 line-clamp-4">{item.script}</p>
                      </div>
                    )}
                    {item.caption && (
                      <div>
                        <p className="text-xs font-bold text-gray-600 mb-1">CAPTION</p>
                        <p className="text-gray-700 line-clamp-3">{item.caption}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsEditing(false);
                    }}
                    className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 px-3 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-purple/90 text-sm font-medium transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  {(item.status === 'Due for Review' || item.status === 'Feedback Given') && (
                    <button
                      onClick={() => handleFeedback(item)}
                      className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium transition-colors"
                    >
                      💬 Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All Content Library */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📚 All Content Library</h3>
        
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search by title, description, or day..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jade-purple focus:border-transparent"
          />
          
          <div className="flex flex-wrap gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Awaiting Script">Awaiting Script</option>
              <option value="Due for Review">Due for Review</option>
              <option value="Feedback Given">Feedback Given</option>
              <option value="Ready to Film">Ready to Film</option>
              <option value="Filmed">Filmed</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Posted">Posted</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option value="">All Types</option>
              <option value="Reel">Reel</option>
              <option value="Carousel">Carousel</option>
              <option value="Static">Static</option>
              <option value="Newsletter">Newsletter</option>
              <option value="Email">Email</option>
            </select>

            {(searchQuery || filterStatus || filterType) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('');
                  setFilterType('');
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Content List */}
        {filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Title</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-600">Day</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const colors = getStatusColor(item.status);
                  return (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{item.day}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${colors.badge}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setIsEditing(false);
                            }}
                            className="text-xs font-medium text-jade-purple hover:underline"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-xs font-medium text-jade-purple hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No content matches your filters</p>
        )}

        <p className="text-xs text-gray-600 mt-4">
          Showing {filteredItems.length} of {items.length} total items
        </p>
      </div>

      {/* View Modal */}
      {selectedItem && !isEditing && !feedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedItem.day} • {selectedItem.type}</p>
              </div>
              <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-bold mb-2">Status</p>
                  <select
                    value={selectedItem.status}
                    onChange={(e) => {
                      const updated = ContentStore.update(selectedItem.id, { status: e.target.value as any });
                      if (updated) {
                        setSelectedItem(updated);
                        setItems(ContentStore.getAll());
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option>Awaiting Script</option>
                    <option>Due for Review</option>
                    <option>Feedback Given</option>
                    <option>Ready to Film</option>
                    <option>Filmed</option>
                    <option>Scheduled</option>
                    <option>Posted</option>
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-bold mb-2">Feedback</p>
                  <button
                    onClick={() => {
                      setFeedbackModal(true);
                      setFeedbackText(selectedItem.feedback || '');
                    }}
                    className="w-full px-3 py-2 border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 font-medium"
                  >
                    {selectedItem.feedback ? '💬 Update Feedback' : '💬 Add Feedback'}
                  </button>
                </div>
              </div>

              {selectedItem.feedback && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-xs font-bold text-gray-600 mb-2">YOUR FEEDBACK</p>
                  <p className="text-gray-700">{selectedItem.feedback}</p>
                </div>
              )}

              {selectedItem.script && (
                <div>
                  <p className="text-xs text-gray-600 uppercase font-bold mb-2">Script</p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm text-gray-700 max-h-48 overflow-y-auto">
                    {selectedItem.script}
                  </div>
                </div>
              )}

              {selectedItem.caption && (
                <div>
                  <p className="text-xs text-gray-600 uppercase font-bold mb-2">Caption</p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm text-gray-700 max-h-48 overflow-y-auto">
                    {selectedItem.caption}
                  </div>
                </div>
              )}

              <div className="flex gap-3 border-t pt-6">
                <button
                  onClick={() => handleEdit(selectedItem)}
                  className="flex-1 px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-purple/90 font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - 6 Box Layout */}
      {selectedItem && isEditing && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-5xl w-full my-8">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Edit: {editForm.title}</h3>
              <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 pb-6 border-b">
                <div>
                  <label className="text-xs text-gray-600 uppercase font-bold mb-2 block">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option>Awaiting Script</option>
                    <option>Due for Review</option>
                    <option>Feedback Given</option>
                    <option>Ready to Film</option>
                    <option>Filmed</option>
                    <option>Scheduled</option>
                    <option>Posted</option>
                  </select>
                </div>
              </div>

              {/* 6 Box Grid */}
              <div className="grid grid-cols-3 gap-4">
                {/* Hook */}
                <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                  <p className="text-sm font-bold text-red-700 mb-3">📢 HOOK</p>
                  <textarea
                    value={editForm.onScreenText?.split('[')[0] || ''}
                    onChange={(e) => {
                      const hook = e.target.value;
                      setEditForm({
                        ...editForm,
                        onScreenText: hook + (editForm.onScreenText?.substring(editForm.onScreenText.indexOf('[')) || '')
                      });
                    }}
                    className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Hook/opening line..."
                  />
                </div>

                {/* Setting */}
                <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                  <p className="text-sm font-bold text-red-700 mb-3">📍 SETTING</p>
                  <textarea
                    value={editForm.setting || ''}
                    onChange={(e) => setEditForm({ ...editForm, setting: e.target.value })}
                    className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Where/what setting..."
                  />
                </div>

                {/* Script */}
                <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                  <p className="text-sm font-bold text-red-700 mb-3">📋 SCRIPT</p>
                  <textarea
                    value={editForm.script || ''}
                    onChange={(e) => setEditForm({ ...editForm, script: e.target.value })}
                    className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Full script..."
                  />
                </div>

                {/* On Screen Text */}
                <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                  <p className="text-sm font-bold text-red-700 mb-3">📺 ON SCREEN TEXT</p>
                  <textarea
                    value={editForm.onScreenText || ''}
                    onChange={(e) => setEditForm({ ...editForm, onScreenText: e.target.value })}
                    className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Text to display on screen..."
                  />
                </div>

                {/* Caption */}
                <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                  <p className="text-sm font-bold text-red-700 mb-3">💭 CAPTION</p>
                  <textarea
                    value={editForm.caption || ''}
                    onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                    className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Social media caption..."
                  />
                </div>

                {/* Duration/Post Time */}
                <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                  <p className="text-sm font-bold text-red-700 mb-3">⏱️ DETAILS</p>
                  <div className="space-y-2 h-32 flex flex-col justify-between">
                    <input
                      type="text"
                      value={editForm.duration || ''}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      placeholder="Duration (e.g., 45 seconds)"
                      className="w-full px-2 py-1 border border-red-300 rounded bg-white text-xs"
                    />
                    <input
                      type="text"
                      value={editForm.postTime || ''}
                      onChange={(e) => setEditForm({ ...editForm, postTime: e.target.value })}
                      placeholder="Post time (e.g., 7:30 PM)"
                      className="w-full px-2 py-1 border border-red-300 rounded bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t pt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="border-b p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">💬 Leave Feedback</h3>
              <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-4">
              <p className="text-gray-600">Providing feedback on: <span className="font-bold">{selectedItem.title}</span></p>
              
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                placeholder="What needs to change? Be specific about what you'd like me to adjust..."
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">What happens next:</span> You submit this feedback, and I'll revise the content based on your notes. It will move back to "Due for Review" so you can check it again.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveFeedback}
                  disabled={!feedbackText.trim()}
                  className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 font-bold"
                >
                  Send Feedback
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      {addContentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="border-b p-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">✨ Add Content Idea</h3>
              <button onClick={() => setAddContentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Day</label>
                  <select
                    value={newContent.day}
                    onChange={(e) => setNewContent({ ...newContent, day: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-700 mb-2 block">Content Type</label>
                  <select
                    value={newContent.type}
                    onChange={(e) => setNewContent({ ...newContent, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="Reel">Reel (45-60 sec video)</option>
                    <option value="Carousel">Carousel (5-7 slides)</option>
                    <option value="Static">Static (single image + caption)</option>
                    <option value="Newsletter">Newsletter</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Title</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  placeholder="e.g., Sleep Training Myths"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-2 block">Your Idea / Description</label>
                <textarea
                  value={newContent.description}
                  onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                  placeholder="What's the main idea or topic? What should I focus on? Any specific angle or message?"
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">What happens next:</span> Your idea will be saved with "Awaiting Script" status. I'll check it each night and generate a full script (Hook, Setting, Script, Caption) for you to review on Friday 11pm generation cycle.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddContent}
                  disabled={!newContent.title.trim() || !newContent.description.trim()}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 font-bold"
                >
                  Add Content
                </button>
                <button
                  onClick={() => setAddContentModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
