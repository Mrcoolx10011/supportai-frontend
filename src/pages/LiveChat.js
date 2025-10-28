import React, { useState, useEffect } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { API_CONFIG } from "../config/api";

import ConversationList from "../components/livechat/ConversationList";
import ChatWindow from "../components/livechat/ChatWindow";
import EmptyState from "../components/livechat/EmptyState";

export default function LiveChat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        // Try to login automatically
        const response = await fetch(`${API_CONFIG.API_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'demo@supportai.com',
            password: 'password123'
          }),
        });
        
        const data = await response.json();
        if (data.token) {
          base44.setToken(data.token);
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.log('Auto-login failed, using demo user');
        // Use demo user if auth fails
        setCurrentUser({
          id: 'demo-admin',
          full_name: 'Demo Admin',
          email: 'admin@demo.com'
        });
      }
    };
    
    autoLogin();
  }, []);

  const { data: allConversations, isLoading, error, refetch } = useQuery({
    queryKey: ['allConversations'],
    queryFn: async () => {
      console.log('🔍 Fetching Live Chat Conversations...');
      console.log('🔑 Client ready:', base44.isReady, 'Has token:', !!base44.token);
      
      if (!base44.isReady || !base44.token) {
        console.log('⚠️ Client not ready, waiting...');
        throw new Error('Client not ready');
      }
      
      const response = await base44.entities.ChatConversation.list();
      console.log('💬 Conversations API response:', response);
      console.log('💬 Is array:', Array.isArray(response));
      console.log('💬 Conversations length:', response?.length);
      return response;
    },
    refetchInterval: 3000, // Check for new conversations every 3 seconds
    initialData: [],
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    enabled: true, // Always enabled, will retry when client becomes ready
  });

  // Auto-refetch when client becomes ready
  useEffect(() => {
    if (base44.isReady && base44.token && (!allConversations || allConversations.length === 0)) {
      console.log('🔄 Client ready, auto-refreshing conversations...');
      refetch();
    }
  }, [base44.isReady, base44.token, refetch, allConversations]);

  const assignConversationMutation = useMutation({
    mutationFn: async ({ id, agentEmail }) => {
      try {
        // Try authenticated endpoint first
        return await base44.entities.ChatConversation.update(id, {
          status: 'with_agent',
          assigned_agent: agentEmail
        });
      } catch (error) {
        console.log('Auth failed, using public endpoint');
        // Fallback to public widget endpoint
        const response = await fetch(`${API_CONFIG.WIDGET_URL}/conversation/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'with_agent',
            assigned_agent: agentEmail
          }),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to update conversation');
        }
        return result.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allConversations'] });
    },
  });

  const handleAcceptConversation = (conversation) => {
    if (currentUser) {
      assignConversationMutation.mutate({ 
        id: conversation.id, 
        agentEmail: currentUser.email 
      });
      setSelectedConversation(conversation);
    }
  };

  const handleTakeOver = (conversation) => {
    if (currentUser) {
      assignConversationMutation.mutate({ 
        id: conversation.id, 
        agentEmail: currentUser.email 
      });
    }
  };

  // Separate conversations by status
  const awaitingConversations = allConversations.filter(c => c.status === 'awaiting_agent');
  const activeConversations = allConversations.filter(c => c.status === 'with_agent');
  const botConversations = allConversations.filter(c => c.status === 'bot_active');

  return (
    <div className="h-[calc(100vh-73px)] flex bg-white">
      <div className="w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-900">Active Conversations</h2>
            <Button 
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              disabled={isLoading}
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <p className="text-sm text-slate-600">
            {awaitingConversations.length} waiting • {activeConversations.length} with agent • {botConversations.length} with bot
          </p>
          
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 mt-2 p-1 bg-gray-100 rounded text-center">
              Total: {Array.isArray(allConversations) ? allConversations.length : 'N/A'} | 
              Loading: {isLoading ? 'Yes' : 'No'} | 
              Error: {error ? 'Yes' : 'No'} |
              Ready: {base44.isReady ? 'Yes' : 'No'}
            </div>
          )}
        </div>
        <ConversationList 
          conversations={allConversations}
          awaitingConversations={awaitingConversations}
          activeConversations={activeConversations}
          botConversations={botConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          onAcceptConversation={handleAcceptConversation}
          onTakeOver={handleTakeOver}
          isLoading={isLoading}
        />
      </div>

      <div className="flex-1">
        {selectedConversation ? (
          <ChatWindow 
            conversation={selectedConversation}
            currentUser={currentUser}
            onTakeOver={handleTakeOver}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}