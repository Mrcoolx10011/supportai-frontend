import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { base44 } from './api/base44Client';
import Layout from './Layout';
import LoginPage from './components/LoginPage';
import CustomerTicketTracker from './components/tickets/CustomerTicketTracker';

// Import page components
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import LiveChat from './pages/LiveChat';
import KnowledgeBase from './pages/KnowledgeBase';
import CannedResponses from './pages/CannedResponses';
import Team from './pages/Team';
import Analytics from './pages/Analytics';
import Integration from './pages/Integration';
import AISettings from './pages/AISettings';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import ChatWidget from './pages/ChatWidget';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Check if this is a public route (no auth needed)
  const isChatWidget = location.pathname === '/chatwidget' || location.pathname === '/ChatWidget';
  const isPublicTicketTracker = location.pathname === '/track-ticket';
  const isPublicRoute = isChatWidget || isPublicTicketTracker;
  
  // Check authentication on app load (skip for public routes)
  useEffect(() => {
    if (isPublicRoute) {
      setLoading(false);
      return;
    }
    
    const checkAuth = async () => {
      try {
        if (base44.auth.isAuthenticated()) {
          const userData = await base44.auth.me();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid token
        base44.setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isPublicRoute]);

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await base44.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  // Extract page name from pathname
  const getPageName = (pathname) => {
    const path = pathname.replace('/', '');
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const currentPageName = getPageName(location.pathname);

  // Show loading spinner while checking authentication (skip for public routes)
  if (loading && !isPublicRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render public routes without authentication
  if (isPublicTicketTracker) {
    return <CustomerTicketTracker />;
  }

  // Render chat widget without authentication
  if (isChatWidget) {
    return <ChatWidget />;
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show main app if authenticated
  return (
    <Layout currentPageName={currentPageName} user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/livechat" element={<LiveChat />} />
        <Route path="/knowledgebase" element={<KnowledgeBase />} />
        <Route path="/cannedresponses" element={<CannedResponses />} />
        <Route path="/team" element={<Team />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/integration" element={<Integration />} />
        <Route path="/aisettings" element={<AISettings />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App;