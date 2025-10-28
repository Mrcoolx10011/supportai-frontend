import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

  const { data: responses, isLoading } = useQuery({
    queryKey: ['cannedResponses'],
    queryFn: () => base44.entities.CannedResponse.list('-usage_count'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.CannedResponse.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cannedResponses'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.CannedResponse.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cannedResponses'] });
      setShowDialog(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CannedResponse.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cannedResponses'] });
    },
  });

  const filteredResponses = responses.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.content.toLowerCase().includes(searchQuery.toLowerCase())
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
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : filteredResponses.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No quick replies yet</p>
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