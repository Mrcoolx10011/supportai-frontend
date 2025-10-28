# SupportAI Widget Integration Guide

Add an AI-powered customer support chatbot to any website in minutes.

## 🚀 Quick Start

### Method 1: Script Tag (Recommended)
The easiest way to integrate:

```html
<script src="https://your-domain.com/supportai-widget.js" data-client-id="your-client-id"></script>
```

### Method 2: Embed Code
For more control:

```html
<!-- SupportAI Chat Widget -->
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://your-domain.com/ChatWidget?client_id=your-client-id';
    iframe.style.cssText = 'position:fixed!important;bottom:0!important;right:0!important;width:100vw!important;height:100vh!important;border:none!important;z-index:2147483647!important;pointer-events:none!important;background:transparent!important;';
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', '0');
    iframe.id = 'supportai-widget';
    
    iframe.onload = function() {
      iframe.style.pointerEvents = 'auto';
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(iframe);
      });
    } else {
      document.body.appendChild(iframe);
    }
  })();
</script>
```

## 📋 Step-by-Step Integration

### 1. Get Your Client ID
- Log into your SupportAI dashboard
- Go to Integration > Website Integration
- Copy your unique client ID

### 2. Add the Script
Choose one of the methods above and add it to your website:
- **Before closing `</body>` tag** (recommended)
- Or in your website's footer template

### 3. Configure Settings
In your SupportAI dashboard:
- **AI Settings**: Configure your OpenAI/Gemini API key
- **Settings**: Customize widget appearance and behavior
- **Knowledge Base**: Add FAQs for better AI responses

### 4. Test Integration
- Visit your website
- Look for the chat button in the bottom-right corner
- Test a conversation with the AI

## 🎨 Customization Options

### Widget Appearance
```javascript
// Available in your SupportAI dashboard settings:
{
  "primary_color": "#4F46E5",           // Widget color theme
  "chatbot_position": "bottom-right",   // Position on page
  "company_name": "Your Company",       // Display name
  "chatbot_greeting": "Hi! How can I help?", // Welcome message
  "confidence_threshold": 0.7           // AI confidence threshold
}
```

### Advanced Configuration
```html
<script 
  src="https://your-domain.com/supportai-widget.js" 
  data-client-id="your-client-id"
  data-host="https://custom-domain.com"
></script>
```

## 🔌 JavaScript API

Control the widget programmatically:

```javascript
// Widget controls
SupportAI.show();     // Show the widget
SupportAI.hide();     // Hide the widget  
SupportAI.remove();   // Remove completely

// Event listeners
SupportAI.onLoad = function() {
  console.log('Widget loaded successfully!');
};

SupportAI.onEvent = function(eventName, data) {
  console.log('Widget event:', eventName, data);
};

// Send custom messages
SupportAI.sendMessage('custom-event', { key: 'value' });
```

## 📱 Mobile Integration

### React Native
```jsx
import { WebView } from 'react-native-webview';

<WebView
  source={{ uri: 'https://your-domain.com/ChatWidget?client_id=your-client-id' }}
  style={{ flex: 1, backgroundColor: 'transparent' }}
/>
```

### Flutter
```dart
import 'package:webview_flutter/webview_flutter.dart';

WebView(
  initialUrl: 'https://your-domain.com/ChatWidget?client_id=your-client-id',
  javascriptMode: JavascriptMode.unrestricted,
  backgroundColor: Colors.transparent,
)
```

## 🔧 Troubleshooting

### Widget Not Appearing?
1. Check console for JavaScript errors
2. Verify your client ID is correct
3. Ensure script is loaded after `<body>` tag
4. Check if ad blockers are interfering

### Widget Not Responding?
1. Verify your AI API key is configured
2. Check internet connectivity
3. Look for CORS issues in browser console
4. Test with the demo page: `/widget-demo.html`

### Styling Issues?
1. Check for CSS conflicts with your website
2. Verify z-index is high enough (default: 2147483647)
3. Test on different devices and browsers

## 🌟 Best Practices

### Performance
- Load the script asynchronously when possible
- Use the hosted script version for automatic updates
- Test on mobile devices for responsive design

### User Experience
- Configure relevant knowledge base articles
- Set appropriate AI confidence thresholds
- Customize the greeting message for your brand
- Enable agent handoff for complex queries

### Security
- Keep your API keys secure and private
- Use HTTPS for all integrations
- Regularly update your SupportAI installation

## 📊 Analytics & Monitoring

Track widget performance in your dashboard:
- Conversation volume and trends
- AI confidence scores and accuracy
- Customer satisfaction ratings
- Most common questions and topics

## 🆘 Support

Need help with integration?
- Check our documentation
- Test with the demo page
- Contact our support team through the widget itself!

## 🔄 Updates

The widget automatically updates when using the script tag method. For embed code integrations, check for updates periodically.

---

**Ready to get started?** Copy the integration code from your SupportAI dashboard and paste it into your website!