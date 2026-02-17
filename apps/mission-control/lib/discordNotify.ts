/**
 * Discord Notifications for Content Generation
 * Pings Jade when content is generated or updated
 */

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export interface NotificationPayload {
  type: 'generated' | 'revised' | 'batch';
  title?: string;
  count?: number;
  items?: Array<{ title: string; day: string }>;
  message?: string;
}

export async function sendDiscordNotification(payload: NotificationPayload): Promise<boolean> {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn('DISCORD_WEBHOOK_URL not configured');
    return false;
  }

  let embed: any = {
    color: 0x7c3aed, // purple
    timestamp: new Date().toISOString(),
  };

  if (payload.type === 'generated') {
    embed = {
      ...embed,
      title: '✨ New Content Generated',
      description: payload.title,
      color: 0x10b981, // green
      fields: [
        {
          name: 'Status',
          value: 'Ready for review in Content tab',
          inline: true,
        },
      ],
    };
  } else if (payload.type === 'revised') {
    embed = {
      ...embed,
      title: '🔄 Content Revised',
      description: `Updated based on your feedback: **${payload.title}**`,
      color: 0xf59e0b, // amber
      fields: [
        {
          name: 'Next Step',
          value: 'Review the changes in Content tab',
          inline: true,
        },
      ],
    };
  } else if (payload.type === 'batch') {
    embed = {
      ...embed,
      title: '📹 Weekly Content Generated',
      description: `✅ Generated ${payload.count} pieces for the week`,
      color: 0x06b6d4, // cyan
      fields: payload.items
        ? [
            {
              name: 'Pieces',
              value: payload.items.map((item) => `• ${item.title} (${item.day})`).join('\n'),
              inline: false,
            },
          ]
        : [
            {
              name: 'Status',
              value: 'All pieces ready for review',
              inline: true,
            },
          ],
    };
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Discord notification error:', error);
    return false;
  }
}
