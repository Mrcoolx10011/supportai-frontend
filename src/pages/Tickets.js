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
    queryFn: async () => {
      console.log('🔍 Fetching tickets...');
      try {
        const response = await base44.entities.Ticket.list('-created_date');
        console.log('📋 Tickets response:', response);
        console.log('📋 Is array:', Array.isArray(response));
        console.log('📋 Count:', response?.length);
        return response;
      } catch (error) {
        console.error('❌ Ticket fetch error:', error);
        return [];
      }
    },
    initialData: [],
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });

  const updateTicketMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Ticket.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });

  const deleteTicketMutation = useMutation({
    mutationFn: (id) => base44.entities.Ticket.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setSelectedTicket(null);
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

  const handleDeleteTicket = (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      deleteTicketMutation.mutate(id);
    }
  };

  const handleShareTicket = async (ticket) => {
    const ticketInfo = `
📋 **Support Ticket Reference: ${ticket.ticket_number || ticket._id}**

✅ **Status:** ${(ticket.status || 'open').toUpperCase()}
⭐ **Priority:** ${(ticket.priority || 'medium').toUpperCase()}
📂 **Category:** ${ticket.category || 'general'}

📌 **Issue Title:** ${ticket.title}
👤 **Customer Name:** ${ticket.customer_name || 'Not specified'}
📧 **Email:** ${ticket.customer_email || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for contacting us! Your support ticket has been created and assigned to our support team. 

We will review your issue and get back to you as soon as possible.

**Please save this Reference ID for your records:**
🔖 **${ticket.ticket_number || ticket._id}**

You can use this ID to track the status of your ticket.
    `.trim();

    // Copy to clipboard
    navigator.clipboard.writeText(ticketInfo);
    console.log('✅ Ticket information copied to clipboard:', ticketInfo);
    alert('✅ Ticket information copied! You can now share it in the live chat.\n\n' + ticketInfo);
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
          onDelete={handleDeleteTicket}
          onShare={handleShareTicket}
          isDeleting={deleteTicketMutation.isPending}
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