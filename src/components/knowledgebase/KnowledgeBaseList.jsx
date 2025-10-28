import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Edit, Trash2, TrendingUp } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function KnowledgeBaseList({ items, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <div className="grid gap-4">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-slate-500">No knowledge base items found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">{item.question}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{item.answer}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.category && (
                    <Badge variant="outline" className="capitalize">
                      {item.category}
                    </Badge>
                  )}
                  {item.usage_count > 0 && (
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>Used {item.usage_count} times</span>
                    </div>
                  )}
                  <Badge className={item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
