'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit2, Clock } from 'lucide-react';
import NotesButton from './NotesButton';

interface Appointment {
  id: string;
  person: 'jade' | 'harvey' | 'john';
  type: string; // doctor, dental, school, etc.
  description: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    person: 'jade' | 'harvey' | 'john';
    type: string;
    description: string;
    date: string;
    time: string;
    location: string;
    notes: string;
  }>({
    person: 'jade',
    type: '',
    description: '',
    date: '',
    time: '',
    location: '',
    notes: '',
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('appointmentsData');
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch (e) {
        console.log('No saved appointments');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('appointmentsData', JSON.stringify(appointments));
  }, [appointments]);

  const handleAddAppointment = () => {
    if (!formData.type || !formData.description || !formData.date) {
      alert('Please fill in type, description, and date');
      return;
    }

    if (editingId) {
      setAppointments(
        appointments.map((a) =>
          a.id === editingId ? { ...a, ...formData } : a
        )
      );
      setEditingId(null);
    } else {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...formData,
      };
      setAppointments([...appointments, newAppointment]);
    }

    setFormData({
      person: 'jade',
      type: '',
      description: '',
      date: '',
      time: '',
      location: '',
      notes: '',
    });
    setShowForm(false);
  };

  const handleEdit = (appointment: Appointment) => {
    setFormData({
      person: appointment.person,
      type: appointment.type,
      description: appointment.description,
      date: appointment.date,
      time: appointment.time,
      location: appointment.location || '',
      notes: appointment.notes || '',
    });
    setEditingId(appointment.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this appointment?')) {
      setAppointments(appointments.filter((a) => a.id !== id));
    }
  };

  const personColor = {
    jade: 'bg-purple-50 border-purple-200',
    harvey: 'bg-blue-50 border-blue-200',
    john: 'bg-green-50 border-green-200',
  };

  const personBadgeColor = {
    jade: 'bg-purple-100 text-purple-700',
    harvey: 'bg-blue-100 text-blue-700',
    john: 'bg-green-100 text-green-700',
  };

  const personLabel = {
    jade: '👩 Jade',
    harvey: '👶 Harvey',
    john: '👨 John',
  };

  // Group appointments by person
  const appointmentsByPerson = {
    jade: appointments.filter((a) => a.person === 'jade'),
    harvey: appointments.filter((a) => a.person === 'harvey'),
    john: appointments.filter((a) => a.person === 'john'),
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar size={32} className="text-jade-purple" />
            <div>
              <h2 className="text-2xl font-bold text-jade-purple">Appointments</h2>
              <p className="text-sm text-gray-600">Doctor, dental, school, and other appointments</p>
            </div>
          </div>
          <div className="flex gap-2">
            <NotesButton section="Appointments" />
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  person: 'jade',
                  type: '',
                  description: '',
                  date: '',
                  time: '',
                  location: '',
                  notes: '',
                });
                setShowForm(!showForm);
              }}
              className="bg-jade-purple text-white px-4 py-2 rounded-lg hover:bg-jade-purple/80 transition flex items-center gap-2"
            >
              <Plus size={18} /> Add Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Form */}
        {showForm && (
          <div className="bg-jade-cream rounded-lg p-4 border border-jade-light">
            <h3 className="text-lg font-semibold text-jade-purple mb-4">
              {editingId ? 'Edit Appointment' : 'New Appointment'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={formData.person}
                onChange={(e) =>
                  setFormData({ ...formData, person: e.target.value as any })
                }
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
              >
                <option value="jade">👩 Jade</option>
                <option value="harvey">👶 Harvey</option>
                <option value="john">👨 John</option>
              </select>

              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="Type (doctor, dental, school, etc.)"
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
              />

              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description (e.g., Annual checkup)"
                className="col-span-1 md:col-span-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
              />

              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
              />

              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
              />

              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Location"
                className="col-span-1 md:col-span-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light"
              />

              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes (optional)"
                className="col-span-1 md:col-span-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-jade-light focus:ring-1 focus:ring-jade-light min-h-[80px]"
              />

              <div className="col-span-1 md:col-span-2 flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAppointment}
                  className="px-4 py-2 bg-jade-purple text-white rounded hover:bg-jade-purple/80 transition"
                >
                  {editingId ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointments by Person */}
        {Object.entries(appointmentsByPerson).map(([person, appts]) => (
          <div key={person}>
            <h3 className="text-lg font-semibold text-jade-purple mb-3">
              {personLabel[person as keyof typeof personLabel]}
            </h3>
            {appts.length === 0 ? (
              <div className="text-gray-500 text-sm py-4">No appointments</div>
            ) : (
              <div className="space-y-2">
                {appts.map((apt) => (
                  <div
                    key={apt.id}
                    className={`p-4 rounded-lg border ${personColor[apt.person]}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              personBadgeColor[apt.person]
                            }`}
                          >
                            {apt.type}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800">{apt.description}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(apt.date).toLocaleDateString()}
                          </div>
                          {apt.time && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              {apt.time}
                            </div>
                          )}
                        </div>
                        {apt.location && (
                          <p className="text-sm text-gray-600 mt-1">📍 {apt.location}</p>
                        )}
                        {apt.notes && (
                          <p className="text-sm text-gray-700 mt-2 italic">"{apt.notes}"</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(apt)}
                          className="p-2 text-gray-600 hover:bg-white/50 rounded transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(apt.id)}
                          className="p-2 text-red-600 hover:bg-white/50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
