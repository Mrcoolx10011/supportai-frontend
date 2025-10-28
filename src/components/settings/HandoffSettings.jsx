import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Save } from "lucide-react";

export default function HandoffSettings({ client, onSave, isLoading }) {
  const [threshold, setThreshold] = useState(0.7);

  useEffect(() => {
    if (client) {
      setThreshold(client.confidence_threshold || 0.7);
    }
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ confidence_threshold: threshold });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Handoff Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Confidence Threshold: {(threshold * 100).toFixed(0)}%</Label>
            <p className="text-sm text-slate-600 mb-4">
              Conversations below this confidence level will be transferred to human agents
            </p>
            <Slider
              value={[threshold]}
              onValueChange={(value) => setThreshold(value[0])}
              min={0.5}
              max={0.95}
              step={0.05}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>50%</span>
              <span>95%</span>
            </div>
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
