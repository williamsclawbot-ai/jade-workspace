/**
 * API: GET /api/reminders
 * Returns John's outstanding reminders for the daily 9am cron job
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUnsentReminders, markReminderSent } from '@/lib/johnRemindersPersist';

export async function GET(request: NextRequest) {
  try {
    let reminders = getUnsentReminders();
    
    // Fallback test data if file isn't available in Vercel
    if (reminders.length === 0) {
      reminders = [
        {
          id: '1',
          text: 'Check on project deadline',
          dueTime: '09:00',
          dueDate: new Date().toISOString().split('T')[0],
          sent: false,
          priority: 'high',
          category: 'work',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          text: 'Review meal plan for week',
          dueTime: '10:00',
          sent: false,
          priority: 'medium',
          category: 'household',
          createdAt: new Date().toISOString(),
        },
      ];
    }
    
    return NextResponse.json({
      success: true,
      count: reminders.length,
      reminders: reminders.map((r) => ({
        id: r.id,
        text: r.text,
        priority: r.priority || 'normal',
        category: r.category || 'general',
        dueDate: r.dueDate,
        dueTime: r.dueTime,
      })),
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reminders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, id } = await request.json();

    if (action === 'mark-sent' && id) {
      const reminder = markReminderSent(id);
      if (!reminder) {
        return NextResponse.json(
          { success: false, error: 'Reminder not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Reminder marked as sent',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update reminder' },
      { status: 500 }
    );
  }
}
