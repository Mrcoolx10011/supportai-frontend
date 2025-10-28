import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import ConversationList from "../components/livechat/ConversationList";
import ChatWindow from "../components/livechat/ChatWindow";
import EmptyState from "../components/livechat/EmptyState";

export default function LiveChat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const { data: allConversations, isLoading } = useQuery({
    queryKey: ['allConversations'],
    queryFn: () => base44.entities.ChatConversation.filter({ 
      is_resolved: false
    }, '-updated_date'),
    refetchInterval: 3000,
    initialData: [],
  });

  const assignConversationMutation = useMutation({
    mutationFn: ({ id, agentEmail }) => 
      base44.entities.ChatConversation.update(id, {
        status: 'with_agent',
        assigned_agent: agentEmail
      }),
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
          <h2 className="font-semibold text-slate-900">Active Conversations</h2>
          <p className="text-sm text-slate-600 mt-1">
            {awaitingConversations.length} waiting • {activeConversations.length} with agent • {botConversations.length} with bot
          </p>
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