/**
 * Centralized status color system for Mission Control
 * Ensures consistent color usage across all tabs and components
 */

export const statusColors = {
  // Content Status
  'Ready to Film': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    border: 'border-blue-200',
  },
  'Ready to Schedule': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
    border: 'border-green-200',
  },
  'In Progress': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700',
    border: 'border-yellow-200',
  },
  'Scheduled': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
    border: 'border-purple-200',
  },
  'Due for Review': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    badge: 'bg-red-100 text-red-700',
    border: 'border-red-200',
  },
  'Draft': {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    badge: 'bg-gray-100 text-gray-700',
    border: 'border-gray-200',
  },

  // Review Status
  'needs-review': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-700',
    border: 'border-orange-200',
    icon: '⚠️',
  },
  'approved': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    badge: 'bg-green-100 text-green-700',
    border: 'border-green-200',
    icon: '✅',
  },
  'changes-requested': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    badge: 'bg-yellow-100 text-yellow-700',
    border: 'border-yellow-200',
    icon: '🔄',
  },
  'pending': {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    badge: 'bg-gray-100 text-gray-700',
    border: 'border-gray-200',
    icon: '⏳',
  },
};

// Note color tags
export const noteColors = {
  'urgent': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: '🔴 Urgent' },
  'question': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: '🟡 Question' },
  'idea': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: '🟢 Idea' },
  'insight': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: '🔵 Insight' },
  'content': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: '🟣 Content' },
  'general': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: '⚪ General' },
};

export function getStatusColor(status: string) {
  return statusColors[status as keyof typeof statusColors] || statusColors['Draft'];
}

export function getNoteColor(color: string) {
  return noteColors[color as keyof typeof noteColors] || noteColors['general'];
}
