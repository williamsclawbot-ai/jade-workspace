/**
 * Reminders Cron Job Handler
 * 
 * This function should be triggered at 9:00 AM daily.
 * It fetches all non-completed reminders and:
 * 1. Sends them to John via Discord/message
 * 2. Updates their status to "sent" with today's date
 */

interface Reminder {
  id: string;
  text: string;
  status: 'not-sent' | 'sent' | 'completed';
  sentDate: string | null;
  createdDate: string;
  priority: 'low' | 'normal' | 'high';
}

export async function sendRemindersToJohn() {
  try {
    // Retrieve reminders from your data source (API, database, localStorage via API, etc.)
    const reminders = await fetchReminders();
    
    // Filter: get all items where status !== "completed"
    const itemsToSend = reminders.filter(r => r.status !== 'completed');
    
    if (itemsToSend.length === 0) {
      console.log('✅ No reminders to send to John today');
      return { success: true, message: 'No reminders to send' };
    }

    // Format the message for John
    const message = formatRemindersMessage(itemsToSend);
    
    // Send to John (Discord, email, SMS, etc.)
    await sendMessageToJohn(message);
    
    // Update each reminder: status = "sent", sentDate = today
    const today = new Date().toISOString().split('T')[0];
    const updated = itemsToSend.map(reminder => ({
      ...reminder,
      status: 'sent' as const,
      sentDate: today,
    }));
    
    // Save the updated reminders
    await updateReminders(updated);
    
    console.log(`✅ Sent ${itemsToSend.length} reminders to John and updated their status`);
    return {
      success: true,
      count: itemsToSend.length,
      message: `Sent ${itemsToSend.length} reminders to John`,
    };
  } catch (error) {
    console.error('❌ Error sending reminders to John:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Format reminders into a nice message for John
 */
function formatRemindersMessage(reminders: Reminder[]): string {
  const high = reminders.filter(r => r.priority === 'high');
  const normal = reminders.filter(r => r.priority === 'normal');
  const low = reminders.filter(r => r.priority === 'low');

  let message = "🌅 **Good Morning John!**\n\nHere are your reminders for today:\n\n";

  if (high.length > 0) {
    message += "🔴 **HIGH PRIORITY:**\n";
    high.forEach(r => {
      message += `• ${r.text}\n`;
    });
    message += "\n";
  }

  if (normal.length > 0) {
    message += "📋 **Regular Tasks:**\n";
    normal.forEach(r => {
      message += `• ${r.text}\n`;
    });
    message += "\n";
  }

  if (low.length > 0) {
    message += "🔵 **When You Get a Chance:**\n";
    low.forEach(r => {
      message += `• ${r.text}\n`;
    });
  }

  return message;
}

/**
 * Send message to John
 * Implement this based on your preferred channel (Discord, email, SMS, etc.)
 */
async function sendMessageToJohn(message: string): Promise<void> {
  // TODO: Implement your messaging service
  // Example: Discord webhook, email via nodemailer, SMS via Twilio, etc.
  
  // For now, just log
  console.log('📤 Would send to John:', message);
  
  // Example Discord webhook:
  // await fetch(process.env.DISCORD_WEBHOOK_URL!, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ content: message }),
  // });
}

/**
 * Fetch reminders from your data source
 */
async function fetchReminders(): Promise<Reminder[]> {
  try {
    const response = await fetch('http://localhost:3000/api/reminders', {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    
    if (!data.success || !data.reminders) {
      return [];
    }

    return data.reminders.map((r: any) => ({
      id: r.id,
      text: r.text,
      status: 'not-sent' as const,
      sentDate: null,
      createdDate: new Date().toISOString(),
      priority: r.priority || 'normal',
    }));
  } catch (error) {
    console.error('Error fetching reminders from API:', error);
    return [];
  }
}

/**
 * Update reminders in your data source
 */
async function updateReminders(reminders: Reminder[]): Promise<void> {
  // TODO: Implement based on your backend
  // This could update:
  // - REST API endpoint
  // - Database
  // - File system
  // - IndexedDB (browser)
  
  // Example REST API call:
  // await fetch('/api/reminders', {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ reminders }),
  // });
}
