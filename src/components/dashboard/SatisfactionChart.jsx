import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];

export default function SatisfactionChart({ tickets }) {
  const data = React.useMemo(() => {
    const ratings = {  '5 Stars': 0, '4 Stars': 0, '3 Stars': 0, '2 Stars': 0, '1 Star': 0 };
    
    tickets.forEach(ticket => {
      if (ticket.satisfaction_rating) {
        const stars = Math.round(ticket.satisfaction_rating);
        ratings[`${stars} Star${stars > 1 ? 's' : ''}`]++;
      }
    });

    return Object.entries(ratings)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [tickets]);

  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl">Customer Satisfaction</CardTitle>
        <p className="text-sm text-slate-600">Distribution of satisfaction ratings</p>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
