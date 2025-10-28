import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Info, Zap, Copy } from "lucide-react";
import { Button } from "../ui/button";

const sampleResponses = [
  {
    title: "Welcome Message",
    shortcut: "/welcome",
    content: "Hello! Welcome to our support team. I'm here to help you with any questions or issues you may have. How can I assist you today?",
    category: "Greetings"
  },
  {
    title: "Account Information Request",
    shortcut: "/account",
    content: "I'd be happy to help you with your account. For security purposes, could you please provide me with your registered email address and the last 4 digits of your phone number?",
    category: "Security"
  },
  {
    title: "Password Reset Instructions",
    shortcut: "/password",
    content: "To reset your password, please follow these steps:\n1. Go to our login page\n2. Click on 'Forgot Password?'\n3. Enter your registered email address\n4. Check your email for reset instructions",
    category: "Technical"
  },
  {
    title: "Billing Inquiry",
    shortcut: "/billing",
    content: "I understand you have questions about your billing. I'd be happy to review your account and help clarify any charges.",
    category: "Billing"
  },
  {
    title: "Closing Message",
    shortcut: "/close",
    content: "Is there anything else I can help you with today? Thank you for choosing our support team!",
    category: "Closing"
  }
];

const categories = [
  { name: "Greetings", color: "bg-green-100 text-green-700", count: 3 },
  { name: "Technical", color: "bg-blue-100 text-blue-700", count: 4 },
  { name: "Billing", color: "bg-yellow-100 text-yellow-700", count: 2 },
  { name: "Security", color: "bg-red-100 text-red-700", count: 2 },
  { name: "Information", color: "bg-purple-100 text-purple-700", count: 3 },
  { name: "Closing", color: "bg-gray-100 text-gray-700", count: 1 }
];

export default function CannedResponsesSamples() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Info className="w-5 h-5" />
            Sample Quick Replies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 mb-4">
            Here are some sample canned responses to get you started. You can use these as templates or create your own.
          </p>
          
          <div className="mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Available Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category.name} className={category.color}>
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-blue-900">Sample Responses:</h4>
            {sampleResponses.map((response, index) => (
              <div key={index} className="bg-white border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h5 className="font-medium text-gray-900">{response.title}</h5>
                    <Badge variant="outline" className="text-xs">
                      {response.shortcut}
                    </Badge>
                    <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                      {response.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(response.content)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {response.content.length > 150 
                    ? `${response.content.substring(0, 150)}...` 
                    : response.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-yellow-800">Quick Tips:</h5>
                <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                  <li>• Use shortcuts (like /welcome) for faster access</li>
                  <li>• Organize responses by category for better management</li>
                  <li>• Include variables {'{customer_name}'} for personalization</li>
                  <li>• Keep responses professional but friendly</li>
                  <li>• Update responses based on usage patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}