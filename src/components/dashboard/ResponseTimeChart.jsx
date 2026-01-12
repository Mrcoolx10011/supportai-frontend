import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ResponseTimeChart({ tickets }) {
  const data = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayTickets = tickets.filter(t => {
        if (!t.created_date) return false;
        try {
          return new Date(t.created_date).toISOString().split('T')[0] === date;
        } catch {
          return false;
        }
      });
      const avgTime = dayTickets.reduce((acc, t) => acc + (t.first_response_time || 0), 0) / (dayTickets.length || 1);
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        time: Math.round(avgTime / 60)
      };
    });
  }, [tickets]);

  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl">Response Time Trend</CardTitle>
        <p className="text-sm text-slate-600">Average first response time (minutes)</p>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="time" fill="#4F46E5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
