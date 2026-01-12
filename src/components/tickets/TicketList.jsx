import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Clock, User } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";

const priorityColors = {
  low: "bg-blue-100 text-blue-700 border-blue-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  critical: "bg-red-100 text-red-700 border-red-200"
};

const statusColors = {
  open: "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-100 text-blue-700",
  waiting_customer: "bg-purple-100 text-purple-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-slate-100 text-slate-600"
};

export default function TicketList({ tickets, isLoading, selectedTicket, onSelectTicket }) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-24 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-slate-500">No tickets found</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <AnimatePresence>
        {tickets.map((ticket) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card 
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedTicket?.id === ticket.id ? 'ring-2 ring-indigo-500 shadow-lg' : ''
              }`}
              onClick={() => onSelectTicket(ticket)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {ticket.ticket_number || 'TKT-00001'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">{ticket.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2">{ticket.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Badge variant="outline" className={priorityColors[ticket.priority]}>
                    {ticket.priority}
                  </Badge>
                  <Badge className={statusColors[ticket.status]}>
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                      {ticket.customer_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{ticket.customer_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {ticket.created_date ? format(new Date(ticket.created_date), 'MMM d, h:mm a') : 'N/A'}
                </div>
                <Badge variant="outline" className="capitalize">{ticket.category}</Badge>
                {ticket.assigned_to && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{typeof ticket.assigned_to === 'string' ? ticket.assigned_to.split('@')[0] : ticket.assigned_to?.email?.split('@')[0]}</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
