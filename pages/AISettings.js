import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Key, Bot, TestTube } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function AISettings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [testPrompt, setTestPrompt] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
      setApiKey(user.ai_api_key || "");
    };
    loadUser();
  }, []);

  const updateUserMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const handleSaveApiKey = () => {
    updateUserMutation.mutate({ ai_api_key: apiKey });
  };

  const handleTestAI = async () => {
    if (!testPrompt.trim()) return;
    
    setIsTesting(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: testPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" },
            confidence: { type: "number" }
          }
        }
      });
      setTestResult(result);
    } catch (error) {
      setTestResult({ error: error.message });
    }
    setIsTesting(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Configuration</h1>
        <p className="text-slate-600">Configure your AI assistant settings and API keys</p>
      </div>

      <Alert>
        <Bot className="w-4 h-4" />
        <AlertDescription>
          The system uses AI to automatically respond to customer queries. Configure your AI settings below.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            OpenAI API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="api_key">API Key</Label>
            <p className="text-sm text-slate-600 mb-2">
              Enter your OpenAI API key to enable AI-powered responses. Get your key from{" "}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                OpenAI Dashboard
              </a>
            </p>
            <Input
              id="api_key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="font-mono"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">How to get your API Key:</h4>
            <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://platform.openai.com/" target="_blank" className="text-indigo-600 hover:underline">platform.openai.com</a></li>
              <li>Sign in or create an account</li>
              <li>Navigate to API Keys section</li>
              <li>Click "Create new secret key"</li>
              <li>Copy and paste the key here</li>
            </ol>
          </div>

          <Button 
            onClick={handleSaveApiKey}
            disabled={updateUserMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save API Key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Test AI Response
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="test_prompt">Test Prompt</Label>
            <Textarea
              id="test_prompt"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="What are your business hours?"
              rows={3}
              className="mt-2"
            />
          </div>

          <Button 
            onClick={handleTestAI}
            disabled={isTesting || !testPrompt.trim()}
            variant="outline"
          >
            {isTesting ? "Testing..." : "Test AI Response"}
          </Button>

          {testResult && (
            <div className="mt-4">
              <Separator className="mb-4" />
              <h4 className="font-semibold mb-2">AI Response:</h4>
              {testResult.error ? (
                <Alert variant="destructive">
                  <AlertDescription>{testResult.error}</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-sm">{testResult.response}</p>
                  </div>
                  {testResult.confidence && (
                    <p className="text-sm text-slate-600">
                      Confidence: {(testResult.confidence * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Behavior Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Configure how the AI assistant behaves when interacting with customers.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label>Response Style</Label>
              <p className="text-sm text-slate-600">Professional, friendly, and helpful</p>
            </div>

            <Separator />

            <div>
              <Label>Automatic Handoff</Label>
              <p className="text-sm text-slate-600">
                AI will automatically transfer to human agent when confidence is below {currentUser?.client_id ? "70%" : "the configured threshold"}
              </p>
            </div>

            <Separator />

            <div>
              <Label>Knowledge Base Integration</Label>
              <p className="text-sm text-slate-600">
                AI uses your knowledge base to answer questions accurately
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span>•</span>
              <span>Keep your API key secure and never share it publicly</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Add comprehensive knowledge base items for better AI responses</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Monitor AI confidence scores in the analytics dashboard</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Test the AI regularly with common customer questions</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}