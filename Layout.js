import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./src/utils";
import { base44 } from "./src/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Ticket,
  MessageSquare,
  BookOpen,
  Building2,
  Settings,
  Bot,
  LogOut,
  Bell,
  ChevronDown,
  Code,
  Sparkles,
  Users,
  TrendingUp
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "./src/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./src/components/ui/dropdown-menu";
import { Badge } from "./src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./src/components/ui/avatar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Tickets",
    url: createPageUrl("Tickets"),
    icon: Ticket,
  },
  {
    title: "Live Chat",
    url: createPageUrl("LiveChat"),
    icon: MessageSquare,
  },
  {
    title: "Knowledge Base",
    url: createPageUrl("KnowledgeBase"),
    icon: BookOpen,
  },
  {
    title: "Quick Replies",
    url: createPageUrl("CannedResponses"),
    icon: Sparkles,
  },
  {
    title: "Team",
    url: createPageUrl("Team"),
    icon: Users,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: TrendingUp,
  },
  {
    title: "Integration",
    url: createPageUrl("Integration"),
    icon: Code,
  },
  {
    title: "AI Settings",
    url: createPageUrl("AISettings"),
    icon: Sparkles,
  },
  {
    title: "Clients",
    url: createPageUrl("Clients"),
    icon: Building2,
    adminOnly: true,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName, user: propUser, onLogout }) {
  // CRITICAL: Return ONLY children for ChatWidget - no layout at all
  if (currentPageName === "ChatWidget") {
    return children;
  }

  const location = useLocation();
  const [user, setUser] = useState(propUser || null);

  const { data: openTicketsCount } = useQuery({
    queryKey: ['openTickets'],
    queryFn: async () => {
      const tickets = await base44.entities.Ticket.filter({ status: 'open' });
      return tickets.length;
    },
    refetchInterval: 30000,
    initialData: 0,
  });

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    } else {
      const loadUser = async () => {
        try {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
        } catch (error) {
          console.error("Error loading user:", error);
        }
      };
      loadUser();
    }
  }, [propUser]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      base44.auth.logout();
    }
  };

  const filteredNavItems = navigationItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary: 239 84% 60%;
          --primary-foreground: 0 0% 100%;
          --secondary: 240 4.8% 95.9%;
          --accent: 240 4.8% 95.9%;
          --muted: 240 4.8% 95.9%;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <Sidebar className="border-r border-slate-200/60 shadow-sm">
          <SidebarHeader className="border-b border-slate-200/60 p-6 bg-gradient-to-r from-indigo-600 to-indigo-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-bold text-white text-lg tracking-tight">SupportAI</h2>
                <p className="text-xs text-indigo-200">Customer Support Hub</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredNavItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`
                            transition-all duration-200 rounded-xl mb-1 group
                            ${isActive 
                              ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                              : 'hover:bg-slate-50 text-slate-700'
                            }
                          `}
                        >
                          <Link to={item.url} className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-3">
                              <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                              <span className="font-medium">{item.title}</span>
                            </div>
                            {item.title === "Tickets" && openTicketsCount > 0 && (
                              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                                {openTicketsCount}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Open Tickets</span>
                    <span className="font-semibold text-indigo-600">{openTicketsCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Status</span>
                    <Badge className="bg-green-100 text-green-700 text-xs border-green-200">
                      Online
                    </Badge>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full focus:outline-none">
                  <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <Avatar className="w-10 h-10 border-2 border-indigo-100">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-semibold">
                        {user.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{user.full_name || 'User'}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
            <SidebarTrigger className="md:hidden hover:bg-slate-100 p-2 rounded-lg transition-colors" />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-900">{currentPageName}</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}