'use client';

import { useState, useEffect } from 'react';
import { FileText, CheckSquare2, Home, Clock, ChevronRight } from 'lucide-react';

interface DashboardProps {
  onNavigate?: (tab: string) => void;
}

interface ContentItem {
  day: string;
  title: string;
  type: 'Reel' | 'Carousel' | 'Static';
  status: 'Ready to film' | 'Ready to schedule' | 'In progress' | 'Scheduled';
}

interface Task {
  id: string;
  title: string;
  status: 'backlog' | 'in-progress' | 'in-review' | 'done';
  category: 'hls' | 'personal' | 'household';
}

interface Appointment {
  id: string;
  person: 'jade' | 'harvey' | 'john';
  type: string;
  description: string;
  date: string;
  time?: string;
}

interface Decision {
  id: string;
  title: string;
  question: string;
  status: 'open' | 'decided' | 'postponed';
}

export default function KanbanDashboard({ onNavigate }: DashboardProps) {
  const [contentThisWeek, setContentThisWeek] = useState<ContentItem[]>([]);
  const [tasks, setTasks] = useState<{ hlsTasks: Task[]; personalTasks: Task[]; householdTasks: Task[] }>({
    hlsTasks: [],
    personalTasks: [],
    householdTasks: [],
  });
  const [home, setHome] = useState<{
    meals: { count: number; days: string[] };
    cleaning: { count: number; days: string[] };
    appointments: Appointment[];
  }>({
    meals: { count: 0, days: [] },
    cleaning: { count: 0, days: [] },
    appointments: [],
  });
  const [awaiting, setAwaiting] = useState<Decision[]>([]);

  // Load all data from localStorage
  useEffect(() => {
    // Load Content (This Week)
    const contentData = localStorage.getItem('jadeContentData');
    if (contentData) {
      try {
        const parsed = JSON.parse(contentData);
        // Extract this week's content items
        if (parsed.weeklyContent && Array.isArray(parsed.weeklyContent)) {
          setContentThisWeek(parsed.weeklyContent.slice(0, 5)); // Show first 5
        }
      } catch (e) {
        console.log('No content data');
      }
    }

    // Load HLS Pipeline (In Progress)
    const hlsData = localStorage.getItem('jadeHLSPipelineData');
    if (hlsData) {
      try {
        const parsed = JSON.parse(hlsData);
        if (parsed.tasks) {
          const inProgress = parsed.tasks.filter((t: any) => t.status === 'in-progress');
          setTasks((prev) => ({
            ...prev,
            hlsTasks: inProgress.map((t: any) => ({
              id: t.id,
              title: t.title,
              status: t.status,
              category: 'hls',
            })),
          }));
        }
      } catch (e) {
        console.log('No HLS data');
      }
    }

    // Load Personal Tasks
    const personalTasksData = localStorage.getItem('personalTasksData');
    if (personalTasksData) {
      try {
        const parsed = JSON.parse(personalTasksData);
        if (parsed.tasks) {
          const toDoTasks = parsed.tasks.filter((t: any) => t.status === 'to-do');
          setTasks((prev) => ({
            ...prev,
            personalTasks: toDoTasks.map((t: any) => ({
              id: t.id,
              title: t.title,
              status: 'in-progress',
              category: 'personal',
            })),
          }));
        }
      } catch (e) {
        console.log('No personal tasks data');
      }
    }

    // Load Household Todos (This week)
    const householdData = localStorage.getItem('householdTodosData');
    if (householdData) {
      try {
        const parsed = JSON.parse(householdData);
        if (Array.isArray(parsed)) {
          const thisWeekTodos = parsed.filter((todo: any) => {
            if (!todo.dueDate) return false;
            const today = new Date();
            const dueDate = new Date(todo.dueDate);
            const endOfWeek = new Date(today);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            return dueDate <= endOfWeek && dueDate >= today;
          });
          setTasks((prev) => ({
            ...prev,
            householdTasks: thisWeekTodos.map((t: any) => ({
              id: t.id,
              title: t.task,
              status: t.completed ? 'done' : 'backlog',
              category: 'household',
            })),
          }));
        }
      } catch (e) {
        console.log('No household todos data');
      }
    }

    // Load Meal Planning (Harvey's meals this week)
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
          setHome((prev) => ({
            ...prev,
            meals: { count: mealsWithAssignments.length, days: mealsWithAssignments },
          }));
        }
      } catch (e) {
        console.log('No meals data');
      }
    }

    // Load Cleaning Schedule (This week)
    const cleaningData = localStorage.getItem('cleaningScheduleAssignments');
    if (cleaningData) {
      try {
        const parsed = JSON.parse(cleaningData);
        if (Array.isArray(parsed)) {
          const cleaningDays = new Set<string>();
          parsed.forEach((assignment: any) => {
            if (assignment.day) cleaningDays.add(assignment.day);
          });
          setHome((prev) => ({
            ...prev,
            cleaning: { count: parsed.length, days: Array.from(cleaningDays) },
          }));
        }
      } catch (e) {
        console.log('No cleaning data');
      }
    }

    // Load Appointments (This week)
    const appointmentsData = localStorage.getItem('appointmentsData');
    if (appointmentsData) {
      try {
        const parsed = JSON.parse(appointmentsData);
        if (Array.isArray(parsed)) {
          const today = new Date();
          const endOfWeek = new Date(today);
          endOfWeek.setDate(endOfWeek.getDate() + 6);
          const thisWeekAppts = parsed.filter((appt: any) => {
            const apptDate = new Date(appt.date);
            return apptDate >= today && apptDate <= endOfWeek;
          });
          setHome((prev) => ({
            ...prev,
            appointments: thisWeekAppts.slice(0, 5), // Show first 5
          }));
        }
      } catch (e) {
        console.log('No appointments data');
      }
    }

    // Load Decisions (Awaiting Review)
    const decisionsData = localStorage.getItem('decisionsData');
    if (decisionsData) {
      try {
        const parsed = JSON.parse(decisionsData);
        if (Array.isArray(parsed)) {
          const openDecisions = parsed.filter((d: any) => d.status === 'open');
          setAwaiting(openDecisions.slice(0, 5)); // Show first 5
        }
      } catch (e) {
        console.log('No decisions data');
      }
    }
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Ready to film':
        return 'bg-orange-100 text-orange-700';
      case 'Ready to schedule':
        return 'bg-blue-100 text-blue-700';
      case 'Scheduled':
        return 'bg-green-100 text-green-700';
      case 'Posted':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTaskCountByStatus = () => {
    const allTasks = [...tasks.hlsTasks, ...tasks.personalTasks, ...tasks.householdTasks];
    return {
      toDo: allTasks.filter((t) => t.status === 'backlog').length,
      inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
      done: allTasks.filter((t) => t.status === 'done').length,
    };
  };

  const taskCounts = getTaskCountByStatus();

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome back, Jade! 👋</h1>
        <p className="text-jade-cream opacity-90 text-lg">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <p className="text-sm mt-4 opacity-80">
          This week at a glance: <span className="font-bold">{contentThisWeek.length} content posts</span> planned,{' '}
          <span className="font-bold">{taskCounts.inProgress} tasks</span> in progress, and{' '}
          <span className="font-bold">{home.appointments.length} appointments</span> coming up.
        </p>
      </div>

      {/* 4-Column Kanban Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Column 1: CONTENT */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-200">
            <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
              <FileText size={20} className="text-purple-600" />
              🎬 CONTENT
            </h2>
            <p className="text-sm text-purple-700 mt-1">{contentThisWeek.length} posts this week</p>
          </div>
          <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
            {contentThisWeek.length > 0 ? (
              <>
                {contentThisWeek.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-md p-3 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{item.day}</p>
                        <p className="text-xs text-gray-600 truncate">{item.title}</p>
                        <div className="flex gap-1 mt-2 flex-wrap">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
                            {item.type}
                          </span>
                          <span className={`${getStatusBadgeColor(item.status)} px-2 py-1 rounded text-xs font-medium`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-center text-gray-500 text-sm py-8">No content scheduled this week</p>
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

        {/* Column 2: TASKS */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <CheckSquare2 size={20} className="text-blue-600" />
              📋 TASKS
            </h2>
            <div className="text-xs text-blue-700 mt-1 space-y-1">
              <p>HLS: {tasks.hlsTasks.length} in progress</p>
              <p>Personal: {tasks.personalTasks.length} to do</p>
              <p>Household: {tasks.householdTasks.length} due</p>
            </div>
          </div>
          <div className="p-6 space-y-2 max-h-96 overflow-y-auto">
            {[...tasks.hlsTasks, ...tasks.personalTasks, ...tasks.householdTasks].length > 0 ? (
              <>
                {tasks.hlsTasks.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-blue-900 uppercase opacity-70 mt-3 first:mt-0">HLS Tasks</p>
                    {tasks.hlsTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-blue-50 rounded-md p-2 border border-blue-200 hover:border-blue-400 text-xs hover:bg-blue-100 transition"
                      >
                        <p className="text-blue-900 font-medium truncate">{task.title}</p>
                      </div>
                    ))}
                  </>
                )}
                {tasks.personalTasks.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-green-900 uppercase opacity-70 mt-3">Personal Tasks</p>
                    {tasks.personalTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-green-50 rounded-md p-2 border border-green-200 hover:border-green-400 text-xs hover:bg-green-100 transition"
                      >
                        <p className="text-green-900 font-medium truncate">{task.title}</p>
                      </div>
                    ))}
                  </>
                )}
                {tasks.householdTasks.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-amber-900 uppercase opacity-70 mt-3">Household To-Dos</p>
                    {tasks.householdTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-amber-50 rounded-md p-2 border border-amber-200 hover:border-amber-400 text-xs hover:bg-amber-100 transition"
                      >
                        <p className="text-amber-900 font-medium truncate">{task.title}</p>
                      </div>
                    ))}
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

        {/* Column 3: HOME */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-amber-500 hover:shadow-lg transition-shadow">
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
            <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
              <Home size={20} className="text-amber-600" />
              🏠 HOME
            </h2>
            <p className="text-sm text-amber-700 mt-1">This week's schedules</p>
          </div>
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {home.meals.count > 0 || home.cleaning.count > 0 || home.appointments.length > 0 ? (
              <>
                {/* Meals */}
                {home.meals.count > 0 && (
                  <div className="bg-amber-50 rounded-md p-3 border border-amber-200 hover:border-amber-400 hover:bg-amber-100 transition">
                    <p className="font-semibold text-amber-900 text-sm">🍽️ Harvey's Meals</p>
                    <p className="text-xs text-amber-700 mt-1">{home.meals.count} days planned</p>
                    <p className="text-xs text-amber-600 mt-1">{home.meals.days.join(', ')}</p>
                  </div>
                )}

                {/* Cleaning */}
                {home.cleaning.count > 0 && (
                  <div className="bg-blue-50 rounded-md p-3 border border-blue-200 hover:border-blue-400 hover:bg-blue-100 transition">
                    <p className="font-semibold text-blue-900 text-sm">🧹 Cleaning Tasks</p>
                    <p className="text-xs text-blue-700 mt-1">{home.cleaning.count} tasks scheduled</p>
                    <p className="text-xs text-blue-600 mt-1">{home.cleaning.days.slice(0, 3).join(', ')}</p>
                  </div>
                )}

                {/* Appointments */}
                {home.appointments.length > 0 && (
                  <div className="bg-purple-50 rounded-md p-3 border border-purple-200 hover:border-purple-400 hover:bg-purple-100 transition">
                    <p className="font-semibold text-purple-900 text-sm">📅 Appointments</p>
                    <p className="text-xs text-purple-700 mt-1">{home.appointments.length} this week</p>
                    {home.appointments.slice(0, 2).map((appt, idx) => (
                      <p key={idx} className="text-xs text-purple-600 mt-1">
                        {appt.person.toUpperCase()}: {appt.type}
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

        {/* Column 4: AWAITING */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="bg-red-50 px-6 py-4 border-b border-red-200">
            <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
              <Clock size={20} className="text-red-600" />
              📝 AWAITING
            </h2>
            <p className="text-sm text-red-700 mt-1">Decisions pending ({awaiting.length})</p>
          </div>
          <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
            {awaiting.length > 0 ? (
              <>
                {awaiting.map((item) => (
                  <div
                    key={item.id}
                    className="bg-red-50 rounded-md p-3 border border-red-200 hover:border-red-400 hover:bg-red-100 transition"
                  >
                    <p className="font-semibold text-red-900 text-sm">{item.title}</p>
                    <p className="text-xs text-red-700 mt-1 line-clamp-2">{item.question}</p>
                    <span className="inline-block bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-medium mt-2">
                      Open
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-center text-gray-500 text-sm py-8">All clear! ✅</p>
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

      {/* Quick Navigation */}
      <div className="bg-gradient-to-r from-jade-purple/5 to-jade-light/10 rounded-lg p-6 border border-jade-purple/10">
        <h3 className="text-lg font-bold text-jade-purple mb-4">Quick Jump</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate?.('content')}
            className="bg-white rounded-lg shadow-sm p-3 text-center hover:shadow-md hover:scale-105 transition-all text-sm font-semibold text-gray-700 hover:text-purple-700"
          >
            📝 Content
          </button>
          <button
            onClick={() => onNavigate?.('hls-tasks')}
            className="bg-white rounded-lg shadow-sm p-3 text-center hover:shadow-md hover:scale-105 transition-all text-sm font-semibold text-gray-700 hover:text-blue-700"
          >
            ✓ Tasks
          </button>
          <button
            onClick={() => onNavigate?.('meal-planning')}
            className="bg-white rounded-lg shadow-sm p-3 text-center hover:shadow-md hover:scale-105 transition-all text-sm font-semibold text-gray-700 hover:text-amber-700"
          >
            🍽️ Meals
          </button>
          <button
            onClick={() => onNavigate?.('calendar')}
            className="bg-white rounded-lg shadow-sm p-3 text-center hover:shadow-md hover:scale-105 transition-all text-sm font-semibold text-gray-700 hover:text-cyan-700"
          >
            📅 Calendar
          </button>
          <button
            onClick={() => onNavigate?.('decisions')}
            className="bg-white rounded-lg shadow-sm p-3 text-center hover:shadow-md hover:scale-105 transition-all text-sm font-semibold text-gray-700 hover:text-red-700"
          >
            ⏸️ Decisions
          </button>
          <button
            onClick={() => onNavigate?.('inbox')}
            className="bg-white rounded-lg shadow-sm p-3 text-center hover:shadow-md hover:scale-105 transition-all text-sm font-semibold text-gray-700 hover:text-green-700"
          >
            ✨ Capture
          </button>
        </div>
      </div>
    </div>
  );
}
