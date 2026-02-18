/**
 * Appointments Store - Manages appointments and calendar events
 */

export interface Appointment {
  id: string;
  title: string;
  date: string; // ISO date string
  time: string; // HH:MM format
  duration?: number; // minutes
  location?: string;
  notes?: string;
  type?: 'personal' | 'medical' | 'business' | 'other';
  createdAt?: string;
}

const STORAGE_KEY = 'jade_appointments';

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    title: 'Doctor appointment',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    location: 'Medical Center',
    type: 'medical',
  },
  {
    id: '2',
    title: 'Dentist',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    duration: 30,
    type: 'medical',
  },
];

class AppointmentsStore {
  private appointments: Appointment[] = [];

  constructor() {
    this.load();
  }

  private load() {
    if (typeof window === 'undefined') {
      this.appointments = DEFAULT_APPOINTMENTS;
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    this.appointments = stored ? JSON.parse(stored) : DEFAULT_APPOINTMENTS;
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.appointments));
  }

  getAppointments(): Appointment[] {
    return this.appointments.sort((a, b) => a.date.localeCompare(b.date));
  }

  getTodayAppointments(): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter((a) => a.date === today);
  }

  getUpcomingAppointments(daysAhead: number = 7): Appointment[] {
    const today = new Date();
    const future = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    return this.appointments.filter(
      (a) => new Date(a.date) >= today && new Date(a.date) <= future
    );
  }

  addAppointment(appointment: Omit<Appointment, 'id'>): Appointment {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    this.appointments.push(newAppointment);
    this.save();
    return newAppointment;
  }

  updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
    const apt = this.appointments.find((a) => a.id === id);
    if (!apt) return null;
    Object.assign(apt, updates);
    this.save();
    return apt;
  }

  deleteAppointment(id: string): boolean {
    const index = this.appointments.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.appointments.splice(index, 1);
    this.save();
    return true;
  }

  getUrgentForToday(): Appointment[] {
    return this.getTodayAppointments();
  }
}

export const appointmentsStore = new AppointmentsStore();
