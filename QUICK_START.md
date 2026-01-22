# Quick Start Guide - Advanced SupportAI Features

## 🚀 Getting Started in 5 Minutes

### Prerequisites
```bash
# Ensure you have Node.js 14+ and MongoDB
node --version
npm --version
```

### 1. Install Dependencies

```bash
# Backend dependencies
cd server
npm install sentiment natural axios

# Frontend dependencies (should already be installed)
cd ../
npm install
```

### 2. Configure Environment Variables

Add to your `.env` file:

```env
# Google AI
GOOGLE_API_KEY=your-google-api-key

# Slack Integration
SLACK_BOT_TOKEN=xoxb-your-token

# Stripe Integration
STRIPE_API_KEY=sk_live_your-key

# Jira Integration
JIRA_INSTANCE_URL=https://your-domain.atlassian.net
JIRA_API_TOKEN=your-token

# Teams Integration (if needed)
TEAMS_WEBHOOK_URL=your-webhook-url

# Zapier Integration (if needed)
ZAPIER_ACCOUNT_ID=your-account-id
ZAPIER_WEBHOOK_ID=your-webhook-id
```

### 3. Start the Application

```bash
# Terminal 1: Start backend server
cd server
npm run dev

# Terminal 2: Start frontend
npm start
```

---

## 📚 Feature Quick Reference

### Knowledge Base
**Access:** `http://localhost:3000/knowledge-base`

**Quick Actions:**
1. Click "Upload Article" to add articles
2. Use search bar to find content
3. View article history via version tab
4. Auto-create from resolved tickets

**API Test:**
```bash
curl -X GET "http://localhost:3001/api/kb?status=published&limit=10"
```

### Live Chat
**Access:** Chat widget in Tickets page

**Quick Actions:**
1. Open a ticket
2. Start typing a response
3. See AI suggestions appear
4. Click a suggestion to use it
5. Send message

**Features:**
- Real-time sentiment display
- Escalation warnings
- KB article suggestions
- Common phrase templates

### Team Leaderboard
**Access:** `http://localhost:3000/team-leaderboard`

**Quick Actions:**
1. Select time period (daily, weekly, monthly)
2. Choose metric to sort by
3. Click agent name to see details
4. Compare performance between agents

**Available Metrics:**
- Overall Score
- Tickets Resolved
- Customer Satisfaction
- Response Time
- AI Response Acceptance
- KB Contributions

### Integration Hub
**Access:** `http://localhost:3000/integrations`

**Quick Setup:**

#### Slack
1. Create Slack app at api.slack.com
2. Copy Bot Token (xoxb-...)
3. Copy Channel ID
4. Click "Setup" → Fill in credentials → Save
5. Click "Test" to verify

#### Teams
1. Get Webhook URL from Teams
2. Click "Setup" → Paste Webhook URL → Save
3. Click "Test" to verify

#### Stripe
1. Get API key from stripe.com/dashboard
2. Click "Setup" → Paste API key → Save
3. Click "Test" to verify

#### Jira
1. Get instance URL and API token
2. Click "Setup" → Fill in credentials → Save
3. Click "Test" to verify

#### Zapier
1. Create webhook in Zapier app
2. Copy Account ID and Webhook ID
3. Click "Setup" → Fill in details → Save
4. Click "Test" to verify

---

## 🔍 Common Tasks

### Creating a Knowledge Base Article

```bash
# Via API
curl -X POST "http://localhost:3001/api/kb" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "How to Reset Password",
    "content": "Step 1: Click forgot password...",
    "category": "troubleshooting",
    "tags": ["password", "account", "security"],
    "status": "published"
  }'
```

### Searching Knowledge Base

```bash
# Full-text search
curl "http://localhost:3001/api/kb/search/text?q=password&limit=10"

# Semantic search
curl -X POST "http://localhost:3001/api/kb/search/similarity" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I change my password?",
    "limit": 5,
    "threshold": 0.6
  }'
```

### Creating KB Article from Resolved Ticket

```bash
curl -X POST "http://localhost:3001/api/kb-auto-update/TICKET_ID/create-kb" \
  -H "Content-Type: application/json" \
  -d '{"auto_publish": false}'
```

### Starting a Chat Session

```bash
curl -X POST "http://localhost:3001/api/chat/sessions" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "TICKET_ID",
    "agent_id": "AGENT_ID",
    "ai_copilot_enabled": true
  }'
```

### Getting Response Suggestions

```bash
curl -X POST "http://localhost:3001/api/chat/sessions/SESSION_ID/response-suggestions" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Customer is having issues with login",
    "include_kb": true
  }'
```

### Creating Internal Note

```bash
curl -X POST "http://localhost:3001/api/collaboration/tickets/TICKET_ID/notes" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Customer issue resolved with KB article #123. @john helped with troubleshooting.",
    "is_internal": true,
    "generate_summary": true
  }'
```

### Getting Team Leaderboard

```bash
# Get weekly leaderboard by overall score
curl "http://localhost:3001/api/leaderboard?period=weekly&metric=score&limit=10"

# Get monthly leaderboard by tickets resolved
curl "http://localhost:3001/api/leaderboard?period=monthly&metric=tickets_resolved&limit=10"
```

---

## 🔧 Troubleshooting

### Issue: "API key not found" error
**Solution:**
1. Check `.env` file has all required keys
2. Restart backend server after adding keys
3. Verify API key is valid

### Issue: Sentiment analysis not working
**Solution:**
```bash
# Install sentiment module
npm install sentiment
```

### Issue: Chat suggestions empty
**Solution:**
1. Verify GOOGLE_API_KEY is set
2. Check chat session exists
3. Ensure message is long enough (>10 chars)

### Issue: Integration test fails
**Solution:**
1. Verify credentials are correct
2. Check API rate limits
3. Review integration error logs
4. Test with credentials directly

### Issue: KB search returns no results
**Solution:**
1. Verify articles are published
2. Check text search indexed: `db.knowledgebaseitems.getIndexes()`
3. Try semantic search instead
4. Check article has proper content

### Issue: Leaderboard metrics empty
**Solution:**
1. Run `/api/leaderboard/update-all` to recalculate
2. Verify tickets and users exist
3. Check date ranges match expectations
4. Review performance calculation

---

## 📊 Monitoring & Debugging

### View Active Chat Sessions
```bash
curl "http://localhost:3001/api/chat/agent/AGENT_ID/active"
```

### Check Integration Stats
```bash
curl "http://localhost:3001/api/integrations/INTEGRATION_ID/stats"
```

### Get Ticket Timeline
```bash
curl "http://localhost:3001/api/collaboration/tickets/TICKET_ID/timeline"
```

### Monitor Performance Metrics
```bash
curl "http://localhost:3001/api/leaderboard/member/USER_ID?period=weekly"
```

---

## 🎯 Best Practices

### Knowledge Base
- ✅ Publish after review
- ✅ Use relevant tags
- ✅ Keep articles focused
- ✅ Update regularly
- ❌ Don't leave drafts unpublished

### Chat Features
- ✅ Use AI suggestions
- ✅ Add context with KB articles
- ✅ Monitor sentiment changes
- ✅ Escalate when needed
- ❌ Don't ignore escalation warnings

### Team Collaboration
- ✅ Use @mentions for visibility
- ✅ Add internal notes
- ✅ Review timeline regularly
- ✅ Bulk update when possible
- ❌ Don't skip documenting changes

### Integrations
- ✅ Test before using
- ✅ Monitor usage stats
- ✅ Review webhooks regularly
- ✅ Update credentials periodically
- ❌ Don't hardcode API keys

---

## 🚦 API Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (auth token missing) |
| 403 | Forbidden (not authorized) |
| 404 | Not found |
| 500 | Server error |

---

## 💾 Database Optimization

### Recommended Indexes
```javascript
// Knowledge Base
db.knowledgebaseitems.createIndex({ status: 1, category: 1 })
db.knowledgebaseitems.createIndex({ title: "text", content: "text" })

// Chat
db.chatsessions.createIndex({ agent_id: 1, status: 1 })
db.chatsessions.createIndex({ ticket_id: 1 })

// Performance
db.teamperformances.createIndex({ rank: 1, period: 1 })

// Integrations
db.integrations.createIndex({ workspace_id: 1, integration_type: 1 })
```

---

## 📈 Performance Tips

1. **Use pagination** on list endpoints
2. **Cache KB searches** for common queries
3. **Batch integrate** webhook events
4. **Monitor** performance metrics regularly
5. **Archive** old chat sessions
6. **Clean up** test integrations
7. **Optimize** database indexes
8. **Use** async operations

---

## 🔐 Security Reminders

- 🔒 Never commit `.env` files
- 🔒 Rotate API keys regularly
- 🔒 Use HTTPS for all integrations
- 🔒 Validate all user inputs
- 🔒 Keep dependencies updated
- 🔒 Monitor for suspicious activity
- 🔒 Use strong passwords
- 🔒 Enable 2FA where available

---

## 📞 Getting Help

### Documentation
- Read `ADVANCED_FEATURES_GUIDE.md` for details
- Check inline code comments
- Review API examples above

### Testing Integrations
- Use `/test` endpoints
- Check integration stats
- Review error messages
- Validate credentials

### Debugging
- Check browser console
- Review server logs
- Validate database queries
- Test API directly with curl

---

## ✅ Setup Verification Checklist

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can access KB at /knowledge-base
- [ ] Can access leaderboard at /team-leaderboard
- [ ] Can access integrations at /integrations
- [ ] Chat appears in ticket page
- [ ] At least one integration configured
- [ ] Can create KB article
- [ ] Can search KB articles
- [ ] Can create internal notes
- [ ] Sentiment analysis working
- [ ] Team leaderboard displays data

---

**Ready to go!** 🎉

All systems are operational. Start exploring the advanced features and integrations!
