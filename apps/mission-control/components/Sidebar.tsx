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
  TrendingUp,
  ShoppingBag,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    business: true,
    home: true,
    management: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const key = section as keyof typeof prev;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const navSections = [
    {
      id: 'today',
      name: 'TODAY',
      section: 'today',
      items: [{ id: 'today', label: 'Command Center', icon: Sun }],
    },
    {
      id: 'business',
      name: 'BUSINESS',
      subtext: 'Hello Little Sleepers',
      section: 'business',
      items: [
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'weekly-newsletter', label: 'Newsletter', icon: Mail },
        { id: 'hls-tasks', label: 'Pipeline', icon: CheckSquare },
        { id: 'combined-metrics', label: 'Metrics', icon: BarChart3 },
        { id: 'campaigns', label: 'Campaigns', icon: Zap },
        { id: 'ghl', label: 'GHL', icon: Building },
        { id: 'stripe-revenue', label: 'Stripe', icon: CreditCard },
        { id: 'meta-ads', label: 'Ads', icon: TrendingUp },
      ],
    },
    {
      id: 'home',
      name: 'HOME',
      subtext: 'Personal/Household',
      section: 'home',
      items: [
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'cleaning-schedule', label: 'Cleaning', icon: CheckCircle2 },
        { id: 'reminders-john', label: 'Reminders for John', icon: Clock },
        { id: 'meal-planning', label: 'Meals', icon: UtensilsCrossed },
        { id: 'woolworths', label: 'Shopping Cart (Checkout)', icon: ShoppingCart },
        { id: 'household-todos', label: 'To-Do Lists', icon: ListTodo },
      ],
    },
    {
      id: 'management',
      name: 'MANAGEMENT',
      subtext: 'Overarching',
      section: 'management',
      items: [
        { id: 'decisions', label: 'Decisions', icon: GitBranch },
        { id: 'personal-tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'notes', label: 'Notes', icon: StickyNote },
        { id: 'inbox', label: 'Quick Capture', icon: Inbox },
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
            <div>
              <h1 className="text-lg font-bold text-jade-purple">Mission Control</h1>
              <p className="text-xs text-gray-500">Command Center</p>
            </div>
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
          const isExpanded =
            section.section === 'today' ||
            (section.section !== 'today' && expandedSections[section.section as keyof typeof expandedSections]);

          return (
            <div key={section.id} className="border-b border-jade-light">
              {/* Section Header */}
              {section.section !== 'today' && (
                <button
                  onClick={() => toggleSection(section.section)}
                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-jade-cream transition-colors ${
                    !isCollapsed ? 'text-left' : 'justify-center'
                  }`}
                >
                  <div className={!isCollapsed ? 'flex-1' : 'hidden'}>
                    <p className="text-xs font-semibold text-gray-600 uppercase">{section.name}</p>
                    {section.subtext && <p className="text-xs text-gray-400">{section.subtext}</p>}
                  </div>
                  {!isCollapsed && (
                    <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  )}
                </button>
              )}

              {/* Section Items */}
              {(isExpanded || section.section === 'today') && (
                <nav className={`px-2 py-2 space-y-1 ${section.section === 'today' ? 'py-4' : ''}`}>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
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
              )}
            </div>
          );
        })}

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
