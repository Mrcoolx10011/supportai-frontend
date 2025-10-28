import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, X, Bot, Minimize2, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [customerInfo, setCustomerInfo] = useState(null);
  const [showInfoForm, setShowInfoForm] = useState(true);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [clientSettings, setClientSettings] = useState({
    primary_color: '#4F46E5',
    chatbot_greeting: 'Hi! How can I help you today?',
    company_name: 'Support Team',
    chatbot_position: 'bottom-right',
    confidence_threshold: 0.7
  });
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('client_id') || 'demo-client';

  useEffect(() => {
    // CRITICAL: Hide everything and make transparent
    document.body.style.cssText = `
      background: transparent !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      height: 100vh !important;
      width: 100vw !important;
    `;
    
    document.documentElement.style.cssText = `
      background: transparent !important;
      height: 100vh !important;
      width: 100vw !important;
    `;
    
    // Force root to be transparent
    const root = document.getElementById('root');
    if (root) {
      root.style.cssText = `
        background: transparent !important;
        height: 100vh !important;
        width: 100vw !important;
        position: relative !important;
      `;
    }

    // Hide sidebar if it exists
    const sidebar = document.querySelector('[data-sidebar]');
    if (sidebar) {
      sidebar.style.display = 'none';
    }

    // Load settings with error handling
    const loadClientSettings = async () => {
      try {
        setIsLoadingSettings(true);
        const clients = await base44.entities.Client.filter({ id: clientId });
        if (clients && clients.length > 0) {
          setClientSettings(prev => ({...prev, ...clients[0]}));
        }
      } catch (error) {
        console.log("Using default settings due to error:", error);
        // Continue with default settings - don't block the widget
      } finally {
        setIsLoadingSettings(false);
      }
    };
    
    // Only load settings when widget is opened to avoid unnecessary API calls
    if (isOpen) {
      loadClientSettings();
    }

    return () => {
      // Cleanup
      document.body.style.cssText = '';
      document.documentElement.style.cssText = '';
    };
  }, [clientId, isOpen]);

  const { data: messages } = useQuery({
    queryKey: ['widgetMessages', currentConversation?.id],
    queryFn: async () => {
      if (!currentConversation) return [];
      try {
        return await base44.entities.ChatMessage.filter({ 
          conversation_id: currentConversation.id 
        }, 'created_date');
      } catch (error) {
        console.error("Error loading messages:", error);
        return []; // Return empty array on error
      }
    },
    enabled: !!currentConversation && isOpen,
    refetchInterval: 3000,
    initialData: [],
    retry: 2,
    retryDelay: 1000,
  });

  const createConversationMutation = useMutation({
    mutationFn: async (data) => {
      try {
        return await base44.entities.ChatConversation.create(data);
      } catch (error) {
        console.error("Error creating conversation:", error);
        throw new Error("Failed to start chat. Please try again.");
      }
    },
    onSuccess: async (conversation) => {
      setCurrentConversation(conversation);
      setShowInfoForm(false);
      
      try {
        await base44.entities.ChatMessage.create({
          conversation_id: conversation.id,
          sender_type: 'bot',
          sender_name: 'AI Assistant',
          message: clientSettings.chatbot_greeting || "Hi! How can I help you today?",
          is_automated: true
        });
        queryClient.invalidateQueries({ queryKey: ['widgetMessages'] });
      } catch (error) {
        console.error("Error sending greeting:", error);
        // Continue anyway - greeting is not critical
      }
    },
    onError: (error) => {
      alert("Failed to start chat. Please check your connection and try again.");
      console.error("Conversation creation error:", error);
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data) => {
      try {
        return await base44.entities.ChatMessage.create(data);
      } catch (error) {
        console.error("Error sending message:", error);
        throw new Error("Failed to send message");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widgetMessages'] });
      setMessage("");
      setTimeout(handleAIResponse, 500);
    },
    onError: (error) => {
      alert("Failed to send message. Please try again.");
      console.error("Message send error:", error);
    }
  });

  const handleStartChat = (e) => {
    e.preventDefault();
    if (customerInfo?.name && customerInfo?.email) {
      createConversationMutation.mutate({
        client_id: clientId,
        customer_email: customerInfo.email,
        customer_name: customerInfo.name,
        status: 'bot_active',
        handoff_requested: false,
        is_resolved: false
      });
    }
  };

  const handleAIResponse = async () => {
    if (!currentConversation) return;

    try {
      let knowledgeBase = [];
      try {
        knowledgeBase = await base44.entities.KnowledgeBaseItem.filter({ 
          client_id: clientId,
          is_active: true 
        });
      } catch (error) {
        console.log("Could not load knowledge base, continuing with AI response");
      }

      const context = knowledgeBase.map(item => 
        `Q: ${item.question}\nA: ${item.answer}`
      ).join('\n\n');

      const recentMessages = messages.slice(-5).map(m => 
        `${m.sender_type}: ${m.message}`
      ).join('\n');

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful customer support assistant for ${clientSettings.company_name || 'our company'}. Use the following knowledge base to answer the customer's question. Be friendly, professional, and concise. If you don't have enough information to answer accurately, politely say you'll connect them with a human agent.

Knowledge Base:
${context || 'No knowledge base available'}

Recent conversation:
${recentMessages}

Customer's latest message: ${message}

Provide a helpful response:`,
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" },
            confidence: { type: "number" },
            should_handoff: { type: "boolean" }
          }
        }
      });

      await base44.entities.ChatMessage.create({
        conversation_id: currentConversation.id,
        sender_type: 'bot',
        sender_name: 'AI Assistant',
        message: aiResponse.response,
        confidence_score: aiResponse.confidence,
        is_automated: true
      });

      if (aiResponse.should_handoff || aiResponse.confidence < (clientSettings?.confidence_threshold || 0.7)) {
        await base44.entities.ChatConversation.update(currentConversation.id, {
          status: 'awaiting_agent',
          handoff_requested: true,
          handoff_reason: 'Low confidence or complex query'
        });
        
        await base44.entities.ChatMessage.create({
          conversation_id: currentConversation.id,
          sender_type: 'bot',
          sender_name: 'AI Assistant',
          message: "Let me connect you with one of our team members who can better assist you. They'll be with you shortly! 👋",
          is_automated: true
        });
      }

      queryClient.invalidateQueries({ queryKey: ['widgetMessages'] });
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      try {
        await base44.entities.ChatMessage.create({
          conversation_id: currentConversation.id,
          sender_type: 'bot',
          sender_name: 'AI Assistant',
          message: "I'm having trouble processing your request. Let me connect you with a team member who can help! 🙂",
          is_automated: true
        });
      } catch (innerError) {
        console.error("Failed to send error message:", innerError);
      }
      
      queryClient.invalidateQueries({ queryKey: ['widgetMessages'] });
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() || !currentConversation) return;

    sendMessageMutation.mutate({
      conversation_id: currentConversation.id,
      sender_type: 'customer',
      sender_name: customerInfo?.name || 'Customer',
      message: message.trim()
    });
  };

  const handleRequestAgent = async () => {
    if (!currentConversation) return;
    
    try {
      await base44.entities.ChatConversation.update(currentConversation.id, {
        status: 'awaiting_agent',
        handoff_requested: true,
        handoff_reason: 'Customer requested human agent'
      });

      await base44.entities.ChatMessage.create({
        conversation_id: currentConversation.id,
        sender_type: 'bot',
        sender_name: 'AI Assistant',
        message: "Connecting you with our team now. Someone will be with you shortly! 👍",
        is_automated: true
      });

      queryClient.invalidateQueries({ queryKey: ['widgetMessages'] });
    } catch (error) {
      console.error("Error requesting agent:", error);
      alert("Failed to request agent. Please try again.");
    }
  };

  const primaryColor = clientSettings?.primary_color || '#4F46E5';
  const position = clientSettings?.chatbot_position || 'bottom-right';

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999999,
        background: 'transparent'
      }}
    >
      <div className={`fixed ${positionClasses[position]} z-[9999]`} style={{ pointerEvents: 'auto' }}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="mb-4"
            >
              <Card className="w-[380px] h-[600px] shadow-2xl border-none overflow-hidden flex flex-col">
                <div 
                  className="p-4 text-white flex items-center justify-between"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{clientSettings.company_name || 'Support'}</h3>
                      <p className="text-xs text-white/80">We're here to help!</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-white hover:bg-white/20 h-8 w-8"
                      onClick={() => setIsOpen(false)}
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-white hover:bg-white/20 h-8 w-8"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col bg-white">
                  {showInfoForm ? (
                    <div className="p-6">
                      <h4 className="font-semibold text-lg mb-2">Welcome! 👋</h4>
                      <p className="text-sm text-slate-600 mb-4">
                        {clientSettings?.chatbot_greeting || "How can we help you today?"}
                      </p>
                      <form onSubmit={handleStartChat} className="space-y-3">
                        <Input
                          placeholder="Your name"
                          value={customerInfo?.name || ''}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                          required
                        />
                        <Input
                          type="email"
                          placeholder="Your email"
                          value={customerInfo?.email || ''}
                          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                          required
                        />
                        <Button 
                          type="submit" 
                          className="w-full"
                          style={{ backgroundColor: primaryColor }}
                          disabled={createConversationMutation.isPending}
                        >
                          {createConversationMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Starting...
                            </>
                          ) : (
                            'Start Chat'
                          )}
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <>
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.length === 0 && (
                            <div className="text-center text-slate-500 py-8">
                              <Bot className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                              <p className="text-sm">Start a conversation!</p>
                            </div>
                          )}
                          {messages.map((msg) => {
                            const isCustomer = msg.sender_type === 'customer';
                            const isBot = msg.sender_type === 'bot';
                            
                            return (
                              <div key={msg.id} className={`flex gap-2 ${isCustomer ? 'justify-end' : ''}`}>
                                {!isCustomer && (
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback style={{ backgroundColor: `${primaryColor}20` }}>
                                      {isBot ? <Bot className="w-4 h-4" style={{ color: primaryColor }} /> : <User className="w-4 h-4" />}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div className={`max-w-[75%] ${isCustomer ? 'items-end' : ''}`}>
                                  <div 
                                    className={`rounded-2xl px-4 py-2 ${
                                      isCustomer 
                                        ? 'text-white' 
                                        : 'bg-slate-100 text-slate-900'
                                    }`}
                                    style={isCustomer ? { backgroundColor: primaryColor } : {}}
                                  >
                                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>

                      <div className="p-4 border-t border-slate-200 bg-white">
                        <div className="flex gap-2 mb-2">
                          <Input
                            placeholder="Type your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                          />
                          <Button 
                            onClick={handleSendMessage}
                            disabled={!message.trim() || sendMessageMutation.isPending}
                            style={{ backgroundColor: primaryColor }}
                          >
                            {sendMessageMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full text-xs"
                          onClick={handleRequestAgent}
                        >
                          Talk to a Human Agent
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              size="lg"
              className="rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-shadow"
              style={{ backgroundColor: primaryColor }}
              onClick={() => setIsOpen(true)}
            >
              <Bot className="w-8 h-8" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}