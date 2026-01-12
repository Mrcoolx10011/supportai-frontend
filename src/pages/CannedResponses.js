import React, { useState, useEffect } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Plus, Search, Pencil, Trash2, Zap, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import CannedResponsesSamples from "../components/cannedresponses/CannedResponsesSamples";

export default function CannedResponses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingResponse, setEditingResponse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    shortcut: "",
    content: "",
    category: "",
    client_id: "demo-client"
  });
  const queryClient = useQueryClient();

  const { data: responses = [], isLoading, error, refetch } = useQuery({
    queryKey: ['cannedResponses'],
    queryFn: async () => {
      console.log('🔍 Fetching Canned Responses...');
      console.log('🔑 Client ready:', base44.isReady, 'Has token:', !!base44.token);
      
      if (!base44.isReady || !base44.token) {
        console.log('⚠️ Client not ready, waiting...');
        throw new Error('Client not ready');
      }
      
      const response = await base44.entities.CannedResponse.list('-usage_count');
      console.log('💬 Canned Responses API response:', response);
      console.log('💬 Is array:', Array.isArray(response));
      console.log('💬 Response length:', response?.length);
      return response || [];
    },
    initialData: [],
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
    enabled: base44.isReady && !!base44.token,
  });

  // Fetch when client becomes ready or page loads
  useEffect(() => {
    if (base44.isReady && base44.token) {
      console.log('🔄 Client ready, fetching canned responses...');
      refetch();
    }
  }, [base44.isReady, base44.token, refetch]);

  // Ensure responses is always an array
  const safeResponses = Array.isArray(responses) ? responses : [];

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CannedResponse.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cannedResponses'] });
      setShowDialog(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Create error:', error);
      if (error.message?.includes('Duplicate entry')) {
        alert('Error: A canned response with this shortcut already exists. Please use a different shortcut.');
      } else {
        alert('Failed to create canned response: ' + error.message);
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CannedResponse.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cannedResponses'] });
      setShowDialog(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Update error:', error);
      if (error.message?.includes('Duplicate entry')) {
        alert('Error: A canned response with this shortcut already exists. Please use a different shortcut.');
      } else {
        alert('Failed to update canned response: ' + error.message);
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CannedResponse.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cannedResponses'] });
    },
  });

  const filteredResponses = safeResponses.filter(r => 
    r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingResponse) {
      updateMutation.mutate({ id: editingResponse.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (response) => {
    setEditingResponse(response);
    setFormData(response);
    setShowDialog(true);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this quick reply?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      shortcut: "",
      content: "",
      category: "",
      client_id: "demo-client"
    });
    setEditingResponse(null);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quick Replies</h1>
          <p className="text-slate-600 mt-1">Create canned responses for faster support</p>
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
              resetForm();
              setShowDialog(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Quick Reply
          </Button>
        </div>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          Total Responses: {Array.isArray(safeResponses) ? safeResponses.length : 'N/A'} | 
          Loading: {isLoading ? 'Yes' : 'No'} | 
          Error: {error ? error.message : 'None'} |
          Client Ready: {base44.isReady ? 'Yes' : 'No'} |
          Has Token: {base44.token ? 'Yes' : 'No'}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search quick replies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                Error loading canned responses: {error.message}
                </p>
              </div>
            )}
            {isLoading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : filteredResponses.length === 0 ? (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Zap className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 mb-2">No quick replies yet</p>
                  <p className="text-sm text-slate-400">Create your first quick reply to get started</p>
                </div>
                {safeResponses.length === 0 && <CannedResponsesSamples />}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredResponses.map((response) => (
                  <Card key={response.id} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900">{response.title}</h3>
                            {response.shortcut && (
                              <Badge variant="outline" className="text-xs">
                                {response.shortcut}
                              </Badge>
                            )}
                            {response.category && (
                              <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                                {response.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 whitespace-pre-wrap">
                            {response.content}
                          </p>
                          <p className="text-xs text-slate-400 mt-2">
                            Used {response.usage_count || 0} times
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(response)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(response.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingResponse ? 'Edit Quick Reply' : 'Add Quick Reply'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Welcome Message"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shortcut">Shortcut (optional)</Label>
                <Input
                  id="shortcut"
                  value={formData.shortcut}
                  onChange={(e) => setFormData({...formData, shortcut: e.target.value})}
                  placeholder="e.g., /welcome"
                />
              </div>
              <div>
                <Label htmlFor="category">Category (optional)</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g., Greetings"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="content">Response Text</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Type your response here..."
                className="h-32"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingResponse ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}