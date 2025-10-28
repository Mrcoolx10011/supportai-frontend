import React, { useState, useEffect } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import KnowledgeBaseList from "../components/knowledgebase/KnowledgeBaseList";
import KnowledgeBaseForm from "../components/knowledgebase/KnowledgeBaseForm";
import KnowledgeBaseStats from "../components/knowledgebase/KnowledgeBaseStats";

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: items, isLoading, error, refetch } = useQuery({
    queryKey: ['knowledgeBase'],
    queryFn: async () => {
      console.log('🔍 Fetching Knowledge Base items...');
      console.log('� Client ready:', base44.isReady, 'Has token:', !!base44.token);
      
      if (!base44.isReady || !base44.token) {
        console.log('⚠️ Client not ready, waiting...');
        throw new Error('Client not ready');
      }
      
      const response = await base44.entities.KnowledgeBaseItem.list('-usage_count');
      console.log('📚 Knowledge Base API response:', response);
      console.log('📚 Response type:', typeof response);
      console.log('📚 Is array:', Array.isArray(response));
      console.log('📚 Items count:', response?.length);
      return response;
    },
    initialData: [],
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    enabled: true, // Always enabled, will retry when client becomes ready
  });

  // Auto-refetch when client becomes ready
  useEffect(() => {
    if (base44.isReady && base44.token && (!items || items.length === 0)) {
      console.log('🔄 Client ready, auto-refreshing knowledge base...');
      refetch();
    }
  }, [base44.isReady, base44.token, refetch, items]);

  const createItemMutation = useMutation({
    mutationFn: (data) => base44.entities.KnowledgeBaseItem.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] });
      setShowForm(false);
      setEditingItem(null);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.KnowledgeBaseItem.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] });
      setShowForm(false);
      setEditingItem(null);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id) => base44.entities.KnowledgeBaseItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] });
    },
  });

  const filteredItems = items.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (data) => {
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data });
    } else {
      createItemMutation.mutate(data);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItemMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Knowledge Base</h1>
          <p className="text-slate-600 mt-1">Train your AI assistant with FAQs and information</p>
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
              setEditingItem(null);
              setShowForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Knowledge
          </Button>
        </div>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          Total Items: {Array.isArray(items) ? items.length : 'N/A'} | 
          Loading: {isLoading ? 'Yes' : 'No'} | 
          Error: {error ? error.message : 'None'} |
          Client Ready: {base44.isReady ? 'Yes' : 'No'} |
          Has Token: {base44.token ? 'Yes' : 'No'}
        </div>
      )}

      <KnowledgeBaseStats items={items} />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search knowledge base..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 bg-white border-slate-200"
        />
      </div>

      <KnowledgeBaseList 
        items={filteredItems}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <KnowledgeBaseForm
        open={showForm}
        onOpenChange={setShowForm}
        item={editingItem}
        onSubmit={handleSubmit}
        isLoading={createItemMutation.isPending || updateItemMutation.isPending}
      />
    </div>
  );
}