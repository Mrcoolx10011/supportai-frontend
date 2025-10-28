import React, { useState, useEffect, useRef } from "react";
import { base44 } from "../../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Send, User, Bot, UserCheck, Download, FileText, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import CannedResponsesPanel from "./CannedResponsesPanel";
import FileUploadButton from "./FileUploadButton";
import { API_CONFIG } from "../../config/api";

export default function ChatWindow({ conversation, currentUser, onTakeOver }) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: messages } = useQuery({
    queryKey: ['chatMessages', conversation.id],
    queryFn: async () => {
      try {
        // Try authenticated endpoint first
        return await base44.entities.ChatMessage.filter({ conversation_id: conversation.id }, 'created_date');
      } catch (error) {
        console.log('Auth failed, trying public endpoint');
        // Fallback to public widget endpoint
        const response = await fetch(`${API_CONFIG.WIDGET_URL}/messages/${conversation.id}`);
        const data = await response.json();
        return data.success ? data.data : [];
      }
    },
    refetchInterval: 2000, // Check for new messages every 2 seconds
    initialData: [],
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: attachments } = useQuery({
    queryKey: ['chatAttachments', conversation.id],
    queryFn: () => base44.entities.ChatAttachment.filter({ conversation_id: conversation.id }, 'created_date'),
    initialData: [],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data) => {
      try {
        // Try authenticated endpoint first
        return await base44.entities.ChatMessage.create(data);
      } catch (error) {
        console.log('Auth failed, using public endpoint');
        // Fallback to public widget endpoint
        const response = await fetch('${API_CONFIG.WIDGET_URL}/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to send message');
        }
        return result.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', conversation.id] });
      setMessage("");
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({
      conversation_id: conversation.id,
      sender_type: 'agent',
      sender_name: currentUser?.full_name || 'Agent',
      message: message.trim()
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUploaded = (fileData) => {
    sendMessageMutation.mutate({
      conversation_id: conversation.id,
      sender_type: 'agent',
      sender_name: currentUser?.full_name || 'Agent',
      message: `📎 Sent file: ${fileData.file_name}`
    });
  };

  const getAttachmentsForMessage = (messageId) => {
    return attachments.filter(a => a.message_id === messageId);
  };

  const isBotActive = conversation.status === 'bot_active';

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                {conversation.customer_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-slate-900">{conversation.customer_name || 'Unknown'}</h3>
              <p className="text-sm text-slate-600">{conversation.customer_email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {conversation.status === 'bot_active' && (
              <Badge className="bg-purple-100 text-purple-700 flex items-center gap-1">
                <Bot className="w-3 h-3" />
                Bot Active
              </Badge>
            )}
            {conversation.status === 'with_agent' && (
              <Badge className="bg-indigo-100 text-indigo-700 flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                With Agent
              </Badge>
            )}
            {conversation.status === 'awaiting_agent' && (
              <Badge className="bg-orange-100 text-orange-700">
                Awaiting Agent
              </Badge>
            )}
          </div>
        </div>
        {isBotActive && (
          <Button
            size="sm"
            className="mt-3 bg-purple-600 hover:bg-purple-700"
            onClick={() => onTakeOver(conversation)}
          >
            Take Over This Conversation
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => {
            const isAgent = msg.sender_type === 'agent';
            const isBot = msg.sender_type === 'bot';
            const msgAttachments = getAttachmentsForMessage(msg.id);
            
            return (
              <div key={msg.id} className={`flex gap-3 ${isAgent ? 'justify-end' : ''}`}>
                {!isAgent && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className={isBot ? 'bg-purple-100' : 'bg-indigo-100'}>
                      {isBot ? <Bot className="w-4 h-4 text-purple-600" /> : <User className="w-4 h-4 text-indigo-600" />}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[70%] ${isAgent ? 'items-end' : ''}`}>
                  <div className={`rounded-2xl px-4 py-2 ${
                    isAgent 
                      ? 'bg-indigo-600 text-white' 
                      : isBot
                      ? 'bg-purple-50 text-slate-900'
                      : 'bg-slate-100 text-slate-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  
                  {msgAttachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msgAttachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          {attachment.file_type?.startsWith('image/') ? (
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                          ) : (
                            <FileText className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-xs text-slate-700 flex-1 truncate">
                            {attachment.file_name}
                          </span>
                          <Download className="w-3 h-3 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-slate-500 mt-1 px-2">
                    {msg.sender_name} • {format(new Date(msg.created_date), 'h:mm a')}
                  </p>
                </div>
                {isAgent && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {currentUser?.full_name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2 mb-2">
          <CannedResponsesPanel 
            clientId={conversation.client_id}
            onSelect={(content) => setMessage(content)}
          />
        </div>
        <div className="flex gap-2">
          <FileUploadButton 
            conversationId={conversation.id}
            onFileUploaded={handleFileUploaded}
          />
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="resize-none"
            rows={2}
          />
          <Button 
            onClick={handleSend}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
