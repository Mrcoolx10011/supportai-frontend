import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function TicketFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-4">
      <Tabs 
        value={filters.status} 
        onValueChange={(value) => onFilterChange({ ...filters, status: value })}
      >
        <TabsList className="bg-slate-100">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      <Select 
        value={filters.priority}
        onValueChange={(value) => onFilterChange({ ...filters, priority: value })}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.category}
        onValueChange={(value) => onFilterChange({ ...filters, category: value })}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="billing">Billing</SelectItem>
          <SelectItem value="technical">Technical</SelectItem>
          <SelectItem value="product">Product</SelectItem>
          <SelectItem value="account">Account</SelectItem>
          <SelectItem value="general">General</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
