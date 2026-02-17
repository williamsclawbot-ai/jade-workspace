'use client';

import { useState, useEffect } from 'react';
import { FileText, X, Save, ChevronDown } from 'lucide-react';
import ContentStore, { ContentItem } from '@/lib/contentStore';

export default function Content() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ContentItem | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

    // Update in store
    ContentStore.update(editForm.id, editForm);

    // Update local state
    setItems(ContentStore.getAll());

    // Close modal
    setSelectedItem(null);
    setEditForm(null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSelectedItem(null);
    setEditForm(null);
    setIsEditing(false);
    setExpandedId(null);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { badge: string; bg: string }> = {
      'Ready to Film': { badge: 'bg-blue-100 text-blue-700', bg: 'bg-blue-50' },
      'Ready to Schedule': { badge: 'bg-green-100 text-green-700', bg: 'bg-green-50' },
      'In Progress': { badge: 'bg-yellow-100 text-yellow-700', bg: 'bg-yellow-50' },
      'Scheduled': { badge: 'bg-purple-100 text-purple-700', bg: 'bg-purple-50' },
      'Due for Review': { badge: 'bg-red-100 text-red-700', bg: 'bg-red-50' },
    };
    return colors[status] || colors['Ready to Film'];
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

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📹 Content</h2>
        <p className="text-gray-600">Plan, create, and schedule your weekly content</p>
      </div>

      {/* Content Cards Grid */}
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
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {item.type}
                    </span>
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

              {/* Status Badges */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                  {item.status}
                </span>
                <span className="text-lg" title={item.reviewStatus}>
                  {getReviewIcon(item.reviewStatus)}
                </span>
                {item.reviewDueDate && (
                  <span className="text-xs text-gray-600">Due: {item.reviewDueDate}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 mb-4">{item.description}</p>

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

              {/* Quick Action Buttons */}
              {item.reviewStatus === 'needs-review' && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => {
                      const updated = ContentStore.update(item.id, { reviewStatus: 'approved' });
                      if (updated) {
                        setItems(ContentStore.getAll());
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => {
                      const updated = ContentStore.update(item.id, { reviewStatus: 'changes-requested' });
                      if (updated) {
                        setItems(ContentStore.getAll());
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium transition-colors"
                  >
                    🔄 Changes
                  </button>
                  <button
                    onClick={() => {
                      const updated = ContentStore.update(item.id, { reviewStatus: 'pending' });
                      if (updated) {
                        setItems(ContentStore.getAll());
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
                  >
                    ⏳ Pending
                  </button>
                </div>
              )}

              {item.reviewStatus === 'changes-requested' && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => {
                      const updated = ContentStore.update(item.id, { reviewStatus: 'approved' });
                      if (updated) {
                        setItems(ContentStore.getAll());
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => {
                      const updated = ContentStore.update(item.id, { reviewStatus: 'needs-review' });
                      if (updated) {
                        setItems(ContentStore.getAll());
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                  >
                    ⚠️ Review
                  </button>
                </div>
              )}

              {item.reviewStatus === 'approved' && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => {
                      const updated = ContentStore.update(item.id, { reviewStatus: 'changes-requested' });
                      if (updated) {
                        setItems(ContentStore.getAll());
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium transition-colors"
                  >
                    🔄 Request Changes
                  </button>
                </div>
              )}

              {/* View/Edit Buttons */}
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
              </div>
            </div>
          );
        })}
      </div>

      {/* View/Edit Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{editForm?.title || selectedItem.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{editForm?.day || selectedItem.day} • {editForm?.type || selectedItem.type}</p>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {!isEditing ? (
                // VIEW MODE
                <div className="space-y-6">
                  {/* Status */}
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
                        <option>Ready to Film</option>
                        <option>Ready to Schedule</option>
                        <option>In Progress</option>
                        <option>Scheduled</option>
                        <option>Due for Review</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-bold mb-2">Review Status</p>
                      <select
                        value={selectedItem.reviewStatus || 'pending'}
                        onChange={(e) => {
                          const updated = ContentStore.update(selectedItem.id, { reviewStatus: e.target.value as any });
                          if (updated) {
                            setSelectedItem(updated);
                            setItems(ContentStore.getAll());
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="needs-review">Needs Review</option>
                        <option value="approved">Approved</option>
                        <option value="changes-requested">Changes Requested</option>
                      </select>
                    </div>
                  </div>

                  {/* Script */}
                  {selectedItem.script && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-bold mb-2">Script</p>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm text-gray-700 max-h-48 overflow-y-auto">
                        {selectedItem.script}
                      </div>
                    </div>
                  )}

                  {/* Caption */}
                  {selectedItem.caption && (
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-bold mb-2">Caption</p>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 whitespace-pre-wrap text-sm text-gray-700 max-h-48 overflow-y-auto">
                        {selectedItem.caption}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
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
              ) : (
                // EDIT MODE - 6 Box Layout
                <div className="space-y-6">
                  {/* Status Controls */}
                  <div className="grid grid-cols-2 gap-4 pb-6 border-b">
                    <div>
                      <label className="text-xs text-gray-600 uppercase font-bold mb-2 block">Status</label>
                      <select
                        value={editForm?.status || ''}
                        onChange={(e) => setEditForm({ ...editForm!, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      >
                        <option>Ready to Film</option>
                        <option>Ready to Schedule</option>
                        <option>In Progress</option>
                        <option>Scheduled</option>
                        <option>Due for Review</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 uppercase font-bold mb-2 block">Review Status</label>
                      <select
                        value={editForm?.reviewStatus || 'pending'}
                        onChange={(e) => setEditForm({ ...editForm!, reviewStatus: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="needs-review">Needs Review</option>
                        <option value="approved">Approved</option>
                        <option value="changes-requested">Changes Requested</option>
                      </select>
                    </div>
                  </div>

                  {/* 6 Box Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Hook */}
                    <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                      <p className="text-sm font-bold text-red-700 mb-3">📢 HOOK</p>
                      <textarea
                        value={editForm?.onScreenText?.split('[')[0] || ''}
                        onChange={(e) => {
                          const hook = e.target.value;
                          setEditForm({
                            ...editForm!,
                            onScreenText: hook + (editForm?.onScreenText?.substring(editForm.onScreenText.indexOf('[')) || '')
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
                        value={editForm?.setting || ''}
                        onChange={(e) => setEditForm({ ...editForm!, setting: e.target.value })}
                        className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Where/what setting..."
                      />
                    </div>

                    {/* Script */}
                    <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                      <p className="text-sm font-bold text-red-700 mb-3">📋 SCRIPT</p>
                      <textarea
                        value={editForm?.script || ''}
                        onChange={(e) => setEditForm({ ...editForm!, script: e.target.value })}
                        className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Full script..."
                      />
                    </div>

                    {/* On Screen Text */}
                    <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                      <p className="text-sm font-bold text-red-700 mb-3">📺 ON SCREEN TEXT</p>
                      <textarea
                        value={editForm?.onScreenText || ''}
                        onChange={(e) => setEditForm({ ...editForm!, onScreenText: e.target.value })}
                        className="w-full h-32 p-3 border border-red-300 rounded bg-white text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Text to display on screen..."
                      />
                    </div>

                    {/* Caption */}
                    <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                      <p className="text-sm font-bold text-red-700 mb-3">💭 CAPTION</p>
                      <textarea
                        value={editForm?.caption || ''}
                        onChange={(e) => setEditForm({ ...editForm!, caption: e.target.value })}
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
                          value={editForm?.duration || ''}
                          onChange={(e) => setEditForm({ ...editForm!, duration: e.target.value })}
                          placeholder="Duration (e.g., 45 seconds)"
                          className="w-full px-2 py-1 border border-red-300 rounded bg-white text-xs"
                        />
                        <input
                          type="text"
                          value={editForm?.postTime || ''}
                          onChange={(e) => setEditForm({ ...editForm!, postTime: e.target.value })}
                          placeholder="Post time (e.g., 7:30 PM)"
                          className="w-full px-2 py-1 border border-red-300 rounded bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save/Cancel */}
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
