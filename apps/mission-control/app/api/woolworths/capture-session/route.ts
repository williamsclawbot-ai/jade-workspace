/**
 * Woolworths Session Capture API
 * Opens browser, captures Woolworths session cookies for 1 hour reuse
 */

import { spawn } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

async function runWorkflowStep(step: string): Promise<{ success: boolean; message?: string; error?: string }> {
  return new Promise((resolve) => {
    const server = spawn('node', ['/Users/williams/.openclaw/workspace/Woolworths-mcp/dist/index.js']);
    let buffer = '';
    let messageId = 1;

    const rl = require('readline').createInterface({
      input: server.stdout,
      terminal: false,
    });

    const sendMessage = (method: string, params: object) => {
      messageId++;
      server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: messageId, method, params }) + '\n');
    };

    rl.on('line', (data: string) => {
      buffer += data;
      try {
        const msg = JSON.parse(buffer);
        buffer = '';

        if (step === 'init' && msg.result?.serverInfo) {
          // Initialize succeeded, open browser
          sendMessage('tools/call', { name: 'woolworths_open_browser', arguments: {} });
        } else if (step === 'open' && msg.result?.content?.[0]) {
          const content = JSON.parse(msg.result.content[0].text);
          if (content.success) {
            // Browser opened, wait then capture cookies
            setTimeout(() => {
              sendMessage('tools/call', { name: 'woolworths_get_cookies', arguments: {} });
            }, 30000);
          }
        } else if (step === 'capture' && msg.result?.content?.[0]) {
          const content = JSON.parse(msg.result.content[0].text);
          if (content.success) {
            // Cookies captured, close browser
            sendMessage('tools/call', { name: 'woolworths_close_browser', arguments: {} });
          }
        } else if (step === 'close' && msg.result?.content?.[0]) {
          const content = JSON.parse(msg.result.content[0].text);
          if (content.success) {
            rl.close();
            server.kill();
            resolve({ success: true, message: 'Session captured successfully' });
          }
        }
      } catch (e) {
        // JSON incomplete
      }
    });

    // Start the flow
    sendMessage('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'mission-control', version: '1.0.0' },
    });

    // Timeout after 70 seconds
    setTimeout(() => {
      rl.close();
      server.kill();
      resolve({ success: false, error: 'Session capture timeout' });
    }, 70000);
  });
}

export async function POST(request: NextRequest) {
  try {
    // Run the workflow to capture session
    const result = await runWorkflowStep('init');

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Session captured. You can now build your cart.',
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to capture session',
      });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
