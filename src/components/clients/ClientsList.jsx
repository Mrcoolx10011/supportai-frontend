import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Edit, Trash2, Globe } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function ClientsList({ clients, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-slate-500">No clients found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <AnimatePresence>
        {clients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="w-16 h-16 border-2 border-slate-100">
                      <AvatarImage src={client.logo_url} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-xl font-bold">
                        {client.company_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-xl text-slate-900 mb-1">{client.company_name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                        <Globe className="w-4 h-4" />
                        <span>{client.domain}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={client.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
                          {client.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" style={{ backgroundColor: `${client.primary_color}20`, color: client.primary_color }}>
                          Brand Color
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(client)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(client.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
