import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Zap } from 'lucide-react';

export default function PredictiveAnalytics({ tickets = [] }) {
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    generatePredictions();
  }, [tickets]);

  const generatePredictions = () => {
    if (tickets.length === 0) return;

    // Calculate metrics
    const avgResolutionTime = tickets.reduce((sum, t) => sum + (t.resolution_time || 0), 0) / tickets.length;
    const urgentCount = tickets.filter(t => t.priority === 'urgent').length;
    const avgSatisfaction = tickets.filter(t => t.satisfaction_rating)
      .reduce((sum, t) => sum + t.satisfaction_rating, 0) / (tickets.filter(t => t.satisfaction_rating).length || 1);

    setPredictions({
      estimatedResolutionTime: Math.round(avgResolutionTime / 60), // in minutes
      escalationRisk: (urgentCount / tickets.length * 100).toFixed(1),
      satisfactionPrediction: avgSatisfaction.toFixed(1),
      recommendedActions: [
        'Prioritize 3 urgent tickets',
        'Schedule team meeting for high-risk issues',
        'Review recent resolution patterns'
      ]
    });
  };

  if (!predictions) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Predictive Analytics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <label className="text-sm font-medium text-gray-700">Est. Resolution Time</label>
          <p className="text-2xl font-bold text-blue-600">{predictions.estimatedResolutionTime}</p>
          <p className="text-xs text-gray-500">minutes</p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <label className="text-sm font-medium text-gray-700">Escalation Risk</label>
          <p className="text-2xl font-bold text-yellow-600">{predictions.escalationRisk}%</p>
          <p className="text-xs text-gray-500">high priority tickets</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <label className="text-sm font-medium text-gray-700">Satisfaction Prediction</label>
          <p className="text-2xl font-bold text-green-600">{predictions.satisfactionPrediction}/5</p>
          <p className="text-xs text-gray-500">expected rating</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          Recommended Actions
        </h4>
        <ul className="space-y-2">
          {predictions.recommendedActions.map((action, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
              {action}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
