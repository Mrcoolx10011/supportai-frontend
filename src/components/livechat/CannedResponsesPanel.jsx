import React, { useState } from "react";
import { base44 } from "../../api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Search, Zap } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

export default function CannedResponsesPanel({ clientId, onSelect }) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: responses } = useQuery({
    queryKey: ['cannedResponses'],
    queryFn: async () => {
      try {
        return await base44.entities.CannedResponse.filter({ 
          is_active: true 
        }, '-usage_count');
      } catch (error) {
        console.log('Failed to load canned responses:', error);
        return []; // Return empty array if auth fails
      }
    },
    initialData: [],
    retry: 3,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const filteredResponses = responses.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.shortcut?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = async (response) => {
    onSelect(response.content);
    // Try to increment usage count
    try {
      await base44.entities.CannedResponse.update(response.id, {
        usage_count: (response.usage_count || 0) + 1
      });
    } catch (error) {
      console.log('Failed to update usage count:', error);
      // Continue anyway - the response was selected successfully
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Zap className="w-4 h-4 mr-2" />
          Quick Replies
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search quick replies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>
        <ScrollArea className="h-80">
          <div className="p-2">
            {filteredResponses.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No quick replies found
              </div>
            ) : (
              filteredResponses.map((response) => (
                <button
                  key={response.id}
                  onClick={() => handleSelect(response)}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors mb-1"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-slate-900">
                      {response.title}
                    </span>
                    {response.shortcut && (
                      <Badge variant="outline" className="text-xs">
                        {response.shortcut}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {response.content}
                  </p>
                  {response.category && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      {response.category}
                    </Badge>
                  )}
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
