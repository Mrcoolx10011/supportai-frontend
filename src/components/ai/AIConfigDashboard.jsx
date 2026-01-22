import React, { useState } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import AIHealthCheck from './AIHealthCheck';
import PredictiveAnalytics from './PredictiveAnalytics';

export default function AIConfigDashboard({ tickets = [] }) {
  const [config, setConfig] = useState({
    enableAIClassification: true,
    enablePredictiveAnalytics: true,
    enableChatAssistant: true,
    confidenceThreshold: 0.7,
    autoEscalationRisk: 0.8,
    knowledgeBaseDepth: 'deep',
    responseLanguage: 'en'
  });

  const [saved, setSaved] = useState(false);

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveConfig = () => {
    // Save to localStorage or API
    localStorage.setItem('aiConfig', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Health Check */}
      <AIHealthCheck />

      {/* Predictive Analytics */}
      <PredictiveAnalytics tickets={tickets} />

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            AI Configuration
          </h3>
          <button
            onClick={saveConfig}
            className={`px-4 py-2 rounded flex items-center gap-2 transition ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {saved ? 'Saved!' : 'Save'}
            <Save className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Feature Toggles */}
          <div className="border-b pb-4">
            <h4 className="font-semibold text-gray-700 mb-3">AI Features</h4>
            <div className="space-y-3">
              {[
                { key: 'enableAIClassification', label: 'AI Ticket Classification' },
                { key: 'enablePredictiveAnalytics', label: 'Predictive Analytics' },
                { key: 'enableChatAssistant', label: 'AI Chat Assistant' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config[key]}
                    onChange={(e) => handleConfigChange(key, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="border-b pb-4">
            <h4 className="font-semibold text-gray-700 mb-3">Thresholds</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Confidence Threshold: {(config.confidenceThreshold * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={config.confidenceThreshold}
                  onChange={(e) => handleConfigChange('confidenceThreshold', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Auto-Escalation Risk: {(config.autoEscalationRisk * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={config.autoEscalationRisk}
                  onChange={(e) => handleConfigChange('autoEscalationRisk', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Dropdowns */}
          <div className="border-b pb-4">
            <h4 className="font-semibold text-gray-700 mb-3">RAG Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Knowledge Base Search Depth
                </label>
                <select
                  value={config.knowledgeBaseDepth}
                  onChange={(e) => handleConfigChange('knowledgeBaseDepth', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="shallow">Shallow (Fast)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="deep">Deep (Thorough)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Response Language
                </label>
                <select
                  value={config.responseLanguage}
                  onChange={(e) => handleConfigChange('responseLanguage', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Configuration updates apply immediately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
