/**
 * Woolworths Cart Builder API
 * Extracts ingredients from meal plans and auto-adds to Woolworths cart
 */

import { spawn } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface CartItem {
  name: string;
  price: number;
  stockcode: string;
}

interface WorkflowResult {
  success: boolean;
  items: CartItem[];
  total: number;
  error?: string;
}

async function runCartWorkflow(): Promise<WorkflowResult> {
  return new Promise((resolve) => {
    const server = spawn('node', ['/Users/williams/.openclaw/workspace/weekly-shopping-workflow.js']);
    let allOutput = '';
    let foundCart = false;

    server.stdout.on('data', (data) => {
      allOutput += data.toString();

      // Look for cart completion in output
      if (allOutput.includes('CART READY') && !foundCart) {
        foundCart = true;

        // Parse the output to extract items and total
        const items: CartItem[] = [];
        let total = 0;

        try {
          // Extract lines with item info (format: "N. Item Name" and "Qty: 1 × $Price")
          const lines = allOutput.split('\n');
          let currentItem = '';
          let currentPrice = 0;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Match item lines (e.g., "1. Item Name")
            const itemMatch = line.match(/^\d+\.\s+(.+)$/);
            if (itemMatch && !line.includes('×') && !line.includes('Qty:')) {
              currentItem = itemMatch[1];
            }

            // Match price lines (e.g., "Qty: 1 × $6.7")
            const priceMatch = line.match(/\$([0-9.]+)/);
            if (priceMatch && currentItem) {
              currentPrice = parseFloat(priceMatch[1]);
              items.push({
                name: currentItem,
                price: currentPrice,
                stockcode: '', // We don't extract stockcode here, just for UI
              });
              currentItem = '';
            }
          }

          // Extract total from "💰 Cart total: $XXX.XX"
          const totalMatch = allOutput.match(/💰 Cart total: \$([0-9.]+)/);
          if (totalMatch) {
            total = parseFloat(totalMatch[1]);
          }

          resolve({
            success: true,
            items,
            total,
          });
        } catch (e) {
          resolve({
            success: true, // Workflow succeeded even if parsing is partial
            items,
            total,
          });
        }
      }
    });

    server.stderr.on('data', (data) => {
      console.error('Workflow error:', data.toString());
    });

    server.on('close', (code) => {
      if (!foundCart) {
        // Try to extract any items from output anyway
        const items: CartItem[] = [];
        const totalMatch = allOutput.match(/💰 Cart total: \$([0-9.]+)/);
        const total = totalMatch ? parseFloat(totalMatch[1]) : 0;

        // If we got here but didn't find cart ready, check for items
        const itemMatches = allOutput.match(/✅ (.+?) \(\$([0-9.]+)\)/g) || [];
        itemMatches.forEach((match) => {
          const parsed = match.match(/✅ (.+?) \(\$([0-9.]+)\)/);
          if (parsed) {
            items.push({
              name: parsed[1],
              price: parseFloat(parsed[2]),
              stockcode: '',
            });
          }
        });

        if (code === 0) {
          resolve({
            success: true,
            items,
            total,
          });
        } else {
          resolve({
            success: false,
            items: [],
            total: 0,
            error: 'Workflow exited with error',
          });
        }
      }
    });

    // Timeout after 120 seconds
    setTimeout(() => {
      server.kill();
      resolve({
        success: false,
        items: [],
        total: 0,
        error: 'Cart building timeout (>120 seconds)',
      });
    }, 120000);
  });
}

export async function POST(request: NextRequest) {
  try {
    // Run the cart building workflow
    const result = await runCartWorkflow();

    if (result.success) {
      return NextResponse.json({
        success: true,
        items: result.items,
        total: result.total,
        message: `✅ Cart built! ${result.items.length} items added.`,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to build cart',
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
