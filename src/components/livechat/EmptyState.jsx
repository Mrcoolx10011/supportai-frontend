import React from "react";
import { MessageSquare } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Conversation Selected</h3>
        <p className="text-slate-600">Select a conversation from the list to start chatting</p>
      </div>
    </div>
  );
}
