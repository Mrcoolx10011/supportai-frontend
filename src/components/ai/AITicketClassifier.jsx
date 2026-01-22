import React, { useState, useEffect } from 'react';
import { Zap, Loader } from 'lucide-react';

export default function AITicketClassifier({ ticketDescription, onClassify, ticket }) {
  const [loading, setLoading] = useState(false);
  const [classification, setClassification] = useState(null);
  const [error, setError] = useState('');

  // Auto-classify when ticket changes
  useEffect(() => {
    if (ticket?.description) {
      classifyTicket();
    } else {
      setClassification(null);
    }
  }, [ticket?.id]); // Re-run when ticket ID changes

  const classifyTicket = async () => {
    if (!ticket?.description && !ticketDescription) {
      setError('No ticket selected');
      setClassification(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate AI classification delay
      await new Promise(resolve => setTimeout(resolve, 600));

      // Mock classification based on ticket data
      const mockClassification = {
        category: 'Technical Issue',
        priority: 'high',
        sentiment: 'urgent',
        confidence: 0.92,
        suggestedTags: ['bug', 'critical', 'api']
      };

      setClassification(mockClassification);
      onClassify?.(mockClassification);
    } catch (err) {
      setError('Failed to classify ticket');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            AI Ticket Classifier
          </h3>
          {ticket && (
            <p className="text-xs text-blue-600 mt-1">
              📋 Analyzing: <span className="font-semibold">{ticket.title}</span>
            </p>
          )}
          {!ticket && (
            <p className="text-xs text-gray-500 mt-1">Select a ticket to analyze</p>
          )}
        </div>
        <button
          onClick={classifyTicket}
          disabled={loading || !ticket}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {loading ? 'Analyzing...' : 'Classify'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {classification && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <p className="text-gray-600">{classification.category}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getPriorityColor(classification.priority)}`}>
                {classification.priority.charAt(0).toUpperCase() + classification.priority.slice(1)}
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Confidence</label>
              <p className="text-gray-600">{(classification.confidence * 100).toFixed(0)}%</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Sentiment</label>
            <p className="text-gray-600 capitalize">{classification.sentiment}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Suggested Tags</label>
            <div className="flex flex-wrap gap-2">
              {classification.suggestedTags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {!classification && !error && !loading && (
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            {ticket ? 'Click "Classify" to analyze' : 'Select a ticket from the list to analyze'}
          </p>
        </div>
      )}
    </div>
  );
}
