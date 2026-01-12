import React from "react";
import { base44 } from "../api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Users,
  MessageSquare,
  ThumbsUp
} from "lucide-react";

import StatsGrid from "../components/dashboard/StatsGrid";
import RecentTickets from "../components/dashboard/RecentTickets";
import ResponseTimeChart from "../components/dashboard/ResponseTimeChart";
import SatisfactionChart from "../components/dashboard/SatisfactionChart";
import AgentPerformance from "../components/dashboard/AgentPerformance";

export default function Dashboard() {
  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ['allTickets'],
    queryFn: () => base44.entities.Ticket.list('-created_date'),
    enabled: base44.isReady && !!base44.token,
    retry: 3,
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => base44.entities.ChatConversation.list('-created_date'),
    enabled: base44.isReady && !!base44.token,
    retry: 3,
  });

  const stats = React.useMemo(() => {
    const totalConversations = conversations.length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
    const avgResponseTime = tickets.reduce((acc, t) => acc + (t.first_response_time || 0), 0) / (tickets.length || 1);
    const avgSatisfaction = tickets.filter(t => t.satisfaction_rating).reduce((acc, t) => acc + t.satisfaction_rating, 0) / (tickets.filter(t => t.satisfaction_rating).length || 1);
    const automatedResolutions = conversations.filter(c => c.is_resolved && c.status === 'bot_active').length;
    const automationRate = totalConversations > 0 ? (automatedResolutions / totalConversations * 100) : 0;

    return {
      totalConversations,
      resolvedTickets,
      avgResponseTime: Math.round(avgResponseTime / 60),
      avgSatisfaction: avgSatisfaction.toFixed(1),
      automationRate: automationRate.toFixed(1),
      openTickets: tickets.filter(t => t.status === 'open').length,
    };
  }, [tickets, conversations]);

  const statsData = [
    {
      title: "Total Conversations",
      value: stats.totalConversations,
      icon: MessageSquare,
      color: "indigo",
      trend: "+12% from last week"
    },
    {
      title: "Avg Response Time",
      value: `${stats.avgResponseTime}m`,
      icon: Clock,
      color: "blue",
      trend: "80% reduction achieved"
    },
    {
      title: "Resolved Tickets",
      value: stats.resolvedTickets,
      icon: CheckCircle,
      color: "green",
      trend: `${stats.openTickets} still open`
    },
    {
      title: "Automation Rate",
      value: `${stats.automationRate}%`,
      icon: TrendingUp,
      color: "purple",
      trend: "Target: 60%"
    },
    {
      title: "Customer Satisfaction",
      value: `${stats.avgSatisfaction}/5`,
      icon: ThumbsUp,
      color: "orange",
      trend: "95% satisfaction rate"
    },
    {
      title: "Active Agents",
      value: "8",
      icon: Users,
      color: "pink",
      trend: "All agents online"
    }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
          <p className="text-slate-600">Monitor your customer support performance in real-time</p>
        </div>

        <StatsGrid stats={statsData} isLoading={ticketsLoading} />

        <div className="grid lg:grid-cols-2 gap-6">
          <ResponseTimeChart tickets={tickets} />
          <SatisfactionChart tickets={tickets} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentTickets tickets={tickets.slice(0, 10)} isLoading={ticketsLoading} />
          </div>
          <AgentPerformance />
        </div>
      </div>
    </div>
  );
}