import React, { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function CreateTicketFromChatDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isLoading,
  conversation,
  currentUser
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    priority: "medium"
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState(null);
  const [error, setError] = useState(null);

  // Pre-fill form when conversation changes
  React.useEffect(() => {
    if (conversation && open) {
      setFormData({
        title: `Support Issue from ${conversation.customer_name || 'Customer'}`,
        description: `Chat Conversation: ${conversation.id}\n\nCustomer: ${conversation.customer_name}\nEmail: ${conversation.customer_email}\n\nIssue: [Describe the issue based on chat conversation]`,
        category: "general",
        priority: "medium"
      });
      setShowSuccess(false);
      setCreatedTicketId(null);
    }
  }, [conversation, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Create Ticket button clicked');
    setError(null);
    
    const ticketData = {
      title: formData.title,
      description: formData.description,
      customer_name: conversation?.customer_name || "Unknown",
      customer_email: conversation?.customer_email || "",
      category: formData.category,
      priority: formData.priority,
      client_id: conversation?.client_id || "demo-client",
      conversation_id: conversation?.id, // Link to conversation
      created_by: currentUser?.id || currentUser?.userId, // Add current user
      assigned_to: currentUser?.id || currentUser?.userId, // Assign to current agent
      status: 'open'
    };

    console.log('📤 Sending ticket data:', ticketData);

    try {
      const result = await onSubmit(ticketData);
      console.log('✅ Ticket created successfully:', result);
      console.log('✅ Ticket Number:', result?.ticket_number);
      console.log('✅ Customer Name:', result?.customer_name);
      console.log('✅ Customer Email:', result?.customer_email);
      
      // Show success message with ticket ID
      setShowSuccess(true);
      setCreatedTicketId(result?.ticket_number || result?.id || result?._id);
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        onOpenChange(false);
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('❌ Error creating ticket:', error);
      let errorMessage = error.message || 'Failed to create ticket. Please try again.';
      
      // Handle specific error messages
      if (error.message?.includes('Duplicate')) {
        errorMessage = 'A ticket with this information already exists. Please check if you already created a ticket for this customer.';
      } else if (error.message?.includes('Validation')) {
        errorMessage = 'Please fill in all required fields correctly.';
      }
      
      setError(errorMessage);
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">✨ Ticket Created!</h2>
            {createdTicketId && (
              <div className="bg-slate-50 rounded-lg p-3 w-full mb-4">
                <p className="text-xs text-slate-600 mb-1">Ticket ID:</p>
                <p className="text-sm font-mono font-semibold text-indigo-600 break-all">{createdTicketId}</p>
              </div>
            )}
            <p className="text-sm text-slate-600 text-center">
              The ticket has been created and linked to this conversation.
            </p>
            <Button 
              onClick={() => {
                onOpenChange(false);
                setShowSuccess(false);
              }}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <p className="text-sm text-slate-600 mt-2">
            From conversation with <span className="font-semibold">{conversation?.customer_name}</span>
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold">Ticket will be linked to this conversation</p>
              <p className="text-xs mt-1 opacity-90">Customer details will be pre-filled automatically.</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-semibold">Error</p>
                <p className="text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Customer Info (Read-only) */}
          <div className="bg-slate-50 rounded-lg p-3 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Customer Name</Label>
                <p className="font-semibold text-slate-900">{conversation?.customer_name || "Unknown"}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-600">Email</Label>
                <p className="font-semibold text-slate-900">{conversation?.customer_email || "—"}</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Ticket Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed explanation of the issue"
              className="h-28"
              required
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority}
                onValueChange={(value) => setFormData({...formData, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? "Creating..." : "Create Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
