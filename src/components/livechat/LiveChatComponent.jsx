import React, { useState, useCallback, useEffect } from 'react';
import { Send, Lightbulb, AlertTriangle, MessageSquare, Loader } from 'lucide-react';

const LiveChatComponent = ({ ticketId, agentId }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sentiment, setSentiment] = useState(null);
  const [escalationWarning, setEscalationWarning] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Initialize chat session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const response = await fetch('/api/chat/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticket_id: ticketId,
            agent_id: agentId,
            ai_copilot_enabled: true
          })
        });
        const data = await response.json();
        setSessionId(data.session._id);
      } catch (error) {
        console.error('Session init error:', error);
      }
    };

    if (ticketId && agentId) {
      initializeSession();
    }
  }, [ticketId, agentId]);

  // Get suggestions as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentMessage.length > 10 && sessionId) {
        fetchSuggestions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentMessage, sessionId]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        `/api/chat/sessions/${sessionId}/response-suggestions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: currentMessage,
            include_kb: true
          })
        }
      );
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Suggestion error:', error);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || !sessionId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/chat/sessions/${sessionId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: currentMessage,
            sender_type: 'agent',
            analyze_sentiment: false
          })
        }
      );

      const data = await response.json();
      
      setMessages([...messages, {
        id: data.message._id,
        content: currentMessage,
        sender: 'agent',
        timestamp: new Date()
      }]);

      setCurrentMessage('');
      setSuggestions([]);
    } catch (error) {
      console.error('Send error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const useSuggestion = (suggestion) => {
    setCurrentMessage(suggestion.text);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="font-semibold text-gray-900">Live Chat - AI Copilot</h3>
        <p className="text-sm text-gray-600">Ticket #{ticketId?.substring(0, 8)}</p>
      </div>

      {/* Escalation Warning */}
      {escalationWarning && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex gap-3">
          <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-semibold text-red-900">Escalation Warning</p>
            <p className="text-sm text-red-800">{escalationWarning}</p>
          </div>
        </div>
      )}

      {/* Sentiment Indicator */}
      {sentiment && (
        <div className={`px-4 py-2 text-sm font-medium ${
          sentiment.sentiment === 'positive' ? 'bg-green-50 text-green-800' :
          sentiment.sentiment === 'negative' ? 'bg-red-50 text-red-800' :
          'bg-gray-50 text-gray-800'
        }`}>
          Customer Sentiment: {sentiment.sentiment.toUpperCase()}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">Start the conversation</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === 'agent'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {msg.timestamp?.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && showSuggestions && (
        <div className="border-t border-gray-200 bg-amber-50 p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
            <Lightbulb size={16} />
            AI Suggestions
          </div>
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => useSuggestion(suggestion)}
              className="block w-full text-left p-2 hover:bg-amber-100 rounded text-sm text-gray-700 border border-amber-200"
            >
              {suggestion.text.substring(0, 80)}...
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex gap-2">
          <textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Type your response... (AI will suggest responses)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !currentMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 mt-2 flex-wrap">
          <button className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">
            Common Phrases
          </button>
          <button className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">
            KB Articles
          </button>
          <button className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100">
            Escalate
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChatComponent;
