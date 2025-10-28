import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";

const mockAgents = [
  { name: "Sarah Johnson", avatar: null, tickets: 24, rating: 4.9, status: "online" },
  { name: "Mike Chen", avatar: null, tickets: 21, rating: 4.8, status: "online" },
  { name: "Emma Davis", avatar: null, tickets: 19, rating: 4.7, status: "busy" },
  { name: "Alex Martinez", avatar: null, tickets: 16, rating: 4.6, status: "online" }
];

export default function AgentPerformance() {
  return (
    <Card className="shadow-lg border-none">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl">Top Agents</CardTitle>
        <p className="text-sm text-slate-600">This week's performance</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {mockAgents.map((agent, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-indigo-100">
                  <AvatarImage src={agent.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-semibold">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900">{agent.name}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span>{agent.tickets} tickets</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{agent.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Badge className={agent.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                {agent.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
