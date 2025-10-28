import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export default function KnowledgeBaseForm({ open, onOpenChange, item, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "",
    tags: [],
    is_active: true,
    client_id: "demo-client"
  });

  useEffect(() => {
    if (item) {
      setFormData({
        question: item.question || "",
        answer: item.answer || "",
        category: item.category || "",
        tags: item.tags || [],
        is_active: item.is_active ?? true,
        client_id: item.client_id || "demo-client"
      });
    } else {
      setFormData({
        question: "",
        answer: "",
        category: "",
        tags: [],
        is_active: true,
        client_id: "demo-client"
      });
    }
  }, [item, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit' : 'Add'} Knowledge Base Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              placeholder="What question does this answer?"
              required
            />
          </div>

          <div>
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              placeholder="Provide a detailed answer..."
              className="h-32"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              placeholder="e.g., Billing, Technical, Product"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Active</Label>
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
              {item ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
