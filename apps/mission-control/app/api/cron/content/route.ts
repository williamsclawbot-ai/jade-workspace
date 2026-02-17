/**
 * Cron API - Called by OpenClaw cron jobs
 * Handles weekly generation and feedback revision
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklyContent } from '@/lib/contentGenerator';
import { processAllFeedback } from '@/lib/contentRevision';
import { sendDiscordNotification } from '@/lib/discordNotify';
import ContentStore from '@/lib/contentStore';

export async function POST(request: NextRequest) {
  try {
    // Verify request is from OpenClaw (if you add auth)
    const body = await request.json();
    const { action } = body;

    if (action === 'generate-weekly') {
      // Friday 11pm: Generate 7 pieces + process awaiting script items
      const allContent = ContentStore.getAll();
      const awaitingScript = allContent.filter((item) => item.status === 'Awaiting Script');

      // Generate 7 pieces
      const weeklyPieces = await generateWeeklyContent();

      // Add awaiting script items to generation queue
      const allGenerated = [...weeklyPieces];

      // Store all generated pieces
      for (const piece of allGenerated) {
        ContentStore.create({
          ...piece,
          status: 'Due for Review',
        });
      }

      // Send Discord notification
      await sendDiscordNotification({
        type: 'batch',
        count: allGenerated.length,
        items: allGenerated.map((item) => ({
          title: item.title,
          day: item.day,
        })),
      });

      return NextResponse.json({
        success: true,
        generated: allGenerated.length,
      });
    } else if (action === 'process-feedback') {
      // Nightly: Process all feedback and revise content
      const allContent = ContentStore.getAll();
      const revised = await processAllFeedback(allContent);

      // Update all revised items
      for (const item of revised) {
        ContentStore.update(item.id, item);
      }

      return NextResponse.json({
        success: true,
        revised: revised.length,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json(
      { error: 'Cron failed', details: String(error) },
      { status: 500 }
    );
  }
}
