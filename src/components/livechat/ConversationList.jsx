import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Clock, AlertCircle, Bot, User } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

export default function ConversationList({ 
  conversations,
  awaitingConversations,
  activeConversations,
  botConversations,
  selectedConversation, 
  onSelectConversation,
  onAcceptConversation,
  onTakeOver,
  isLoading 
}) {
  if (isLoading) {
    return (
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {/* Awaiting Agent - Highest Priority */}
        {awaitingConversations.length > 0 && (
          <div className="mb-4">
            <div className="px-2 py-2 text-xs font-semibold text-orange-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              AWAITING AGENT ({awaitingConversations.length})
            </div>
            {awaitingConversations.map(conv => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-2"
              >
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-orange-200 text-orange-700">
                        {conv.customer_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 truncate">
                        {conv.customer_name || 'Unknown'}
                      </p>
                      <p className="text-xs text-slate-600 truncate">{conv.customer_email}</p>
                      <Button
                        size="sm"
                        className="mt-2 w-full bg-orange-600 hover:bg-orange-700 h-8"
                        onClick={() => onAcceptConversation(conv)}
                      >
                        Accept Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* With Agent - Active */}
        {activeConversations.length > 0 && (
          <div className="mb-4">
            <div className="px-2 py-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
              <User className="w-4 h-4" />
              WITH AGENT ({activeConversations.length})
            </div>
            {activeConversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                  selectedConversation?.id === conv.id 
                    ? 'bg-indigo-50 border border-indigo-200' 
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {conv.customer_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">
                      {conv.customer_name || 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-600 truncate">{conv.customer_email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">
                        {conv.updated_date && !isNaN(new Date(conv.updated_date)) 
                          ? format(new Date(conv.updated_date), 'h:mm a')
                          : 'Just now'
                        }
                      </span>
                      {conv.assigned_agent && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {conv.assigned_agent.split('@')[0]}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bot Active - Can Take Over */}
        {botConversations.length > 0 && (
          <div className="mb-4">
            <div className="px-2 py-2 text-xs font-semibold text-purple-600 flex items-center gap-1">
              <Bot className="w-4 h-4" />
              WITH BOT ({botConversations.length})
            </div>
            {botConversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                  selectedConversation?.id === conv.id 
                    ? 'bg-purple-50 border border-purple-200' 
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {conv.customer_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">
                      {conv.customer_name || 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-600 truncate">{conv.customer_email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">
                        {conv.updated_date && !isNaN(new Date(conv.updated_date))
                          ? format(new Date(conv.updated_date), 'h:mm a')
                          : 'Just now'
                        }
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 w-full h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTakeOver(conv);
                      }}
                    >
                      Take Over Chat
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {conversations.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <Bot className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>No active conversations</p>
            <p className="text-xs mt-1">Chats will appear here when customers connect</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
