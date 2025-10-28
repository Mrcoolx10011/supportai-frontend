import React, { useState, useEffect } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";

import ClientsList from "../components/clients/ClientsList";
import ClientForm from "../components/clients/ClientForm";
import ClientsStats from "../components/clients/ClientsStats";

export default function Clients() {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const queryClient = useQueryClient();

  const { data: clients, isLoading, error, refetch } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      console.log('🔍 Fetching Clients...');
      console.log('🔑 Client ready:', base44.isReady, 'Has token:', !!base44.token);
      
      if (!base44.isReady || !base44.token) {
        console.log('⚠️ Client not ready, waiting...');
        throw new Error('Client not ready');
      }
      
      const response = await base44.entities.Client.list();
      console.log('👥 Clients API response:', response);
      console.log('👥 Is array:', Array.isArray(response));
      console.log('👥 Clients length:', response?.length);
      return response;
    },
    initialData: [],
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    enabled: true, // Always enabled, will retry when client becomes ready
  });

  // Auto-refetch when client becomes ready
  useEffect(() => {
    if (base44.isReady && base44.token && (!clients || clients.length === 0)) {
      console.log('🔄 Client ready, auto-refreshing clients...');
      refetch();
    }
  }, [base44.isReady, base44.token, refetch, clients]);

  const createClientMutation = useMutation({
    mutationFn: (data) => base44.entities.Client.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowForm(false);
      setEditingClient(null);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Client.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setShowForm(false);
      setEditingClient(null);
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: (id) => base44.entities.Client.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const handleSubmit = (data) => {
    if (editingClient) {
      updateClientMutation.mutate({ id: editingClient.id, data });
    } else {
      createClientMutation.mutate(data);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this client? This will remove all their data.")) {
      deleteClientMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Client Management</h1>
          <p className="text-slate-600 mt-1">Manage multi-tenant client organizations</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetch()}
            variant="outline"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => {
              setEditingClient(null);
              setShowForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          Total Clients: {Array.isArray(clients) ? clients.length : 'N/A'} | 
          Loading: {isLoading ? 'Yes' : 'No'} | 
          Error: {error ? error.message : 'None'} |
          Client Ready: {base44.isReady ? 'Yes' : 'No'} |
          Has Token: {base44.token ? 'Yes' : 'No'}
        </div>
      )}

      <ClientsStats clients={clients} />

      <ClientsList 
        clients={clients}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ClientForm
        open={showForm}
        onOpenChange={setShowForm}
        client={editingClient}
        onSubmit={handleSubmit}
        isLoading={createClientMutation.isPending || updateClientMutation.isPending}
      />
    </div>
  );
}