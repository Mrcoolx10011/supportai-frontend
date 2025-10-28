/**
 * SupportAI Widget Loader
 * This script can be hosted on a CDN and included in any website
 * Usage: <script src="https://your-domain.com/supportai-widget.js" data-client-id="your-client-id"></script>
 */

(function() {
  'use strict';
  
  // Configuration
  var config = {
    widgetHost: 'http://localhost:3000', // Change this to your actual domain
    defaultClientId: 'demo-client',
    zIndex: 2147483647
  };

  // Get configuration from script tag
  var scriptTag = document.currentScript || document.querySelector('script[src*="supportai-widget"]');
  var clientId = scriptTag ? (scriptTag.getAttribute('data-client-id') || config.defaultClientId) : config.defaultClientId;
  var customHost = scriptTag ? scriptTag.getAttribute('data-host') : null;
  
  if (customHost) {
    config.widgetHost = customHost;
  }

  // Check if widget is already loaded
  if (window.SupportAI && window.SupportAI.loaded) {
    console.warn('SupportAI widget is already loaded');
    return;
  }

  // Create SupportAI namespace
  window.SupportAI = window.SupportAI || {};
  window.SupportAI.loaded = true;
  window.SupportAI.config = config;

  /**
   * Load the widget iframe
   */
  function loadWidget() {
    // Check if widget already exists
    if (document.getElementById('supportai-widget')) {
      return;
    }

    // Create iframe
    var iframe = document.createElement('iframe');
    iframe.id = 'supportai-widget';
    iframe.src = config.widgetHost + '/ChatWidget?client_id=' + encodeURIComponent(clientId);
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('title', 'SupportAI Chat Widget');
    
    // Styling
    iframe.style.cssText = [
      'position: fixed !important',
      'bottom: 0 !important',
      'right: 0 !important',
      'width: 100vw !important',
      'height: 100vh !important',
      'border: none !important',
      'z-index: ' + config.zIndex + ' !important',
      'pointer-events: none !important',
      'background: transparent !important',
      'max-width: none !important',
      'max-height: none !important'
    ].join('; ');

    // Enable interactions when loaded
    iframe.onload = function() {
      iframe.style.pointerEvents = 'auto';
      
      // Notify parent that widget is loaded
      if (window.SupportAI.onLoad) {
        window.SupportAI.onLoad();
      }
    };

    // Error handling
    iframe.onerror = function() {
      console.error('Failed to load SupportAI widget');
      if (window.SupportAI.onError) {
        window.SupportAI.onError();
      }
    };

    // Add to page
    document.body.appendChild(iframe);

    // Store reference
    window.SupportAI.iframe = iframe;
  }

  /**
   * Handle messages from the widget
   */
  function handleMessages() {
    window.addEventListener('message', function(event) {
      // Verify origin
      if (event.origin !== config.widgetHost) {
        return;
      }

      // Handle different message types
      switch (event.data.type) {
        case 'supportai-resize':
          if (window.SupportAI.iframe) {
            if (event.data.width) {
              window.SupportAI.iframe.style.width = event.data.width;
            }
            if (event.data.height) {
              window.SupportAI.iframe.style.height = event.data.height;
            }
          }
          break;
          
        case 'supportai-event':
          // Forward custom events to host page
          if (window.SupportAI.onEvent) {
            window.SupportAI.onEvent(event.data.eventName, event.data.data);
          }
          break;
      }
    });
  }

  /**
   * Public API
   */
  window.SupportAI.show = function() {
    if (window.SupportAI.iframe) {
      window.SupportAI.iframe.style.display = 'block';
    }
  };

  window.SupportAI.hide = function() {
    if (window.SupportAI.iframe) {
      window.SupportAI.iframe.style.display = 'none';
    }
  };

  window.SupportAI.remove = function() {
    if (window.SupportAI.iframe) {
      window.SupportAI.iframe.remove();
      window.SupportAI.iframe = null;
    }
  };

  window.SupportAI.sendMessage = function(message, data) {
    if (window.SupportAI.iframe && window.SupportAI.iframe.contentWindow) {
      window.SupportAI.iframe.contentWindow.postMessage({
        type: 'supportai-command',
        command: message,
        data: data
      }, config.widgetHost);
    }
  };

  /**
   * Initialize when DOM is ready
   */
  function init() {
    handleMessages();
    loadWidget();
  }

  // Load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM is already loaded
    setTimeout(init, 0);
  }

  // Expose version
  window.SupportAI.version = '1.0.0';
  
})();