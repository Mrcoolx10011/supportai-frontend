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
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

export default function ClientForm({ open, onOpenChange, client, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    company_name: "",
    domain: "",
    logo_url: "",
    primary_color: "#4F46E5",
    chatbot_greeting: "Hi! How can I help you today?",
    chatbot_position: "bottom-right",
    confidence_threshold: 0.7,
    is_active: true
  });

  useEffect(() => {
    if (client) {
      setFormData({
        company_name: client.company_name || "",
        domain: client.domain || "",
        logo_url: client.logo_url || "",
        primary_color: client.primary_color || "#4F46E5",
        chatbot_greeting: client.chatbot_greeting || "Hi! How can I help you today?",
        chatbot_position: client.chatbot_position || "bottom-right",
        confidence_threshold: client.confidence_threshold || 0.7,
        is_active: client.is_active ?? true
      });
    } else {
      setFormData({
        company_name: "",
        domain: "",
        logo_url: "",
        primary_color: "#4F46E5",
        chatbot_greeting: "Hi! How can I help you today?",
        chatbot_position: "bottom-right",
        confidence_threshold: 0.7,
        is_active: true
      });
    }
  }, [client, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit' : 'Add'} Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                placeholder="Acme Corp"
                required
              />
            </div>
            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData({...formData, domain: e.target.value})}
                placeholder="acme.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              value={formData.logo_url}
              onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <Label htmlFor="primary_color">Primary Brand Color</Label>
            <div className="flex gap-2">
              <Input
                id="primary_color"
                type="color"
                value={formData.primary_color}
                onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                className="w-20 h-10"
              />
              <Input
                value={formData.primary_color}
                onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                placeholder="#4F46E5"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="chatbot_greeting">Chatbot Greeting</Label>
            <Textarea
              id="chatbot_greeting"
              value={formData.chatbot_greeting}
              onChange={(e) => setFormData({...formData, chatbot_greeting: e.target.value})}
              placeholder="Hi! How can I help you today?"
              rows={2}
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
              {client ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
