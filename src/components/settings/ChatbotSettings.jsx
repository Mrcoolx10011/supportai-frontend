import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Save } from "lucide-react";

export default function ChatbotSettings({ client, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    chatbot_greeting: "",
    primary_color: "#4F46E5",
    chatbot_position: "bottom-right"
  });

  useEffect(() => {
    if (client) {
      setFormData({
        chatbot_greeting: client.chatbot_greeting || "",
        primary_color: client.primary_color || "#4F46E5",
        chatbot_position: client.chatbot_position || "bottom-right"
      });
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbot Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="greeting">Welcome Message</Label>
            <Textarea
              id="greeting"
              value={formData.chatbot_greeting}
              onChange={(e) => setFormData({...formData, chatbot_greeting: e.target.value})}
              placeholder="Hi! How can I help you today?"
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="color">Primary Color</Label>
            <div className="flex gap-3 mt-1">
              <Input
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
            <Label htmlFor="position">Widget Position</Label>
            <Select 
              value={formData.chatbot_position}
              onValueChange={(value) => setFormData({...formData, chatbot_position: value})}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
