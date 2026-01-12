import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, MessageSquare, Calendar } from 'lucide-react';
import { base44 } from '../../api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function ConversationHistory({ conversation }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  // Extract client_id - handle both string and object cases
  const clientId = typeof conversation.client_id === 'object' 
    ? conversation.client_id?._id 
    : conversation.client_id;

  const { data: history, isLoading, error } = useQuery({
    queryKey: ['conversationHistory', conversation.customer_email],
    queryFn: async () => {
      if (!conversation.customer_email || !clientId) return [];
      try {
        console.log('🔍 Fetching history for:', conversation.customer_email, 'clientId:', clientId);
        
        // Fetch from endpoint
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/entities/chat/history?email=${encodeURIComponent(conversation.customer_email)}&clientId=${clientId}`,
          {
            headers: {
              'Authorization': `Bearer ${base44.token}`
            }
          }
        );
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          console.error('❌ API Error:', response.statusText);
          throw new Error('Failed to fetch history');
        }
        
        const data = await response.json();
        console.log('✅ History data received:', data);
        
        return data.data || [];
      } catch (error) {
        console.error('❌ Error fetching history:', error);
        return [];
      }
    },
    enabled: !!conversation.customer_email && expanded,
  });

  const otherSessions = history?.filter(h => h.conversation_id !== conversation.id) || [];

  if (!conversation.customer_email) {
    return null;
  }

  return (
    <div className="bg-white border-t border-slate-200">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">
            📋 Conversation History
          </span>
          {otherSessions.length > 0 && (
            <span className="ml-2 text-xs font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
              {otherSessions.length} previous
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {/* Content */}
      {expanded && (
        <div className="px-4 py-3 space-y-3 border-t border-slate-100 bg-slate-50">
          {isLoading ? (
            <p className="text-xs text-slate-600 py-2">⏳ Loading history...</p>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded p-2">
              <p className="text-xs text-red-700">❌ Error loading history</p>
              <p className="text-xs text-red-600 mt-1">{error?.message}</p>
            </div>
          ) : otherSessions.length === 0 ? (
            <div className="space-y-2">
              <p className="text-xs text-slate-600 py-2">
                📌 No previous conversations found for this customer
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-700">
                <p><strong>Debug Info:</strong></p>
                <p>Email: {conversation.customer_email}</p>
                <p>Client ID: {clientId}</p>
                <p>Total history records: {history?.length || 0}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {otherSessions.map((session, idx) => (
                  <div
                    key={session.conversation_id}
                    className="bg-white rounded-lg p-3 border border-slate-200 hover:border-slate-300 cursor-pointer transition-all"
                    onClick={() => setSelectedSession(selectedSession === session.conversation_id ? null : session.conversation_id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-900">
                          Session {otherSessions.length - idx}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          📅 {session.started_at ? new Date(session.started_at).toLocaleDateString() : 'N/A'}
                          {' '}
                          {session.started_at ? new Date(session.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </div>
                      <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        <MessageSquare className="w-3 h-3 inline mr-1" />
                        {session.message_count}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded inline-block ${
                        session.status === 'resolved'
                          ? 'bg-green-100 text-green-700'
                          : session.status === 'closed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {(session.status || 'active').toUpperCase()}
                      </span>
                    </div>

                    {/* Details */}
                    {selectedSession === session.conversation_id && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                        <p>
                          <strong>Last Message:</strong>{' '}
                          {session.last_message_at
                            ? new Date(session.last_message_at).toLocaleString()
                            : 'N/A'}
                        </p>
                        <p>
                          <strong>Session ID:</strong>{' '}
                          <code className="text-xs bg-slate-200 px-1 py-0.5 rounded">
                            {session.session_id?.slice(0, 12)}...
                          </code>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <p className="text-xs text-blue-900">
                  <strong>📊 Agent Note:</strong> This customer has {otherSessions.length + 1} total
                  conversation{otherSessions.length > 0 ? 's' : ''}. Showing current session only to
                  customer for a fresh experience, but you see all history for context.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
