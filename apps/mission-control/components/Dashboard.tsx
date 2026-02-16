'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock, Plus } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'pending' | 'completed';
  progress: number;
}

interface Task {
  id: string;
  projectId: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'high' | 'medium' | 'low';
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Content Dashboard', description: 'Main content management system', status: 'active', progress: 75 },
    { id: '2', name: 'Meal Planning', description: 'Meal planning and nutrition tracking', status: 'active', progress: 60 },
    { id: '3', name: 'Daycare Guide', description: 'Comprehensive daycare management guide', status: 'active', progress: 45 },
    { id: '4', name: 'HLS Tasks', description: 'Task management for Hello Little Sleepers', status: 'active', progress: 80 },
    { id: '5', name: 'Kanban System', description: 'Team collaboration and planning', status: 'pending', progress: 20 },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', projectId: '1', title: 'Update dashboard UI', status: 'in-progress', priority: 'high' },
    { id: '2', projectId: '1', title: 'Add real-time sync', status: 'todo', priority: 'high' },
    { id: '3', projectId: '2', title: 'Create meal templates', status: 'done', priority: 'medium' },
    { id: '4', projectId: '3', title: 'Write daycare policies', status: 'in-progress', priority: 'high' },
    { id: '5', projectId: '4', title: 'Setup task categories', status: 'todo', priority: 'medium' },
  ]);

  const [ghlData, setGhlData] = useState({
    subscribers: 1250,
    revenue: 15840,
    deals: 12,
    pipeline: 45000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'medium':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-4 border-green-500 bg-green-50';
      default:
        return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* GHL Integration Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-jade-purple">
          <p className="text-gray-600 text-sm mb-2">Total Subscribers</p>
          <p className="text-3xl font-bold text-jade-purple">{ghlData.subscribers.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">+42 this month</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-jade-light">
          <p className="text-gray-600 text-sm mb-2">Monthly Revenue</p>
          <p className="text-3xl font-bold text-jade-light">${(ghlData.revenue / 1000).toFixed(1)}k</p>
          <p className="text-xs text-gray-500 mt-2">+$2,145 increase</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm mb-2">Active Deals</p>
          <p className="text-3xl font-bold text-green-600">{ghlData.deals}</p>
          <p className="text-xs text-gray-500 mt-2">3 closing this week</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm mb-2">Pipeline Value</p>
          <p className="text-3xl font-bold text-blue-600">${(ghlData.pipeline / 1000).toFixed(0)}k</p>
          <p className="text-xs text-gray-500 mt-2">27% conversion rate</p>
        </div>
      </section>

      {/* Projects Overview */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-jade-purple">Projects</h2>
          <button className="flex items-center space-x-2 bg-jade-purple text-jade-cream px-4 py-2 rounded-lg hover:bg-jade-light hover:text-jade-purple transition-colors">
            <Plus size={20} />
            <span>New Project</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-jade-purple">{project.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{project.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-jade-purple">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-jade-purple h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Tasks */}
      <section>
        <h2 className="text-2xl font-bold text-jade-purple mb-4">Recent Tasks</h2>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className={`p-4 rounded-lg ${getPriorityColor(task.priority)}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{task.title}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Project: {projects.find(p => p.id === task.projectId)?.name}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded">
                    {task.status.replace('-', ' ')}
                  </span>
                  {task.status === 'done' && <CheckCircle size={16} className="text-green-600" />}
                  {task.status === 'in-progress' && <Clock size={16} className="text-blue-600" />}
                  {task.status === 'todo' && <AlertCircle size={16} className="text-red-600" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
