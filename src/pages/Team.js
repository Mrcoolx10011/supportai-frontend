import React, { useState, useEffect } from "react";
import { base44 } from "../api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Plus, Mail, UserPlus, Trash2, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export default function Team() {
  const [showDialog, setShowDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    user_email: "",
    role: "agent",
    client_id: "demo-client",
    max_concurrent_chats: 5
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => base44.entities.TeamMember.list('-created_date'),
    initialData: [],
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Create team member
      await base44.entities.TeamMember.create(data);
      
      // Send invitation email
      await base44.integrations.Core.SendEmail({
        to: data.user_email,
        subject: "You've been invited to join the support team!",
        body: `Hello,\n\nYou've been invited to join our customer support team as a ${data.role}.\n\nPlease sign up at: ${window.location.origin}\n\nBest regards,\nSupport Team`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
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
    mutationFn: (id) => base44.entities.TeamMember.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] });
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
                  {teamMembers.filter(m => m.availability_status === 'online').length}
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
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Loading...</div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500">No team members yet</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-semibold">
                        {member.user_email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900">{member.user_email}</p>
                        <Badge className={roleColors[member.role]}>
                          {member.role}
                        </Badge>
                        <Badge className={statusColors[member.availability_status]}>
                          {member.availability_status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span>Max chats: {member.max_concurrent_chats}</span>
                        <span>•</span>
                        <span>Active: {member.current_active_chats || 0}</span>
                        {member.specialties && member.specialties.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{member.specialties.join(', ')}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {currentUser?.role === 'admin' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(member.id)}
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