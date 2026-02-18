'use client';

import { useState } from 'react';
import {
  LayoutGrid,
  BookOpen,
  FileText,
  CheckSquare,
  Zap,
  Calendar,
  Brain,
  Settings,
  UtensilsCrossed,
  CheckCircle2,
  GitBranch,
  BarChart3,
  Mail,
  Inbox,
  Home,
  Clock,
  ClipboardList,
  Users,
  ShoppingCart,
  Building,
  Sun,
  CreditCard,
  ListTodo,
  StickyNote,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navSections = [
    {
      name: 'PRIMARY',
      section: 'primary',
      items: [
        { id: 'today', label: 'Today', icon: Sun },
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'weekly-newsletter', label: 'Newsletter', icon: Mail },
      ],
    },
    {
      name: 'BUSINESS',
      section: 'business',
      items: [
        { id: 'guides', label: 'Guides', icon: BookOpen },
        { id: 'campaigns', label: 'Campaigns', icon: Zap },
        { id: 'combined-metrics', label: 'Metrics', icon: BarChart3 },
        { id: 'hls-tasks', label: 'Pipeline', icon: CheckSquare },
      ],
    },
    {
      name: 'MANAGEMENT',
      section: 'management',
      items: [
        { id: 'inbox', label: 'Quick Capture', icon: Inbox },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'memory', label: 'Memory', icon: Brain },
      ],
    },
    {
      name: 'MORE',
      section: 'more',
      items: [
        { id: 'notes', label: 'Notes', icon: StickyNote },
        { id: 'decisions', label: 'Decisions', icon: GitBranch },
        { id: 'personal-tasks', label: 'Tasks', icon: ListTodo },
        { id: 'office', label: 'Office', icon: Building },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'cleaning-schedule', label: 'Cleaning', icon: CheckCircle2 },
        { id: 'reminders-john', label: 'Reminders', icon: Clock },
        { id: 'household-todos', label: 'To-Dos', icon: ClipboardList },
        { id: 'meal-planning', label: 'Meals', icon: UtensilsCrossed },
        { id: 'woolworths', label: 'Shopping', icon: ShoppingCart },
      ],
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 bg-white border-r border-jade-light shadow-lg transition-all duration-300 z-40 pt-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-jade-light bg-white">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <h1 className="text-lg font-bold text-jade-purple">Mission Control</h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-jade-cream rounded-lg transition-colors text-jade-purple"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation Content */}
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
        {navSections.map((section) => {
          // Handle MORE section differently - show as collapsible or hidden on mobile
          const isMoreSection = section.section === 'more';
          const shouldShow = !isMoreSection || (isMoreSection && (showMoreMenu || !isCollapsed));

          if (!shouldShow && isMoreSection) return null;

          return (
            <nav key={section.section} className="px-2 py-4 space-y-1 border-b border-jade-light">
              {!isCollapsed && (
                <p className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">
                  {section.name}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      if (isMoreSection && isCollapsed) {
                        setShowMoreMenu(false);
                      }
                    }}
                    title={isCollapsed ? item.label : ''}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center' : 'justify-start'
                    } space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-jade-purple text-jade-cream'
                        : 'text-gray-700 hover:bg-jade-cream'
                    }`}
                  >
                    <Icon size={20} />
                    {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          );
        })}

        {/* MORE Toggle Button (when collapsed) */}
        {isCollapsed && (
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="mx-2 my-2 p-2 hover:bg-jade-cream rounded-lg transition-colors text-jade-purple text-center text-xs font-bold"
            title="Show More"
          >
            ⋯
          </button>
        )}

        {/* Footer */}
        {!isCollapsed && (
          <div className="border-t border-jade-light p-4 text-xs text-gray-600 mt-auto">
            <p className="mb-2">💾 Auto-saving</p>
            <p>🔄 Last synced: now</p>
          </div>
        )}
      </div>
    </aside>
  );
}
