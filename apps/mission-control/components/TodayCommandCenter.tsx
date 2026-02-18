'use client';

import { useState, useEffect } from 'react';
import {
  Sun,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Mail,
  Clock,
  TrendingUp,
  ChevronRight,
  Edit2,
  Eye,
  Send,
} from 'lucide-react';
import ContentStore from '@/lib/contentStore';
import { mealsStore } from '@/lib/mealsStore';
import { cleaningStore } from '@/lib/cleaningStore';
import { appointmentsStore } from '@/lib/appointmentsStore';
import { remindersStore } from '@/lib/remindersStore';
import { todoStore } from '@/lib/todoStore';
import { shoppingStore } from '@/lib/shoppingStore';
import { tasksStore } from '@/lib/tasksStore';
import { notesStore } from '@/lib/notesStore';
import { decisionsStore } from '@/lib/decisionsStore';

interface UrgentItem {
  id: string;
  title: string;
  source: string;
  priority: 'low' | 'medium' | 'high';
  actionButton?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
}

export default function TodayCommandCenter() {
  const [dayProgress, setDayProgress] = useState(0);
  const [urgentItems, setUrgentItems] = useState<UrgentItem[]>([]);
  const [contentDueForReview, setContentDueForReview] = useState<any[]>([]);
  const [todayMeals, setTodayMeals] = useState<any[]>([]);
  const [todayCleaningTasks, setTodayCleaningTasks] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [unsentReminders, setUnsentReminders] = useState<any[]>([]);
  const [todayTodos, setTodayTodos] = useState<any[]>([]);
  const [shoppingItems, setShoppingItems] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Calculate day progress
  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);

      const elapsed = now.getTime() - start.getTime();
      const total = end.getTime() - start.getTime();
      const percent = Math.round((elapsed / total) * 100);

      setDayProgress(Math.min(percent, 100));
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Load all data
  useEffect(() => {
    const loadAllData = () => {
      // Content due for review
      const contentItems = ContentStore.getAll().filter(
        (item) => item.status === 'Due for Review' || item.status === 'Feedback Given'
      );
      setContentDueForReview(contentItems);

      // Meals for today
      const meals = mealsStore.getTodayMeals();
      setTodayMeals(meals);

      // Cleaning tasks for today
      const cleaning = cleaningStore.getTodayTasks();
      setTodayCleaningTasks(cleaning);

      // Appointments for today
      const appointments = appointmentsStore.getTodayAppointments();
      setTodayAppointments(appointments);

      // Unsent reminders
      const reminders = remindersStore.getUnsentReminders();
      setUnsentReminders(reminders);

      // To-do items for today
      const todos = todoStore.getTodayTodos();
      setTodayTodos(todos);

      // Shopping items (incomplete)
      const shopping = shoppingStore.getIncompleted();
      setShoppingItems(shopping);
    };

    loadAllData();

    // Subscribe to changes (1 second polling)
    const interval = setInterval(loadAllData, 1000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  // Build urgent items list
  useEffect(() => {
    const items: UrgentItem[] = [];

    // Content items
    contentDueForReview.forEach((item) => {
      items.push({
        id: item.id,
        title: `Review "${item.title}" script [Content]`,
        source: 'Content',
        priority: 'high',
        actionButton: {
          label: 'Review',
          icon: <Eye size={16} />,
          onClick: () => {
            // Would navigate to content tab and open modal
          },
        },
      });
    });

    // Cleaning tasks
    todayCleaningTasks
      .filter((t) => !t.completed)
      .forEach((task) => {
        items.push({
          id: task.id,
          title: `${task.title} [Cleaning]`,
          source: 'Cleaning',
          priority: task.priority === 'high' ? 'high' : 'medium',
          actionButton: {
            label: 'Done',
            icon: <CheckCircle2 size={16} />,
            onClick: () => {
              cleaningStore.toggleTask(task.id);
              setRefreshKey((k) => k + 1);
            },
          },
        });
      });

    // Appointments
    todayAppointments.forEach((apt) => {
      items.push({
        id: apt.id,
        title: `${apt.time} - ${apt.title} [Appointment]`,
        source: 'Appointments',
        priority: 'high',
      });
    });

    // Unsent reminders
    unsentReminders.forEach((reminder) => {
      items.push({
        id: reminder.id,
        title: `Send reminder: ${reminder.text} [Reminders]`,
        source: 'Reminders',
        priority: reminder.priority || 'medium',
        actionButton: {
          label: 'Send Now',
          icon: <Send size={16} />,
          onClick: () => {
            remindersStore.sendReminder(reminder.id);
            setRefreshKey((k) => k + 1);
          },
        },
      });
    });

    // High priority todos
    todayTodos
      .filter((t) => t.priority === 'high' && !t.completed)
      .forEach((todo) => {
        items.push({
          id: todo.id,
          title: `${todo.title} [To-Do]`,
          source: 'To-Dos',
          priority: 'high',
        });
      });

    setUrgentItems(items);
  }, [contentDueForReview, todayCleaningTasks, todayAppointments, unsentReminders, todayTodos]);

  const metrics = {
    contentDueForReview: contentDueForReview.length,
    appointmentsToday: todayAppointments.length,
    urgentTodos: todayTodos.filter((t) => t.priority === 'high' && !t.completed).length,
    unsentReminders: unsentReminders.length,
    cleaningRemaining: todayCleaningTasks.filter((t) => !t.completed).length,
    mealsToday: todayMeals.length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Sun className="text-yellow-500" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-jade-purple">Your Day at a Glance</h1>
          <p className="text-gray-600">Command center for what matters today</p>
        </div>
      </div>

      {/* Day Progress */}
      <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Day Progress</h2>
          <span className="text-3xl font-bold">{dayProgress}%</span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-300"
            style={{ width: `${dayProgress}%` }}
          />
        </div>
        <p className="text-sm mt-2">
          {Math.round((24 * dayProgress) / 100)} hours into your day
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-3xl font-bold text-blue-600">{metrics.contentDueForReview}</div>
          <p className="text-sm text-gray-600 mt-1">Content for Review</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-3xl font-bold text-purple-600">{metrics.appointmentsToday}</div>
          <p className="text-sm text-gray-600 mt-1">Appointments</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="text-3xl font-bold text-red-600">{metrics.urgentTodos}</div>
          <p className="text-sm text-gray-600 mt-1">Urgent To-Dos</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-3xl font-bold text-orange-600">{metrics.unsentReminders}</div>
          <p className="text-sm text-gray-600 mt-1">Reminders to Send</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-3xl font-bold text-green-600">{metrics.cleaningRemaining}</div>
          <p className="text-sm text-gray-600 mt-1">Cleaning Tasks</p>
        </div>
        <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
          <div className="text-3xl font-bold text-teal-600">{metrics.mealsToday}</div>
          <p className="text-sm text-gray-600 mt-1">Meals Today</p>
        </div>
      </div>

      {/* Urgent Items */}
      {urgentItems.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-jade-purple flex items-center space-x-2">
            <AlertCircle className="text-red-600" size={28} />
            <span>Urgent Today</span>
          </h2>
          <div className="space-y-3">
            {urgentItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-l-4 flex items-center justify-between ${
                  item.priority === 'high'
                    ? 'bg-red-50 border-red-500'
                    : item.priority === 'medium'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-gray-50 border-gray-500'
                }`}
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.source}</p>
                </div>
                {item.actionButton && (
                  <button
                    onClick={item.actionButton.onClick}
                    className="ml-4 flex items-center space-x-2 px-4 py-2 bg-jade-purple text-white rounded-lg hover:bg-jade-dark transition-colors"
                  >
                    {item.actionButton.icon}
                    <span className="text-sm font-medium">{item.actionButton.label}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content & Newsletter Section */}
      {contentDueForReview.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-jade-purple">Content & Newsletter</h2>
          <div className="space-y-3">
            {contentDueForReview.slice(0, 3).map((item) => (
              <div key={item.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      {item.type} • {item.status}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Eye size={16} />
                    <span>Review</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Household & Life Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-jade-purple">Household & Life</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Cleaning */}
          {todayCleaningTasks.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                <CheckCircle2 size={20} className="text-green-600" />
                <span>Cleaning</span>
              </h3>
              <ul className="space-y-2">
                {todayCleaningTasks.map((task) => (
                  <li key={task.id} className="text-sm flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {
                        cleaningStore.toggleTask(task.id);
                        setRefreshKey((k) => k + 1);
                      }}
                      className="rounded"
                    />
                    <span className={task.completed ? 'line-through text-gray-400' : ''}>
                      {task.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meals */}
          {todayMeals.length > 0 && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-gray-800 mb-2">🍽️ Meals</h3>
              <ul className="space-y-2 text-sm">
                {todayMeals.map((meal) => (
                  <li key={meal.id}>
                    <p className="font-medium capitalize">{meal.type}</p>
                    {meal.harveyMeal && <p className="text-xs text-gray-600">Harvey: {meal.harveyMeal}</p>}
                    {meal.familyMeal && <p className="text-xs text-gray-600">Family: {meal.familyMeal}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Appointments */}
          {todayAppointments.length > 0 && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                <Calendar size={20} className="text-purple-600" />
                <span>Appointments</span>
              </h3>
              <ul className="space-y-2 text-sm">
                {todayAppointments.map((apt) => (
                  <li key={apt.id}>
                    <p className="font-medium">{apt.time} - {apt.title}</p>
                    {apt.location && <p className="text-xs text-gray-600">{apt.location}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Shopping */}
          {shoppingItems.length > 0 && (
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <h3 className="font-semibold text-gray-800 mb-2">🛒 Shopping</h3>
              <ul className="space-y-2 text-sm">
                {shoppingItems.slice(0, 4).map((item) => (
                  <li key={item.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {
                        shoppingStore.toggleItem(item.id);
                        setRefreshKey((k) => k + 1);
                      }}
                      className="rounded"
                    />
                    <span className={item.completed ? 'line-through text-gray-400' : ''}>
                      {item.title}
                    </span>
                  </li>
                ))}
                {shoppingItems.length > 4 && (
                  <li className="text-xs text-gray-600 italic">+{shoppingItems.length - 4} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Reminders for John */}
      {unsentReminders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-jade-purple flex items-center space-x-2">
            <Clock size={28} />
            <span>Reminders to Send</span>
          </h2>
          <div className="space-y-3">
            {unsentReminders.map((reminder) => (
              <div key={reminder.id} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{reminder.text}</p>
                  {reminder.dueTime && <p className="text-sm text-gray-600">Due: {reminder.dueTime}</p>}
                </div>
                <button
                  onClick={() => {
                    remindersStore.sendReminder(reminder.id);
                    setRefreshKey((k) => k + 1);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Send Now</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* This Week's Outlook */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-jade-purple flex items-center space-x-2">
          <TrendingUp size={28} />
          <span>This Week's Outlook</span>
        </h2>
        <div className="bg-gradient-to-br from-jade-cream to-white rounded-lg p-6 border border-jade-light">
          <p className="text-gray-600">
            ✓ {contentDueForReview.length} content pieces to review
          </p>
          <p className="text-gray-600">
            ✓ {todayAppointments.length} appointments on your calendar
          </p>
          <p className="text-gray-600">
            ✓ {todayMeals.length} meals planned for today
          </p>
          <p className="text-gray-600 mt-4 text-sm italic">
            Stay focused on what matters. You've got this! 💪
          </p>
        </div>
      </div>
    </div>
  );
}
