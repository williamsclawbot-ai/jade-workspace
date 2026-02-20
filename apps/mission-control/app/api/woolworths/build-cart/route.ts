import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

// Store active workflow sessions
const activeWorkflows = new Map<string, {
  process: ReturnType<typeof spawn>;
  status: string;
  logs: string[];
  ingredients: string[];
  cartItems: any[];
  cartTotal: number;
}>();

export async function POST(request: NextRequest) {
  const sessionId = crypto.randomUUID();
  
  try {
    // Start the workflow process
    const workflowProcess = spawn('node', ['/Users/williams/.openclaw/workspace/weekly-shopping-workflow.js']);
    
    const workflow = {
      process: workflowProcess,
      status: 'starting',
      logs: ['🚀 Starting Woolworths cart builder...'],
      ingredients: [],
      cartItems: [],
      cartTotal: 0,
    };
    
    activeWorkflows.set(sessionId, workflow);
    
    // Capture stdout
    workflowProcess.stdout.on('data', (data) => {
      const output = data.toString();
      workflow.logs.push(output);
      
      // Parse status from output
      if (output.includes('Browser opened')) {
        workflow.status = 'waiting_for_login';
      } else if (output.includes('Session captured')) {
        workflow.status = 'searching';
      } else if (output.includes('ADDING TO CART')) {
        workflow.status = 'adding_to_cart';
      } else if (output.includes('CART READY')) {
        workflow.status = 'complete';
      }
      
      // Extract ingredients
      const ingredientMatch = output.match(/Ingredients identified: (\d+)/);
      if (ingredientMatch) {
        // We'd need to parse the ingredient list from the output
        // For now, just store the count
      }
      
      // Extract cart total
      const totalMatch = output.match(/Cart total: \$(\d+\.\d+)/);
      if (totalMatch) {
        workflow.cartTotal = parseFloat(totalMatch[1]);
      }
    });
    
    // Capture stderr
    workflowProcess.stderr.on('data', (data) => {
      const error = data.toString();
      if (!error.includes('running on stdio')) {
        workflow.logs.push(`❌ Error: ${error}`);
        workflow.status = 'error';
      }
    });
    
    // Handle process exit
    workflowProcess.on('close', (code) => {
      if (code === 0) {
        workflow.status = 'complete';
        workflow.logs.push('✅ Workflow completed successfully!');
      } else {
        workflow.status = 'error';
        workflow.logs.push(`❌ Workflow exited with code ${code}`);
      }
    });
    
    // Auto-confirm after 5 seconds when waiting for login
    // (gives user time to log in)
    setTimeout(() => {
      if (workflow.status === 'waiting_for_login') {
        // Send ENTER to the process stdin to continue
        workflowProcess.stdin.write('\n');
      }
    }, 60000); // 60 seconds to log in
    
    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Workflow started. Browser will open shortly for Woolworths login.',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  
  if (!sessionId) {
    return NextResponse.json({
      success: false,
      error: 'Session ID required',
    }, { status: 400 });
  }
  
  const workflow = activeWorkflows.get(sessionId);
  
  if (!workflow) {
    return NextResponse.json({
      success: false,
      error: 'Workflow not found',
    }, { status: 404 });
  }
  
  return NextResponse.json({
    success: true,
    status: workflow.status,
    logs: workflow.logs,
    ingredients: workflow.ingredients,
    cartItems: workflow.cartItems,
    cartTotal: workflow.cartTotal,
  });
}

// Cleanup old workflows
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, workflow] of activeWorkflows.entries()) {
    // Remove completed/errored workflows after 5 minutes
    if (['complete', 'error'].includes(workflow.status)) {
      activeWorkflows.delete(sessionId);
    }
  }
}, 5 * 60 * 1000);
