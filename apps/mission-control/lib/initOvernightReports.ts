/**
 * Initialize Overnight Reports (One-time execution)
 * This runs once to populate the overnight review with the Feb 20 research reports
 */

import { populateOvernightReports } from './populateOvernightReports';

export function initOvernightReports() {
  // Check if already initialized
  if (typeof window === 'undefined') return;
  
  const INIT_KEY = 'overnight-reports-feb20-initialized-v2';
  const alreadyInitialized = localStorage.getItem(INIT_KEY);
  
  if (alreadyInitialized === 'true') {
    console.log('✅ Overnight reports already initialized');
    return;
  }
  
  try {
    populateOvernightReports();
    localStorage.setItem(INIT_KEY, 'true');
    console.log('✅ Overnight reports initialized successfully (Feb 20 research)');
  } catch (e) {
    console.error('❌ Error initializing overnight reports:', e);
  }
}
