import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Mail, UserPlus, Trash2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Team() {
  console.log('🚀 Team component rendering');
  const [showDialog, setShowDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    user_email: "",
    role: "agent",
    client_id: "demo-client",
    max_concurrent_chats: 5
  });
  const queryClient = useQueryClient();

  console.log('📊 Current team members state:', teamMembers);

  // Load current user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await base44.auth.me();
        setCurrentUser(user);
      } catch (err) {
        console.error('Failed to load current user:', err);
      }
    };
    loadUser();
  }, []);

  // Load team members
  useEffect(() => {
    console.log('🔄 useEffect hook running - loading team members');
    const loadTeamMembers = async () => {
      try {
        setIsLoading(true);
        console.log('📋 About to call base44.entities.User.list()');
        const result = await base44.entities.User.list();
        console.log('✅ API call succeeded, result:', result);
        console.log('✅ Result is array?', Array.isArray(result));
        setTeamMembers(Array.isArray(result) ? result : []);
        console.log('✅ State updated with:', Array.isArray(result) ? result : []);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to fetch team members:', err);
        console.error('Error details:', { message: err.message, stack: err.stack });
        setError(err.message || 'Failed to load team members');
        setTeamMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeamMembers();
  }, []);

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Create team member
      await base44.entities.User.create(data);
    },
    onSuccess: async () => {
      // Reload team members
      const result = await base44.entities.User.list();
      setTeamMembers(Array.isArray(result) ? result : []);
      setShowDialog(false);
      setFormData({
        user_email: "",
        role: "agent",
        client_id: "demo-client",
        max_concurrent_chats: 5
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.User.delete(id),
    onSuccess: async () => {
      // Reload team members
      const result = await base44.entities.User.list();
      setTeamMembers(Array.isArray(result) ? result : []);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (confirm("Remove this team member?")) {
      deleteMutation.mutate(id);
    }
  };

  const statusColors = {
    online: "bg-green-100 text-green-700",
    offline: "bg-slate-100 text-slate-700",
    busy: "bg-yellow-100 text-yellow-700",
    away: "bg-orange-100 text-orange-700"
  };

  const roleColors = {
    agent: "bg-blue-100 text-blue-700",
    manager: "bg-purple-100 text-purple-700",
    admin: "bg-red-100 text-red-700"
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
          <p className="text-slate-600 mt-1">Manage your support team members</p>
        </div>
        {currentUser?.role === 'admin' && (
          <Button 
            onClick={() => setShowDialog(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Invite Team Member
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Members</p>
                <p className="text-2xl font-bold text-slate-900">{teamMembers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Online Now</p>
                <p className="text-2xl font-bold text-slate-900">
                  {teamMembers.filter(m => m.last_login && new Date(m.last_login) > new Date(Date.now() - 5*60000)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Agents</p>
                <p className="text-2xl font-bold text-slate-900">
                  {teamMembers.filter(m => m.role === 'agent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm"><strong>Error:</strong> {error.message || JSON.stringify(error)}</p>
            </div>
          )}
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No team members yet</p>
              <p className="text-slate-400 text-sm mt-2">teamMembers value: {JSON.stringify(teamMembers)}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {teamMembers.map((member) => (
                <div key={member._id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-semibold">
                        {member.full_name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900">{member.full_name}</p>
                        <Badge className={roleColors[member.role]}>
                          {member.role}
                        </Badge>
                        <Badge className={statusColors[member.status] || 'bg-slate-100 text-slate-700'}>
                          {member.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span>{member.email}</span>
                        <span>•</span>
                        <span>{new Date(member.last_login || member.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {currentUser?.role === 'admin' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(member._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.user_email}
                onChange={(e) => setFormData({...formData, user_email: e.target.value})}
                placeholder="agent@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select 
                value={formData.role}
                onValueChange={(value) => setFormData({...formData, role: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="max_chats">Maximum Concurrent Chats</Label>
              <Input
                id="max_chats"
                type="number"
                value={formData.max_concurrent_chats}
                onChange={(e) => setFormData({...formData, max_concurrent_chats: parseInt(e.target.value)})}
                min="1"
                max="20"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700"
                disabled={createMutation.isPending}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}