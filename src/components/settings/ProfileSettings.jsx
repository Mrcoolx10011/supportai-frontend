import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Save, Upload } from "lucide-react";

export default function ProfileSettings({ user, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    full_name: "",
    avatar_url: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        avatar_url: user.avatar_url || ""
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-slate-200">
              <AvatarImage src={formData.avatar_url} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-2xl">
                {formData.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Button type="button" variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              placeholder="Your name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="mt-1 bg-slate-50"
            />
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
          </div>

          <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
