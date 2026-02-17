'use client';

import { useState, useEffect } from 'react';
import { FileText, CheckSquare2, Home, AlertCircle, ChevronRight } from 'lucide-react';

interface ContentItem {
  id?: string;
  day: string;
  title: string;
  type: 'Reel' | 'Carousel' | 'Static';
  status: 'Ready to film' | 'Ready to schedule' | 'In progress' | 'Scheduled';
  reviewStatus?: 'needs-review' | 'approved' | 'changes-requested';
  reviewDueDate?: string;
  script?: string;
  onScreenText?: string;
  caption?: string;
}

interface Task {
  id: string;
  title: string;
  name?: string;
  status: 'backlog' | 'in-progress' | 'in-review' | 'done' | 'to-do';
  category: 'hls' | 'personal' | 'household';
  dueDate?: string;
  task?: string;
  completed?: boolean;
  priority?: string;
}

interface Appointment {
  id: string;
  person: 'jade' | 'harvey' | 'john';
  type: string;
  description: string;
  date: string;
  time?: string;
  location?: string;
}

interface Decision {
  id: string;
  title: string;
  question: string;
  status: 'open' | 'decided' | 'postponed';
  dueDate?: string;
  dateAdded?: string;
}

interface Reminder {
  id: string;
  text: string;
  status: 'not-sent' | 'sent';
  priority?: 'high' | 'medium' | 'low';
}

function isDateOverdue(dateString?: string): boolean {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
}

function isDateToday(dateString?: string): boolean {
  if (!dateString) return false;
  const dueDate = new Date(dateString);
  const today = new Date();
  return dueDate.toDateString() === today.toDateString();
}

function getThisWeekDate(): { start: Date; end: Date } {
  const today = new Date();
  const start = new Date(today);
  const end = new Date(today);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

function isDateThisWeek(dateString?: string): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const { start, end } = getThisWeekDate();
  return date >= start && date <= end;
}

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

export default function DashboardExpanded({ onNavigate }: DashboardProps) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [hlsTasks, setHlsTasks] = useState<Task[]>([]);
  const [personalTasks, setPersonalTasks] = useState<Task[]>([]);
  const [householdTasks, setHouseholdTasks] = useState<Task[]>([]);
  const [meals, setMeals] = useState<{ count: number; days: string[] }>({ count: 0, days: [] });
  const [cleaning, setCleaning] = useState<{ count: number; days: string[] }>({ count: 0, days: [] });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [awaitingReview, setAwaitingReview] = useState<ContentItem[]>([]);

  // Load all data
  useEffect(() => {
    loadAllData();
    window.addEventListener('storage', loadAllData);
    return () => window.removeEventListener('storage', loadAllData);
  }, []);

  const loadAllData = () => {
    // CONTENT: Items needing review
    const contentData = localStorage.getItem('jadeContentData');
    if (contentData) {
      try {
        const parsed = JSON.parse(contentData);
        if (parsed.weeklyContent && Array.isArray(parsed.weeklyContent)) {
          const needsReview = parsed.weeklyContent.filter((item: any) => 
            item.reviewStatus === 'needs-review'
          );
          setContent(needsReview);
          setAwaitingReview(needsReview);
        }
      } catch (e) {
        console.log('No content data');
      }
    }

    // HLS PIPELINE
    const hlsData = localStorage.getItem('jadeHLSPipelineData');
    if (hlsData) {
      try {
        const parsed = JSON.parse(hlsData);
        if (parsed.tasks) {
          const allHls = parsed.tasks.map((t: any) => ({
            id: t.id,
            title: t.title,
            status: t.status,
            category: 'hls' as const,
            dueDate: t.dueDate,
          }));
          setHlsTasks(allHls);
        }
      } catch (e) {
        console.log('No HLS data');
      }
    }

    // PERSONAL TASKS
    const personalTasksData = localStorage.getItem('personalTasks');
    if (personalTasksData) {
      try {
        const parsed = JSON.parse(personalTasksData);
        if (Array.isArray(parsed)) {
          const tasks = parsed.map((t: any) => ({
            id: t.id,
            title: t.name,
            status: t.status as Task['status'],
            category: 'personal' as const,
            dueDate: t.dueDate,
          }));
          setPersonalTasks(tasks);
        }
      } catch (e) {
        console.log('No personal tasks data');
      }
    }

    // HOUSEHOLD TODOS
    const householdData = localStorage.getItem('householdTodosData');
    if (householdData) {
      try {
        const parsed = JSON.parse(householdData);
        if (Array.isArray(parsed)) {
          const todos = parsed.map((t: any) => ({
            id: t.id,
            title: t.task,
            status: (t.completed ? 'done' : 'to-do') as Task['status'],
            category: 'household' as const,
            dueDate: t.dueDate,
          }));
          setHouseholdTasks(todos);
        }
      } catch (e) {
        console.log('No household todos data');
      }
    }

    // MEALS (Harvey's)
    const mealsData = localStorage.getItem('mealsData');
    if (mealsData) {
      try {
        const parsed = JSON.parse(mealsData);
        if (parsed.harveysAssignedMeals) {
          const days = Object.keys(parsed.harveysAssignedMeals);
          const mealsWithAssignments = days.filter((day) => {
            const dayMeals = parsed.harveysAssignedMeals[day];
            return (
              dayMeals.breakfast?.length > 0 ||
              dayMeals.lunch?.length > 0 ||
              dayMeals.snack?.length > 0 ||
              dayMeals.dinner?.length > 0
            );
          });
          setMeals({ count: mealsWithAssignments.length, days: mealsWithAssignments });
        }
      } catch (e) {
        console.log('No meals data');
      }
    }

    // CLEANING SCHEDULE
    const cleaningData = localStorage.getItem('cleaningScheduleAssignments');
    if (cleaningData) {
      try {
        const parsed = JSON.parse(cleaningData);
        if (Array.isArray(parsed)) {
          const cleaningDays = new Set<string>();
          parsed.forEach((assignment: any) => {
            if (assignment.day) cleaningDays.add(assignment.day);
          });
          setCleaning({ count: parsed.length, days: Array.from(cleaningDays) });
        }
      } catch (e) {
        console.log('No cleaning data');
      }
    }

    // APPOINTMENTS (This week)
    const appointmentsData = localStorage.getItem('appointmentsData');
    if (appointmentsData) {
      try {
        const parsed = JSON.parse(appointmentsData);
        if (Array.isArray(parsed)) {
          const { start, end } = getThisWeekDate();
          const thisWeekAppts = parsed.filter((appt: any) => {
            const apptDate = new Date(appt.date);
            return apptDate >= start && apptDate <= end;
          });
          setAppointments(thisWeekAppts);
        }
      } catch (e) {
        console.log('No appointments data');
      }
    }

    // DECISIONS (Open)
    const decisionsData = localStorage.getItem('decisionsData');
    if (decisionsData) {
      try {
        const parsed = JSON.parse(decisionsData);
        if (Array.isArray(parsed)) {
          const openDecisions = parsed.filter((d: any) => d.status === 'open');
          setDecisions(openDecisions);
        }
      } catch (e) {
        console.log('No decisions data');
      }
    }

    // REMINDERS FOR JOHN (Not sent)
    const remindersData = localStorage.getItem('remindersForJohnData');
    if (remindersData) {
      try {
        const parsed = JSON.parse(remindersData);
        if (Array.isArray(parsed)) {
          const unsent = parsed.filter((r: any) => r.status === 'not-sent');
          setReminders(unsent);
        }
      } catch (e) {
        console.log('No reminders data');
      }
    }
  };

  const countOverdueTasks = (tasks: Task[]): number => {
    return tasks.filter(t => t.dueDate && isDateOverdue(t.dueDate)).length;
  };

  const countDueToday = (tasks: Task[]): number => {
    return tasks.filter(t => t.dueDate && isDateToday(t.dueDate)).length;
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome back, Jade! 👋</h1>
        <p className="text-jade-cream opacity-90 text-lg">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-sm mt-4 opacity-80">
          {content.length > 0 && <span className="font-bold">{content.length} content posts</span>}
          {content.length > 0 && hlsTasks.length > 0 && ', '}
          {hlsTasks.length > 0 && <span className="font-bold">{hlsTasks.length} HLS tasks</span>}
          {(content.length > 0 || hlsTasks.length > 0) && personalTasks.length > 0 && ', '}
          {personalTasks.length > 0 && <span className="font-bold">{personalTasks.length} personal tasks</span>}
          {appointments.length > 0 && <span>{appointments.length > 0 ? ', ' : ''}<span className="font-bold">{appointments.length} appointments</span></span>}
        </p>
      </div>

      {/* 4-Column Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* COLUMN 1: 🎬 CONTENT */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-purple-500">
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-200">
            <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
              <FileText size={20} className="text-purple-600" />
              🎬 CONTENT
            </h2>
            <p className="text-sm text-purple-700 mt-1">
              <span className="font-bold">{content.length}</span> posts need review
            </p>
          </div>

          <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
            {content.length > 0 ? (
              content.map((item, idx) => {
                const isOverdue = isDateOverdue(item.reviewDueDate);
                const isDueToday = isDateToday(item.reviewDueDate);
                const borderClass = isOverdue
                  ? 'border-red-300 bg-red-50'
                  : isDueToday
                  ? 'border-orange-300 bg-orange-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50';

                return (
                  <div
                    key={idx}
                    className={`rounded-md p-3 border transition ${borderClass}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{item.day}</p>
                        <p className="text-xs text-gray-600 truncate font-medium">{item.title}</p>
                        {item.reviewDueDate && (
                          <p
                            className={`text-xs mt-1 ${
                              isOverdue
                                ? 'text-red-600 font-semibold'
                                : isDueToday
                                ? 'text-orange-600 font-semibold'
                                : 'text-gray-500'
                            }`}
                          >
                            {isOverdue && '🚨 OVERDUE: '}
                            {isDueToday && '⚠️ DUE TODAY: '}
                            Review{' '}
                            {new Date(item.reviewDueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                            {item.type}
                          </span>
                          <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 text-sm py-8">All content approved! ✅</p>
            )}
          </div>

          <div className="bg-gradient-to-t from-purple-50 to-transparent px-6 py-3 border-t border-purple-100">
            <button
              onClick={() => onNavigate?.('content')}
              className="w-full text-center text-sm font-semibold text-purple-600 hover:text-purple-800 flex items-center justify-center gap-1 py-2 hover:bg-purple-100 rounded transition"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* COLUMN 2: 📋 TASKS */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-blue-500">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <CheckSquare2 size={20} className="text-blue-600" />
              📋 TASKS
            </h2>
            <div className="text-xs text-blue-700 mt-1 space-y-1">
              <p>HLS: <span className="font-bold">{hlsTasks.length}</span> total</p>
              <p>Personal: <span className="font-bold">{personalTasks.length}</span> active</p>
              <p>Household: <span className="font-bold">{householdTasks.length}</span> due</p>
            </div>
          </div>

          <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
            {hlsTasks.length > 0 || personalTasks.length > 0 || householdTasks.length > 0 ? (
              <>
                {/* HLS Tasks */}
                {hlsTasks.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-blue-900 uppercase opacity-70 mt-3 first:mt-0">
                      🔄 HLS Pipeline
                    </p>
                    {hlsTasks.map((task) => {
                      const isOverdue = task.dueDate && isDateOverdue(task.dueDate);
                      const isDueToday = task.dueDate && isDateToday(task.dueDate);
                      return (
                        <div
                          key={task.id}
                          className={`rounded-md p-2 border text-xs hover:bg-blue-100 transition ${
                            isOverdue
                              ? 'border-red-300 bg-red-50'
                              : isDueToday
                              ? 'border-orange-300 bg-orange-50'
                              : 'border-blue-200 bg-blue-50'
                          }`}
                        >
                          <p className="text-blue-900 font-medium truncate">{task.title}</p>
                          {isOverdue && <p className="text-red-600 text-xs font-semibold">🚨 Overdue</p>}
                          {isDueToday && <p className="text-orange-600 text-xs font-semibold">⚠️ Due Today</p>}
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Personal Tasks */}
                {personalTasks.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-green-900 uppercase opacity-70 mt-3">
                      ✓ Personal Tasks
                    </p>
                    {personalTasks.map((task) => {
                      const isOverdue = task.dueDate && isDateOverdue(task.dueDate);
                      const isDueToday = task.dueDate && isDateToday(task.dueDate);
                      return (
                        <div
                          key={task.id}
                          className={`rounded-md p-2 border text-xs hover:bg-green-100 transition ${
                            isOverdue
                              ? 'border-red-300 bg-red-50'
                              : isDueToday
                              ? 'border-orange-300 bg-orange-50'
                              : 'border-green-200 bg-green-50'
                          }`}
                        >
                          <p className="text-green-900 font-medium truncate">{task.title}</p>
                          {isOverdue && <p className="text-red-600 text-xs font-semibold">🚨 Overdue</p>}
                          {isDueToday && <p className="text-orange-600 text-xs font-semibold">⚠️ Due Today</p>}
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Household Tasks */}
                {householdTasks.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-amber-900 uppercase opacity-70 mt-3">
                      🏠 Household To-Dos
                    </p>
                    {householdTasks.map((task) => {
                      const isOverdue = task.dueDate && isDateOverdue(task.dueDate);
                      const isDueToday = task.dueDate && isDateToday(task.dueDate);
                      return (
                        <div
                          key={task.id}
                          className={`rounded-md p-2 border text-xs hover:bg-amber-100 transition ${
                            isOverdue
                              ? 'border-red-300 bg-red-50'
                              : isDueToday
                              ? 'border-orange-300 bg-orange-50'
                              : 'border-amber-200 bg-amber-50'
                          }`}
                        >
                          <p className="text-amber-900 font-medium truncate">{task.title}</p>
                          {isOverdue && <p className="text-red-600 text-xs font-semibold">🚨 Overdue</p>}
                          {isDueToday && <p className="text-orange-600 text-xs font-semibold">⚠️ Due Today</p>}
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500 text-sm py-8">All caught up! 🎉</p>
            )}
          </div>

          <div className="bg-gradient-to-t from-blue-50 to-transparent px-6 py-3 border-t border-blue-100">
            <button
              onClick={() => onNavigate?.('hls-tasks')}
              className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 py-2 hover:bg-blue-100 rounded transition"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* COLUMN 3: 🏠 HOME */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-amber-500">
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
            <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
              <Home size={20} className="text-amber-600" />
              🏠 HOME
            </h2>
            <p className="text-sm text-amber-700 mt-1">This week's schedules</p>
          </div>

          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {meals.count > 0 || cleaning.count > 0 || appointments.length > 0 ? (
              <>
                {/* Meals */}
                {meals.count > 0 && (
                  <div className="bg-amber-50 rounded-md p-3 border border-amber-200 hover:border-amber-400 hover:bg-amber-100 transition">
                    <p className="font-semibold text-amber-900 text-sm">🍽️ Harvey's Meals</p>
                    <p className="text-xs text-amber-700 mt-1 font-bold">{meals.count} days planned</p>
                    <div className="text-xs text-amber-600 mt-1 flex flex-wrap gap-1">
                      {meals.days.map((day, idx) => (
                        <span key={idx} className="bg-amber-100 px-2 py-1 rounded">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cleaning */}
                {cleaning.count > 0 && (
                  <div className="bg-blue-50 rounded-md p-3 border border-blue-200 hover:border-blue-400 hover:bg-blue-100 transition">
                    <p className="font-semibold text-blue-900 text-sm">🧹 Cleaning Tasks</p>
                    <p className="text-xs text-blue-700 mt-1 font-bold">{cleaning.count} tasks scheduled</p>
                    <div className="text-xs text-blue-600 mt-1 flex flex-wrap gap-1">
                      {cleaning.days.slice(0, 5).map((day, idx) => (
                        <span key={idx} className="bg-blue-100 px-2 py-1 rounded">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Appointments */}
                {appointments.length > 0 && (
                  <div className="bg-purple-50 rounded-md p-3 border border-purple-200 hover:border-purple-400 hover:bg-purple-100 transition">
                    <p className="font-semibold text-purple-900 text-sm">📅 Appointments</p>
                    <p className="text-xs text-purple-700 mt-1 font-bold">{appointments.length} this week</p>
                    {appointments.slice(0, 3).map((appt, idx) => (
                      <p key={idx} className="text-xs text-purple-600 mt-1">
                        <span className="font-semibold">{appt.person.toUpperCase()}:</span> {appt.type}
                      </p>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500 text-sm py-8">Nothing scheduled yet</p>
            )}
          </div>

          <div className="bg-gradient-to-t from-amber-50 to-transparent px-6 py-3 border-t border-amber-100">
            <button
              onClick={() => onNavigate?.('calendar')}
              className="w-full text-center text-sm font-semibold text-amber-600 hover:text-amber-800 flex items-center justify-center gap-1 py-2 hover:bg-amber-100 rounded transition"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* COLUMN 4: 📝 AWAITING */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-red-500">
          <div className="bg-red-50 px-6 py-4 border-b border-red-200">
            <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
              <AlertCircle size={20} className="text-red-600" />
              📝 AWAITING
            </h2>
            <div className="text-xs text-red-700 mt-1 space-y-1">
              <p>Decisions: <span className="font-bold">{decisions.length}</span> open</p>
              <p>Reminders: <span className="font-bold">{reminders.length}</span> unsent</p>
              <p>Review: <span className="font-bold">{awaitingReview.length}</span> pending</p>
            </div>
          </div>

          <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
            {decisions.length > 0 || reminders.length > 0 || awaitingReview.length > 0 ? (
              <>
                {/* Decisions */}
                {decisions.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-red-900 uppercase opacity-70">⚖️ Decisions</p>
                    {decisions.map((decision) => (
                      <div
                        key={decision.id}
                        className="bg-red-50 rounded-md p-3 border border-red-200 hover:border-red-400 hover:bg-red-100 transition"
                      >
                        <p className="text-red-900 font-medium text-xs">{decision.title}</p>
                        <p className="text-red-700 text-xs mt-1">{decision.question}</p>
                      </div>
                    ))}
                  </>
                )}

                {/* Reminders for John */}
                {reminders.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-orange-900 uppercase opacity-70 mt-3">
                      🔔 Reminders for John
                    </p>
                    {reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className={`rounded-md p-2 border text-xs ${
                          reminder.priority === 'high'
                            ? 'border-red-300 bg-red-50'
                            : 'border-orange-200 bg-orange-50'
                        }`}
                      >
                        <p className="text-orange-900 font-medium">{reminder.text}</p>
                      </div>
                    ))}
                  </>
                )}

                {/* Awaiting Review */}
                {awaitingReview.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-purple-900 uppercase opacity-70 mt-3">
                      👁️ Awaiting Review
                    </p>
                    {awaitingReview.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-purple-50 rounded-md p-2 border border-purple-200 text-xs"
                      >
                        <p className="text-purple-900 font-medium truncate">{item.title}</p>
                        <p className="text-purple-700 text-xs">{item.day}</p>
                      </div>
                    ))}
                  </>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500 text-sm py-8">Nothing to await! 🎯</p>
            )}
          </div>

          <div className="bg-gradient-to-t from-red-50 to-transparent px-6 py-3 border-t border-red-100">
            <button
              onClick={() => onNavigate?.('decisions')}
              className="w-full text-center text-sm font-semibold text-red-600 hover:text-red-800 flex items-center justify-center gap-1 py-2 hover:bg-red-100 rounded transition"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
