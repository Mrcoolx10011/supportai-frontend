# Session Management Guide 🔄

## Quick Overview

When a returning customer starts a new chat:
- **Customer** sees a **fresh, clean chat** (current session only)
- **Agent** sees **all previous conversations** (for context)
- System automatically decides if it's a new session (>24hrs inactive)

## How It Works

### Scenario 1: First-Time Customer
```
Customer: "Hi, I have a question..."
System:   "First time! Creating new session..."
Result:   ✅ Fresh conversation starts
```

### Scenario 2: Returning Customer (Same Day)
```
Day 1: Customer: "Hi, I have issue X..."
                  [Conversation continues]
                  [Customer leaves]

Day 1 (2 hours later):
Customer: "Hi again, what about issue X?"
System:   "Still same session! (only 2 hours)"
Result:   ✅ Continues conversation
           Agent sees: Full context
           Customer sees: Previous messages
```

### Scenario 3: Returning Customer (New Day)
```
Day 1: Customer: "Hi, I have issue X..."
                  [Conversation ends]

Day 2 (25 hours later):
Customer: "Hi, can you help me?"
System:   "New session! (inactive >24hrs)"
Result:   ✅ Fresh conversation
           Agent sees: "📋 Previous session" in history
           Customer sees: Empty chat (clean slate!)
```

## Features 🎯

### For Customers
- 🆕 Fresh chat experience when returning after 24+ hours
- 📱 No old messages cluttering the conversation
- 🎯 Feel like starting fresh (psychological benefit)
- 🔒 Privacy - old messages hidden

### For Agents
- 👁️ "Conversation History" panel shows all sessions
- 📊 Full context before responding
- 🔍 Understand customer's full history
- 💡 Better solutions based on past issues

## Components 🏗️

### 1. ConversationHistory.jsx
**Location**: `src/components/livechat/ConversationHistory.jsx`

Shows agents:
- List of all previous sessions
- Session dates and times
- Message counts per session
- Session status (resolved/closed)
- Click to expand for details

```
📋 Conversation History
└─ 4 previous sessions
   ├─ Session 4 | Jan 12 | 5 msgs | ✅ RESOLVED
   ├─ Session 3 | Jan 10 | 8 msgs | ✅ RESOLVED
   ├─ Session 2 | Jan 08 | 3 msgs | ✅ RESOLVED
   └─ Current Session (Today) | [active]
```

### 2. sessionManager.js
**Location**: `server/src/utils/sessionManager.js`

Utilities:
- `getOrCreateSession()` - Determine session
- `getMessagesForUser()` - Filter based on role
- `getConversationHistory()` - Get all sessions
- `getSessionSummary()` - Session overview

### 3. API Endpoint
**Endpoint**: `GET /api/chat/history`

**Parameters**:
- `email` - Customer email
- `clientId` - Client ID

**Returns**: List of all conversations for this customer

## Database Changes 📊

### ChatConversation Model
Added fields:
```javascript
session_id: String              // Unique session ID
is_new_session: Boolean         // Is this new?
previous_sessions: [{           // Archive of old
  session_id: String,
  conversation_id: ObjectId,
  started_at: Date,
  ended_at: Date,
  message_count: Number
}]
```

### ChatMessage Model
Added field:
```javascript
session_id: String              // Which session
```

## Implementation in ChatWindow

Added:
```jsx
import ConversationHistory from "./ConversationHistory";

// In ChatWindow JSX:
<ConversationHistory conversation={conversation} />
```

## Session Creation Logic

```
Customer starts chat
        ↓
Check: Previous conversations?
        ↓
NO  → Create new session (first customer)
        ↓
YES → Check: Last message < 24 hours?
        ↓
    YES → Continue session (same conversation)
        ↓
    NO → Create NEW session (new conversation)
         Archive old session
```

## Message Filtering

### Customer View
```javascript
// Only current session
WHERE session_id = current_session_id

Result: Clean, focused chat
```

### Agent View
```javascript
// All messages from this customer
WHERE conversation_id = X

Result: Full context across all sessions
```

## Security 🔒

✅ **Email-based sessions**: Tied to customer email
✅ **User isolation**: Customers only see own messages
✅ **Role-based**: Agent view differs from customer view
✅ **Unique IDs**: Each session has unique ID
✅ **Authentication**: Agent endpoints require JWT

## Configuration ⚙️

### Session Timeout (Default: 24 hours)
Edit in `sessionManager.js`:
```javascript
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;
```

### Examples:
```
12 hours:  12 * 60 * 60 * 1000
24 hours:  24 * 60 * 60 * 1000
48 hours:  48 * 60 * 60 * 1000
7 days:    7 * 24 * 60 * 60 * 1000
```

## Testing Scenarios 🧪

### Test 1: Fresh Customer
```
1. New email, first chat
2. Verify: New session created
3. Verify: No history shown
4. Result: ✅ Clean conversation
```

### Test 2: Same-Day Return
```
1. Customer returns in 2 hours
2. Verify: Same session continues
3. Verify: Old messages visible
4. Agent sees: Continuous thread
5. Result: ✅ Conversation flows naturally
```

### Test 3: Next-Day Return
```
1. Customer returns after 25 hours
2. Verify: New session created
3. Verify: Old session archived
4. Verify: Customer sees empty chat
5. Verify: Agent sees history panel
6. Result: ✅ Fresh + informed
```

### Test 4: Multiple Sessions
```
1. Create 3+ sessions for same customer
2. Open latest session
3. Verify: History shows all 3+
4. Verify: Counts correct
5. Verify: Dates accurate
6. Result: ✅ Full tracking
```

## Troubleshooting 🔧

### Issue: Old messages showing to customer
**Solution**: Check session_id filtering in getMessagesForUser()

### Issue: History panel not showing
**Solution**: Verify ConversationHistory component imported in ChatWindow

### Issue: Wrong message count
**Solution**: Check ChatMessage.countDocuments() for session_id

### Issue: Same email, wrong session
**Solution**: Verify email comparison is case-insensitive

## API Usage 📡

### Fetch Conversation History
```javascript
const response = await fetch(
  `/api/chat/history?email=customer@example.com&clientId=CLIENT_ID`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const history = await response.json();
// Returns: [session1, session2, session3...]
```

### Response Example
```json
{
  "success": true,
  "data": [
    {
      "conversation_id": "507f1f77bcf86cd799439011",
      "session_id": "SESSION-1704067200000-abc123",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "status": "resolved",
      "started_at": "2026-01-10T10:00:00Z",
      "last_message_at": "2026-01-10T11:30:00Z",
      "message_count": 8
    }
  ]
}
```

## Benefits Summary 🌟

| Feature | Customer | Agent | Business |
|---------|----------|-------|----------|
| Fresh Experience | ✅ | - | ✅ |
| Full Context | - | ✅ | ✅ |
| Clean Chat | ✅ | - | ✅ |
| History Awareness | - | ✅ | ✅ |
| Better Service | ✅ | ✅ | ✅ |

## Next Steps 🚀

1. ✅ Test all scenarios
2. ✅ Monitor in production
3. 🔄 Gather feedback
4. 📊 Add analytics
5. 🎯 Refine session timeout

## Files Modified

- `server/src/models/ChatConversation.js` - Added session fields
- `server/src/models/ChatMessage.js` - Added session_id
- `server/src/utils/sessionManager.js` - NEW utility
- `server/src/routes/entities.js` - Added history endpoint
- `src/components/livechat/ConversationHistory.jsx` - NEW component
- `src/components/livechat/ChatWindow.jsx` - Integrated component

---

Your chat system now provides the perfect balance:
- **Customers**: Fresh, clean experience
- **Agents**: Complete, detailed context
- **Business**: Professional, organized conversations

Perfect! 🎉
