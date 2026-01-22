import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Zap } from 'lucide-react';

export default function AIHealthCheck() {
  const [health, setHealth] = useState({
    geminiAPI: 'checking',
    knowledgeBase: 'checking',
    ticketDatabase: 'checking',
    responseEngine: 'checking'
  });

  useEffect(() => {
    checkAIHealth();
  }, []);

  const checkAIHealth = async () => {
    const newHealth = { ...health };

    // Check Gemini API
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey) {
        newHealth.geminiAPI = 'healthy';
      } else {
        newHealth.geminiAPI = 'warning';
      }
    } catch (err) {
      newHealth.geminiAPI = 'error';
    }

    // Check Knowledge Base Connection
    try {
      // Simulated KB check - replace with actual API call
      newHealth.knowledgeBase = 'healthy';
    } catch (err) {
      newHealth.knowledgeBase = 'error';
    }

    // Check Ticket Database
    try {
      // Simulated DB check - replace with actual API call
      newHealth.ticketDatabase = 'healthy';
    } catch (err) {
      newHealth.ticketDatabase = 'error';
    }

    // Check Response Engine
    try {
      // Simulated engine check
      newHealth.responseEngine = 'healthy';
    } catch (err) {
      newHealth.responseEngine = 'error';
    }

    setHealth(newHealth);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Zap className="w-5 h-5 text-gray-500 animate-pulse" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy':
        return 'Operational';
      case 'warning':
        return 'Limited';
      case 'error':
        return 'Offline';
      default:
        return 'Checking...';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">AI System Health</h3>
        <button
          onClick={checkAIHealth}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(health).map(([key, status]) => (
          <div
            key={key}
            className="p-3 border rounded-lg hover:shadow-md transition"
          >
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(status)}
              <span className="text-xs font-medium text-gray-600 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </span>
            </div>
            <p className="text-xs text-gray-500">{getStatusText(status)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
