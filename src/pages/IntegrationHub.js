import React, { useState, useEffect } from 'react';
import { Plus, Settings, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const IntegrationHub = ({ workspaceId }) => {
  const [integrations, setIntegrations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const availableIntegrations = [
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send notifications to Slack channels',
      icon: '💬',
      color: 'from-slate-500 to-slate-600'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Collaborate with Teams webhooks',
      icon: '👥',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows with Zapier',
      icon: '⚡',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Manage billing and payments',
      icon: '💳',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'jira',
      name: 'Jira',
      description: 'Sync with Jira for dev tickets',
      icon: '🔗',
      color: 'from-blue-500 to-blue-700'
    }
  ];

  useEffect(() => {
    if (workspaceId) {
      fetchIntegrations();
    }
  }, [workspaceId]);

  const fetchIntegrations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/integrations/workspace/${workspaceId}`);
      const data = await response.json();
      setIntegrations(data.integrations || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (integrationId) => {
    try {
      const response = await fetch(`/api/integrations/${integrationId}/test`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        alert('Connection test passed! ✓');
      } else {
        alert('Connection test failed: ' + data.error);
      }
    } catch (error) {
      console.error('Test error:', error);
    }
  };

  const isIntegrationConfigured = (integrationId) => {
    return integrations.some(i => i.integration_type === integrationId && i.is_enabled);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integration Hub</h1>
          <p className="text-gray-600 mt-2">Connect with external platforms</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} />
          New Integration
        </button>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableIntegrations.map((integ) => {
          const configured = isIntegrationConfigured(integ.id);
          return (
            <div
              key={integ.id}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`text-4xl px-4 py-2 rounded-lg bg-gradient-to-r ${integ.color} text-white`}>
                  {integ.icon}
                </div>
                {configured ? (
                  <CheckCircle className="text-green-500" size={24} />
                ) : (
                  <AlertCircle className="text-gray-300" size={24} />
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">{integ.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{integ.description}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedIntegration(integ);
                    setShowConfigModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium"
                >
                  <Settings size={16} />
                  {configured ? 'Edit' : 'Setup'}
                </button>
                {configured && (
                  <button
                    onClick={() => handleTestConnection(integ.id)}
                    className="px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                  >
                    Test
                  </button>
                )}
              </div>

              {configured && (
                <p className="text-xs text-green-600 mt-2">✓ Connected</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Integrations List */}
      {integrations.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Integrations</h2>
          <div className="space-y-3">
            {integrations.map((integ) => (
              <div key={integ._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{integ.name}</p>
                  <p className="text-sm text-gray-500">
                    {integ.integration_type} • Last sync: {new Date(integ.sync_status?.last_sync).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    {integ.usage?.notifications_sent > 0 && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {integ.usage.notifications_sent} notifications
                      </span>
                    )}
                    {integ.usage?.issues_created > 0 && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                        {integ.usage.issues_created} issues
                      </span>
                    )}
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Settings size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && selectedIntegration && (
        <IntegrationConfigModal
          integration={selectedIntegration}
          onClose={() => setShowConfigModal(false)}
          onSave={(config) => {
            console.log('Saving config:', config);
            setShowConfigModal(false);
            fetchIntegrations();
          }}
        />
      )}
    </div>
  );
};

const IntegrationConfigModal = ({ integration, onClose, onSave }) => {
  const [config, setConfig] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const renderConfigFields = () => {
    switch (integration.id) {
      case 'slack':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bot Token</label>
              <input
                type="password"
                placeholder="xoxb-your-token"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => setConfig({ ...config, slack_bot_token: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
              <input
                type="text"
                placeholder="#support-notifications"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => setConfig({ ...config, slack_channel: e.target.value })}
              />
            </div>
          </>
        );
      case 'teams':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
            <input
              type="url"
              placeholder="https://outlook.webhook.office.com/webhookb2/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              onChange={(e) => setConfig({ ...config, teams_webhook_url: e.target.value })}
            />
          </div>
        );
      case 'zapier':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account ID</label>
              <input
                type="text"
                placeholder="Your Zapier Account ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => setConfig({ ...config, zapier_account_id: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook ID</label>
              <input
                type="text"
                placeholder="Your Webhook ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => setConfig({ ...config, zapier_webhook_id: e.target.value })}
              />
            </div>
          </>
        );
      case 'stripe':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <input
              type="password"
              placeholder="sk_live_..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              onChange={(e) => setConfig({ ...config, stripe_api_key: e.target.value })}
            />
          </div>
        );
      case 'jira':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instance URL</label>
              <input
                type="url"
                placeholder="https://your-domain.atlassian.net"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => setConfig({ ...config, jira_instance_url: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Token</label>
              <input
                type="password"
                placeholder="Your API Token"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => setConfig({ ...config, jira_api_token: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Key</label>
              <input
                type="text"
                placeholder="PROJ"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                onChange={(e) => setConfig({ ...config, jira_project_key: e.target.value })}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Configure {integration.name}</h2>

        <div className="space-y-4 mb-6">
          {renderConfigFields()}

          <div className="border-t pt-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm text-gray-700">Send notifications to this integration</span>
            </label>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setIsSaving(true);
              setTimeout(() => {
                onSave(config);
                setIsSaving(false);
              }, 1000);
            }}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;
