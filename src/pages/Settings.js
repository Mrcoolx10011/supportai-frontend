import React, { useState, useEffect } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

import ChatbotSettings from "../components/settings/ChatbotSettings";
import HandoffSettings from "../components/settings/HandoffSettings";
import ProfileSettings from "../components/settings/ProfileSettings";

export default function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const { data: client } = useQuery({
    queryKey: ['currentClient', currentUser?.client_id],
    queryFn: async () => {
      if (!currentUser?.client_id) return null;
      const clients = await base44.entities.Client.filter({ id: currentUser.client_id });
      return clients[0] || null;
    },
    enabled: !!currentUser?.client_id,
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Client.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentClient'] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const handleSaveChatbot = (data) => {
    if (client) {
      updateClientMutation.mutate({ id: client.id, data });
    }
  };

  const handleSaveProfile = (data) => {
    updateUserMutation.mutate(data);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Configure your support system preferences</p>
      </div>

      <Tabs defaultValue="chatbot" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          <TabsTrigger value="handoff">Handoff Rules</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="chatbot">
          <ChatbotSettings 
            client={client}
            onSave={handleSaveChatbot}
            isLoading={updateClientMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="handoff">
          <HandoffSettings 
            client={client}
            onSave={handleSaveChatbot}
            isLoading={updateClientMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileSettings 
            user={currentUser}
            onSave={handleSaveProfile}
            isLoading={updateUserMutation.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}