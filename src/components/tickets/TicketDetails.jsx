import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { X, Send, User, Clock, Calendar, Trash2, Copy, Share2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";

export default function TicketDetails({ ticket, onClose, onUpdate, onDelete, isDeleting, onShare }) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setStatus(ticket.status);
    setPriority(ticket.priority);
  }, [ticket]);

  const handleUpdate = () => {
    onUpdate(ticket._id || ticket.id, { 
      status, 
      priority,
      resolution_notes: notes || ticket.resolution_notes
    });
  };

  const handleCopyTicketNumber = () => {
    navigator.clipboard.writeText(ticket.ticket_number || ticket._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-red-100 text-red-700',
      'in_progress': 'bg-blue-100 text-blue-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'resolved': 'bg-green-100 text-green-700',
      'closed': 'bg-slate-100 text-slate-700'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-blue-100 text-blue-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'high': 'bg-orange-100 text-orange-700',
      'urgent': 'bg-red-100 text-red-700'
    };
    return colors[priority] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="w-96 border-l border-slate-200 bg-white flex flex-col">
      {/* Header with Ticket Number */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xs font-semibold text-slate-500 uppercase">🎫 Ticket</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyTicketNumber}
                className="h-6 px-2 text-xs font-mono font-bold text-indigo-600 hover:bg-indigo-100"
              >
                {ticket.ticket_number || 'TKT-00001'}
                {copied ? <CheckCircle className="w-3 h-3 ml-1" /> : <Copy className="w-3 h-3 ml-1" />}
              </Button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{ticket.title}</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Status and Priority Badges */}
        <div className="flex gap-2 flex-wrap">
          <Badge className={`text-xs font-semibold ${getStatusColor(status)}`}>
            ● {status.replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge className={`text-xs font-semibold ${getPriorityColor(priority)}`}>
            ★ {priority.toUpperCase()}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <CardContent className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-3">👤 Customer Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-900 font-semibold">{ticket.customer_name}</span>
              </div>
              <div className="text-slate-600 ml-6 font-medium">{ticket.customer_email}</div>
              {ticket.conversation_id && (
                <div className="text-xs text-slate-500 ml-6 mt-2">
                  Linked to conversation: {ticket.conversation_id}
                </div>
              )}
            </div>
          </div>

          {/* Ticket Configuration */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="text-sm font-bold text-slate-900 mb-3">⚙️ Ticket Configuration</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">🔴 Open</SelectItem>
                    <SelectItem value="in_progress">🔵 In Progress</SelectItem>
                    <SelectItem value="pending">🟡 Pending</SelectItem>
                    <SelectItem value="resolved">🟢 Resolved</SelectItem>
                    <SelectItem value="closed">⚪ Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Priority</label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="mt-1 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🔵 Low</SelectItem>
                    <SelectItem value="medium">🟡 Medium</SelectItem>
                    <SelectItem value="high">🟠 High</SelectItem>
                    <SelectItem value="urgent">🔴 Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase">Category</label>
                <p className="mt-1 text-sm text-slate-900 font-semibold capitalize bg-white rounded px-3 py-2">{ticket.category}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600 pt-2 border-t border-blue-200">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{ticket.created_date && !isNaN(new Date(ticket.created_date)) ? format(new Date(ticket.created_date), 'MMM d, yyyy h:mm a') : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">📝 Issue Description</h4>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          {/* Resolution Notes */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">💬 Resolution Notes</h4>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add resolution notes, actions taken, and next steps..."
              className="h-24 resize-none"
            />
          </div>
        </CardContent>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="p-6 border-t border-slate-200 space-y-3 bg-slate-50">
        <Button 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          onClick={handleUpdate}
        >
          <Send className="w-4 h-4 mr-2" />
          💾 Update Ticket
        </Button>
        
        {onShare && (
          <Button 
            variant="outline"
            className="w-full font-semibold"
            onClick={() => onShare(ticket)}
          >
            <Share2 className="w-4 h-4 mr-2" />
            📤 Share with Customer
          </Button>
        )}

        {/* Customer Tracking Link */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-blue-700 mb-2">🔗 Customer Tracking Link</p>
          <a
            href={`${window.location.origin}/track-ticket`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-700 underline break-all"
          >
            {window.location.origin}/track-ticket
          </a>
          <p className="text-xs text-blue-600 mt-2">
            Customers can use this link to check ticket status with their email and ticket ID.
          </p>
        </div>
        
        <Button 
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
          onClick={() => onDelete(ticket._id || ticket.id)}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {isDeleting ? '⏳ Deleting...' : '🗑️ Delete Ticket'}
        </Button>
      </div>
    </div>
  );
}
