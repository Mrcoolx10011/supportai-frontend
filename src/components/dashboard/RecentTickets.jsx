import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Clock } from "lucide-react";
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

export default function RecentTickets({ tickets, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl">Recent Tickets</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">{ticket.title}</h4>
                  <p className="text-sm text-slate-600">{ticket.customer_name} • {ticket.customer_email}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className={priorityColors[ticket.priority]}>
                    {ticket.priority}
                  </Badge>
                  <Badge className={statusColors[ticket.status]}>
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {ticket.created_date ? format(new Date(ticket.created_date), 'MMM d, h:mm a') : 'N/A'}
                </div>
                <div className="text-slate-400">•</div>
                <div>{ticket.category}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
