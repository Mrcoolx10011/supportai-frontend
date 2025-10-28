import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Code, Globe, Smartphone, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Integration() {
  const [copied, setCopied] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await base44.auth.me();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list('-created_date'),
    initialData: [],
  });

  useEffect(() => {
    if (clients.length > 0 && !selectedClient) {
      setSelectedClient(clients[0]);
    }
  }, [clients]);

  const widgetUrl = selectedClient 
    ? `${window.location.origin}/ChatWidget?client_id=${selectedClient.id}`
    : '';

  const embedCode = `<!-- SupportAI Chat Widget -->
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${widgetUrl}';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';
    iframe.style.zIndex = '999999';
    iframe.style.pointerEvents = 'none';
    iframe.style.background = 'transparent';
    iframe.setAttribute('allowtransparency', 'true');
    
    // Allow clicks on chat widget
    iframe.addEventListener('load', function() {
      iframe.style.pointerEvents = 'auto';
    });
    
    document.body.appendChild(iframe);
  })();
</script>`;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Website Integration</h1>
        <p className="text-slate-600">Add the AI chatbot to your website in minutes</p>
      </div>

      {currentUser?.role === 'admin' && clients.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {clients.map(client => (
                <Button
                  key={client.id}
                  variant={selectedClient?.id === client.id ? "default" : "outline"}
                  onClick={() => setSelectedClient(client)}
                  className="justify-start"
                >
                  <div className="w-8 h-8 rounded-full mr-2 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: client.primary_color }}
                  >
                    {client.company_name?.charAt(0)}
                  </div>
                  {client.company_name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <Globe className="w-4 h-4" />
        <AlertDescription>
          <strong>Your Website:</strong> https://www.wsevolves.com/
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="embed" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="embed">
            <Code className="w-4 h-4 mr-2" />
            Embed Code
          </TabsTrigger>
          <TabsTrigger value="iframe">
            <Globe className="w-4 h-4 mr-2" />
            iFrame
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile App
          </TabsTrigger>
        </TabsList>

        <TabsContent value="embed">
          <Card>
            <CardHeader>
              <CardTitle>Installation Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm">1</div>
                  Copy the embed code
                </h3>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm max-h-64">
                    <code>{embedCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(embedCode)}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm">2</div>
                  Add to your website
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Paste the code before the closing <code className="bg-slate-100 px-2 py-1 rounded">&lt;/body&gt;</code> tag in your HTML file.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>For wsevolves.com:</strong> Add this code to your website's footer template or main HTML file.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm">3</div>
                  Test the integration
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  Preview the chat widget before adding it to your live website.
                </p>
                <Button variant="outline" onClick={() => window.open(widgetUrl, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview Widget
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="iframe">
          <Card>
            <CardHeader>
              <CardTitle>iFrame Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Widget URL</Label>
                <div className="flex gap-2 mt-2">
                  <Input value={widgetUrl} readOnly className="font-mono text-sm" />
                  <Button onClick={() => handleCopy(widgetUrl)}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label>iFrame Code</Label>
                <div className="relative mt-2">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`<iframe 
  src="${widgetUrl}"
  style="position: fixed; bottom: 0; right: 0; width: 100vw; height: 100vh; border: none; z-index: 999999; pointer-events: none; background: transparent;"
  allowtransparency="true"
></iframe>`}</code>
                  </pre>
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(`<iframe src="${widgetUrl}" style="position: fixed; bottom: 0; right: 0; width: 100vw; height: 100vh; border: none; z-index: 999999; pointer-events: none; background: transparent;" allowtransparency="true"></iframe>`)}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile">
          <Card>
            <CardHeader>
              <CardTitle>Mobile App Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  For mobile apps (iOS/Android), use a WebView component to display the widget.
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-semibold mb-2">React Native Example</h4>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import { WebView } from 'react-native-webview';

<WebView
  source={{ uri: '${widgetUrl}' }}
  style={{ flex: 1, backgroundColor: 'transparent' }}
/>`}</code>
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Flutter Example</h4>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import 'package:webview_flutter/webview_flutter.dart';

WebView(
  initialUrl: '${widgetUrl}',
  javascriptMode: JavascriptMode.unrestricted,
  backgroundColor: Colors.transparent,
)`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-green-900 mb-2">✅ Quick Setup Checklist</h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center">✓</div>
              Copy the embed code above
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center">✓</div>
              Paste it before &lt;/body&gt; tag in wsevolves.com
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center">✓</div>
              Test the chatbot on your live website
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-200 flex items-center justify-center">✓</div>
              Configure AI settings in the Settings page
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}