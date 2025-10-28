import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, TrendingUp, Clock, ThumbsUp, Users, MessageSquare, Ticket } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, subDays } from "date-fns";

const COLORS = ['#4F46E5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics() {
  const [dateRange, setDateRange] = useState(7);

  const { data: tickets } = useQuery({
    queryKey: ['analyticsTickets'],
    queryFn: () => base44.entities.Ticket.list('-created_date'),
    initialData: [],
  });

  const { data: conversations } = useQuery({
    queryKey: ['analyticsConversations'],
    queryFn: () => base44.entities.ChatConversation.list('-created_date'),
    initialData: [],
  });

  const { data: surveys } = useQuery({
    queryKey: ['csatSurveys'],
    queryFn: () => base44.entities.CSATSurvey.list('-created_date'),
    initialData: [],
  });

  // Calculate metrics
  const metrics = React.useMemo(() => {
    const avgResponseTime = tickets.reduce((acc, t) => acc + (t.first_response_time || 0), 0) / (tickets.length || 1);
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
    const resolutionRate = (resolvedTickets / (tickets.length || 1)) * 100;
    const avgSatisfaction = surveys.reduce((acc, s) => acc + s.rating, 0) / (surveys.length || 1);
    const automatedChats = conversations.filter(c => c.status === 'bot_active' && c.is_resolved).length;
    const automationRate = (automatedChats / (conversations.length || 1)) * 100;

    return {
      avgResponseTime: Math.round(avgResponseTime / 60),
      resolutionRate: resolutionRate.toFixed(1),
      avgSatisfaction: avgSatisfaction.toFixed(1),
      automationRate: automationRate.toFixed(1),
      totalTickets: tickets.length,
      totalConversations: conversations.length,
    };
  }, [tickets, conversations, surveys]);

  // Tickets over time
  const ticketsOverTime = React.useMemo(() => {
    const days = Array.from({ length: dateRange }, (_, i) => {
      const date = subDays(new Date(), dateRange - 1 - i);
      return format(date, 'yyyy-MM-dd');
    });

    return days.map(date => {
      const dayTickets = tickets.filter(t => 
        format(new Date(t.created_date), 'yyyy-MM-dd') === date
      );
      return {
        date: format(new Date(date), 'MMM d'),
        tickets: dayTickets.length,
        resolved: dayTickets.filter(t => t.status === 'resolved').length
      };
    });
  }, [tickets, dateRange]);

  // Category distribution
  const categoryData = React.useMemo(() => {
    const categories = tickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  // Satisfaction ratings
  const satisfactionData = React.useMemo(() => {
    const ratings = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
    surveys.forEach(survey => {
      const rating = Math.round(survey.rating);
      ratings[rating] = (ratings[rating] || 0) + 1;
    });

    return Object.entries(ratings).map(([rating, count]) => ({
      rating: `${rating} ⭐`,
      count
    }));
  }, [surveys]);

  const exportReport = () => {
    const reportData = {
      date: new Date().toISOString(),
      metrics,
      tickets: tickets.length,
      conversations: conversations.length,
      surveys: surveys.length
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `support-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-600 mt-1">Detailed insights into your support performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDateRange(7)}>7 Days</Button>
          <Button variant="outline" onClick={() => setDateRange(30)}>30 Days</Button>
          <Button onClick={exportReport} className="bg-indigo-600 hover:bg-indigo-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.avgResponseTime}m</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  12% faster
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ThumbsUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.avgSatisfaction}/5</p>
                <p className="text-xs text-slate-600 mt-1">{metrics.resolutionRate}% resolution rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Automation Rate</p>
                <p className="text-2xl font-bold text-slate-900">{metrics.automationRate}%</p>
                <p className="text-xs text-slate-600 mt-1">{metrics.totalConversations} total chats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Volume Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ticketsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tickets" stroke="#4F46E5" strokeWidth={2} name="Total Tickets" />
                  <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Satisfaction Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={satisfactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="rating" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}