import React, { useState, useEffect } from 'react';
import { MessageSquare, Copy, Loader } from 'lucide-react';

export default function AIResponseSuggestions({ ticket, onSelectResponse }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');

  // Auto-generate suggestions when ticket changes
  useEffect(() => {
    if (ticket?.id) {
      generateSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [ticket?.id]); // Re-run when ticket ID changes

  const generateSuggestions = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate suggestions based on ticket data
      const mockSuggestions = [
        {
          id: 1,
          title: 'Technical Solution',
          content: ticket?.description 
            ? `Regarding your issue with "${ticket.title}": ${ticket.description}. We apologize for the inconvenience. Based on similar issues, please try clearing your browser cache and cookies, then restart the application.`
            : 'We apologize for the inconvenience. Based on similar issues, please try clearing your browser cache and cookies, then restart the application.',
          confidence: 0.95
        },
        {
          id: 2,
          title: 'Escalation Response',
          content: `Thank you for reaching out about "${ticket?.title || 'your issue'}". We understand the urgency. Our technical team is now investigating and will provide an update within 2 hours.`,
          confidence: 0.88
        },
        {
          id: 3,
          title: 'Follow-up Question',
          content: `Hi ${ticket?.customer_name || 'there'}! We appreciate you reaching out. Can you provide more details about when this issue started and what steps you've already taken to troubleshoot?`,
          confidence: 0.82
        }
      ];

      setSuggestions(mockSuggestions);
    } catch (err) {
      setError('Failed to generate suggestions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            AI Response Suggestions
          </h3>
          {ticket && (
            <p className="text-xs text-purple-600 mt-1">
              💬 For: <span className="font-semibold">{ticket.customer_name}</span>
            </p>
          )}
          {!ticket && (
            <p className="text-xs text-gray-500 mt-1">Select a ticket to generate responses</p>
          )}
        </div>
        <button
          onClick={generateSuggestions}
          disabled={loading || !ticket}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map(suggestion => (
            <div key={suggestion.id} className="p-3 border rounded-lg hover:shadow-md transition">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800">{suggestion.title}</h4>
                  <p className="text-xs text-gray-500">Confidence: {(suggestion.confidence * 100).toFixed(0)}%</p>
                </div>
                <button
                  onClick={() => copyToClipboard(suggestion.content)}
                  className="p-2 hover:bg-gray-100 rounded transition"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-700 mb-3">{suggestion.content}</p>
              <button
                onClick={() => onSelectResponse?.(suggestion)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Use This Response →
              </button>
            </div>
          ))}
        </div>
      )}

      {suggestions.length === 0 && !loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-gray-600 text-sm mb-2">
            {ticket ? 'Generating suggestions...' : '💡 Select a ticket from the list to generate responses'}
          </p>
        </div>
      )}
    </div>
  );
}
