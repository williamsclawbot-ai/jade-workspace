'use client';

import { useState, useEffect } from 'react';
import {
  Sun,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Mail,
  Clock,
  Coffee,
  Award,
  Zap,
  Target,
  ChevronRight,
  Users,
  DollarSign,
  BookOpen,
} from 'lucide-react';
import ContentStore from '@/lib/contentStore';
import { mealsStore } from '@/lib/mealsStore';
import { appointmentsStore } from '@/lib/appointmentsStore';
import { remindersStore } from '@/lib/remindersStore';
import { todoStore } from '@/lib/todoStore';
import { tasksStore } from '@/lib/tasksStore';

interface MetricsData {
  monthlyRevenue: number;
  activeSubscribers: number;
  conversionRate: number;
  previousMonthRevenue?: number;
  growth?: number;
}

interface UrgentItem {
  id: string;
  title: string;
  source: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

export default function MorningBriefing() {
  const [dayProgress, setDayProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [urgentItems, setUrgentItems] = useState<UrgentItem[]>([]);
  const [contentDueToday, setContentDueToday] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [unsentReminders, setUnsentReminders] = useState<any[]>([]);
  const [todayTodos, setTodayTodos] = useState<any[]>([]);
  const [yesterdayWins, setYesterdayWins] = useState<string[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    vercel: 'healthy',
    ghl: 'healthy',
    stripe: 'healthy',
  });

  // Calculate time and day progress
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Time display
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      // Day progress percentage
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);

      const elapsed = now.getTime() - start.getTime();
      const total = end.getTime() - start.getTime();
      const percent = Math.round((elapsed / total) * 100);

      setDayProgress(Math.min(percent, 100));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch metrics from APIs
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [ghlRes, stripeRes] = await Promise.all([
          fetch('/api/ghl/metrics'),
          fetch('/api/stripe/revenue'),
        ]);

        let mergedMetrics = {
          monthlyRevenue: 0,
          activeSubscribers: 0,
          conversionRate: 0,
          previousMonthRevenue: 0,
          growth: 0,
        };

        if (ghlRes.ok) {
          const ghlData = await ghlRes.json();
          mergedMetrics.activeSubscribers = ghlData.subscribers || ghlData.activeSubscribers || 0;
          mergedMetrics.conversionRate = ghlData.conversionRate || 0;
        }

        if (stripeRes.ok) {
          const stripeData = await stripeRes.json();
          mergedMetrics.monthlyRevenue = stripeData.monthlyRevenue || stripeData.totalRevenue || 0;
          mergedMetrics.previousMonthRevenue = stripeData.previousMonthRevenue || 0;
          mergedMetrics.growth = stripeData.growth || 0;
        }

        setMetricsData(mergedMetrics);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        // Set default metrics on error
        setMetricsData({
          monthlyRevenue: 0,
          activeSubscribers: 0,
          conversionRate: 0,
          previousMonthRevenue: 0,
          growth: 0,
        });
      }
    };

    fetchMetrics();
    const metricsInterval = setInterval(fetchMetrics, 300000); // Refresh every 5 minutes
    return () => clearInterval(metricsInterval);
  }, []);

  // Load all data sources
  useEffect(() => {
    const loadAllData = () => {
      // Content due for review today
      const contentItems = ContentStore.getAll().filter(
        (item) => item.status === 'Due for Review' || item.status === 'Feedback Given'
      );
      setContentDueToday(contentItems);

      // Appointments for today
      const appointments = appointmentsStore.getTodayAppointments();
      setTodayAppointments(appointments);

      // Unsent reminders
      const reminders = remindersStore.getUnsentReminders();
      setUnsentReminders(reminders);

      // To-do items for today
      const todos = todoStore.getTodayTodos();
      setTodayTodos(todos);

      // Build urgent items list
      const urgent: UrgentItem[] = [];

      // Priority: Content due for review
      contentItems.forEach((item) => {
        urgent.push({
          id: item.id,
          title: `Review: ${item.title}`,
          source: 'Content',
          priority: 'critical',
          icon: <Mail className="w-4 h-4" />,
        });
      });

      // Priority: Unsent reminders
      reminders.forEach((reminder) => {
        urgent.push({
          id: reminder.id,
          title: `Reminder: ${reminder.text}`,
          source: 'Reminders',
          priority: 'high',
          icon: <Clock className="w-4 h-4" />,
        });
      });

      // Priority: Incomplete todos
      todos.forEach((todo) => {
        if (!todo.completed) {
          urgent.push({
            id: todo.id,
            title: todo.title,
            source: 'Tasks',
            priority: todo.priority === 'high' ? 'high' : 'medium',
            icon: <CheckCircle2 className="w-4 h-4" />,
          });
        }
      });

      // Sort by priority
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      urgent.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

      setUrgentItems(urgent.slice(0, 8)); // Top 8 items

      // Load yesterday's wins (from localStorage/memory)
      try {
        const wins = localStorage.getItem('yesterdayWins');
        if (wins) {
          setYesterdayWins(JSON.parse(wins).slice(0, 3));
        }
      } catch (error) {
        console.error('Error loading yesterday wins:', error);
      }

      // Load upcoming deadlines (next 3 days)
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      
      const allTasks = tasksStore.getTasks();
      const deadlines = allTasks
        .filter((task) => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          return dueDate > now && dueDate <= threeDaysFromNow;
        })
        .sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return dateA - dateB;
        })
        .slice(0, 5);

      setUpcomingDeadlines(deadlines);
    };

    loadAllData();
    const interval = setInterval(loadAllData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getRevenueGrowth = () => {
    if (!metricsData) return 0;
    if (metricsData.growth !== undefined && metricsData.growth !== null) return Math.round(metricsData.growth);
    if (!metricsData.previousMonthRevenue || metricsData.previousMonthRevenue === 0) return 0;
    return Math.round(
      ((metricsData.monthlyRevenue - metricsData.previousMonthRevenue) / metricsData.previousMonthRevenue) * 100
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning, Jade! ☀️";
    if (hour < 17) return "Good afternoon, Jade! 🌤️";
    return "Good evening, Jade! 🌙";
  })();

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-jade-purple to-blue-600 text-white rounded-xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{greeting}</h1>
            <p className="text-blue-100">Here's everything you need to know before you start</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{currentTime}</div>
            <div className="text-sm text-blue-100">Saturday, Feb 21</div>
          </div>
        </div>

        {/* Day Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Day progress</span>
            <span className="font-semibold">{dayProgress}%</span>
          </div>
          <div className="w-full bg-blue-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-yellow-300 h-full rounded-full transition-all duration-1000"
              style={{ width: `${dayProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {metricsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Monthly Revenue</h3>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-jade-purple mb-2">
              ${metricsData.monthlyRevenue.toLocaleString()}
            </div>
            <div className={`text-sm ${getRevenueGrowth() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {getRevenueGrowth() >= 0 ? '↑' : '↓'} {Math.abs(getRevenueGrowth())}% vs last month
            </div>
          </div>

          {/* Active Subscribers */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Active Subscribers</h3>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-jade-purple">{metricsData.activeSubscribers}</div>
            <div className="text-sm text-gray-500">Across all products</div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Conversion Rate</h3>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-jade-purple">{metricsData.conversionRate}%</div>
            <div className="text-sm text-gray-500">Lead → Customer</div>
          </div>

          {/* Content Due Today */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">Content Due</h3>
              <Mail className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-jade-purple">{contentDueToday.length}</div>
            <div className="text-sm text-gray-500">Awaiting review</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* URGENT ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-jade-purple">What Needs Attention</h2>
          </div>

          {urgentItems.length > 0 ? (
            <div className="space-y-2">
              {urgentItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg border-2 p-4 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer ${getPriorityColor(
                    item.priority
                  )}`}
                >
                  <div className="mt-1">{item.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-xs opacity-75 mt-1">{item.source}</div>
                  </div>
                  <div className="text-xs font-bold uppercase opacity-50">{item.priority}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-700 font-semibold">Everything is clear!</p>
              <p className="text-sm text-green-600">No urgent items this morning</p>
            </div>
          )}
        </div>

        {/* SIDEBAR: WINS & DEADLINES */}
        <div className="space-y-6">
          {/* Yesterday's Wins */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-jade-purple">Yesterday's Wins</h3>
            </div>
            {yesterdayWins.length > 0 ? (
              <ul className="space-y-2">
                {yesterdayWins.map((win, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <span className="text-amber-600 font-bold mt-0.5">✓</span>
                    <span className="text-sm text-amber-900">{win}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No wins recorded yet</p>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-jade-purple">Next 3 Days</h3>
            </div>
            {upcomingDeadlines.length > 0 ? (
              <ul className="space-y-2">
                {upcomingDeadlines.map((deadline) => {
                  const dueDate = new Date(deadline.dueDate);
                  const daysUntil = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <li key={deadline.id} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex items-start justify-between">
                        <div className="text-sm font-semibold text-blue-900 flex-1">{deadline.title}</div>
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded whitespace-nowrap ml-2">
                          {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No upcoming deadlines</p>
            )}
          </div>
        </div>
      </div>

      {/* TODAY'S SCHEDULE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appointments */}
        {todayAppointments.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-jade-purple">Today's Appointments</h3>
            </div>
            <ul className="space-y-3">
              {todayAppointments.slice(0, 4).map((apt) => (
                <li key={apt.id} className="flex items-start gap-3 pb-3 border-b border-jade-light last:border-0">
                  <Clock className="w-4 h-4 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{apt.title}</div>
                    <div className="text-xs text-gray-500">{apt.time || 'Time TBD'}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reminders */}
        {unsentReminders.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-jade-purple">Pending Reminders</h3>
            </div>
            <ul className="space-y-3">
              {unsentReminders.slice(0, 4).map((reminder) => (
                <li key={reminder.id} className="flex items-start gap-3 pb-3 border-b border-jade-light last:border-0">
                  <Zap className="w-4 h-4 text-orange-600 mt-1" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{reminder.text}</div>
                    <div className="text-xs text-gray-500">{reminder.dueTime || 'Send today'}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* SYSTEM HEALTH */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-bold text-jade-purple">System Health</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(systemHealth).map(([service, status]) => (
            <div key={service} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <div className="font-semibold text-sm capitalize">{service}</div>
                <div className="text-xs text-gray-500">All systems operational</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="bg-gradient-to-r from-jade-cream to-blue-50 rounded-lg p-6 border border-jade-light">
        <p className="text-sm text-gray-600">
          <strong className="text-jade-purple">{contentDueToday.length}</strong> pieces of content awaiting review •{' '}
          <strong className="text-jade-purple">{todayAppointments.length}</strong> appointments scheduled •{' '}
          <strong className="text-jade-purple">{todayTodos.length}</strong> tasks for today
        </p>
      </div>
    </div>
  );
}
