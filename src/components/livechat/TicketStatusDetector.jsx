import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { base44 } from '../../api/base44Client';

// Ticket ID pattern: TKT-00001, TKT-xxxxx format
const TICKET_ID_PATTERN = /TKT-\d{5}/gi;

export default function TicketStatusDetector({ messageText, customerEmail, customerName, conversationId }) {
  const [ticketInfo, setTicketInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log('🎫 TicketStatusDetector mounted/updated:', {
    hasMessage: !!messageText,
    hasEmail: !!customerEmail,
    messagePreview: messageText?.substring(0, 50)
  });

  useEffect(() => {
    const detectAndFetchTicket = async () => {
      if (!messageText) {
        console.log('❌ No messageText');
        setTicketInfo(null);
        return;
      }

      // Check if message contains ticket ID
      const ticketMatches = messageText.match(TICKET_ID_PATTERN);
      console.log('🔍 Pattern match result:', { pattern: TICKET_ID_PATTERN, matches: ticketMatches, text: messageText });
      
      if (!ticketMatches) {
        console.log('❌ No ticket matches found');
        setTicketInfo(null);
        return;
      }

      const ticketId = ticketMatches[0].toUpperCase();
      console.log('✅ Ticket detected:', ticketId);
      
      setLoading(true);
      setError(null);

      try {
        console.log('🎫 Fetching ticket:', ticketId, 'for customer:', customerEmail);
        
        if (!customerEmail) {
          console.error('❌ No customer email provided!');
          setError('Customer email not available');
          setLoading(false);
          return;
        }
        
        // Fetch tickets with customer email filter
        console.log('📡 Making API call to:', `/entities/ticket?customer_email=${customerEmail}`);
        const allTickets = await base44.entities.Ticket.list({
          customer_email: customerEmail
        });
        
        console.log('📊 API Response - Tickets found:', allTickets?.length || 0, allTickets);
        
        if (!allTickets || allTickets.length === 0) {
          console.error('❌ No tickets found for email:', customerEmail);
          setError(`No tickets found for ${customerEmail}`);
          setTicketInfo(null);
          setLoading(false);
          return;
        }
        
        // Find ticket with matching ID
        const foundTicket = allTickets?.find(t => {
          console.log(`  Comparing: ${t.ticket_number} === ${ticketId} ?`, t.ticket_number === ticketId);
          return t.ticket_number === ticketId;
        });

        console.log('🔍 Ticket search result:', { searching: ticketId, found: !!foundTicket, ticket: foundTicket });

        if (!foundTicket) {
          console.error(`❌ Ticket ${ticketId} not found in list:`, allTickets.map(t => t.ticket_number));
          setError(`Ticket ${ticketId} not found for your account`);
          setTicketInfo(null);
          setLoading(false);
          return;
        }

        console.log('✅ TICKET FOUND!', foundTicket);
        setTicketInfo(foundTicket);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching ticket:', err);
        setError('Unable to fetch ticket details: ' + err.message);
        setTicketInfo(null);
      } finally {
        setLoading(false);
      }
    };

    detectAndFetchTicket();
  }, [messageText, customerEmail]);

  if (!ticketInfo && !loading && !error) {
    return null;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'bg-green-50 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'open':
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mx-4 my-3 animate-pulse">
        <p className="text-sm text-blue-600">🔍 Fetching ticket details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4 my-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">❌ {error}</p>
            <p className="text-xs text-red-600 mt-1">
              This ticket either doesn't exist or doesn't belong to your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!ticketInfo) {
    return null;
  }

  return (
    <div className={`border rounded-lg p-4 mx-4 my-3 ${getStatusColor(ticketInfo.status)}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {getStatusIcon(ticketInfo.status)}
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 text-sm">
              📋 Ticket #{ticketInfo.ticket_number}
            </h3>
            <p className="text-xs text-slate-600 mt-1">{ticketInfo.title}</p>
          </div>
        </div>
      </div>

      {/* Status and Priority Badges */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusBadgeColor(ticketInfo.status)}`}>
          ✅ {(ticketInfo.status || 'open').toUpperCase()}
        </span>
        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(ticketInfo.priority)}`}>
          ⭐ {(ticketInfo.priority || 'medium').toUpperCase()}
        </span>
        {ticketInfo.category && (
          <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
            📂 {ticketInfo.category}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
        <div>
          <span className="text-slate-600">👤 Name:</span>
          <p className="font-semibold text-slate-900">{ticketInfo.customer_name || 'Not specified'}</p>
        </div>
        <div>
          <span className="text-slate-600">📅 Created:</span>
          <p className="font-semibold text-slate-900">
            {ticketInfo.createdAt ? new Date(ticketInfo.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* Description */}
      {ticketInfo.description && (
        <div className="bg-white/60 rounded p-2 mb-3">
          <p className="text-xs text-slate-700 line-clamp-2">{ticketInfo.description}</p>
        </div>
      )}

      {/* Status Message */}
      <div className="text-xs text-slate-600 pt-2 border-t border-current/20">
        {ticketInfo.status === 'resolved' || ticketInfo.status === 'closed' ? (
          <p>✅ <strong>Your ticket has been resolved!</strong> Thank you for contacting us.</p>
        ) : ticketInfo.status === 'in_progress' ? (
          <p>⏳ <strong>Your ticket is being worked on.</strong> We'll update you soon.</p>
        ) : (
          <p>📝 <strong>Your ticket is in our queue.</strong> We'll get to it as soon as possible.</p>
        )}
      </div>

      {/* View Full Details Link */}
      <a
        href={`${window.location.origin}/track-ticket`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 hover:text-blue-700 underline mt-2 inline-block"
      >
        📌 View full ticket details
      </a>
    </div>
  );
}
