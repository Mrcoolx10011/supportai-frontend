import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { X, Send, User, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";

export default function TicketDetails({ ticket, onClose, onUpdate }) {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setStatus(ticket.status);
    setPriority(ticket.priority);
  }, [ticket]);

  const handleUpdate = () => {
    onUpdate(ticket.id, { 
      status, 
      priority,
      resolution_notes: notes || ticket.resolution_notes
    });
  };

  return (
    <div className="w-96 border-l border-slate-200 bg-white flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Ticket Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{ticket.title}</h3>
      </div>

      <ScrollArea className="flex-1">
        <CardContent className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Customer Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{ticket.customer_name}</span>
              </div>
              <div className="text-slate-600">{ticket.customer_email}</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Ticket Details</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="waiting_customer">Waiting Customer</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Priority</label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">Category</label>
                <p className="mt-1 text-sm text-slate-900 capitalize">{ticket.category}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(ticket.created_date), 'MMM d, yyyy h:mm a')}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Description</h4>
            <p className="text-sm text-slate-600">{ticket.description}</p>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900 mb-2 block">Resolution Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about ticket resolution..."
              className="h-24"
            />
          </div>
        </CardContent>
      </ScrollArea>

      <div className="p-6 border-t border-slate-200">
        <Button 
          className="w-full bg-indigo-600 hover:bg-indigo-700"
          onClick={handleUpdate}
        >
          <Send className="w-4 h-4 mr-2" />
          Update Ticket
        </Button>
      </div>
    </div>
  );
}
