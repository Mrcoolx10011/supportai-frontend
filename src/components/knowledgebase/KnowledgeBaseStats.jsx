import React from "react";
import { Card, CardContent } from "../ui/card";
import { BookOpen, CheckCircle, TrendingUp } from "lucide-react";

export default function KnowledgeBaseStats({ items }) {
  const stats = {
    total: items.length,
    active: items.filter(i => i.is_active).length,
    totalUsage: items.reduce((acc, i) => acc + (i.usage_count || 0), 0)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Items</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Usage</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalUsage}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
