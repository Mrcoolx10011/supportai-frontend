// Unified API Client for SupportAI
// This file consolidates all API calls to the backend server

class SupportAIClient {
  constructor(baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000') {
    this.baseURL = `${baseURL}/api`;
    // Clear any existing token to force fresh authentication
    localStorage.removeItem('auth_token');
    this.token = null;
    this.isInitializing = false;
    this.isReady = false;
    this.requestQueue = [];
    
    // Initialize authentication immediately
    this.initialize();
  }

  // Initialize authentication and process queued requests
  async initialize() {
    if (this.isInitializing) return;
    this.isInitializing = true;
    
    try {
      // If we already have a token, verify it works
      if (this.token) {
        console.log('Verifying existing token...');
        try {
          const response = await fetch(`${this.baseURL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${this.token}` }
          });
          
          if (response.ok) {
            console.log('✅ Existing token is valid');
            this.isReady = true;
            this.processQueuedRequests();
            return;
          }
        } catch (error) {
          console.log('Existing token invalid, will authenticate...');
        }
      }
      
      // Authenticate with demo credentials
      console.log('🔑 Authenticating with test user credentials...');
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          this.setToken(data.token);
          this.isReady = true;
          console.log('✅ Authentication successful');
          this.processQueuedRequests();
          return;
        }
      }
      
      console.error('❌ Authentication failed');
      this.isReady = true; // Mark ready even if failed to prevent hanging
      this.processQueuedRequests();
      
    } catch (error) {
      console.error('❌ Authentication error:', error);
      this.isReady = true; // Mark ready even if failed
      this.processQueuedRequests();
    } finally {
      this.isInitializing = false;
    }
  }

  // Process all queued requests
  processQueuedRequests() {
    console.log(`📤 Processing ${this.requestQueue.length} queued requests...`);
    
    while (this.requestQueue.length > 0) {
      const { resolve, reject, endpoint, options } = this.requestQueue.shift();
      this.executeRequest(endpoint, options)
        .then(resolve)
        .catch(reject);
    }
  }

  // Auto-authenticate with demo credentials (legacy method for compatibility)
  async initializeAuth() {
    return this.initialize();
  }

  // Helper method to make HTTP requests
  async request(endpoint, options = {}) {
    // If not ready yet, queue the request
    if (!this.isReady) {
      console.log(`⏳ Queuing request: ${endpoint}`);
      return new Promise((resolve, reject) => {
        this.requestQueue.push({ resolve, reject, endpoint, options });
      });
    }

    return this.executeRequest(endpoint, options);
  }

  // Execute the actual HTTP request
  async executeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses (like rate limit text responses)
        const text = await response.text();
        data = { error: text || `HTTP ${response.status}` };
      }

      if (!response.ok) {
        // Handle authentication errors by retrying with fresh auth
        if (response.status === 401 || response.status === 403) {
          console.log('🔑 Auth error, attempting to re-authenticate...');
          
          if (!options._retried) {
            // Reset ready state and re-initialize
            this.isReady = false;
            await this.initialize();
            
            // Retry the request once with new token
            return await this.executeRequest(endpoint, { ...options, _retried: true });
          }
        }
        
        // Handle rate limiting with retry-after header
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          const error = new Error(data.error || 'Too many requests');
          error.retryAfter = retryAfter ? parseInt(retryAfter) * 1000 : 5000; // Default 5 seconds
          error.status = 429;
          throw error;
        }
        
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`🚨 API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Authentication methods
  auth = {
    register: async (userData) => {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (response.token) {
        this.setToken(response.token);
      }
      return response;
    },

    login: async (credentials) => {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (response.token) {
        this.setToken(response.token);
      }
      return response;
    },

    logout: async () => {
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } finally {
        this.setToken(null);
      }
    },

    me: async () => {
      const response = await this.request('/auth/me');
      return response.data || response;
    },

    updateMe: async (userData) => {
      const response = await this.request('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      return response.user || response.data;
    },

    changePassword: async (passwords) => {
      return await this.request('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwords),
      });
    },

    isAuthenticated: () => {
      return !!this.token;
    },
  };

  // AI Integration methods
  ai = {
    test: async (prompt, model = 'gemini-2.5-flash') => {
      const response = await this.request('/ai/test', {
        method: 'POST',
        body: JSON.stringify({ prompt, model }),
      });
      return response.data || response;
    },

    testSimple: async (prompt, model = 'gemini-2.5-flash') => {
      const response = await this.request('/ai/test-simple', {
        method: 'POST',
        body: JSON.stringify({ prompt, model }),
      });
      return response.data || response;
    },

    generateResponse: async (customerMessage, context = '', conversationHistory = []) => {
      const response = await this.request('/ai/generate-response', {
        method: 'POST',
        body: JSON.stringify({
          customer_message: customerMessage,
          context,
          conversation_history: conversationHistory,
        }),
      });
      return response.data || response;
    },

    getUsage: async () => {
      const response = await this.request('/ai/usage');
      return response.data || response;
    },
  };

  // Generic entity methods
  createEntityMethods(entityName) {
    const endpoint = `/${entityName.toLowerCase()}`;
    
    return {
      list: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        const response = await this.request(`/entities${url}`);
        // Handle different response formats
        if (response.success && response.data) {
          return response.data;
        }
        return response.data || response;
      },

      get: async (id) => {
        const response = await this.request(`/entities${endpoint}/${id}`);
        return response.data || response;
      },

      create: async (data) => {
        const response = await this.request(`/entities${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        return response.data || response;
      },

      update: async (id, data) => {
        const response = await this.request(`/entities${endpoint}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        return response.data || response;
      },

      delete: async (id) => {
        const response = await this.request(`/entities${endpoint}/${id}`, {
          method: 'DELETE',
        });
        return response;
      },

      filter: async (filters) => {
        return await this.list(filters);
      },

      schema: () => {
        // Return basic schema - could be enhanced to fetch from API
        return {};
      },
    };
  }

  // Entity collections
  entities = {
    Ticket: this.createEntityMethods('Ticket'),
    Client: this.createEntityMethods('Client'),
    ChatConversation: this.createEntityMethods('ChatConversation'),
    ChatMessage: this.createEntityMethods('ChatMessage'),
    KnowledgeBaseItem: this.createEntityMethods('KnowledgeBaseItem'),
    CannedResponse: this.createEntityMethods('CannedResponse'),
    User: this.createEntityMethods('User'),
    TeamMember: this.createEntityMethods('TeamMember'),
    CSATSurvey: this.createEntityMethods('CSATSurvey'),
    ChatAttachment: this.createEntityMethods('ChatAttachment'),
    EmailNotification: this.createEntityMethods('EmailNotification'),
  };

  // Special entity methods
  knowledgeBase = {
    ...this.entities.KnowledgeBaseItem,
    search: async (query, category = null, status = 'published') => {
      const params = { q: query, status };
      if (category) params.category = category;
      
      const queryString = new URLSearchParams(params).toString();
      const response = await this.request(`/entities/knowledgebaseitem/search?${queryString}`);
      return response.data || response;
    },
  };

  // Dashboard and statistics
  dashboard = {
    getStats: async () => {
      const response = await this.request('/entities/stats/dashboard');
      return response.data || response;
    },
  };

  // Integration methods (matching base44 interface)
  integrations = {
    Core: {
      InvokeLLM: async (params) => {
        try {
          console.log('🤖 InvokeLLM called with params:', params);
          
          // Extract message from params
          const customerMessage = params.prompt || params.message || params.customer_message || '';
          const context = params.context || '';
          const conversationHistory = params.conversation_history || [];
          
          if (!customerMessage) {
            throw new Error('No customer message provided');
          }
          
          // Use the proper AI generate-response endpoint
          const response = await this.ai.generateResponse(customerMessage, context, conversationHistory);
          console.log('🤖 AI Response received:', response);
          
          return {
            response: response.response || response,
            confidence: response.confidence || 0.8,
            model_used: response.model || 'gemini-2.5-flash'
          };
        } catch (error) {
          console.error('❌ LLM Integration error:', error);
          // Return error but with proper format
          return { 
            response: `I apologize, but I'm having trouble processing your request right now. ${error.message?.includes('API key') ? 'Please ensure the AI is properly configured.' : 'Please try again or contact a human agent.'}`, 
            confidence: 0.3,
            error: true
          };
        }
      },

      SendEmail: async (params) => {
        const response = await this.request('/integrations/core/send-email', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        return response;
      },

      UploadFile: async (params) => {
        const response = await this.request('/integrations/core/upload-file', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        return response;
      },

      GenerateImage: async (params) => {
        const response = await this.request('/integrations/core/generate-image', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        return response;
      },

      ExtractDataFromUploadedFile: async (params) => {
        const response = await this.request('/integrations/core/extract-data-from-uploaded-file', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        return response;
      },

      CreateFileSignedUrl: async (params) => {
        const response = await this.request('/integrations/core/create-file-signed-url', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        return response;
      },

      UploadPrivateFile: async (params) => {
        const response = await this.request('/integrations/core/upload-private-file', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        return response;
      },
    },
  };

  // Health check
  health = async () => {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'ERROR', error: error.message };
    }
  };
}

// Create and export a singleton instance
const supportAI = new SupportAIClient();

// Also export the class for custom instances
export { SupportAIClient };

// Default export (maintains compatibility with base44 import pattern)
export default supportAI;

// Named export for base44 compatibility
export const base44 = supportAI;