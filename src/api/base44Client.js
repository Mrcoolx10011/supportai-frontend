// api/base44Client.js

// Updated to use the real SupportAI API server
import supportAI from './supportAIClient';

// Export the unified client as base44 for compatibility
export const base44 = supportAI;

// Also export as default for flexibility
export default supportAI;