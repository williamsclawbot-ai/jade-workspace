'use client';

import { useState, useEffect } from 'react';
import { Sun, ChevronDown, ChevronUp, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface TodayTask {
  id: string;
  title: string;
  status: 'done' | 'in-progress' | 'pending';
  category: string;
  dueTime?: string;
  description?: string;
  completed?: boolean;
}

interface TodayContent {
  id: string;
  title: string;
  type: string;
  script?: string;
  onScreenText?: string;
  caption?: string;
  status: string;
}

interface MealAssignment {
  day: string;
  breakfast?: string[];
  lunch?: string[];
  snack?: string[];
  dinner?: string[];
}

interface NewsletterTopic {
  id: string;
  topic: string;
  description: string;
  relevance: string;
}

export default function TodayExpanded() {
  const [todaysContent, setTodaysContent] = useState<TodayContent[]>([]);
  const [todaysTasks, setTodaysTasks] = useState<TodayTask[]>([]);
  const [harveysDay, setHarveysDay] = useState<{
    meals: MealAssignment[];
    appointments: any[];
  }>({ meals: [], appointments: [] });
  const [awaitingAttention, setAwaitingAttention] = useState<any[]>([]);
  const [isToday, setIsToday] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState('');

  // Newsletter topic selection state
  const [showTopicSelection, setShowTopicSelection] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topicIdeas] = useState<NewsletterTopic[]>([
    {
      id: 'topic1',
      topic: 'Content Creation Shortcuts',
      description: 'Quick tips for creating engaging content without burnout',
      relevance: 'High - trending topic this month',
    },
    {
      id: 'topic2',
      topic: 'Building Your Creator Community',
      description: 'How to nurture loyal followers and turn them into advocates',
      relevance: 'High - audience engagement focus',
    },
    {
      id: 'topic3',
      topic: 'Monetization Strategies for Creators',
      description: 'Different revenue streams beyond brand deals',
      relevance: 'Medium - timely for business growth',
    },
    {
      id: 'topic4',
      topic: 'Mental Health & Creator Burnout',
      description: 'Sustainable practices for long-term success',
      relevance: 'Medium - seasonal relevance',
    },
  ]);

  const [collapsedSections, setCollapsedSections] = useState({
    content: false,
    tasks: false,
    harvey: false,
    awaiting: false,
  });

  useEffect(() => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const isIsoTuesday = today.getDay() === 2;

    setDayOfWeek(dayOfWeek);
    setIsToday(true);
    setShowTopicSelection(isIsoTuesday);

    loadTodaysData(todayString, dayOfWeek);
    
    // Check if a topic was already selected this week
    const selectedTopicKey = `newsletter-topic-${getWeekStart()}`;
    const stored = localStorage.getItem(selectedTopicKey);
    if (stored) {
      setSelectedTopic(stored);
    }
  }, []);

  const getWeekStart = (): string => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    return monday.toISOString().split('T')[0];
  };

  const loadTodaysData = (todayString: string, dayOfWeek: string) => {
    // SECTION 1: TODAY'S CONTENT
    const contentData = localStorage.getItem('jadeContentData');
    if (contentData) {
      try {
        const parsed = JSON.parse(contentData);
        if (parsed.weeklyContent && Array.isArray(parsed.weeklyContent)) {
          const todayContent = parsed.weeklyContent.filter((item: any) => 
            item.day && item.day.toLowerCase() === dayOfWeek.toLowerCase()
          );
          setTodaysContent(
            todayContent.map((item: any) => ({
              id: item.id || `content-${item.day}`,
              title: item.title,
              type: item.type,
              script: item.script,
              onScreenText: item.onScreenText,
              caption: item.caption,
              status: item.status,
            }))
          );
        }
      } catch (e) {
        console.log('No content data');
      }
    }

    // SECTION 2: MY TASKS FOR TODAY
    const allTasks: TodayTask[] = [];

    // Personal Tasks due today
    const personalTasksData = localStorage.getItem('personalTasks');
    if (personalTasksData) {
      try {
        const parsed = JSON.parse(personalTasksData);
        if (Array.isArray(parsed)) {
          const todayPersonal = parsed.filter((t: any) => t.dueDate === todayString);
          todayPersonal.forEach((t: any) => {
            allTasks.push({
              id: t.id,
              title: t.name,
              status: t.status === 'done' ? 'done' : 'pending',
              category: 'Personal',
              description: t.description,
            });
          });
        }
      } catch (e) {
        console.log('No personal tasks');
      }
    }

    // HLS Tasks due today
    const hlsData = localStorage.getItem('jadeHLSPipelineData');
    if (hlsData) {
      try {
        const parsed = JSON.parse(hlsData);
        if (parsed.tasks && Array.isArray(parsed.tasks)) {
          const todayHls = parsed.tasks.filter((t: any) => t.dueDate === todayString);
          todayHls.forEach((t: any) => {
            allTasks.push({
              id: t.id,
              title: t.title,
              status: t.status === 'done' ? 'done' : 'in-progress',
              category: 'HLS Pipeline',
            });
          });
        }
      } catch (e) {
        console.log('No HLS tasks');
      }
    }

    // Household todos due today
    const householdData = localStorage.getItem('householdTodosData');
    if (householdData) {
      try {
        const parsed = JSON.parse(householdData);
        if (Array.isArray(parsed)) {
          const todayHousehold = parsed.filter((t: any) => t.dueDate === todayString);
          todayHousehold.forEach((t: any) => {
            allTasks.push({
              id: t.id,
              title: t.task,
              status: t.completed ? 'done' : 'pending',
              category: 'Household',
              description: t.description,
            });
          });
        }
      } catch (e) {
        console.log('No household todos');
      }
    }

    // Cleaning tasks for today
    const cleaningData = localStorage.getItem('cleaningScheduleAssignments');
    if (cleaningData) {
      try {
        const parsed = JSON.parse(cleaningData);
        const taskLibrary: any = {
          tidy: 'Tidy living areas',
          bathrooms: 'Clean bathrooms',
          kitchen: 'Kitchen deep clean',
          mop: 'Mop floors',
          vacuum: 'Vacuum carpets',
          laundry: 'Wash & fold laundry',
          sheets: 'Change bed sheets',
          dust: 'Dust surfaces',
          trash: 'Take out trash/recycling',
          windows: 'Clean windows',
          mirrors: 'Clean mirrors & glass',
          toilets: 'Clean toilets',
          appliances: 'Wipe down appliances',
          organize: 'Organize closets/storage',
          baseboards: 'Wipe baseboards',
        };
        if (Array.isArray(parsed)) {
          const todayCleaning = parsed.filter((a: any) => a.day === dayOfWeek);
          todayCleaning.forEach((t: any, idx: number) => {
            allTasks.push({
              id: `cleaning-${idx}`,
              title: taskLibrary[t.taskId] || t.taskId,
              status: 'pending',
              category: 'Cleaning',
            });
          });
        }
      } catch (e) {
        console.log('No cleaning schedule');
      }
    }

    setTodaysTasks(allTasks);

    // SECTION 3: HARVEY'S DAY
    const mealsData = localStorage.getItem('mealsData');
    if (mealsData) {
      try {
        const parsed = JSON.parse(mealsData);
        if (parsed.harveysAssignedMeals && parsed.harveysAssignedMeals[dayOfWeek]) {
          setHarveysDay((prev) => ({
            ...prev,
            meals: [parsed.harveysAssignedMeals[dayOfWeek]],
          }));
        }
      } catch (e) {
        console.log('No meals data');
      }
    }

    const appointmentsData = localStorage.getItem('appointmentsData');
    if (appointmentsData) {
      try {
        const parsed = JSON.parse(appointmentsData);
        if (Array.isArray(parsed)) {
          const todayAppts = parsed.filter((a: any) => 
            a.date === todayString && a.person === 'harvey'
          );
          setHarveysDay((prev) => ({
            ...prev,
            appointments: todayAppts,
          }));
        }
      } catch (e) {
        console.log('No appointments');
      }
    }

    // SECTION 4: AWAITING MY ATTENTION
    const attention: any[] = [];

    // Open decisions
    const decisionsData = localStorage.getItem('decisionsData');
    if (decisionsData) {
      try {
        const parsed = JSON.parse(decisionsData);
        if (Array.isArray(parsed)) {
          const openDecisions = parsed.filter((d: any) => d.status === 'open');
          openDecisions.forEach((d: any) => {
            attention.push({
              id: d.id,
              type: 'decision',
              title: d.title,
              urgency: 'medium',
              icon: '⚖️',
            });
          });
        }
      } catch (e) {
        console.log('No decisions');
      }
    }

    // Reminders for John not sent
    const remindersData = localStorage.getItem('remindersForJohnData');
    if (remindersData) {
      try {
        const parsed = JSON.parse(remindersData);
        if (Array.isArray(parsed)) {
          const unsent = parsed.filter((r: any) => r.status === 'not-sent');
          unsent.forEach((r: any) => {
            attention.push({
              id: r.id,
              type: 'reminder',
              title: r.text,
              urgency: r.priority === 'high' ? 'urgent' : 'medium',
              icon: '🔔',
            });
          });
        }
      } catch (e) {
        console.log('No reminders');
      }
    }

    // Content awaiting review
    if (contentData) {
      try {
        const parsed = JSON.parse(contentData);
        if (parsed.weeklyContent && Array.isArray(parsed.weeklyContent)) {
          const awaitingReview = parsed.weeklyContent.filter((item: any) =>
            item.reviewStatus === 'needs-review' && item.day && 
            item.day.toLowerCase() === dayOfWeek.toLowerCase()
          );
          awaitingReview.forEach((item: any) => {
            attention.push({
              id: item.id || `review-${item.day}`,
              type: 'review',
              title: `Review: ${item.title}`,
              urgency: 'medium',
              icon: '👁️',
            });
          });
        }
      } catch (e) {
        console.log('No content review items');
      }
    }

    setAwaitingAttention(attention);
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleTopicSelection = (topicId: string) => {
    setSelectedTopic(topicId);
    const weekStart = getWeekStart();
    localStorage.setItem(`newsletter-topic-${weekStart}`, topicId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-50 border-green-200';
      case 'in-progress':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="space-y-8 pb-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-jade-purple to-jade-light rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sun size={36} />
          <h1 className="text-4xl font-bold">Today's Dashboard</h1>
        </div>
        <p className="text-jade-cream opacity-90 text-lg">{dayOfWeek}</p>
        <p className="text-sm mt-4 opacity-80">
          {todaysContent.length > 0 && <span className="font-bold">{todaysContent.length} content items</span>}
          {todaysContent.length > 0 && todaysTasks.length > 0 && ', '}
          {todaysTasks.length > 0 && <span className="font-bold">{todaysTasks.length} tasks</span>}
          {(todaysContent.length > 0 || todaysTasks.length > 0) && harveysDay.appointments.length > 0 && ', '}
          {harveysDay.appointments.length > 0 && <span className="font-bold">{harveysDay.appointments.length} appointments</span>}
        </p>
      </div>

      {/* TUESDAY SPECIAL: Newsletter Topic Selection */}
      {showTopicSelection && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-lg p-8 border-2 border-indigo-200">
          <h2 className="text-2xl font-bold text-indigo-900 mb-2 flex items-center gap-2">
            📚 Pick This Week's Newsletter Topic
          </h2>
          <p className="text-indigo-700 mb-6">
            It's Tuesday! Select your topic for this week's newsletter now.
          </p>

          {selectedTopic ? (
            <div className="bg-white rounded-lg p-6 border-2 border-indigo-500">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={24} className="text-green-600" />
                <h3 className="text-xl font-bold text-indigo-900">Topic Selected ✓</h3>
              </div>
              <p className="text-indigo-700">
                {topicIdeas.find((t) => t.id === selectedTopic)?.topic}
              </p>
              <button
                onClick={() => {
                  const weekStart = getWeekStart();
                  localStorage.removeItem(`newsletter-topic-${weekStart}`);
                  setSelectedTopic(null);
                }}
                className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                Change topic
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topicIdeas.map((idea) => (
                <button
                  key={idea.id}
                  onClick={() => handleTopicSelection(idea.id)}
                  className="bg-white rounded-lg p-4 border-2 border-indigo-200 hover:border-indigo-500 hover:shadow-lg transition text-left"
                >
                  <h3 className="font-bold text-indigo-900 mb-1">{idea.topic}</h3>
                  <p className="text-sm text-gray-600 mb-2">{idea.description}</p>
                  <p className="text-xs text-indigo-600 font-semibold">{idea.relevance}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 1: TODAY'S CONTENT */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-purple-500">
        <button
          onClick={() => toggleSection('content')}
          className="w-full bg-purple-50 px-6 py-4 border-b border-purple-200 flex items-center justify-between hover:bg-purple-100 transition"
        >
          <h2 className="text-lg font-bold text-purple-900 flex items-center gap-2">
            🎬 TODAY'S CONTENT
            {todaysContent.length > 0 && (
              <span className="text-sm font-semibold bg-purple-200 text-purple-900 px-2 py-1 rounded">
                {todaysContent.length}
              </span>
            )}
          </h2>
          {collapsedSections.content ? (
            <ChevronUp size={20} className="text-purple-600" />
          ) : (
            <ChevronDown size={20} className="text-purple-600" />
          )}
        </button>

        {!collapsedSections.content && (
          <div className="p-6 space-y-4">
            {todaysContent.length > 0 ? (
              todaysContent.map((item) => (
                <div
                  key={item.id}
                  className="bg-purple-50 rounded-lg p-4 border border-purple-200 hover:border-purple-400 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-bold text-purple-900">{item.title}</h3>
                    <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {item.type}
                    </span>
                  </div>

                  {item.script && (
                    <div className="bg-white rounded p-3 mb-3 border border-purple-200">
                      <p className="text-xs font-semibold text-gray-700 uppercase mb-1">Script:</p>
                      <p className="text-sm text-gray-800">{item.script}</p>
                    </div>
                  )}

                  {item.onScreenText && (
                    <div className="bg-white rounded p-3 mb-3 border border-purple-200">
                      <p className="text-xs font-semibold text-gray-700 uppercase mb-1">On-Screen Text:</p>
                      <p className="text-sm text-gray-800">{item.onScreenText}</p>
                    </div>
                  )}

                  {item.caption && (
                    <div className="bg-white rounded p-3 mb-3 border border-purple-200">
                      <p className="text-xs font-semibold text-gray-700 uppercase mb-1">Caption:</p>
                      <p className="text-sm text-gray-800">{item.caption}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <span className="bg-purple-100 text-purple-900 px-3 py-1 rounded text-xs font-semibold">
                      {item.status}
                    </span>
                    <button className="bg-purple-600 text-white px-4 py-1 rounded text-xs font-semibold hover:bg-purple-700 transition">
                      Review Content
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No content scheduled for today ✓</p>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: MY TASKS FOR TODAY */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-blue-500">
        <button
          onClick={() => toggleSection('tasks')}
          className="w-full bg-blue-50 px-6 py-4 border-b border-blue-200 flex items-center justify-between hover:bg-blue-100 transition"
        >
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            ✓ MY TASKS FOR TODAY
            {todaysTasks.length > 0 && (
              <span className="text-sm font-semibold bg-blue-200 text-blue-900 px-2 py-1 rounded">
                {todaysTasks.filter((t) => t.status !== 'done').length}/{todaysTasks.length}
              </span>
            )}
          </h2>
          {collapsedSections.tasks ? (
            <ChevronUp size={20} className="text-blue-600" />
          ) : (
            <ChevronDown size={20} className="text-blue-600" />
          )}
        </button>

        {!collapsedSections.tasks && (
          <div className="p-6 space-y-3">
            {todaysTasks.length > 0 ? (
              todaysTasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-lg p-4 border-2 flex items-start gap-3 hover:shadow-md transition ${getStatusColor(
                    task.status
                  )}`}
                >
                  <input
                    type="checkbox"
                    checked={task.status === 'done'}
                    className="mt-1 w-5 h-5 cursor-pointer"
                    readOnly
                  />
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${
                        task.status === 'done'
                          ? 'line-through text-gray-500'
                          : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">{task.category}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No tasks for today - Enjoy! 🎉</p>
            )}
          </div>
        )}
      </div>

      {/* SECTION 3: HARVEY'S DAY */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-amber-500">
        <button
          onClick={() => toggleSection('harvey')}
          className="w-full bg-amber-50 px-6 py-4 border-b border-amber-200 flex items-center justify-between hover:bg-amber-100 transition"
        >
          <h2 className="text-lg font-bold text-amber-900 flex items-center gap-2">
            🍽️ HARVEY'S DAY
            {(harveysDay.meals.length > 0 || harveysDay.appointments.length > 0) && (
              <span className="text-sm font-semibold bg-amber-200 text-amber-900 px-2 py-1 rounded">
                {harveysDay.meals.length + harveysDay.appointments.length}
              </span>
            )}
          </h2>
          {collapsedSections.harvey ? (
            <ChevronUp size={20} className="text-amber-600" />
          ) : (
            <ChevronDown size={20} className="text-amber-600" />
          )}
        </button>

        {!collapsedSections.harvey && (
          <div className="p-6 space-y-4">
            {/* Meals */}
            {harveysDay.meals.length > 0 && (
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <p className="font-bold text-amber-900 mb-3">🍽️ Meals</p>
                {harveysDay.meals.map((meal, idx) => (
                  <div key={idx} className="space-y-2">
                    {meal.breakfast && meal.breakfast.length > 0 && (
                      <div className="bg-white rounded p-2 border border-amber-100">
                        <p className="text-xs font-semibold text-gray-700">Breakfast:</p>
                        <p className="text-sm text-gray-800">{meal.breakfast.join(', ')}</p>
                      </div>
                    )}
                    {meal.lunch && meal.lunch.length > 0 && (
                      <div className="bg-white rounded p-2 border border-amber-100">
                        <p className="text-xs font-semibold text-gray-700">Lunch:</p>
                        <p className="text-sm text-gray-800">{meal.lunch.join(', ')}</p>
                      </div>
                    )}
                    {meal.snack && meal.snack.length > 0 && (
                      <div className="bg-white rounded p-2 border border-amber-100">
                        <p className="text-xs font-semibold text-gray-700">Snack:</p>
                        <p className="text-sm text-gray-800">{meal.snack.join(', ')}</p>
                      </div>
                    )}
                    {meal.dinner && meal.dinner.length > 0 && (
                      <div className="bg-white rounded p-2 border border-amber-100">
                        <p className="text-xs font-semibold text-gray-700">Dinner:</p>
                        <p className="text-sm text-gray-800">{meal.dinner.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Appointments */}
            {harveysDay.appointments.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="font-bold text-blue-900 mb-3">📅 Appointments</p>
                {harveysDay.appointments.map((appt, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded p-3 border border-blue-100 mb-2 last:mb-0"
                  >
                    <p className="font-semibold text-blue-900">{appt.type}</p>
                    {appt.time && <p className="text-sm text-gray-600">⏰ {appt.time}</p>}
                    {appt.location && <p className="text-sm text-gray-600">📍 {appt.location}</p>}
                  </div>
                ))}
              </div>
            )}

            {harveysDay.meals.length === 0 && harveysDay.appointments.length === 0 && (
              <p className="text-center text-gray-500 py-8">No meals or appointments scheduled ✓</p>
            )}
          </div>
        )}
      </div>

      {/* SECTION 4: AWAITING MY ATTENTION */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border-t-4 border-red-500">
        <button
          onClick={() => toggleSection('awaiting')}
          className="w-full bg-red-50 px-6 py-4 border-b border-red-200 flex items-center justify-between hover:bg-red-100 transition"
        >
          <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
            ⚠️ AWAITING MY ATTENTION
            {awaitingAttention.length > 0 && (
              <span className="text-sm font-semibold bg-red-200 text-red-900 px-2 py-1 rounded">
                {awaitingAttention.length}
              </span>
            )}
          </h2>
          {collapsedSections.awaiting ? (
            <ChevronUp size={20} className="text-red-600" />
          ) : (
            <ChevronDown size={20} className="text-red-600" />
          )}
        </button>

        {!collapsedSections.awaiting && (
          <div className="p-6 space-y-3">
            {awaitingAttention.length > 0 ? (
              awaitingAttention.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg p-4 border-2 hover:shadow-md transition ${getUrgencyColor(
                    item.urgency
                  )}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-600 mt-1 uppercase font-semibold">{item.type}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Nothing awaiting your attention 🎯</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
