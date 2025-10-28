import React from "react";
import { Card, CardContent } from "../ui/card";
import { Building2, CheckCircle, Globe } from "lucide-react";

export default function ClientsStats({ clients }) {
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.is_active).length,
    domains: new Set(clients.map(c => c.domain)).size
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Clients</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Clients</p>
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
              <p className="text-sm font-medium text-slate-600">Unique Domains</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stats.domains}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
