import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Clock, Mail } from 'lucide-react';
import { base44 } from '../../api/base44Client';

export default function CustomerTicketTracker() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticketNumber.trim() || !customerEmail.trim()) {
      setError('Please enter both Ticket ID and Email');
      return;
    }

    setLoading(true);
    setError('');
    setTicket(null);

    try {
      // Search for ticket by ticket_number and customer_email
      const response = await base44.entities.Ticket.list();
      const foundTicket = response?.find(
        t => t.ticket_number === ticketNumber.toUpperCase() && 
             t.customer_email?.toLowerCase() === customerEmail.toLowerCase()
      );

      if (foundTicket) {
        setTicket(foundTicket);
      } else {
        setError('No ticket found with the provided ID and email combination');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Error searching for ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'open':
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Track Your Support Ticket
          </h1>
          <p className="text-gray-600">
            Enter your ticket ID and email to check the status of your support request
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="ticketNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Reference ID
              </label>
              <input
                id="ticketNumber"
                type="text"
                placeholder="e.g., TKT-00001"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="customerEmail"
                type="email"
                placeholder="your@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Search size={20} />
              {loading ? 'Searching...' : 'Search Ticket'}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Ticket Details */}
        {ticket && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{ticket.title}</h2>
                  <div className="flex items-center gap-2 opacity-90">
                    <Mail size={16} />
                    <span>Reference: {ticket.ticket_number}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(ticket.status)}
                  <span className="text-lg font-semibold">{(ticket.status || 'open').toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-6 space-y-6">
              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(ticket.status)}`}>
                    {(ticket.status || 'open').toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">Priority</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(ticket.priority)}`}>
                    {(ticket.priority || 'medium').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Issue Details */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Issue Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">{ticket.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <p className="font-semibold text-gray-800">{ticket.category || 'General'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <p className="font-semibold text-gray-800">
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="w-1 h-12 bg-gray-200 my-2"></div>
                    </div>
                    <div className="pb-6">
                      <p className="font-semibold text-gray-800">Ticket Created</p>
                      <p className="text-sm text-gray-600">
                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {ticket.first_response_at && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="w-1 h-12 bg-gray-200 my-2"></div>
                      </div>
                      <div className="pb-6">
                        <p className="font-semibold text-gray-800">First Response</p>
                        <p className="text-sm text-gray-600">
                          {new Date(ticket.first_response_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {(ticket.status === 'resolved' || ticket.status === 'closed') && ticket.resolved_at && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Resolved</p>
                        <p className="text-sm text-gray-600">
                          {new Date(ticket.resolved_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <p className="font-semibold text-gray-800">{ticket.customer_name || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-semibold text-gray-800 break-all">{ticket.customer_email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> You will receive email updates about your ticket status. 
                  If you have questions, reply to the notification emails with your ticket reference ID.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Need immediate assistance? Contact us at support@supportai.com</p>
        </div>
      </div>
    </div>
  );
}
