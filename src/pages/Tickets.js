import React, { useState } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";

import TicketFilters from "../components/tickets/TicketFilters";
import TicketList from "../components/tickets/TicketList";
import TicketDetails from "../components/tickets/TicketDetails";
import CreateTicketDialog from "../components/tickets/CreateTicketDialog";

export default function Tickets() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', category: 'all' });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => base44.entities.Ticket.list('-created_date'),
    initialData: [],
  });

  const updateTicketMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Ticket.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const createTicketMutation = useMutation({
    mutationFn: (data) => base44.entities.Ticket.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setShowCreateDialog(false);
    },
  });

  const filteredTickets = tickets.filter(ticket => {
    const statusMatch = filters.status === 'all' || ticket.status === filters.status;
    const priorityMatch = filters.priority === 'all' || ticket.priority === filters.priority;
    const categoryMatch = filters.category === 'all' || ticket.category === filters.category;
    return statusMatch && priorityMatch && categoryMatch;
  });

  const handleUpdateTicket = (id, data) => {
    updateTicketMutation.mutate({ id, data });
  };

  const handleCreateTicket = (data) => {
    createTicketMutation.mutate(data);
  };

  return (
    <div className="h-full flex bg-slate-50">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Support Tickets</h2>
              <p className="text-slate-600 mt-1">{filteredTickets.length} tickets found</p>
            </div>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </div>
          <TicketFilters filters={filters} onFilterChange={setFilters} />
        </div>

        <div className="flex-1 overflow-auto p-6">
          <TicketList 
            tickets={filteredTickets}
            isLoading={isLoading}
            selectedTicket={selectedTicket}
            onSelectTicket={setSelectedTicket}
          />
        </div>
      </div>

      {selectedTicket && (
        <TicketDetails 
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={handleUpdateTicket}
        />
      )}

      <CreateTicketDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateTicket}
        isLoading={createTicketMutation.isPending}
      />
    </div>
  );
}