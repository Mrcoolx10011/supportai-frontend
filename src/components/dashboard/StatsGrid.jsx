import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { TrendingUp } from "lucide-react";

export default function StatsGrid({ stats, isLoading }) {
  const colorClasses = {
    indigo: "bg-indigo-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500"
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className={`absolute top-0 right-0 w-32 h-32 ${colorClasses[stat.color]} opacity-10 rounded-full transform translate-x-12 -translate-y-12`} />
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[stat.color]} bg-opacity-20`}>
                  <stat.icon className={`w-6 h-6 ${colorClasses[stat.color].replace('bg-', 'text-')}`} />
                </div>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span>{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
